# Getting Started with Stereo Development

**Quick reference for jumping into development**

---

## 📋 What We Have Now

✅ **Complete Documentation**
- `README.md` - Project overview and quick start
- `ROADMAP.md` - Development phases and features
- `CONTRIBUTING.md` - Development guidelines and coding standards
- `docs/PRD.md` - Full product requirements document
- `docs/ARCHITECTURE.md` - Technical architecture and design decisions
- `Plan-mode.md` - Original planning session notes

✅ **Project Foundation**
- Git repository initialized
- License (MIT)
- .gitignore configured

---

## 🚀 Next Steps - Phase 1: Core Engine

### Step 1: Initialize Project Structure

Create the folder structure:

```bash
mkdir -p core desktop/main desktop/renderer web test
```

### Step 2: Setup package.json

Initialize Node.js project and install dependencies:

```bash
npm init -y

# Core dependencies
npm install typescript @types/node

# Desktop (Electron)
npm install electron electron-builder

# Web (Webpack + Tooling)
npm install webpack webpack-cli webpack-dev-server
npm install ts-loader css-loader postcss-loader
npm install html-webpack-plugin

# UI (React + Tailwind)
npm install react react-dom preact
npm install @types/react @types/react-dom
npm install tailwindcss autoprefixer postcss

# Testing
npm install --save-dev jest ts-jest @types/jest
npm install --save-dev @testing-library/react @testing-library/jest-dom

# FFmpeg (for recording)
npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg
npm install @types/fluent-ffmpeg

# Utilities
npm install eventemitter3
```

### Step 3: Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["core/**/*", "desktop/**/*", "web/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

### Step 4: Configure Jest

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverageFrom: [
    'core/**/*.ts',
    'desktop/**/*.ts',
    'web/**/*.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Step 5: Start with Timer Module (TDD)

Create `test/Timer.test.ts` first:

```typescript
import { Timer } from '../core/Timer';

describe('Timer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create timer with default values', () => {
    const timer = new Timer(60, 1);
    expect(timer.getFPS()).toBe(60);
    expect(timer.getHold()).toBe(1);
  });

  it('should calculate effective frequency', () => {
    const timer = new Timer(60, 6);
    expect(timer.getEffectiveFrequency()).toBe(10); // 60/6 = 10 Hz
  });

  it('should call callback at correct intervals', (done) => {
    const callback = jest.fn();
    const timer = new Timer(60, 6);
    timer.start(callback);

    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      timer.stop();
      done();
    }, 150); // Should fire once in 100ms (6/60 = 0.1s)
  });

  it('should update FPS dynamically', () => {
    const timer = new Timer(30, 1);
    timer.setFPS(60);
    expect(timer.getFPS()).toBe(60);
    expect(timer.getEffectiveFrequency()).toBe(60);
  });

  it('should throw error for invalid FPS', () => {
    const timer = new Timer(60, 1);
    expect(() => timer.setFPS(0)).toThrow();
    expect(() => timer.setFPS(-10)).toThrow();
  });
});
```

Then implement `core/Timer.ts` to make tests pass.

---

## 📝 Development Workflow

### Daily Development

1. **Write test first** (TDD approach)
2. **Run tests**: `npm test -- --watch`
3. **Implement feature** to make test pass
4. **Refactor** if needed
5. **Commit** with descriptive message

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- Timer.test.ts

# Run with coverage
npm test -- --coverage
```

### Commit Messages

Follow conventional commits:

```
feat: add Timer module with FPS and hold controls
fix: correct effective frequency calculation
test: add edge case tests for Sequencer
docs: update architecture with WebGL rendering plan
refactor: extract render logic into separate method
```

---

## 🎯 Phase 1 Task Order

**Recommended order of implementation:**

1. ✅ **Documentation** (DONE)
2. 🔄 **Project setup** (package.json, configs)
3. ⏳ **Timer module** (with tests)
4. ⏳ **Sequencer module** (with tests)
5. ⏳ **Loader module** (with tests)
6. ⏳ **Renderer module** (with tests)
7. ⏳ **FrameEngine** (integration tests)

After completing Phase 1, you'll have a working core that can be tested independently of UI.

---

## 🔍 Key Files to Create

### Core Modules

```
core/
├── Timer.ts          # FPS and hold timing
├── Sequencer.ts      # Frame navigation
├── Loader.ts         # ImageBitmap loading
├── Renderer.ts       # Canvas rendering
├── FrameEngine.ts    # Orchestrator
└── types.ts          # Shared TypeScript types
```

### Tests

```
test/
├── Timer.test.ts
├── Sequencer.test.ts
├── Loader.test.ts
├── Renderer.test.ts
└── FrameEngine.test.ts
```

---

## 📚 Reference Documentation

- **Requirements**: `docs/PRD.md` - What to build
- **Architecture**: `docs/ARCHITECTURE.md` - How to build it
- **Roadmap**: `ROADMAP.md` - What's next
- **Contributing**: `CONTRIBUTING.md` - How to contribute

---

## 🛠️ Useful Commands (Once Setup)

```bash
# Development
npm run dev              # Start Electron in dev mode
npm run dev:web          # Start web component dev server

# Building
npm run build            # Build all targets
npm run build:core       # Build core only
npm run build:desktop    # Build Electron app
npm run build:web        # Build web component

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode for TDD
npm run test:coverage    # Generate coverage report

# Linting & Formatting
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run typecheck        # TypeScript type checking
```

---

## 💡 Tips for Development

### Performance Testing

Use Chrome DevTools to profile:
- Open DevTools > Performance
- Record during playback
- Look for frame drops and long tasks
- Target: 60 FPS (16.6ms per frame)

### Memory Profiling

- DevTools > Memory > Take heap snapshot
- Compare before/after playback
- Check for retained ImageBitmaps
- Target: <100MB for 10 images

### Debugging Electron

```bash
# Enable DevTools for main process
npm run dev -- --inspect

# Remote debug
chrome://inspect
```

---

## 🚧 Common Pitfalls to Avoid

1. **Don't hardcode image count** - Support variable length sequences
2. **Always cleanup ImageBitmaps** - Call `.close()` to free memory
3. **Use integer coordinates** - `Math.floor()` to avoid sub-pixel rendering
4. **Test with fake timers** - Jest fake timers for predictable testing
5. **Mock Canvas in tests** - Canvas API isn't available in Node.js

---

## ✅ Ready to Start?

1. Run through Step 1-4 above (setup)
2. Start with Timer module (Step 5)
3. Follow TDD: test → implement → refactor
4. Commit early and often
5. Reference architecture docs when stuck

**Happy coding! 🎬**
