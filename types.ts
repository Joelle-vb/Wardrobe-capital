export interface WardrobeItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  purchaseDate: string;
  wearsPerYear: number;
}

export type ViewState = 'DASHBOARD' | 'WARDROBE' | 'SIMULATOR' | 'ADVISOR';

export interface PortfolioStats {
  totalValue: number;
  totalItems: number;
  avgCostPerWear: number;
  topCategory: string;
}

export interface SimulationScenario {
  name: string;
  price: number;
  wearsPerYear: number;
  resaleValueAfter5Years: number;
}

export interface ThemeConfig {
  name: string;
  colors: {
    bg: string;
    card: string;
    text: string;
    muted: string;
    primary: string;
    secondary: string;
    accent: string;
    accentBg: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}