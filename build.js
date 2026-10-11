// 构建脚本：把 index.html 引用的所有本地 JS 合并为 dist/bundle.js
// 用法：每次修改 src 下 JS 或调整 index.html 脚本列表后，运行 node build.js
// 脚本列表以 index.html 中的 <script src> 顺序为唯一事实来源
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');

// 提取 <script src="..."></script> 顺序列表（排除产物自身 dist/）
const scriptTags = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)]
    .map(m => m[1])
    .filter(src => !src.startsWith('dist/'));
if (scriptTags.length === 0) {
    console.error('错误：index.html 中未找到任何 <script src> 标签');
    process.exit(1);
}

console.log(`发现 ${scriptTags.length} 个脚本，按序合并：`);
scriptTags.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));

const header = `/* dist/bundle.js - 由 build.js 自动生成，请勿手改。修改 src 下源码后运行 node build.js 重新生成 */\n`;
const parts = scriptTags.map(file => {
    const p = path.join(__dirname, file);
    if (!fs.existsSync(p)) {
        console.error(`错误：文件不存在 ${file}`);
        process.exit(1);
    }
    const code = fs.readFileSync(p, 'utf8').trimEnd();
    return `/* ===== ${file} ===== */\n${code}`;
});

const bundle = header + parts.join('\n\n') + '\n';
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist/bundle.js'), bundle, 'utf8');
console.log(`\n已生成 dist/bundle.js (${(bundle.length / 1024).toFixed(1)} KB)`);
