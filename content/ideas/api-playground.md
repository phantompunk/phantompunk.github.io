---
title: How to test drive Google APIs
subtitle: An example subtitle
slug: google-api-playground
tags:
  - api
  - google
  - playground
  - til
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1649662225945/7f_c6UxhR.jpg?auto=compress
draft: true
date: 2024-01-23
---
Working with Google APIs can be daunting with sheer amount of them, auth flows, all the available libraries especially if you want to quickly query something or extract a few files.

They've made this process easier to get started by creating an [api playground](https://developers.google.com/oauthplayground/). This enables you to easily define your scope, authenticate yourself, request tokens, and execute requests.

1. Select an API & authorize your scope
2. Request a *Refresh Token* and *Access Token*
3. Pick an API Endpoint
4. Construct a request & send

Access Tokens are good for an hour. Obviously not a good solution for anything long lived but perfect for exploring an API or performing a quick operation.

Below is a sample request for listing available task lists from the Google Tasks API:
```http
GET /tasks/v1/users/@me/lists HTTP/1.1
Host: tasks.googleapis.com
Content-length: 0
Authorization: Bearer ya31.a3AnCzNB1uXt4zkNEgWhfeNczMGiUDWx_IWKkYrR07V07EntMUVvQ0171
```

Which can then be easily converted into a curl request or python script:
```bash
export TOKEN=ya31.a3AnCzNB1uXt4zkNEgWhfeNczMGiUDWx_IWKkYrR07V07EntMUVvQ0171
curl -X GET "https://tasks.googleapis.com/tasks/v1/users/@me/lists" \
      -H "Authorization: Bearer $TOKEN"

{
  "kind": "tasks#taskLists",
  "etag": "\"LTc3MTU3MTMyMg\"",
  "items": [
    {
      "kind": "tasks#taskList",
      "id": "MDEyNjQ3OTE1MDcyOTg2OTM0ODM6MDow",
      "etag": "\"MTUyNDA3OTE3OQ\"",
      "title": "Rodrigo Moran's list",
      "updated": "2024-01-30T14:48:16.033Z",
      "selfLink": "https://www.googleapis.com/tasks/v1/users/@me/lists/MDEyNjQ3OTE1MDcyOTg2OTM0ODM6MDow"
    }
  ]
}
```
