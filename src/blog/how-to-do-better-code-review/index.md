---
title: 'How to do an efficient and valuable code review'
twitter: 'How to make code reviews less painful? Be specific. Always say What, Why, and How. Try to help, not show your ego. Read more:'
tags: [Productivity, 'Soft-skills']
excerpt: "Tips to make code reviews more effective and enjoyable. Learn how to prepare code and give valuable feedback that doesn't suck."
date: 2024-12-02
published: true
---

Do you like code reviews? Or do you hate them?

Have you ever received a code review that left you scratching your head? Have you been wondering if the reviewer even looked at your code? Or worse, have you been on the other side, struggling to provide valuable feedback?

Well, you’re not alone.

Code reviews are often a pain in the ass. They are a form of asynchronous dialog, which makes them really difficult to nail. Lost information, misunderstandings, and unclear intent. All these things can slow down the review and lead to a ping-pong of messages.

In this article, I will share some tips that help me provide code reviews.

> **TLDR:** Be specific. Always say What, Why, and How. Try to help, not show your ego.

## Purpose of the code reviews

If code reviews are so challenging, why bother with them at all? The truth is, that code reviews bring several key benefits to a team:

- **A fresh perspective on the code:** When you're deeply immersed in your work, it's easy to overlook mistakes or miss important details. A second set of eyes can help catch those issues.
- **Knowledge sharing:** Code reviews allow teammates to learn from each other’s domain expertise and coding patterns. Reviewers can also share their insights and suggest improvements.
- **Adding context:** Senior developers, in particular, may have additional context about the change that can be valuable. The code review process is a great opportunity to share that knowledge.

Some might say that code reviews are meant to catch bugs or bad practices. However, I believe these tasks are better handled by tools like linters, formatters, and automated tests — not humans.

<aside>

**NOTE**: That said, I’m not claiming code reviews are the only way to achieve these goals. Many teams use pair programming to address these needs effectively and are perfectly happy without code reviews. If your team operates this way, congratulations! But if you do rely on code reviews, keep reading.

</aside>

## How to prepare code for a smooth review

As an author, you play a crucial role in facilitating an effective review process. By following the tips below, you can help reviewers provide valuable feedback, save a lot of time, and streamline the entire process.

### 1. Create smaller, focused PRs

{% image "long_mr_meme.jpg", "Review 10 lines of code: find 10 issues, review 500 lines of code: looks good to me." %}

Breaking down your changes into smaller pull requests can significantly improve the review process. Smaller PRs are easier to read and understand, increasing the likelihood of a quicker review. Use feature flags to merge changes more frequently while keeping new functionality hidden until it's ready for release.

<aside>

<span aria-hidden="true">🎓&nbsp;</span>**TIP**: A huge boost to my efforts in making short merge requests was an article with a great tip about [Git's native feature to enable 'stacked branches'](https://www.codetinkerer.com/2023/10/01/stacked-branches-with-vanilla-git.html) from Michael Kropat. Together with [Lazygit](https://github.com/jesseduffield/lazygit), this is an amazing combo I highly recommend you try.

</aside>

### 2. Provide good descriptions

Before you open a book, you always read the summary on the back cover.

A well-crafted PR description is just like that. It's essential for context. You should include the what, how, and why of your changes. The description should be the first guide for reviewers, showing them what has changed and what they should focus on.

Of course, a great PR description depends on the context of the changes. Are you changing the color of a button? Then a one-liner is probably enough. Have you spent 2 days hunting down a nasty bug? Then you should probably write an in-depth description of the bug, your process, and why that one line fixed it.

<aside>

<span aria-hidden="true">🎓&nbsp;</span>**TIP**: Are you making UI changes? Add screenshots or videos of the changes. This can help reviewers understand the visual impact of your changes and see them without running the code locally. A preview link is helpful too, if you use a service that supports it.

</aside>

### 3. Highlight Specific Areas for Feedback

You, as an author, can add comments to the code as well. Use this power.

Otherwise, reviewers might end up nitpicking unimportant things and missing the important parts of the code. Guide your reviewers by pointing out areas where you'd particularly appreciate their input.

**Example:**
_I've implemented a new caching mechanism in the UserService class. However, I'm not entirely sure if this is the best way to do it in our codebase, and I don't like it. But I couldn't figure out a better way. Any suggestions for improvement would be greatly appreciated._

## How to provide a good code review

As a reviewer, your role is to provide constructive feedback that improves code quality and fosters a positive team environment. Here are some guidelines to help you give more effective reviews:

### 1. Does my comment bring value?

Before you submit a comment, ask yourself this question: "Does my comment bring any value?".

If it doesn't, consider whether it's worth mentioning at all. Avoid nitpicking on trivial issues that don't impact the code's functionality or readability but are solely your personal preference. I ask this question before each comment and trust me, there is a huge number of comments I have never sent. Just because you would solve the problem differently doesn't mean the other solution is wrong.

### 2. Ask Questions for Clarity

If something isn't clear, don't hesitate to ask for clarification. This can lead to valuable discussions and improvements in the code or documentation.

**Example:**
_Why are you binding DOM events to the element using its reference, instead of using React's native handling? Is there any particular reason?_

### 3. Provide Context and Explanations

When suggesting a change, explain the reasoning behind your recommendations. This helps the author understand the "why" and not just the "what." And don't forget to suggest "how" as well. What I really hate is when someone says "I don't like this" without any explanation or suggestion on how to improve it. And I guess I'm not the only one.

**Example:**
_This reduce method is too complex and very hard to read. I would suggest either moving it to a separate function covered by tests. Or you can instead use a more functional approach and transform it into several atomic steps using a combination of `filter` and `flatMap/map` functions._

### 4. Balance Criticism with Praise

{% image "something-positive.png", "Developer trying to say something positive during code review: At least we don't have to obfuscate the code" %}

Acknowledge good practices and clever solutions, especially if you added a bunch of change requests. This creates a positive atmosphere and encourages the author.

### 5. Focus on code, Not the coder

Keep your comments focused on the code itself, not the person who wrote it. Instead of saying _"You didn't handle this edge case,"_ try _"This edge case doesn't seem to be handled. Consider adding a check for..."_

### 6. Prioritize Your Feedback

Distinguish between must-fix issues and nice-to-have improvements. This helps the author focus on critical changes first. You can use labels or prefixes to indicate the importance of your comments, such as:

- **Critical**: This method may cause a null pointer exception under certain conditions.
- **Suggestion**: Consider using lazy evaluation for better performance in this function.
- **Nitpick**: A `for...of` loop would probably be better in this case instead of `while`.

<aside>

<span aria-hidden="true">🎓&nbsp;</span>**TIP**: Netlify published a nice [article about their approach to code reviews](https://www.netlify.com/blog/2020/03/05/feedback-ladders-how-we-encode-code-reviews-at-netlify/) some time ago. I highly recommend it as inspiration.

</aside>

## Conclusion

Code reviews can sometimes take a lot of time before all unclear comments are resolved. By following the guidelines mentioned in this article, you can make the process more efficient, valuable, and enjoyable for everyone involved.
