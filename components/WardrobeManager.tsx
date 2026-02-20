import React, { useState } from 'react';
import { Plus, Trash2, ShoppingBag } from 'lucide-react';
import { WardrobeItem } from '../types';
import { Button } from './Button';

interface WardrobeManagerProps {
  items: WardrobeItem[];
  onAdd: (item: Omit<WardrobeItem, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const WardrobeManager: React.FC<WardrobeManagerProps> = ({ items, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    brand: '',
    category: 'Tops',
    price: '',
    wearsPerYear: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: newItem.name,
      brand: newItem.brand,
      category: newItem.category,
      price: Number(newItem.price),
      purchaseDate: new Date().toISOString(),
      wearsPerYear: Number(newItem.wearsPerYear)
    });
    setNewItem({ name: '', brand: '', category: 'Tops', price: '', wearsPerYear: '' });
    setIsAdding(false);
  };

  const calculateCPW = (price: number, wears: number) => {
      // Assuming 3 year ownership for simple calculation visualization
      if (wears === 0) return price;
      return (price / (wears * 3)).toFixed(2);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-heading font-bold text-theme-text">Portfolio Holdings</h2>
            <p className="text-sm text-theme-muted mt-1">Manage your assets and track depreciation.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} icon={<Plus className="w-4 h-4" />}>
          Add Asset
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-theme-card border border-theme-border shadow-lg p-6 rounded-xl space-y-5 animate-in fade-in slide-in-from-top-2 transition-colors duration-300">
          <h3 className="text-sm font-semibold text-theme-text uppercase tracking-wide">New Acquisition Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-theme-muted mb-1.5">Item Name</label>
              <input 
                required
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-primary focus:ring-0 outline-none transition-colors"
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
                placeholder="e.g. Silk Blouse"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-theme-muted mb-1.5">Brand</label>
              <input 
                required
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-primary focus:ring-0 outline-none transition-colors"
                value={newItem.brand}
                onChange={e => setNewItem({...newItem, brand: e.target.value})}
                placeholder="e.g. Everlane"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-theme-muted mb-1.5">Price (€)</label>
              <input 
                required
                type="number"
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-primary focus:ring-0 outline-none transition-colors"
                value={newItem.price}
                onChange={e => setNewItem({...newItem, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
             <div>
              <label className="block text-xs font-medium text-theme-muted mb-1.5">Est. Wears / Year</label>
              <input 
                required
                type="number"
                className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-primary focus:ring-0 outline-none transition-colors"
                value={newItem.wearsPerYear}
                onChange={e => setNewItem({...newItem, wearsPerYear: e.target.value})}
                placeholder="50"
              />
            </div>
            <div className="md:col-span-2">
                <label className="block text-xs font-medium text-theme-muted mb-1.5">Category</label>
                <select 
                    className="w-full bg-theme-secondary border border-theme-border rounded-lg p-2.5 text-theme-text focus:border-theme-primary focus:ring-0 outline-none transition-colors"
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                    <option>Tops</option>
                    <option>Bottoms</option>
                    <option>Outerwear</option>
                    <option>Shoes</option>
                    <option>Bags</option>
                    <option>Accessories</option>
                </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button type="submit">Add to Portfolio</Button>
          </div>
        </form>
      )}

      <div className="bg-theme-card border border-theme-border rounded-xl shadow-sm overflow-hidden transition-colors duration-300">
        <table className="w-full text-left text-sm">
          <thead className="bg-theme-secondary text-theme-muted uppercase text-xs font-medium border-b border-theme-border">
            <tr>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Acquisition Cost</th>
              <th className="px-6 py-4 text-right">Est. CPW (3yr)</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-theme-secondary/50 transition-colors">
                <td className="px-6 py-4 text-theme-text">
                    <div className="flex items-center">
                        <div className="p-2 bg-theme-secondary rounded-md mr-3 text-theme-muted">
                             <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="font-medium font-heading">{item.name}</div>
                            <div className="text-xs text-theme-muted">{item.brand}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-theme-muted">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-theme-secondary text-theme-text">
                        {item.category}
                    </span>
                </td>
                <td className="px-6 py-4 text-right text-theme-text font-medium">€{item.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-right font-mono text-emerald-600 bg-emerald-50/10">€{calculateCPW(item.price, item.wearsPerYear)}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="text-theme-muted hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-theme-muted bg-theme-secondary/20">
                        <div className="flex flex-col items-center">
                            <ShoppingBag className="w-8 h-8 mb-2 opacity-20" />
                            <p>No assets in your portfolio. Start building your wardrobe wealth.</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};