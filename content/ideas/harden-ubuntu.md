---
date: 2024-11-20
time: 19:19
draft: true
title: Harden Ubuntu security
summary: 
url: harden-ubuntu
tags:
  - til
  - linux
  - shell
---
Not as hard as I thought at least to cover to essentials. This has recently come up twice for me, first DHH talked about linux security as [locking the front door](https://youtu.be/-cEn_83zRFw?si=iYoeUfJa09DFtO6h&t=2138) then in this guide on [setting up a production ready VPS](https://www.youtube.com/watch?v=F-9KWQByeU0&t=1354s) (A+ guide BTW). Similar steps mentioned in both but I’ll go over the latter since its my current use case.

For fresh installs start by creating a new user account with `sudo` permissions. Copy over my public ssh key from my local laptop to the remote server. Then lock down ssh access to non-root users and disable password authentication only key based authentication is allowed.

Then configure the firewall: block all incoming traffic, allow all access to the public internet, allow incoming traffic from OpenSSH, and since I’m a webservice allow incoming traffic to port 80.

```bash
adduser igor                     # Add igor user
usermod -aG sudo igor            # Add igor to the group sudo
ssh-copy-id igor@1.2.3.4         # From laptop copy key to server
vi /etc/ssh/sshd_config          # Modify OpenSSH config
→ PasswordAuthentication no
→ PermitRootLogin no
→ UsePAM no
vi /etc/ssh/sshd_config.d/50-cloud-init.conf # Modify OpenSSH config
→ PasswordAuthentication no
systemctl restart ssh            # Restart SSH service
sudo ufw default deny incoming   # Block all incoming traffic
sudo ufw allow outgoing          # Allow access to public internet
sudo ufw allow OpenSSH           # Allow access from OpenSSH
sudo ufw allow http              # Allow access to port 80
sudo ufw enable
```

Optional extras are to [enable automatic updates](https://linuxcapable.com/how-to-configure-unattended-upgrades-on-ubuntu-linux/) and [protect against automated attacks](https://www.hostinger.com/tutorials/fail2ban-configuration) using [Fail2Ban](https://github.com/fail2ban/fail2ban).

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---
1. [SigStore, a way to handle signing & verification for software](https://www.sigstore.dev/)
