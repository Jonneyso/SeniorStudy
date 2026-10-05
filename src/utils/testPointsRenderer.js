// 公共考点渲染器：SubjectComponent / ClassicalComponent / GrammarComponent 共用
// 数据约定（全站统一）：
//   group.items[].test_points = [考点id]
//   test_points = [{ id, name, questions: [{ content, options?, answer, explanation, source?, link? }] }]
const TestPointsRenderer = (() => {

    // 收集一个分组下所有条目引用的考点id（去重）
    function collectGroupPointIds(group) {
        const ids = new Set();
        (group.items || []).forEach(item => {
            if (Array.isArray(item.test_points)) {
                item.test_points.forEach(id => ids.add(id));
            }
        });
        return ids;
    }

    function hasTestPoints(group) {
        return collectGroupPointIds(group).size > 0;
    }

    // 来源：有 link 时渲染为可点击链接，否则纯文本
    function buildSourceHtml(question) {
        if (!question.source && !question.link) return '';
        if (question.link) {
            const text = question.source || '查看来源';
            return `<div class="question-source"><strong>来源：</strong><a href="${question.link}" target="_blank" rel="noopener noreferrer">${text}</a></div>`;
        }
        return `<div class="question-source"><strong>来源：</strong>${question.source}</div>`;
    }

    function createTestPointDiv(testPoint) {
        const div = document.createElement('div');
        div.className = 'test-point';
        div.innerHTML = `
            <h5 class="test-point-title">${testPoint.name}</h5>
            <div class="test-questions"></div>
        `;

        const questionsContainer = div.querySelector('.test-questions');
        (testPoint.questions || []).forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'test-question';
            questionDiv.innerHTML = `
                <div class="question-content"><strong>题目：</strong>${question.content}</div>
                ${Array.isArray(question.options) && question.options.length > 0
                    ? `<div class="options">${question.options.map(opt => `<div class="option">${opt}</div>`).join('')}</div>`
                    : ''}
                ${question.answer ? `<div class="question-answer"><strong>参考答案：</strong>${question.answer}</div>` : ''}
                ${question.explanation ? `<div class="question-analysis"><strong>解析：</strong>${question.explanation}</div>` : ''}
                ${buildSourceHtml(question)}
            `;
            questionsContainer.appendChild(questionDiv);
        });

        // 无障碍：考点标题可键盘开合
        A11y.bindToggle(div.querySelector('.test-point-title'), div.querySelector('.test-questions'));

        return div;
    }

    /**
     * 渲染一个分组下的「考点」区域
     * @param {Object} group - 含 items[].test_points 的分组
     * @param {Array|Object} allTestPoints - 考点数组，或含 test_points 数组的数据对象
     * @returns {HTMLElement|null} div.test-points；无考点时返回 null
     */
    function render(group, allTestPoints) {
        if (!hasTestPoints(group)) return null;

        const list = Array.isArray(allTestPoints)
            ? allTestPoints
            : (allTestPoints && Array.isArray(allTestPoints.test_points) ? allTestPoints.test_points : []);

        const wrap = document.createElement('div');
        wrap.className = 'test-points';
        wrap.innerHTML = '<h4>考点</h4>';

        collectGroupPointIds(group).forEach(pointId => {
            const testPoint = list.find(p => p.id === pointId);
            if (testPoint) {
                wrap.appendChild(createTestPointDiv(testPoint));
            }
        });

        return wrap.childElementCount > 1 ? wrap : null;
    }

    return { render, hasTestPoints };
})();
