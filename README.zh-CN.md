<p align="center">
  <img src="src-tauri/icons/128x128.png" alt="TShocker Logo" width="128">
</p>

<h1 align="center">TShocker</h1>

<p align="center">
  <strong>基于 TShock REST API 的桌面管理客户端</strong>
</p>

<p align="center">
  <a href="https://github.com/brushax/Tshocker/releases">
    <img src="https://img.shields.io/github/v/release/brushax/Tshocker?style=flat-square&color=blue" alt="release">
  </a>
  <a href="https://github.com/brushax/Tshocker/actions/workflows/release.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/brushax/Tshocker/release.yml?branch=main&style=flat-square" alt="build status">
  </a>
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows-lightgrey?style=flat-square" alt="platform">
  <img src="https://img.shields.io/badge/tauri-2.0-blue?style=flat-square&logo=tauri" alt="tauri">
</p>

<p align="center">
  <b>简体中文</b> | <a href="./README.md">English</a>
</p>

---

TShocker 是一个跨平台的 **[TShock](https://github.com/Pryaxis/TShock)** 服务器管理工具。通过与 TShock REST API 直接交互，提供无需进入游戏的后台管理界面。

仓库内 `public/data/` 的 Terraria 物品与 NPC 数据来自 [Terraria Wiki.gg](https://terraria.wiki.gg/wiki/Terraria_Wiki) 抓取整理。出处说明见 [NOTICE.md](./NOTICE.md)。

## 界面预览

<p align="center">
  <img src="./public/image/home.png" alt="TShocker 仪表盘截图" width="48%">
  <img src="./public/image/command.png" alt="TShocker 控制台截图" width="48%">
</p>

## 使用前提

- 已运行并启用 REST API 的 TShock 服务器。
- 具备所需 REST 权限的 TShock 账户。

## 功能特性

- **状态监控**: 查看服务器运行状态、世界信息及连接数。
- **玩家管理**: 支持踢出、封禁、禁言，以及查看玩家背包/Buff 详情。
- **数据库集成**: 内置物品与 NPC 搜索，一键发放或召唤。
- **权限管理**: 管理 TShock 权限组、前缀及权限节点分配。
- **黑名单**: 管理服务器封禁记录（IP、UUID、账户）。
- **世界事件**: 触发天气变化、入侵事件或开启自动保存。
- **控制台**: 模拟服务器控制台，支持彩色文字输出及指令执行。
- **系统维护**: 重载配置、保存世界及服务器重启/关机。

## 🚀 安装指南

### Windows

从 [Releases](https://github.com/brushax/Tshocker/releases) 下载最新的安装包。

### macOS

从 [Releases](https://github.com/brushax/Tshocker/releases) 下载 `.dmg` 或 `.app` 文件。

## 本地开发

```bash
pnpm install
pnpm test
pnpm tauri dev
pnpm tauri build
```

## 许可证

MIT
