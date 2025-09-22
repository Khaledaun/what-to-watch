# Contributing to What to Watch Tonight

Thank you for your interest in contributing to What to Watch Tonight! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- TMDB API key (for development)

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/what-to-watch.git
   cd what-to-watch
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Add your TMDB API key to `.env.local`:
   ```env
   TMDB_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Use shadcn/ui components when possible
- Follow the existing component structure
- Add proper error boundaries

### Testing

- Write unit tests for new functions and components
- Add integration tests for API endpoints
- Maintain test coverage above 80%
- Use descriptive test names
- Test both success and error cases

### Performance

- Optimize images with Next.js Image component
- Use proper caching strategies
- Minimize bundle size
- Follow Core Web Vitals guidelines
- Test performance with Lighthouse

## Pull Request Process

### Before Submitting

1. **Run tests:**
   ```bash
   npm test
   ```

2. **Check linting:**
   ```bash
   npm run lint
   ```

3. **Type check:**
   ```bash
   npm run typecheck
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

### Pull Request Guidelines

1. **Create a descriptive title** that explains what the PR does
2. **Provide a detailed description** of changes made
3. **Link related issues** using keywords like "Fixes #123"
4. **Include screenshots** for UI changes
5. **Update documentation** if needed
6. **Add tests** for new functionality

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## Issue Guidelines

### Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (browser, OS, etc.)
- **Screenshots** if applicable
- **Console errors** if any

### Feature Requests

For feature requests, please include:

- **Clear description** of the feature
- **Use case** and motivation
- **Proposed implementation** (if you have ideas)
- **Alternatives considered**
- **Additional context**

## Code Review Process

### For Contributors

- Address all review comments
- Make requested changes
- Respond to feedback constructively
- Keep PRs focused and small
- Update tests and documentation

### For Reviewers

- Be constructive and helpful
- Focus on code quality and functionality
- Check for security issues
- Verify tests and documentation
- Approve when ready

## Release Process

1. **Version bump** in package.json
2. **Update CHANGELOG.md** with new features/fixes
3. **Create release notes**
4. **Tag the release**
5. **Deploy to production**

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different opinions and approaches
- Follow the golden rule

### Communication

- Use clear and concise language
- Be patient with questions
- Provide helpful explanations
- Stay on topic in discussions
- Use appropriate channels for different types of communication

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/add-new-platform`
- `fix/recommendation-scoring`
- `docs/update-readme`
- `refactor/cache-layer`

### Commit Messages

Follow conventional commit format:
```
type(scope): description

feat(api): add new recommendation endpoint
fix(ui): resolve filter button alignment
docs(readme): update installation instructions
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Architecture Decisions

### Key Design Principles

1. **Performance First**: Optimize for speed and user experience
2. **SEO Optimized**: Ensure good search engine visibility
3. **Accessible**: Follow WCAG guidelines
4. **Maintainable**: Write clean, well-documented code
5. **Scalable**: Design for future growth

### Technology Choices

- **Next.js 14**: Latest features and performance
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first styling
- **TMDB API**: Reliable movie/TV data
- **Redis**: Fast caching layer
- **Vitest**: Fast testing framework

## Getting Help

### Resources

- **Documentation**: Check the README and code comments
- **Issues**: Search existing issues for solutions
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord (if available)

### Contact

- **Maintainers**: @username1, @username2
- **Email**: support@whattowatch.com
- **Twitter**: @whattowatch

## Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page
- **Community highlights** (with permission)

Thank you for contributing to What to Watch Tonight! 🎬

