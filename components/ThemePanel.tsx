import React, { useState } from 'react';
import { Settings, X, Palette, Type, Check } from 'lucide-react';
import { useTheme, themes } from './ThemeContext';

export const ThemePanel: React.FC = () => {
  const { currentTheme, setTheme, updateCustomTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const fontOptions = {
    headings: ['Playfair Display', 'Montserrat', 'Merriweather', 'DM Sans', 'Inter'],
    body: ['Inter', 'DM Sans', 'JetBrains Mono', 'Montserrat']
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-theme-primary text-theme-card rounded-full shadow-xl hover:shadow-2xl transition-all z-50 hover:scale-110"
        title="Customize Theme"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-theme-card border-l border-theme-border shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto animate-in slide-in-from-right">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-heading font-bold text-theme-text">Style Editor</h2>
          <button onClick={() => setIsOpen(false)} className="text-theme-muted hover:text-theme-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-4 flex items-center">
            <Palette className="w-3 h-3 mr-2" /> Presets
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden group ${
                  currentTheme.name === theme.name 
                    ? 'border-theme-primary ring-1 ring-theme-primary bg-theme-secondary' 
                    : 'border-theme-border hover:border-theme-muted'
                }`}
              >
                <div className="text-sm font-medium text-theme-text mb-1 relative z-10">{theme.name}</div>
                <div className="flex space-x-1 relative z-10">
                  <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: theme.colors.bg }}></div>
                  <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: theme.colors.primary }}></div>
                  <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: theme.colors.accent }}></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-4 flex items-center">
            <Type className="w-3 h-3 mr-2" /> Typography
          </h3>
          
          <div className="mb-4">
            <label className="block text-xs text-theme-muted mb-2">Heading Font</label>
            <select 
              value={currentTheme.fonts.heading}
              onChange={(e) => updateCustomTheme({ fonts: { ...currentTheme.fonts, heading: e.target.value } })}
              className="w-full bg-theme-secondary border border-theme-border rounded px-3 py-2 text-sm text-theme-text focus:outline-none focus:border-theme-primary"
            >
              {fontOptions.headings.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-theme-muted mb-2">Body Font</label>
            <select 
              value={currentTheme.fonts.body}
              onChange={(e) => updateCustomTheme({ fonts: { ...currentTheme.fonts, body: e.target.value } })}
              className="w-full bg-theme-secondary border border-theme-border rounded px-3 py-2 text-sm text-theme-text focus:outline-none focus:border-theme-primary"
            >
              {fontOptions.body.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Color Tuning */}
        <div>
          <h3 className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-4 flex items-center">
            <Settings className="w-3 h-3 mr-2" /> Fine Tune Colors
          </h3>
          
          <div className="space-y-3">
             <ColorInput label="Background" value={currentTheme.colors.bg} onChange={(v) => updateCustomTheme({ colors: { ...currentTheme.colors, bg: v } })} />
             <ColorInput label="Card Background" value={currentTheme.colors.card} onChange={(v) => updateCustomTheme({ colors: { ...currentTheme.colors, card: v } })} />
             <ColorInput label="Primary Text" value={currentTheme.colors.text} onChange={(v) => updateCustomTheme({ colors: { ...currentTheme.colors, text: v } })} />
             <ColorInput label="Primary Action" value={currentTheme.colors.primary} onChange={(v) => updateCustomTheme({ colors: { ...currentTheme.colors, primary: v } })} />
             <ColorInput label="Accent Color" value={currentTheme.colors.accent} onChange={(v) => updateCustomTheme({ colors: { ...currentTheme.colors, accent: v } })} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-theme-muted">{label}</span>
    <div className="flex items-center">
      <input 
        type="color" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border-0 p-0 mr-2 bg-transparent"
      />
      <span className="text-xs font-mono text-theme-muted uppercase">{value}</span>
    </div>
  </div>
);