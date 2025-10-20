# Contributing to Frappe Themes Submodule

Thank you for your interest in contributing to the Frappe Themes Submodule! This document provides guidelines for contributing to this project.

## 🚀 Getting Started

### Prerequisites

- Frappe Framework v13+
- A Frappe application for testing
- Git knowledge
- Basic understanding of CSS/SCSS and JavaScript

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/frappe-themes-submodule.git
   cd frappe-themes-submodule
   ```

2. **Set up development environment**
   ```bash
   # Navigate to your frappe-bench directory
   cd /path/to/frappe-bench
   
   # Clone your fork as a submodule or copy the files
   git submodule add https://github.com/YOUR_USERNAME/frappe-themes-submodule.git frappe-themes-dev
   
   # Install in a test app
   ./frappe-themes-dev/install.sh your_test_app
   ```

3. **Test the installation**
   ```bash
   bench --site your-site migrate
   bench build --app frappe
   bench --site your-site clear-cache
   ```

## 🎨 Creating New Themes

### Website Themes

1. **Create theme directory**
   ```bash
   mkdir themes/your_theme_name
   ```

2. **Create theme JSON file**
   ```json
   {
     "doctype": "Website Theme",
     "name": "Your Theme Name",
     "theme": "Your Theme Name",
     "module": "Website",
     "theme_scss": "/* Your SCSS here */"
   }
   ```

3. **Create `__init__.py`**
   ```bash
   touch themes/your_theme_name/__init__.py
   ```

### Desk Themes

1. **Create theme directory**
   ```bash
   mkdir themes/your_desk_theme
   ```

2. **Create theme JSON with CSS content**
   ```json
   {
     "name": "Your Desk Theme",
     "theme": "Your Desk Theme",
     "module": "Website",
     "css_content": "/* CSS for Frappe Desk */\n\n.layout-main {\n  /* Your styles here */\n}"
   }
   ```

3. **Test your theme**
   - Reinstall: `./install.sh your_app`
   - Use `Ctrl+Shift+G` to test the theme switcher
   - Verify theme persistence and preview colors

## 🔧 Code Guidelines

### Python Code

- Follow PEP 8 style guidelines
- Use meaningful function and variable names
- Add docstrings to all functions
- Include error handling with proper logging
- Maximum line length: 79 characters

### JavaScript Code

- Use ES6+ features where appropriate
- Add JSDoc comments for functions
- Use meaningful variable names
- Handle errors gracefully with fallbacks
- Follow existing code patterns

### CSS/SCSS

- Use semantic class names
- Include comments for complex styles
- Use CSS variables where possible
- Ensure responsive design
- Test across different browsers

## 📝 Documentation

### Adding Documentation

- Update README.md if adding new features
- Add API documentation for new endpoints
- Include usage examples
- Update THEME_PREVIEW_API.md for API changes

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots where helpful
- Use proper Markdown formatting

## 🧪 Testing

### Manual Testing

1. **Theme Installation**
   ```bash
   ./install.sh test_app
   bench --site test-site migrate
   ```

2. **Theme Switcher**
   - Press `Ctrl+Shift+G`
   - Verify all themes appear
   - Test theme application
   - Check theme persistence

3. **API Testing**
   ```javascript
   // Test from browser console
   frappe.xcall('your_app.theme_preview_api.get_theme_preview_data')
     .then(result => console.log(result));
   ```

### Edge Cases to Test

- Large number of themes (10+)
- Themes with invalid CSS
- Network issues when loading theme URLs
- Browser cache issues
- Multiple simultaneous users

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Test with latest version
3. Reproduce in clean environment
4. Clear browser cache and test again

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Frappe version: 
- Browser: 
- OS: 
- App name: 

**Screenshots**
If applicable

**Additional Context**
Any other relevant information
```

## 🎯 Feature Requests

### Before Requesting

1. Check if feature already exists
2. Search existing issues and discussions
3. Consider if it fits project scope

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other approaches you've considered

**Additional Context**
Any other relevant information
```

## 🔄 Pull Request Process

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Test your changes**
   - Install and test themes
   - Verify theme switcher works
   - Test API endpoints
   - Check for console errors

3. **Update documentation**
   - Update README.md if needed
   - Add API documentation
   - Include usage examples

### Pull Request Template

```markdown
**Description**
Brief description of changes

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

**Testing**
- [ ] Manual testing completed
- [ ] Theme installation tested
- [ ] Theme switcher tested
- [ ] API endpoints tested

**Screenshots**
If applicable

**Checklist**
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No console errors
- [ ] Themes work in multiple browsers
```

## 📋 Code Review

### Review Criteria

- Code quality and readability
- Performance implications
- Security considerations
- Documentation completeness
- Test coverage

### Review Process

1. Automated checks must pass
2. At least one maintainer review
3. All feedback addressed
4. Final testing by maintainer

## 🏷️ Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## 📞 Getting Help

### Community Support

- **GitHub Issues**: Technical questions and bug reports
- **Discussions**: General questions and feature requests
- **Frappe Forum**: Community support and discussions

### Maintainer Contact

For urgent issues or security concerns, contact the maintainers directly through GitHub.

## 🎉 Recognition

Contributors will be:

- Added to the contributors list
- Mentioned in release notes
- Credited in documentation

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Focus on technical merit
- Help others learn and grow

### Unacceptable Behavior

- Harassment or discrimination
- Offensive language or imagery
- Personal attacks
- Spam or trolling

### Enforcement

Violations may result in temporary or permanent ban from the project.

---

Thank you for contributing to the Frappe Themes Submodule! Your contributions help make Frappe more beautiful and user-friendly. 🎨✨