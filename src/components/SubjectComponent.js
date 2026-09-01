// 通用学科组件（含无障碍键盘支持：role / tabindex / aria-* / Enter & Space 触发）
class SubjectComponent {
    constructor(containerId, dataPath, config = {}) {
        this.containerId = containerId;
        this.dataPath = dataPath;
        this.config = config;
        this.dataManager = new DataManager();
    }

    init() {
        this.loadData();
    }

    async loadData() {
        try {
            const data = await this.fetchData();
            this.render(data);
        } catch (error) {
            console.error('加载数据失败:', error);
            this.renderError();
        }
    }

    async fetchData() {
        const response = await fetch(this.dataPath);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }

    render(data) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = '';

        if (data.groups) {
            this.renderGroups(data, container);
        } else if (data.items) {
            this.renderItems(data.items, container);
        }
    }

    renderGroups(data, container) {
        data.groups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'classical-group';
            groupDiv.innerHTML = `<h3>${group.name}</h3>`;

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'classical-items';

            if (group.items) {
                group.items.forEach(item => {
                    const itemDiv = this.createItemElement(item);
                    itemsContainer.appendChild(itemDiv);
                });
            }

            groupDiv.appendChild(itemsContainer);

            if (data.test_points && this.hasTestPoints(group, data.test_points)) {
                const testPointsDiv = this.createTestPointsDiv(group, data.test_points);
                groupDiv.appendChild(testPointsDiv);
            }

            container.appendChild(groupDiv);
        });
    }

    renderItems(items, container) {
        items.forEach(item => {
            const itemDiv = this.createItemElement(item);
            container.appendChild(itemDiv);
        });
    }

    /**
     * 无障碍：把一个可点击但非 <button> 的元素当作按钮使用（折叠/展开）
     * @param {HTMLElement} triggerEl 触发元素
     * @param {HTMLElement} panelEl  被控制的面板
     * @param {Function} [onToggle]   折叠/展开切换时额外调用的回调(show:boolean)
     */
    _bindToggle(triggerEl, panelEl, onToggle) {
        if (!triggerEl || !panelEl) return;
        // 确保面板有稳定 id，aria-controls 需要
        if (!panelEl.id) {
            panelEl.id = 'sbj-panel-' + Math.random().toString(36).slice(2, 10);
        }
        triggerEl.setAttribute('role', 'button');
        triggerEl.setAttribute('tabindex', '0');
        triggerEl.setAttribute('aria-controls', panelEl.id);
        // aria-expanded 初始状态取决于 .show 是否已存在
        const hasShow = panelEl.classList.contains('show');
        triggerEl.setAttribute('aria-expanded', hasShow ? 'true' : 'false');

        const toggle = (e) => {
            if (e) e.preventDefault();
            const willShow = !panelEl.classList.contains('show');
            panelEl.classList.toggle('show', willShow);
            triggerEl.setAttribute('aria-expanded', willShow ? 'true' : 'false');
            if (typeof onToggle === 'function') onToggle(willShow);
        };

        triggerEl.addEventListener('click', toggle);
        triggerEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                toggle(e);
            }
        });
    }

    createItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'classical-item';

        let detailContent = `<div class="classical-content">${item.content.replace(/\n/g, '<br>')}</div>`;

        if (item.annotation) {
            detailContent += `<div class="classical-annotation"><strong>注解：</strong>${item.annotation.replace(/\n/g, '<br>')}</div>`;
        }

        if (item.explanation) {
            detailContent += `<div class="classical-explanation"><strong>解析：</strong>${item.explanation}</div>`;
        }

        if (item.examples && Array.isArray(item.examples)) {
            detailContent += `<div class="classical-annotation"><strong>例句：</strong>${item.examples.join('<br>')}</div>`;
        }

        itemDiv.innerHTML = `
            <h4 class="classical-title">${item.title}</h4>
            <div class="classical-detail">
                ${detailContent}
            </div>
        `;

        const title = itemDiv.querySelector('.classical-title');
        const detail = itemDiv.querySelector('.classical-detail');
        this._bindToggle(title, detail);

        return itemDiv;
    }

    hasTestPoints(group, allTestPoints) {
        if (!group.items) return false;
        for (const item of group.items) {
            if (item.test_points && item.test_points.length > 0) {
                return true;
            }
        }
        return false;
    }

    createTestPointsDiv(group, allTestPoints) {
        const testPointsDiv = document.createElement('div');
        testPointsDiv.className = 'test-points';
        testPointsDiv.innerHTML = '<h4>考点</h4>';

        const groupTestPoints = new Set();
        group.items.forEach(item => {
            if (item.test_points) {
                item.test_points.forEach(pointId => {
                    groupTestPoints.add(pointId);
                });
            }
        });

        groupTestPoints.forEach(pointId => {
            const testPoint = allTestPoints.find(p => p.id === pointId);
            if (testPoint) {
                const testPointDiv = document.createElement('div');
                testPointDiv.className = 'test-point';
                testPointDiv.innerHTML = `
                    <h5 class="test-point-title">${testPoint.name}</h5>
                    <div class="test-questions"></div>
                `;

                const questionsContainer = testPointDiv.querySelector('.test-questions');
                testPoint.questions.forEach(question => {
                    const questionDiv = document.createElement('div');
                    questionDiv.className = 'test-question';
                    questionDiv.innerHTML = `
                        <div class="question-content"><strong>题目：</strong>${question.content}</div>
                        ${question.options ? `<div class="options">${question.options.map(opt => `<div class="option">${opt}</div>`).join('')}</div>` : ''}
                        <div class="question-answer"><strong>参考答案：</strong>${question.answer}</div>
                        ${question.explanation ? `<div class="question-analysis"><strong>解析：</strong>${question.explanation}</div>` : ''}
                        ${question.source ? `<div class="question-source"><strong>来源：</strong>${question.source}</div>` : ''}
                    `;
                    questionsContainer.appendChild(questionDiv);
                });

                const title = testPointDiv.querySelector('.test-point-title');
                const questions = testPointDiv.querySelector('.test-questions');
                this._bindToggle(title, questions);

                testPointsDiv.appendChild(testPointDiv);
            }
        });

        return testPointsDiv;
    }

    renderError() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = '<p style="color: red; text-align: center;">数据加载失败，请稍后重试</p>';
    }
}

// 语法组件（同 SubjectComponent 共享无障碍辅助逻辑）
class GrammarComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.dataManager = new DataManager();
    }

    init() {
        this.loadData();
    }

    async loadData() {
        try {
            const data = await this.dataManager.getGrammarData();
            this.render(data);
        } catch (error) {
            console.error('加载语法数据失败:', error);
        }
    }

    _bindToggle(triggerEl, panelEl) {
        if (!triggerEl || !panelEl) return;
        if (!panelEl.id) {
            panelEl.id = 'gram-panel-' + Math.random().toString(36).slice(2, 10);
        }
        triggerEl.setAttribute('role', 'button');
        triggerEl.setAttribute('tabindex', '0');
        triggerEl.setAttribute('aria-controls', panelEl.id);
        const hasShow = panelEl.classList.contains('show');
        triggerEl.setAttribute('aria-expanded', hasShow ? 'true' : 'false');

        const toggle = (e) => {
            if (e) e.preventDefault();
            const willShow = !panelEl.classList.contains('show');
            panelEl.classList.toggle('show', willShow);
            triggerEl.setAttribute('aria-expanded', willShow ? 'true' : 'false');
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

        if (data.groups) {
            data.groups.forEach(group => {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'classical-group';
                groupDiv.innerHTML = `<h3>${group.name}</h3><div class="classical-items"></div>`;

                const itemsContainer = groupDiv.querySelector('.classical-items');
                group.items.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'classical-item';

                    let examplesHtml = '';
                    if (item.examples && item.examples.length > 0) {
                        examplesHtml = `<div class="classical-annotation"><strong>例句：</strong>${item.examples.map(ex => `<div style="margin: 5px 0;">${ex}</div>`).join('')}</div>`;
                    }

                    itemDiv.innerHTML = `
                        <h4 class="classical-title">${item.title}</h4>
                        <div class="classical-detail">
                            <div class="classical-content">${item.content.replace(/\n/g, '<br>')}</div>
                            ${examplesHtml}
                        </div>
                    `;

                    const title = itemDiv.querySelector('.classical-title');
                    const detail = itemDiv.querySelector('.classical-detail');
                    this._bindToggle(title, detail);

                    itemsContainer.appendChild(itemDiv);
                });

                container.appendChild(groupDiv);
            });
        }
    }
}
