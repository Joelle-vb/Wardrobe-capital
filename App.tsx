import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  LineChart, 
  Sparkles, 
  Menu,
  X
} from 'lucide-react';
import { WardrobeItem, ViewState } from './types';
import { DashboardStats } from './components/DashboardStats';
import { WardrobeManager } from './components/WardrobeManager';
import { InvestmentSimulator } from './components/InvestmentSimulator';
import { Button } from './components/Button';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { getPortfolioAdvice } from './services/geminiService';

const App = () => {
  const [items, setItems] = useState<WardrobeItem[]>(() => {
    const saved = localStorage.getItem('wardrobe_items');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [advisorPrompt, setAdvisorPrompt] = useState('');
  const [advisorResponse, setAdvisorResponse] = useState('');
  const [isAdvising, setIsAdvising] = useState(false);

  useEffect(() => {
    localStorage.setItem('wardrobe_items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (newItem: Omit<WardrobeItem, 'id'>) => {
    const item: WardrobeItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9)
    };
    setItems([item, ...items]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleAskAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorPrompt.trim()) return;
    
    setIsAdvising(true);
    try {
      const advice = await getPortfolioAdvice(items, advisorPrompt);
      setAdvisorResponse(advice);
    } catch (err) {
      setAdvisorResponse("Error contacting advisor.");
    } finally {
      setIsAdvising(false);
    }
  };

  const NavItem = ({ id, icon, label }: { id: ViewState, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => { setView(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center px-4 py-3.5 text-sm font-medium transition-all duration-200 rounded-lg mb-1 ${
        view === id 
          ? 'bg-gray-900 text-white shadow-md' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#f9fafb] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg lg:shadow-none`}
      >
        <div className="h-full flex flex-col px-4">
          <div className="h-20 flex items-center justify-between px-2">
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Wardrobe<span className="text-gray-400 italic">Capital</span>
            </h1>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 py-6">
            <NavItem id="DASHBOARD" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
            <NavItem id="WARDROBE" icon={<ShoppingBag className="w-5 h-5" />} label="Assets" />
            <NavItem id="SIMULATOR" icon={<LineChart className="w-5 h-5" />} label="Investment Simulator" />
            <NavItem id="ADVISOR" icon={<Sparkles className="w-5 h-5" />} label="AI Advisory" />
          </nav>

          <div className="py-6 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Net Asset Value</p>
              <p className="text-xl font-serif font-bold text-gray-900">
                €{items.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-sm flex items-center px-4 lg:px-10 justify-between sticky top-0 z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 flex justify-between items-center">
             <div className="text-sm font-medium text-gray-900">
                {view === 'DASHBOARD' && 'Executive Overview'}
                {view === 'WARDROBE' && 'Asset Management'}
                {view === 'SIMULATOR' && 'Future Projections'}
                {view === 'ADVISOR' && 'Strategic Advice'}
             </div>
             <div className="text-xs text-gray-400 font-mono hidden sm:block">
                BTC/EUR: {(items.reduce((sum, i) => sum + i.price, 0) / 90000).toFixed(4)}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            {view === 'DASHBOARD' && <DashboardStats items={items} />}
            
            {view === 'WARDROBE' && (
              <WardrobeManager items={items} onAdd={handleAddItem} onDelete={handleDeleteItem} />
            )}
            
            {view === 'SIMULATOR' && <InvestmentSimulator />}

            {view === 'ADVISOR' && (
              <div className="max-w-3xl mx-auto h-full flex flex-col">
                <div className="flex-1 overflow-y-auto mb-6 pr-2 scrollbar-hide">
                  {advisorResponse ? (
                    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8">
                      <div className="flex items-center mb-6 text-gray-900 border-b border-gray-100 pb-4">
                          <div className="p-2 bg-emerald-50 rounded-lg mr-3">
                            <Sparkles className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <span className="font-serif font-bold text-lg block">Investment Memorandum</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Generated by Gemini 3.0 Pro</span>
                          </div>
                      </div>
                      <MarkdownRenderer content={advisorResponse} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                         <Sparkles className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">Portfolio Advisory</h3>
                      <p className="max-w-md text-gray-500 leading-relaxed">I can analyze your diversification, suggest liquidation strategies for underperforming assets, or calculate the ROI of your shoe collection.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAskAdvisor} className="relative mt-auto">
                  <input
                    value={advisorPrompt}
                    onChange={(e) => setAdvisorPrompt(e.target.value)}
                    placeholder="Ask for strategic advice (e.g. 'How can I optimize my coat collection?')"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-5 pr-32 py-4 text-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:outline-none shadow-sm transition-all placeholder:text-gray-400"
                  />
                  <div className="absolute right-2 top-2 bottom-2">
                      <Button type="submit" isLoading={isAdvising} className="h-full rounded-lg px-6">Analyze</Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;