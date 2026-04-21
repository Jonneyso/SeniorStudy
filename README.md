# 上海高中生学习辅助项目

## 项目简介

本项目是一个为上海高中生提供学习辅助的Web应用，旨在整理和展示各科的学习知识，帮助学生更高效地复习和备考。目前已实现英语板块的GVC单词知识功能。

## 项目结构

```
SeniorStudy/
├── index.html          # 项目主页面
├── README.md           # 项目说明文档
├── project_design.md   # 项目设计文档
├── subjects/           # 学科目录
│   ├── english/        # 英语学科
│   │   ├── gvc/        # GVC单词知识
│   │   │   ├── data/   # 数据目录
│   │   │   │   ├── vocabulary.json  # GVC单词数据
│   │   │   │   └── pdf_content.txt  # PDF内容提取
│   │   │   └── package-lock.json    # 依赖锁文件
│   │   └── 上海高中英语GVC高频词汇词组（按高考考察频率排序）.pdf  # 原始PDF文件
```

## 如何启动服务

### 方法一：使用Python内置HTTP服务器

1. 打开命令提示符（Windows）或终端（Mac/Linux）
2. 导航到项目目录：
   ```bash
   cd c:\Users\su\Documents\trae_projects\SeniorStudy
   ```
3. 启动HTTP服务器：
   ```bash
   python -m http.server 8000
   ```
4. 服务器将在端口8000上运行

### 方法二：直接打开HTML文件

1. 找到项目根目录中的 `index.html` 文件
2. 双击该文件，将在默认浏览器中打开

## 如何访问

### 通过本地服务器访问

如果使用方法一启动了HTTP服务器，在浏览器中访问：
```
http://localhost:8000
```

### 直接访问

如果使用方法二直接打开HTML文件，浏览器会自动加载页面。

## 功能说明

### 主页面

- 展示项目标题和简介
- 显示学科卡片
- 提供学科内容导航

### 英语GVC单词知识

- 展示上海高中GVC高频词汇词组
- 按高考考察频率排序
- 提供中英文对照

## 未来计划

- 扩展其他学科内容
- 添加搜索和筛选功能
- 实现学习进度跟踪
- 开发移动端适配

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **数据存储**：JSON文件
- **服务器**：Python内置HTTP服务器

## 维护说明

### 数据更新

要更新GVC单词数据，请编辑 `subjects/english/gvc/data/vocabulary.json` 文件，按照现有格式添加或修改单词。

### 功能扩展

要添加新的学科或功能，请按照现有项目结构创建相应的目录和文件。

## 联系方式

如有问题或建议，请联系项目维护者。