---
title: Move lines around in Neovim
date: 2023-02-05
draft: false
tags:
  - vim
url: move-lines-in-nvim
summary: How to set up keymaps to move lines up or down in neovim
---

One of my favorite hotkeys in VS Code is being able to move the current line or lines around using:

<h3 style="text-align: center;">[ Mac: ⌥ + ↑/↓ ] [ Windows: Alt + ↑/↓ ]</h3>

### [ Mac: ⌥ + ↑/↓ ] [ Windows: Alt + ↑/↓ ]

Now that I’ve switched over to neovim it's one of those commands I keep missing. There are ways to get the same result in Vim using the basic motions but it is not intuitive nor easy to remember.

Fortunately, I was able to pick up a golden nugget from 0 to LSP: Neovim From Scratch by ThePrimeagen.

![theprimeagen_screencap](https://i.imgur.com/RmLcrgI.png)

## The magic formula is 🎩🐇:

```lua
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv")
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv")
```

### How does it work?
This snippet enables moving the current selection up and down using `shift+j` or `shift+k` while in Visual Mode.

- `vim.keymap.set` - is a neovim wrapper function for setting keymaps

- `v` - specifies this remap should only work in Visual modes

- `J` / `K` - sets `shift+j` and `shift+k` as the trigger

- `:m` - calls the move command it moves the current line up or down

- `'>+1` - specifies to move one line after the end of the current selection

- `<CR>` - applies a carriage return not completely sure about this one

- `gv=gv` -  reselect selected lines and apply any indents

To apply the same mapping in normal and insert modes use this:

```lua
vim.keymap.set("n", "J", ":m .+1<CR>==")
vim.keymap.set("n", "K", ":m .-2<CR>==")
vim.keymap.set("i", "J", ":m .+1<CR>==gi")
vim.keymap.set("i", "K", ":m .-2<CR>==gi")
```

