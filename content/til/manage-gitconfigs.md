---
date: 2023-10-21
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
There's a better way to manage all your Git profiles. You can. use theYou can manage all your Git profiles by creating multiple sub configs. multiple configs and overriding git config settings. This enables overriding your settings or email address based on the git directory.

For example, say you have separate Git profiles for personal, work, and client work. You would then need 3 `.gitconfig` files, like this:

- ~/.gitconfig ~> main config for personal
- ~/.gitconfig-work ~> work config
- ~/.gitconfig-client ~> client config

Your main `.gitconfig` doesn't change it will act as the base for the others. The other config files will only contain the changes you want to override. To override the email with my work email I would add this:

```text
# ~/.gitconfig-work
 
[user]
email = rmoran@work.com
name = Rodrigo Moran
```

Git will use the correct config file based on the location of the git repo. This means your workspace will need to be partitioned if its not already. This is how I configure my workspace directories:

- ~/Workspace/ ~> for personal projects
- ~/Workspace/work/ ~> for work projects
- ~/Workspace/client/ ~> for client projects

Now we have to explicitly tell Git where to find the correct git config based on the current directory. In your main `.gitconfig`, append the following:

```text
[includeIf "gitdir:~/Workspace/work/"]
path = ~/.gitconfig-work
```

This means if our git directory is in `~/Workspace/work/` then use `~/.gitconfig-work` config file.

You can validate configuration by initializing a new repo in the `work` Workspace then run `git config -l`:

```shell
mkdir -p ~/Workspace/work/demo
cd ~/Workspace/work/demo
git init
git config -l

credential.helper=osxkeychain
init.defaultbranch=main
...
includeif.gitdir:~/Workspace/work/.path=~/.gitconfig-work
user.email=rmoran@work.com
user.name=Rodrigo Moran
```

You can repeat these steps for configuring more Git profiles.

```shell
client=meta
mkdir -p ~/Workspace/${client}

touch ~/.gitconfig-${client}
cat >~/.gitconfig-${client} <<EOF
# ~/Workspace/${client}/
[user]
email = <your_email>@${client}.com
name = <your_name>
EOF

cat >> ~/.gitconfig <<EOF
[includeIf "gitdir:~/Workspace/${client}/"]
path = ~/.gitconfig-${client}
EOF
```

---