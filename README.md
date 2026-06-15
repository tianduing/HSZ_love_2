# 仅予你的晴天-学习小助手

一个面向长期学习场景的 Windows 桌面应用。  
它不是直接把答案塞给用户，而是把学习材料整理成可以推进、可以回看、可以复习的问题路径，让 AI 更像一个会陪你走完整段学习过程的小助手。

## 项目定位

- 可编辑的学习路线，而不是一次性生成后就锁死
- 可追踪的答题与复习记录，而不是临时对话
- 可接入 PDF 材料的学习流程，而不是只靠空白输入
- 可配置的推进节奏，让用户决定要不要开启子问题追问

## 更新公告

### 2026-06-01

这一版把项目从“AI 学习原型”推进到了更完整的作品形态：

- 新增项目管理增强：支持重命名、归档、复制、删除、标签和分类
- 新增路线编辑能力：支持手动增题、删题、改题、上下调整顺序
- 新增 PDF 解析接入：导入后自动提取页内容与文本分块，为后续文档学习和轻量 RAG 打底
- 新增休闲区：加入诗词补全与成语释义小游戏，补一点文学素养，也让整体体验更完整
- 新增子问题策略开关：现在可以在设置里选择“支持生成子问题”或“只保留主线推进”
- 收紧了若干前端布局与信息层级问题，让学习页和休闲区的推进感更清楚

## 当前能力

- AI 自动生成主线学习路径
- 基于 PDF 材料的本地片段检索与页码级出处绑定
- 主线答题、即时反馈、历史记录留存
- 教练反馈中的材料引用与回看建议
- 复习抽题与复习记录回看
- 薄弱点诊断与薄弱节点优先复习
- 项目库筛选、分类、标签、归档
- 路线节点可编辑
- PDF 导入与文本切块
- 本地持久化存档
- 自定义主题与背景
- 休闲区小游戏

## 本地开发

```powershell
cd E:\study-quest-desktop
$env:npm_config_cache = "E:\study-quest-desktop\.npm-cache"
$env:ELECTRON_CACHE = "E:\study-quest-desktop\.electron-cache"
$env:ELECTRON_BUILDER_CACHE = "E:\study-quest-desktop\.electron-builder-cache"
npm install
npm start
```

## 语法检查

```powershell
cd E:\study-quest-desktop
npm run check
```

## 打包安装版

```powershell
cd E:\study-quest-desktop
$env:npm_config_cache = "E:\study-quest-desktop\.npm-cache"
$env:ELECTRON_CACHE = "E:\study-quest-desktop\.electron-cache"
$env:ELECTRON_BUILDER_CACHE = "E:\study-quest-desktop\.electron-builder-cache"
npm run dist:win
```

## 后续可以继续做的方向

- 基于文档分块的来源引用与轻量 RAG
- 错题本与薄弱点聚类
- 学习总结卡片与导出
- 更完整的休闲区内容，比如飞花令、成语接龙、诗句排序

## GitHub

- 仓库地址：[study-quest-desktop](https://github.com/tianduing/HSZ_love_2)
- 简历版项目说明：[docs/resume-project-summary.md](docs/resume-project-summary.md)
- 多模态增强版简历文案：[docs/resume-project-summary-multi-agent.md](docs/resume-project-summary-multi-agent.md)

## 简历版项目描述

项目名称：AI 资料驱动学习助手（Electron Desktop）

项目背景：
传统 AI 学习产品大多停留在单轮问答，学习材料、答题反馈与复习回看相互割裂，用户很难把一份 PDF 材料真正沉淀成可推进、可追溯、可复盘的长期学习流程。项目目标是构建一个资料驱动的桌面学习助手，把“导入材料 - 生成路线 - 回答问题 - 诊断弱项 - 发起复习”串成完整闭环。

技术栈：
Electron + Node.js + Vanilla JavaScript + OpenAI 兼容大模型接口 + PDF.js + 本地 JSON 持久化 + 轻量检索 / 引用引擎

量化结果：
- 搭建 6 个核心模块：项目管理、路线生成、PDF 导入、答题评估、复习回看、弱项诊断
- 设计 5 类训练模板、3 档学习者画像、4 种复习模式，单项目支持 5-30 个主线问题自动拆解
- 打通 3 条资料引用链路：路线生成、答题反馈、复习回看；支持 12 页预览与 64 段文本分块的本地 PDF 检索

简历投递可直接使用：
- 基于 Electron 与 OpenAI 兼容大模型接口开发 AI 学习助手，围绕长期学习场景构建“资料导入 - 路线生成 - 问答评估 - 弱项诊断 - 复习回看”闭环，完成桌面端产品从 0 到 1 搭建。
- 设计 5 类学习教练模板与 3 档学习者画像，支持单项目 5-30 个主线问题自动拆解，并通过多轮追问与结构化评分提升学习路径的可执行性与可复盘性。
- 接入 PDF.js 与本地轻量检索模块，实现页码级材料解析、12 页预览、64 段文本分块及 3 条引用链路回溯，在答题反馈和复习环节提供可追溯证据支撑。
