# 批量搜索与 Blazwitcher 迁移验收记录

日期：2026-10-08。SDK 分支：`codex/batch-search-ts7`；消费者分支：`codex/batch-search-migration`。

## 已实现

- SDK / Demo 使用 TypeScript 7.0.2；Jest 使用 SWC，类型检查独立运行。
- 原生编译器生成生产声明目录；保留 ESM、CJS、IIFE、pure IIFE 与 React 入口。
- `searchItems` / `createSearcher` 支持字符串、对象单字段、多字段以及准确字段名推导。
- 多字段无分隔符组合匹配，整体与字段范围均为闭区间。实例保存快照、懒构建拼音映射并复用。
- Blazwitcher 在侧边栏复用搜索器；后台只提取域名，Port 不再传输拼音映射。
- 保留合并范围后的 0.6 严格度；标题高亮加回前导空白偏移。
- 更新 Demo、中英文 README、npm README 与接入技能。

## 检查结果

| 检查 | 结果 |
| --- | --- |
| SDK 原有 Jest 测试（工具链升级阶段） | 65/65 通过 |
| SDK 全量 Jest 测试（包含新增 API） | 85/85 通过 |
| SDK / Demo 全量类型检查与构建 | 通过 |
| 独立打包消费者：TypeScript 7.0.2、5.5.4、5.9.2 | 全部通过，关闭 skipLibCheck 验证完整声明及 React 类型 |
| 发布包 ESM、CJS、IIFE、pure IIFE、React 运行入口 | 通过 |
| 生产声明排除测试、内部相对引用完整 | 通过 |
| Blazwitcher Vitest | 19 个文件，312 项测试通过 |
| Blazwitcher Chrome MV3 生产构建 | 通过 |
| 两仓库 frozen-lockfile 安装 | 通过 |
| Blazwitcher 全量类型检查对照 | 修改前后均 105 项已有诊断；去除位置变化后无新增诊断 |
| 接入技能验证、修改文件 Biome、diff 空白检查 | 通过 |

新增覆盖包括字段与排序回调的推导、只读/联合类型、getter 互斥、错误字段和值类型；
拼音、跨字段分词和边界匹配；懒映射复用、快照与结果数组隔离、大小写转换导致长度变化时的原文坐标；真实 SDK 新旧行为对照。

稀疏数组回归覆盖字符串列表、对象列表及全为空槽的列表：跳过空槽，保留原始下标、重复项、
getter 收到的下标及条目引用。三个回归用例在修复前均复现读取 `entry.source` 的异常，修复后通过。

React 集成测试验证连续输入不重建搜索器、无关展示配置不重建、连续匹配开关及原列表改变后重建；
验证 `/b`、`/h`、`/t` 空输入及跨字段查询、加载中输入、原有 `/e` 和兜底流程。
Port hook 测试验证首包、帧内分片合并和最终消息刷新，不在每条分片上更新列表。

浏览器验证了 Demo 的拼音列表过滤、多字段 `jk github`、切换到 `typescript`、无结果和空输入。
浏览器安全策略拒绝 `chrome://extensions/` 协议，原生扩展 UI 与真实 Chrome 首屏 TTI 未验证。

## Online Demo 接入验收

学校列表通过 `useMemo([originalList])` 创建搜索器，连续输入仅调用 `search()`；
增删条目会生成新列表并重建实例。多字段示例复用固定条目的搜索器，用 `fieldHitRanges` 分别渲染标题与域名。
React 高亮组件通过发布入口 `text-search-engine/react` 引入。

在生产预览 `http://127.0.0.1:5178/text-search-engine/` 上完成以下浏览器验证：

| 场景 | 验证结果 |
| --- | --- |
| 学校列表连续输入 `b` → `bei` → `beijing` | 179 → 52 → 34 项，`beijing` 高亮原文“北京” |
| 大小写：`BEIJING`、`MIT` | 分别 34、1 项；`MIT` 高亮原文大写字符 |
| 空输入 / 全空白输入 | 恢复全部 248 条原始数据，不显示搜索高亮 |
| 无匹配查询 | 0 项并显示 `No Matches Found` |
| 查询 `qzv731` 时新增测试条目 | 0 → 1 项，立即显示正确高亮 |
| 删除该测试条目 | 1 → 0 项，无需修改查询；测试数据已移除 |
| 多字段 `jk github` / `github jk` | 同时高亮标题“监控”和域名 `github` |
| 多字段 `jk` / `github` | 仅对应字段高亮，未命中字段保持完整原文 |
| 跨边界单词 `平台github` | 命中同一条目，标题“平台”与域名 `github` 分别高亮 |
| 多字段空输入 / 空白输入 / 无结果 | 原始两条数据 / 原始两条数据 / 无结果提示 |
| `MIT` 查询后刷新页面 | URL 查询、输入框与结果一致 |
| 从搜索地址返回不带 `kw` 的地址 | 输入框清空并恢复 248 条；已修复旧的残留查询问题 |
| 浏览器错误日志 | 验证结束时未记录 error 日志 |

另外使用真实的 248 条学校数据，对比生产 CJS 包的新 API 与原 Demo 的手工映射、连续性检查、
范围合并和排序流程。15 个查询的条目、顺序和高亮完全一致：
`b`、`bei`、`beijing`、`BEIJING`、`fujian`、`zhog`、`MIT`、`stanford`、`985`、
`beijing 985`、`Massachusetts`、`qinghua`、`shanghai`、`University`、`zzzzzzzz987654321`。

Demo 接入验收阶段的 `pnpm --filter online-demo build` 通过 SDK 构建、Demo TypeScript 7 类型检查与 Vite 生产构建；
Demo 修改文件的 Biome 与 diff 空白检查通过。浏览器验收时加载的生产文件为 `index-9VQnfbFf.js`。
以上是本地生产预览验收，尚未部署线上站点。

## 审查后修复与待处理项

- 已修复稀疏数组空槽导致查询抛错的问题，补充三个回归测试；85 项测试、类型检查及 SDK / Demo 构建通过。
- 待处理：大小写转换展开字符在 `mergeSpaces: false` 时可能还原为重叠范围。
  例如字段 `{ title: 'İ', host: 'x' }` 和查询 `"i \u0307x"` 会产生重复标题高亮。
  需要在还原原文坐标后合并重叠范围，再生成字段高亮。

## 性能与包体积

环境：Node 22.22.2、macOS arm64。固定样本为 `React 监控平台 {index}` 与 `docs{index}.example.com`；
查询 `jk example`。热查询先预热 20 次，9 轮取中位数。数据保存在 `benchmark/items-results.json`。

| 条目数 | 首包 20 条快照 ms | 全列表重建 ms | 冷查询含快照 ms | 热查询 ms | 旧链路热匹配 ms | 原始消息 bytes | 旧预处理消息 bytes |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 0.009 | 0.037 | 1.694 | 0.772 | 0.705 | 6,181 | 76,101 |
| 1,000 | 0.005 | 0.206 | 9.602 | 7.143 | 6.746 | 63,781 | 790,701 |
| 10,000 | 0.008 | 3.379 | 107.318 | 82.896 | 73.738 | 657,781 | 8,206,701 |

该基准测量 CPU 处理阶段和 JSON 消息长度，首包快照耗时不等于真实扩展首屏 TTI。
新热查询还会生成结果对象及字段高亮，旧热匹配列只调用旧匹配函数，因此不能据此声称匹配速度提升。
10,000 条时消息长度减少约 92%；查询仍遍历全部条目，数据很大时应关注主线程延迟。

| Chrome MV3 JavaScript 产物 | 迁移前 bytes | 迁移后 bytes |
| --- | ---: | ---: |
| background | 375,844 | 34,612 |
| sidepanel | 2,024,265 | 2,025,564 |
| 全部 JavaScript | 4,376,566 | 4,036,915 |

主要变化是拼音字典从 background 移至已有搜索模块的侧边栏；侧边栏增加约 2 KB，全部 JavaScript 减少约 340 KB。

## 初次验收时的版本与交付状态

- SDK minor changeset：`.changeset/shy-jokes-knock.md`；toolkit 自动提交 `7bbddc77`。
- Blazwitcher patch changeset：`.changeset/floppy-memes-dream.md`；toolkit 自动提交 `c8d0079`。
- 初次验收时两个自动提交均只包含 changeset，源码修改保留在工作区；当时未推送、发布或合并。
- Blazwitcher 使用 `vendor/text-search-engine-batch-search.tgz` 本地快照，锁文件记录校验和。
  快照保留当前 SDK 包版本 1.5.3，尚未发布至 npm。minor 正式发布后，应固定该已发布版本并移除快照。

## 复现

SDK 仓库：

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm test
pnpm --filter text-search-engine benchmark:items
pnpm --filter text-search-engine pack --pack-destination /tmp/text-search-engine-package
cd packages/text-search-engine
node scripts/verify-package.mjs /tmp/text-search-engine-package/text-search-engine-*.tgz ../../node_modules/.bin/tsc
```

Blazwitcher 仓库：

```sh
pnpm install --frozen-lockfile
pnpm --filter blazwitcher test
pnpm --filter blazwitcher build
```
