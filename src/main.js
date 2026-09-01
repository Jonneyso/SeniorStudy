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
        this.init();
    }

    init() {
        this.initComponents();
        this.initEventListeners();
        this.initBackToTopButton();
        this.initHashRouting();
    }

    // 初始化各类组件
    initComponents() {
        // 1) 英语 GVC（词汇）组件
        if (document.getElementById('vocabulary-list')) {
            const gvcComponent = new GVCComponent('vocabulary-list');
            gvcComponent.init();
        }

        // 2) 语文古诗文组件
        if (document.getElementById('classical-content')) {
            const classicalComponent = new ClassicalComponent('classical-content');
            classicalComponent.init();
        }

        // 3) 英语语法组件
        if (document.getElementById('english-grammar-content')) {
            const grammarComponent = new GrammarComponent('english-grammar-content');
            grammarComponent.init();
        }

        // 4) 学科知识模块（使用通用初始化函数 + 配置表）
        this.initSubjectModules();

        // 5) 课本思维导图组件
        this.initTextbookComponents();
    }

    /**
     * 通用知识模块初始化函数：遍历 SUBJECT_MODULE_CONFIG，对每个存在的容器创建 SubjectComponent
     * 共享 DataManager 实例 → 跨模块缓存复用，减少重复 fetch
     */
    initSubjectModules() {
        App.SUBJECT_MODULE_CONFIG.forEach(mod => {
            const container = document.getElementById(mod.containerId);
            if (!container) return;

            const component = new SubjectComponent(mod.containerId, null, {
                dataMethod: mod.dataMethod
            });

            // 共享同一个 DataManager
            component.dataManager = this.sharedDataManager;

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

            component.loadData();
        });
    }

    // 初始化课本思维导图组件
    initTextbookComponents() {
        App.TEXTBOOK_CONFIG.forEach(item => {
            if (document.getElementById(item.containerId)) {
                const textbookComponent = new TextbookComponent(item.containerId, item.subjectKey);
                textbookComponent.init();
            }
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
