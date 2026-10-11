/* dist/bundle.js - 由 build.js 自动生成，请勿手改。修改 src 下源码后运行 node build.js 重新生成 */
/* ===== src/services/DataService.js ===== */
// 数据服务类 - 重构版：路径映射表 + 通用get方法 + 8秒超时
class DataService {
    // 数据路径映射表：新增分类只需在此加一行
    static DATA_PATH_MAP = {
        // 英语
        gvc: 'subjects/english/gvc/data/vocabulary.json',
        grammar: 'subjects/english/grammar/data/grammar.json',
        // 语文
        classical: 'subjects/chinese/classical/data/classical.json',
        testPoints: 'subjects/chinese/classical/data/test_points.json',
        // 数学
        mathAlgebra: 'subjects/math/algebra/data/algebra.json',
        mathGeometry: 'subjects/math/geometry/data/geometry.json',
        mathCalculus: 'subjects/math/calculus/data/calculus.json',
        // 物理
        physicsMechanics: 'subjects/physics/mechanics/data/mechanics.json',
        physicsThermodynamics: 'subjects/physics/thermodynamics/data/thermodynamics.json',
        physicsElectricity: 'subjects/physics/electricity/data/electricity.json',
        // 化学
        chemistryInorganic: 'subjects/chemistry/inorganic/data/inorganic.json',
        chemistryOrganic: 'subjects/chemistry/organic/data/organic.json',
        chemistryPhysical: 'subjects/chemistry/physical/data/physical.json',
        // 地理
        geographyPhysical: 'subjects/geography/physical/data/physical.json',
        geographyHuman: 'subjects/geography/human/data/human.json',
        geographyRegional: 'subjects/geography/regional/data/regional.json',
        // 历史
        historyAncient: 'subjects/history/ancient/data/ancient.json',
        historyModern: 'subjects/history/modern/data/modern.json',
        historyContemporary: 'subjects/history/contemporary/data/contemporary.json',
        // 政治
        politicsEconomics: 'subjects/politics/economics/data/economics.json',
        politicsPolitics: 'subjects/politics/politics/data/politics.json',
        politicsPhilosophy: 'subjects/politics/philosophy/data/philosophy.json',
        // 生物
        biologyCell: 'subjects/biology/cell/data/cell.json',
        biologyGenetics: 'subjects/biology/genetics/data/genetics.json',
        biologyEcology: 'subjects/biology/ecology/data/ecology.json',
    };

    static FETCH_TIMEOUT_MS = 8000;

    /**
     * 带超时的 fetch 封装
     * @param {string} path - 请求路径
     * @returns {Promise<any>} - 解析后的 JSON 数据
     */
    async _fetchWithTimeout(path) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DataService.FETCH_TIMEOUT_MS);
        try {
            const response = await fetch(path, { signal: controller.signal });
            if (!response.ok) {
                throw new Error(`Network response was not ok (status ${response.status})`);
            }
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`请求超时：${path}（${DataService.FETCH_TIMEOUT_MS / 1000}秒未响应）`);
            }
            console.error(`Error fetching "${path}":`, error);
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * 通用数据获取方法
     * @param {string} key - DATA_PATH_MAP 中的键名
     * @returns {Promise<any>} - 数据
     */
    async get(key) {
        const path = DataService.DATA_PATH_MAP[key];
        if (!path) {
            throw new Error(`未知的数据键: "${key}"`);
        }
        return this._fetchWithTimeout(path);
    }

    /**
     * 获取课本数据（路径形式与普通数据略有不同，按学科key拼接）
     * @param {string} subjectKey - 学科key
     * @returns {Promise<any>}
     */
    async getTextbookData(subjectKey) {
        return this._fetchWithTimeout(`subjects/${subjectKey}/textbooks.json`);
    }

    /**
     * 通用路径获取（保留原有的 fetchData，作为底层接口）
     * @param {string} path - 完整路径
     * @returns {Promise<any>}
     */
    async fetchData(path) {
        return this._fetchWithTimeout(path);
    }

    // ======== 以下为兼容旧代码的别名方法（内部调用通用 get） ========
    async getGVCData() { return this.get('gvc'); }
    async getClassicalData() { return this.get('classical'); }
    async getTestPointsData() { return this.get('testPoints'); }
    async getGrammarData() { return this.get('grammar'); }
    async getMathAlgebraData() { return this.get('mathAlgebra'); }
    async getMathGeometryData() { return this.get('mathGeometry'); }
    async getMathCalculusData() { return this.get('mathCalculus'); }
    async getPhysicsMechanicsData() { return this.get('physicsMechanics'); }
    async getPhysicsThermodynamicsData() { return this.get('physicsThermodynamics'); }
    async getPhysicsElectricityData() { return this.get('physicsElectricity'); }
    async getChemistryInorganicData() { return this.get('chemistryInorganic'); }
    async getChemistryOrganicData() { return this.get('chemistryOrganic'); }
    async getChemistryPhysicalData() { return this.get('chemistryPhysical'); }
    async getGeographyPhysicalData() { return this.get('geographyPhysical'); }
    async getGeographyHumanData() { return this.get('geographyHuman'); }
    async getGeographyRegionalData() { return this.get('geographyRegional'); }
    async getHistoryAncientData() { return this.get('historyAncient'); }
    async getHistoryModernData() { return this.get('historyModern'); }
    async getHistoryContemporaryData() { return this.get('historyContemporary'); }
    async getPoliticsEconomicsData() { return this.get('politicsEconomics'); }
    async getPoliticsPoliticsData() { return this.get('politicsPolitics'); }
    async getPoliticsPhilosophyData() { return this.get('politicsPhilosophy'); }
    async getBiologyCellData() { return this.get('biologyCell'); }
    async getBiologyGeneticsData() { return this.get('biologyGenetics'); }
    async getBiologyEcologyData() { return this.get('biologyEcology'); }
}

/* ===== src/services/DataManager.js ===== */
// 数据管理类 - 重构版：通用get方法 + Map缓存
class DataManager {
    constructor() {
        this.cache = new Map();
        this.dataService = new DataService();
    }

    /**
     * 通用数据获取方法（内置缓存）
     * @param {string} key - 数据键名
     * @returns {Promise<any>} - 数据
     */
    async get(key) {
        const cacheKey = key;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.get(key);
        this.cache.set(cacheKey, data);
        return data;
    }

    /**
     * 获取课本数据（内置缓存，cacheKey按学科区分）
     * @param {string} subjectKey - 学科key
     * @returns {Promise<any>}
     */
    async getTextbookData(subjectKey) {
        const cacheKey = `textbookData_${subjectKey}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getTextbookData(subjectKey);
        this.cache.set(cacheKey, data);
        return data;
    }

    // 缓存管理工具方法
    clearCache() { this.cache.clear(); }
    clearCacheKey(key) { this.cache.delete(key); }
    hasCache(key) { return this.cache.has(key); }
    getCacheSize() { return this.cache.size; }

    // ======== 以下为兼容旧代码的别名方法（内部调用通用 get） ========
    async getGVCData() { return this.get('gvc'); }
    async getClassicalData() { return this.get('classical'); }
    async getTestPointsData() { return this.get('testPoints'); }
    async getGrammarData() { return this.get('grammar'); }
    async getMathAlgebraData() { return this.get('mathAlgebra'); }
    async getMathGeometryData() { return this.get('mathGeometry'); }
    async getMathCalculusData() { return this.get('mathCalculus'); }
    async getPhysicsMechanicsData() { return this.get('physicsMechanics'); }
    async getPhysicsThermodynamicsData() { return this.get('physicsThermodynamics'); }
    async getPhysicsElectricityData() { return this.get('physicsElectricity'); }
    async getChemistryInorganicData() { return this.get('chemistryInorganic'); }
    async getChemistryOrganicData() { return this.get('chemistryOrganic'); }
    async getChemistryPhysicalData() { return this.get('chemistryPhysical'); }
    async getGeographyPhysicalData() { return this.get('geographyPhysical'); }
    async getGeographyHumanData() { return this.get('geographyHuman'); }
    async getGeographyRegionalData() { return this.get('geographyRegional'); }
    async getHistoryAncientData() { return this.get('historyAncient'); }
    async getHistoryModernData() { return this.get('historyModern'); }
    async getHistoryContemporaryData() { return this.get('historyContemporary'); }
    async getPoliticsEconomicsData() { return this.get('politicsEconomics'); }
    async getPoliticsPoliticsData() { return this.get('politicsPolitics'); }
    async getPoliticsPhilosophyData() { return this.get('politicsPhilosophy'); }
    async getBiologyCellData() { return this.get('biologyCell'); }
    async getBiologyGeneticsData() { return this.get('biologyGenetics'); }
    async getBiologyEcologyData() { return this.get('biologyEcology'); }
}

/* ===== src/utils/accessibility.js ===== */
// 无障碍工具函数（纯行为，不改变视觉样式）
// 统一为各组件的可点击非 button 元素提供键盘支持与 ARIA 属性

const A11y = (() => {
    // 生成稳定唯一 id（用于 aria-controls）
    let _counter = 0;
    function genId(prefix) {
        _counter += 1;
        return `${prefix}-${Date.now().toString(36)}-${_counter}`;
    }

    /**
     * 把一个可点击但非 <button> 的元素当作按钮使用（折叠/展开）
     * @param {HTMLElement} triggerEl  触发元素
     * @param {HTMLElement} panelEl    被控制的面板
     * @param {Function} [onToggle]    折叠/展开切换时额外回调(show:boolean)
     */
    function bindToggle(triggerEl, panelEl, onToggle) {
        if (!triggerEl || !panelEl) return;

        if (!panelEl.id) {
            panelEl.id = genId('a11y-panel');
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
            if (typeof onToggle === 'function') onToggle(willShow);
        };

        triggerEl.addEventListener('click', toggle);
        triggerEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                toggle(e);
            }
        });
    }

    /**
     * 给「点击后打开模态框」的元素绑定键盘支持
     * @param {HTMLElement} triggerEl  触发元素
     * @param {Function} openFn         打开模态框的回调
     */
    function bindOpenDialog(triggerEl, openFn) {
        if (!triggerEl) return;
        triggerEl.setAttribute('role', 'button');
        triggerEl.setAttribute('tabindex', '0');
        triggerEl.setAttribute('aria-haspopup', 'dialog');

        const open = (e) => {
            if (e) e.preventDefault();
            openFn();
        };

        triggerEl.addEventListener('click', open);
        triggerEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                open(e);
            }
        });
    }

    /**
     * 模态框焦点陷阱：打开模态框后把 Tab/Shift+Tab 限制在模态框内
     * @param {HTMLElement} modalEl  模态框根元素（应带 role=dialog）
     * @returns {Function} 取消陷阱的清理函数
     */
    function trapFocus(modalEl) {
        if (!modalEl) return () => {};

        const focusableSelector = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(',');

        const handler = (e) => {
            if (e.key !== 'Tab') return;
            const focusable = Array.from(modalEl.querySelectorAll(focusableSelector))
                .filter((el) => el.offsetParent !== null || el === document.activeElement);
            if (focusable.length === 0) {
                e.preventDefault();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        modalEl.addEventListener('keydown', handler);
        return () => modalEl.removeEventListener('keydown', handler);
    }

    return { bindToggle, bindOpenDialog, trapFocus };
})();

/* ===== src/utils/testPointsRenderer.js ===== */
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

/* ===== src/components/SubjectComponent.js ===== */
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

/* ===== src/components/english/GrammarComponent.js ===== */
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

/* ===== src/components/TextbookComponent.js ===== */
// 课本思维导图组件（含无障碍键盘支持）
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
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'textbook-modal-title');
        modal.innerHTML = `
            <div class="textbook-modal-content" role="document">
                <button type="button" class="textbook-modal-close" aria-label="关闭章节详情">&times;</button>
                <div id="textbook-modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // 焦点陷阱：Tab/Shift+Tab 不离开模态框
        this._untrapFocus = A11y.trapFocus(modal);

        modal.querySelector('.textbook-modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
        // Esc 关闭模态框（无障碍要求）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                this.closeModal(modal);
            }
        });
    }

    closeModal(modal) {
        modal.style.display = 'none';
        // 焦点回到触发模态框的章节节点（上次触发的会被保存）
        if (this._lastFocusedChapter && typeof this._lastFocusedChapter.focus === 'function') {
            this._lastFocusedChapter.focus();
        }
    }

    /**
     * 无障碍：给一个「点击后打开模态框」的元素绑定键盘支持
     */
    _bindOpenDialog(triggerEl, openFn) {
        if (!triggerEl) return;
        triggerEl.setAttribute('role', 'button');
        triggerEl.setAttribute('tabindex', '0');
        triggerEl.setAttribute('aria-haspopup', 'dialog');

        const open = (e) => {
            if (e) e.preventDefault();
            this._lastFocusedChapter = triggerEl;
            openFn();
            // 打开后把焦点放到模态框关闭按钮
            requestAnimationFrame(() => {
                const btn = document.querySelector('#textbook-modal .textbook-modal-close');
                if (btn && typeof btn.focus === 'function') btn.focus();
            });
        };

        triggerEl.addEventListener('click', open);
        triggerEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                open(e);
            }
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
        nav.setAttribute('role', 'tablist');
        nav.setAttribute('aria-label', data.subject + '课本切换');
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
            tab.type = 'button';
            tab.className = 'textbook-tab';
            tab.setAttribute('role', 'tab');
            const panelId = `tb-panel-${this.subjectKey}-${textbook.id}`;
            tab.id = `tb-tab-${this.subjectKey}-${textbook.id}`;
            tab.setAttribute('aria-controls', panelId);
            tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
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
            const isActive = tab.dataset.textbookId === textbookId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        const contentArea = document.querySelector(`#${this.containerId} .textbook-content-area`);
        if (!contentArea) return;

        const textbook = data.textbooks.find(t => t.id === textbookId);
        if (!textbook) return;

        contentArea.id = `tb-panel-${this.subjectKey}-${textbookId}`;
        contentArea.setAttribute('role', 'tabpanel');
        contentArea.setAttribute('aria-labelledby', `tb-tab-${this.subjectKey}-${textbookId}`);

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

            // 添加可点击指示
            chapterNode.title = '点击查看知识点、考点和测试题';

            // 如果有详细内容，添加可点击标识 + 无障碍绑定
            if (chapter.knowledge_points || chapter.exam_points || chapter.test_questions) {
                chapterNode.classList.add('clickable');
                const indicator = document.createElement('span');
                indicator.className = 'chapter-indicator';
                indicator.textContent = ' 📖';
                chapterNode.appendChild(indicator);
                this._bindOpenDialog(chapterNode, () => this.showChapterDetail(chapter, textbook));
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
                <h2 id="textbook-modal-title">${textbook.name} - ${chapter.name}</h2>
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

/* ===== src/components/english/GVCComponent.js ===== */
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
            A11y.bindToggle(li, example, (show) => {
                if (expandIcon) expandIcon.classList.toggle('rotated', show);
            });
            // 补充 aria-label（原有行为）
            li.setAttribute('aria-label', (li.querySelector('.english') || {}).textContent + '，展开或收起例句与解析');

            container.appendChild(li);
        });
    }
}

/* ===== src/components/chinese/ClassicalComponent.js ===== */
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

/* ===== src/main.js ===== */
// 主应用脚本 - 重构版：配置表驱动 + 通用初始化 + 缓存共享
class App {
    // 学科知识模块配置表：新增模块只需在此加一行
    // dataKey 对应 DataService.DATA_PATH_MAP 中的键名（新版通用 get 用）
    // dataMethod 保留兼容旧 SubjectComponent 接口
    static SUBJECT_MODULE_CONFIG = [
        // 数学
        { containerId: 'math-algebra-content',        dataKey: 'mathAlgebra',        dataMethod: 'getMathAlgebraData' },
        { containerId: 'math-geometry-content',       dataKey: 'mathGeometry',       dataMethod: 'getMathGeometryData' },
        { containerId: 'math-calculus-content',       dataKey: 'mathCalculus',       dataMethod: 'getMathCalculusData' },
        // 物理
        { containerId: 'physics-mechanics-content',   dataKey: 'physicsMechanics',   dataMethod: 'getPhysicsMechanicsData' },
        { containerId: 'physics-thermodynamics-content', dataKey: 'physicsThermodynamics', dataMethod: 'getPhysicsThermodynamicsData' },
        { containerId: 'physics-electricity-content', dataKey: 'physicsElectricity', dataMethod: 'getPhysicsElectricityData' },
        // 化学
        { containerId: 'chemistry-inorganic-content', dataKey: 'chemistryInorganic', dataMethod: 'getChemistryInorganicData' },
        { containerId: 'chemistry-organic-content',   dataKey: 'chemistryOrganic',   dataMethod: 'getChemistryOrganicData' },
        { containerId: 'chemistry-physical-content',  dataKey: 'chemistryPhysical',  dataMethod: 'getChemistryPhysicalData' },
        // 地理
        { containerId: 'geography-physical-content',  dataKey: 'geographyPhysical',  dataMethod: 'getGeographyPhysicalData' },
        { containerId: 'geography-human-content',     dataKey: 'geographyHuman',     dataMethod: 'getGeographyHumanData' },
        { containerId: 'geography-regional-content',  dataKey: 'geographyRegional',  dataMethod: 'getGeographyRegionalData' },
        // 历史（修复：之前近代史/现代史都错误地调用了古代史方法）
        { containerId: 'history-ancient-content',     dataKey: 'historyAncient',     dataMethod: 'getHistoryAncientData' },
        { containerId: 'history-modern-content',      dataKey: 'historyModern',      dataMethod: 'getHistoryModernData' },       // ✅ 修复
        { containerId: 'history-contemporary-content', dataKey: 'historyContemporary', dataMethod: 'getHistoryContemporaryData' }, // ✅ 修复
        // 政治（修复：之前政治生活/哲学生活都错误地调用了经济生活方法）
        { containerId: 'politics-economics-content',  dataKey: 'politicsEconomics',  dataMethod: 'getPoliticsEconomicsData' },
        { containerId: 'politics-politics-content',   dataKey: 'politicsPolitics',   dataMethod: 'getPoliticsPoliticsData' },     // ✅ 修复
        { containerId: 'politics-philosophy-content', dataKey: 'politicsPhilosophy', dataMethod: 'getPoliticsPhilosophyData' },   // ✅ 修复
        // 生物（修复：之前遗传学/生态学都错误地调用了细胞生物学方法）
        { containerId: 'biology-cell-content',        dataKey: 'biologyCell',        dataMethod: 'getBiologyCellData' },
        { containerId: 'biology-genetics-content',    dataKey: 'biologyGenetics',    dataMethod: 'getBiologyGeneticsData' },       // ✅ 修复
        { containerId: 'biology-ecology-content',     dataKey: 'biologyEcology',     dataMethod: 'getBiologyEcologyData' },        // ✅ 修复
    ];

    // 课本思维导图配置表
    static TEXTBOOK_CONFIG = [
        { containerId: 'chinese-textbook-content',  subjectKey: 'chinese' },
        { containerId: 'math-textbook-content',     subjectKey: 'math' },
        { containerId: 'english-textbook-content',  subjectKey: 'english' },
        { containerId: 'physics-textbook-content',  subjectKey: 'physics' },
        { containerId: 'chemistry-textbook-content', subjectKey: 'chemistry' },
        { containerId: 'geography-textbook-content', subjectKey: 'geography' },
        { containerId: 'history-textbook-content',  subjectKey: 'history' },
        { containerId: 'politics-textbook-content', subjectKey: 'politics' },
        { containerId: 'biology-textbook-content',  subjectKey: 'biology' },
    ];

    static BACK_TO_TOP_THRESHOLD = 300;

    constructor() {
        // 共享一个 DataManager 实例，让所有模块共用缓存
        this.sharedDataManager = new DataManager();
        // 懒加载注册表：gvc-container id -> 首次激活时执行的数据加载函数
        this.lazyLoaders = {};
        this.init();
    }

    init() {
        this.initComponents();
        this.initEventListeners();
        this.initSubjectCardsViewport();
        this.initBackToTopButton();
        this.initHashRouting();
    }

    // 学科折叠卡视口联动：桌面（>768px）默认全开，移动端默认收起
    initSubjectCardsViewport() {
        const mq = window.matchMedia('(max-width: 768px)');
        const apply = () => {
            document.querySelectorAll('details.subject-card').forEach(card => {
                card.open = !mq.matches;
            });
        };
        if (typeof mq.addEventListener === 'function') {
            mq.addEventListener('change', apply);
        } else if (typeof mq.addListener === 'function') {
            mq.addListener(apply); // 兼容旧浏览器
        }
        apply();
    }

    // 初始化各类组件（全部改为懒加载：首次激活对应容器时才 fetch JSON）
    initComponents() {
        // 1) 英语 GVC（词汇）组件
        if (document.getElementById('vocabulary-list')) {
            const gvcComponent = new GVCComponent('vocabulary-list');
            this.registerLazyLoader('gvc', () => gvcComponent.init());
        }

        // 2) 语文古诗文组件
        if (document.getElementById('classical-content')) {
            const classicalComponent = new ClassicalComponent('classical-content');
            this.registerLazyLoader('classical', () => classicalComponent.init());
        }

        // 3) 英语语法组件
        if (document.getElementById('english-grammar-content')) {
            const grammarComponent = new GrammarComponent('english-grammar-content');
            this.registerLazyLoader('english-grammar', () => grammarComponent.init());
        }

        // 4) 学科知识模块（使用通用初始化函数 + 配置表）
        this.initSubjectModules();

        // 5) 课本思维导图组件
        this.initTextbookComponents();
    }

    // 注册懒加载器：containerId 为 .gvc-container 的 id（与卡片链接 hash 一致）
    registerLazyLoader(containerId, loader) {
        if (containerId && typeof loader === 'function') {
            this.lazyLoaders[containerId] = loader;
        }
    }

    // 首次激活容器时触发对应数据加载（只执行一次）
    ensureLoaded(containerId) {
        const loader = this.lazyLoaders[containerId];
        if (loader) {
            delete this.lazyLoaders[containerId];
            loader();
        }
    }

    /**
     * 通用知识模块初始化函数：遍历 SUBJECT_MODULE_CONFIG 创建 SubjectComponent
     * 不立即加载，注册到懒加载注册表，等首次激活对应内容区时才 fetch
     */
    initSubjectModules() {
        App.SUBJECT_MODULE_CONFIG.forEach(mod => {
            const container = document.getElementById(mod.containerId);
            if (!container) return;

            // 通过 config 传入共享 dataManager，避免构造函数内自建造成浪费
            const component = new SubjectComponent(mod.containerId, null, {
                dataMethod: mod.dataMethod,
                dataManager: this.sharedDataManager
            });

            component.loadData = async () => {
                try {
                    // 使用新版通用 dataManager.get()，同时保留通过 dataMethod 兼容接口调用能力
                    const data = await this.sharedDataManager.get(mod.dataKey);
                    component.render(data);
                } catch (error) {
                    console.error(`加载数据失败 [${mod.dataKey}]:`, error);
                    component.renderError();
                }
            };

            const wrapper = container.closest('.gvc-container');
            if (wrapper) {
                this.registerLazyLoader(wrapper.id, () => component.loadData());
            } else {
                component.loadData(); // 兜底：无包裹容器时保持立即加载
            }
        });
    }

    // 初始化课本思维导图组件（懒加载）
    initTextbookComponents() {
        App.TEXTBOOK_CONFIG.forEach(item => {
            if (!document.getElementById(item.containerId)) return;
            const textbookComponent = new TextbookComponent(item.containerId, item.subjectKey);
            this.registerLazyLoader(item.containerId, () => textbookComponent.init());
        });
    }

    // 初始化学科卡片内的知识模块点击事件
    initEventListeners() {
        const subjectLinks = document.querySelectorAll('.content-list a');
        subjectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.showContent(targetId, { updateHash: true, scroll: true });
            });
        });
    }

    /**
     * 显示指定内容容器（添加 .active 类），并可选地：
     * - 更新 URL hash
     * - 平滑滚动到内容区
     * @param {string} targetId - 容器ID（不含 #）
     * @param {{updateHash?: boolean, scroll?: boolean}} options
     */
    showContent(targetId, options = {}) {
        const { updateHash = false, scroll = false } = options;

        // 隐藏所有内容容器
        document.querySelectorAll('.gvc-container').forEach(container => {
            container.classList.remove('active');
        });

        const targetContainer = document.getElementById(targetId);
        if (!targetContainer) {
            console.warn(`[App.showContent] 未找到目标容器: #${targetId}`);
            return;
        }

        targetContainer.classList.add('active');

        // 懒加载：首次激活该容器时才加载对应数据
        this.ensureLoaded(targetId);

        if (updateHash) {
            // 使用 replaceState 避免在 history 中添加过多重复条目
            const newUrl = `${window.location.pathname}${window.location.search}#${targetId}`;
            if (window.location.hash !== `#${targetId}`) {
                history.replaceState(null, '', newUrl);
            }
        }

        if (scroll) {
            // 给一点延迟让 active 类先应用，确保元素高度正确
            setTimeout(() => {
                targetContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }
    }

    // 读取页面 URL 的 hash，自动定位到对应模块（支持刷新/分享链接直达）
    initHashRouting() {
        const activateFromHash = () => {
            const hash = window.location.hash.slice(1);
            if (!hash) return;
            if (document.getElementById(hash)) {
                this.showContent(hash, { updateHash: false, scroll: true });
            }
        };

        // 页面初次加载：若 URL 带 hash 则激活对应内容
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            activateFromHash();
        } else {
            window.addEventListener('DOMContentLoaded', activateFromHash);
        }

        // 用户点击浏览器前进/后退按钮时，同步切换内容
        window.addEventListener('hashchange', activateFromHash);
    }

    // 返回顶部按钮
    initBackToTopButton() {
        // 先注入按钮元素
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'back-to-top';
        btn.setAttribute('aria-label', '返回顶部');
        btn.title = '返回顶部';
        btn.innerHTML = '⬆ 返回顶部';
        Object.assign(btn.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            display: 'none',
            zIndex: 9999,
            padding: '10px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'opacity 0.2s, transform 0.2s',
        });
        btn.addEventListener('mouseenter', () => { btn.style.opacity = 0.9; btn.style.transform = 'translateY(-2px)'; });
        btn.addEventListener('mouseleave', () => { btn.style.opacity = 1; btn.style.transform = 'translateY(0)'; });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(btn);

        // 根据滚动距离控制按钮显示/隐藏
        window.addEventListener('scroll', () => {
            if (window.scrollY > App.BACK_TO_TOP_THRESHOLD) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        }, { passive: true });
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
