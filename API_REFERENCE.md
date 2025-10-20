# API Reference

This document provides a comprehensive reference for all APIs available in the Frappe Themes Submodule.

## Theme Preview API

### Overview

The Theme Preview API provides endpoints for extracting and managing theme preview data. It automatically analyzes CSS content to generate visual previews with accurate colors and styling information.

### Endpoints

#### `get_theme_preview_data(theme_name=None)`

**Description**: Main endpoint for retrieving theme preview data with color extraction and CSS analysis.

**Parameters**:
- `theme_name` (str, optional): Specific theme name to retrieve. If omitted, returns all available themes.

**Returns**:
```json
{
  "status": "success",
  "themes": [
    {
      "name": "theme_name",
      "label": "Display Name",
      "info": "Theme description",
      "is_custom": true,
      "is_desk_theme": true,
      "preview_colors": {
        "primary": "#007bff",
        "background": "#ffffff",
        "text": "#212529"
      },
      "css_variables": {
        "--primary-color": "#007bff"
      },
      "preview_components": {
        "navbar_bg": "#ffffff",
        "sidebar_bg": "#f8f9fa"
      }
    }
  ],
  "count": 1
}
```

**Example Usage**:
```javascript
// Get all themes
frappe.xcall('your_app.theme_preview_api.get_theme_preview_data')
  .then(result => {
    console.log(`Found ${result.count} themes`);
    result.themes.forEach(theme => {
      console.log(`Theme: ${theme.label}`);
    });
  });

// Get specific theme
frappe.xcall('your_app.theme_preview_api.get_theme_preview_data', {
  theme_name: 'dark_purple_desk'
}).then(theme => {
  if (theme) {
    console.log('Theme colors:', theme.preview_colors);
  }
});
```

#### `validate_theme_preview_api()`

**Description**: Validates that the Theme Preview API is working correctly.

**Parameters**: None

**Returns**:
```json
{
  "status": "success",
  "message": "Theme Preview API is working correctly",
  "tests": {
    "all_themes_count": 5,
    "light_theme_found": true,
    "api_endpoints": [
      "get_theme_preview_data",
      "validate_theme_preview_api"
    ]
  }
}
```

**Example Usage**:
```javascript
frappe.xcall('your_app.theme_preview_api.validate_theme_preview_api')
  .then(result => {
    if (result.status === 'success') {
      console.log('API is working correctly');
    }
  });
```

## User Extension API

### Overview

The User Extension API manages user theme preferences and provides access to available themes for the enhanced theme switcher.

### Endpoints

#### `get_available_themes()`

**Description**: Retrieves all available desk themes from local files and database.

**Parameters**: None

**Returns**:
```json
[
  {
    "name": "dark_purple_desk",
    "label": "Dark Purple Desk",
    "info": "Desk theme: Dark Purple Desk",
    "css_content": "/* CSS content */",
    "theme_url": null,
    "is_desk_theme": true
  }
]
```

**Example Usage**:
```javascript
frappe.xcall('your_app.user_extension.get_available_themes')
  .then(themes => {
    themes.forEach(theme => {
      console.log(`Available theme: ${theme.label}`);
    });
  });
```

#### `save_desk_theme_preference(theme_name)`

**Description**: Saves the current user's preferred desk theme.

**Parameters**:
- `theme_name` (str, required): Name of the theme to save as preference

**Returns**:
```json
{
  "status": "success",
  "message": "Theme preference saved"
}
```

**Example Usage**:
```javascript
frappe.xcall('your_app.user_extension.save_desk_theme_preference', {
  theme_name: 'dark_purple_desk'
}).then(result => {
  if (result.status === 'success') {
    console.log('Theme preference saved successfully');
  }
});
```

#### `get_desk_theme_preference()`

**Description**: Retrieves the current user's preferred desk theme.

**Parameters**: None

**Returns**:
```json
{
  "status": "success",
  "theme": "dark_purple_desk"
}
```

**Example Usage**:
```javascript
frappe.xcall('your_app.user_extension.get_desk_theme_preference')
  .then(result => {
    if (result.status === 'success') {
      console.log('User prefers theme:', result.theme);
    }
  });
```

## JavaScript API

### Theme Switcher

#### `frappe.ui.ThemeSwitcher`

**Description**: Enhanced theme switcher class with visual previews and automatic theme loading.

**Constructor**:
```javascript
const themeSwitcher = new frappe.ui.ThemeSwitcher();
```

**Methods**:

##### `show()`
Shows the theme switcher dialog.

```javascript
frappe.ui.ThemeSwitcher.getInstance().show();
```

##### `hide()`
Hides the theme switcher dialog.

```javascript
frappe.ui.ThemeSwitcher.getInstance().hide();
```

##### `refresh()`
Refreshes the theme list and re-renders previews.

```javascript
frappe.ui.ThemeSwitcher.getInstance().refresh();
```

##### `toggle_theme(theme_name, callback)`
Applies a specific theme.

**Parameters**:
- `theme_name` (str): Name of theme to apply
- `callback` (function, optional): Callback function after theme is applied

```javascript
const switcher = frappe.ui.ThemeSwitcher.getInstance();
switcher.toggle_theme('dark_purple_desk', () => {
  console.log('Theme applied successfully');
});
```

### Keyboard Shortcuts

#### Theme Switcher Shortcut

**Shortcut**: `Ctrl+Shift+G`
**Action**: Opens the enhanced theme switcher dialog

```javascript
// Shortcut is automatically registered when desk.js loads
// You can also trigger it programmatically:
frappe.ui.ThemeSwitcher.getInstance().show();
```

## CSS Classes and Variables

### Theme Preview Styles

The theme switcher uses these CSS classes for preview rendering:

```css
.theme-preview-container {
  /* Main preview container */
}

.preview-navbar {
  /* Navbar preview section */
}

.preview-sidebar {
  /* Sidebar preview section */
}

.preview-main {
  /* Main content preview section */
}

.selected {
  /* Applied to selected theme */
}

.applying-theme {
  /* Applied while theme is being loaded */
}
```

### Custom CSS Variables

Themes can define these CSS variables for consistent styling:

```css
:root {
  --primary-color: #007bff;
  --bg-color: #ffffff;
  --text-color: #212529;
  --navbar-bg: #ffffff;
  --sidebar-bg: #f8f9fa;
  --border-color: #dee2e6;
}
```

## Error Handling

### Common Error Responses

#### API Errors

```json
{
  "status": "error",
  "message": "Error description",
  "themes": []  // Fallback empty array
}
```

#### Theme Loading Errors

```json
{
  "status": "error",
  "message": "Theme not found or invalid CSS"
}
```

### Error Recovery

The system includes automatic fallback mechanisms:

1. **Theme Preview API**: Falls back to default themes if custom themes fail
2. **Theme Switcher**: Uses default colors if preview colors aren't available
3. **Theme Loading**: Falls back to light theme if preferred theme fails
4. **Persistence**: Uses localStorage if server-side saving fails

### Logging

Errors are logged to Frappe's logging system with the following categories:

- `"Frappe Themes Preview API"`: Theme preview and color extraction errors
- `"Frappe Themes Submodule"`: General theme loading and switching errors
- `"Theme Switcher Enhanced"`: JavaScript theme switcher errors

## Integration Examples

### Custom Theme Creation

```python
# In your app's hooks.py
def create_custom_theme():
    theme_doc = frappe.get_doc({
        "doctype": "Website Theme",
        "theme": "My Custom Theme",
        "module": "My App",
        "theme_scss": """
            $primary-color: #custom-color;
            
            .navbar {
                background-color: $primary-color;
            }
        """
    })
    theme_doc.insert()
```

### Theme Switching Integration

```javascript
// Listen for theme changes
document.addEventListener('frappe:theme-changed', (event) => {
  const { theme, timestamp } = event.detail;
  console.log(`Theme changed to: ${theme} at ${timestamp}`);
  
  // Custom logic after theme change
  updateCustomComponents(theme);
});

// Apply theme programmatically
function applyCompanyTheme() {
  const switcher = frappe.ui.ThemeSwitcher.getInstance();
  switcher.toggle_theme('company_theme', () => {
    frappe.show_alert('Company theme applied');
  });
}
```

### Preview Data Customization

```python
# Extend theme preview data
@frappe.whitelist()
def get_enhanced_theme_data():
    base_data = get_theme_preview_data()
    
    # Add custom preview information
    for theme in base_data.get('themes', []):
        if theme['is_custom']:
            theme['company_branding'] = get_company_colors()
            theme['accessibility_score'] = calculate_accessibility(theme)
    
    return base_data
```

## Performance Considerations

### Caching

- Theme preview data is cached to avoid repeated CSS parsing
- Theme preferences are cached both server-side and in localStorage
- CSS content is limited to 500 characters for preview generation

### Optimization Tips

1. **Limit Theme Count**: Keep under 15 themes for optimal performance
2. **CSS Size**: Keep theme CSS files under 100KB
3. **Preview Colors**: Pre-calculate colors when possible
4. **Network Requests**: Cache theme URLs and use CDNs when available

### Browser Support

- **Modern Browsers**: Full feature support (Chrome 60+, Firefox 60+, Safari 12+)
- **Legacy Support**: Basic theme switching without advanced previews
- **Mobile**: Touch-friendly theme switching on mobile devices

---

For more detailed examples and advanced usage, see the [THEME_PREVIEW_API.md](THEME_PREVIEW_API.md) documentation.