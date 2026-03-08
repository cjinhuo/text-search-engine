# Overview

## 配置
在 `.changeset/config.json` 中配置
```json
"changelog": ["changesets-toolkit/dist/changelog.js", {}],
"commit": ["changesets-toolkit/dist/commit.js", {}],
"updateInternalDependencies": "patch",
```

## github token 
如果想获取 changeset 提交人的用户名需要配置 github token 到 `CHANGESET_READ_REPO_TOKEN` 到环境变量中，如果没有配置则默认使用 changeset 提交人邮箱。

获取 token 方法：
1. 登录 github，进入 `Settings` -> `Developer settings` -> `Personal access tokens` -> `Tokens (classic)`
2. 点击 `Generate new token` 按钮，生成一个 token
3. 勾选 `read repo` 权限
4. 复制 token 到环境变量中

## commit
在运行 `npx changeset` 时，会自动生成 commit message，格式如下：
`chore(changeset): 🦋 @package-name:patch`

## changelog
在运行 `npx changeset version` 时，做如下步骤：
1. 解析 `.changeset/config.json` 下的文件内容，并按照一定格式写入 changelog，格式如下
```md
- feat: this is test @xxx · 2025-xx-xx · [#xxx](https://xxx)
- feat: 这是测试 @xxx · 2025-xx-xx · [#xxx](https://xxx)
```
2. 当子包更新时，父包的 changelog 也会更新，格式如下
```md
- Updated By @mono/core: 0.0.1->0.0.2
  - feat: this is test @xxx · 2025-xx-xx · [#xxx](https://xxx)
  - feat: 这是测试 @xxx · 2025-xx-xx · [#xxx](https://xxx)
```

## changeset_version
接收三个可选参数：
###  --no-git-push
表示 bump version 后不会自动 push

### --beta
无需使用 `changeset pre enter` 来进入和 `changeset pre exit` 退出 pre 模式，仅需 `changeset_version --beta` 就会在每次 bump 时 version + 1。

如果没有使用 --beta 则更新至 release 版本

### --filter
表示只 bump 某些包的 version，支持 micromatch，例如： `--filter @mono/changesets` 或 `--filter @mono/*` 

## changeset_publish
接收一个可选参数：
### --no-git-tag
表示 publish 后不打 tag
