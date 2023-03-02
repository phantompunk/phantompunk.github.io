#!/bin/sh
set -ex
icons="twitter github-alt linkedin stack-overflow"
dest=fontawesome
url=https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/brands/
mkdir -p "${dest}"
for icon in $icons; do
  icon="${icon}.svg"
  curl -LO "${url}/${icon}"
done
