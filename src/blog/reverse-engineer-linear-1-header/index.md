---
title: 'Reverse engineering Linear - part 1: Header'
description: "I have used AI to reverse engineered Linear app to learn from top-tier software engineers. I found some interesting patterns on a place I wouldn't expected them - a header."
excerpt: "I have used AI to reverse engineered Linear app to learn from top-tier software engineers. I found some interesting patterns on a place I wouldn't expected them - a header."
twitter: 'Using AI to reverse engineer Linear app to learn from top-tier software engineers. First part of the series showing 3 interesting patterns from a header from @pustelto.'
tags: ['React', 'Linear', 'Front-end', 'Software engineering']
date: 2025-09-07
published: true
---

With the advancement of AI, I've decided to try something different from building. Something that was previously very hard. I threw an AI at production, minified JavaScript code, and reverse engineered it back to readable JSX files and analyzed how it's built.

_The goal_: Learn from top-tier software engineers and share valuable lessons with others.
_Target_: [Linear](https://linear.app/) - software I deeply admire for its engineering and UX quality.

This article is just the first in a series of articles I plan to write about Linear — as what started as a simple investigation turned into a deep rabbit hole.

## Why Header?

There is a lot I want to explore in the Linear codebase. Initially, my plan was to dive into Linear's actions and keyboard navigation. However, while digging into the UI, I&nbsp;realized that even something as ordinary as the header has a few interesting ideas to uncover.

So I have decided to start small and with something easier to digest before we dive into the more complex topics.

## Anatomy of the Header

Let's first have a look at the header and key components, so we know what we are dealing with in the rest of the article.

{% image "linear-header-anatomy.jpg", "Description of main components of header in Linear app: Breadcrumbs, Tabs, Side actions and facets" %}

The header has 4 main parts:

- **Title** - children in React so it can be almost anything, most of the time it contains context-aware breadcrumbs showing the path from top view to the current location.
- **Tabs** - some views can have tabs, which usually contain different custom views, filters, etc. This section will break to next line on smaller screens.
- **Side** - group of components on the right side of the header, usually icon buttons with some quick actions.
- **Subheader** - not always present, usually contains filters.

Some more variants of the header:

{% image "linear-headers.jpg", "Single line header from project detail and header without title from Issues view." %}

## What have I found interesting

### 1. Next level of responsive design

Linear app works and looks great anywhere &mdash; from smartphones to large screens. Most of it is achieved through traditional CSS media queries. Either used directly in CSS or via React hooks (using [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) DOM API in the background).

<iframe
  src="https://player.cloudinary.com/embed/?cloud_name=dtncnogka&public_id=linear-header-video_pszzhf&profile=custom"
  width="1280"
  style="height: auto; width: 100%; aspect-ratio: 2082 / 380; border-radius: 0.3rem; margin-bottom: 1.65rem"
  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
  allowfullscreen
  frameborder="0"
></iframe>

But Linear goes beyond traditional CSS breakpoints.

There is a `ResponsiveSlot` component used in the header (in the _Side_ slot). The purpose of this component is to hide its content based on available space in the wrapping `ResponsiveSlotContainer` component.

It doesn't use breakpoints. Instead, it calculates available space using a system of resize observers and hides the content of the slot based on its priority.

Here is how it works:

- `priority` prop defines how important that slot (its content) is for the app. Lower priority slots are hidden first when there is not enough free space.
- Each slot registers itself via React context to a manager (MobX store) with all necessary info about the slot, see code below.

  ```jsx
  registerSlot(name, priority, ref) {
    const element = ref.current;
    if (!element || manager.slots.get(name)) return;

    // Each slot has a resize observer attached to it.
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const inlineSize = Math.ceil(entry?.borderBoxSize[0]?.inlineSize ?? 0);

      if (inlineSize > 0) {
        const slot = manager.slots.get(name);
        if (slot && slot.width !== inlineSize) {
          runInAction(() => {
            slot.width = inlineSize;
            calculateVisibility(manager);
          });
        }
      }
    });

    resizeObserver.observe(element, { box: "border-box" });

    // Details of the slot are stored in the manager as well for later use
    manager.slots.set(name, {
      name,
      priority,
      ref,
      observer: resizeObserver,
      width: element.offsetWidth,
      visible: true,
    });
    insertSlotByPriority(manager, name, priority);
  }
  ```

- Resize observers are also attached to the containers. There are actually 2 nested containers to detect when the content actually overflows the available space (this is done with a bit of CSS flexbox magic).
- If there is a change in conditions &mdash; resize event detected by observer, change of priority or registering of new slot, etc. &mdash; the manager will recalculate available space. And if needed, starts hiding lower-priority items dynamically (renders `null`), independent of breakpoint or position across all the header elements.
- This avoids rigid media queries (works more like container query) and ensures that essential controls are always visible.

<iframe
  src="https://player.cloudinary.com/embed/?cloud_name=dtncnogka&public_id=linear-responsive-slot-demo_ajsoce&profile=custom"
  width="1280"
  style="height: auto; width: 100%; aspect-ratio: 2340 / 718; border-radius: 0.3rem; margin-bottom: 1.65rem"
  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
  allowfullscreen
  frameborder="0"
></iframe>

[Play with this demo in the CodeSandbox.](https://codesandbox.io/embed/fvsqm7?view=preview&hidenavigation=1)

Over-engineered?

Maybe. But definitely clever and beautiful. It shows Linear's attention to detail and design. Ensuring that relevant stuff is visible and less important goes away if there is not enough room.

Sadly, I found only a few usages across the app in the code. And after careful analysis, I&nbsp;believe those cases are not working due to the CSS setup. There is a missing `min-width: 0` on the top container, which forbids it to shrink below the size of the inner one. Effectively never triggering the hiding.

Not sure if this is a bug or if this is intentional (if someone from Linear reads this, please let me know). So I had to make a few adjustments to make it actually work as it is supposed to in my demo.

Nevertheless, it's a **great example of React composition** on a bigger scale. It works out of the box, you just wrap some component in the header with `ResponsiveSlot` and that's it. No props drilling or complex state management. And since the context is initialized in the Header component, you don't have to deal with extra providers and similar. You just use the `ResponsiveSlot` as any other component.

### 2. Local State with MobX

Linear is using MobX as a state management tool (I will definitely cover state management in some later article). I have seen and even built a bunch of apps with MobX. Most of them had 1 or more large global states that could be consumed anywhere and usually it became quite a mess very soon (and a testing hell).

Remember the registry for `ResponsiveSlot` in the previous section? It is small MobX store. This store is created via a factory function when the Header component renders and is then saved in the React context to make it available to other components.

This has several benefits:

- No state leakage - the store is private and used only in the Header component.
- Small, purpose-specific state - which makes it easy to reason about.
- Still gives you the benefits of MobX - reactive updates only when truly needed, which is great for performance.

This is a clever pattern. It blends the simplicity of local state with MobX's reactivity. In Clipio, I use small state that I inject into the components to avoid usage of global objects. But having it like this directly in React never crossed my mind.

Here is a simplified example:

```jsx
// Factory function to create MobX store with properties and
// methods to change them.
function createResponsiveSlotManager() {
  const manager = {
    names: [],
    slots: new Map(),
    visibility: new Map(),
    isVisible(name) {
      const slot = manager.slots.get(name);
      return slot?.visible;
    },
    // ... other methods
  };

  // Wrap store in MobX
  return makeObservable(manager, {
    names: observable,
    slots: observable.deep,
    visibility: observable,
    updateContainerWidths: action,
    // ... other methods
  });
}

// Define React context provider and inject the store
function ResponsiveSlotProvider({ children }) {
  const responsiveSlotManager = useMemo(() => createResponsiveSlotManager(), []);

  // ... code left out for brevity

  return (
    <ResponsiveSlotContext.Provider value={responsiveSlotManager}>
      {children}
    </ResponsiveSlotContext.Provider>
  );
}
```

### 3. Dynamic hiding of the tabs

Tabs in the header don't look special at first glance, but then the fun starts when you have too many to fit into the view. The tabs that won't fit are hidden and instead a button to open a popover with the complete list of tabs appears.

<iframe
  src="https://player.cloudinary.com/embed/?cloud_name=dtncnogka&public_id=linear-tabs_b4fsmq&profile=custom"
  width="1280"
  style="height: auto; width: 100%; aspect-ratio: 1392 / 397; border-radius: 0.3rem; margin-bottom: 1.65rem"
  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
  allowfullscreen
  frameborder="0"
></iframe>

There are a few details I really like:

- The trigger shows the number of hidden tabs, but if the active tab is one of the hidden ones, it will be visible as a label instead.
- In the popover you can see all tabs and you can easily reorder them using drag and drop (btw Linear uses [DnD kit](https://dndkit.com/) for drag and drop interactions).
- You can also reorder the tabs inline - in such case all tabs will appear and you can drag and drop them in the list.

I have seen and even built dynamic hiding of the list based on available size of the container. Most of the time the solutions weren't perfect and at certain edge cases they broke. But I didn't manage to break it even once in Linear (I really tried). And the solution is very performance-effective as well.

{% figure "tabs_schema.jpg", "At first all tabs fit in, then container shrinks and overflowing tabs have visibility set to hidden. At last a 'more' button is positioned absolutely after last visible item.", "Schema of how the tabs hiding work" %}

- Tabs are hidden using CSS `visibility: hidden` to make the extra tabs invisible, but they are still in the DOM and occupy the exact same spot (overflow is set to hidden).
  - This avoids extra layout flickering that might appear in solutions that really remove the items from the DOM (or use `display: none`).
  - It also makes it easy to enable drag and drop and show entire list for reordering.
- The popover trigger (that **2 more** button) is then absolutely positioned after the last visible item, and its size is taken into the calculations when the app decides if another tab should be hidden or shown.
- The width calculation happens when the active tab or the actual tabs change (and it happens in the `useLayoutEffect` hook). And then when the size of the tabs container changes (using a resize observer for that).

Below is simplified version of the code that calculates which tabs should be hidden and what should be the position and size of the popover trigger button at the end:

```jsx
function calculateTabLayout(containerRef, activeFacetIndex) {
  const container = containerRef.current;
  const containerWidth = container.offsetWidth;
  const moreButtonWidth = TAB_GAP + MORE_BUTTON_WIDTH + NEW_VIEW_BUTTON_WIDTH;

  // Special handling for active tab - ensure it's always visible
  const activeTab = container.children[activeFacetIndex];
  const activeTabWidth = activeTab.offsetWidth + TAB_GAP + DROPDOWN_WIDTH + NEW_VIEW_BUTTON_WIDTH;

  // We pick the smaller of the 2 - available space or active tab width
  const maxActiveWidth = Math.min(activeTabWidth, containerWidth);

  let currentWidth = 0;

  // Iterate over all tabs except the last one (that's why subtracting -2 - for a new view button)
  for (let i = 0, max = container.children.length - 2; i <= max; ++i) {
    const child = container.children[i];
    const isLast = i === container.children.length - 2;

    if (child instanceof HTMLElement) {
      const childWidth = child.offsetWidth;

      // The clever part: dynamically calculate required space
      // Default: reserve space for "more" button
      let requiredSpace = moreButtonWidth;

      if (isLast) {
        // Last tab only needs "new view" button
        requiredSpace = NEW_VIEW_BUTTON_WIDTH;
      } else if (i < activeFacetIndex) {
        // Before active tab: ensure active tab fits
        requiredSpace = maxActiveWidth;
      }

      // Decision point: hide this tab if it won't fit with required space
      if (currentWidth + childWidth + requiredSpace > containerWidth) {
        return {
          hideAfterIndex: i,
          buttonLeft: currentWidth,
          buttonMaxWidth: i <= activeFacetIndex ? maxActiveWidth : moreButtonWidth,
        };
      }

      currentWidth += childWidth + TAB_GAP;
    }
  }

  return { hideAfterIndex: -1 }; // All tabs fit
}
```

## What I have learned

I have picked up a bunch of interesting ideas and inspiration just from the header that I will definitely use in the future (and some I have already used).

1. Dynamic hiding of components based on available space - smart usage of CSS instead of relying too much on JS.
1. An example that a MobX state doesn't always have to be global, but you can encapsulate it in context (which makes testing setup so much easier)
1. Composition is one of the key principles in React and Linear does it really well:
   - Small utility hooks (for measuring element size, checking visibility etc.)
   - Components to drive animations or handle heavy-lifting for menus and actions.
   - But also bigger components that create logical blocks on the page (like header in this article) and are often bound together by small focused React context to carry state (it is used a lot from what I have seen so far).

## Coming next

Digging into Linear's codebase is really fun and a great source of learning. But this is just a beginning so stay tuned for part 2, where I will dig into their context-aware actions and amazing keyboard support.
