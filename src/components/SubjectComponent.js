// 通用学科组件（使用公共无障碍工具 A11y.bindToggle）
class SubjectComponent {
    constructor(containerId, dataPath, config = {}) {
        this.containerId = containerId;
        this.dataPath = dataPath;
        this.config = config;
        // 优先使用外部传入的 dataManager（共享缓存），否则自建
        this.dataManager = config.dataManager || new DataManager();
    }

    init() {
        this.loadData();
    }

    async loadData() {
        try {
            // 若 config 中指定了 dataMethod，走兼容接口；否则按 dataPath 直连
            let data;
            if (this.config.dataMethod && typeof this.dataManager[this.config.dataMethod] === 'function') {
                data = await this.dataManager[this.config.dataMethod]();
            } else if (this.dataPath) {
                data = await this.dataManager.fetchData(this.dataPath);
            }
            this.render(data);
        } catch (error) {
            console.error('加载数据失败:', error);
            this.renderError();
        }
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

            const testPointsDiv = TestPointsRenderer.render(group, data.test_points);
            if (testPointsDiv) {
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
        A11y.bindToggle(title, detail);

        return itemDiv;
    }

    renderError() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = '<p style="color: red; text-align: center;">数据加载失败，请稍后重试</p>';
    }
}
