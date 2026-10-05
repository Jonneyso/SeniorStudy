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

                if (data.test_points && this.hasTestPoints(group)) {
                    groupDiv.appendChild(this.createTestPointsDiv(group, data.test_points));
                }

                container.appendChild(groupDiv);
            });
        }
    }

    hasTestPoints(group) {
        return group.items.some(item => item.test_points && item.test_points.length > 0);
    }

    createTestPointsDiv(group, allTestPoints) {
        const testPointsDiv = document.createElement('div');
        testPointsDiv.className = 'test-points';
        testPointsDiv.innerHTML = '<h4>考点</h4>';

        const groupTestPoints = new Set();
        group.items.forEach(item => {
            if (item.test_points) {
                item.test_points.forEach(pointId => groupTestPoints.add(pointId));
            }
        });

        groupTestPoints.forEach(pointId => {
            const testPoint = allTestPoints.find(p => p.id === pointId);
            if (!testPoint) return;

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
            A11y.bindToggle(title, questions);

            testPointsDiv.appendChild(testPointDiv);
        });

        return testPointsDiv;
    }
}
