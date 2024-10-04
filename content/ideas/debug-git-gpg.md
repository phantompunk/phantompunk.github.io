---
title: Debugging Git GPG Signing Issues
subtitle: seo subtitle
slug: debug-git-gpg
tags:
  - git
  - til
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1723301954681/b7f0774c-71c7-4cf6-8997-09c3b3ce1078.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp
draft: false
date: 2024-08-10
seoTitle: Fix Git GPG Signing Problems
seoDescription: How to debug and fix Git GPG signing issues, including tracing and identifying problems such as expired GPG keys
url: debug-git-gpg
---

I'm relatively new to signing my commits. And I recently stumbled into a new somewhat cryptic Git error. Here's what I did to debug the problem. Hope it helps you.

**The scenario:** You have Git configured to use a GPG signing key for your commits. You craft a solid commit message, hit enter, and...

```bash
> git commit -m -S "my awesome commit"

error: gpg failed to sign the data
fatal: failed to write commit object
```

So Git was not able to write our commit due to some issue with GPG. Since we don't know what the actual problem is or what a potential fix could be we need to dive deeper.

**Peeking under the hood with Git Tracing:**

To understand the execution of internal commands we can enable tracing. This helps us pinpoint the exact point of failure. To enable it, run:

```bash
GIT_TRACE=1 git commit -m -S "my awesome commit"
```

You get some output similar to:

```bash
23:38:32.290382 exec-cmd.c:139       trace: resolved executable path from Darwin stack: /Library/Developer/CommandLineTools/usr/bin/git
23:38:32.290775 exec-cmd.c:238       trace: resolved executable dir: /Library/Developer/CommandLineTools/usr/bin
23:38:32.291292 git.c:460            trace: built-in: git commit -m -S 'my awesome commit'
23:38:32.294327 run-command.c:655    trace: run_command: gpg --status-fd=2 -bsau 984DD2C2F09F6B95
error: gpg failed to sign the data
fatal: failed to write commit object
```

**Identifying the Culprit:**

In my case, I can see the last command to execute before failing was:

```bash
gpg --status-fd=2 -bsau 984DD2C2F09F6B95
```

Now, if I execute this command I might get more info on the actual problem.

```bash
[GNUPG:] KEYEXPIRED 1721848046
[GNUPG:] KEY_CONSIDERED 70F192BB37619BDBD39E43E4884DF2C2E09F6B95 3
gpg: skipped "884DF2C2E09F6B95": Unusable secret key
[GNUPG:] INV_SGNR 9 884DF2C2E09F6B95
[GNUPG:] FAILURE sign 54
gpg: signing failed: Unusable secret key
```

**Ah-ha! The Expired Key:**

So in my case, the problem is simple: an expired GPG Key. We just need to create a [new GPG Key, sign it, then upload](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) it to Github.

**Bonus Tip:**

- [In-depth discussion on debugging GPG issues](https://gist.github.com/paolocarrasco/18ca8fe6e63490ae1be23e84a7039374)
