// 数据服务类
class DataService {
    async getGVCData() {
        try {
            const response = await fetch('subjects/english/gvc/data/vocabulary.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching GVC data:', error);
            throw error;
        }
    }

    async getClassicalData() {
        try {
            const response = await fetch('subjects/chinese/classical/data/classical.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching classical data:', error);
            throw error;
        }
    }

    async getTestPointsData() {
        try {
            const response = await fetch('subjects/chinese/classical/data/test_points.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching test points data:', error);
            throw error;
        }
    }

    async getGrammarData() {
        try {
            const response = await fetch('subjects/english/grammar/data/grammar.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching grammar data:', error);
            throw error;
        }
    }

    async getMathAlgebraData() {
        try {
            const response = await fetch('subjects/math/algebra/data/algebra.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching math algebra data:', error);
            throw error;
        }
    }

    async getMathGeometryData() {
        try {
            const response = await fetch('subjects/math/geometry/data/geometry.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching math geometry data:', error);
            throw error;
        }
    }

    async getMathCalculusData() {
        try {
            const response = await fetch('subjects/math/calculus/data/calculus.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching math calculus data:', error);
            throw error;
        }
    }

    async getPhysicsMechanicsData() {
        try {
            const response = await fetch('subjects/physics/mechanics/data/mechanics.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching physics mechanics data:', error);
            throw error;
        }
    }

    async getPhysicsThermodynamicsData() {
        try {
            const response = await fetch('subjects/physics/thermodynamics/data/thermodynamics.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching physics thermodynamics data:', error);
            throw error;
        }
    }

    async getPhysicsElectricityData() {
        try {
            const response = await fetch('subjects/physics/electricity/data/electricity.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching physics electricity data:', error);
            throw error;
        }
    }

    async getChemistryInorganicData() {
        try {
            const response = await fetch('subjects/chemistry/inorganic/data/inorganic.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching chemistry inorganic data:', error);
            throw error;
        }
    }

    async getChemistryOrganicData() {
        try {
            const response = await fetch('subjects/chemistry/organic/data/organic.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching chemistry organic data:', error);
            throw error;
        }
    }

    async getChemistryPhysicalData() {
        try {
            const response = await fetch('subjects/chemistry/physical/data/physical.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching chemistry physical data:', error);
            throw error;
        }
    }

    async getGeographyPhysicalData() {
        try {
            const response = await fetch('subjects/geography/physical/data/physical.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching geography physical data:', error);
            throw error;
        }
    }

    async getGeographyHumanData() {
        try {
            const response = await fetch('subjects/geography/human/data/human.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching geography human data:', error);
            throw error;
        }
    }

    async getGeographyRegionalData() {
        try {
            const response = await fetch('subjects/geography/regional/data/regional.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching geography regional data:', error);
            throw error;
        }
    }

    async getHistoryAncientData() {
        try {
            const response = await fetch('subjects/history/ancient/data/ancient.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching history ancient data:', error);
            throw error;
        }
    }

    async getPoliticsEconomicsData() {
        try {
            const response = await fetch('subjects/politics/economics/data/economics.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching politics economics data:', error);
            throw error;
        }
    }

    async getBiologyCellData() {
        try {
            const response = await fetch('subjects/biology/cell/data/cell.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching biology cell data:', error);
            throw error;
        }
    }

    async fetchData(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}