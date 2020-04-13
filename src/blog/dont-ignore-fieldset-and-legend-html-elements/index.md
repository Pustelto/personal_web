---
title: "Don't ignore Fieldset and Legend HTML elements"
twitter: "Fieldset and Legend are very underrated HTML tags. Check out this article from @Pustelto to see why you should use them."
tags: ["Accessibility", "Front-end", "HTML"]
excerpt: "Fieldset and Legend are in my opinion very underrated HTML tags. In this article I will explain you why is it good idea to use them in your forms."
date: 2020-03-23
published: true
---

Creating accessible forms (especially more complex ones) may be difficult. There are many moving parts and different kinds of inputs. And we often have to use JavaScript to make the form accessible for all (check this [great summary from Dave Rupert to see what native HTML inputs are not accessible](https://daverupert.com/2020/02/html-the-inaccessible-parts/)). But on the other hand, there are HTML tags which can help us a lot with structuring our form and make a great deal of work to make it more accessible. There is for example a `<datalist>` element which got [some spotlight recently](https://gomakethings.com/how-to-create-an-autocomplete-input-with-only-html/). Other useful elements are `<fieldset>` and `<legend>`. Today I want to talk about those two.

Maybe you have heard about them, but a quick introduction won't hurt. This is what specification says:

> The `<fieldset>` element represents a set of form controls optionally grouped under a common name.
>
> The name of the group is given by the first `<legend>` element that is a child of the `<fieldset>` element, if any. The remainder of the descendants form the group.

A typical example could be a billing and delivery addresses or a bunch of checkboxes to select your interests. Those inputs create a logical group and for better accessibility, you should enclose the in the fieldset. Legend serves as heading for the fieldset and to make fieldset useful, you have to use it.

## What are they good for?

Now let's have a look at why using `<fieldset>` and `<legend>` is a good idea. Nothing will change for normal users using their sight and mouse to navigate on the screen. But it's a big help for users with a screen reader. The screen reader will announce the fieldset as a group of elements together with its name defined in `<legend>`. This is great as it gives users additional context about the upcoming fields (is it delivery or billing address). Some screen readers (like JAWS) will even read the legend before each input in the group.

You may argue that you can simply add some text before the inputs (like heading) and give the user the same information. That's not entirely true. First, it may confuse the user as there is no clear connection between the group of form elements and the text you provided. Second, some screen readers have a special mode to work with the forms and in this mode, non-form elements may be ignored (so your heading will not work).

Fieldset has one more great benefit. You can simply put the disabled attribute on it and it will disable all the input fields in it. So no extra delivery address? Sure just put one disabled there and you are done. Isn't that great? And by the way, you can use this trick on the `<form>` element itself to disable the entire form.

## Some downsides

As with most things in life, nothing is always perfect.

Not all screen readers will announce the fieldset. Some will ignore it and read only a text contained in a `<legend>` as a normal text. This also depends on the browser as I have found. For example, VoiceOver (native macOS screen reader) will announce the fieldset correctly in Chrome, but not in Firefox.

<aside>It seems this should be addressed in Firefox 76. Mozilla is aware of compatibility issues with Firefox and VoiceOver and is working on them. You can see <a href="https://wiki.mozilla.org/Accessibility/Mac2020#Basic_VoiceOver_Support" rel="noopener">this page for a full overview</a></aside>

Styling of `<fieldset>` and `<legend>` also takes a little bit more effort, than using headings or some text element. But that shouldn't be an excuse for not using them.

## Conclusion

Don't be afraid of fieldset and legend tags. For very little effort, they help you structure your form and give users extra context about the purpose of the form fields. And as front-end developers, we should always aim for a more accessible solution.
