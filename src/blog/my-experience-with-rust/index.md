---
title: Rust through the eyes of FE developer
twitter: "I have tried Rust for a month and I have summarized my experience with it."
tags: ["Rust", "CLI", "Tooling", "Learn in Public"]
excerpt: "Rust is a programming language that has gained a lot of popularity recently. I have decided to play with it for a month. This article is a summary of my experience when building a command-line tool and shows what I loved about the language, as well as what I struggled with."
date: 2023-03-30
published: true
---

[Rust](https://www.rust-lang.org/) is a programming language that has gained a lot of popularity recently. As someone who has been interested in Rust for a while, I finally decided to play with it for a month.

In this article, I'll share my experience building a command-line tool with Rust and highlight what I loved about the language, as well as what I struggled with.

## What did I do

I decided to build a command-line tool because it was a perfect fit for my study project.

First, I went through the exercise projects in the official Rust documentation, including Command line apps in Rust and chapters 12 and 20 in the Rust book on building a&nbsp;command-line program and a multithreaded web server, respectively.

Once I finished those tutorials, I started building my own project.

### Introducing Rx

I work a lot with Nx in the terminal, but I don't always remember all the available commands and projects. So my goal was to build a utility that could show me all the projects in the monorepo and list the available tasks for each selected project. I chose this project for a few reasons:

- It solved my own problem (I couldn't find something similar).
- There were a lot of interesting concepts in Rust that I could use to improve my skills, such as JSON parsing, file manipulation (read and write), and handling user input.
- It allowed me to get my hands dirty and learn as much as possible.

You can check out the [Rx code on my Github](https://github.com/pustelto/rx), but be warned that it is not production-ready code.

## What I love

### 1. Very Clear and Informative Warnings and Errors

One thing I really appreciated about Rust was its clear and informative error messages. Whenever there was a problem with my code, Rust would usually tell me exactly what the problem was and how to fix it. This was a refreshing change from the sometimes cryptic error messages I'm used to seeing in TypeScript.

{% image "rust-compiler-error.jpg", "Exapmple of error messaged shown by rust compiler. Including
precise code location when the error happened. Error message: arguments to this function are incorrect. expected `&mut std::string::String`, found struct `std::string::String`, help: consider mutably borrowing here: `&mut buffer`" %}

### 2. Iterators

Rust's iterators are much more powerful than those in JavaScript. They are lazy evaluated by default and developers have much more utility functions available. It's like having Lodash or Ramda as part of the standard library.

In the simple example below, we take first 10 elements from infinit sequence of numbers, use filter function to keep only multiples of 3, multiply them by 3 and sum the resulting numbers into one.

```rust
fn main() {
  let sequence = 1..;

  let res: u8 = sequence
                  .take(10)
                  .filter(|x| x % 3 == 0 )
                  .map(|x| x * 3)
                  .sum();

  assert_eq!(res, 54);
}
```

Another nice example of iterators can be seen in [Rust by example book](https://doc.rust-lang.org/rust-by-example/trait/iter.html) where it is used to implement the Fibonacci sequence.

A complete list of available methods can be found in the [documentation for Iterator](https://doc.rust-lang.org/1.39.0/core/iter/trait.Iterator.html#provided-methods).

### 3. Pattern Matching

For JavaScript developers, pattern matching in Rust is like a switch statements on steroids. You'll find yourself using it a lot to return and transform values based on conditions. Rust will also force you to handle all the branches, which is great for making sure your code is robust and handles all possible scenarios.

```rust
let file_result: Result<File> = File::open("nx.json");

match file_result {
    Ok(file) => file,
    Err(error) => match error.kind() {
        ErrorKind::NotFound => panic!("The file you are looking for does not exists."),
        ErrorKind::PermissionDenied => panic!("You shall not pass into this file."),
        ErrorKind::InvalidInput => panic!("Bad arguments for the command, doc."),
        _ => panic!("Something else went wrong, but I was too lazy to deal with it.")
    }
};
```

There is even [JS proposal to add pattern matching into the specification](https://github.com/tc39/proposal-pattern-matching).

### 4. Option and Result Types

Most of the time, Rust will return `Option` or `Result` types instead of throwing an error. This is inspired by [monads](https://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/) from functional programming and allows you to handle errors in a more controlled and elegant way.

It plays nicely with pattern matching, allowing you to handle various errors separately. This leads you to handle errors by default (but you can bypass this). It also allows you to compose the flow of your program more effectively. As you can see in the previous code example.

### 5. Structs and traits

Rust's variant of objects is a struct. A struct can have properties and methods (both static and instance methods) just like JavaScript objects. And if you want to create some generic behavior that can be reused across different structs, you can create a&nbsp;trait.

For example, in my case, I reused a trait for parsing and deserializing JSON from 3rd party library. I simply added a trait to the struct describing my JSON shape (one line of code), and it parsed the JSON file into a strictly-typed struct that I could easily work with. Which is a awesome compared to JS/TS world.

```rust
#[derive(Serialize, Deserialize, Debug)]
struct NxProjectFile {
    name: String,
    tags: Vec<String>,
    targets: HashMap<String, Target>,
}

// later in the code
let project_json: NxProjectFile = serde_json::from_reader(project_file_reader).unwrap();
```

### 6. Superb documentation

The Rust documentation is excellent and was a huge help as I learned the language. I&nbsp;was able to find most of what I needed in the docs, and most of the time, I read it in my editor as a tooltip when I needed to check how a method works.

I also found the documentation to be really good for the crates I worked with (Rust's version of NPM packages).

### 7. Support in Neovim is great 😅

As someone who uses Neovim as their primary text editor, I was happy to find that Rust has great tooling support in Neovim.

I was able to set up my environment quickly and start working with Rust in just a few minutes thanks to this [video Rust setup for Neovim](https://www.youtube.com/watch?v=Mccy6wuq3JE&ab_channel=TJDeVries)

## What I need to get used to

### 1. Ownership

I still feel a little confused about the ownership logic. When you are passing a variable to a lower scope and when you only reference it (function in lower scope will borrow it).

Luckily, Rust will often tell you what to do to fix the errors.

### 2.Mandatory semicolons.

In Rust, every statement must end with a semicolon. Otherwise, the expression is considered a return statement (if it is the last expression in the block scope). As a&nbsp;JavaScript developer, I'm not used to typing semicolons anymore, and Prettier handles this for me. So I often forget to type it which is annoying.

### 3. Low-level nature of the language

When working with Rust you have to sometimes deal with the low-level nature of the language, which is something I’m not used to as a front-end developer.

For example, I wanted to write to a file and overwrite its content. But instead, Rust did always append the content. After a little googling I found out that when you read from a&nbsp;file first, you have to rewind a pointer back to the beginning of the file. Otherwise write operation will append to content to the file.

## Conclusion

I enjoyed the short time with Rust. It was a nice experience, and I had fun learning it. I&nbsp;think it takes the good parts from both object-oriented programming and functional programming.

I will probably return to it in the future to play with it a little bit more. Most likely, to polish the Rx utility or maybe when I need to build another CLI utility or when playing with WebAssembly.
