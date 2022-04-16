---
title: 5 easy steps to improve accessibility.
twitter: "5 easy steps to improve accessibility by @pustelto"
twitterCta: "Let me know on Twitter what would you like to learn next about accessibility? Or what do you struggle most with? Looking forward for your answers."
tags: ["Front-end", "Accessibility"]
excerpt: "Accessibility is a broad topic. But getting started doesn't have to be difficult. In this article I will show you five ways how to kick-start your accessibility efforts."
date: 2022-04-16
published: true
---

Want to get better at the accessibility, but you don't know where to start?

You can do a lot for the accessibility of your websites with only a few basic techniques. Below you will find a list of items, which are easy to use, but I see many websites doing mistakes in them.

## TLDR:
1. Use semantic HTML
2. Add meaningful labels to interactive elements and page sections on the page
3. Make focused elements clearly visible
4. Test with keyboard
5. Learn how to use screen readers

*Please not that tips mentioned in this article will help you kickstart your accessibility efforts, but they won't be most likely sufficient to make your website fully compliant with WCAG specification.*

## Why should we care?

The Interner has become an integral part of our lives. We spend a large amount of our time on the internet. This has become especially true during Covid pandemia. Unfortunately, not all people can use the Internet with ease. Some can't use a mouse, others may need a screen reader or even use voice to control their computer. It's our responsibility as developers to build a web that is accessible and useable by all.

With that said, let's get to the business. Here is what you can  do to improve accessibility on your websites:

## 1. Use semantic HTML

One of the easiest things to do when you want to get better with accessibility is to start using semantic HTML. Yes, you can build an entire site with `div` and CSS, but that would mean a terrible user experience for users relying on screen readers.

Using semantic HTML has a few benefits:

1. Properly implemented semantic markup (and labeling, see next section) allows users with a screen reader to easily navigate and find what they need. It helps them understand what kind of content they are consuming. I highly recommend checking this [video how semantic HTML helps screen reader users with navigation](https://www.youtube.com/watch?v=HE2R86EZPMA&list=LL&index=1) or how [people with disabilities use screen readers](https://www.youtube.com/watch?v=OUDV1gqs9GA&t=1764s)
2. Native HTML elements (like buttons) have a lot of functionality baked in. If you use for example div to create interactive elements you will lose all those accessible features already available.

Here is what you can do to boost the semantics of your HTML:

### Build the structure of the page

- Use HTML tags to mark important regions like `main`,`nav`, `header`, `footer`.
- Add correct heading structure - aka don't skip the headings level. `h2` should always follow `h1`, `h3` after `h2` etc. No `h4` after `h2` and similar, pretty please.

I suggest reading  [HTML elements reference on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) to learn about all the elements available in HTML. You might be surprised what elements you discover.

<aside>

<strong>NOTE:</strong> If you want to test your knowledge of HTML elements you may try this [game on the codepen](https://codepen.io/plfstr/full/zYqQeRw)
</aside>

### Use correct interactive elements

Web apps these days are more capable than ever, to make the interactive experience we often have many interactive elements on the page. Buttons, links, inputs, date pickers, select, and so on.

It is important to use those elements for their real purpose. Otherwise, you may confuse users relying on screen readers. For example, don't mix buttons and links. A link should take the user to the new page and change the URL. Use a button for the rest.

If possible, prefer native HTML elements as they usually provide accessibility and other functionalities out-of-the-box ([there are certain native HTML elements for poor accessibility though](https://daverupert.com/2020/02/html-the-inaccessible-parts/)).

I have also covered this topic in more detail in my older article [What every JavaScript developer should know about HTML and CSS](https://pustelto.com/blog/what-every-javascript-developer-should-know-about-html/). So please check it here.

## 2. Label the stuff properly

Good labels are important to all users. They help them navigate the user interface and finish the task successfully. But they are essential for screen reader users.

Without proper labels, the screen reader has nothing to announce to the users, except for the role of the element. Imagine this scenario: You need to press Add to cart button on the e-commerce site, but how can you pick the correct button if all you hear is: "button". And you hear that 24 times.

To avoid this, keep these simple rules in mind:

### Every interactive element must have a proper accessible name

So the screen reader users can understand what the element does. Eg. use a `<label>` element for the form inputs, add a text label to all buttons and links (yes, even [button with only an icon can have a text label](https://www.sarasoueidan.com/blog/accessible-icon-buttons/)).

When you don't have a native HTML element to label something (eg. naming several `<nav>` elements on the page so screen readers can easily jump between them), you can use `aria-labelledby` or `aria-label` attributes.

Adrian Roselli has a great summary of [how to prioritize different labeling techniques](https://twitter.com/aardrian/status/1498357239337426946).

### Labels should be clear and short but have enough information to understand the context.

For example, visually it is ok to have `Add` button next to an item to add it into a cart. But screen reader users may need more information, so it is often a good idea to add extra information to the button visible only for screen readers. When a screen reader move focus to our Add button, it may announce something like this: *Add to cart, A-Wing Lego Star Wars*

Want to learn how to create good labels for link and button checkout these articles: [The perfect link](https://a11y-collective.com/blog/the-perfect-link/) and [Accessible Text Labels For All](https://www.sarasoueidan.com/blog/accessible-text-labels/).

## 3. Make focused elements visible

> Hidding focus outline from users seems like a design fetish. It doesn't help anyone, and I doubt it will improve a design. Rather design a nice and visible focus outline.

Not sure what more to write to this one. Just make the focusable interactive elements visible, please. If you don't like the default outline, design a better one, but don't disable it.

I use keyboard navigation quite often as well. Especially when filling some forms and sometimes I really struggle to see where the hell is my focus.

If you want to learn how to do a great focus outline, I suggest an article about [designing WCAG-compliant focus indicators](https://www.sarasoueidan.com/blog/focus-indicators/) from [Sara Soueidan](https://twitter.com/SaraSoueidan). And [be careful when using `box-shadow` property for outline](https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/). It doesn't play nice with Windows high-contrast mode.

## 4. Test with keyboard

When you are building a new webpage, always try to navigate it using only a keyboard. It is an extremely easy way of testing, but it can show you a lot of potential issues early on. This is also good practice when selecting some UI package for your new web project 😉.

When testing with a keyboard I usually try to check for those use-cases:

* Can I focus and control all interactive elements with a keyboard?
* Is the focused element always visible so the users know where are they?
* Does the focus move correctly for more complex patterns (eg. when I open a modal window, is the focus in the modal or still on the trigger button)?
* Is the tab order logical? Modern layouts built with a grid and a flexbox can change the visual order of the elements in CSS. But tab order is determined by the position in the HTML, not by CSS layout. This may confuse users, so be careful.

## 5. Learn how to use screen readers

So you already test with a keyboard. Great. Now it's time to move to [next level in accessibility testing](https://twitter.com/pustelto/status/1393904239185993728). Learn how to use at least one screen reader and use it to test your pages (and other pages as well).

> Learning how to use a screen reader helped me to be more emphatic with screen reader users. It's shocking how very little information they often have available and how hard it is to use the web.

Using a screen reader opened my eyes. I started to think differently about the labels, alt texts, and accessible names in general. And instead of plain `save` or `delete` I have started to provide much more info into the labels. Or put the labels at places where I wouldn't add them in the past.

Don't know how to use a screen reader?

Check out these [guides from Deque about various screen readers](https://dequeuniversity.com/screenreaders/) and start practicing. It takes some time to be effective with them, but if you are serious about a11y, then this is a must.

## Conclusion

That was quite a lot to digest. Congratulations for getting all the way here. I hope this article will help you to make the Web a little bit better for everyone.

And if you still think there is too much to deal with, don't worry. Start slow and add new stuff when you feel comfortable. Learning accessibility is a never-ending process and we have just barely scratched the surface. We didn't even talk about ARIA attributes and roles, or how JS fits in, and so on.
