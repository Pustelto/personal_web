---
title: How to do a better code review
twitter: ''
tags: []
excerpt: ''
date: 2024-10-30
published: true
---

Do you like code reviews?

Have you ever received a code review that left you scratching your head, wondering if the reviewer even looked at your code? Or worse, have you been on the other side, struggling to provide valuable feedback? You're not alone.

Code reviews are often a pain in the ass.

---

Code reviews are form of a dialog. And asynchronous at the top. Which makes them really difficult. There can easily get some information lost in the process either from the author or the reviewer.

As the reviewer I often miss a lot of context about the changes in the code and description is often very vague and I dread at every Slack notification with request to do a code review. With anticipation of a long, hard-to-review PR without meaningful description. Or if I'm on the other side of the dialog I'm nervouse how some people will resonpond to my code, if they will nitpick on small things or forget to check their ego and flood the review with a bunch of useless comments about their prefered styles of coding.

## TLDR

> Be specific, say what, why and how. Try to help, not show your ego.

## Why are code reviews hard?

## Purpose of the code reviews

If the code reviews are so hard, you might be wondering why to do them in the first place? The code reviews provide few benefits to the team:

- Get a fresh pair of eyes to check the code - because sometimes you are so immersed in the work you might forgot some bad code behind.
- Learn about the code and share knowledge -
- Provide more context about the code

Some might want to add two more points below. But I believe those should be handled by linters, formatter and tests. Not humans.

- Ensure consistency and good patterns
- Fix bugs

<aside>

**NOTE**: I’m not saying code reviews are best way to do that. I have heard about many teams that use pair programming to fill all the boxes and are happy with this approach and not doing code reviews at all. If you are in such team, congratulations. BUT if you do code reviews, you should read on.

</aside>

## Tips for Authors: Preparing for a Smooth Review

As an author, you play a crucial role in facilitating an effective review process. By following these guidelines, you can help reviewers provide valuable feedback and streamline the entire process.

### Create Smaller, Focused PRs

Breaking down your changes into smaller, more manageable pull requests can significantly improve the review process. Smaller PRs are easier to read and understand, increasing the likelihood of a quicker review. Consider using feature flags to merge changes more frequently while keeping new functionality hidden until it's ready for release.

### Provide Detailed Descriptions

A well-crafted PR description is essential for context. Include the what, how, and why of your changes. For example:

> What: Added a new user authentication module
> How: Implemented JWT-based authentication with refresh tokens
> Why: To improve security and allow for more granular access control

This level of detail helps reviewers understand the purpose and impact of your changes quickly.

### Highlight Specific Areas for Feedback

Guide your reviewers by pointing out areas where you'd particularly appreciate their input. For instance:

> I've implemented a new caching mechanism in the UserService class. I'm not entirely sure if this is the most efficient approach. Any suggestions for improvement would be greatly appreciated.

### Be Open to Constructive Criticism

Approach feedback with an open mind. Remember that the goal is to improve the code, not to defend every decision. Be prepared to explain your choices, but also be willing to consider alternative approaches suggested by reviewers.

## Tips for Reviewers: Providing Effective Feedback

As a reviewer, your role is to provide constructive feedback that improves code quality and fosters a positive team environment. Here are some guidelines to help you give more effective reviews:

### Ask Questions for Clarity

If something isn't clear, don't hesitate to ask for clarification. This can lead to valuable discussions and improvements in the code or documentation. For example:

> I'm curious about the choice of using a LinkedList here instead of an ArrayList. Could you explain the reasoning behind this decision?

### Provide Context and Explanations

When suggesting changes, explain the reasoning behind your recommendations. This helps the author understand the "why" and not just the "what". For instance:

> Consider using a more descriptive variable name here, such as 'userAuthenticationToken' instead of 'uat'. Clear naming can significantly improve code readability and make it easier for future developers (including ourselves) to understand the code's intent.

### Balance Criticism with Praise

Acknowledge good practices and clever solutions. This creates a positive atmosphere and encourages the author. For example:

> Great job on implementing this feature! I particularly like how you've handled error cases. The custom exceptions make the error flow very clear. For further improvement, consider adding unit tests for these error scenarios.

### Focus on Code, Not the Coder

Keep your comments focused on the code itself, not the person who wrote it. Instead of saying "You didn't handle this edge case," try "This edge case doesn't seem to be handled. Consider adding a check for..."

### Prioritize Your Feedback

Distinguish between must-fix issues and nice-to-have improvements. This helps the author focus on critical changes first. You can use labels or prefixes to indicate the importance of your comments, such as:

> Critical: This method may cause a null pointer exception under certain conditions.
> Suggestion: Consider using a StringBuilder for better performance in this loop.
> Nitpick: There's an extra space at the end of this line.

By following these guidelines, both authors and reviewers can contribute to a more productive and positive code review process, ultimately leading to better code quality and stronger team collaboration.
