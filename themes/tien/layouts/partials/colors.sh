#!/bin/sh

# List of available tags
tags=(
  "ai"
  "api"
  "aws"
  "containers"
  "docker"
  "fish"
  "git"
  "go"
  "linux"
  "llm"
  "mac"
  "python"
  "shell"
  "snowflake"
  "til"
  "sql"
  "vim"
)


# List of available colors in tailwind
colors=(
'red'
'orange'
'amber'
'yellow'
'lime'
'green'
'emerald'
'teal'
'cyan'
'sky'
'blue'
'indigo'
'violet'
'purple'
'fuchsia'
'pink'
'rose'
'slate'
'gray'
'zinc'
'neutral'
'stone'
)

# List of wieghts to use
weights=("500" "700")

num_colors=${#colors[@]}
num_weights=${#weights[@]}

for idx in "${!tags[@]}"; do
  color=${colors[idx % num_colors]}
  weight=${weights[idx % num_weights]}

  echo ".${tags[idx]} {\n  @apply bg-$color-$weight;\n}"
done
