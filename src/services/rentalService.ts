// Rental Intelligence Service for ACOT Dubai Platform
// Implements client-approved MVP logic, ETL data mapping, and high-fidelity mock databases.

export interface RentalOverviewData {
  averageAnnualRent: number;
  averageRentSqft: number;
  grossYield: number;
  netYield: number;
  annualRentChange: number; // e.g. +6.2
  rentSqftChange: number; // e.g. +4.7
  grossYieldChange: number; // e.g. +0.4
  netYieldChange: number; // e.g. +0.3
}

export interface AreaRentLevel {
  id: string;
  name: string;
  averageAnnualRent: number;
  rentSqft: number;
  yoyChange: number;
}

export interface PropertyTypeRentLevel {
  type: string;
  averageRent: number;
  rentSqft: number;
  demand: 'Extreme' | 'High' | 'Moderate' | 'Stable' | 'Soft';
  percentageOfMarket: number;
}

export interface BedroomRentLevel {
  bedroom: string;
  averageRent: number;
  rentSqft: number;
  demand: 'Extreme' | 'High' | 'Moderate' | 'Stable' | 'Soft';
  occupancyRate: number;
}

export interface RentalTrendPoint {
  month: string;
  averageRent: number;
}

export interface YieldCalculationResult {
  grossYield: number;
  netYield: number;
  annualIncome: number;
  annualExpenses: number;
  netRentalIncome: number;
}

// ==========================================
// MOCK DATABASES FOR RENTAL INTELLIGENCE
// ==========================================

const COMMUNITY_RENTAL_OVERVIEW: Record<string, RentalOverviewData> = {
  'dubai-marina': {
    averageAnnualRent: 165000,
    averageRentSqft: 120,
    grossYield: 7.20,
    netYield: 5.90,
    annualRentChange: 6.2,
    rentSqftChange: 4.7,
    grossYieldChange: 0.4,
    netYieldChange: 0.3
  },
  'business-bay': {
    averageAnnualRent: 130000,
    averageRentSqft: 105,
    grossYield: 6.80,
    netYield: 5.60,
    annualRentChange: 5.8,
    rentSqftChange: 4.1,
    grossYieldChange: 0.2,
    netYieldChange: 0.1
  },
  'downtown-dubai': {
    averageAnnualRent: 210000,
    averageRentSqft: 155,
    grossYield: 5.90,
    netYield: 4.80,
    annualRentChange: 7.4,
    rentSqftChange: 5.2,
    grossYieldChange: 0.1,
    netYieldChange: 0.2
  },
  'palm-jumeirah': {
    averageAnnualRent: 290000,
    averageRentSqft: 185,
    grossYield: 6.10,
    netYield: 5.10,
    annualRentChange: 8.1,
    rentSqftChange: 6.5,
    grossYieldChange: 0.3,
    netYieldChange: 0.2
  },
  'jumeirah-village-circle': {
    averageAnnualRent: 85000,
    averageRentSqft: 85,
    grossYield: 8.40,
    netYield: 7.10,
    annualRentChange: 9.3,
    rentSqftChange: 7.2,
    grossYieldChange: 0.6,
    netYieldChange: 0.5
  },
  'dubai-hills-estate': {
    averageAnnualRent: 145000,
    averageRentSqft: 110,
    grossYield: 6.50,
    netYield: 5.40,
    annualRentChange: 5.1,
    rentSqftChange: 3.9,
    grossYieldChange: 0.2,
    netYieldChange: 0.2
  },
  'jumeirah-lakes-towers': {
    averageAnnualRent: 115000,
    averageRentSqft: 98,
    grossYield: 7.50,
    netYield: 6.20,
    annualRentChange: 4.8,
    rentSqftChange: 3.2,
    grossYieldChange: 0.3,
    netYieldChange: 0.3
  },
  'dubai-creek-harbour': {
    averageAnnualRent: 135000,
    averageRentSqft: 115,
    grossYield: 6.30,
    netYield: 5.20,
    annualRentChange: 6.9,
    rentSqftChange: 4.8,
    grossYieldChange: 0.4,
    netYieldChange: 0.4
  }
};

const AREA_RENT_LEVELS: Record<string, AreaRentLevel[]> = {
  'dubai-marina': [
    { id: 'area-1', name: 'Dubai Marina (Macro)', averageAnnualRent: 165000, rentSqft: 120, yoyChange: 6.2 },
    { id: 'area-2', name: 'Marina Walk', averageAnnualRent: 172000, rentSqft: 125, yoyChange: 5.8 },
    { id: 'area-3', name: 'Marina Gate Cluster', averageAnnualRent: 185000, rentSqft: 132, yoyChange: 7.5 },
    { id: 'area-4', name: 'Emaar Six Towers', averageAnnualRent: 195000, rentSqft: 140, yoyChange: 4.9 },
    { id: 'area-5', name: 'Marina Promenade', averageAnnualRent: 168000, rentSqft: 121, yoyChange: 6.0 }
  ],
  'business-bay': [
    { id: 'area-1', name: 'Business Bay (Macro)', averageAnnualRent: 130000, rentSqft: 105, yoyChange: 5.8 },
    { id: 'area-2', name: 'Canal Front', averageAnnualRent: 145000, rentSqft: 118, yoyChange: 6.9 },
    { id: 'area-3', name: 'Executive Towers', averageAnnualRent: 125000, rentSqft: 101, yoyChange: 4.2 },
    { id: 'area-4', name: 'Marasi Drive', averageAnnualRent: 138000, rentSqft: 112, yoyChange: 6.5 }
  ]
};

const PROPERTY_TYPE_RENT_LEVELS: Record<string, PropertyTypeRentLevel[]> = {
  'dubai-marina': [
    { type: 'Apartment', averageRent: 155000, rentSqft: 115, demand: 'Extreme', percentageOfMarket: 88 },
    { type: 'Villa', averageRent: 380000, rentSqft: 145, demand: 'Moderate', percentageOfMarket: 2 },
    { type: 'Townhouse', averageRent: 240000, rentSqft: 128, demand: 'High', percentageOfMarket: 6 },
    { type: 'Penthouse', averageRent: 550000, rentSqft: 195, demand: 'Extreme', percentageOfMarket: 4 }
  ],
  'business-bay': [
    { type: 'Apartment', averageRent: 125000, rentSqft: 102, demand: 'High', percentageOfMarket: 92 },
    { type: 'Villa', averageRent: 320000, rentSqft: 135, demand: 'Stable', percentageOfMarket: 1 },
    { type: 'Townhouse', averageRent: 210000, rentSqft: 118, demand: 'Moderate', percentageOfMarket: 4 },
    { type: 'Penthouse', averageRent: 480000, rentSqft: 175, demand: 'High', percentageOfMarket: 3 }
  ]
};

const BEDROOM_RENT_LEVELS: Record<string, BedroomRentLevel[]> = {
  'dubai-marina': [
    { bedroom: 'Studio', averageRent: 85000, rentSqft: 155, demand: 'High', occupancyRate: 94 },
    { bedroom: '1 BR', averageRent: 130000, rentSqft: 142, demand: 'Extreme', occupancyRate: 96 },
    { bedroom: '2 BR', averageRent: 195000, rentSqft: 130, demand: 'Extreme', occupancyRate: 95 },
    { bedroom: '3 BR', averageRent: 280000, rentSqft: 118, demand: 'High', occupancyRate: 92 },
    { bedroom: '4 BR+', averageRent: 480000, rentSqft: 140, demand: 'Moderate', occupancyRate: 89 }
  ],
  'business-bay': [
    { bedroom: 'Studio', averageRent: 72000, rentSqft: 135, demand: 'High', occupancyRate: 91 },
    { bedroom: '1 BR', averageRent: 110000, rentSqft: 122, demand: 'High', occupancyRate: 93 },
    { bedroom: '2 BR', averageRent: 165000, rentSqft: 114, demand: 'Extreme', occupancyRate: 92 },
    { bedroom: '3 BR', averageRent: 240000, rentSqft: 105, demand: 'Moderate', occupancyRate: 88 },
    { bedroom: '4 BR+', averageRent: 410000, rentSqft: 128, demand: 'Stable', occupancyRate: 85 }
  ]
};

const RENTAL_TRENDS_DATA: Record<string, RentalTrendPoint[]> = {
  'dubai-marina': [
    { month: 'Aug', averageRent: 128 },
    { month: 'Sep', averageRent: 132 },
    { month: 'Oct', averageRent: 139 },
    { month: 'Nov', averageRent: 142 },
    { month: 'Dec', averageRent: 141 },
    { month: 'Jan', averageRent: 145 },
    { month: 'Feb', averageRent: 148 },
    { month: 'Mar', averageRent: 152 },
    { month: 'Apr', averageRent: 155 },
    { month: 'May', averageRent: 158 },
    { month: 'Jun', averageRent: 161 },
    { month: 'Jul', averageRent: 165 }
  ],
  'business-bay': [
    { month: 'Aug', averageRent: 102 },
    { month: 'Sep', averageRent: 104 },
    { month: 'Oct', averageRent: 108 },
    { month: 'Nov', averageRent: 110 },
    { month: 'Dec', averageRent: 109 },
    { month: 'Jan', averageRent: 112 },
    { month: 'Feb', averageRent: 115 },
    { month: 'Mar', averageRent: 119 },
    { month: 'Apr', averageRent: 122 },
    { month: 'May', averageRent: 124 },
    { month: 'Jun', averageRent: 127 },
    { month: 'Jul', averageRent: 130 }
  ]
};

// ==========================================
// RENTAL INTELLIGENCE SERVICE IMPLEMENTATION
// ==========================================

export class RentalService {
  
  static async getOverview(
    communityId: string,
    subAreaId: string = 'all',
    projectId: string = 'all'
  ): Promise<RentalOverviewData> {
    return new Promise((resolve) => {
      let base = COMMUNITY_RENTAL_OVERVIEW[communityId] || COMMUNITY_RENTAL_OVERVIEW['dubai-marina'];
      
      // Fine-tune overview metrics dynamically based on subArea or project for maximum data fidelity
      if (projectId !== 'all') {
        resolve({
          averageAnnualRent: Math.round(base.averageAnnualRent * 1.15),
          averageRentSqft: Math.round(base.averageRentSqft * 1.12),
          grossYield: Math.round((base.grossYield + 0.3) * 10) / 10,
          netYield: Math.round((base.netYield + 0.25) * 10) / 10,
          annualRentChange: Math.round((base.annualRentChange + 1.2) * 10) / 10,
          rentSqftChange: Math.round((base.rentSqftChange + 0.8) * 10) / 10,
          grossYieldChange: base.grossYieldChange,
          netYieldChange: base.netYieldChange
        });
      } else if (subAreaId !== 'all') {
        resolve({
          averageAnnualRent: Math.round(base.averageAnnualRent * 1.05),
          averageRentSqft: Math.round(base.averageRentSqft * 1.04),
          grossYield: Math.round((base.grossYield + 0.1) * 10) / 10,
          netYield: Math.round((base.netYield + 0.1) * 10) / 10,
          annualRentChange: Math.round((base.annualRentChange + 0.4) * 10) / 10,
          rentSqftChange: Math.round((base.rentSqftChange + 0.3) * 10) / 10,
          grossYieldChange: base.grossYieldChange,
          netYieldChange: base.netYieldChange
        });
      } else {
        resolve(base);
      }
    });
  }

  static async getAreaRentLevels(communityId: string): Promise<AreaRentLevel[]> {
    return new Promise((resolve) => {
      const data = AREA_RENT_LEVELS[communityId] || AREA_RENT_LEVELS['dubai-marina'];
      resolve(data);
    });
  }

  static async getPropertyTypeRentLevels(communityId: string): Promise<PropertyTypeRentLevel[]> {
    return new Promise((resolve) => {
      const data = PROPERTY_TYPE_RENT_LEVELS[communityId] || PROPERTY_TYPE_RENT_LEVELS['dubai-marina'];
      resolve(data);
    });
  }

  static async getBedroomRentLevels(communityId: string): Promise<BedroomRentLevel[]> {
    return new Promise((resolve) => {
      const data = BEDROOM_RENT_LEVELS[communityId] || BEDROOM_RENT_LEVELS['dubai-marina'];
      resolve(data);
    });
  }

  static async getRentalTrend(communityId: string, limitMonths: number = 12): Promise<RentalTrendPoint[]> {
    return new Promise((resolve) => {
      const allPoints = RENTAL_TRENDS_DATA[communityId] || RENTAL_TRENDS_DATA['dubai-marina'];
      resolve(allPoints.slice(-limitMonths));
    });
  }

  static calculateYield(
    purchasePrice: number,
    annualRent: number,
    serviceCharges: number,
    maintenance: number,
    propertyManagementPercent: number,
    vacancyPercent: number
  ): YieldCalculationResult {
    // Math rules aligned to section 4 spec:
    // Property management fee = (percentage / 100) * annualRent
    const propertyManagementFee = (propertyManagementPercent / 100) * annualRent;
    
    // Vacancy expenses = (percentage / 100) * annualRent
    const vacancyExpense = (vacancyPercent / 100) * annualRent;

    const annualExpenses = serviceCharges + maintenance + propertyManagementFee + vacancyExpense;
    const netRentalIncome = annualRent - annualExpenses;

    const grossYield = purchasePrice > 0 ? (annualRent / purchasePrice) * 100 : 0;
    const netYield = purchasePrice > 0 ? (netRentalIncome / purchasePrice) * 100 : 0;

    return {
      grossYield: Math.round(grossYield * 100) / 100,
      netYield: Math.round(netYield * 100) / 100,
      annualIncome: annualRent,
      annualExpenses: Math.round(annualExpenses),
      netRentalIncome: Math.round(netRentalIncome)
    };
  }
}
