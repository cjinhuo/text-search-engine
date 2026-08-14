---
name: changeset-generator
description: 在创建或更新 PR 前，根据当前 pnpm workspace、公开包发布影响、Changesets 历史格式和 changesets-toolkit 提交钩子，生成并校验 Changesets 3 变更记录。用户要求添加或生成 changeset、创建 changeset、准备 PR、判断分支是否需要版本说明，或选择 major、minor、patch 版本类型时使用。
---

# 生成 PR Changeset

只有分支改动会影响公开包的消费者时才创建 changeset。始终从当前仓库读取配置，不写死仓库名、包名、目录或基础分支。

## 安全检查

- 使用 `git rev-parse --show-toplevel` 定位仓库根目录，并在根目录执行后续命令。
- 必须存在 pnpm workspace 和 `.changeset/config.json`；缺少任一项时停止。
- 从 `.changeset/config.json` 读取 `baseBranch`，仅在字段缺失时默认使用 `master`，比较基准为 `origin/<baseBranch>`。
- 当前分支不能是基础分支。执行 `git fetch origin <baseBranch>` 刷新基准；无法获取或解析基准时停止，不使用不明确的旧引用继续操作。
- 执行 `git diff --cached --quiet --`，要求暂存区为空。若已有暂存文件，列出文件并停止，因为 toolkit 钩子最终会执行 `git commit`。
- 记录执行前的 `git status --porcelain=v1`，生成后用它确认原有未暂存和未跟踪文件未被夹带或丢失。
- 执行 `pnpm exec changeset --version`，要求实际主版本为 3；同时确认 `pnpm exec changeset add --help` 包含 `--since`、`--message`、`--major`、`--minor`、`--patch`。
- 读取 Changesets 的 `commit` 配置，要求提交钩子解析到 `changesets-toolkit`。钩子未启用或指向其他模块时停止，不假设命令会自动提交。
- 不在本 skill 中安装或升级依赖、重写锁文件、放宽包管理器安全策略，也不输出 npm token 等凭据。

## 判断是否需要发布

1. 同时检查三类改动：
   - 已提交分支差异：`git diff --name-status origin/<baseBranch>...HEAD`
   - 未暂存差异：`git diff --name-status`
   - 未跟踪文件：`git ls-files --others --exclude-standard`
2. 读取根 workspace 配置及其匹配的 `package.json`。只有具备 `name`、`version` 且 `private` 不为 `true` 的包才是公开发布单元。
3. 将改动映射到最近的 workspace 包。若改动位于共享或私有包，继续追踪其代码、资源、构建产物或运行时行为是否会被公开包打包或消费。
4. 检查相对基础分支新增的 changeset，以及未跟踪的 `.changeset/*.md`，确认相同包和相同行为是否已经有发布说明。
5. 公开 API、运行时行为、发布资源、兼容性、缺陷修复或性能变化会影响消费者时，生成 changeset。
6. 纯文档、纯测试、纯 CI、纯格式化、纯私有工具改动且不改变公开产物时，说明判断依据并结束；禁止使用 `--empty`。
7. 已有 changeset 完整覆盖本次变化时，不重复生成。除非用户明确要求，否则不修改已有 changeset。

## 选择版本类型

- `major`：不兼容的公开 API 或行为变化，需要消费者迁移；摘要必须说明破坏点和迁移方式。
- `minor`：向后兼容的新功能、新导出、新选项或有意义的新能力。
- `patch`：缺陷修复、性能优化、兼容性修正或改变发布行为的非破坏性重构。
- 每个公开包选择所需的最高 bump。只有证据无法排除 major 与 minor 的实质歧义时才询问用户。
- 一个逻辑变化跨多个公开包时使用一个 changeset；Changesets 3 要求同一 bump 下的多个包名使用逗号连接。

## 编写中英文摘要

将 `--message` 写成类似 Conventional Commit 的双语 changeset 正文。它不是 Git 提交标题；实际 Git 提交标题由 toolkit 生成，例如 `chore(changeset): 🦋 package:old->new`。

每个变化必须严格按英文在前、中文在后的顺序写两行：

```text
fix: handle non-string values without throwing
fix: 修复处理非字符串值时抛错的问题
```

- 两行必须使用相同的 type，并表达相同语义。
- type 只能从当前仓库 `commitlint.config.*` 读取；这三个仓库允许 `feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`。
- 默认使用 `type: subject`，因为 changeset frontmatter 已标明包名。确需 scope 时使用 `type(scope): subject`，并确保 scope 存在于当前 commitlint 的 `scope-enum`；中英文两行的 scope 必须一致。
- major 破坏性变化在 type 或 scope 后加 `!`，例如 `feat!: remove the legacy API`。
- 英文 subject 使用简短祈使语气，中文 subject 使用对应的简洁说明；不要以句号结尾，不添加与历史不一致的 emoji。
- 每行最多 120 个字符；若当前 commitlint 启用了更严格的 `header-max-length`，使用更严格的值。
- type 描述变化性质，bump 描述 SemVer 影响，两者分别判断。不要仅凭 `feat`、`fix` 字样机械决定 bump。
- 一个 changeset 包含多个独立变化时，为每个变化写一组中英文行，并用空行分隔；不要把中英文拆成两个 changeset。

## 使用 Changesets 3 生成

只加入非空的 bump 参数，构造一条非交互命令：

```sh
pnpm exec changeset add \
  --since "origin/$base_branch" \
  --major "pkg-a,pkg-b" \
  --minor "pkg-c" \
  --patch "pkg-d" \
  --message "$summary"
```

示例中的某组包为空时，必须省略对应整项参数。将完整中英文摘要作为一个经过安全引用的参数传入；禁止插入命令替换、反引号、凭据或不受信任的 shell 片段。不要使用 `--empty` 或 `--open`。

命令应输出 `Changeset added and committed!`。changesets-toolkit 会只暂存新 changeset 并创建提交，不要再手动创建第二个提交。

## 校验结果

1. 要求命令成功退出，并从输出中取得新生成的 `.changeset/*.md` 路径。
2. 检查文件 frontmatter、公开包名、bump、中英文顺序、type、scope、单行长度和语义一致性。
3. 执行 `git diff-tree --no-commit-id --name-status -r HEAD`，要求最新提交只包含一个新增的 `.changeset/*.md`，不得包含其他路径。
4. 执行 `pnpm exec changeset status --since "origin/$base_branch"`，确认目标包和 bump 出现在发布计划中。
5. 对照执行前状态，确认原有未暂存和未跟踪文件仍然存在，且暂存区为空。
6. 报告生成或跳过结论、涉及包、bump、双语摘要、文件路径、提交哈希和校验结果。

生成、自动提交或校验任一步失败时，立即停止并原样报告错误，保留现场用于诊断。不要手写替代 changeset，也不要运行 `changeset version`、进入或退出 prerelease、publish、push 或触发发布 workflow。
