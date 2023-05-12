---
title: I have switched from VS Code to VIM and I will never go back
twitter: "I have switched from VS Code to VIM and I will never go back. Read on to find out why."
tags: ["Front-end", "VIM", "Tooling"]
excerpt: "I have decided to switch from VS Code to VIM and in this article I will explain my reasons behind this decision."
date: 2023-01-16
published: true
---

Some time ago, I posted a [tweet announcing I had switched from VS Code to VIM](https://twitter.com/pustelto/status/1552915586203541505) ([Neovim](https://neovim.io/) to be precise).

Given that most of my colleagues looked at me in disbelief when I told them. I have decided to summarize my reasons behind this and outline the process for those brave enough to follow 😁.

## Why I ditched VS Code

I would say my two main reasons are **performance** and **navigation** in the code. VIM is just great at those.

And while you can easily add navigation to VS Code with [VIM plugin](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim). You can't do
much about performance.

### Performance

VS Code has become unbearable slow for me, especially on large projects. And I'm using a mac, so I can't blame the slow machine. Main issues I had:

- There was a noticeable delay in the response when I triggered suggestions and before I got a response from Intellisense.
- Opening large files.
- Changing a project. When I wanted to check other projects, it took some time until the editor was fully responsive.

### Navigation

I tend to learn a lot of shortcuts (and prefer to use a keyboard most of the time). I&nbsp;could work like this in VS Code for most of the stuff, even though some keyboard shortcuts I used were quite complicated and required a combination of three keys most of the time.

But for the detailed movements in the code, I had to use mouse or arrow keys. Getting my hand aways from letters to reach for arrows just become annoying for me. In the end I add custom keybinding which simulated VIM's `hjkl` basic navigation.

That was a point where I realized I should probably use at least VIM plugin instead of reinventing wheel.

## How do I feel about Neovim

I love it.

Seriously.

I don't think I will ever switch back to VS Code (or a similar IDE). Here is a quick summary of the good, ugly and bad from VIM (please note I'm still a beginner and know like 1% of VIM capabilities):

### The good parts

- It does everything I need, but faster (a **lot faster** in many cases).
- It starts almost instantly. Getting into a file and quickly editing a few lines is a breeze. I am using a tmux and I have a running session for other projects. So this process is usually a matter of a few strokes. The ergonomics of this flow are genuinely nice.
- Sleek minimalistic look.
- Navigation and motions in the code (once you learn it, it is hard to go back).
- I don’t have to use a mouse.
- I like to mingle with my configs, so I enjoy this part as well (it is a good opportunity to learn something new).
- It gives me that nerdy feeling of terminal superiority 🤓.
- Editor in the terminal.
  - I can easily edit any file from everywhere. This seems like a minor thing, but it actually is a great boost for productivity. Yes, I know I could open files in VS Code from terminal, but it took some time as well. Now I just type `vim docker-compose.yml`, and I can start editing. And I have all my keyboard shortcuts and plugins ready.

### Ugly parts

- I miss multi-cursor sometimes, but less often than I would expect. I expect this will get less relevant over time as I learn how to properly use VIM for this kind o stuff (macros, search and replace, global command, etc.).
- I still haven't finished my setup. Less used things do not have a proper config or do not have a keybinding.
- Hard to debug sometimes, why something is not working. But most of the time everything just works as intended.
- You must be willing to invest time to learn VIM (but you should invest your time to learn any other editor of your choice anyway).

### Bad parts

- Initial setup takes quite a lot of time. You could use one of the ready-to-use distros like [LunarVim](https://www.lunarvim.org/) or [AstroVim](https://astronvim.github.io/), but I haven't check those too much.
- Given the large ecosystem and nature of VIM, some plugins might conflict with each other. That may be hard to debug. So far I've had this issue only once, but it was still a pain to solve.

## How did I do it

{% image "boromir-meme.jpg", "Boromir meme. Boromir telling is that one does not simply switch to VIM." %}

So you get interested in Vim and would like to give it a shot as well? Then you will need quite a lot of patience. But in the end, I think it is not so difficult as many people (and Boromir) believe. You can learn a few basic commands to be reasonably productive in a fairly short time.

Here is what I did:

- I installed the VIM plugin for [VS Code](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim). It is a great for learning VIM. When you don't know some commands, you still have a mouse and command palette at your disposal.
- Then I spent a month or two playing with it, learning more keybinding and gettings used to it (there are some nice [VIM cheatsheets](https://quickref.me/vim) that can help)
- When I have decided to switch I wrote down a list of features I wanted and needed in my editor.
- I jump on Google and YouTube to see what is possible and how to configure the stuff. I found YouTube series [Neovim from scratch](https://www.youtube.com/playlist?list=PLhoH5vyxr6Qq41NFL4GvhFp-WLd5xzIzZ). The setup covered in the series have almost everything I need. So I mostly copy-paste and tweak a the config a little bit (there is a GitHub repo so you can just clone it).
- Once I had a feeling I have the most critical features I make the move and add more stuff as needed.

## Conclusion

That was my story with VIM in short.

This is not meant to convince anyone to move to VIM. Use what you feel is the best tool for the job. In the end, you can be incredibly productive in any editor if you invest your time in learning it properly.

As for me, I will stay with VIM. I don't have a reason to go back to VS Code or any other "standard" editor. I'm really enjoying the experience and feel more productive.
