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
                <h2 className="text-3xl font-serif font-bold text-gray-900">Investment Simulator</h2>
                <p className="text-gray-500 mt-2 max-w-lg mx-auto">Make smarter purchase decisions. Project the long-term ROI and utility of your next potential acquisition.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-5 bg-white border border-gray-100 shadow-sm p-8 rounded-xl space-y-6 h-fit">
                    <h3 className="text-lg font-serif font-semibold text-gray-900 pb-2 border-b border-gray-100">Scenario Parameters</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Item Name</label>
                            <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-gray-400 focus:ring-0 outline-none" 
                                value={scenario.name} onChange={e => setScenario({...scenario, name: e.target.value})} placeholder="e.g. Classic Trench" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Brand</label>
                            <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-gray-400 focus:ring-0 outline-none" 
                                value={scenario.brand} onChange={e => setScenario({...scenario, brand: e.target.value})} placeholder="e.g. Burberry" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price (€)</label>
                                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-gray-400 focus:ring-0 outline-none" 
                                    value={scenario.price} onChange={e => setScenario({...scenario, price: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Wears / Year</label>
                                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-gray-400 focus:ring-0 outline-none" 
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
                <div className="lg:col-span-7 bg-white border border-gray-100 shadow-sm p-8 rounded-xl flex flex-col justify-center min-h-[400px]">
                    {!analysis && !loading && (
                        <div className="text-center text-gray-400 flex flex-col items-center">
                            <div className="p-4 bg-gray-50 rounded-full mb-4">
                                <Sparkles className="w-8 h-8 text-gray-300" />
                            </div>
                            <p>Configure a scenario to view financial projections.</p>
                        </div>
                    )}
                    
                    {analysis && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                                <div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Retention (5-Year)</div>
                                    <div className="text-4xl font-serif font-bold text-gray-900">{analysis.retentionPercentage || 35}%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Resale Value</div>
                                    <div className="text-2xl font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                                        €{((scenario.price * (analysis.retentionPercentage || 35)) / 100).toFixed(0)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1">CPW (3 Years)</div>
                                    <div className="text-xl font-mono font-medium text-gray-900">€{costPerWear3Year}</div>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                                    <div className="text-xs text-emerald-700 mb-1">CPW (5 Years)</div>
                                    <div className="text-xl font-mono font-medium text-emerald-800">€{costPerWear5Year}</div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 p-5 rounded-lg leading-relaxed">
                                <div className="flex items-center text-blue-800 font-semibold mb-2">
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