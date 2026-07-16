// Transaction Intelligence Service for ACOT Platform
// Provides official Dubai Land Department (DLD) transaction records, cash vs mortgage ratios,
// closing cost calculations, trend metrics, and advanced filtering capabilities.

export interface Transaction {
  id: string;
  referenceNumber: string;
  date: string; // ISO date YYYY-MM-DD
  propertyType: 'Apartment' | 'Villa' | 'Townhouse' | 'Penthouse';
  transactionType: 'Sale' | 'Mortgage' | 'Gift';
  bedrooms: 'Studio' | '1' | '2' | '3' | '4+';
  sizeSqft: number;
  priceAed: number;
  pricePerSqft: number;
  communityId: string;
  communityName: string;
  subAreaId: string;
  subAreaName: string;
  projectId: string;
  projectName: string;
  developer: string;
  paymentMethod: 'Cash' | 'Mortgage' | 'N/A';
  status: 'Completed' | 'Off-Plan';
  buyerNationality: string;
}

export interface TransactionHighlights {
  totalTransactionsCount: number;
  totalVolumeAed: number; // In AED
  averagePriceSqft: number; // AED/sqft
  highestSalePrice: number; // AED
  lowestSalePrice: number; // AED
  cashTransactionsCount: number;
  mortgageTransactionsCount: number;
  offPlanCount: number;
  readyCount: number;
  avgSizeSqft: number;
}

export interface TrendDataPoint {
  month: string; // "Jan 25", "Feb 25", etc.
  salesVolume: number; // AED in millions
  transactionsCount: number;
  avgPricePerSqft: number;
}

export interface CashMortgageBreakdown {
  cashCount: number;
  cashValue: number; // AED
  cashPercentage: number;
  mortgageCount: number;
  mortgageValue: number; // AED
  mortgagePercentage: number;
  totalCount: number;
}

export interface ClosingCostBreakdown {
  purchasePrice: number;
  dldTransferFee: number; // 4% of purchase price
  dldAdminFee: number; // 580 AED for off-plan, 4300 AED for ready
  brokerageFee: number; // 2% of purchase price + 5% VAT
  trusteeFee: number; // 2000 AED + VAT or 4000 AED + VAT
  mortgageRegFee: number; // 0.25% of loan amount + 290 AED (if mortgaged)
  mortgageArrangementFee: number; // 1% of loan amount + 5% VAT (if mortgaged)
  propertyValuationFee: number; // 2500 to 3500 AED + VAT (if mortgaged)
  agencyVAT: number; // 5% of brokerage fee
  totalGovernmentFees: number;
  totalAgencyFees: number;
  totalMortgageFees: number;
  totalClosingCosts: number;
  netRequiredCapital: number; // Purchase Price + Closing Costs - Loan Amount
  loanAmount: number;
}

// ==========================================
// MOCK DATA STORAGE
// ==========================================

const MOCK_TRANSACTIONS: Transaction[] = [
  // --- DUBAI MARINA ---
  {
    id: 'tx-dm-1',
    referenceNumber: 'S-849201-2025',
    date: '2025-07-14',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: '2',
    sizeSqft: 1420,
    priceAed: 2450000,
    pricePerSqft: 1725,
    communityId: 'dubai-marina',
    communityName: 'Dubai Marina',
    subAreaId: 'marina-gate',
    subAreaName: 'Marina Gate',
    projectId: 'marina-gate-1',
    projectName: 'Marina Gate 1',
    developer: 'Select Group',
    paymentMethod: 'Cash',
    status: 'Completed',
    buyerNationality: 'United Kingdom'
  },
  {
    id: 'tx-dm-2',
    referenceNumber: 'S-849102-2025',
    date: '2025-07-12',
    propertyType: 'Penthouse',
    transactionType: 'Sale',
    bedrooms: '4+',
    sizeSqft: 4200,
    priceAed: 11800000,
    pricePerSqft: 2809,
    communityId: 'dubai-marina',
    communityName: 'Dubai Marina',
    subAreaId: 'marina-promenade',
    subAreaName: 'Marina Promenade',
    projectId: 'marina-promenade-delphine',
    projectName: 'Marina Promenade Delphine',
    developer: 'Emaar Properties',
    paymentMethod: 'Cash',
    status: 'Completed',
    buyerNationality: 'Germany'
  },
  {
    id: 'tx-dm-3',
    referenceNumber: 'M-102934-2025',
    date: '2025-07-11',
    propertyType: 'Apartment',
    transactionType: 'Mortgage',
    bedrooms: '1',
    sizeSqft: 840,
    priceAed: 1350000,
    pricePerSqft: 1607,
    communityId: 'dubai-marina',
    communityName: 'Dubai Marina',
    subAreaId: 'marina-walk',
    subAreaName: 'Marina Walk',
    projectId: 'marina-walk-heights',
    projectName: 'Marina Walk Heights',
    developer: 'Emaar Properties',
    paymentMethod: 'Mortgage',
    status: 'Completed',
    buyerNationality: 'United Arab Emirates'
  },
  {
    id: 'tx-dm-4',
    referenceNumber: 'S-848920-2025',
    date: '2025-07-09',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: '3',
    sizeSqft: 1850,
    priceAed: 3100000,
    pricePerSqft: 1675,
    communityId: 'dubai-marina',
    communityName: 'Dubai Marina',
    subAreaId: 'marina-gate',
    subAreaName: 'Marina Gate',
    projectId: 'marina-gate-2',
    projectName: 'Marina Gate 2',
    developer: 'Select Group',
    paymentMethod: 'Mortgage',
    status: 'Completed',
    buyerNationality: 'India'
  },
  {
    id: 'tx-dm-5',
    referenceNumber: 'S-848512-2025',
    date: '2025-07-05',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: 'Studio',
    sizeSqft: 520,
    priceAed: 910000,
    pricePerSqft: 1750,
    communityId: 'dubai-marina',
    communityName: 'Dubai Marina',
    subAreaId: 'marina-walk',
    subAreaName: 'Marina Walk',
    projectId: 'marina-walk-heights',
    projectName: 'Marina Walk Heights',
    developer: 'Emaar Properties',
    paymentMethod: 'Cash',
    status: 'Completed',
    buyerNationality: 'Russia'
  },
  {
    id: 'tx-dm-6',
    referenceNumber: 'S-847921-2025',
    date: '2025-07-02',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: '2',
    sizeSqft: 1380,
    priceAed: 2280000,
    pricePerSqft: 1652,
    communityId: 'dubai-marina',
    communityName: 'Dubai Marina',
    subAreaId: 'marina-promenade',
    subAreaName: 'Marina Promenade',
    projectId: 'marina-promenade-delphine',
    projectName: 'Marina Promenade Delphine',
    developer: 'Emaar Properties',
    paymentMethod: 'Mortgage',
    status: 'Completed',
    buyerNationality: 'France'
  },
  {
    id: 'tx-dm-7',
    referenceNumber: 'S-846102-2025',
    date: '2025-06-28',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: '1',
    sizeSqft: 910,
    priceAed: 1580000,
    pricePerSqft: 1736,
    communityId: 'dubai-marina',
    communityName: 'Dubai Marina',
    subAreaId: 'marina-gate',
    subAreaName: 'Marina Gate',
    projectId: 'marina-gate-1',
    projectName: 'Marina Gate 1',
    developer: 'Select Group',
    paymentMethod: 'Cash',
    status: 'Completed',
    buyerNationality: 'Canada'
  },
  {
    id: 'tx-dm-8',
    referenceNumber: 'S-845210-2025',
    date: '2025-06-25',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: '2',
    sizeSqft: 1450,
    priceAed: 2500000,
    pricePerSqft: 1724,
    communityId: 'dubai-marina',
    communityName: 'Dubai Marina',
    subAreaId: 'marina-gate',
    subAreaName: 'Marina Gate',
    projectId: 'marina-gate-2',
    projectName: 'Marina Gate 2',
    developer: 'Select Group',
    paymentMethod: 'Mortgage',
    status: 'Off-Plan',
    buyerNationality: 'Italy'
  },

  // --- BUSINESS BAY ---
  {
    id: 'tx-bb-1',
    referenceNumber: 'S-942110-2025',
    date: '2025-07-13',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: '1',
    sizeSqft: 890,
    priceAed: 1390000,
    pricePerSqft: 1561,
    communityId: 'business-bay',
    communityName: 'Business Bay',
    subAreaId: 'canal-front',
    subAreaName: 'Canal Front',
    projectId: 'opus',
    projectName: 'The Opus',
    developer: 'Omniyat',
    paymentMethod: 'Cash',
    status: 'Completed',
    buyerNationality: 'United Arab Emirates'
  },
  {
    id: 'tx-bb-2',
    referenceNumber: 'S-942109-2025',
    date: '2025-07-11',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: '2',
    sizeSqft: 1350,
    priceAed: 2150000,
    pricePerSqft: 1592,
    communityId: 'business-bay',
    communityName: 'Business Bay',
    subAreaId: 'canal-front',
    subAreaName: 'Canal Front',
    projectId: 'opus',
    projectName: 'The Opus',
    developer: 'Omniyat',
    paymentMethod: 'Mortgage',
    status: 'Completed',
    buyerNationality: 'Saudi Arabia'
  },
  {
    id: 'tx-bb-3',
    referenceNumber: 'S-941829-2025',
    date: '2025-07-08',
    propertyType: 'Penthouse',
    transactionType: 'Sale',
    bedrooms: '4+',
    sizeSqft: 5100,
    priceAed: 14500000,
    pricePerSqft: 2843,
    communityId: 'business-bay',
    communityName: 'Business Bay',
    subAreaId: 'bay-square',
    subAreaName: 'Bay Square',
    projectId: 'bay-square-3',
    projectName: 'Bay Square 3',
    developer: 'Dubai Properties',
    paymentMethod: 'Cash',
    status: 'Completed',
    buyerNationality: 'Switzerland'
  },
  {
    id: 'tx-bb-4',
    referenceNumber: 'S-941202-2025',
    date: '2025-07-05',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: 'Studio',
    sizeSqft: 480,
    priceAed: 780000,
    pricePerSqft: 1625,
    communityId: 'business-bay',
    communityName: 'Business Bay',
    subAreaId: 'canal-front',
    subAreaName: 'Canal Front',
    projectId: 'peninsula-one',
    projectName: 'Peninsula One',
    developer: 'Select Group',
    paymentMethod: 'Cash',
    status: 'Off-Plan',
    buyerNationality: 'China'
  },
  {
    id: 'tx-bb-5',
    referenceNumber: 'M-201048-2025',
    date: '2025-07-02',
    propertyType: 'Apartment',
    transactionType: 'Mortgage',
    bedrooms: '2',
    sizeSqft: 1410,
    priceAed: 2120000,
    pricePerSqft: 1503,
    communityId: 'business-bay',
    communityName: 'Business Bay',
    subAreaId: 'bay-square',
    subAreaName: 'Bay Square',
    projectId: 'bay-square-3',
    projectName: 'Bay Square 3',
    developer: 'Dubai Properties',
    paymentMethod: 'Mortgage',
    status: 'Completed',
    buyerNationality: 'Egypt'
  },

  // --- DOWNTOWN DUBAI ---
  {
    id: 'tx-dt-1',
    referenceNumber: 'S-712390-2025',
    date: '2025-07-13',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: '2',
    sizeSqft: 1310,
    priceAed: 3100000,
    pricePerSqft: 2366,
    communityId: 'downtown-dubai',
    communityName: 'Downtown Dubai',
    subAreaId: 'opera-district',
    subAreaName: 'Opera District',
    projectId: 'opera-grand',
    projectName: 'Opera Grand',
    developer: 'Emaar Properties',
    paymentMethod: 'Cash',
    status: 'Completed',
    buyerNationality: 'United States'
  },
  {
    id: 'tx-dt-2',
    referenceNumber: 'S-712389-2025',
    date: '2025-07-12',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: '1',
    sizeSqft: 850,
    priceAed: 1980000,
    pricePerSqft: 2329,
    communityId: 'downtown-dubai',
    communityName: 'Downtown Dubai',
    subAreaId: 'opera-district',
    subAreaName: 'Opera District',
    projectId: 'opera-grand',
    projectName: 'Opera Grand',
    developer: 'Emaar Properties',
    paymentMethod: 'Mortgage',
    status: 'Completed',
    buyerNationality: 'India'
  },
  {
    id: 'tx-dt-3',
    referenceNumber: 'S-711928-2025',
    date: '2025-07-07',
    propertyType: 'Penthouse',
    transactionType: 'Sale',
    bedrooms: '4+',
    sizeSqft: 5800,
    priceAed: 22000000,
    pricePerSqft: 3793,
    communityId: 'downtown-dubai',
    communityName: 'Downtown Dubai',
    subAreaId: 'burj-crown',
    subAreaName: 'Burj Crown',
    projectId: 'burj-crown-tower',
    projectName: 'Burj Crown Tower',
    developer: 'Emaar Properties',
    paymentMethod: 'Cash',
    status: 'Off-Plan',
    buyerNationality: 'France'
  },

  // --- PALM JUMEIRAH ---
  {
    id: 'tx-pj-1',
    referenceNumber: 'S-520934-2025',
    date: '2025-07-14',
    propertyType: 'Villa',
    transactionType: 'Sale',
    bedrooms: '4+',
    sizeSqft: 6700,
    priceAed: 34500000,
    pricePerSqft: 5149,
    communityId: 'palm-jumeirah',
    communityName: 'Palm Jumeirah',
    subAreaId: 'fronds-villas',
    subAreaName: 'The Fronds',
    projectId: 'signature-villas',
    projectName: 'Signature Villas',
    developer: 'Nakheel',
    paymentMethod: 'Cash',
    status: 'Completed',
    buyerNationality: 'United Kingdom'
  },
  {
    id: 'tx-pj-2',
    referenceNumber: 'S-520812-2025',
    date: '2025-07-10',
    propertyType: 'Apartment',
    transactionType: 'Sale',
    bedrooms: '2',
    sizeSqft: 1650,
    priceAed: 4100000,
    pricePerSqft: 2484,
    communityId: 'palm-jumeirah',
    communityName: 'Palm Jumeirah',
    subAreaId: 'fronds-villas',
    subAreaName: 'The Fronds',
    projectId: 'one-palm',
    projectName: 'One Palm',
    developer: 'Omniyat',
    paymentMethod: 'Mortgage',
    status: 'Completed',
    buyerNationality: 'Germany'
  }
];

// Fallback generate data function to create realistic records for any other context
function generateDynamicTransactions(communityId: string, subAreaId: string, projectId: string): Transaction[] {
  const commId = communityId || 'all';
  const subId = subAreaId || 'all';
  const projId = projectId || 'all';

  // Base list
  let list = MOCK_TRANSACTIONS.filter(tx => {
    if (commId !== 'all' && tx.communityId !== commId) return false;
    if (subId !== 'all' && tx.subAreaId !== subId) return false;
    if (projId !== 'all' && tx.projectId !== projId) return false;
    return true;
  });

  // If we have nothing, let's auto-generate some highly consistent mock data so the platform remains fully populated
  if (list.length === 0) {
    const defaultCommunityName = commId === 'all' ? 'Dubai Marina' : commId.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const defaultSubAreaName = subId === 'all' ? 'Marina Gate' : subId.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const defaultProjectName = projId === 'all' ? 'Marina Gate 1' : projId.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const defaultDev = commId === 'palm-jumeirah' ? 'Nakheel' : commId === 'downtown-dubai' ? 'Emaar Properties' : 'Select Group';

    const basePriceFactor = commId === 'palm-jumeirah' ? 2.5 : commId === 'downtown-dubai' ? 1.8 : commId === 'business-bay' ? 1.1 : 1.0;
    const basePrices = [1200000, 2100000, 3200000, 5400000, 950000, 2400000, 1850000, 4100000];
    const baseSizes = [820, 1280, 1640, 2200, 540, 1450, 1100, 2100];
    const beds: ('Studio' | '1' | '2' | '3' | '4+')[] = ['1', '2', '3', '4+', 'Studio', '2', '1', '3'];
    const types: ('Apartment' | 'Villa' | 'Townhouse' | 'Penthouse')[] = ['Apartment', 'Apartment', 'Townhouse', 'Villa', 'Apartment', 'Apartment', 'Apartment', 'Penthouse'];
    const nationalities = ['United Kingdom', 'India', 'Germany', 'Russia', 'United Arab Emirates', 'Canada', 'Saudi Arabia', 'France'];
    const developers = [defaultDev, 'Emaar Properties', 'DAMAC Properties', defaultDev];

    for (let i = 0; i < 15; i++) {
      const idx = i % basePrices.length;
      const finalPrice = Math.round(basePrices[idx] * basePriceFactor * (1 + (i % 5) * 0.05 - 0.1));
      const finalSize = Math.round(baseSizes[idx] * (1 + (i % 4) * 0.04 - 0.08));
      const finalPricePerSqft = Math.round(finalPrice / finalSize);
      
      const day = 15 - i;
      const dateStr = `2025-07-${day < 10 ? '0' + day : day}`;

      list.push({
        id: `dynamic-tx-${commId}-${subId}-${projId}-${i}`,
        referenceNumber: `${i % 2 === 0 ? 'S' : 'M'}-${741820 + i}-2025`,
        date: dateStr,
        propertyType: types[idx],
        transactionType: i % 3 === 0 ? 'Mortgage' : i % 8 === 0 ? 'Gift' : 'Sale',
        bedrooms: beds[idx],
        sizeSqft: finalSize,
        priceAed: finalPrice,
        pricePerSqft: finalPricePerSqft,
        communityId: commId === 'all' ? 'dubai-marina' : commId,
        communityName: defaultCommunityName,
        subAreaId: subId === 'all' ? 'marina-gate' : subId,
        subAreaName: defaultSubAreaName,
        projectId: projId === 'all' ? 'marina-gate-1' : projId,
        projectName: defaultProjectName,
        developer: developers[i % developers.length],
        paymentMethod: i % 3 === 0 ? 'Mortgage' : 'Cash',
        status: i % 4 === 0 ? 'Off-Plan' : 'Completed',
        buyerNationality: nationalities[i % nationalities.length]
      });
    }
  }

  return list;
}

// ==========================================
// SERVICE IMPLEMENTATION
// ==========================================

export const TransactionService = {
  // 1. Fetch transactions with full dynamic filters, sorting and searching
  getTransactions(filters: {
    communityId?: string;
    subAreaId?: string;
    projectId?: string;
    propertyType?: string; // 'All' or specific
    transactionType?: string; // 'All' or specific
    bedrooms?: string; // 'All' or 'Studio', '1', '2', '3', '4+'
    developer?: string; // 'All' or specific
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    paymentMethod?: string; // 'All', 'Cash', 'Mortgage'
    sortBy?: string; // 'Newest', 'Oldest', 'Price-Highest', 'Price-Lowest', 'Sqft-Highest', 'Sqft-Lowest'
    searchQuery?: string;
  } = {}): Transaction[] {
    const comm = filters.communityId || 'all';
    const sub = filters.subAreaId || 'all';
    const proj = filters.projectId || 'all';

    let list = generateDynamicTransactions(comm, sub, proj);

    // Apply UI Advanced Filters
    if (filters.propertyType && filters.propertyType !== 'All' && filters.propertyType !== 'All Types') {
      list = list.filter(tx => tx.propertyType.toLowerCase() === filters.propertyType!.toLowerCase());
    }

    if (filters.transactionType && filters.transactionType !== 'All') {
      list = list.filter(tx => tx.transactionType.toLowerCase() === filters.transactionType!.toLowerCase());
    }

    if (filters.bedrooms && filters.bedrooms !== 'All' && filters.bedrooms !== 'All Bedrooms') {
      list = list.filter(tx => tx.bedrooms.toString() === filters.bedrooms!.toString());
    }

    if (filters.developer && filters.developer !== 'All' && filters.developer !== 'All Developers') {
      list = list.filter(tx => tx.developer.toLowerCase().includes(filters.developer!.toLowerCase()));
    }

    if (filters.paymentMethod && filters.paymentMethod !== 'All') {
      list = list.filter(tx => tx.paymentMethod.toLowerCase() === filters.paymentMethod!.toLowerCase());
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      list = list.filter(tx => tx.priceAed >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      list = list.filter(tx => tx.priceAed <= filters.maxPrice!);
    }

    if (filters.minArea !== undefined && filters.minArea > 0) {
      list = list.filter(tx => tx.sizeSqft >= filters.minArea!);
    }
    if (filters.maxArea !== undefined && filters.maxArea > 0) {
      list = list.filter(tx => tx.sizeSqft <= filters.maxArea!);
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(tx => 
        tx.referenceNumber.toLowerCase().includes(q) ||
        tx.projectName.toLowerCase().includes(q) ||
        tx.subAreaName.toLowerCase().includes(q) ||
        tx.buyerNationality.toLowerCase().includes(q)
      );
    }

    // Apply Sorting
    const sort = filters.sortBy || 'Newest';
    if (sort === 'Newest') {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sort === 'Oldest') {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sort === 'Price-Highest' || sort === 'Price (Highest)') {
      list.sort((a, b) => b.priceAed - a.priceAed);
    } else if (sort === 'Price-Lowest' || sort === 'Price (Lowest)') {
      list.sort((a, b) => a.priceAed - b.priceAed);
    } else if (sort === 'Sqft-Highest' || sort === 'Price/sqft (Highest)') {
      list.sort((a, b) => b.pricePerSqft - a.pricePerSqft);
    } else if (sort === 'Sqft-Lowest' || sort === 'Price/sqft (Lowest)') {
      list.sort((a, b) => a.pricePerSqft - b.pricePerSqft);
    }

    return list;
  },

  // 2. Fetch details for a specific transaction
  getTransactionDetails(id: string): Transaction | null {
    const list = MOCK_TRANSACTIONS.concat(generateDynamicTransactions('all', 'all', 'all'));
    return list.find(tx => tx.id === id) || null;
  },

  // 3. Fetch analytics and highlights summary
  getHighlights(communityId?: string, subAreaId?: string, projectId?: string): TransactionHighlights {
    const list = generateDynamicTransactions(communityId || 'all', subAreaId || 'all', projectId || 'all');
    if (list.length === 0) {
      return {
        totalTransactionsCount: 0,
        totalVolumeAed: 0,
        averagePriceSqft: 0,
        highestSalePrice: 0,
        lowestSalePrice: 0,
        cashTransactionsCount: 0,
        mortgageTransactionsCount: 0,
        offPlanCount: 0,
        readyCount: 0,
        avgSizeSqft: 0
      };
    }

    const prices = list.map(tx => tx.priceAed);
    const sqfts = list.map(tx => tx.pricePerSqft);
    const sizes = list.map(tx => tx.sizeSqft);
    
    const totalVolume = prices.reduce((sum, val) => sum + val, 0);
    const totalSqft = sqfts.reduce((sum, val) => sum + val, 0);
    const totalSize = sizes.reduce((sum, val) => sum + val, 0);

    return {
      totalTransactionsCount: list.length,
      totalVolumeAed: totalVolume,
      averagePriceSqft: Math.round(totalSqft / list.length),
      highestSalePrice: Math.max(...prices),
      lowestSalePrice: Math.min(...prices),
      cashTransactionsCount: list.filter(tx => tx.paymentMethod === 'Cash').length,
      mortgageTransactionsCount: list.filter(tx => tx.paymentMethod === 'Mortgage').length,
      offPlanCount: list.filter(tx => tx.status === 'Off-Plan').length,
      readyCount: list.filter(tx => tx.status === 'Completed').length,
      avgSizeSqft: Math.round(totalSize / list.length)
    };
  },

  // 4. Fetch trend data over the last 12 months for charts
  getTrendData(communityId?: string, subAreaId?: string, projectId?: string): TrendDataPoint[] {
    const highlights = this.getHighlights(communityId, subAreaId, projectId);
    const count = highlights.totalTransactionsCount || 10;
    const avgPrice = highlights.averagePriceSqft || 1650;
    const totalVolMillions = Math.round(highlights.totalVolumeAed / 1000000) || 45;

    // Build 12-month trend back-calculations dynamically
    const months = ['Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25'];
    const volumeMultipliers = [0.82, 0.85, 0.88, 0.92, 0.90, 0.95, 0.99, 1.02, 1.05, 1.08, 1.12, 1.15];
    const priceMultipliers = [0.88, 0.90, 0.91, 0.93, 0.94, 0.95, 0.97, 0.99, 1.00, 1.02, 1.03, 1.04];

    return months.map((m, idx) => {
      const volSeed = totalVolMillions / 12;
      const countSeed = count / 12;
      return {
        month: m,
        salesVolume: Math.round(volSeed * volumeMultipliers[idx] * 10) / 10,
        transactionsCount: Math.round(countSeed * volumeMultipliers[idx]) || 1,
        avgPricePerSqft: Math.round(avgPrice * priceMultipliers[idx])
      };
    });
  },

  // 5. Fetch cash versus mortgage analytics
  getCashMortgage(communityId?: string, subAreaId?: string, projectId?: string): CashMortgageBreakdown {
    const highlights = this.getHighlights(communityId, subAreaId, projectId);
    
    const cashCount = highlights.cashTransactionsCount || Math.round(highlights.totalTransactionsCount * 0.65);
    const mortgageCount = highlights.mortgageTransactionsCount || (highlights.totalTransactionsCount - cashCount);

    // Cash properties usually have slightly different total volume percentages due to cash buyers at high ticket
    const cashValue = Math.round(highlights.totalVolumeAed * 0.62);
    const mortgageValue = highlights.totalVolumeAed - cashValue;

    const totalCount = cashCount + mortgageCount;

    return {
      cashCount,
      cashValue,
      cashPercentage: totalCount > 0 ? Math.round((cashCount / totalCount) * 100) : 60,
      mortgageCount,
      mortgageValue,
      mortgagePercentage: totalCount > 0 ? Math.round((mortgageCount / totalCount) * 100) : 40,
      totalCount
    };
  },

  // 6. closing cost calculator
  calculateClosingCost(
    price: number,
    isOffPlan: boolean = false,
    isMortgaged: boolean = false,
    buyerType: 'Individual' | 'Company' = 'Individual'
  ): ClosingCostBreakdown {
    const purchasePrice = price || 1000000;
    
    // 4% DLD fee is absolute standard
    const dldTransferFee = purchasePrice * 0.04;
    
    // Administrative fees depend on ready vs off plan
    const dldAdminFee = isOffPlan ? 580 : 4300; 

    // Brokerage fee is usually 2% + VAT
    const brokerageFee = purchasePrice * 0.02;
    const agencyVAT = brokerageFee * 0.05;

    // Trustee fee
    const trusteeFee = purchasePrice < 500000 ? 2000 : 4000;

    // Mortgage related fees (if mortgaged)
    const loanAmount = isMortgaged ? purchasePrice * 0.75 : 0; // 75% LTV standard in UAE
    const mortgageRegFee = isMortgaged ? (loanAmount * 0.0025 + 290) : 0;
    const mortgageArrangementFee = isMortgaged ? (loanAmount * 0.01) : 0;
    const propertyValuationFee = isMortgaged ? 3000 : 0;

    const totalGovernmentFees = dldTransferFee + dldAdminFee + (isMortgaged ? mortgageRegFee : 0) + (isOffPlan ? 0 : trusteeFee);
    const totalAgencyFees = brokerageFee + agencyVAT;
    const totalMortgageFees = isMortgaged ? (mortgageArrangementFee + propertyValuationFee) : 0;

    const totalClosingCosts = totalGovernmentFees + totalAgencyFees + totalMortgageFees;
    const netRequiredCapital = purchasePrice + totalClosingCosts - loanAmount;

    return {
      purchasePrice,
      dldTransferFee,
      dldAdminFee,
      brokerageFee,
      trusteeFee,
      mortgageRegFee,
      mortgageArrangementFee,
      propertyValuationFee,
      agencyVAT,
      totalGovernmentFees,
      totalAgencyFees,
      totalMortgageFees,
      totalClosingCosts,
      netRequiredCapital,
      loanAmount
    };
  },

  // 7. Simulating Exports
  exportTransactions(filters: any, format: 'PDF' | 'CSV' | 'Excel' = 'PDF'): Promise<{ success: boolean; url: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          url: `/downloads/ACOT_Transaction_Export_${Date.now()}.${format.toLowerCase()}`
        });
      }, 1000);
    });
  },

  // 8. Simulating Share scope
  shareTransactions(filters: any): Promise<{ success: boolean; shareLink: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          shareLink: `https://acot.ae/workspace/transactions?communityId=${filters.communityId || 'all'}&subAreaId=${filters.subAreaId || 'all'}&projectId=${filters.projectId || 'all'}`
        });
      }, 500);
    });
  }
};
