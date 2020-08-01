---
title: "What every JavaScript developer should know about HTML and CSS"
twitter: "A list of HTML/CSS tips and concepts every JS developer should know from @pustelto, check it out."
tags: ["Accessibility", "Front-end", "HTML", "CSS"]
excerpt: "A list of a few HTML/CSS tips and concepts I believe every JavaScript front-end developer should know."
date: 2020-02-10
published: true
---

Writing web apps in React or other JS frameworks doesn't mean you don't need to have a solid foundation of HTML and CSS. While you may be fine most of the time with basic knowledge, having more in-depth knowledge will help you create a much more accessible, robust and maintainable code. And in the end, deliver better products to your users.

I have put together several concepts and practices I believe every front-end developer should know (not just JavaScript developers, but I often see the biggest lack of knowledge there).

To avoid the article to be too long, I introduce only the necessary basics in each area and provide links to more resources on the web if you wish to learn more. There are many great articles about each of the topics mentioned here, but I found it useful to have it in one place like this.

So let's get started.

## Use HTML elements with correct semantics

One of the best (and probably easiest) things you can do for accessibility of your web is to use semantic markup. Yet often developers just tend to use `divs` and `spans`. But HTML is more than just that. It stands for _Hyper Text Markup Language_ and the _markup_ word is important. HTML is used to give a structure and meaning to the document. That can hardly be achieved with the bunch of `divs`.

I don't say you should stop using `divs` and `spans`. I use them a lot myself. But they have no semantical meaning. They are just containers to help you style your web page and section the content inside other HTML tags which do have meaning. You have probably heard and used heading elements (`h1`, `h2` and so on), `nav`, `header`, `footer` and `main`. Those are probably the most common semantic elements (added in HTML5). Using these is a good start. But there is much more. Do you know there are elements for abbreviations or keyboard input? Just check [element reference on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) to get the full list with explanations (I strongly suggest to read it).

And why exactly is it important to use semantic markup? As I mentioned at the beginning of this section, accessibility is the main reason. People using screen readers can easily navigate using headings or so-called landmarks (you can think of a landmark as an important part of the web page). Landmark is created by using semantic HTML like `<header>`, `<main>`, `<article>` or `<nav>`. The second reason is that screen readers also announces what landmark is a user on (like _main content_ or _navigation_).

<aside>Another way how to create a landmark is to use <code>role</code> attribute on HTML element eg. <code>&lt;ul role="navigation"></code>. This is useful when creating some more advanced UI components (like menu button with dropdown etc.). But I strongly recommend using existing HTML tags whenever possible.</aside>

Semantic markup provides us with the context of what we are looking at. But it can also help machines (search engines or some reading devices) understand the structure of the document and display it accordingly. I recommend reading this great [article from Bruce Lawson](https://www.brucelawson.co.uk/2018/the-practical-value-of-semantic-html/) about the value of semantic markup.

Here is some advice on how to start with semantic markup:

- Use `h` tags of proper level (don't skip heading levels) to create a correct outline of the document.
- Start using `nav`, `header`, `footer`, `main` and `article`.
- Check other HTML tags to see what else you can use and try to slowly incorporate them into your toolbelt.
- Read more about this topic, for example [article on Smashing Magazine about section vs article](https://www.smashingmagazine.com/2020/01/html5-article-section/) or [article on CSS-tricks about structuring document](https://css-tricks.com/how-to-section-your-html/) (be sure to read the comments in this one as well, there is a lot of good info).

## Learn how to use form elements

Forms are often one of the most complex parts of the web app -- a lot of states and moving parts. For a great UX, it is essential that all these parts work smoothly and as a user expects. Nothing kills a good impression from your web like a form you can't submit with [[Enter]].

### Wrap forms in `<form>` element

It seems obvious, right? But I have seen forms without it. Especially in today's world of JS frameworks, it's easy to create a form-like component without it. But unless it's something simple as a standalone button with some specific functionality (like a toggle for menu) you should always use `<form>` element. Your users will thank you. First, it tells screen readers that this is a form (we already talk about semantic markup). Second, it gives you standard UX behavior out of the box -- submitting the form on pressing [[Enter]], ability to submit or reset form via a button and listen on form submit event to process submission.

### Always use inputs with labels

Inputs have to have a label, it tells the users what the input is for. Not a placeholder or some `<span>` but a `<label>` element. Placeholder is only a visual hint, it disappears once we enter something into the input field and some screen readers can ignore them (for a more detailed explanation why you should use labels instead of placeholder attribute see this [great summary](https://joshuawinn.com/ux-input-placeholders-are-not-labels/) from Joshua Winn). So use `<label>` instead and connect it to the input field with for attribute like this:

```html
<label for="username">Name</label>
<input type="text" id="username" />

<!--
 or nest the input into the label,
 that way id is not required, if you nest only one input :-)
-->
<label>
  <span>Name</span>
  <input type="text" id="surname" />
</label>

<!-- or -->
<label for="address">
  <span>Address</span>
  <input type="text" id="address" />
</label>
```

This way when you click on a label a connected input field will get focus. This is extremely important for radio buttons and checkboxes since `<label>` will increase the touch area of the radio/checkbox and make them easier to select on mobile devices.

If you can't use `<label>` for some reasons you may use [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) or [aria-labelledby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) attributes as an alternative. But native `<label>` element should be always your first candidate.

### Use type attribute on a button element

Since you are using `<form>` element for your forms you want to always set type attribute on your buttons. There are three possible values - `submit`, `reset` and `button`. Submit and reset values are useful only nested in `<form>` element (first submits the form, the second one will clear the input fields in the form). Type `button` is a generic type for all other buttons (menu toggles, showing/closing modals, etc.).

And why should you always specify it? Because button elements without type attribute specified get the type set to `submit` by default. And it can lead to bugs when in the `<form>` element since you can submit a form unintentionally.

## Make things accessible

Accessibility (a11y for short) is hard, especially in single-page applications it can be a daunting task. I struggle with it sometimes as well. But we should still try to make our products as much accessible as possible. While there is a lot to cover in terms of a11y (enough for a separate blog post or more likely a book). Most common issues I encounter often are:

1. sites aren't using correct semantic markup (we already covered that)
1. and they are hard to use without a mouse

There are a few things you can do to mitigate those issues.

### Always provide styles for focused interactive elements

All interactive elements have default browser styles for focus state (usually in the form of outline). Users browsing the web using a keyboard use it to see where they are on the page. Remove it and the user does not see any feedback on his position (what element he can click on). It's like driving in the dark night without lights turned on. You have no idea where you are and what will happen if you turn the wheel.

> Removing focus ring and failing to provide an alternative to the users is the same as driving a car in the dark night without lights turned on. You have no idea where you are and what will happen if you turn the wheel.

If you absolutely have to remove the default one, replace it with another visual hint (based on your design system) when an element is focused. But never remove it entirely.

### Use correct elements for interactions in the app

We are back to semantic HTML. Native interactive elements like buttons and inputs can be controlled by a keyboard and focused out of the box. No JS or special attributes required. If you need a link, use `<a>` not a `<div>` with some javascript dark magic.

Of course, you can make `<div>` to behave and look like a button (even for screen readers). In all my career, I have to do it only once due to some conflicts with drag and drop in React (library did not like a button to be draggable). It was ugly, and it took some time to make it accessible. I would prefer to use the native `<button>` instead.

And one last thing. Use `<a>` tag when navigating to a different page, use `<button>` for everything else. That means no `<a>` tag with JS opening a side menu or `<button>` using JS to navigate to a different page.

### Don't nest buttons and links

How would you like to have an [[Esc]] key placed on top of your [[Enter]]? Your press one and both of them are pressed. That would be super annoying, right? That's exactly what you do when you nest buttons and anchor links into each other. It's not semantically correct and it's confusing for screen reader users. Not to mentioned it can create some weird behavior in the app.

How to do some more complex UI components like a clickable card with additional buttons inside of it? You will have to use a little bit of CSS and absolute positioning or wrap only some part of the component (like heading) into `<a>` tag, not the entire card. For more tips check [this article on CSS-tricks](https://css-tricks.com/breakout-buttons/).

## Box model and sizes

Every element on the web page is a box. You can skew it, make it round, but for a browser, it will always be a box. I have met a few developers who didn't know how exactly is the size and position of these boxes determined. That caused them some issues when they tried to style those elements. I won't go into too much detail there. Plenty of resources about this topic already exist. You may check [the article about the box-model on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model) or [dive into the spec](https://www.w3.org/TR/CSS2/box.html).

I want to go through a few basic things to keep in mind.

### Box-sizing CSS property

Box-sizing property controls how the final size of the HTML element will be calculated. By default it values is `content-box` which means that width and height attributes (and their min and max variants) affect only a content area of the element (blue part in the picture below).

{% image "box-model.png", "Box model schema showing content, paddding, border and margin areas" %}

If you add padding or border to the element, it will increase its size. That may result in the element overflowing from its container and can be a cause of some confusion for people who do not know about this (especially if they use some CSS reset without knowing what it does exactly). To see the difference between `box-sizing` set to `content-box` and `border-box` have a look at the codepen below.

{% codepen 'MWYdRKj', 'Box sizing comparison' %}

To make `width` and `height` properties affect the padding and border of the element as well set value of `box-sizing` to `border-box`. Here is a suggested way of doing this.

```css
/* :root stands for html, but it has higher specificity (same as class) */
:root {
  box-sizing: border-box;
}

/*
 This way it's easier to override the box-sizing if needed
 (children will inherit it from parent)
*/
*,
*:before,
*:after {
  box-sizing: inherit;
}
```

### Inline elements have extra space in between them

Again not very well known <q>feature</q> of CSS - if you have several inline or inline-block elements next to each other, you get small space between them. If you dig deeper you will found out that CSS is not the culprit.

It's because space between inline elements in the code is treated as space (space between words is a good thing most of the time). However, in some cases, it's not what you want. The easiest way of getting rid of it these days is to set `display: flex` on the container. For more detailed info I suggest [this article on CSS tricks](https://css-tricks.com/fighting-the-space-between-inline-block-elements/).

### Margin collapsing

If you already have experience building websites, you have probably encountered this. You work on the page styles, adding margin-bottom to your article heading and then some margin-top to the main image just below it. But the white space between them is not the sum of both margins. It is only the size of the bigger one. That's margin collapsing.

When two vertical margins meet, they will collapse. This happens between sibling elements and sometimes between parent and child (if they aren't separated by border, padding, or if there is no formating context on parent element).

You may play with the codepen below to see how margin collapsing changes with different CSS properties.

{% codepen 'yLypxGr', 'Margin collapsing' %}

For a more detailed explanation, do check the [MDN page about margin collapsing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing).

## Use appropriate sizing units

**TLDR:** Don't use pixels.

CSS offers a variety of different length units. Probably the most well-known unit is a pixel (`px`). My advice is -- don't use it. The main reason is accessibility. You can change the default font size in the browser settings, but if you define font sizes on your web in pixels this will not work. The text will have the same size.

Instead of pixels, it's best practice to use `rem` (rem stand for root em). More precisely, use relative units as much as possible (viewport units, percentage or size elements using flexbox and grid properties) and for fixed sizes (margins, font-size, icons...), use `rem`.

<aside>Under normal circumstances (user did not change the font size settings in the browser) 1rem equals 16px.</aside>

`rem` works similarly to `em` unit except its size is calculated from the font-size of the root element (`<html>`). Unlike with `em`, there isn't a problem with the multiplication of the sizes -- if you nest elements inside each other, font-sizes with `em` units will infer it's size from the parent. See the codepen below for an example (I have shamelessly copied the code from [Codedrops CSS reference](https://tympanus.net/codrops/css_reference/))

{% codepen 'jOEJmgN', 'Em units cascade' %}

If we are talking about font sizes, we have to mention `line-height` property as well. Always define it as a unitless number (eg. 1.5). This way browser will calculate `line-height` as a multiple of the `font-size`. Again this is important for accessibility to ensure enlarged texts are readable. For a detailed explanation of this (and with examples) check [Kathleen McMahon's article](https://www.24a11y.com/2019/pixels-vs-relative-units-in-css-why-its-still-a-big-deal/).

## Stacking context

The stacking context controls how elements on the page are layered on the z-axis. From the user's perspective -- how are they layered and how they overlay each other. Think of modal dialog with semi-transparent overlay covering your entire page.

Sometimes you may encounter an issue where the element with high `z-index` is covered by another element with smaller `z-index` (even though it should be above everything else). This may be confusing for people without the idea of what and how stacking context works.

There isn't usually one but several stacking contexts at the same time. And element with stacking context works like a container for its children with the `z-index` property. `z-index` has an effect only inside of this stacking context, but not outside. Which in practice means that element with `z-index` value of `999` can be cover with another element with `z-index` value `1`. Check the codepen below for a concrete example.

{% codepen 'abzMwvw', 'Stacking context example' %}

What you usually want to do in such a case is to add or update `z-index` on the element which creates stacking context (`header` and `main` in the example codepen). Check [this article on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) if you want to see when exactly is stacking context created.

## CSS specificity

Let's have a look at the code bellow.

```html
<style>
  .red.blue {
    color: magenta;
  }
  p.blue {
    color: blue;
  }
</style>
<p class="red blue">What color do I have?</p>
```

What color will the text have? If you answered magenta, you are correct, and probably know what CSS specificity is. If you guess it incorrectly, or perhaps you are not sure why does it have magenta color and not blue, read on.

Browsers apply styles in the order they appear in the source code. So later styles overwrite styles that appeared early in the document. That's how web browsers decide which styles to use in case of conflicts. This works for duplicate properties in declaration block (this way we can provide fallbacks for older browsers) and for the declaration blocks as well if we have more selectors targeting the same element.

However, with multiple selectors targeting one element, there is another factor in the game and that is CSS specificity. Which brings us back to the example at the beginning of this section. The paragraph will have magenta color because the first selector (`.red.blue`) is more specific than the second selector (`p.blue`). You can think of specificity as the importance of given CSS rule. Bigger specificity means bigger importance and thus such rule overwrite other rules which are less specific.

You can see in the image below how is the specificity calculated.

{% image "specificity.jpg", "Schema showing how CSS specificity is calculated" %}

When you compare the specificity of two selectors, the higher one wins and its rules will be applied. In our case `.red.blue` has specificity _0-2-0_ (we have two classes there) and the `p.blue` has _0-1-1_ (one class and one element selector).

You can also see that id selector beats all other selectors (classes, elements, etc.) and it can be overwritten only by another id selector, inline styles or `!important` flag. To keep your stylesheets maintainable, try to keep specificity as low as possible. Preferably use only classes to style elements and avoid id selectors at all costs. Beating rules with high specificity with even higher specificity will lead to a circle of specificity wars that is hard to broke from without some major refactoring.

Last info you need to know is how inline styles and `!important` work with specificity. Inline styles beat any selector (even id), but they are hard to override because of that. `!important` beats everything and only another property with a `!important` flag can override it. So be extra careful when using it. A good use case for it is in utility classes which do only one single thing and they should take effect no matter what or when overriding some third-party styles.

Again if you want to learn more about it, I suggest articles on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) or [CSS tricks](https://css-tricks.com/specifics-on-css-specificity/).

## Conclusion

And that's it. Congratulations on reading this far, I hope you like it and find it useful. HTML and CSS may seem trivial at first and not worthy of your time. But as you have seen there are few concepts that can help you write better code, be more efficient in it and have the potential to save you or your colleagues a ton of time trying to fix poorly written front-end.

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
<!-- prettier-ignore -->
*[MDN]: Mozilla Developer Network
