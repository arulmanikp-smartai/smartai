# BuySmart AI

Find the smartest product for your budget.

## Project Overview

BuySmart AI is a Next.js application designed to help users find the best products based on their budget constraints. The project is built with modern web technologies and best practices.

---

## Day 1 - Project Setup & Configuration

### ✅ Completed Tasks

#### 1. **Fixed npm/Node.js Environment**
   - **Issue**: `npm` command was not available in the shell PATH
   - **Root Cause**: Node Version Manager (nvm) initialization scripts had literal `\n` escape sequences instead of newlines in shell startup files
   - **Solution**: 
     - Fixed `~/.zshrc` and `~/.bash_profile` with proper newline formatting
     - Verified Node.js v24.16.0 and npm 11.13.0 are available via nvm
   - **Result**: `npm` now works seamlessly in terminal sessions

#### 2. **Project Structure Migration**
   - **Changed**: Migrated from root `app/` directory to `src/app/` structure
   - **Files Moved**:
     - `app/page.tsx` → `src/app/page.tsx`
     - `app/layout.tsx` → `src/app/layout.tsx`
     - `app/globals.css` → `src/app/globals.css`
     - `app/favicon.ico` → `src/app/favicon.ico`
   - **Benefit**: Aligns with industry best practices for Next.js projects with TypeScript

#### 3. **TypeScript Configuration Update**
   - **Updated**: `tsconfig.json`
   - **Changes**:
     - Added `baseUrl: "."` for proper module resolution
     - Updated path alias from `@/*` → `./src/*` (was `@/*` → `./*`)
     - Restricted `include` to `src/**/*` for cleaner type checking
   - **Impact**: Type safety improved and import aliases now correctly resolve to the `src/` directory

#### 4. **Development Server Verification**
   - **Tested**: Started Next.js development server with Turbopack
   - **Command**: `npm run dev -- --turbo`
   - **Result**: ✅ Server ready on `http://localhost:3000` in 133ms
   - **Stack Verified**:
     - Next.js 16.2.9 (with Turbopack)
     - React 19.2.4
     - Tailwind CSS 4 with PostCSS
     - TypeScript 5

#### 5. **VS Code CLI Setup**
   - **Issue**: `code .` command was not available from terminal
   - **Solution**: Created symlink in user-writable directory
     - Created `~/bin/` directory
     - Linked VS Code CLI to `~/bin/code`
     - Updated `~/.zshrc` to include `$HOME/bin` in PATH
   - **Result**: `code .` now works from any directory

#### 6. **Homepage Component Implementation**
   - **Updated**: `src/app/page.tsx`
   - **New Content**:
     ```
     BuySmart AI (Main heading)
     Find the smartest product for your budget. (Tagline)
     ```
   - **Styling**: Uses Tailwind CSS utility classes for responsive design
   - **Removed**: Default create-next-app boilerplate content

#### 7. **Git Commit**
   - **Commit Message**: "Day 1 - BuySmart AI setup"
   - **Commit Hash**: `854672f`
   - **Changes Tracked**:
     - Directory structure migration
     - Configuration updates
     - New homepage content

---

## Day 2 - Search Form UI

### ✅ Completed Tasks

#### 1. **Created Day 2 Branch**
   - New branch: `day-2-search-form`
   - Purpose: build the search form UI for product recommendations

#### 2. **Updated Homepage with Search Form UI**
   - Updated `src/app/page.tsx`
   - Added a centered search form layout using Tailwind CSS
   - Form fields included:
     - Category selector
     - Budget input
     - Country selector
     - Priority selector
     - Recommendation button
   - Result: a clean Day 2 product search UI for BuySmart AI

#### 3. **Committed Day 2 Work**
   - **Commit Message**: "Day 2 - Search form UI"
   - **Commit Hash**: `9fe56d5`

---

| **Turbopack** | Enabled | Fast bundler |

---

## Getting Started

### Prerequisites
- Node.js v24.16.0+ (via nvm)
- npm 11.13.0+

### Installation

```bash
# Navigate to project
cd /Users/arulmanikulanthaivelu/buysmart-ai

# Install dependencies
npm install
```

### Development

```bash
# Start dev server with Turbopack
npm run dev -- --turbo

# Or standard dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```
buysmart-ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout component
│   │   ├── page.tsx         # Home page (BuySmart AI landing)
│   │   ├── globals.css      # Global styles with Tailwind
│   │   └── favicon.ico      # Site favicon
├── public/                   # Static assets
├── node_modules/            # Dependencies (auto-generated)
├── .git/                    # Git repository
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
├── eslint.config.mjs        # ESLint configuration
├── package.json             # Project dependencies & scripts
└── README.md               # This file
```

---

## Configuration Details

### TypeScript Path Aliases
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```
Use `@/` prefix to import from `src/` directory for cleaner imports.

### Environment
- **Shell**: zsh (with nvm for Node.js management)
- **OS**: macOS
- **Package Manager**: npm

---

## Next Steps (Day 2+)

- [ ] Create product search functionality
- [ ] Set up API routes for backend
- [ ] Implement database integration
- [ ] Add product filtering by budget
- [ ] Build user authentication
- [ ] Deploy to production

---

## Git History

```
854672f (HEAD -> main) Day 1 - BuySmart AI setup
393a76d Initial commit from Create Next App
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: June 10, 2026  
**Status**: ✅ Day 1 Complete

