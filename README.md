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
