// GVC单词组件
class GVCComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.dataManager = new DataManager();
    }

    init() {
        this.loadData();
    }

    async loadData() {
        try {
            const data = await this.dataManager.getGVCData();
            this.render(data);
        } catch (error) {
            console.error('加载GVC数据失败:', error);
        }
    }

    render(data) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = '';

        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'vocabulary-item';
            
            // 构建选项HTML
            let optionsHtml = '';
            item.example.options.forEach(option => {
                optionsHtml += `<div class="option">${option}</div>`;
            });
            
            li.innerHTML = `
                <div class="vocabulary-header">
                    <div>
                        <span class="category ${item.category}">${item.category}</span>
                        <span class="english">${item.english}</span>
                    </div>
                    <div>
                        <span class="chinese">${item.chinese}</span>
                        <span class="expand-icon">▼</span>
                    </div>
                </div>
                <div class="example">
                    <div class="question">${item.example.question}</div>
                    <div class="options">${optionsHtml}</div>
                    <div class="answer">答案: ${item.example.answer}</div>
                    <div class="explanation">解析: ${item.example.explanation}</div>
                </div>
            `;
            
            // 添加点击事件
            li.addEventListener('click', function() {
                const example = this.querySelector('.example');
                const expandIcon = this.querySelector('.expand-icon');
                example.classList.toggle('show');
                expandIcon.classList.toggle('rotated');
            });
            
            container.appendChild(li);
        });
    }
}