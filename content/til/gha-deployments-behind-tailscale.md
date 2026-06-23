---
date: 2026-06-22
draft: true
title: Github Webhooks don't work behind Tailscale
summary: Trigger Dokploy deployments behind Tailscale via Github Actions
url: trigger-gha-deployment-tailscale
tags:
  - tailscale
  - dokploy
  - gha
---

For context I run and manage several apps using Dokploy on private servers sitting behind my Tailscale network. If my servers were publicly accessible this would be a non issue because Dokploy supports Github style Webhooks, since its not Github cannot reach my servers. So for my compose apps I'd use a WatchTower container to poll for new images but in this case I have an application I'm working on and I want automatic builds on every push. So I need a new solution. Fortunately Dokploy supports this via the `application.deploy` endpoint. My only problem is Tailscale, which they have addressed with an official action. So this is the workflow:
```
Git Push  
↓  
GitHub Action  
↓  
Connect to Tailscale  
↓  
Reach dokploy-server.tailnet.ts.net  
↓  
Call Dokploy API  
↓  
Deploy
```

## Create a Tailscale OAuth client
This is the ephermal credential used by the Github Action Runner to login into our Tailscale network. You can find it under Settings -> Trust Credentials -> Add New. This credential needs *write* access to the `auth_key` scope as well as a tag (`tag:ci` this used by a Github Action we'll write later). 

Make sure to add `tag:ci` to the tagOwners group in the Tailscale ACL.

## Create a Dokploy API key
Now the Runner needs a Dokpoy API key to access our Dokploy instances API. Find it under Profiles -> Generate New Key.

## Configure the Github Actions for Tailscale and Dokploy
So the Github Action Workflow we need has to connect to Tailscale using the [official action](https://github.com/tailscale/github-action) then curl the [Dokploy API](https://docs.dokploy.com/docs/core/auto-deploy#api-method).

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: Dev
    steps:
      - name: Connect to Tailscale
        uses: tailscale/github-action@v3
        with:
          oauth-client-id: ${{ secrets.TAILSCALE_OAUTH_CLIENT_ID }}
          oauth-secret: ${{ secrets.TAILSCALE_OAUTH_SECRET }}
          tags: tag:ci

      - name: Trigger Dokploy deploy
        run: |
          curl -sf -X POST "${{ secrets.DOKPLOY_URL }}" \
            -H "accept: application/json" \
            -H "Content-Type: application/json" \
            -H "x-api-key: ${{ secrets.DOKPLOY_API_KEY }}" \
            -d '{"applicationId": "${{ secrets.DOKPLOY_APP_ID }}"}'
```

## Save secrets in Github Actions Enviornment
Now we need to add 5 secrets: `TAILSCALE_OAUTH_CLIENT_ID`, `TAILSCALE_OAUTH_SECRET`, `DOKPLOY_URL`, `DOKPLOY_API_KEY`, `DOKPLOY_APP_ID`.

Dokploy URL should look similar to `{DOKPLOY_DOMAIN}/api/application.deploy`. To find project ID, run: 
```sh
curl -X 'GET' \
        '${DOKPLOY_DOMAIN}/api/project.all' \
        -H 'accept: application/json' \
        -H 'x-api-key: ${DOKPLOY_API_KEY}
```