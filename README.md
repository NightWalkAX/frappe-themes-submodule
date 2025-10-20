# Frappe Themes Submodule

An independent sub-repository containing themes for both Website and Frappe Desk. Includes a complete theme management system with previews, auto-loader, and enhanced theme switcher.

## 🚀 Features

- ✨ **Website Themes**: Custom Bootstrap themes with unique styling
- 🎨 **Desk Themes**: "Dark Purple Desk" and "Ocean Blue Desk" for desktop interface
- 🔧 **Automatic Installation**: Installation script that sets up the entire theme system
- 🎯 **Enhanced Theme Switcher**: Instant switching with visual previews (Ctrl+Shift+G)
- 🤖 **Auto-Loader**: Automatic theme persistence between sessions
- 📊 **Theme Preview API**: Automatic extraction of colors and CSS variables
- 📦 **Zero Dependencies**: No additional installations required
- 🛠️ **Plug & Play**: Works from any frappe-bench directory
- 📱 **Responsive**: Adaptive and modern designs

## 📁 Repository Structure

```
frappe-themes-submodule/
├── themes/                              # Available themes
│   ├── dickface/                        # Website theme
│   │   ├── dickface.json               
│   │   └── __init__.py
│   ├── dickhead/                        # Website theme
│   │   ├── dickhead.json               
│   │   └── __init__.py
│   ├── dark_purple_desk/                # Desk theme
│   │   ├── dark_purple_desk.json       
│   │   └── __init__.py
│   └── ocean_blue_desk/                 # Desk theme
│       ├── ocean_blue_desk.json        
│       └── __init__.py
├── utils/                               # System utilities
│   ├── theme_switcher_enhanced.js       # Enhanced theme switcher
│   ├── desk.js                          # Integrated auto-loader
│   ├── theme_preview_api.py             # Theme preview API
│   └── user_extension.py                # User preference management
├── fixtures/
│   └── website_theme.json               # Fixtures for automatic installation
├── install.sh                           # Main installation script
├── THEME_PREVIEW_API.md                 # API documentation
└── README.md                            # This file
```

## 🛠️ Installation

### Option 1: As Git Submodule (Recommended)

```bash
# 1. Add as submodule to your project
cd /path/to/frappe-bench
git submodule add [URL_OF_THIS_REPO] frappe-themes-submodule

# 2. Install complete theme system
./frappe-themes-submodule/install.sh my_app

# 3. Migrate to apply changes
bench --site my-site migrate

# 4. Build Frappe assets
bench build --app frappe

# 5. Clear cache to apply theme switcher
bench --site my-site clear-cache

# 6. Use Ctrl+Shift+G to switch themes instantly!
```

### Option 2: Direct Download

```bash
# 1. Download or clone to frappe-bench
cd /path/to/frappe-bench
git clone [URL_OF_THIS_REPO] themes-submodule

# 2. Run installation
./themes-submodule/install.sh my_app

# 3. Migrate
bench --site my-site migrate
```

### Option 3: Manual Download

```bash
# 1. Download and extract to frappe-bench
cd /path/to/frappe-bench
wget [ZIP_URL]
unzip frappe-themes-submodule.zip

# 2. Install
./frappe-themes-submodule/install.sh my_app
```

## 🔧 Installation Script Usage

```bash
# Basic syntax
./install.sh [your_app_name]

# Practical example
./install.sh dragon_ball_app
```

### What does the script install?

1. **Environment Verification**: Confirms you're in a valid frappe-bench directory
2. **Module Detection**: Automatically reads the correct module from `modules.txt`
3. **Theme Copying**: Installs all themes (website + desk) with automatic configuration
4. **Fixtures Installation**: Copies and configures fixtures with correct module
5. **Enhanced Theme Switcher**: Replaces Frappe's theme switcher with enhanced version
6. **Theme Auto-Loader**: Integrates auto-loader in desk.js for automatic persistence
7. **Theme Preview API**: Installs endpoints for theme previews with color extraction
8. **User Extensions**: Adds user preference management system
9. **Backups**: Creates backups of original Frappe files
10. **Installation Verification**: Confirms everything works correctly

## 📋 Requirements

- ✅ Frappe Framework v13+ 
- ✅ Valid Frappe application as target
- ✅ Write permissions in the `apps/` directory
- ✅ Bash shell (Linux/macOS/WSL)

## 🎨 Included Themes

### Website Themes
**Custom Bootstrap Themes**
- Rounded buttons without gradients or shadows
- Typography with weights: 300-800
- Custom Bootstrap styling
- Clean and modern appearance
- Responsive design elements

### Desk Themes (New!)
**Dark Purple Desk**
- Dark theme with elegant purple accents
- Designed specifically for Frappe Desk interface
- Colors: Background #1a1a2e, Accent #533483, Text #e6e6fa
- Optimized for forms, lists, and modules

**Ocean Blue Desk**
- Modern theme with ocean blue gradients
- Smooth animations and enhanced visual effects
- Dynamic gradients and fluid transitions
- Perfect for daily use with excellent readability

## 🎛️ Enhanced Theme System

### Enhanced Theme Switcher (Ctrl+Shift+G)
- **Visual Previews**: See how each theme looks before applying it
- **Instant Application**: Themes are applied immediately without refreshing
- **Smart Detection**: Automatically recognizes custom themes
- **Persistence**: Saves your preference and restores it automatically

### Integrated Auto-Loader
- **Automatic Loading**: Your favorite theme loads automatically on login
- **Synchronization**: Syncs preferences across different devices
- **Smart Fallback**: Robust error recovery system

### Theme Preview API
- **Color Extraction**: Automatically analyzes CSS to generate previews
- **CSS Variables**: Detects and maps custom CSS variables
- **Components**: Maps specific colors for navbar, sidebar, buttons, etc.
- **Validation**: Complete color and style validation system

## 🔄 Submodule Update

```bash
# Update to latest version
cd /path/to/frappe-bench
git submodule update --remote themes-submodule

# Reinstall if there are theme changes
./themes-submodule/install.sh my_app
bench --site my-site migrate
```

## 🐛 Troubleshooting

### Theme Switcher not appearing (Ctrl+Shift+G)

```bash
# 1. Verify assets were built
bench build --app frappe

# 2. Clear cache completely  
bench --site my-site clear-cache
bench --site my-site clear-website-cache

# 3. Verify desk.js was replaced
ls -la sites/assets/frappe/js/frappe/desk.js*

# 4. Refresh browser completely (Ctrl+F5)
```

### Themes don't appear in Theme Switcher

```bash
# 1. Verify user_extension.py exists
ls apps/my_app/my_app/user_extension.py

# 2. Verify import in __init__.py
grep "user_extension" apps/my_app/my_app/__init__.py

# 3. Test API from browser console
frappe.xcall('my_app.user_extension.get_available_themes')
```

### Themes don't apply or persist

```bash
# 1. Verify Theme Preview API
frappe.xcall('my_app.theme_preview_api.validate_theme_preview_api')

# 2. Verify user preferences
frappe.xcall('my_app.user_extension.get_desk_theme_preference')

# 3. Clear browser localStorage
# Open DevTools > Application > Local Storage > Clear
```

### Website themes don't appear in traditional UI

```bash
# 1. Verify migration
bench --site my-site migrate --verbose

# 2. Reinstall fixtures
bench --site my-site install-fixtures

# 3. Clear cache
bench --site my-site clear-cache
```

### Installation error

```bash
# Verify permissions
ls -la apps/my_app/my_app/

# Verify app exists
bench --site my-site list-apps

# Reinstall from scratch if necessary
./install.sh my_app
```

### Restore original Frappe files

```bash
# If something goes wrong, restore backups
cp sites/assets/frappe/js/frappe/desk.js.original sites/assets/frappe/js/frappe/desk.js
cp sites/assets/frappe/js/frappe/ui/theme_switcher.js.original sites/assets/frappe/js/frappe/ui/theme_switcher.js

# Rebuild
bench build --app frappe
```

## 🚀 Usage After Installation

### Quick Theme Switching (Recommended)
1. **Using Enhanced Theme Switcher:**
   - Press `Ctrl+Shift+G` from anywhere in the desk
   - See visual previews of all available themes
   - Click on any theme to apply it instantly
   - Your selection is saved automatically

### Traditional Website Theme Management
1. **Access website themes:**
   ```
   Setup > Website > Website Theme
   ```

2. **Website themes will appear as:**
   - Custom Bootstrap themes with unique styling
   - Clean and responsive designs

3. **Select and configure:**
   - Click on the desired theme
   - Adjust options (buttons, shadows, etc.)
   - Save changes

### Available Desk Themes
- **Frappe Light**: Default light theme
- **Timeless Night**: Elegant dark theme
- **Automatic**: Adapts to system theme
- **Dark Purple Desk**: Custom purple theme 🆕
- **Ocean Blue Desk**: Blue theme with gradients 🆕

## 🔧 Advanced Features

### Theme Preview API
```javascript
// Get all themes with preview data
frappe.xcall('your_app.theme_preview_api.get_theme_preview_data')
  .then(response => console.log(response.themes));

// Validate that API works
frappe.xcall('your_app.theme_preview_api.validate_theme_preview_api')
  .then(result => console.log(result));
```

### Preference Management
```javascript
// Save preferred theme
frappe.xcall('your_app.user_extension.save_desk_theme_preference', {
  theme_name: 'dark_purple_desk'
});

// Get preferred theme
frappe.xcall('your_app.user_extension.get_desk_theme_preference')
  .then(result => console.log(result.theme));
```

## 🔧 Advanced Customization

### Modify an existing theme

```bash
# 1. Edit the theme's JSON file
nano apps/my_app/my_app/website_theme/custom_theme/custom_theme.json

# 2. Customize the SCSS
# Edit the "theme_scss" field in the JSON

# 3. Build assets
bench build --app my_app
```

### Add a new theme

```bash
# 1. Create directory for the new theme
mkdir themes/my_new_theme

# 2. Create JSON file
cat > themes/my_new_theme/my_new_theme.json << EOF
{
  "doctype": "Website Theme",
  "name": "My New Theme",
  "theme": "My New Theme", 
  "module": "Your App",
  "theme_scss": "// Your CSS here"
}
EOF

# 3. Create __init__.py
touch themes/my_new_theme/__init__.py

# 4. Update fixtures
# Edit fixtures/website_theme.json to include the new theme

# 5. Reinstall
./install.sh my_app
```

## 📝 Integration Example

### In your Frappe application:

```python
# hooks.py after installation
fixtures = [
    {
        "doctype": "Website Theme",
        "filters": [
            ["name", "in", ["Custom Theme 1", "Custom Theme 2"]]
        ]
    }
]
```

### Resulting structure in your app:

```
apps/my_app/
├── my_app/
│   ├── website_theme/              # ← All themes installed here
│   │   ├── custom_theme_1/         # Website theme
│   │   ├── custom_theme_2/         # Website theme  
│   │   ├── dark_purple_desk/       # Desk theme 🆕
│   │   └── ocean_blue_desk/        # Desk theme 🆕
│   ├── fixtures/                   # ← Fixtures with automatic configuration
│   │   └── website_theme.json
│   ├── theme_preview_api.py        # ← Preview API 🆕
│   ├── user_extension.py           # ← Preference management 🆕
│   ├── hooks.py                    # ← Automatically updated
│   └── __init__.py                 # ← Imports added automatically

# Enhanced Frappe files:
sites/assets/frappe/js/frappe/
├── desk.js                         # ← With integrated auto-loader 🆕
└── ui/theme_switcher.js           # ← Enhanced theme switcher 🆕

# Automatic backups created:
sites/assets/frappe/js/frappe/
├── desk.js.original               # ← Original backup
└── ui/theme_switcher.js.original  # ← Original backup
```

## 🤝 Contributing

1. Fork this repository
2. Create a branch: `git checkout -b new-feature`
3. Make your changes
4. Commit: `git commit -am 'Add new feature'`
5. Push: `git push origin new-feature`
6. Create a Pull Request

## 📚 Additional Documentation

- **[Theme Preview API](THEME_PREVIEW_API.md)**: Complete API documentation for previews
- **Available endpoints**: `get_theme_preview_data`, `validate_theme_preview_api`
- **JavaScript integration**: Frontend usage examples
- **Color extraction**: Automatic CSS analysis algorithms

## 🔄 Restoration and Maintenance

### Update theme system
```bash
# Update submodule
git submodule update --remote frappe-themes-submodule

# Reinstall with new features
./frappe-themes-submodule/install.sh my_app
bench build --app frappe
bench --site my-site clear-cache
```

### Add new custom desk themes
```bash
# 1. Create theme directory
mkdir themes/my_desk_theme

# 2. Create JSON file with css_content
cat > themes/my_desk_theme/my_desk_theme.json << 'EOF'
{
  "name": "My Desk Theme",
  "theme": "My Desk Theme", 
  "module": "Website",
  "css_content": "/* Desk CSS here */"
}
EOF

# 3. Reinstall
./install.sh my_app
```

## ⚡ Technical Features

### Enhanced Theme Switcher
- **Real-time previews**: Automatic generation of visual previews
- **Theme detection**: Intelligent system for detecting custom themes
- **Instant application**: No page refresh needed
- **Robust persistence**: Multiple preference storage methods

### Auto-Loader System
- **Automatic loading**: Restores preferred theme on login
- **Smart fallback**: Robust error recovery system
- **Multi-app support**: Works with any Frappe app
- **Cache management**: Performance and memory optimization

### Theme Preview API
- **Intelligent extraction**: Automatic CSS and variable analysis
- **Component mapping**: Specific colors for navbar, sidebar, etc.
- **Robust validation**: Complete color validation system
- **Error handling**: Robust error handling with fallbacks

## 📄 License

MIT License - Use it freely in your projects.

## 🆘 Support

- **Issues**: [Repository GitHub Issues]
- **Documentation**: [THEME_PREVIEW_API.md](THEME_PREVIEW_API.md)
- **Community**: [Frappe Forum]

---

**💡 Important Tips**:
- Use `Ctrl+Shift+G` to switch themes quickly
- Themes are automatically saved per user
- Original file backups are created automatically
- Keep this repository as a submodule to receive updates