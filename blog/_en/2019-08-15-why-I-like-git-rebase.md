---
title: Why I like "git rebase"
date: 2019-08-15
tags:
  - Git
summary: I guess when most of people getting started using `Git`, they always use `git merge` to integrate changes from another branch. But after I understood `rebase`, I can't stop loving it.
---

[繁體中文](/zh/2019/08/15/why-I-like-git-rebase/) | English

I guess when most of people getting started using `Git`, they always use `git merge` to integrate changes from another branch. But when I understand `rebase`, I can't stop loving it.

Please take a look at [documentation](https://git-scm.com/docs/git-rebase) if you've never used `git rebase` before.

## Why I like `git rebase`

### Commit history is clear and straightforward

Both `merge` and `rebase` can join two branches together, Let's take a look the difference：

`merge` will put all commits of two branches together and sort them by commit time, It's just like Dragon Ball Fusion:
![Dragon Ball](@assets/20190815/dragon-ball.gif)

`rebase` don't care about commit time. It keep every commit which comes from the same branch together. It's like the fusion in One Piece:
![One Piece](@assets/20190815/one-piece.gif)

See the difference? Even though the fusion is completed, I can still recognize each part 👍.

### The way to solve conflicts

`merge` has to generate a merge commit, maybe it can be [fast-forward](https://git-scm.com/docs/git-merge#_fast_forward_merge), but when there're conflicts, you have to solve it and commit your changes.

On the other hand, `rebase` won't generate any lengthy commit 👍.

`rebase` is actually like rebuilding the base and submit all the commits again. Whenever meeting conflicts, it'll stop to let you solve it. I personally prefer this approach since it's more clear to figure out which changes I want to keep or drop. But it's not really handy when there's a lot of commits and they all meet conflicts.

Show me the diagram:

- There's a `master` branch, and 2 branches based on `master` are developed simultaneously

![Git flow diagram - init](@assets/20190815/git-init.png)

- `feat-a` is merged, trying to `merge` `feat-b`, but get conflicts

![Git flow diagram - feat a merged](@assets/20190815/git-merge-feat-a.png)

- Resolving conflicts by `merge`, the history might be something like below. Commits are messed, and there's an additional merge commit

![Git flow diagram - feat b merged](@assets/20190815/git-merge-feat-b.png)

- If resolving conflicts by `rebase`, it'll leave a straightforward history

![Git flow diagram - feat b rebased](@assets/20190815/git-rebase.png)

Don't you think the former one is ugly? If you don't, the reviewer might think so. By the latter one, reviewer can easily understand the scope the branch (PR) affects. But if it's messed, it cannot be reviewed by each commit.

### Feel free to edit commits

It's no longer to do with joining branches together, I've mentioned something like `submit all the commits again`, since it's going to commit again, of course you can edit the commits.

[git rebase -i](https://git-scm.com/docs/git-rebase#_interactive_mode)

It'll probably show something like below:

```
pick 30e43f8 docs: update Readme
pick 4103b7e feat: add Z feature
pick b962eeb feat: add A feature
pick f296540 feat: add B feature
pick a49b581 feat: add D feature
pick 0967d97 feat: add E feature

# Rebase dc2a5e0..0967d97 onto dc2a5e0 (6 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
```

You're able to reorder, edit commit message, remove commit, or even meld some commits into a previous commit, etc. Well, it's pretty handy,

## `git push --force-with-lease`

### Usage

`rebase` is really useful, but it means you change the history. We don't care about that if the branch is just a local branch. But if you have pushed it to the remote repository, you have to run `git push -f` which is very dangerous.

Thus, I always use `git push --force-with-lease`.

> This option allows you to say that you expect the history you are updating is what you rebased and want to replace. If the remote ref still points at the commit you specified, you can be sure that no other people did anything to the ref.

If the history isn't what we expected:

```shell
git push origin master --force-with-lease
To github.com:newsbielt703/test-git-push--force-with-lease.git
 ! [rejected]        master -> master (stale info)
error: failed to push some refs to 'git@github.com:newsbielt703/test-git-push--force-with-lease.git'
```

### Bad things happened

What if you screw up, maybe you have just run `git push -f` and someone lost his/her work? No worries. I found something interesting - [git-blame-someone-else](https:/github.com/jayphelps/git-blame-someone-else). Install it and run `git blame-someone-else "yourteammate <yourteamate@gmail.com>" <commit>`. See what happen below, it's no longer your fault:

```
commit 70f45487814217d0226f7eae8d0caa0734775353 (HEAD -> master, origin/master)
Author: yourteammate <yourteammate@gmail.com>
Date:   Thu Aug 15 20:57:00 2019 +0800

    feat: add E feature

commit a202ae4447adebe5bfe3e73e678665a8bfdf6f0f
Author: yourteammate <yourteammate@gmail.com>
Date:   Thu Aug 15 20:56:43 2019 +0800

    feat: add D feature

commit be908366c98052077d893dedc28baf92dffacb71
Author: yourteammate <yourteammate@gmail.com>
Date:   Thu Aug 15 20:41:02 2019 +0800

    feat: add B feature

commit 10e6a57d3061abc55798f815a790bba6307039e5
Author: yourteammate <yourteammate@gmail.com>
Date:   Thu Aug 15 20:40:47 2019 +0800

    feat: add A feature

commit 4103b7ed93993635b2b7ac35ec2ceab79a7d6446
Author: Billyyyyy3320 <newsbielt703@gmail.com>
Date:   Thu Aug 15 20:52:04 2019 +0800

    feat: add Z feature

commit 30e43f858ef692b26380cceda5a84ac8a6c6e3d5
Author: Billyyyyy3320 <newsbielt703@gmail.com>
Date:   Thu Aug 15 20:47:59 2019 +0800

    docs: update Readme

commit dc2a5e0c60991925dd7fa4858ff367534000b380
Author: Billyyyyy3320 <newsbielt703@gmail.com>
Date:   Thu Aug 15 20:37:19 2019 +0800

    feat: init
```

It's just joking, please don't do that!<br/>
It's just joking, please don't do that!<br/>
It's just joking, please don't do that!

> This changes not only who authored the commit but the listed commiter as well. It also is something I wrote as a joke, so please don't run this against your production repo and complain if this script deletes everything.

---

End.
