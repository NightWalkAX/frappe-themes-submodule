# Theme Preview API - Documentation

## Overview

The Theme Preview API provides endpoints to obtain detailed theme data for rendering enhanced previews in the Theme Switcher. It includes color extraction, CSS variables, and specific components to create accurate visual previews.

## Available Endpoints

### 1. `get_theme_preview_data(theme_name=None)`

**Main endpoint** to obtain theme preview data.

#### Parameters:
- `theme_name` (optional): Specific theme name. If not provided, returns all themes.

#### Response:
```json
{
  "status": "success",
  "themes": [
    {
      "name": "light",
      "label": "Frappe Light", 
      "info": "Light Theme",
      "is_custom": false,
      "is_desk_theme": true,
      "preview_colors": {
        "primary": "#007bff",
        "background": "#ffffff",
        "text": "#212529",
        "navbar": "#ffffff",
        "sidebar": "#f8f9fa"
      },
      "css_variables": {
        "--primary-color": "#007bff",
        "--bg-color": "#ffffff"
      },
      "preview_components": {
        "navbar_bg": "#ffffff",
        "navbar_text": "#212529",
        "sidebar_bg": "#f8f9fa",
        "button_primary": "#007bff"
      }
    }
  ],
  "count": 3
}
```

### 2. `get_single_theme_preview(theme_name)`

Gets preview data for a specific theme.

#### Usage from JavaScript:
```javascript
frappe.xcall('frappe_themes_submodule.utils.theme_preview_api.get_theme_preview_data')
  .then(response => {
    if (response.status === 'success') {
      console.log(`Loaded ${response.count} themes:`, response.themes);
    }
  });
```

### 3. `validate_theme_preview_api()`

Validates that the API works correctly.

## Data Structure

### Theme Object

```javascript
{
  "name": "theme-name",           // Unique theme identifier
  "label": "Theme Display Name",  // Name displayed to user
  "info": "Theme description",    // Theme description
  "is_custom": false,            // true if it's a custom theme
  "is_desk_theme": true,         // true if it's for the desk
  "theme_url": "/assets/...",    // CSS file URL (optional)
  "css_content_preview": "...",  // First lines of CSS (optional)
  
  // Main colors extracted from theme
  "preview_colors": {
    "primary": "#007bff",
    "secondary": "#6c757d", 
    "success": "#28a745",
    "warning": "#ffc107",
    "danger": "#dc3545",
    "background": "#ffffff",
    "surface": "#f8f9fa",
    "text": "#212529",
    "text_muted": "#6c757d",
    "navbar": "#ffffff",
    "sidebar": "#f8f9fa",
    "border": "#dee2e6"
  },
  
  // Extracted CSS variables
  "css_variables": {
    "--primary-color": "#007bff",
    "--text-color": "#212529",
    "--bg-color": "#ffffff"
  },
  
  // Specific colors for preview components
  "preview_components": {
    "navbar_bg": "#ffffff",
    "navbar_text": "#212529", 
    "sidebar_bg": "#f8f9fa",
    "sidebar_text": "#495057",
    "main_bg": "#ffffff",
    "main_text": "#212529",
    "card_bg": "#ffffff",
    "card_border": "#dee2e6",
    "button_primary": "#007bff",
    "button_primary_text": "#ffffff"
  }
}
```

## Main Features

### Color Extraction

The API automatically extracts colors from CSS files using intelligent patterns:

```python
# Search patterns for specific colors
color_patterns = {
    "primary": [
        r'--primary[^:]*:\s*([^;;\n]+)',
        r'\.btn-primary[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)'
    ],
    "background": [
        r'--bg[^:]*:\s*([^;;\n]+)',
        r'body[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)'
    ]
}
```

### Color Validation

Extracted colors are validated against valid CSS patterns:
- Hexadecimal codes: `#RGB`, `#RRGGBB`
- CSS functions: `rgb()`, `rgba()`, `hsl()`, `hsla()`
- CSS variables: `var(--variable-name)`
- Standard CSS color names

### Default Themes

Light, dark, and automatic themes include predefined data to ensure consistent previews.

## Integration with Theme Switcher

### JavaScript Usage

```javascript
// Get all themes with preview data
frappe.xcall('frappe_themes_submodule.utils.theme_preview_api.get_theme_preview_data')
  .then(response => {
    if (response.status === 'success') {
      this.themes = response.themes.map(theme => ({
        ...theme,
        // Additional data for switcher
        preview_colors: theme.preview_colors || {},
        css_variables: theme.css_variables || {}
      }));
      
      this.render_previews();
    }
  });
```

### Preview Rendering

```javascript
generate_preview_html(theme) {
  const colors = theme.preview_components || {};
  
  return `
    <div class="theme-preview" style="${this.generate_preview_styles(theme)}">
      <div class="navbar" style="background: ${colors.navbar_bg}; color: ${colors.navbar_text};">
        <!-- Navbar elements -->
      </div>
      <div class="sidebar" style="background: ${colors.sidebar_bg}; color: ${colors.sidebar_text};">
        <!-- Sidebar elements -->
      </div>
      <div class="main" style="background: ${colors.main_bg}; color: ${colors.main_text};">
        <!-- Main content -->
      </div>
    </div>
  `;
}
```

## Testing

### Test Script

Run the test script to verify functionality:

```bash
bench --site [site-name] execute frappe-themes-submodule/utils/test_theme_preview.py
```

### Manual Validation

```javascript
// From browser console
frappe.xcall('frappe_themes_submodule.utils.theme_preview_api.validate_theme_preview_api')
  .then(result => console.log(result));
```

## Error Handling

The API includes robust error handling:

- **Fallback to default themes** if custom theme extraction fails
- **URL validation** before downloading CSS
- **HTTP request timeout** (10 seconds)
- **Detailed logging** of errors in Frappe

## Performance

- **Result caching** to avoid unnecessary re-extractions
- **Size limits** on CSS content (500 characters for preview)
- **Request timeouts** to prevent blocking
- **Lazy loading** of preview data only when needed

## Compatibility

- **Frappe v13+**: Fully compatible
- **Legacy themes**: Automatic fallback to default data
- **Custom apps**: Automatic theme detection in hooks

## Upcoming Features

- Persistent preview data cache
- CSS data compression
- Support for app-specific themes
- API for automatic complementary color generation