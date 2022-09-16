---
title: How to (not) make a button
twitter: "How to (not) make a button with <div> and JavaScript"
tags: ["HTML", "Accessibility", "Front-end"]
excerpt: "How to properly turn a <code>div</code> into a button, so the result will be accessible and useable by everyone.TLDR: Use a native button."
date: 2022-09-16
published: true
---

Today's web is a very interactive experience, yet we often fail to provide the same experience to everyone.

Complex form widgets, interactive configurators, tables, shop listings, and the list goes on. We should use buttons and links to interact with those components. But often, we just put an `onClick` handler on a div and call it a day.

That leads to a poor experience for some users.

I want to show you how to properly turn a `div` into a button, in case you ever need it. So the result will be accessible and useable by everyone.

<aside>

**DISCLAIMER**: Please don't do this. I'm not suggesting using div (or any other element) instead of a native button. Instead, I urge you to use the button. I only have to use a div instead of a button once in my life. And most likely, even in that one case, I could have solved it differently.

So whatever your use case. You can most likely use a button for the job.

</aside>

## Why would you want to create a custom button?

There may be various reasons for this.

We may have limited control over the markup (eg. when we use 3rd party library). Or there is some specific use case that doesn't seem to be a good fit for a button or a link (and I have seen a lot of them in my career). For example:

- Interactive clickable card with the product info and other controls (add to cart, compare, etc.)
- Nested controls (a button with another button inside)
- Clickable table rows.

While having limited control over markup may be hard to overcome. We can often solve these specific cases with a little bit of effort.

Changing the design may be a valid option in some cases. But often we just need to rethink the markup a little bit. Here are some links for common patterns and how to do them correctly:

- [Cards - Inclusive component](https://inclusive-components.design/cards/)
- [Table with Expando Rows](https://adrianroselli.com/2019/09/table-with-expando-rows.html)
- [Multi-Column Sortable Table Experiment](https://adrianroselli.com/2021/06/multi-column-sortable-table-experiment.html)

But if you think you still have to build a custom button, then read on:

## Building a button from a div

Your first step will most likely be adding an `onClick` handler. So let's start with this:

```javascript
<div onClick={doSomething}>Click me. I'm a fake button</div>
```

Often this is also where it ends.

<aside>

**NOTE**: I use [React](https://reactjs.org/) syntax since I work with React most of the time. First, I think it's readable, and second, JS frameworks like React make it really easy to put events like this into non-interactive elements since you write markup in JS as well.

</aside>

But as soon as you try to use a keyboard to interact with your new button, you will find that you can't select it using the Tab key.

So let's fix that and add a few more properties.

### Keyboard navigation

```javascript
<div tabindex={0} onClick={onClickButtonHandler} onKeyDown={onKeyDownHandler}>
  Click me. I'm a fake button
</div>
```

We have to add a `tabindex` attribute with the value `0`. This will make the button focusable when using a keyboard (an important part of any accessible interface).

Next, we have to assign a `keydown` event listener to our custom button. HTML button can be pressed using Enter and Space keys. So we need to add that behavior as well. The listener callback will look something like this:

```javascript
function onKeyDownHandler(event) {
  if (event.key === "Enter" || event.key === " " /* space */) {
    onClickButtonHandler();
  }
}
```

But in reality, this is not exactly correct behavior. The native button works slightly differently, as Adrian Roselli pointed out in his article [Brief Note on Buttons, Enter, and Space](https://adrianroselli.com/2022/04/brief-note-on-buttons-enter-and-space.html).

Enter triggers the native button on the `keydown` event, but Space triggers the button on the `keyup` event (the press with Space can be canceled). If we want to mimic this behavior we have to update our handlers again:

```javascript
<div
  tabindex={0}
  onClick={onClickButtonHandler}
  onKeyDown={onKeyDownHandler}
  onKeyUp={onKeyUpHandler}
>
  Click me. I'm a fake button
</div>
```

```javascript
function onKeyDownHandler(event) {
  if (event.key === "Enter") {
    onClickButtonHandler();
  }
}

function onKeyUpHandler(event) {
  if (event.key === " " /* space */) {
    onClickButtonHandler();
  }
}
```

<aside>

**NOTE**: all this stuff is handled on the native button via the `onClick` method. So there is no need to pass keyboard event handlers for a button press.

</aside>

### Accessibility improvements

Right now, we have a fake div button that users can click on. And they can control it with a keyboard as well. But we still have to do a few more things to make this button accessible. First, we need to tell screen readers that this is really a button, not a div. We will add the `role="button"` attribute. Without it, screen readers won't announce this as a button to the users.

```javascript
<div
  tabindex={0}
  onClick={onClickButtonHandler}
  onKeyDown={onKeyDownHandler}
  onKeyUp={onKeyUpHandler}
  role="button"
>
  Click me. I'm a fake button
</div>
```

Are we done?

For the basic functionality, yes. But what if you need to disable that button?

For an HTML button, you would just use the `disabled` attribute and the browser would take care of everything (default styles, turn off the interactivity, etc.). But that is not going to work for our fake button.

We have to use the `aria-disabled` attribute. But we also have to handle the styling and also disabling of the event handlers. You might also want to prevent the button to be unfocusable via tab. All this means just more work for us.

### Final result

This is our final code for a button with support for the disabled state:

```javascript
<div
  tabindex={0}
  onClick={onClickButtonHandler}
  onKeyDown={onKeyDownHandler}
  onKeyUp={onKeyUpHandler}
  role="button"
>
  Click me. I'm a fake button
</div>
```

```javascript
function isDisabled(eventTarget) {
  const ariaDisabled = eventTarget.getAttribute("aria-disabled");
  const isDisabled = ariaDisabled === "" || ariaDisabled === "true";

  return isDisabled;
}

function onKeyDownHandler(event) {
  if (event.key === "Enter" && !isDisabled(event.target)) {
    onClickButtonHandler();
  }
}

function onKeyUpHandler(event) {
  if (event.key === " " && !isDisabled(event.target)) {
    onClickButtonHandler();
  }
}
```

Quite a lot of code for a simple component, right? And even if you write all this code you still don't get the full button feature set[^1].

[^1]:
    We created a generic button, but the HTML button has more types. It can submit or reset a HTML form, when nested inside `<form>` tag without any extra JS (aside from handling the submitted data).

    And when we add a `form` attribute on the button to connect it to a form. We can do that even if the button is outside of the `<form>` element.

I hope by this time that you realize that instead of writing all this code yourself, it is much easier to write this code and get all the goodies for free:

```javascript
<button type="button" onClick={onClickButtonHandler}>
  Click me! I'm a real button.
</button>
```

Isn't that much easier?

## Conclusion

While the button seems to be a simple component, which we can easily hack together with the `div` and `onClick` handler, the opposite is true.

I hope you have learned how complex it is to create a good button component and how much time and effort you can save using a native button.

And your users will probably thank you as well.

## Additional resources

Want to learn more? Check out these amazing resources:

- [Brief Note on Buttons, Enter, and Space](https://adrianroselli.com/2022/04/brief-note-on-buttons-enter-and-space.html)
- A three-part series about implementing a button in the React-Aria library:
  - [Building a Button Part 1: Press Events](https://react-spectrum.adobe.com/blog/building-a-button-part-1.html)
  - [Building a Button Part 2: Hover Interactions](https://react-spectrum.adobe.com/blog/building-a-button-part-2.html)
  - [Building a Button Part 3: Keyboard Focus Behavior](https://react-spectrum.adobe.com/blog/building-a-button-part-3.html)
