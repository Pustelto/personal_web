---
title: 'How to do an efficient and valuable code review'
twitter: 'How to make code reviews less painful? Be specific. Always say What, Why, and How. Try to help, not show your ego. Read more:'
tags: [Productivity, 'Soft-skills']
excerpt: "Tips to make code reviews more effective and enjoyable. Learn how to prepare code and give valuable feedback that don't sucks."
date: 2024-12-02
published: true
---

Do you like code reviews? Or do you hate them?

Have you ever received a code review that left you scratching your head, wondering if the reviewer even looked at your code? Or worse, have you been on the other side, struggling to provide valuable feedback? Well, you're not alone.

Code reviews are often a pain in the ass. They are a form of a asynchronous dialog. Which makes them really difficult to nail. Lost information, misunderstanding, unclear intent. All these things can slow down the review and lead to a ping-pong of messages. In this article I will share some tips that help me to do a code reviews, or prepare the merge requests for the review.

> **TLDR:** Be specific. Always say What, Why, and How. Try to help, not show your ego.

## Purpose of the code reviews

If the code reviews are so hard, why to do them in the first place? The code reviews provide few benefits to the team:

- **Get a fresh pair of eyes to check the code** - because sometimes you are so immersed in the work you might leave bad code behind or miss something important.
- **Learn about the code and share knowledge** - other teammates can learn from your code domain knowledge and patterns or help with their knowledge via comments.
- **Provide more context about the code** - especially as a senior you might have extra knowledge relevant to the change and code review is an ideal place to share it.

Some might argue that we are doing code reviews to ensure catch bugs and bad patterns. But I believe those should be handled by linters, formatter and tests. Not humans.

<aside>

**NOTE**: I’m not saying code reviews are best way to do that. I have heard about many teams that use pair programming to fill all the boxes and are happy with this approach and not doing code reviews at all. If you are in such team, congratulations. BUT if you do code reviews, you should read on.

</aside>

## How to prepare code for a smooth review

As an author, you play a crucial role in facilitating an effective review process. By following the tips below, you can help reviewers provide valuable feedback, save a lot of time and streamline the entire process.

### 1. Create smaller, focused PRs

{% image "long_mr_meme.jpg", "Review 10 lines of code: find 10 issues, review 500 lines of code: looks good to me." %}

Breaking down your changes into smaller, more manageable pull requests can significantly improve the review process. Smaller PRs are easier to read and understand, increasing the likelihood of a quicker review. Consider using feature flags to merge changes more frequently while keeping new functionality hidden until it's ready for release.

<aside>

<span aria-hidden="true">🎓&nbsp;</span>**TIP**: I huge boost to my effort making a short merge requests was an article with a great tip about [Git's native feature to enable 'stacked branches'](https://www.codetinkerer.com/2023/10/01/stacked-branches-with-vanilla-git.html) from Michael Kropat. Together with [Lazygit](https://github.com/jesseduffield/lazygit) this is an amazing combo I highly recommend you to try.

</aside>

### 2. Provide good descriptions

Before you open a book, you will always read the summary at the back of the cover.

A well-crafted PR description is just like that. It's essential for the context. You should include the what, how, and why of your changes. The description should be a first guide for the reviewers, that will show them what has changes and what they should focus on.

Of course a great PR description depends on the context of the changes. Are you changing color of a button? Then a one liner is probably enough. Have you spend 2 days hunting down a nasty bug? Then you should probably write an indepth description of the bug, your process and why does the one deleted line fixing it.

<aside>

<span aria-hidden="true">🎓&nbsp;</span>**TIP**: Are you making UI changes? Add screenshots or videos of the changes. This can help reviewers understand the visual impact of your changes and see it without running the code locally. A preview link is helpful too, if you use service that supports it.

</aside>

### 3. Highlight Specific Areas for Feedback

You, as an author, can add comments to the code as well. Use this power.

Otherwise the reviewers might end up nitpicking unimportant things and missing the important parts of the code. Guide your reviewers by pointing out areas where you'd particularly appreciate their input.

Tell them what is important.

**Example:**
_I've implemented a new caching mechanism in the UserService class. However I'm not entirely sure if this is the best way how to do it in our codebase and I don't like it. But I couldn't figure out a better way. Any suggestions for improvement would be greatly appreciated._

## How to provide a good code review

As a reviewer, your role is to provide constructive feedback that improves code quality and fosters a positive team environment. Here are some guidelines to help you give more effective reviews:

### 1. Does my comment bring value?

Before you submit a comment, ask yourself if it adds value to the discussion. If it doesn't, consider whether it's worth mentioning at all. Avoid nitpicking on trivial issues that don't impact the code's functionality or readability, but are solely your personal preference.

I'm asking this question before each comment and trust me, there is a huge amount of those I have never sent. Just because you would solve the problem differently doesn't mean the other solution is wrong.

### 2. Ask Questions for Clarity

If something isn't clear, don't hesitate to ask for clarification. This can lead to valuable discussions and improvements in the code or documentation.

**Example:**
_Why are you binding DOM event to the element using it's reference, instead of using React's native handling? Is there any particular reason?_

### 3. Provide Context and Explanations

When suggesting a change, explain the reasoning behind your recommendations. This helps the author understand the "why" and not just the "what". And don't forget to suggest "how" as well. What I really hate is when someone says "I don't like this." without any explanation or suggestion how to improve it. And I'm guess I'm not the only one.

**Example:**
_This reduce method is too complex and very hard to read. I would suggest to either move it to separate function covered by test, so others can use those tests to better understand the method. Or you can instead use more functional approach and transform it to several atomic steps use combination of `filter` and `flatMap/map` functions._

### 4. Balance Criticism with Praise

{% image "something-positive.png", "Developer trying to say something positive during code review: At least we don't have to obfuscate the code" %}

Acknowledge good practices and clever solutions. Especially if you added a bunch of change requests. This creates a positive atmosphere and encourages the author.

**Example:**
_Great job on implementing this feature! I particularly like how you've handled error cases. The custom exceptions make the error flow very clear._

### 5. Focus on Code, Not the Coder

Keep your comments focused on the code itself, not the person who wrote it. Instead of saying _"You didn't handle this edge case,"_ try _"This edge case doesn't seem to be handled. Consider adding a check for..."_

### 6. Prioritize Your Feedback

Distinguish between must-fix issues and nice-to-have improvements. This helps the author focus on critical changes first. You can use labels or prefixes to indicate the importance of your comments, such as:

- **Critical**: This method may cause a null pointer exception under certain conditions.
- **Suggestion**: Consider using a lazy evaluation for better performance in this function.
- **Nitpick**: `for...of` loop would be probably better in this case instead of `while`.

<aside>

<span aria-hidden="true">🎓&nbsp;</span>**TIP**: Netlify published a nice [article about their approach to code reviews](https://www.netlify.com/blog/2020/03/05/feedback-ladders-how-we-encode-code-reviews-at-netlify/) some time ago. I can highly recommend it as an inspiration.

</aside>

## Conclusion

Code review can sometimes take a lot of time before all the unclear comments are solved. By following guidelines mentioned in this article, you can make the process more efficient, valuable and enjoyable for everyone involved.
