---
date: 2023-10-11
draft: true
title: Manage Git Configs
subtitle: 
summary: 
cover: 
tags:
  - git
  - shell
  - til
url: manage-git-configs
---
There's a better way to manage all your Git profiles. By adding:

```shell
[includeIf "gitdir:/path/to/group/"]
    path = /path/to/foo.inc
```

to your main git config you can conditionally include config options from another source. This essentially enables having multiple git configs for each git identity.

For example, say you have 3 separate Git profiles for personal, clientA, and clientB. You would then need 3 `.gitconfig` files, like this:

- ~/.gitconfig ~> main config for personal
- ~/.gitconfig-clientA ~> config for clientA 
- ~/.gitconfig-clientB ~> config for clientB 

Your main `.gitconfig` doesn't change it will act as the base for the others. The other config files will only contain the changes you want to override. To override the email I would add this:

```shell
# ~/.gitconfig-clientA
 
[user]
email = rmoran@clienta.com
```

Git will use the updated config file based on the location of the git repo. This means your workspace will need to be partitioned if its not already. This is how I configure my workspace directories:

- ~/Workspace/ ~> for personal projects
- ~/Workspace/clientA/ ~> for clientA projects
- ~/Workspace/clientB/ ~> for clientB projects

Now we have to explicitly tell Git which files to include the git repo directory. In your main `.gitconfig`, append the following:

```shell
[includeIf "gitdir:~/Workspace/clientA/"]
path = ~/.gitconfig-clientA
```

This means if our git directory is in `~/Workspace/clientA/` then include `~/.gitconfig-clientA` config file.

You can validate configuration by initializing a new repo in the `clientA` Workspace then run `git config -l`:

```shell
mkdir -p ~/Workspace/clientA/demo
cd ~/Workspace/clientA/demo
git init
git config -l

# 
# ...
# includeif.gitdir:~/Workspace/clientA/.path=~/.gitconfig-clientA
# user.email=rmoran@clienta.com
```

You can repeat these steps for configuring more Git profiles.

```shell
email=<your_email>
client=<client>
mkdir -p ~/Workspace/${client}

touch ~/.gitconfig-${client}
cat >~/.gitconfig-${client} <<EOF
# ~/Workspace/${client}/
[user]
email = ${email}@${client}.com
EOF

cat >> ~/.gitconfig <<EOF
[includeIf "gitdir:~/Workspace/${client}/"]
path = ~/.gitconfig-${client}
EOF
```

---
### References
1. *Git Docs.* [Git documentation on conditional includes](https://git-scm.com/docs/git-config#_includes)