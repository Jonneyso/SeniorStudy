// 语法组件（从 SubjectComponent.js 拆出，使用公共无障碍工具）
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
                    A11y.bindToggle(title, detail);

                    itemsContainer.appendChild(itemDiv);
                });

                const testPointsDiv = TestPointsRenderer.render(group, data.test_points);
                if (testPointsDiv) {
                    groupDiv.appendChild(testPointsDiv);
                }

                container.appendChild(groupDiv);
            });
        }
    }
}
