---
title: '4+1 ways how to handle errors in your code'
twitter: ''
tags: ['JS', 'Software engineering']
excerpt: ''
date: 2025-03-23
published: true
---

We've all seen it—code that happily assumes everything will go perfectly. Developers love the "happy path" and often neglect what happens when things go wrong. But reality isn't so kind. Servers crash, APIs fail, developers make mistakes, and users do unexpected things.

In this article, I will walk you through several ways to handle errors in your code.

[[toc]]

## The Consequences of Poor Error Handling

So, why do we still treat error handling as an afterthought? When we ignore proper error handling, the impact is felt everywhere:

- **Terrible UI/UX** – Users have no clue what is happening in the system, what went wrong, or how to fix it.
- **System instability** – With no unified approach to error handling major errors can be silenced and ignored, or tiny issues make the app unusable.
- **Debugging nightmares** – Hunting down silent failures is frustrating and time-consuming.

So, how do developers actually deal with errors? Let's break down the common (and sometimes hilariously bad) approaches. Note: I have seen all these approaches in my career (and I admit I used some of the bad ones too).

## The many ways to handle errors

### 1. Ignoring errors and hoping for the best

> "If I don't see it, it doesn’t exist."

Sure, not all errors are equal.

Some errors, like failed analytics events, are harmless and can be ignored—from the user's perspective. But you should still log them in your error tracking tool. Ignoring critical errors can be catastrophic. Silent failed API calls can lead to users losing data or progress. Generic error messages don’t help users recover, as they don’t know what is happening. They also can’t report the bug properly because they have no extra info.

### 2. Returning weird values

A practice I’ve seen more times than I’d like.

Some developers return `false` or `-1` to indicate failure instead of using proper error-handling. This creates confusion because the caller has no idea what `false` means in that context.

_Is the result `false`?_

_Or did the function fail?_

_If it failed, what went wrong?_

This approach produces a bunch of questions and confusion. If something goes wrong, be explicit. This also makes type-checking a nightmare when success returns structured data and failure returns a random value.

### 3. Throwing errors without proper handling

Ok, so ignoring errors or returning weird values is bad. Let’s just throw an error and move on, right?

Well, not really.

Throwing an error isn’t bad by itself. But without solid error handling in the app, you're just throwing errors randomly. Be careful with that.

Especially if your code will be used by others. IDEs won’t show if a function might throw—they only show the return value (the happy path). Developers can easily miss that it might throw and skip the error handling (unless they know the internal logic).

### Using `try...catch` blocks

Using `try...catch` around code that might fail is a good start. But the question is: **What happens after catching the error?**

Options vary based on context:

- **Rethrow the error** – Useful if a higher-level handler should deal with it. But make sure such a handler exists.
- **Handle it immediately** – Show a friendly message or retry.
- **Return structured error objects** – Helps pass errors along without breaking function contracts.

<aside><strong>Note about Promises:</strong> I'm not giving Promises a standalone section, since they are like <code>try..catch</code>. While more explicit—we know a promise can reject—errors can still be ignored (and they often are).</aside>

Let’s stop at the third point and look deeper. Because we can actually treat errors like—well—not errors. Instead of throwing and spreading panic, we can treat them as normal data. Like returning a string or an object from a function.

### **Treat errors as data**

Throwing is a side effect that breaks function purity. A better approach is **treating errors as data**—acknowledge that something can go wrong and describe it. This ensures functions return something predictable and prevents crashes.

#### Why is it better?

Humans love certainty. We tend to ignore the unknown.

By returning error as a valid value, we force devs to deal with it—or consciously ignore it. Of course, some errors are unpredictable (like server down or out of memory), but most can be caught with handlers in the right spots.

This approach has several pros (and one con, mentioned later):

- Transparency – Others see success and error as possible returns.
- No surprises – No hidden thrown errors.
- Explicit – Clear that the code can fail and how.

It also forces us to think about errors. Not only that the function can fail, but also how. That helps us write better, more robust code.

#### Examples of error-as-data patterns

##### Object-based approach (used by tools like Supabase):

Function always returns an object with optional `error` and `data`. The caller checks for `error` first.

```tsx
function fetchUsers() {
  const { error, data } = await apiClient(`/users/`);

  if (error) {
    handleError(error);
    return;
  }

  return data;
}
```

This works well with TypeScript, which forces us to handle possible errors.

##### Result pattern

Instead of a plain object, return a class—usually called `Result`. It adds some benefits.

- Composition – You can chain functions that return/accept `Result`.
- Safety – You pass the result around safely.
- Helpers – You can use methods like `map`, `unwrap`, etc., without needing to handle the error each time.

```tsx
function readFile(path: string): Result<string, 'invalid path'> {
  if (existsSync(path)) {
    return Result.Ok(readFileSync(path));
  } else {
    return Result.Err('invalid path');
  }
}

const result = readFile('test.txt');
if (result.isOk()) {
  const text = result.value;
} else {
  const err = result.error;
}

// or using helpers
result.map(val => firstLettersToUppercase(val));
```

Some languages have this built-in (like [Rust](https://pustelto.com/blog/my-experience-with-rust/#4.-option-and-result-types)). [Hopefully JavaScript will too](https://github.com/arthurfiorette/proposal-try-operator). Meanwhile, we can use polyfills or libraries like [ts-result-es](https://github.com/lune-climate/ts-results-es#readme).

The downside? More boilerplate. But unless your code is very small, the pros outweigh the cons.

## Conclusion: Think about errors before they happen

Something will go wrong. Maybe not today. Maybe not in your dev environment. But one day it will.

How you handle that defines your system’s robustness.

Don’t push problems up the call stack or pretend they don’t exist. Handle errors intentionally.

When you model errors as data:

- Your code is more predictable.
- Your system is easier to debug.
- Your team shares a clear idea of what failure looks like.

So next time you're choosing how to handle failure, remember: a bit of verbosity beats a silent crash.
