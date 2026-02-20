import React, { useState } from 'react';
import { Button } from './Button';
import { TrendingUp, Sparkles } from 'lucide-react';
import { estimateResale } from '../services/geminiService';

export const InvestmentSimulator: React.FC = () => {
    const [scenario, setScenario] = useState({
        name: '',
        brand: '',
        category: 'Bags',
        price: 1000,
        wearsPerYear: 50
    });
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const resultJson = await estimateResale(scenario.brand, scenario.category, scenario.price);
            const result = JSON.parse(resultJson);
            setAnalysis(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const costPerWear3Year = (scenario.price / (scenario.wearsPerYear * 3)).toFixed(2);
    const costPerWear5Year = (scenario.price / (scenario.wearsPerYear * 5)).toFixed(2);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-heading font-bold text-theme-text">Investment Simulator</h2>
                <p className="text-theme-muted mt-2 max-w-lg mx-auto">Make smarter purchase decisions. Project the long-term ROI and utility of your next potential acquisition.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-5 bg-theme-card border border-theme-border shadow-sm p-8 rounded-xl space-y-6 h-fit transition-colors duration-300">
                    <h3 className="text-lg font-heading font-semibold text-theme-text pb-2 border-b border-theme-border">Scenario Parameters</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wider mb-1.5">Item Name</label>
                            <input className="w-full bg-theme-secondary border border-theme-border rounded-lg p-3 text-theme-text focus:border-theme-primary focus:ring-0 outline-none transition-colors" 
                                value={scenario.name} onChange={e => setScenario({...scenario, name: e.target.value})} placeholder="e.g. Classic Trench" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wider mb-1.5">Brand</label>
                            <input className="w-full bg-theme-secondary border border-theme-border rounded-lg p-3 text-theme-text focus:border-theme-primary focus:ring-0 outline-none transition-colors" 
                                value={scenario.brand} onChange={e => setScenario({...scenario, brand: e.target.value})} placeholder="e.g. Burberry" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wider mb-1.5">Price (€)</label>
                                <input type="number" className="w-full bg-theme-secondary border border-theme-border rounded-lg p-3 text-theme-text focus:border-theme-primary focus:ring-0 outline-none transition-colors" 
                                    value={scenario.price} onChange={e => setScenario({...scenario, price: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-theme-muted uppercase tracking-wider mb-1.5">Wears / Year</label>
                                <input type="number" className="w-full bg-theme-secondary border border-theme-border rounded-lg p-3 text-theme-text focus:border-theme-primary focus:ring-0 outline-none transition-colors" 
                                    value={scenario.wearsPerYear} onChange={e => setScenario({...scenario, wearsPerYear: Number(e.target.value)})} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                         <Button className="w-full justify-center" onClick={handleSimulate} isLoading={loading} icon={<TrendingUp className="w-4 h-4"/>}>
                             Analyze Investment
                         </Button>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-7 bg-theme-card border border-theme-border shadow-sm p-8 rounded-xl flex flex-col justify-center min-h-[400px] transition-colors duration-300">
                    {!analysis && !loading && (
                        <div className="text-center text-theme-muted flex flex-col items-center">
                            <div className="p-4 bg-theme-secondary rounded-full mb-4">
                                <Sparkles className="w-8 h-8 text-theme-muted/50" />
                            </div>
                            <p>Configure a scenario to view financial projections.</p>
                        </div>
                    )}
                    
                    {analysis && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between border-b border-theme-border pb-6">
                                <div>
                                    <div className="text-xs font-semibold text-theme-muted uppercase tracking-wide mb-1">Retention (5-Year)</div>
                                    <div className="text-4xl font-heading font-bold text-theme-text">{analysis.retentionPercentage || 35}%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-semibold text-theme-muted uppercase tracking-wide mb-1">Resale Value</div>
                                    <div className="text-2xl font-bold text-theme-accent bg-theme-accent-bg px-3 py-1 rounded-lg">
                                        €{((scenario.price * (analysis.retentionPercentage || 35)) / 100).toFixed(0)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-theme-secondary p-4 rounded-lg border border-theme-border">
                                    <div className="text-xs text-theme-muted mb-1">CPW (3 Years)</div>
                                    <div className="text-xl font-mono font-medium text-theme-text">€{costPerWear3Year}</div>
                                </div>
                                <div className="bg-theme-accent-bg p-4 rounded-lg border border-theme-accent/20">
                                    <div className="text-xs text-theme-accent mb-1">CPW (5 Years)</div>
                                    <div className="text-xl font-mono font-medium text-theme-accent">€{costPerWear5Year}</div>
                                </div>
                            </div>

                            <div className="text-sm text-theme-text bg-theme-secondary border border-theme-border p-5 rounded-lg leading-relaxed">
                                <div className="flex items-center text-theme-primary font-semibold mb-2">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    AI Analyst Note
                                </div>
                                {analysis.reasoning || "Based on historical data for this brand tier, the item maintains moderate value due to brand recognition but may suffer from trend cycles."}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};