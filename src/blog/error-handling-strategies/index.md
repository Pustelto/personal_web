---
title: '4+1 ways how to handle errors in your code'
twitter: ''
tags: ['JS', 'Software engineering']
excerpt: ''
date: 2025-03-23
published: true
---

We've all seen it—code that happily assumes everything will go perfectly. Developers love the "happy path" and often neglect what happens when things go wrong. But reality isn't so kind. Servers crash, APIs fail, us developers do mistake, and users do unexpected things.

In this article, I will walk you through several ways how to handle errors in your code.

[[toc]]

## The Consequences of Poor Error Handling

So, why do we still treat error handling as an afterthought? When we ignore proper error handling, the impact is felt everywhere:

- **Terrible UI/UX** – Users have no clue what what is happening in the system, what went wrong or how to fix it.
- **System instability** – With no unified approach to error handling major errors can be silenced and ignored, or tiny issues make the app unusable.
- **Debugging nightmares** – Hunting down silent failures is frustrating and time-consuming.

So, how do developers actually deal with errors? Let's break down the common (and sometimes hilariously bad) approaches. Note: I have seen all these approach in my career (and I admit I used some of the bad ones as well).

## The many ways how handle errors

### 1. Ignoring Errors and Hoping for the Best

> "If I don't see it, it doesn’t exist." approach.

Sure not all errors are equal.

Some errors, like failed analytics events, are harmless and can be ignored — at least from user perspective, but you should always log it into your error tracking solution. However, ignoring critical errors can be catastrophic. Silent failed API calls can lead to users losing data or progress. Generic error message doesn’t help users to recover, as they don’t know what is really happening. And they even can’t report this bug to you correctly, because they don’t have any extra info.

### 2. Returning weird values

A practice I have seen more times that I would like to.

Some developers return `false` or `-1` to indicate failure instead of using proper error-handling mechanisms. This creates confusion because the consumer of the function has no idea what `false` means in this context.

_Is the result of the function call `false`?_

_Or does it mean the function call failed?_

_If it failed, what went wrong?_

You see, just approach produce a bunch of questions and a lot of confusion. If something goes wrong, be explicit about it. This approach is also making type-checking a nightmare when you return some structured data on success and a random value on failure.

### 3. Throwing errors without proper handling

Ok, so ignoring errors or returning weird values is bad. Let’s just throw an error and move on, right?

Well, not really.

While throwing an error if things go wrong is not bad by itself. Without a solid error handling foundations in the app, you are just throwing errors randomly. So you have to be careful with that.

Especially if you are writing a code that will be consumed or reused by others this is not a good way how to deal with errors. That’s because IDE will not tell you if the function can fail or not, it will just show a return value (happy path). The devs can easily miss that the function might throw an error and ignore the error handling (they need to know the internal implementation).

### 4. Using `try...catch` blocks

Using `try...catch` around code that might fail is a good start, but the difficult question is: **What happens after catching the error?**

We have several options and which one we will use heavily depends on the context:

- **Rethrowing the error** – Useful if a higher-level handler should process it. We need to be sure there is some handler up in the call tree. Otherwise we just throw errors randomly.
- **Handling it immediately** – Show a user-friendly message or retry the operation.
- **Returning structured error objects** – This makes it easier to pass the error along without breaking the function's contract.

<aside><strong>Note about Promises:</strong> I'm not giving Promises a standalone section in this article as I consider them to be a similar to using <code>try..catch</code> block. While more explicit in their intent &mdash; we know a promise can be rejected &mdash; we can still ignore the error (and as I have seen developers often do that).</aside>

Let’s stop at the third point and discuss it a little bit more in detail. Because we can actually treat errors like — well — not errors. Instead of throwing an error and spreading a panic through the entire system, we can choose to treat errors as a normal data. As if you would return an object with user’s data from the API. Or a string from a function.

### 5. **Treat Errors as Data**

Throwing error is a side effect that break function purity. A best approach I found is **treating errors as data** — acknowledge that something can go wrong and properly describe it. This ensures that functions always return something predictable and prevents unexpected crashes in the app.

#### Why is it better?

Human’s love certainty. It’s hard for us to foresee unknown and unexpected stuff. We have a tendency to ignore it.

When introducing error as a valid return value we are forcing users to acknowledge the is an error and handle it (or they have to make a conscious decision to ignore it). Of course there some unexpected errors you can’t predict (like server is down when fetching data, or out of memory), but we can catch most of those as well with a handlers placed at the right spot.

This Error-as-Data approach has several benefits (and one major downside I will mention at the end):

- Transparency - other devs can see that our code can return a success or error values.
- No surprices - our code have no surprises since we are not throwing errors.
- Being explicit - we are very clear that the code can fail and in a what way.

It forces us to thing about errors as well. Not only are we saying that the function can fail. We can (and we should) also specify exactly what kind of errors we can get. This helps us write a better and more robust code.

#### Examples of Error-as-Data patterns

##### Object-based approach (often used by 3rd services or libs like Supabase):

Function always return object with optional `error` and `data` values. The caller must check for `error` before accessing `data`.

```tsx
function fetchUsers() {
  const { error, data } = await apiClient(`/users/`);

  // If error is not `undefined` the operation was not successful
  // and we have to handle the error.
  if (error) {
    handleError(error);
    return;
  }

  // In case of error being `undefined` we are certain that fetching data
  // was successful and we can work with the data.
  return data;
}
```

This also plays nicely with Typescript and it will force us to deal with the possible errors.

##### Result pattern

Instead of plain object we can return a specialized class that wraps the return value. This class is commonly named as a `Result`. Having extra wrapper seems to be an overkill at first, but it has few benefits.

- Composition - with Result class you can compose multiple functions that accept Result as an input without having to worry about the return value.
- Safety - You can safely pass the value around without worring about possible exceptions in the app. As long as your code expect a result class as an input and can work with it.
- The class might have extra utility helpers that allow you to manipulate the result’s value without a need to actually deal with the potential error (this of it as an array methods like `map`, `filter`, etc. in JS).

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
  // text contains the file's content
  const text = result.value;
} else {
  // err equals 'invalid path'
  const err = result.error;
}

// or in more advanced cases with utility functions
const result = readFile('test.txt');

// if the result is Ok, then we `map` function will be executed, modifying
// the internal value and returning new instance of Result object.
//
// Otherwise if the Result class contains error, nothing happens and the `map`
// function will be ignored.
result.map(val => firstLettersToUppercase(val));
```

Some programming language have this already backed in (like [Rust](https://pustelto.com/blog/my-experience-with-rust/#4.-option-and-result-types)), and [let’s hope that similar approach to error handling will become part of JS as well](https://github.com/arthurfiorette/proposal-try-operator). In the meanwhile we can use some polyfills or 3rd party libraries (like [ts-result-es](https://github.com/lune-climate/ts-results-es#readme)).

I have mentioned there is a downside in this Error-as-a-Data approach, if you choose to go this way, you will have a bit more boilerplate and verbosity in your code. I personally believe the benefits completely outweigh this, unless you are dealing with some really small or primitive code.

## Conclusion: Think about errors before they happen

Let’s be real—something will go wrong. Maybe not today. Maybe not in your local dev environment. But sooner or later, the code will hit a snag, and how you prepare for that defines the robustness of your system.

Instead of pushing the problem up the call stack or pretending it doesn’t exist, treat error handling as a first-class concern. Not just a defensive guard, but an intentional design choice.

When you model errors as data:

- Your code becomes more predictable.
- Your system becomes easier to debug.
- And your team builds a shared understanding of what “failure” looks like.

So the next time you're deciding how to handle a potential failure, remember: a little verbosity beats a silent crash every time.
