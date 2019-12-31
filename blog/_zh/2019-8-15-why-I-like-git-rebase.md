---
date: 2019-8-15
tag:
  - Git
summary: rebase比merge更直觀更乾淨，別再只用merge來分別分支了。
comment:
  title: Why I like "git rebase"
---

# 為什麼我愛用`git rebase`

繁體中文 | [English](/en/2019/08/15/why-I-like-git-rebase/)

這篇文章是要分享我使用的原因與時機還有似乎很多人不知道的`git push --force-with-lease`。已經很多文章在講`git rebase`了，但很多都沒有提到應該要跟`git push --force-with-lease`一起使用。

在開始之前，如果你重來沒用過`rebase`，[請服用](https://git-scm.com/docs/git-rebase)。

## 為什麼我愛用`git rebase`

### 專案的歷史非常整潔直觀

`merge`跟`rebase`都可以合併分支，那來看看他們的差別：

`merge`會把兩個分支的 commits 一樣照時間排序摻在一塊，合併為一個分支，就像七龍珠合體，合體完都摻在一起了：
![Dragon Ball](@assets/20190815/dragon-ball.gif)

`rebase`則是重定基底，兩個分支的 commits 時間我不管，但是同個分支內的 commits 都放在一起，就像海賊王合體一樣，就算合體完成我還是一看就知道是由什麼組成，因為來自哪裡都擺在一塊 👍：
![One Piece](@assets/20190815/one-piece.gif)

### 解決衝突的方式

`merge`會產生一個 merge commit，沒有衝突的情況可以 [fast-forward](https://git-scm.com/docs/git-merge#_fast_forward_merge)，但遇到衝突，就一定得要提交一個 commit 來解決衝突。

而`rebase`不會產生任何多餘的 commit 👍。

`rebase`實際上像是重定完基底後，把 commit 一個個重新提交，而遇到衝突就停下讓你解決，這樣的解衝突方法我個人滿喜歡的，一步一步的解思緒比較清楚，方便釐清當前正在做什麼，要留什麼，不留什麼。但是也有壞處，當衝突過多，要解很久，很繁瑣。

實際上我兩個都還是會用到，merge commit 可以幫助追蹤。所以我會在自己工作的分支上總是使用`rebase`來解衝突，而當要把分支併入主分支時使用`merge`。

稍微看一下差異，全都用`merge`：

![merge history](@assets/20190815/merge.png)

`rebase` + `merge`：

![rebase history](@assets/20190815/rebase.png)

### 自由修改所有 commits

這就跟合併分支無關，上面提到`rebase`把 commit 一個個重新提交，那既然可以重新提交，當然也可重新修改 commit 內容吧：

[git rebase -i](https://git-scm.com/docs/git-rebase#_interactive_mode)

大概會顯示以下這種畫面：

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

你可以重新排列 commit 順序、修改 commit message、捨棄 commit 甚至融合 commit 等等。
我個人覺得這超好用。

## 小夥伴 `git push --force-with-lease`

### 作用

`rebase` 非常好用但是有它的副作用，rebase 代表修改了歷史，如果只在本地沒有影響，但如果有推到遠端分支，這代表你得`git push -f`，但全世界都知道`git push -f`多危險。

所以我只用`git push --force-with-lease`，它會去檢查遠端分支是否有其他人做新的提交，如果不如它預期就會拒絕你 push。

> This option allows you to say that you expect the history you are updating is what you rebased and want to replace. If the remote ref still points at the commit you specified, you can be sure that no other people did anything to the ref.

被拒絕如下：

```shell
git push origin master --force-with-lease
To github.com:newsbielt703/test-git-push--force-with-lease.git
 ! [rejected]        master -> master (stale info)
error: failed to push some refs to 'git@github.com:newsbielt703/test-git-push--force-with-lease.git'
```

### 出事了怎麼辦

如果你搞砸了，傻傻地用了`git push -f`出事了怎麼辦，有個好用的東西[git-blame-someone-else](https://github.com/jayphelps/git-blame-someone-else)，安裝完後，照著 Readme 指示執行`git blame-someone-else "yourteammate <yourteamate@gmail.com>" <commit>`，再看看`git log`，不是你的錯了：

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

這段是玩笑，別真的用啊!<br/>
這段是玩笑，別真的用啊!<br/>
這段是玩笑，別真的用啊!

> This changes not only who authored the commit but the listed commiter as well. It also is something I wrote as a joke, so please don't run this against your production repo and complain if this script deletes everything.

---

End.
