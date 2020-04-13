---
title: "Tools & resources I use for front-end development"
twitter: "A list of tools and resources to help you with front-end development"
tags: ["Tooling", "Productivity", "Front-end"]
excerpt: "A list of a tools and resources I use for front-end development to be productive and deliver high quality work."
date: 2020-04-13
published: true
---

*[a11y]: accessibility

Front-end development is quite a complex discipline and you will hardly ever need only a browser and code editor (at least for bigger projects). I have decided to post a list of the tools I use for development. I hope this will help others to find some great tools they can use in their workflow.

## Basic stuff

Those are the tools I use daily and I couldn't literary produce much of my work without them.

- [VS Code](https://code.visualstudio.com) - You need to write your code somewhere. My editor of choice is VS Code from Microsoft. It's free, lightweight (compared to IDEs like WebStorm), has a ton of functionality out of the box and extensions which can give it even more powers.
- Browsers - I use Firefox as my default browser, sometimes switching to Chrome for development. But I have installed other browsers for testing as well.
- [DevDocs](https://devdocs.io) - Web app which aggregates documentation from different projects. It can also work in offline mode. This my go-to page when I need to look for some documentation.
Using it mainly for JS and DOM/Browser related stuff. As I really couldn't find anything similar (easy to search and detailed). You should check it out.
- [Google](https://google.com) - Yes, I google things very often. Bugs, how to do stuff (sometimes pretty basic) or examples and documentations for packages and libraries (if they aren't on DevDocs).
- [MDN](https://developer.mozilla.org/en-US) - Greate resource for any web developer. Part of this site can be accessed via DevDocs mentioned earlier, but some pages are only on MDN.
I use it mainly when I need to check some a11y related stuff as they have there some good articles about the topic.
- [StackOverflow](https://stackoverflow.com) - Usually get there from Google. If you have some problem, you can probably find a solution there.
- [Github](https://github.com) - When I have some issues with a package or just need to know more about it I dig into the source code or issues. You can find here answers to your problems almost as often as on StackOverflow. I'm personally more successful with Github issues if I have problems related to one package (unless it's React or something similar hugely popular). And of course, I use it for version control as well.

## CSS

- [CSS-Tricks](https://caniuse.com) - Aside from their blog where you can find a ton of interesting articles and tips there is also a guide section with in-depth articles about certain HTML/CSS and JS concepts. I usually go there if I need to refresh my Grid knowledge. But other guides are great as well, so definitely worth checking it out.
- [CSS Reference](http://tympanus.net/codrops/css_reference) - If I need to refresh some of my CSS knowledge or use some property I do not know/use very often, this is my go-to resource. It contains an in-depth explanation of every CSS property with clear examples so it's easy to understand and use in your project. Written by excellent [Sara Soudain](https://www.sarasoueidan.com).
- [Can I Use](https://caniuse.com) - A must-have tool if you care about browser support and using cutting edge features responsibly (aka progressive enhancement).

## Performance and optimizations tools

- [SVGOMG](https://jakearchibald.github.io/svgomg) - You will rarely get SVG from designer optimized for the web. In such cases, I will use SVGOMG to optimize and minify the SVG. You would be surprised how much of useless stuff you can get rid of. It's web GUI for [SVGO](https://github.com/svg/svgo), so if you can get the same results from CLI if you want to.
- [Shrinkme.app](https://shrinkme.app) - Web app when I need to quickly optimize images. It supports batch uploads and provides very good results out of the box.
- [Sqoosh](https://squoosh.app) - When I need to squeeze every last drop of performance from images or need to create images in webp format. A lot of options to play with to get the results you need.
You can also resize images and convert them to different formats. It's fairly cutting edge (it was done as a demo of what modern browsers can do by Google Chrome team) so you have to use Chrome or another Chromium-based browser (Opera, Brave, etc.). It didn't work properly in Firefox last time I test it.
- [Icomoon app](https://icomoon.io/app/#/select) - My go-to tool when I need to create a custom icon set. You can choose from existing icons (free or paid) or upload your own. Then you can either use that to generate icon font or SVG icon set (which is a better solution these days).
- [Google Fonts](https://fonts.google.com) - When I want some custom web fonts, this is usually my first stop. I usually download the files I need and self-host it myself (for better performance). What is great is that you can select only encoding you need and avoid downloading unnecessary characters.
**NOTE:** You could select encoding on the old Google Fonts page, but I can't fount it anywhere on their new site. If you know where it is (or if it is there at all), let me know, please.
- [Glyphhanger](https://github.com/filamentgroup/glyphhanger) - Decreasing file size is one of the best ways how to improve the performance of the website. Web fonts often use many glyphs we do not need so I use Glyphhanger for font subsetting.
You can specify Unicode ranges or characters you want in the font and Glyphanger will create a new font file for you with only specified characters. It can also convert `.ttf` files to other formats much more suitable for the web. like `.woff` and `.woff2`. Take a bit of effort to use it right, but I think it's an option worth considering when font performance is an issue.
- [Lighthouse](https://github.com/GoogleChrome/lighthouse) - I test the webpages before releasing them and one of the tools I use most often is Lighthouse audit in Chrome browser. It checks for the most common issues in several areas and gives you score for each area as well as hints on how to improve. It's great as a first check to see if there are any problems I forgot to address during development.
- [Font style matcher](https://meowni.ca/font-style-matcher) - If you want to make font swap less noticeable after your custom fonts are loaded you can use this great tool to match the styles of your default and custom fonts.

## Accessibility

- VoiceOver - default screen reader on macOS. It takes little practice to use it (I found [this article about it](https://webaim.org/articles/voiceover) very useful), but I try to regularly use it in the development process. Thanks to that my usage of aria attributes and screen-reader only text has increased significantly. You would be surprised how very little context and information some ordinary webpage components have for the user depending on a screen reader.
- [a11y guidelines](https://a11yproject.com/patterns) - I usually try to find some existing solution with good a11y but that is not always possible. In that case, if I need to create some interactive component with accessibility in mind, I will go to this page. You can find a detailed explanation of what, why and how. Together with example codes, you can often copy and reuse with a little effort.
- [WAI-ARIA specification](https://www.w3.org/TR/wai-aria-1.1) - I don't ready specifications very often. But when I do, it's usually this one. It contains a lot of valuable information about aria roles and attributes and how to use them. I would say this is mandatory reading for anyone who takes a11y seriously

## Honorable mentions

And last but not least there is a list of other tools I found useful, but not using them that often.

- [Responsive breakpoints generator](https://responsivebreakpoints.com) - Manually creating responsive images with a lot of variants is a pain. This is a great tool to lessen that pain.
- [HTML Arrows](https://www.toptal.com/designers/htmlarrows) - List of special characters together with Unicode code (in different contexts like CSS, JS, plain Unicode) and HTML entity to use them safely on a web. I use it now and then when I want to have good typography.
- [Char reference](https://dev.w3.org/html5/html-author/charref) - Similar to the tool above, but contains less information. It shows mainly HTML entities, so if that is what you need this may be a better option.
- [Typography cheatsheet](https://www.typewolf.com/cheatsheet) - Explains common typography rules and issues. If you want to improve your typesetting on the web, this is a good starting point.
- [Modular scale](https://www.modularscale.com) - When I work on a design I usually pick some modular scale using this tool. It helps you create a harmonical vertical rhythm. To learn more about it I recommend reading [this article on A List Appart](https://alistapart.com/article/more-meaningful-typography/) or this [recording of Tim Brown talk](https://vimeo.com/17079380) from Build Conf 2010.
- [CSS gradient generetor](https://cssgradient.io)
- [Smooth shadow generator](https://brumm.af/shadows) - When you want to have great looking shadows on your web.
- [Bezier curve generator](https://cubic-bezier.com) - Custom timing function for your animation
- [Easing functions](https://easings.net/en) - Library of different easing functions ready to use in your CSS animations and transitions.
- [ngrok](https://ngrok.com) - I use it when I need to show some of my work running on localhost to someone else or if I need to test on different devices. Sometimes using it with Browserstack when their localhost extension refuses to work.
- [sharing buttons](https://sharingbuttons.io) - This is a jewell if you need simple sharing buttons without all the JS and tracking mess around them.
- [Unix timestamp converter](https://dencode.com/en/date)
- [CSS to JS converter](https://css2js.dotenv.dev/) - This may be handy when you work with CSS-in-JS library and need to convert from CSS to JS or vice versa.
- [Browser default styles](https://browserdefaultstyles.com) - List of default styles for common browsers.

## The end

That's it. Those are the tools I used for my work and which help me to be productive and provide high-quality work. I hope you will find some of them useful. If yes please let me know on Twitter. Or if you have some other great suggestions I would love to hear about them as well.
