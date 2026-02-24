# Wardrobe Capital

Treat your wardrobe as an investment portfolio. Track cost per wear, estimate resale values, and optimize your fashion investments.

## 🚀 Features

- **Executive Overview (Dashboard):** Real-time visualization of wardrobe value, cost-per-wear efficiency, and category distribution.
- **Asset Management (Wardrobe):** Full CRUD capabilities for tracking individual items with metadata (price, brand, material, condition, etc.).
- **Investment Simulator:** Project the future value of your wardrobe based on market trends and depreciation.
- **Strategic AI Advisory:** Personalized investment advice for your wardrobe powered by Gemini 3.0 Pro.
- **Dynamic Theming:** Multiple aesthetic presets (Chic, Brutalist, Midnight, Organic) that change the entire UI mood.
- **Bypassed Authentication:** Direct access to a guest account for immediate interaction without login friction.

## 📂 Project Structure

### Core Files
- `App.tsx`: Main application entry point, layout, and global state management.
- `server.ts`: Express backend with SQLite integration for persistent storage.
- `types.ts`: TypeScript interfaces for Wardrobe items and application state.
- `wardrobe.db`: SQLite database file for local data persistence.

### Components (`/components`)
- `DashboardStats.tsx`: Visualizes portfolio metrics and distribution using custom Tailwind-based charts.
- `WardrobeManager.tsx`: Interface for adding, viewing, and deleting assets.
- `InvestmentSimulator.tsx`: Tool for projecting future asset values based on depreciation models.
- `ThemePanel.tsx`: Retractable settings panel for UI customization and theme switching.
- `ThemeContext.tsx`: Manages active theme state and CSS variable injection.
- `MarkdownRenderer.tsx`: Renders AI-generated advice with clean, editorial typography.
- `CodeEditor.tsx`: Utility component for code input and display.
- `Button.tsx`: Reusable styled button component with loading states.
- `AuthContext.tsx`: Simplified context for user session management (configured for guest access).

### Services (`/services`)
- `geminiService.ts`: Integration with Google Gemini API for fashion-focused investment advisory.

## 🎨 Design System

### Typography
- **Headings:** `Playfair Display` (Editorial Serif) for a premium, high-fashion feel.
- **Body:** `Inter` (Clean Sans-Serif) for maximum legibility in data-heavy views.
- **Data:** `JetBrains Mono` (Technical Monospace) for currency and metric displays.

### Colors & Moods
The application uses a dynamic CSS variable system (`--color-primary`, `--color-bg`, etc.) supporting multiple moods:
- **Chic (Default):** Clean, light, and professional.
- **Brutalist:** High-contrast, bold, and graphic.
- **Midnight:** Deep dark mode for focused analysis.
- **Organic:** Warm, earthy tones for a soft, human feel.

### UI Patterns
- **Radius:** Modern `rounded-xl` (12px) and `rounded-2xl` (16px) for cards and buttons.
- **Shadows:** Subtle `shadow-sm` for depth without heaviness.
- **Borders:** Thin `border-black/5` or `border-white/10` for elegant separation.

## 🛠 Libraries & Tools

- **React 19:** Modern functional components and hooks.
- **Tailwind CSS:** Utility-first styling (via CDN for rapid prototyping).
- **Lucide React:** Consistent, crisp SVG iconography.
- **@google/genai:** Powering the AI Strategic Advisory features.
- **Better-SQLite3:** High-performance local database for asset persistence.
- **Express:** Backend API framework for handling asset CRUD and sessions.
- **React Markdown:** For rendering structured, readable AI responses.

## 💡 Important Behavior

- **Optimistic Updates:** Adding or deleting items reflects in the UI immediately, with background synchronization to the SQLite database.
- **Retractable Settings:** Design controls are integrated into a retractable panel to maintain a clean, focused workspace.
- **Responsive Design:** A flexible sidebar-based layout that adapts from desktop "Mission Control" to mobile-friendly views.
- **Persistent Sessions:** Uses `express-session` with SQLite to maintain your wardrobe data across refreshes.
