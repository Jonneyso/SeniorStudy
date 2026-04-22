// 主应用脚本
class App {
    constructor() {
        this.init();
    }

    init() {
        // 加载样式
        this.loadStyles();
        
        // 初始化组件
        this.initComponents();
        
        // 初始化事件监听
        this.initEventListeners();
    }

    loadStyles() {
        // 动态加载样式文件
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'src/styles/main.css';
        document.head.appendChild(link);
    }

    initComponents() {
        // 初始化英语GVC组件
        if (document.getElementById('vocabulary-list')) {
            const gvcComponent = new GVCComponent('vocabulary-list');
            gvcComponent.init();
        }

        // 初始化语文古诗文组件
        if (document.getElementById('classical-content')) {
            const classicalComponent = new ClassicalComponent('classical-content');
            classicalComponent.init();
        }

        // 初始化英语语法组件
        if (document.getElementById('english-grammar-content')) {
            const grammarComponent = new GrammarComponent('english-grammar-content');
            grammarComponent.init();
        }

        // 初始化数学组件
        this.initMathComponents();
        
        // 初始化物理组件
        this.initPhysicsComponents();
        
        // 初始化化学组件
        this.initChemistryComponents();
        
        // 初始化地理组件
        this.initGeographyComponents();
        
        // 初始化历史组件
        this.initHistoryComponents();
        
        // 初始化政治组件
        this.initPoliticsComponents();
        
        // 初始化生物组件
        this.initBiologyComponents();
    }

    initMathComponents() {
        const mathSubjects = [
            { id: 'math-algebra-content', dataMethod: 'getMathAlgebraData' },
            { id: 'math-geometry-content', dataMethod: 'getMathGeometryData' },
            { id: 'math-calculus-content', dataMethod: 'getMathCalculusData' }
        ];

        mathSubjects.forEach(subject => {
            if (document.getElementById(subject.id)) {
                const component = new SubjectComponent(subject.id, null, {
                    dataMethod: subject.dataMethod
                });
                component.dataManager = new DataManager();
                component.loadData = async function() {
                    try {
                        const data = await this.dataManager[subject.dataMethod]();
                        this.render(data);
                    } catch (error) {
                        console.error('加载数据失败:', error);
                        this.renderError();
                    }
                };
                component.loadData();
            }
        });
    }

    initPhysicsComponents() {
        const physicsSubjects = [
            { id: 'physics-mechanics-content', dataMethod: 'getPhysicsMechanicsData' },
            { id: 'physics-thermodynamics-content', dataMethod: 'getPhysicsThermodynamicsData' },
            { id: 'physics-electricity-content', dataMethod: 'getPhysicsElectricityData' }
        ];

        physicsSubjects.forEach(subject => {
            if (document.getElementById(subject.id)) {
                const component = new SubjectComponent(subject.id, null, {
                    dataMethod: subject.dataMethod
                });
                component.dataManager = new DataManager();
                component.loadData = async function() {
                    try {
                        const data = await this.dataManager[subject.dataMethod]();
                        this.render(data);
                    } catch (error) {
                        console.error('加载数据失败:', error);
                        this.renderError();
                    }
                };
                component.loadData();
            }
        });
    }

    initChemistryComponents() {
        const chemistrySubjects = [
            { id: 'chemistry-inorganic-content', dataMethod: 'getChemistryInorganicData' },
            { id: 'chemistry-organic-content', dataMethod: 'getChemistryOrganicData' },
            { id: 'chemistry-physical-content', dataMethod: 'getChemistryPhysicalData' }
        ];

        chemistrySubjects.forEach(subject => {
            if (document.getElementById(subject.id)) {
                const component = new SubjectComponent(subject.id, null, {
                    dataMethod: subject.dataMethod
                });
                component.dataManager = new DataManager();
                component.loadData = async function() {
                    try {
                        const data = await this.dataManager[subject.dataMethod]();
                        this.render(data);
                    } catch (error) {
                        console.error('加载数据失败:', error);
                        this.renderError();
                    }
                };
                component.loadData();
            }
        });
    }

    initGeographyComponents() {
        const geographySubjects = [
            { id: 'geography-physical-content', dataMethod: 'getGeographyPhysicalData' },
            { id: 'geography-human-content', dataMethod: 'getGeographyHumanData' },
            { id: 'geography-regional-content', dataMethod: 'getGeographyRegionalData' }
        ];

        geographySubjects.forEach(subject => {
            if (document.getElementById(subject.id)) {
                console.log('初始化地理组件:', subject.id, '方法:', subject.dataMethod);
                const component = new SubjectComponent(subject.id, null, {
                    dataMethod: subject.dataMethod
                });
                component.dataManager = new DataManager();
                component.loadData = async function() {
                    try {
                        console.log('加载地理数据:', subject.dataMethod);
                        const data = await this.dataManager[subject.dataMethod]();
                        console.log('地理数据加载成功:', data);
                        this.render(data);
                    } catch (error) {
                        console.error('加载数据失败:', error);
                        this.renderError();
                    }
                };
                component.loadData();
            }
        });
    }

    initHistoryComponents() {
        const historySubjects = [
            { id: 'history-ancient-content', dataMethod: 'getHistoryAncientData' },
            { id: 'history-modern-content', dataMethod: 'getHistoryAncientData' },
            { id: 'history-contemporary-content', dataMethod: 'getHistoryAncientData' }
        ];

        historySubjects.forEach(subject => {
            if (document.getElementById(subject.id)) {
                const component = new SubjectComponent(subject.id, null, {
                    dataMethod: subject.dataMethod
                });
                component.dataManager = new DataManager();
                component.loadData = async function() {
                    try {
                        const data = await this.dataManager[subject.dataMethod]();
                        this.render(data);
                    } catch (error) {
                        console.error('加载数据失败:', error);
                        this.renderError();
                    }
                };
                component.loadData();
            }
        });
    }

    initPoliticsComponents() {
        const politicsSubjects = [
            { id: 'politics-economics-content', dataMethod: 'getPoliticsEconomicsData' },
            { id: 'politics-politics-content', dataMethod: 'getPoliticsEconomicsData' },
            { id: 'politics-philosophy-content', dataMethod: 'getPoliticsEconomicsData' }
        ];

        politicsSubjects.forEach(subject => {
            if (document.getElementById(subject.id)) {
                const component = new SubjectComponent(subject.id, null, {
                    dataMethod: subject.dataMethod
                });
                component.dataManager = new DataManager();
                component.loadData = async function() {
                    try {
                        const data = await this.dataManager[subject.dataMethod]();
                        this.render(data);
                    } catch (error) {
                        console.error('加载数据失败:', error);
                        this.renderError();
                    }
                };
                component.loadData();
            }
        });
    }

    initBiologyComponents() {
        const biologySubjects = [
            { id: 'biology-cell-content', dataMethod: 'getBiologyCellData' },
            { id: 'biology-genetics-content', dataMethod: 'getBiologyCellData' },
            { id: 'biology-ecology-content', dataMethod: 'getBiologyCellData' }
        ];

        biologySubjects.forEach(subject => {
            if (document.getElementById(subject.id)) {
                const component = new SubjectComponent(subject.id, null, {
                    dataMethod: subject.dataMethod
                });
                component.dataManager = new DataManager();
                component.loadData = async function() {
                    try {
                        const data = await this.dataManager[subject.dataMethod]();
                        this.render(data);
                    } catch (error) {
                        console.error('加载数据失败:', error);
                        this.renderError();
                    }
                };
                component.loadData();
            }
        });
    }

    initEventListeners() {
        console.log('初始化事件监听器');
        const subjectLinks = document.querySelectorAll('.content-list a');
        console.log('找到的链接数量:', subjectLinks.length);
        subjectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                console.log('点击链接，目标ID:', targetId);
                this.showContent(targetId);
            });
        });
    }

    showContent(targetId) {
        console.log('显示内容，目标ID:', targetId);
        const containers = document.querySelectorAll('.gvc-container');
        console.log('找到的容器数量:', containers.length);
        containers.forEach(container => {
            container.classList.remove('active');
        });
        
        const targetContainer = document.getElementById(targetId);
        console.log('找到的目标容器:', targetContainer);
        if (targetContainer) {
            targetContainer.classList.add('active');
            console.log('目标容器已激活');
        } else {
            console.log('未找到目标容器:', targetId);
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    new App();
});