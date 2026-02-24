import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  LineChart, 
  Sparkles, 
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { WardrobeItem, ViewState } from './types';
import { DashboardStats } from './components/DashboardStats';
import { WardrobeManager } from './components/WardrobeManager';
import { InvestmentSimulator } from './components/InvestmentSimulator';
import { Button } from './components/Button';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { getPortfolioAdvice } from './services/geminiService';
import { ThemeProvider } from './components/ThemeContext';
import { ThemePanel } from './components/ThemePanel';
import { AuthProvider } from './components/AuthContext';

const AppContent = () => {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [advisorPrompt, setAdvisorPrompt] = useState('');
  const [advisorResponse, setAdvisorResponse] = useState('');
  const [isAdvising, setIsAdvising] = useState(false);

  useEffect(() => {
    fetch('/api/items')
      .then(res => {
        if (!res.ok) {
          console.error('Fetch items failed with status:', res.status, res.statusText);
          throw new Error(`Failed to fetch items: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error('Expected array of items, got:', data);
          setItems([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch items', err);
        setItems([]);
      });
  }, []);

  const handleAddItem = async (newItem: Omit<WardrobeItem, 'id'>) => {
    const item: WardrobeItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    // Optimistic update
    setItems([item, ...items]);

    try {
      await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    } catch (err) {
      console.error('Failed to save item', err);
      // Revert on failure
      setItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleDeleteItem = async (id: string) => {
    const oldItems = [...items];
    setItems(items.filter(i => i.id !== id));

    try {
      await fetch(`/api/items/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete item', err);
      setItems(oldItems);
    }
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
          ? 'bg-theme-primary text-theme-card shadow-md' 
          : 'text-theme-muted hover:text-theme-text hover:bg-theme-secondary'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-theme-bg font-body overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-theme-card border-r border-theme-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg lg:shadow-none`}
      >
        <div className="h-full flex flex-col px-4">
          <div className="h-20 flex items-center justify-between px-2">
            <h1 className="text-2xl font-heading font-bold text-theme-text tracking-tight">
              Wardrobe<span className="text-theme-muted italic">Capital</span>
            </h1>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-theme-muted hover:text-theme-text">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 py-6">
            <NavItem id="DASHBOARD" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
            <NavItem id="WARDROBE" icon={<ShoppingBag className="w-5 h-5" />} label="Assets" />
            <NavItem id="SIMULATOR" icon={<LineChart className="w-5 h-5" />} label="Investment Simulator" />
            <NavItem id="ADVISOR" icon={<Sparkles className="w-5 h-5" />} label="AI Advisory" />
          </nav>

          <div className="py-6 border-t border-theme-border">
            <div className="bg-theme-secondary rounded-xl p-4 border border-theme-border mb-4">
              <p className="text-xs text-theme-muted font-medium uppercase tracking-wider mb-1">Net Asset Value</p>
              <p className="text-xl font-heading font-bold text-theme-text">
                €{items.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-theme-border bg-theme-card/80 backdrop-blur-sm flex items-center px-4 lg:px-10 justify-between sticky top-0 z-10 transition-colors duration-300">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-theme-muted hover:text-theme-text"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 flex justify-between items-center">
             <div className="text-sm font-medium text-theme-text">
                {view === 'DASHBOARD' && 'Executive Overview'}
                {view === 'WARDROBE' && 'Asset Management'}
                {view === 'SIMULATOR' && 'Future Projections'}
                {view === 'ADVISOR' && 'Strategic Advice'}
             </div>
             <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-theme-text hidden sm:block">
                  Guest User
                </div>
                <div className="text-xs text-theme-muted font-mono hidden sm:block">
                    BTC/EUR: {(items.reduce((sum, i) => sum + i.price, 0) / 90000).toFixed(4)}
                </div>
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
                    <div className="bg-theme-card border border-theme-border shadow-sm rounded-xl p-8 transition-colors duration-300">
                      <div className="flex items-center mb-6 text-theme-text border-b border-theme-border pb-4">
                          <div className="p-2 bg-theme-accent-bg rounded-lg mr-3">
                            <Sparkles className="w-5 h-5 text-theme-accent" />
                          </div>
                          <div>
                            <span className="font-heading font-bold text-lg block">Investment Memorandum</span>
                            <span className="text-xs text-theme-muted uppercase tracking-wide">Generated by Gemini 3.0 Pro</span>
                          </div>
                      </div>
                      <MarkdownRenderer content={advisorResponse} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-theme-muted">
                      <div className="w-16 h-16 bg-theme-secondary rounded-full flex items-center justify-center mb-6">
                         <Sparkles className="w-8 h-8 text-theme-muted/50" />
                      </div>
                      <h3 className="text-xl font-heading font-medium text-theme-text mb-3">Portfolio Advisory</h3>
                      <p className="max-w-md leading-relaxed">I can analyze your diversification, suggest liquidation strategies for underperforming assets, or calculate the ROI of your shoe collection.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAskAdvisor} className="relative mt-auto">
                  <input
                    value={advisorPrompt}
                    onChange={(e) => setAdvisorPrompt(e.target.value)}
                    placeholder="Ask for strategic advice (e.g. 'How can I optimize my coat collection?')"
                    className="w-full bg-theme-card border border-theme-border rounded-xl pl-5 pr-32 py-4 text-theme-text focus:ring-2 focus:ring-theme-primary/10 focus:border-theme-primary focus:outline-none shadow-sm transition-all placeholder:text-theme-muted"
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

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppContent />
      <ThemePanel />
    </AuthProvider>
  </ThemeProvider>
);

export default App;