---
title: Enable dark mode for kitty, fish, Neovim
subtitle: An example subtitle
summary: Summary of the example
date: 2024-01-25
draft: true
slug: theme-toggle-for-kitty-nvim
tags:
  - vim
  - fish
  - til
---
- Occasionally I want to use a light theme during the day while working
- Create a toggle for light and dark modes
- Only concerned about fish, kitty, and neovim
- Need to find a theme for all three
- Fish has `fish_config theme show | choose`
- Kitty has `kitty +kitten themes <theme>`
- Neovim has `:colorscheme <theme>` needs an update in `init.lua`
- Should live as a fish function with a global theme env var

This is for me. This article/note is for me. What do I want to write for myself in a few months.

(modify as this is what I thought)
We'll I've come to realize Dark Mode is great but during the day in sunny areas I have to adjust brightness or haphazardly change terminal themes that do not get propagated to everywhere making the whole situation even more annoying. Its time to fix this.

After a few searches I stumbled on a post detailing how to [toggle between light/dark themes]() for fish, kitty, and neovim. The main idea is to define a pair of functions: `light.fish` and `dark.fish` to toggle the correct themes for tools. 

Main tools I'm concerned with are Fish, Kitty, and Neovim. Fortunately all these tools come with [prefigured styles](https://github.com/dexpota/kitty-themes) and huge [communties around styling](https://vimcolorschemes.com/). For this I decided to switch to a new to me theme of *catppucin* but easily available for most apps. 

# 🐈 Kitty
Kitty has tooling for themes and preinstalled out of the box. Run:
```shell
kitty +kittens themes
```

I'm using `catppucin-mocha` as my dark mode.

# 🐠 Fish
Fish also comes with pre-baked themes, for themes run this show a preview of all themes with a code sample. Here we are mainly just looking for some that is readable:
```
fish_config themes show
```
For me `fish default` looks the best so I'll just keep it.

# 🖥️ Neovim
Neovim themes are controlled via `init.lua` so have to add a few lines to script. This will work based on a conditional `THEME` variable:
```lua
-- Set the colorscheme to catppuccin-mocha using a protected call
-- in case it isn't installed
if os.getenv('theme') == 'light' then
  local status, _ = pcall(vim.cmd, "colorscheme catppuccin-mocha")
  if not status then
    print("Colorscheme not found!") -- Print an error message if the colorscheme is not installed
    return
  end
end
```
([init.lua]())
# 🎁 Wrap this a function
```shell
function dark --description 'Enables a dark theme for Fish, Nvim, and Kitty'
  # Set theme for Nvim
  set -xU THEME dark

  # Set theme for Bat
  set -xU BAT_THEME "TwoDark"

  # Set theme for Kitty
  kitty +kitten themes catppuccin-mocha
end
```

# 🎉 Bonus: configure a readable theme for [bat](https://github.com/sharkdp/bat).

The `cat` alternative `bat` has a `--theme` flag and also uses `BAT_THEME="..."` which we can configure. It also comes with an option list all themes `bat --list-themes`.
```rust
...
Theme: OneHalfLight

  // Output the square of a number.
  fn print_square(num: f64) {
      let result = f64::powf(num, 2.0);
      println!("The square of {:.2} is {:.2}.", num, result);
  }

Theme: ...
```
Add theme to functions:
```shell
# Set theme for Bat
set -xU BAT_THEME "OneHalfLight"
```

Repeat the steps to create an equivalent `light.fish` function. You should now be able to toggle between dark and light modes.


---


I want to seamlessly toggle between light/dark modes for Fish, Kitty, and Neovim. 

I'm thinking two separate Fish functions: `light` and `dark`


First step is to set a Fish `light` theme. Fish comes preconfigured with several themes.

Find a Kitty theme that works with this.

Update neovim theme.

Wrap this a fish function

Repeat for dark theme

Start with updating Fish themes.

Define a base light theme for fish

Bonus: Change theme for Bat (cat with wings)

--- 
- Evan Travers: [Light/Dark Toggle for Neovim, Fish, and Kitty](https://evantravers.com/articles/2022/02/08/light-dark-toggle-for-neovim-fish-and-kitty/)
- [Setting Neovim theme using Colorscheme](https://linovox.com/set-neovim-nvim-colorscheme/)
- https://shapeshed.com/vim-tmux-alacritty-theme-switcher/
- https://fishshell.com/docs/current/cmds/fish_config.html
