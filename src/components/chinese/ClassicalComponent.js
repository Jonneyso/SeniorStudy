// 古诗文组件（含无障碍键盘支持）
class ClassicalComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.dataManager = new DataManager();
    }

    init() {
        this.loadData();
    }

    async loadData() {
        try {
            const classicalData = await this.dataManager.getClassicalData();
            const testPointsData = await this.dataManager.getTestPointsData();
            this.render(classicalData, testPointsData);
        } catch (error) {
            console.error('加载古诗文数据失败:', error);
        }
    }

    render(classicalData, testPointsData) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = '';

        classicalData.groups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'classical-group';
            groupDiv.innerHTML = `
                <h3>${group.name}</h3>
                <div class="classical-items"></div>
            `;

            const itemsContainer = groupDiv.querySelector('.classical-items');
            group.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'classical-item';
                itemDiv.innerHTML = `
                    <h4 class="classical-title">${item.title} - ${item.author}</h4>
                    <div class="classical-detail">
                        <div class="classical-content">${item.content.replace(/\n/g, '<br>')}</div>
                        <div class="classical-annotation"><strong>注解：</strong>${item.annotation.replace(/\n/g, '<br>')}</div>
                        <div class="classical-explanation"><strong>解析：</strong>${item.explanation}</div>
                    </div>
                `;

                // 无障碍：绑定键盘 + ARIA
                const title = itemDiv.querySelector('.classical-title');
                const detail = itemDiv.querySelector('.classical-detail');
                A11y.bindToggle(title, detail);

                itemsContainer.appendChild(itemDiv);
            });

            // 考点渲染统一走公共渲染器（含来源链接支持）
            const testPointsDiv = TestPointsRenderer.render(group, testPointsData);
            if (testPointsDiv) {
                groupDiv.appendChild(testPointsDiv);
            }

            container.appendChild(groupDiv);
        });
    }
}
