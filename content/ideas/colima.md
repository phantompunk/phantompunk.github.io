---
title: Replace Docker Desktop with Colima
subtitle: Moving to Colima as a replacement for Docker Desktop
slug: colima
tags:
  - containers
  - docker
  - til
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1727731845567/dfb2cdb8-4c4a-4ca4-84a0-a6f30fa7fcaa.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp
draft: false
date: 2024-10-01
---
Ever since Docker Desktop changed is pricing model I’ve been using Rancher Desktop as a replacement. Its works fine but I recently noticed a few coworkers using [Colima](https://github.com/abiosoft/colima).

> Note: For individual users Docker Desktop is still free

Colima, is short for Containers on [Lima](https://lima-vm.io/). Where Lima is a separate tool Which aims bring ***Li***nux virtual ***Ma***chines to macOS and Linux. Apparently its used by Rancher Desktop and Podman Desktop under the hood. Colima is a minimal CLI with sensible defaults that provides container runtimes for macOS. Its compatible with the latest and greatest versions of Docker BuildKit & Compose.

Install with Homebrew to get started:

`brew install colima docker`

To start Colima with the default of 2CPU, 2Gib Memory and 60Gib Disk, run:

`colima start`

```bash
> colima start
INFO[0000] starting colima                              
INFO[0000] runtime: docker                              
INFO[0001] starting ...                                  context=vm
INFO[0013] provisioning ...                              context=docker
INFO[0014] starting ...                                  context=docker
INFO[0014] done
```

To setup Docker Compose you need `docker-compose`

`brew install docker-compose`

Setting up BuildKit takes a few more steps.

### Step 1: Set the Docker Configuration Path

The first step is to set the `DOCKER_CONFIG` environment variable to specify where Docker should look for its configuration files. Typically, Docker uses `~/.docker/` as the configuration path. Run the following command:

```bash
export DOCKER_CONFIG=~/.docker/
```

### Step 2: Create the Plugins Directory

Docker uses plugins to extend its functionality, and for BuildKit, the `docker-buildx` plugin is required. We need to ensure that the `cli-plugins` directory exists within the Docker configuration path. Create this directory with the following command:

```bash
mkdir -p $DOCKER_CONFIG/cli-plugins
```

### Step 3: Download the Buildx Plugin

Next, download the appropriate Buildx binary for macOS. If you are using an Apple Silicon (ARM64) machine, you can use the following command to download the latest release:

```bash
curl -SL https://github.com/docker/buildx/releases/download/v0.17.0/buildx-v0.17.0.darwin-arm64 -o $DOCKER_CONFIG/cli-plugins/docker-buildx
```

For Intel-based macOS machines, you would replace `arm64` with the appropriate architecture (`amd64` for Intel Macs).

### Step 4: Make the Buildx Plugin Executable

After downloading the `docker-buildx` plugin, ensure it is executable by running the following command:

```bash
chmod +x $DOCKER_CONFIG/cli-plugins/docker-buildx
```

### Step 5: Build Using BuildKit

With Buildx now installed, you can start using BuildKit to build your Docker images. Simply set the `DOCKER_BUILDKIT` environment variable to enable BuildKit, then run the Docker build command as usual:

```bash
DOCKER_BUILDKIT=1 docker build -t app:latest .
```