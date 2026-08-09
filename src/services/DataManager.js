// 数据管理类，用于缓存数据和管理数据加载
class DataManager {
    constructor() {
        this.cache = new Map();
        this.dataService = new DataService();
    }

    async getGVCData() {
        const cacheKey = 'gvcData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getGVCData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getClassicalData() {
        const cacheKey = 'classicalData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getClassicalData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getTestPointsData() {
        const cacheKey = 'testPointsData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getTestPointsData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getGrammarData() {
        const cacheKey = 'grammarData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getGrammarData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getMathAlgebraData() {
        const cacheKey = 'mathAlgebraData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getMathAlgebraData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getMathGeometryData() {
        const cacheKey = 'mathGeometryData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getMathGeometryData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getMathCalculusData() {
        const cacheKey = 'mathCalculusData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getMathCalculusData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getPhysicsMechanicsData() {
        const cacheKey = 'physicsMechanicsData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getPhysicsMechanicsData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getPhysicsThermodynamicsData() {
        const cacheKey = 'physicsThermodynamicsData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getPhysicsThermodynamicsData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getPhysicsElectricityData() {
        const cacheKey = 'physicsElectricityData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getPhysicsElectricityData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getChemistryInorganicData() {
        const cacheKey = 'chemistryInorganicData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getChemistryInorganicData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getChemistryOrganicData() {
        const cacheKey = 'chemistryOrganicData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getChemistryOrganicData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getChemistryPhysicalData() {
        const cacheKey = 'chemistryPhysicalData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getChemistryPhysicalData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getGeographyPhysicalData() {
        const cacheKey = 'geographyPhysicalData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getGeographyPhysicalData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getGeographyHumanData() {
        const cacheKey = 'geographyHumanData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getGeographyHumanData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getGeographyRegionalData() {
        const cacheKey = 'geographyRegionalData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getGeographyRegionalData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getHistoryAncientData() {
        const cacheKey = 'historyAncientData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getHistoryAncientData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getPoliticsEconomicsData() {
        const cacheKey = 'politicsEconomicsData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getPoliticsEconomicsData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getBiologyCellData() {
        const cacheKey = 'biologyCellData';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getBiologyCellData();
        this.cache.set(cacheKey, data);
        return data;
    }

    async getTextbookData(subjectKey) {
        const cacheKey = `textbookData_${subjectKey}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const data = await this.dataService.getTextbookData(subjectKey);
        this.cache.set(cacheKey, data);
        return data;
    }

    clearCache() {
        this.cache.clear();
    }

    clearCacheKey(key) {
        this.cache.delete(key);
    }

    hasCache(key) {
        return this.cache.has(key);
    }

    getCacheSize() {
        return this.cache.size;
    }
}