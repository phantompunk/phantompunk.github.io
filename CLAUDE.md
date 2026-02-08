# Frontend Development Quick Reference

## CSS Layers (Tailwind)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global defaults, CSS variables, element resets */
@layer base {
  :root {
    --color-primary: #0066cc;
  }
  body {
    @apply font-sans bg-white text-gray-900;
  }
}

/* Reusable component classes */
@layer components {
  .btn {
    @apply px-4 py-2 rounded font-semibold;
  }
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}

/* Custom utilities (rare) */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

**When to use:**
- `@layer base` → Element defaults, variables
- `@layer components` → Reusable patterns (`.btn`, `.card`)
- `@layer utilities` → Custom utility classes
- No layer → Animations, third-party overrides

---

## Tailwind CSS

### Common Patterns

```html
<!-- Layout -->
<div class="container mx-auto px-4 py-8">
<div class="max-w-4xl mx-auto">
<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

<!-- Spacing -->
<div class="p-4 m-2">      <!-- padding/margin: 1rem, 0.5rem -->
<div class="px-6 py-3">    <!-- horizontal/vertical -->
<div class="mt-8 mb-4">    <!-- top/bottom -->

<!-- Typography -->
<h1 class="text-4xl font-bold">
<p class="text-gray-600 leading-relaxed">
<a class="text-blue-600 hover:text-blue-800 underline">

<!-- Flexbox -->
<div class="flex items-center justify-between">
<div class="flex flex-col gap-4">

<!-- Colors -->
<div class="bg-white text-gray-900">
<div class="bg-blue-600 text-white">
<div class="border border-gray-300">

<!-- Responsive -->
<div class="hidden md:block">           <!-- hide on mobile -->
<div class="text-sm md:text-base lg:text-lg">
```

### Prose (Typography Plugin)

```html
<article class="prose prose-lg max-w-none">
  {{ .Content }}
</article>

<!-- Customized -->
<div class="prose 
            prose-headings:text-gray-900 
            prose-a:text-blue-600 
            hover:prose-a:underline
            prose-code:bg-gray-100">
  {{ .Content }}
</div>
```

---

## Hugo Templates

### Template Structure

```
layouts/
├── _default/
│   ├── baseof.html    # Master wrapper
│   ├── single.html    # Individual posts
│   └── list.html      # Archive/listing pages
├── index.html         # Homepage
└── partials/
    ├── header.html
    └── footer.html
```

### baseof.html (Master Template)

```html
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ block "title" . }}{{ .Site.Title }}{{ end }}</title>
    
    {{ $css := resources.Get "css/output.css" }}
    <link rel="stylesheet" href="{{ $css.Permalink }}">
    
    {{ block "head" . }}{{ end }}
</head>
<body class="bg-gray-50 text-gray-900">
    {{ partial "header.html" . }}
    
    <main>
        {{ block "main" . }}{{ end }}
    </main>
    
    {{ partial "footer.html" . }}
</body>
</html>
```

### single.html (Blog Post)

```html
{{ define "title" }}{{ .Title }} | {{ .Site.Title }}{{ end }}

{{ define "main" }}
<article class="max-w-4xl mx-auto px-4 py-8">
    <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4">{{ .Title }}</h1>
        <time class="text-gray-600">{{ .Date.Format "January 2, 2006" }}</time>
        
        {{ with .Params.tags }}
        <div class="flex gap-2 mt-4">
            {{ range . }}
            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {{ . }}
            </span>
            {{ end }}
        </div>
        {{ end }}
    </header>
    
    <div class="prose prose-lg max-w-none">
        {{ .Content }}
    </div>
</article>
{{ end }}
```

### list.html (Archive Page)

```html
{{ define "main" }}
<div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">{{ .Title }}</h1>
    
    <div class="grid gap-6 md:grid-cols-2">
        {{ range .Pages }}
        <article class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-semibold mb-2">
                <a href="{{ .Permalink }}" class="hover:text-blue-600">
                    {{ .Title }}
                </a>
            </h2>
            <time class="text-sm text-gray-600">{{ .Date.Format "Jan 2, 2006" }}</time>
            <p class="mt-4">{{ .Summary }}</p>
        </article>
        {{ end }}
    </div>
</div>
{{ end }}
```

### index.html (Homepage)

```html
{{ define "main" }}
<div class="max-w-4xl mx-auto px-4 py-12">
    <header class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4">{{ .Site.Title }}</h1>
        <p class="text-xl text-gray-600">{{ .Site.Params.description }}</p>
    </header>
    
    <section>
        <h2 class="text-3xl font-bold mb-6">Recent Posts</h2>
        {{ range first 5 .Site.RegularPages }}
        <article class="mb-6">
            <h3 class="text-xl font-semibold">
                <a href="{{ .Permalink }}">{{ .Title }}</a>
            </h3>
            <time class="text-sm text-gray-600">{{ .Date.Format "Jan 2, 2006" }}</time>
        </article>
        {{ end }}
    </section>
</div>
{{ end }}
```

---

## Hugo Variables & Functions

### Common Page Variables

```go
{{ .Title }}              // Page title
{{ .Content }}            // Rendered markdown
{{ .Summary }}            // Auto-generated summary
{{ .Date }}               // Publication date
{{ .Permalink }}          // Full URL to page
{{ .RelPermalink }}       // Relative URL
{{ .Params.customField }} // Custom frontmatter field
{{ .WordCount }}          // Word count
{{ .ReadingTime }}        // Estimated reading time (minutes)
```

### Site Variables

```go
{{ .Site.Title }}              // Site title
{{ .Site.Params.description }} // From config
{{ .Site.RegularPages }}       // All regular pages
{{ .Site.Menus.main }}         // Main menu items
{{ .Site.BaseURL }}            // Base URL
```

### Common Functions

```go
{{ range .Pages }}             // Loop through pages
{{ range first 5 .Pages }}     // First 5 items
{{ with .Params.image }}       // Conditional (if exists)
{{ if .IsHome }}               // Boolean check
{{ .Date.Format "2006-01-02" }}// Date formatting
{{ partial "header.html" . }}  // Include partial
{{ printf "Hello %s" .Title }} // String formatting
```

### Filtering & Sorting

```go
{{ range where .Site.RegularPages "Section" "posts" }}
{{ range where .Site.RegularPages "Type" "posts" }}
{{ range first 10 (where .Site.RegularPages "Section" "posts") }}
{{ $sorted := .Pages.ByDate.Reverse }}
{{ $sorted := .Pages.ByPublishDate }}
```

---

## Content Structure

```
content/
├── _index.md              # Homepage content (optional)
├── about.md               # /about/
├── ideas/
│   ├── _index.md          # /posts/ (list page)
│   ├── first-post/
│   │   ├── index.md       # /posts/first-post/
│   │   └── image.jpg      # Co-located asset
│   └── second-post/
│       └── index.md
├── til/
│   ├── _index.md          # /til/ (list page)
│   └── colima.md          # /colima/ (post)
```

**File naming:**
- `_index.md` → List/section pages (with underscore)
- `index.md` → Single page in a bundle (no underscore)
- `about.md` → Simple single page

---

## Frontmatter Example

```yaml
---
title: "My Post Title"
date: 2026-02-08T10:00:00-08:00
draft: false
tags: ["hugo", "tailwind", "css"]
categories: ["web-dev"]
slug: my-post-title
description: "A short description for SEO"
cover: "cover.jpg"
---

Your content here...
```

---

## Common Patterns

### Image in Page Bundle

```markdown
![Alt text](image.jpg)
```

Hugo automatically finds `image.jpg` in the same directory.

### Conditional Content

```html
{{ if .Params.featured_image }}
  <img src="{{ .Params.featured_image }}" alt="{{ .Title }}">
{{ end }}

{{ with .Params.author }}
  <p>By {{ . }}</p>
{{ end }}
```

### Menu Navigation

```html
<nav>
  {{ range .Site.Menus.main }}
    <a href="{{ .URL }}">{{ .Name }}</a>
  {{ end }}
</nav>
```

Config in `hugo.toml`:
```toml
[[menus.main]]
  name = 'Home'
  pageRef = '/'
  weight = 1
[[menus.main]]
  name = 'Posts'
  pageRef = '/posts'
  weight = 2
```

---

## Development Workflow

```json
{
  "scripts": {
    "dev": "concurrently \"bun run dev:tw\" \"bun run dev:hugo\"",
    "dev:tw": "bunx tailwindcss -i ./assets/css/main.css -o ./assets/css/output.css --watch",
    "dev:hugo": "hugo server -D",
    "build": "bunx tailwindcss -i ./assets/css/main.css -o ./assets/css/output.css --minify && hugo --minify"
  }
}
```

```bash
bun dev    # Development
bun build  # Production build
```

---

## Quick Tips

1. **Block vs Define:**
   - `{{ block "name" . }}` in parent (baseof.html)
   - `{{ define "name" }}` in child (single.html, list.html)

2. **Always pass context with dot:**
   - `{{ partial "header.html" . }}`
   - `{{ block "main" . }}`

3. **Tailwind config - use extend:**
   ```js
   theme: {
     extend: {  // Don't override defaults!
       colors: { ... }
     }
   }
   ```

4. **Content sections from directory:**
   - `content/posts/` → Section: "posts"
   - Access: `{{ where .Site.RegularPages "Section" "posts" }}`

5. **Page bundles for co-located assets:**
   ```
   my-post/
   ├── index.md
   ├── image1.jpg
   └── image2.jpg
   ```

