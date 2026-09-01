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
