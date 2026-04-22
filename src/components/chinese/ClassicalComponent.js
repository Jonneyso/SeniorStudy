// 古诗文组件
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
                <div class="test-points"></div>
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
                
                // 添加点击事件
                const title = itemDiv.querySelector('.classical-title');
                const detail = itemDiv.querySelector('.classical-detail');
                title.addEventListener('click', function() {
                    detail.classList.toggle('show');
                });
                
                itemsContainer.appendChild(itemDiv);
            });
            
            const testPointsContainer = groupDiv.querySelector('.test-points');
            testPointsContainer.innerHTML = '<h4>考点</h4>';
            
            // 收集该分组所有古诗文的考点
            const groupTestPoints = new Set();
            group.items.forEach(item => {
                item.test_points.forEach(pointId => {
                    groupTestPoints.add(pointId);
                });
            });
            
            // 展示考点
            groupTestPoints.forEach(pointId => {
                const testPoint = testPointsData.test_points.find(p => p.id === pointId);
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
                            <div class="question-source"><strong>来源：</strong><a href="${question.link}" target="_blank">${question.source}</a></div>
                            <div class="question-analysis"><strong>解析：</strong>${question.analysis}</div>
                            <div class="question-answer"><strong>参考答案：</strong>${question.answer}</div>
                        `;
                        questionsContainer.appendChild(questionDiv);
                    });
                    
                    // 添加点击事件
                    const title = testPointDiv.querySelector('.test-point-title');
                    const questions = testPointDiv.querySelector('.test-questions');
                    title.addEventListener('click', function() {
                        questions.classList.toggle('show');
                    });
                    
                    testPointsContainer.appendChild(testPointDiv);
                }
            });
            
            container.appendChild(groupDiv);
        });
    }
}