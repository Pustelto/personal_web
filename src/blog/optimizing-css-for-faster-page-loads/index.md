---
title: "Optimizing CSS for faster page loads"
twitter: "How to optimize your CSS to have faster page load times"
tags: ["Performance", "Front-end", "CSS"]
excerpt: "Learn how CSS affects page load times and how you can improve it by optimizing your CSS build pipeline and the way you load it."
date: 2020-08-02
published: true
---

Not long ago I decided to improve the loading times of my website. It already loads pretty fast, but I knew there was still room for improvement and one of them was CSS loading. I will walk you through the process and show you how you can improve your load times as well.

## Why loading time matters?

Because ***Time is money***. That proverb is especially true for webpage load times. Your page load time has a direct impact on your profit. People are more likely to buy something on a fast e-shop than on the slow one. According to study [Milliseconds make millions](https://www2.deloitte.com/ie/en/pages/consulting/articles/milliseconds-make-millions.html) improvement by 0.1s on mobile site increased conversions by 10.1%  and order value by 1.9% on Travel sites. That can be a lot of money.

So if you want to build a profitable business, you shouldn't underestimate your page load times.

<aside><strong>NOTE:</strong> There is more studies confirming this pattern. I used an example from the study mentioned above because it's the most recent one I could find.</aside>

### How does CSS affect load times

To see how CSS affects the load time of a webpage we first have to know how the browser converts an HTML document into a functional webpage.

First, it has to download an HTML document and parse it to create DOM (Document Object Model). Any time it encounters any external resource (CSS, JS, images, etc.) it will assign it a download priority and initiate its download. Priorities are important because some resources are critical to render a page (eg. main CSS and JS files) while others may be less important (like images or stylesheets for other media types).

<aside>HTTP/1.1 has also a hard limit on the number of connections per one domain (exact number depends on browser). So if you want to download a large number of resources from one domain some of them have to wait in a queue until resources with higher priorities finish downloading. So keep the number of requests small when using HTTP/1.1. HTTP/2 doesn't have this limitation, but not all sites are using HTTP/2 so far.</aside>

In the case of CSS, this priority is usually high because stylesheets are necessary to create CSSOM (CSS Object Model). To render a webpage browser has to construct both DOM and CSSOM. Without those browser will not render any pixels on the screen. The reason for this is that styles define the look of the page and rendering page first without them would be a waste of processing powers and bad user experience. Only when the browser has both DOM and CSSOM available it can create render tree by combining them and start rendering the screen. In short no CSS downloaded, no page rendered.

As you can see CSS has a huge impact on the load time of your webpage. There are two basic areas affecting webpage load time when we talk about CSS:
1) CSS file size and the total amount of CSS on the page (number of files). Too large CSS files will take a longer time to download and thus the entire page will take much more time to render (it has to wait for that big CSS to download first).
1) When and how we initiate and download our CSS. You want to download your styles as soon as possible.

Let's see in detail how we can improve those.

## Limit size of your stylesheet

**TLDR:** Configure your tools correctly to use modern code whenever possible.

If you want to faster load times, making your CSS files smaller is a good idea. These days it's pretty common to use some tool to modify the CSS on build time (either post processor or [PostCSS](https://postcss.org/) and Autoprefixer) to provide fallbacks for older browsers or some other enhancements.

I would suggest checking the result code for unnecessary bloat. Especially if you are using PostCSS with multiple plugins. In my case, I had CSS with generated fallbacks for CSS variables and with prefixes for older flexbox syntax. That may seem like a trivial issue with very little effect, but resulting savings were around 3 kB for small stylesheet like mine. I think that is a great improvement for very little work. And for large CSS it has the potential to have an even bigger impact.

```text
old index.css:  12.5kB (without GZip)
new index.css:   9.2kB (without GZip, ~26.4% smaller)
```

All I had to do was to update a [browserslist](https://github.com/browserslist/browserslist) config which is used by Autoprefixer and other similar tools to target generated code for specific browser versions. I have updated my PostCSS config a bit as well. (I also added the plugin to concatenate media queries together to save some extra space). See the [PostCSS config in the source code](https://github.com/Pustelto/personal_web/blob/master/src/styles/index.11ty.js) and [my browserslist definition](https://github.com/Pustelto/personal_web/blob/master/package.json#L47) if you want to see my exact setup.

## Use critical CSS

So we shrank our CSS file, but we still need to download it. We can speed up the web page load time by reducing network requests. And best network requests are no requests at all. We can inline our styles directly into the HTML to avoid the need for downloading any external stylesheets and thus saving some time.

Of course, including an entire 9kb stylesheet (or large for bigger projects) on every page is not very effective. So we will include only the styles necessary to render the part of the page *above the fold* and lazy-load the rest of the styles. That way we can still leverage browser caching for other pages and make our webpage load faster. Since we include styles that are critical for page rendering this technique is called *Critical CSS*.

{% image "above_the_fold.png", "Above the fold is the content visible right away after page loads. Content not visible without scrolling is below a fold." %}

Luckily you don't have to decide what styles should be included in the HTML. Some tools will do it for you, like [Critical](https://github.com/addyosmani/critical) from Addy Osmani. Please keep in mind this technique is about compromises. You need to find the right balance between what to include and the size of the CSS since this technique will save you one request when loading page but it also makes each page bigger (and thus makes it longer to download). So you want to experiment with this and measure the results to find the best setup for your site.

## Lazy-load stylesheets

Since we use Critical CSS we want to lazy-load our stylesheets to avoid blocking the render of the page. Unless you need to support some old browsers, modern solution these days is using normal link tag you use for stylesheets but with different media type and a little bit of JS. This clever little trick is fully described in the [Filament Group blog post](https://www.filamentgroup.com/lab/load-css-simpler/). Below you can see the snippet for lazy-loading CSS from the post, but I suggest reading the entire thing.

```html
<link rel="stylesheet" href="/path/to/my.css" media="print" onload="this.media='all'">
```

<aside><strong>NOTE:</strong> If you use Critical package from above, it transforms your stylesheet to be lazy loaded like that automatically.</aside>

You may want to include fallback when JS is disabled. That way your styles will load normally and you will avoid unstyled content which would badly affect user experience.

```html
<link rel="stylesheet" href="/path/to/my.css" media="print" onload="this.media='all'">
<noscript>
  <link rel="stylesheet" href="/path/to/my.css" media="screen">
</noscript>
```

In the waterfall diagrams below you can see that page with critical CSS starts rendering right away (violet graph in *Browser main thread* row) and is interactive much sooner compared to the old version where CSS file has to be downloaded first.

{% figure "comparison_projects_old.png", "Page starts rendering after 3.6 seconds and is interactive after 3.8 seconds.", "Waterfall chart for projects page without critical CSS." %}

{% figure "comparison_projects_new.png", "Page starts rendering after 3.2 seconds and is interactive after 3.3 seconds.", "Waterfall chart for projects page with critical CSS." %}

## Use code-splitting for your stylesheets

We have CSS with only properties we need for modern browsers and we use critical CSS and lazy-load the rest. But we can probably decrease our file size a bit more. In Chrome dev tools there is a tool called Coverage which will show you how much of your CSS and JS are used on the current page. Open dev tools and press [[Ctrl]]+[[Shift]]+[[p]] to open a command pallet and type *Coverage*. Select *Show coverage* option to show the panel. Now reload the page.

{% image "coverage_index_old.png", "Coverage report for my home page before any optimizations, over 45% of the CSS is not used on the page." %}

{% image "coverage_projects_old.png", "Coverage report for my projects page before any optimizations, over 53% of the CSS is not used on the page." %}

I had almost 50% of my CSS code unused on the page. When we check another page we get even more -- almost 54% of unused CSS. That's a lot of unnecessary code. And this number can be even bigger on large legacy apps.

When using JS we often use code-splitting to create multiple smaller files (bundles), which we then download when needed instead of fetching one large JS bundle. We can use a similar approach for CSS as well. Let's discuss the options we have.

### Split CSS based on media queries

In this approach, you split your big CSS into smaller stylesheets based on your media queries (PostCSS have plugin for that) and reference those stylesheets in your HTML.

```html
<link rel="stylesheet" href="index.css" media="all" />
<link rel="stylesheet" href="mobile.css" media="(max-width:44.9375rem)" />
<link rel="stylesheet" href="table.css" media="(min-width: 45rem)" />
```

Be aware that this approach doesn't make much sense when using Critical CSS and lazy-loading of the stylesheet. The browser will download all the stylesheets anyway, it will use media attribute to prioritize the downloads. So basically it will download CSS with a high priority for active media query and lazy-load the rest of the stylesheets.

### Page based code-splitting

Another approach is to use have separate CSS for each page. As we have seen above there is a lot of unused styles for different pages. It would be great if we could remove those unused styles and keep only what is necessary for a given page. This is what I choose to do. Sadly I couldn't find any tools which would be able to do this. Take one large CSS file and generate a smaller bundle for each page based on its content.

Sounds fairly simple so I decided to give it a shot and build a node script which can do this kind of thing. It's called [CSS Split](https://github.com/Pustelto/css-split) and it works great for sites built using static site generator (like [Eleventy](https://www.11ty.dev/) which I use for my site). It uses [PurgeCSS](https://purgecss.com) to remove unused styles so it should work on other non-HTML files as well (based on their documentation). I didn't test it for anything else than HTML so when using it this way, be sure to double-check the results.

Using this technique I was able to reduce the file size of requested CSS by almost 50%. Below are some stats after implementing Critical CSS and page based code-splitting:

```text
single index.css for all pages:      9.2kB (without GZip)
CSS file for homepage:               5.4kB (without GZip)
CSS file for projects:               4.4kB (without GZip)
```

{% image "coverage_index_new.png", "Coverage report for my home page after code-splitting, only around 400 bytes are unused." %}

{% image "coverage_projects_new.png", "Coverage report for my projects page after code-splitting, only around 400 bytes are unused." %}

You can see that there are still some unused bytes. That's ok as Coverage doesn't include hover or focus states or queries. It is unlikely that you will ever geet to 0 unused bytes.

### Component based code-splitting

I've got this tip from [Harry Roberts](https://csswizardry.com). We can also split CSS on the component basis and only load progressively CSS for components we use on the page (footer, header, article, etc.). You can read more about this neat trick in [Harry's article](https://csswizardry.com/2018/11/css-and-network-performance/). This technique I'm talking about is described in the last section of the article. But read the entire article, it's full of great info about improving CSS network performance I don't cover here (couldn't write it better anyway).

I still didn't test this technique to see how well it will work compared to my current setup, but it's on my To-do list. So stay tuned for some future article.

## Summary

Even though my site is fairly simple and doesn't have too much room for improvements, by using the techniques mentioned there I was able to speed up the initial load of my webpage and lower the total size of assets. You can use the same process for any web page to improve it's loading performance (probably with better results for larger projects).

Below you can see some final results after the updates. Graphs show what percentage of the page was rendered at what time. Those tests were run on a slow 3G connection, that's why it takes so long to load the page.

{% figure "comparison_homepage.png", "Graph comparing time to fully render homepage before and after optimizations. Homepage loads around 0.2 second faster after optimizations.", "Homepage &ndash; final comparison" %}

{% figure "comparison_projects.png", "Graph comparing time to fully render projects page before and after optimizations. Page loads around 0.5 second faster after optimizations.", "Projects page &ndash; final comparison" %}

{% figure "comparison_blogpost.png", "Graph comparing time to fully render single blog post before and after optimizations. Page loads around 0.6 second faster after optimizations.", "Single article &ndash; final comparison" %}
