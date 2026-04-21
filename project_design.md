# 上海高中生学习辅助项目设计文档

## 1. 项目概述

本项目是一个为上海高中生提供学习辅助的Web应用，旨在整理和展示各科的学习知识，帮助学生更高效地复习和备考。目前已实现英语板块的GVC单词知识功能，未来将扩展到其他学科。

### 1.1 项目目标

- 提供清晰、结构化的学习知识整理
- 方便学生快速查找和复习重要知识点
- 支持多学科内容的扩展
- 提供美观、易用的用户界面

## 2. 项目结构

项目采用简单的静态网站结构，主要包含以下文件和目录：

```
SeniorStudy/
├── index.html          # 项目主页面
├── subjects/           # 学科目录
│   ├── english/        # 英语学科
│   │   ├── gvc/        # GVC单词知识
│   │   │   ├── data/   # 数据目录
│   │   │   │   ├── vocabulary.json  # GVC单词数据
│   │   │   │   └── pdf_content.txt  # PDF内容提取
│   │   │   └── package-lock.json    # 依赖锁文件
│   │   └── 上海高中英语GVC高频词汇词组（按高考考察频率排序）.pdf  # 原始PDF文件
└── project_design.md   # 项目设计文档
```

## 3. 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **数据存储**：JSON文件
- **服务器**：本地HTTP服务器（Python内置）
- **开发工具**：文本编辑器

## 4. 功能模块

### 4.1 主页面模块

- 项目标题和简介展示
- 学科卡片展示
- 学科内容导航

### 4.2 英语GVC单词模块

- GVC单词列表展示
- 单词中英文对照
- 按高考考察频率排序

## 5. 数据结构

### 5.1 GVC单词数据结构

```json
[
  {
    "id": 1,
    "english": "hold forth",
    "chinese": "展现出,充分发挥",
    "gvc": true
  },
  {
    "id": 2,
    "english": "the final stretch of the voyage",
    "chinese": "航行的最后一段路程",
    "gvc": true
  }
  // 更多单词...
]
```

### 5.2 字段说明

- `id`：单词唯一标识符
- `english`：英文单词或短语
- `chinese`：中文翻译
- `gvc`：是否为GVC单词（布尔值）

## 6. 页面设计

### 6.1 主页面设计

- 顶部导航栏：项目标题和简介
- 学科卡片区域：展示各个学科
- 内容区域：根据选择的学科展示相应内容

### 6.2 英语GVC单词页面设计

- 标题和简介
- 单词列表：中英文对照展示
- 响应式设计：适配不同屏幕尺寸

## 7. 实现细节

### 7.1 数据加载

使用JavaScript的Fetch API从JSON文件加载单词数据：

```javascript
fetch('subjects/english/gvc/data/vocabulary.json')
  .then(response => response.json())
  .then(data => {
    // 处理数据并渲染到页面
  })
  .catch(error => console.error('加载数据失败:', error));
```

### 7.2 页面渲染

使用JavaScript动态生成单词列表：

```javascript
data.forEach(item => {
  const li = document.createElement('li');
  li.className = 'vocabulary-item';
  li.innerHTML = `
    <span class="english">${item.english}</span>
    <span class="chinese">${item.chinese}</span>
  `;
  vocabularyList.appendChild(li);
});
```

### 7.3 样式设计

使用CSS3实现响应式布局和美观的界面：

- 卡片式设计
- 悬停效果
- 响应式布局
- 清晰的视觉层次

## 8. 未来扩展计划

### 8.1 学科扩展

- 数学
- 物理
- 化学
- 生物
- 历史
- 地理
- 政治

### 8.2 功能扩展

- 搜索功能
- 分类筛选
- 学习进度跟踪
- 单词测试
- 笔记功能
- 移动端适配

### 8.3 技术升级

- 引入前端框架（如React或Vue）
- 使用数据库存储数据
- 实现用户系统
- 添加后端API

## 9. 部署方案

### 9.1 本地部署

使用Python内置的HTTP服务器：

```bash
python -m http.server 8000
```

然后在浏览器中访问：`http://localhost:8000`

### 9.2 线上部署

可以部署到静态网站托管服务，如：
- GitHub Pages
- Vercel
- Netlify
- 阿里云OSS

## 10. 项目维护

### 10.1 数据更新

- 定期更新GVC单词数据
- 添加新的学科内容
- 修正错误数据

### 10.2 功能维护

- 修复bug
- 优化性能
- 添加新功能

## 11. 总结

本项目通过简单的技术栈实现了一个功能清晰、界面美观的上海高中生学习辅助应用。目前已完成英语GVC单词知识的展示，未来将继续扩展其他学科和功能，为学生提供更全面的学习支持。