import React from 'react';
import { TrendingUp, DollarSign, Activity, PieChart } from 'lucide-react';
import { WardrobeItem } from '../types';

interface DashboardStatsProps {
  items: WardrobeItem[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ items }) => {
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);
  const totalWears = items.reduce((sum, item) => sum + item.wearsPerYear, 0);
  
  // Simple assumption: Owned for 1 year for CPW calc in dashboard summary
  const avgCPW = totalWears > 0 ? totalValue / totalWears : 0;
  
  const categories = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.price;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categories).sort((a, b) => (b[1] as number) - (a[1] as number))[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Portfolio Value" 
          value={`€${totalValue.toLocaleString()}`} 
          icon={<DollarSign className="w-5 h-5 text-theme-accent" />} 
          trend="+12% growth"
          bgIcon="bg-theme-accent-bg"
        />
        <StatCard 
          title="Avg. Cost Per Wear" 
          value={`€${avgCPW.toFixed(2)}`} 
          icon={<Activity className="w-5 h-5 text-blue-600" />} 
          trend="Target: < €5.00"
          bgIcon="bg-blue-50"
        />
        <StatCard 
          title="Total Assets" 
          value={items.length.toString()} 
          icon={<ShoppingBagIcon />} 
          trend={`${items.filter(i => i.price > 300).length} investment pieces`}
          bgIcon="bg-purple-50"
        />
        <StatCard 
          title="Top Sector" 
          value={topCategory ? topCategory[0] : 'N/A'} 
          icon={<PieChart className="w-5 h-5 text-amber-600" />} 
          trend={topCategory ? `${Math.round(((topCategory[1] as number) / totalValue) * 100)}% allocation` : '0%'}
          bgIcon="bg-amber-50"
        />
      </div>

      <div className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-heading font-semibold text-theme-text mb-6">Asset Allocation</h3>
        <div className="space-y-5">
            {Object.entries(categories).map(([cat, value]) => {
                const val = value as number;
                const percentage = totalValue > 0 ? (val / totalValue) * 100 : 0;
                return (
                    <div key={cat}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-theme-text">{cat}</span>
                            <span className="text-theme-muted">€{val.toLocaleString()} <span className="opacity-70 ml-1">({percentage.toFixed(1)}%)</span></span>
                        </div>
                        <div className="w-full bg-theme-secondary rounded-full h-2">
                            <div 
                                className="bg-theme-primary h-2 rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                );
            })}
            {items.length === 0 && <p className="text-theme-muted italic text-center py-4">Your portfolio is currently empty. Add items to see analytics.</p>}
        </div>
      </div>
    </div>
  );
};

const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
)

const StatCard = ({ title, value, icon, trend, bgIcon }: any) => (
  <div className="bg-theme-card border border-theme-border p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div>
        <span className="text-theme-muted text-xs font-medium uppercase tracking-wider">{title}</span>
        <div className="text-2xl font-heading font-semibold text-theme-text mt-1">{value}</div>
      </div>
      <div className={`p-2 rounded-lg ${bgIcon}`}>
        {icon}
      </div>
    </div>
    <div className="text-xs text-theme-muted flex items-center">
        {trend.includes('+') || trend.includes('growth') ? 
            <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" /> : 
            <span className="w-1 h-1 bg-gray-400 rounded-full mr-1"></span>
        }
        {trend}
    </div>
  </div>
);