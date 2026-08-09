// 课本思维导图组件
class TextbookComponent {
    constructor(containerId, subjectKey) {
        this.containerId = containerId;
        this.subjectKey = subjectKey;
        this.dataManager = new DataManager();
        this.currentData = null;
    }

    init() {
        this.loadData();
        this.ensureModalExists();
    }

    async loadData() {
        try {
            const data = await this.dataManager.getTextbookData(this.subjectKey);
            this.currentData = data;
            this.render(data);
        } catch (error) {
            console.error('加载课本数据失败:', error);
            this.renderError();
        }
    }

    ensureModalExists() {
        // 全局只创建一个模态框
        if (document.getElementById('textbook-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'textbook-modal';
        modal.className = 'textbook-modal';
        modal.innerHTML = `
            <div class="textbook-modal-content">
                <span class="textbook-modal-close">&times;</span>
                <div id="textbook-modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.textbook-modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    render(data) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = '';

        if (!data || !data.textbooks || data.textbooks.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">暂无课本数据</p>';
            return;
        }

        // 课本章节导航
        const nav = document.createElement('div');
        nav.className = 'textbook-nav';
        nav.innerHTML = `<h3>${data.subject}课本思维导图</h3><div class="textbook-tabs"></div>`;
        const tabsContainer = nav.querySelector('.textbook-tabs');
        container.appendChild(nav);

        // 提示信息
        const tip = document.createElement('p');
        tip.className = 'textbook-tip';
        tip.textContent = '提示：点击章节节点查看知识点、考点和测试题';
        container.appendChild(tip);

        // 内容区域
        const contentArea = document.createElement('div');
        contentArea.className = 'textbook-content-area';
        container.appendChild(contentArea);

        // 为每本课本创建标签和思维导图
        data.textbooks.forEach((textbook, index) => {
            const tab = document.createElement('button');
            tab.className = 'textbook-tab';
            tab.textContent = textbook.name;
            tab.dataset.textbookId = textbook.id;
            if (index === 0) tab.classList.add('active');
            tab.addEventListener('click', () => this.showTextbook(textbook.id, data));
            tabsContainer.appendChild(tab);
        });

        if (data.textbooks.length > 0) {
            this.showTextbook(data.textbooks[0].id, data);
        }
    }

    showTextbook(textbookId, data) {
        const tabs = document.querySelectorAll(`#${this.containerId} .textbook-tab`);
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.textbookId === textbookId);
        });

        const contentArea = document.querySelector(`#${this.containerId} .textbook-content-area`);
        if (!contentArea) return;

        const textbook = data.textbooks.find(t => t.id === textbookId);
        if (!textbook) return;

        contentArea.innerHTML = '';
        const mindMap = this.createMindMap(textbook);
        contentArea.appendChild(mindMap);
    }

    createMindMap(textbook) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mind-map-wrapper';

        const title = document.createElement('h4');
        title.className = 'mind-map-title';
        title.textContent = `${textbook.name} - 知识点思维导图`;
        wrapper.appendChild(title);

        const mindMap = document.createElement('div');
        mindMap.className = 'mind-map';

        const root = document.createElement('div');
        root.className = 'mind-map-root';
        root.textContent = textbook.name;
        mindMap.appendChild(root);

        const branches = document.createElement('div');
        branches.className = 'mind-map-branches';

        textbook.chapters.forEach(chapter => {
            const branch = document.createElement('div');
            branch.className = 'mind-map-branch';

            const chapterNode = document.createElement('div');
            chapterNode.className = 'mind-map-chapter';
            chapterNode.textContent = chapter.name;
            // 添加点击事件
            chapterNode.addEventListener('click', () => this.showChapterDetail(chapter, textbook));
            // 添加可点击指示
            chapterNode.title = '点击查看知识点、考点和测试题';

            // 如果有详细内容，添加可点击标识
            if (chapter.knowledge_points || chapter.exam_points || chapter.test_questions) {
                chapterNode.classList.add('clickable');
                const indicator = document.createElement('span');
                indicator.className = 'chapter-indicator';
                indicator.textContent = ' 📖';
                chapterNode.appendChild(indicator);
            }

            branch.appendChild(chapterNode);

            if (chapter.topics && chapter.topics.length > 0) {
                const topicsContainer = document.createElement('div');
                topicsContainer.className = 'mind-map-topics';

                chapter.topics.forEach(topic => {
                    const topicNode = document.createElement('div');
                    topicNode.className = 'mind-map-topic';
                    topicNode.textContent = topic;
                    topicsContainer.appendChild(topicNode);
                });

                branch.appendChild(topicsContainer);
            }

            branches.appendChild(branch);
        });

        mindMap.appendChild(branches);
        wrapper.appendChild(mindMap);
        return wrapper;
    }

    showChapterDetail(chapter, textbook) {
        const modal = document.getElementById('textbook-modal');
        const modalBody = document.getElementById('textbook-modal-body');
        if (!modal || !modalBody) return;

        let html = `
            <div class="chapter-detail-header">
                <h2>${textbook.name} - ${chapter.name}</h2>
                <div class="chapter-detail-meta">
                    <span class="detail-tag">📚 ${textbook.name}</span>
                    <span class="detail-tag">📝 ${chapter.topics ? chapter.topics.length : 0} 个知识点</span>
                    ${chapter.test_questions ? `<span class="detail-tag">✍️ ${chapter.test_questions.length} 道测试题</span>` : ''}
                </div>
            </div>
        `;

        // 知识点列表
        if (chapter.topics && chapter.topics.length > 0) {
            html += `<div class="detail-section">
                <h3 class="detail-section-title">📌 知识点列表</h3>
                <div class="topics-list">`;
            chapter.topics.forEach(topic => {
                html += `<span class="topic-tag">${topic}</span>`;
            });
            html += `</div></div>`;
        }

        // 详细知识点
        if (chapter.knowledge_points && chapter.knowledge_points.length > 0) {
            html += `<div class="detail-section">
                <h3 class="detail-section-title">📖 知识点详解</h3>`;
            chapter.knowledge_points.forEach(kp => {
                html += `<div class="knowledge-point">
                    <h4>${kp.title}</h4>
                    <p>${kp.content}</p>
                </div>`;
            });
            html += `</div>`;
        }

        // 考点
        if (chapter.exam_points && chapter.exam_points.length > 0) {
            html += `<div class="detail-section">
                <h3 class="detail-section-title">🎯 考点分析</h3>`;
            chapter.exam_points.forEach(ep => {
                html += `<div class="exam-point">
                    <h4>${ep.name}</h4>
                    <p>${ep.content}</p>
                </div>`;
            });
            html += `</div>`;
        }

        // 测试题
        if (chapter.test_questions && chapter.test_questions.length > 0) {
            html += `<div class="detail-section">
                <h3 class="detail-section-title">✍️ 单元测试题（来自上海市重点中学大型考试）</h3>`;
            chapter.test_questions.forEach((q, idx) => {
                html += `<div class="test-question">
                    <div class="question-header">
                        <span class="question-number">第${idx + 1}题</span>
                        <span class="question-type">${q.type}</span>
                        <span class="question-source">${q.source}</span>
                    </div>
                    <div class="question-content">${q.content}</div>`;
                if (q.options && q.options.length > 0) {
                    html += `<div class="question-options">`;
                    q.options.forEach(opt => {
                        html += `<div class="option">${opt}</div>`;
                    });
                    html += `</div>`;
                }
                html += `<div class="question-answer">
                    <strong>【答案】</strong>${q.answer}
                </div>
                <div class="question-explanation">
                    <strong>【解析】</strong>${q.explanation}
                </div>
            </div>`;
            });
            html += `</div>`;
        } else {
            html += `<div class="detail-section">
                <h3 class="detail-section-title">✍️ 单元测试题</h3>
                <p class="no-content">暂无测试题</p>
            </div>`;
        }

        modalBody.innerHTML = html;
        modal.style.display = 'block';
    }

    renderError() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        container.innerHTML = '<p style="color: red; text-align: center;">课本数据加载失败，请稍后重试</p>';
    }
}
