---
title: Experimenting with Google APIs
subtitle: 
slug: google-api-playground
tags:
  - api
  - til
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1713473996738/1c04ad7b-2a9a-4bf9-9d0a-0ca46742c360.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp
draft: false
date: 2024-01-23
url: google-api-playground
---
Working with Google APIs can feel overwhelming due to the variety of APIs, processes around authentication/authorization, requesting appropriate scopes, and navigating all the available libraries.

Luckily for us, Google put together an [API Playground](https://developers.google.com/oauthplayground/) to quickly define your scope, authenticate, request tokens, and execute queries.

Here's the breakdown:

1. Select an API and the required scope
    
2. Request a *Refresh Token* and *Access Token*
    
3. Pick an API Endpoint
    
4. Construct a payload & send
    

Keep in mind *Refresh Tokens* are valid for **24h** and *Access Tokens* are only valid for an **hour**. Not suitable for any long-term solution but perfect for exploring an API or executing quick operations.

For example, if we need to find all of our task lists from the Google Tasks API. We need to request a token with an appropriate scope. In this case, all we need is [`https://www.googleapis.com/auth/tasks.readonly`](https://www.googleapis.com/auth/tasks.readonly) under "Google Tasks API v1".

Clicking the authorize link will send you to the Google Login and then redirect you back to the API Playground after approving the scope request. Now you can exchange an Auth Token for a Refresh and Access token.

Find your endpoint and fire your request. Use the `List possible operations` button to auto-populate the request.

If we need to do this for a script there's an easy way to speed it up as long as a manual step is fine. Take the scoped redirect URI from the playground and open it with a web browser.

```python
import webbrowser
GOOGLE_AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&prompt=consent&response_type=code&client_id=407408718192.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ftasks.readonly&access_type=offline'
webbrowser.open(GOOGLE_AUTH_URI)
```

Follow the auth steps then export the token.

```bash
export GOOGLE_ACCESS_TOKEN='ya29.abc123...'
```

Once we have the *access token* we can easily add this to a Python script:

```python
import os
import requests

URL = "https://tasks.googleapis.com/tasks/v1/users/@me/lists"
TOKEN = os.environ.get("GOOGLE_ACCESS_TOKEN")

headers = {"Authorization": f"Bearer {TOKEN}"}
tasklists = requests.get(URL, headers).json()

print(tasklists)
```
