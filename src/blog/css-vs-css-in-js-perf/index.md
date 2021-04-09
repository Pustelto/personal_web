---
title: Real-world CSS vs. CSS-in-JS performance comparison
twitter: "If you care about page performance, don't use build-time CSS-in-JS, see why in the article from @pustelto"
tags: ["CSS", "Performance", "Front-end"]
excerpt: "I took the real app and convert it from Styled Components to Linaria to compare the app performance of CSS-in-JS and normal CSS. Continue reading if you want to know how it went."
date: 2021-04-09
published: true
---

*[CRA]: Create React App

CSS-in-JS has taken a solid place in front-end tooling, and it seems this trend will continue in the near future. Especially in the React world. For example, out of 11492 people who participate in [State of CSS](https://2020.stateofcss.com/en-US/) survey in 2020 only 14.3% didn't hear of [Styled Components](https://styled-components.com/) (a dominant CSS-in-JS library). And more than 40% of participants have used the library.

I wanted to see an in-depth performance comparison of CSS-in-JS libraries like Styled Components and a good old CSS for a long time. Sadly I was unable to found a comparison on a real-world project and not some simple test scenario. So I decided to do it myself. I have migrated the real-world app from Styled Components to [Linaria](https://linaria.dev/), which will extract CSS on build time. No runtime generation of the styles on the user's machine.

A short notice, before we begin. I'm not a hater of CSS-in-JS. I admit they have great DX, and the composition model inherited from React is great. It can provide developers with some nice advantages like [Josh W. Comeau](https://twitter.com/joshwcomeau) highlights in his article [The styled-components Happy Path](https://www.joshwcomeau.com/css/styled-components/). I also use Styled Components on several of my projects or projects I have worked on. But I wondered, what is the price for this great DX from the user's point of view.

Let's see what I have found.

## TLDR:

Don't use runtime CSS-in-JS if you care about the load performance of your site. **_Simply less JS = Faster Site._** There isn't much we can do about it. But if you want to see some numbers, continue reading.

## What I measured and how

The app I have used for the test is a pretty standard React app. Bootstrapped using Create React App project, with Redux and styled using Styled components (v5). It is a fairly large app with many screens, customizable dashboards, customer theming, and more. Since it was built with CRA, it doesn't have server-side rendering, so everything is rendered on the client (since it's a B2B app, this wasn't a requirement).

I took this app and replaced the Styled Components with Linaria, which seems to have a similar API. I thought the conversion would be easy. It turned out it wasn't that easy. It took me over two months to migrate it, and even then, I have migrated only a few pages and not the entire app. I guess that's why there is no comparison like this 😅. Replacing the styling library was the only change. Everything else remained intact.

I have used Chrome dev tools to run several tests on the two most used pages. I have always run the tests three times, and the presented numbers are an average of those 3 runs. For all the tests, I have set _CPU throttling to 4x_ and _network throttling to Slow 3G_. I used a separate Chrome profile for performance testing without any extensions.

Run test:

1. Network (size of the JS and CSS assets, coverage, number of requests)
2. Lighthouse audits (performance audit with mobile preset).
3. Performace profiling (tests for page load, one for drag and drop interaction)

## Network comparison

We will start with a network. One of the advantages of CSS-in-JS is that there are no unused styles, right? Well, not exactly. While you have active only the styles used on the page, you may still download unnecessary styles. But instead of having them in a separate CSS file, you have them in your JS bundle.

Here is a data comparison of the same home page build with Styled Components and Linaria. Size before the slash is gzipped size, uncompressed size is after it.

<table>
  <caption>Home page network stats comparison</caption> <thead> <tr> <th style="text-align:left"></th> <th style="text-align:right">Styled Component</th> <th style="text-align:right">Linaria</th> </tr> </thead> <tbody> <tr> <td style="text-align:left">Total number of requests</td> <td style="text-align:right">11</td> <td style="text-align:right">13</td> </tr> <tr> <td style="text-align:left">Total size</td> <td style="text-align:right">361kB/1.8MB</td> <td style="text-align:right">356kB/1.8MB</td> </tr> <tr> <td style="text-align:left">CSS size</td> <td style="text-align:right">2.3kB/7.2kB</td> <td style="text-align:right">14.7kB/71.5kB</td> </tr> <tr> <td style="text-align:left">No. of CSS requests</td> <td style="text-align:right">1</td> <td style="text-align:right">3</td> </tr> <tr> <td style="text-align:left">JS size</td> <td style="text-align:right">322kB/1.8MB</td> <td style="text-align:right">305kB/1.7MB</td> </tr> <tr> <td style="text-align:left">No. of JS requests</td> <td style="text-align:right">6</td> <td style="text-align:right">6</td> </tr> </tbody>
</table>

<table><caption>Search page network stats comparison</caption><thead> <tr> <th style="text-align:left"></th> <th style="text-align:right">Styled Component</th> <th style="text-align:right">Linaria</th> </tr> </thead> <tbody> <tr> <td style="text-align:left">Total number of requests</td> <td style="text-align:right">10</td> <td style="text-align:right">12</td> </tr> <tr> <td style="text-align:left">Total size</td> <td style="text-align:right">395kB/1.9MB</td> <td style="text-align:right">391kB/1.9MB</td> </tr> <tr> <td style="text-align:left">CSS size</td> <td style="text-align:right">2.3kB/7.2kB</td> <td style="text-align:right">16.0kB/70.0kB</td> </tr> <tr> <td style="text-align:left">No. of CSS requests</td> <td style="text-align:right">1</td> <td style="text-align:right">3</td> </tr> <tr> <td style="text-align:left">JS size</td> <td style="text-align:right">363kB/1.9MB</td> <td style="text-align:right">345kB/1.8MB</td> </tr> <tr> <td style="text-align:left">No. of JS requests</td> <td style="text-align:right">6</td> <td style="text-align:right">6</td> </tr> </tbody> </table>

Even though our CSS payload increased quite a lot, we are still downloading fewer data in total in both test cases (yet the difference is almost neglectable in this case). But what is more important, the sum of CSS and JS for Linaria is still smaller than the size of the JS itself in Styled Component.

### Coverage

If we compare coverage, we get a lot of unused CSS for Linaria (around 55kB) compared with 6kB for Styled Component (this CSS is from npm package, not from the Styled Components itself). The size of the unused JS is 20kB smaller for Linaria compared to Styled Component. But the overall size of the unused assets is larger in Linaria. This is one of the trade-offs of external CSS.

<table><caption>Coverage comparison &ndash; Home page</caption><thead> <tr> <th style="text-align:left"></th> <th style="text-align:right">Styled Component</th> <th style="text-align:right">Linaria</th> </tr> </thead> <tbody> <tr> <td style="text-align:left">Size of unused CSS</td> <td style="text-align:right">6.5kB</td> <td style="text-align:right">55.6kB</td> </tr> <tr> <td style="text-align:left">Size of unused JS</td> <td style="text-align:right">932kB</td> <td style="text-align:right">915kB</td> </tr> <tr> <td style="text-align:left">Total size</td> <td style="text-align:right">938.5k</td> <td style="text-align:right">970.6kB</td> </tr> </tbody> </table>

<table><caption>Coverage comparison &ndash; Search page</caption><thead> <tr> <th style="text-align:left"></th> <th style="text-align:right">Styled Component</th> <th style="text-align:right">Linaria</th> </tr> </thead> <tbody> <tr> <td style="text-align:left">Size of unused CSS</td> <td style="text-align:right">6.3kB</td> <td style="text-align:right">52.9kB</td> </tr> <tr> <td style="text-align:left">Size of unused JS</td> <td style="text-align:right">937kB</td> <td style="text-align:right">912kB</td> </tr> <tr> <td style="text-align:left">Total size</td> <td style="text-align:right">938.5k</td> <td style="text-align:right">970.6kB</td> </tr> </tbody> </table>

## Lighthouse performance audit

If we are talking about performance, it would be a shame not to use Lighthouse. You can see the comparisons in the charts below (average from 3 LI runs.). Aside from Web Vitals, I have also include Main thread work (time to parse, compile and execute assets, the biggest part of this is JS, but it covers layout and styles calculation, painting, etc.) and JS Execution time. I have omitted Cumulative Layout Shift since it was close to zero, and there was almost no difference between Linaria and Styled Component.

{% image "home_comparison.png", "Lighthouse performance audit comparison of home page. Linaria has better speed index and larges contentful paint by more that 800 milliseconds. And main thread work is is lower by 1.63 seconds." %}

{% image "search_comparison.png", "Lighthouse performance audit comparison of search page. Linaria has better speed index by 900 milliseconds and larges contentful paint by 1.2 seconds. Main thread work is is lower by 1.27 seconds." %}

As you can see, Linaria is better in most of the Web Vitals (lost once in CLS). And sometimes by a large margin. For example, LCP is faster by 870ms on the home page and by 1.2s on the Search page. Not only does the page render with normal CSS much faster, but it requires fewer resources as well. Blocking time and time necessary to execute all the JS are smaller by 300ms and roughly 1.3 seconds respectively.

## Performace profiling

Lighthouse can give you many insights on the performance. But to get into the details, the performance tab in the dev tools is the best bet. In this case, the performance tab confirms the Lighthouse results. You can see the details on the charts below.

{% image "home_profiling_comparison.png", "Profiling comparison of the home page. Rendering and paint are almost identical. But Linaria spend almost 1 second less time on scripting. And have total blocking time smaller by more than 1.5 seconds." %}

{% image "search_profiling_comparison.png", "Profiling comparison of the search page. Rendering and paint are almost identical. But Linaria spend more than 1 second less time on scripting and have total blocking time smaller almost by than 1.5 seconds." %}

Screens build with Styled Component had more long-running tasks. Those tasks also took longer to complete, compared to the Linaria variant.

To give you another look at the data, here is the visual comparison of the performance charts for loading the home page with Styled Component (top) and Linaria (bottom).

{% image "home.jpg", "Comparison of Chrome dev tools performance minimap chart of home page build with Styled Components and Linaria. Pages build with Linaria have a visually smaller amount of long-running task, loading finished earlier and had better FPS." %}

### Comparing user interaction

To compare user interaction as well, not only the page load. I have measured the performance of the drag and drop activity used to assign items into groups. The result summary is below. Even in this case, Linaria beat the runtime CSS-in-JS in several categories.

<div style="overflow: auto;">
  <table><caption>Drag and drop comparison</caption><thead> <tr> <th style="text-align:left"></th> <th style="text-align:right">Styled Component</th> <th style="text-align:right">Linaria</th> <th style="text-align:right">Diff</th> </tr> </thead> <tbody> <tr> <td style="text-align:left">Scripting</td> <td style="text-align:right">2955</td> <td style="text-align:right">2392</td> <td style="text-align:right">-563ms</td> </tr> <tr> <td style="text-align:left">Rendering</td> <td style="text-align:right">3002</td> <td style="text-align:right">2525</td> <td style="text-align:right">-477ms</td> </tr> <tr> <td style="text-align:left">Painting</td> <td style="text-align:right">329</td> <td style="text-align:right">313</td> <td style="text-align:right">-16ms</td> </tr> <tr> <td style="text-align:left">Total Blocking Time</td> <td style="text-align:right">1862.66</td> <td style="text-align:right">994.07</td> <td style="text-align:right">-868ms</td> </tr> </tbody> </table>
</div>

{% image "dnd.jpg", "Comparison of Chrome dev tools performance minimap chart of drag and drop interaction for pages build with Styled Components and Linaria. Linaria shows less long-running tasks and less JS to execute." %}

## Conclusion

That's it. As you can see runtime CSS-in-JS can have a noticeable impact on your webpage. Mainly for low-end devices and regions with a slower internet connection or more expensive data. So maybe we should think better about what and how we use our tooling. Great developer experience shouldn't come at the expense of the user experience.

I believe we (developers) should think more about the impact of the tools we choose for our projects. The next time I will start a new project, I will not use runtime CSS-in-JS anymore. I will either use good old CSS or use some build-time CSS-in-JS alternative to get my styles out of JS bundles.

I think build-time CSS-in-JS libs will be the next big thing in the CSS ecosystem as more and more libs are coming out (the last one being [vanilla-extract](https://github.com/seek-oss/vanilla-extract) from Seek). And big companies are heading this way as well, like Facebook with their [styling lib](https://www.youtube.com/watch?v=9JZHodNR184)).
