# Study Quest 学练闯关

一个偏“闯关式学习教练”的 Windows 桌面应用原型。

它不是直接把答案灌给用户，而是把学习内容拆成主问题卡组，再根据回答继续追问、纠错、解锁子问题，并把每一次答题与复习都保存下来，方便形成长期正反馈。

## 这版已经完成的内容

- 卡片式分区界面，不再把所有内容挤在一个页面
- `任务总览`、`闯关答题`、`随机复习`、`接口设置` 四个独立视图
- AI 自动生成主问题路线
- 每答一题就留下持久化记录
- 支持子问题衍生与节点点亮
- 过关提示音
- 随机复习抽题
- Windows 安装包构建

## 目录位置

- 项目目录：`E:\study-quest-desktop`
- 本地存档目录：`E:\StudyQuestData\app-data`
- 安装包输出目录：`E:\study-quest-desktop\release`

## 已生成的安装包

当前已成功构建：

- `E:\study-quest-desktop\release\Study-Quest-Setup-0.2.0.exe`

这是一个 NSIS 安装程序，支持：

- 自选安装目录
- 桌面快捷方式
- 开始菜单快捷方式

## 本地开发

```powershell
cd E:\study-quest-desktop
$env:npm_config_cache = "E:\study-quest-desktop\.npm-cache"
$env:ELECTRON_CACHE = "E:\study-quest-desktop\.electron-cache"
$env:ELECTRON_BUILDER_CACHE = "E:\study-quest-desktop\.electron-builder-cache"
npm install
npm start
```

## 构建安装包

```powershell
cd E:\study-quest-desktop
$env:npm_config_cache = "E:\study-quest-desktop\.npm-cache"
$env:ELECTRON_CACHE = "E:\study-quest-desktop\.electron-cache"
$env:ELECTRON_BUILDER_CACHE = "E:\study-quest-desktop\.electron-builder-cache"
npm run dist:win
```

## 接口配置

应用使用 OpenAI Responses 风格接口，请把根地址填成类似：

- `https://codex.ximuai.com`

程序会自动补成：

- `https://codex.ximuai.com/v1/responses`

在应用设置页保存：

- `Base URL`
- `模型名称`
- `API Key`

## 后续很值得继续做

- 自定义应用图标与安装器品牌图
- 学习总结卡片自动生成
- 错题回炉模式
- 导出 Markdown / JSON / PDF
- GitHub 同步或云端备份
