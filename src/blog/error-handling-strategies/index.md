---
title: '4+1 ways how to handle errors in your code'
twitter: "Errors will happen in our apps. So let's stop ignoring them and instead be ready to deal with them. Discover 4+1 approaches to error handling that can transform your code from fragile to robust."
tags: ['JS', 'Software engineering']
excerpt: "Errors will happen in our apps. So let's stop ignoring them and instead be ready to deal with them. Discover 4+1 approaches to error handling that can transform your code from fragile to robust."
date: 2025-03-29
published: true
---

We, developers, love the "happy path".

We create a code that happily assumes everything will go perfectly well. But reality isn't so kind. Servers crash, APIs fail, developers make mistakes, and users do unexpected things.

Errors will happen in our apps. So let's stop ignoring them and instead be ready to deal with them. In this article, I will walk you through 4 + 1 ways how to handle errors in your code.

[[toc]]

## The Consequences of Poor Error Handling

We all know errors in the apps are bad. So, why do we still treat error handling as an afterthought? When we ignore proper error handling, the impact is felt everywhere:

- Terrible UI/UX – Users have no clue what is happening in the system, what went wrong, or how to fix it.

- System instability – Critical errors can be silenced and ignored, or tiny issues make the app unusable.

- Debugging nightmares – Hunting down silent failures is frustrating and time-consuming.

So, how can we deal with errors? Let's break down the common (and sometimes bad) approaches to error handling.

## The many ways to handle errors

### 1. Ignoring errors and hoping for the best

{% image "do_error_handling_or_draw.png", "Meme: dev holding a card with text: Do error handling or draw 25. On the second image, the dev has a handful of cards." %}

Sure, not all errors are equal.

Some errors, like failed analytics events, are harmless and can be ignored. But, ignoring critical errors can be catastrophic. Silent failed API calls can lead to users losing data. Generic error messages don’t help users recover, as they don’t know what is happening. They also can’t report the bug properly because they have no extra info.

### 2. Returning weird values

A practice I've seen more times than I’d like.

Some developers return `false` or `-1` to indicate failure instead of using proper error handling. This creates confusion because the caller has no idea what `false` means in that context.

*Is the result `false`?*

*Or did the function fail?*

*If it failed, what went wrong?*

This approach produces a bunch of questions and confusion. If something goes wrong, be explicit. This also makes type-checking a nightmare when success returns structured data and failure returns a random value.

### 3. Throwing errors without proper handling

Ok, so ignoring errors or returning weird values is bad. Let’s just throw an error and move on, right?

Well, not really.

Throwing an error isn’t bad by itself. But without solid error handling in the app, you're just throwing errors randomly. Be careful with that.

Especially if your code is used by others. IDEs won’t show if a function might throw—they only show the return value (the happy path). Developers can miss that the function might throw and skip the error handling (unless they know the internal logic).

### 4. Using `try...catch` blocks

Using `try...catch` around code that might fail is a good start. But the question is: What happens after catching the error?

Options vary based on context:

- Handle it immediately – Show a friendly message to the users, retry a request, etc.

- Rethrow the error – Useful if a higher-level handler should deal with it. But make sure such a handler exists.

- Return structured error objects – Help us pass errors along without breaking function contracts.

<aside><strong>Note about Promises:</strong> I'm not giving Promises a standalone section since they are similar to <code>try...catch</code>. While more explicit, we know a promise can be rejected, errors can still be ignored (and they often are).</aside>

Let’s stop at the last point: Return structured error objects and have a closer look. We can actually treat errors like — well — not errors.

Instead of throwing and spreading panic, we can treat them as normal data. Like returning a string or an object from a function. 

### Bonus: Treat errors as data

Throwing is a side effect that breaks function purity. A better approach is to treat errors as data. Acknowledge that something can go wrong and describe it. This way, a function always returns something predictable and prevents crashes.

#### Why is it better?

Humans love certainty. We tend to ignore the unknown.

By returning an error as a valid value, we force devs to deal with it or consciously ignore it. Of course, some errors are unpredictable (like server down or out of memory), but most can be caught with handlers in the right spots.

This approach has several pros: It's explicit, transparent, and eliminates surprises. Other devs see both success and error as possible return values. It's clear that the code can fail and how.

This helps us write better, more robust code.

Here is an example from my work. I had to handle an API response, nothing fancy, just showing the data or the error state. The problem was that I had to use a different UI for various error states and, in some cases,  make another request. But I had no clue what errors could be returned from the API. I had to manually simulate various conditions to see possible values. And I'm not sure that I have handled all the cases. If the error as a data approach was used, I would see what errors are possible and how to handle them.

#### Examples of error-as-data patterns

##### Object-based approach (eg. used by Supabase):

A function always returns an object with optional `error` and `data` properties. In case of failure, the function populates the `error` property instead of throwing. The caller checks for `error` first.

If there is no error, we can safely use `data`. Otherwise, we handle the error our way.

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

This also works well with TypeScript, which forces us to handle possible errors.

##### Result pattern

Instead of a plain object, we return a class (usually called `Result` or `Either`). It works in a similar fashion as the object-based approach mentioned above. The class has a property that is used to check if the result of the function is an expected value or an error. But since it's a class, it often has extra utility functions baked in.

This pattern has several benefits:

- Composition – You can chain functions that return/accept the `Result` class.

- Safety – You can pass the Result around safely, not needing to worry about errors.

- Helpers – Since the Result is a class, it often comes with various utility helpers. Methods like `map`, `unwrap`, etc. so you can work with the result in a more functional way.

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

// OR using helpers
return result
    .map(val => firstLettersToUppercase(val))
    .map(val => val.replace(' ', '_'));
// If the reading of a file was successful, we can map over the result
// and transform it with the provided function.
// In case of an error, the map will be ignored. We can chain and compose multiple steps
// like this and handle the potential error state only at the end.
```

Some languages have this built-in (like [Rust](https://pustelto.com/blog/my-experience-with-rust/#4.-option-and-result-types)). And [hopefully, JavaScript will have this too one day](https://github.com/arthurfiorette/proposal-try-operator). Meanwhile, we can use polyfills or libraries like [ts-result-es](https://github.com/lune-climate/ts-results-es#readme).

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


