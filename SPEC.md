# AuraSEO — Real-Time Web Audit Engine

## 1. Concept & Vision

AuraSEO is a premium, glassmorphic web diagnostics platform that delivers instant technical audits through a sleek, futuristic interface. It transforms complex PageSpeed data into beautiful, client-ready visualizations with radial dials, animated charts, and downloadable PDF reports. The experience feels like a high-tech command center—powerful yet approachable.

## 2. Design Language

### Aesthetic Direction
Cyberpunk-glass aesthetic: deep space backgrounds with frosted glass panels, neon accent glows, and subtle gradient animations. Think Bloomberg Terminal meets sci-fi HUD.

### Color Palette
```
--bg-primary: #0a0a0f (deep space black)
--bg-secondary: #12121a (card backgrounds)
--bg-glass: rgba(255, 255, 255, 0.05) (glassmorphic panels)
--border-glass: rgba(255, 255, 255, 0.1) (glass borders)

--accent-cyan: #00f5d4 (primary accent - performance)
--accent-purple: #9b5de5 (secondary - SEO)
--accent-pink: #f15bb5 (tertiary - accessibility)
--accent-yellow: #fee440 (warning - best practices)

--text-primary: #ffffff
--text-secondary: #a0a0b0
--text-muted: #606070

--success: #00ff88
--warning: #ffaa00
--critical: #ff4466
```

### Typography
- **Headings**: Inter (700, 600) - clean, modern
- **Body**: Inter (400, 500)
- **Monospace/Metrics**: JetBrains Mono (for scores, technical data)

### Spatial System
- Base unit: 4px
- Card padding: 24px
- Section gaps: 48px
- Border radius: 16px (cards), 12px (buttons), 24px (large panels)

### Motion Philosophy
- Glassmorphic panels: backdrop-filter blur with subtle border glow on hover (200ms ease)
- Radial dial animations: smooth arc fills with spring easing (800ms)
- Chart data: staggered fade-in from left (100ms delay per data point)
- Loading states: pulsing gradient shimmer
- Page transitions: fade + subtle scale (300ms)

### Visual Assets
- **Icons**: Lucide React (consistent 1.5px stroke)
- **Charts**: Recharts with custom glassmorphic styling
- **Decorative**: Subtle grid pattern overlay, gradient orbs in background

## 3. Layout & Structure

### Page Architecture
```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR (fixed, glass)                                       │
│  [Logo + Status Badge]                    [History] [Export] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HERO SECTION                                                │
│  "Instant Deep-Tech Web Diagnostics Engine"                  │
│  [URL Input] [Mobile/Desktop Toggle] [Run Audit ⚡]         │
│  [Preset Tags: stripe.com | vercel.com | github.com]        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SCORECARDS GRID (4 columns on desktop)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │Performance│ │Accessibil│ │BestPract │ │   SEO    │        │
│  │  Radial   │ │  Radial  │ │  Radial  │ │  Radial  │        │
│  │ + Metrics │ │ + Metrics│ │ + Metrics│ │ + Metrics│        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  DIAGNOSTICS PANEL                                           │
│  [Core Web Vitals Chart] [Audit List Tabs]                 │
│  ┌────────────────────┐ ┌────────────────────────┐           │
│  │  Area/Bar Chart    │ │  Passed │ Warn │ Crit │           │
│  │  LCP, FID, CLS     │ │  - List of issues -   │           │
│  └────────────────────┘ └────────────────────────┘           │
│                                                              │
└─────────────────────────────────────────────────────────────┘

[History Drawer - slides from right]
[PDF Modal - centered overlay]
```

### Responsive Strategy
- Desktop: 4-column scorecards, side-by-side charts
- Tablet: 2-column scorecards, stacked charts
- Mobile: Single column, full-width components

## 4. Features & Interactions

### A. Navigation Bar
- **Logo**: "AURA.SEO // 01" with subtle glow effect
- **Status Badge**: "PageSpeed API v5 Active" with pulsing green dot
- **History Button**: Opens slide-out drawer from right
- **Export Button**: Triggers PDF modal (disabled until audit complete)

### B. Hero Audit Controller
- **URL Input**: Glassmorphic field, validates URL format, shows error state for invalid input
- **Device Toggle**: Pill-style toggle (Mobile/Desktop) with glass effect
- **Run Audit Button**: Gradient background, spark icon, disabled during loading
- **Preset Tags**: Clickable chips that auto-fill example domains

### C. Metric Scorecards
Each card contains:
- **Radial Dial**: Animated SVG arc (0-100), color-coded by score
- **Score Number**: Large JetBrains Mono display
- **Metric Label**: Category name
- **Sub-metrics**: 2-3 key metrics below the dial

**Score Interpretation**:
- 90-100: Excellent (cyan glow)
- 70-89: Good (yellow glow)
- 50-69: Needs Work (orange glow)
- 0-49: Poor (red glow)

### D. Core Web Vitals Chart
- Recharts AreaChart showing LCP, FID, CLS over time
- Interactive tooltips on hover
- Legend with color coding
- Animated data point transitions

### E. Audit List
- **Tabs**: Passed / Warnings / Critical Errors
- **List Items**: Icon + title + description + "Learn More" link
- **Count Badges**: Number of items per category
- **Animation**: Staggered list item reveal

### F. PDF Report Modal
- Translucent overlay with glassmorphic modal
- Summary: Overall score, key metrics, top issues
- "Download PDF" button (generates client-side PDF)
- "Close" button

### G. Audit History Drawer
- List of past audits (domain, date, score)
- Click to restore previous audit
- Delete individual entries
- Clear all history option

### Error Handling
- Invalid URL: Red border + "Please enter a valid URL"
- API Error: Toast notification with retry option
- Rate Limited: Warning message with countdown timer
- No Data: Empty state with helpful message

## 5. Component Inventory

### NavBar
- States: default, scrolled (enhanced blur)
- Elements: Logo, StatusBadge, HistoryButton, ExportButton

### URLInput
- States: default, focused, error, disabled, loading
- Validation: URL pattern check

### DeviceToggle
- States: mobile selected, desktop selected
- Animation: Slide indicator

### AuditButton
- States: default, hover, loading (spinner), disabled
- Gradient animation on hover

### PresetChip
- States: default, hover, active
- Click fills URL input

### ScoreCard
- States: loading (shimmer), loaded, error
- Props: title, score, metrics[], color

### RadialDial
- Animated SVG arc component
- Props: value (0-100), color, size

### CoreVitalsChart
- Recharts AreaChart wrapper
- States: loading, loaded, no-data

### AuditList
- Tabbed interface
- Props: passed[], warnings[], critical[]

### AuditListItem
- States: default, expanded
- Icon color by severity

### PDFModal
- States: open, closed
- Backdrop click to close

### HistoryDrawer
- States: open, closed
- Slide animation from right

### Toast
- Types: success, warning, error, info
- Auto-dismiss after 5s

## 6. Technical Approach

### Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom glass utilities
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth)
- **PDF**: jsPDF + html2canvas

### API Integration
**Google PageSpeed Insights API v5**
```
GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed
?url={encoded_url}
&strategy={mobile|desktop}
&key={API_KEY}
```

Response categories: performance, accessibility, best-practices, seo

### Supabase Schema
```sql
-- audits table
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  url TEXT NOT NULL,
  device TEXT NOT NULL,
  scores JSONB NOT NULL,
  core_vitals JSONB NOT NULL,
  audits_list JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- API rate limits (free tier)
-- 25,000 requests/day
-- 500 requests/100 seconds
```

### State Management
- React Context for global state (current audit, history)
- Local state for UI interactions
- Custom hooks: usePageSpeed, useSupabase, useAuditHistory

### File Structure
```
src/
├── components/
│   ├── NavBar.tsx
│   ├── Hero.tsx
│   ├── ScoreCard.tsx
│   ├── RadialDial.tsx
│   ├── CoreVitalsChart.tsx
│   ├── AuditList.tsx
│   ├── PDFModal.tsx
│   ├── HistoryDrawer.tsx
│   └── ui/ (shared components)
├── hooks/
│   ├── usePageSpeed.ts
│   ├── useSupabase.ts
│   └── useAuditHistory.ts
├── lib/
│   ├── pagespeed.ts
│   ├── supabase.ts
│   └── pdf.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

### Environment Variables
```
VITE_PAGESPEED_API_KEY=your_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
