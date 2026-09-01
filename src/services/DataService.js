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
