# Contributing to Stereo

Thanks for your interest in contributing to Stereo! This document provides guidelines for development, testing, and submitting contributions.

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Git** for version control
- **Code editor** with TypeScript support (VS Code recommended)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/stereo.git
cd stereo

# Install dependencies
npm install

# Run tests to verify setup
npm test

# Start development server
npm run dev
```

---

## Project Structure

```
Stereo/
├── core/              # Shared TypeScript engine (framework-agnostic)
│   ├── FrameEngine.ts # Main orchestrator
│   ├── Timer.ts       # FPS and hold timing logic
│   ├── Sequencer.ts   # Frame navigation and looping
│   ├── Loader.ts      # Image loading with buffering
│   └── Renderer.ts    # Canvas rendering
│
├── desktop/           # Electron application
│   ├── main/          # Main process (Node.js APIs)
│   │   ├── main.ts
│   │   ├── filesystem.ts
│   │   └── recorder.ts
│   └── renderer/      # Renderer process (UI)
│       ├── index.html
│       ├── app.tsx
│       └── styles/
│
├── web/               # Web Component
│   ├── StereoPlayer.ts
│   └── demo.html
│
├── test/              # Jest tests
│   ├── Timer.test.ts
│   ├── Sequencer.test.ts
│   └── ...
│
└── docs/              # Documentation
    ├── PRD.md
    └── ARCHITECTURE.md
```

---

## Development Workflow

### 1. Create a Branch

```bash
# For new features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/issue-description
```

### 2. Make Changes

- Write code following the [coding standards](#coding-standards)
- Add tests for new functionality
- Update documentation if needed
- Keep commits atomic and well-described

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run the desktop app
npm run dev

# Build everything
npm run build
```

### 4. Commit

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add interpolation between frames"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions or fixes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Build/tooling changes

### 5. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

---

## Coding Standards

### TypeScript

- **Strict mode enabled** - No implicit any, proper null checks
- **Explicit return types** - Always declare function return types
- **JSDoc comments** - Document public APIs and complex logic
- **Descriptive names** - Variables and functions should be self-documenting

```typescript
// ✅ Good
export function calculateEffectiveFrequency(fps: number, holdFrames: number): number {
  return fps / holdFrames;
}

// ❌ Bad
export function calc(f, h) {
  return f / h;
}
```

### Code Organization

- **Single responsibility** - Each module/class has one clear purpose
- **Dependency injection** - Avoid tight coupling, use constructor injection
- **Immutability** - Prefer `const` and immutable operations
- **Pure functions** - Minimize side effects in core logic

### Testing

- **Test-Driven Development** - Write tests before implementation when possible
- **Unit tests** - Test individual modules in isolation
- **Integration tests** - Test interactions between modules
- **Coverage goal** - Aim for 80%+ coverage on core modules

```typescript
// Example test structure
describe('Timer', () => {
  describe('setFPS', () => {
    it('should update FPS and recalculate interval', () => {
      const timer = new Timer(30, 1);
      timer.setFPS(60);
      expect(timer.getFPS()).toBe(60);
    });
    
    it('should throw error for invalid FPS', () => {
      const timer = new Timer(30, 1);
      expect(() => timer.setFPS(-1)).toThrow();
    });
  });
});
```

### Styling (Tailwind)

- **Utility-first** - Use Tailwind utilities, avoid custom CSS when possible
- **Responsive design** - Mobile-first approach with breakpoints
- **Dark mode ready** - Support both light and dark themes
- **Consistent spacing** - Use Tailwind's spacing scale (4, 8, 16, etc.)

---

## Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- Timer.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should update FPS"

# Watch mode for TDD
npm run test:watch

# Coverage report
npm run test:coverage
```

### Writing Tests

1. **Arrange** - Set up test data and conditions
2. **Act** - Execute the code being tested
3. **Assert** - Verify the results

```typescript
it('should preload next N frames', async () => {
  // Arrange
  const loader = new Loader({ preloadCount: 2 });
  const images = ['a.png', 'b.png', 'c.png', 'd.png'];
  
  // Act
  await loader.loadSequence(images, 0);
  
  // Assert
  expect(loader.isLoaded(0)).toBe(true);
  expect(loader.isLoaded(1)).toBe(true);
  expect(loader.isLoaded(2)).toBe(true);
  expect(loader.isLoaded(3)).toBe(false);
});
```

### Mocking

Use Jest mocks for external dependencies:

```typescript
// Mock Canvas API
const mockContext = {
  drawImage: jest.fn(),
  clearRect: jest.fn(),
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
```

---

## Documentation

### Code Documentation

- **JSDoc comments** for all public APIs
- **Inline comments** for complex algorithms
- **README updates** for new features
- **ARCHITECTURE.md** for design decisions

```typescript
/**
 * Controls frame timing with configurable FPS and hold duration.
 * 
 * @example
 * ```typescript
 * const timer = new Timer(60, 6); // 60 FPS, hold each frame for 6 ticks
 * timer.start((frameCount) => {
 *   console.log('Frame:', frameCount);
 * });
 * ```
 */
export class Timer {
  // ...
}
```

### Documentation Files

When adding features, update:
- `README.md` - User-facing overview
- `docs/PRD.md` - Requirements and specifications
- `docs/ARCHITECTURE.md` - Technical design
- `ROADMAP.md` - Feature status

---

## Performance Considerations

### General Rules

- **Measure first** - Profile before optimizing
- **RequestAnimationFrame** - Use for all rendering loops
- **ImageBitmap** - Prefer over Image for Canvas rendering
- **Debounce expensive ops** - Window resize, user input
- **Memory management** - Clean up old ImageBitmaps, avoid leaks

### Performance Testing

```bash
# Run performance benchmarks
npm run bench

# Profile in Chrome DevTools
npm run dev
# Open DevTools > Performance tab > Record
```

### Target Metrics

- **60 FPS** sustained playback
- **<100ms** initial load time for 10 images
- **<1GB** memory usage with 100+ images loaded
- **<50ms** response to user input

---

## Debugging

### Desktop App (Electron)

```bash
# Run with DevTools open
npm run dev

# Enable verbose logging
DEBUG=* npm run dev

# Inspect main process
npm run dev -- --inspect
```

### Web Component

```bash
# Serve demo page
npm run serve:web

# Open browser DevTools
# Console, Network, Performance tabs
```

### Common Issues

**Canvas not rendering:**
- Check ImageBitmap load state
- Verify canvas context options (`alpha: false`)
- Ensure requestAnimationFrame is running

**Memory leaks:**
- Profile with Chrome DevTools > Memory
- Check for unreleased ImageBitmaps
- Verify event listener cleanup

**Performance drops:**
- Reduce preload count
- Enable alpha: false on canvas
- Use integer coordinates (Math.floor)

---

## Pull Request Process

1. **Fork and branch** - Create feature branch from `main`
2. **Write tests** - Ensure tests pass and coverage is maintained
3. **Update docs** - Keep documentation in sync
4. **Lint and format** - Run `npm run lint` and `npm run format`
5. **Describe changes** - Write clear PR description
6. **Request review** - Tag maintainers for review

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested this change.

## Checklist
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No breaking changes (or clearly documented)
```

---

## Release Process

**For Maintainers:**

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Build and publish: `npm run release`

---

## Questions?

- **Bug reports:** [GitHub Issues](https://github.com/yourusername/stereo/issues)
- **Feature requests:** [GitHub Discussions](https://github.com/yourusername/stereo/discussions)
- **General questions:** Open a discussion or reach out via email

---

Thank you for contributing to Stereo! 🎬
