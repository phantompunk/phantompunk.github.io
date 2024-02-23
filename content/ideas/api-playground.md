---
title: Test drive Google APIs
subtitle: 
slug: google-api-playground
tags:
  - api
  - google
  - playground
  - til
cover: 
draft: false
date: 2024-01-23
---
Working with Google APIs can feel overwhelming due to the variety of APIs, auth processes, and all the available libraries. To address this, Google put together an [API Playground]() to quickly define your scope, authenticate, request refresh tokens, and execute queries.

Here's the breakdown:
1. Select an API & authorize your scope
2. Request a _Refresh Token_ and _Access Token_
3. Pick an API Endpoint
4. Construct a request & send

Keep in mind *Access Tokens* are only valid for an **hour**. Not suitable for a long-term solution but perfect for exploring an API or executing quick operations.

For example, here's a sample HTTP request for listing available task lists from the Google Tasks API:
```http
GET /tasks/v1/users/@me/lists HTTP/1.1
Host: tasks.googleapis.com
Content-length: 0
Authorization: Bearer ya31.a3AnCzNB1uXt4zUVvQ0171
```

If we extract the *access token* we easily convert this into a Python script:
```python
import os
import requests

URL = "https://tasks.googleapis.com/tasks/v1/users/@me/lists"
TOKEN = os.environ.get("GOOGLE_API_TOKEN")

headers = {"Authorization": f"Bearer {TOKEN}"}
tasklists = requests.get(URL, headers).json()

print(tasklists)
```
