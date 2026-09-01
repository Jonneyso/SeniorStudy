// GVC单词组件（含无障碍键盘支持）
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

    _bindToggle(triggerEl, panelEl, extraEl) {
        if (!triggerEl || !panelEl) return;
        if (!panelEl.id) {
            panelEl.id = 'gvc-panel-' + Math.random().toString(36).slice(2, 10);
        }
        triggerEl.setAttribute('role', 'button');
        triggerEl.setAttribute('tabindex', '0');
        triggerEl.setAttribute('aria-controls', panelEl.id);
        const hasShow = panelEl.classList.contains('show');
        triggerEl.setAttribute('aria-expanded', hasShow ? 'true' : 'false');
        triggerEl.setAttribute('aria-label', (triggerEl.querySelector('.english') || {}).textContent + '，展开或收起例句与解析');

        const toggle = (e) => {
            if (e) e.preventDefault();
            const willShow = !panelEl.classList.contains('show');
            panelEl.classList.toggle('show', willShow);
            triggerEl.setAttribute('aria-expanded', willShow ? 'true' : 'false');
            if (extraEl) extraEl.classList.toggle('rotated', willShow);
        };

        triggerEl.addEventListener('click', toggle);
        triggerEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                toggle(e);
            }
        });
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
                        <span class="expand-icon" aria-hidden="true">▼</span>
                    </div>
                </div>
                <div class="example">
                    <div class="question">${item.example.question}</div>
                    <div class="options">${optionsHtml}</div>
                    <div class="answer">答案: ${item.example.answer}</div>
                    <div class="explanation">解析: ${item.example.explanation}</div>
                </div>
            `;

            const example = li.querySelector('.example');
            const expandIcon = li.querySelector('.expand-icon');
            // 绑定在 vocabulary-item 本身（原交互方式不变，补充键盘）
            this._bindToggle(li, example, expandIcon);

            container.appendChild(li);
        });
    }
}
