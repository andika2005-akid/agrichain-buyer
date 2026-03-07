# AgriChain AI - Copilot Instructions

## Project Overview
AgriChain AI is a **React + TypeScript + Vite** dashboard for managing agricultural subsidy distribution in Indonesia. It features role-based access (farmer/admin/government), AI-powered eligibility scoring, blockchain audit trails, fraud detection, and geographic mapping.

## Architecture & Key Patterns

### Routing & Authentication
- **Framework**: React Router v6 with nested routes
- **Auth State**: `AuthContext` (no persistence - demo only) with three roles: `petani`, `admin`, `pemerintah`
- **Access Control**: Nav items filtered by role in `AppSidebar`; unauthenticated users always see `LoginPage`
- **Layout**: `DashboardLayout` wraps authenticated routes via `<Outlet />`

### UI & Component Library
- **Component Library**: shadcn/ui (Radix UI primitives + Tailwind)
- **Styling**: Tailwind CSS with custom color variables (`.gradient-primary`, `.gradient-secondary`, etc.)
- **Icons**: lucide-react for all icons
- **Animations**: framer-motion for page transitions and card animations
- **Charts**: Recharts for data visualization (BarChart, PieChart, AreaChart)

### Data & State Management
- **Mock Data**: All data in `src/data/mockData.ts` (provinces, farmer applications, blockchain records, fraud alerts)
- **Data Flow**: Components import mock data directly; no API integration yet
- **Query State**: TanStack React Query set up but minimal usage
- **Role-Based Content**: Pages check `useAuth().role` to show/hide content; see `DashboardPage` for example

### Page Structure
All pages follow this pattern:
1. Header with title and role-specific description
2. Motion wrapper for initial animation
3. Content grid (stat cards, tables, charts)
4. Use `useAuth()` for role-conditional rendering

**Pages** (`src/pages/`): DashboardPage, ScoringPage, BlockchainPage, FraudDetectionPage, MonitoringPage, PetaPotensiPage, RegistrasiPage

## Development Workflow

### Commands
```bash
npm run dev        # Start dev server (port 8080)
npm run build      # Production build
npm run test       # Run tests once
npm run test:watch # Watch mode
npm run lint       # Run ESLint
```

### Key Dependencies
- `react-router-dom`: Routing
- `@tanstack/react-query`: Server state (optional)
- `framer-motion`: Animations
- `recharts`: Charts
- `@hookform/resolvers`, `react-hook-form`: Forms (UI setup, minimal usage)
- `leaflet`: Map library (in package.json but unused in pages)

### TypeScript Configuration
- **Loose strictness**: No `strictNullChecks`, `noImplicitAny: false`, unused vars ignored
- **Path alias**: `@/` → `src/`
- **ESLint rules**: React Hooks enforced, React Refresh warnings allowed, no unused vars rule disabled

## Common Patterns & Conventions

### Import Paths
Always use path alias: `import { useAuth } from "@/contexts/AuthContext"`

### Component Pattern
```tsx
export default function ComponentName() {
  const { role } = useAuth(); // If role-dependent
  
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Content */}
    </motion.div>
  );
}
```

### Role Checks
```tsx
{role === "admin" && <AdminFeature />}
{["admin", "pemerintah"].includes(role) && <GovernmentFeature />}
```

### Styling
- Use Tailwind utilities (grid, gap, p-, text-, rounded-, etc.)
- Apply `cn()` utility from `@/lib/utils` for conditional classes
- Reference CSS variables for colors: `bg-primary`, `text-muted-foreground`, `gradient-primary`

### Mock Data Usage
```tsx
import { farmerApplications, provinceData } from "@/data/mockData";
```

## Critical Implementation Notes
1. **No real backend** – all data is mock; add API integration later
2. **Auth is demo-only** – no token storage, credentials are fixed role names
3. **Lovable-tagged** – vite.config uses `componentTagger()` in dev mode (Lovable integration)
4. **Indonesian terminology** – UI uses Indonesian labels; maintain consistency
5. **Role-specific pages** – Don't show "Monitoring" (pemerintah-only) in farmer sidebar
6. **Animations on mount** – Standard motion wrapper for page entry; no excessive animations

## When Adding Features
- Keep mock data in `src/data/mockData.ts` until API ready
- Create new page in `src/pages/` and add route in `App.tsx`
- Add nav item to `AppSidebar.navItems` with role filter
- Use existing shadcn components; avoid custom UI
- Wrap page content in motion wrapper for consistency
- Use Recharts for charts, lucide-react for icons
