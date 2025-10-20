# Changelog

All notable changes to the Frappe Themes Submodule will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete English documentation and translation
- Enhanced API reference documentation
- Contributing guidelines
- Comprehensive troubleshooting guide

### Changed
- All Spanish comments and documentation translated to English
- Improved code documentation and inline comments
- Enhanced README.md structure and clarity

### Fixed
- Code style and formatting improvements
- Better error handling in theme preview API

## [1.2.0] - 2024-XX-XX

### Added
- Enhanced Theme Switcher with visual previews (Ctrl+Shift+G)
- Theme Preview API for automatic color extraction
- Auto-loader system for theme persistence
- Support for Desk themes (Dark Purple, Ocean Blue)
- User preference management system
- Automatic backup of original Frappe files

### Enhanced
- Real-time theme switching without page refresh
- Intelligent color extraction from CSS
- Multi-app support for theme management
- Robust error handling and fallback systems

### Technical Features
- CSS variable detection and mapping
- Component-specific color mapping for previews
- Automatic theme detection from hooks
- Cross-browser compatibility improvements

## [1.1.0] - 2024-XX-XX

### Added
- Custom Bootstrap website themes
- Automated installation script
- Fixtures for automatic theme setup
- Module-aware theme configuration

### Features
- Plug & play installation from any frappe-bench directory
- Zero dependencies - works out of the box
- Responsive design for all themes
- Bootstrap variable overrides

### Themes Included
- Custom themed designs with unique styling
- Rounded buttons without gradients
- Custom typography weights (300-800)
- Modern and clean aesthetics

## [1.0.0] - 2024-XX-XX

### Added
- Initial release of Frappe Themes Submodule
- Basic theme installation system
- Support for Website Theme doctype
- Git submodule compatibility

### Features
- Manual theme switching through Frappe UI
- Basic theme configuration
- Standard Frappe theme integration

---

## Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

## Migration Guides

### Upgrading from 1.1.x to 1.2.x

1. **Backup current installation**
   ```bash
   cp sites/assets/frappe/js/frappe/desk.js sites/assets/frappe/js/frappe/desk.js.backup
   cp sites/assets/frappe/js/frappe/ui/theme_switcher.js sites/assets/frappe/js/frappe/ui/theme_switcher.js.backup
   ```

2. **Update submodule**
   ```bash
   git submodule update --remote frappe-themes-submodule
   ```

3. **Reinstall with new features**
   ```bash
   ./frappe-themes-submodule/install.sh your_app
   bench build --app frappe
   bench --site your-site clear-cache
   ```

4. **Test new features**
   - Press `Ctrl+Shift+G` to test enhanced theme switcher
   - Verify theme persistence between sessions
   - Check theme preview colors in switcher

### Upgrading from 1.0.x to 1.1.x

1. **Update themes structure**
   - Themes are now organized in app-specific directories
   - Module names are automatically detected from modules.txt

2. **Reinstall themes**
   ```bash
   ./install.sh your_app
   bench --site your-site migrate
   ```

## Breaking Changes

### Version 1.2.0

- **Theme Switcher Override**: The original Frappe theme switcher is replaced with enhanced version
  - **Impact**: Custom modifications to theme_switcher.js will be overridden
  - **Solution**: Apply custom modifications to the enhanced version or use hooks

- **Desk.js Enhancement**: The original desk.js is replaced with auto-loader integrated version
  - **Impact**: Custom modifications to desk.js will be overridden  
  - **Solution**: Apply modifications to the enhanced version or use separate files

- **API Method Names**: Some internal API method names have changed
  - **Impact**: Direct API calls using old method names will fail
  - **Solution**: Update to new API method names documented in API_REFERENCE.md

### Version 1.1.0

- **Directory Structure**: Themes are now installed in app-specific directories
  - **Impact**: Manually placed themes in global directories won't be detected
  - **Solution**: Use installation script or manually move themes to app directories

## Known Issues

### Current Version (1.2.0)

1. **Large Theme Count Performance**: Theme switcher may be slow with 20+ themes
   - **Workaround**: Limit themes to under 15 for optimal performance
   - **Status**: Optimization planned for next release

2. **CSS Variable Extraction**: Some complex CSS variables may not be detected
   - **Workaround**: Use standard variable naming conventions
   - **Status**: Improved patterns planned for next release

3. **Browser Compatibility**: Advanced features require modern browsers
   - **Impact**: IE11 and older browsers have limited functionality
   - **Workaround**: Basic theme switching still works on older browsers

## Support and Compatibility

### Frappe Framework Versions

- **v13.x**: ✅ Fully supported
- **v14.x**: ✅ Fully supported  
- **v15.x**: ✅ Fully supported
- **v12.x**: ⚠️ Limited support (no advanced features)
- **v11.x**: ❌ Not supported

### Browser Support

- **Chrome 60+**: ✅ Full support
- **Firefox 60+**: ✅ Full support
- **Safari 12+**: ✅ Full support
- **Edge 79+**: ✅ Full support
- **IE11**: ⚠️ Basic functionality only

### Operating Systems

- **Linux**: ✅ Fully supported
- **macOS**: ✅ Fully supported
- **Windows**: ✅ Supported (requires WSL for installation script)

## Roadmap

### Version 1.3.0 (Planned)

- **Theme Builder UI**: Visual theme creation interface
- **Advanced Color Schemes**: Automatic complementary color generation
- **Theme Templates**: Pre-built theme templates for common use cases
- **Performance Optimizations**: Improved loading and caching

### Version 1.4.0 (Planned)

- **Theme Marketplace**: Share and discover community themes
- **Dynamic Theme Variables**: Runtime theme customization
- **Accessibility Features**: Enhanced accessibility and contrast checking
- **Mobile Theme Support**: Specialized mobile theme options

### Future Considerations

- **Plugin Architecture**: Support for theme plugins and extensions
- **Integration APIs**: Better integration with third-party tools
- **Cloud Sync**: Synchronize themes across multiple instances
- **Advanced Analytics**: Theme usage analytics and insights

---

For support and questions, please visit our [GitHub Issues](https://github.com/NightWalkAX/frappe_ux_upgrade/issues) page.