# Theme Preview API - Documentación

## Descripción General

El Theme Preview API proporciona endpoints para obtener datos detallados de temas para renderizar previews mejorados en el Theme Switcher. Incluye extracción de colores, variables CSS y componentes específicos para crear previews visuales precisos.

## Endpoints Disponibles

### 1. `get_theme_preview_data(theme_name=None)`

**Endpoint principal** para obtener datos de preview de temas.

#### Parámetros:
- `theme_name` (opcional): Nombre del tema específico. Si no se proporciona, devuelve todos los temas.

#### Respuesta:
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

Obtiene datos de preview para un tema específico.

#### Uso desde JavaScript:
```javascript
frappe.xcall('frappe_themes_submodule.utils.theme_preview_api.get_theme_preview_data')
  .then(response => {
    if (response.status === 'success') {
      console.log(`Loaded ${response.count} themes:`, response.themes);
    }
  });
```

### 3. `validate_theme_preview_api()`

Valida que la API funcione correctamente.

## Estructura de Datos

### Theme Object

```javascript
{
  "name": "theme-name",           // Identificador único del tema
  "label": "Theme Display Name",  // Nombre mostrado al usuario
  "info": "Theme description",    // Descripción del tema
  "is_custom": false,            // true si es un tema personalizado
  "is_desk_theme": true,         // true si es para el desk
  "theme_url": "/assets/...",    // URL del archivo CSS (opcional)
  "css_content_preview": "...",  // Primeras líneas del CSS (opcional)
  
  // Colores principales extraídos del tema
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
  
  // Variables CSS extraídas
  "css_variables": {
    "--primary-color": "#007bff",
    "--text-color": "#212529",
    "--bg-color": "#ffffff"
  },
  
  // Colores específicos para componentes del preview
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

## Funcionalidades Principales

### Extracción de Colores

El API extrae automáticamente colores de los archivos CSS usando patrones inteligentes:

```python
# Patrones de búsqueda para colores específicos
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

### Validación de Colores

Los colores extraídos se validan contra patrones CSS válidos:
- Códigos hexadecimales: `#RGB`, `#RRGGBB`
- Funciones CSS: `rgb()`, `rgba()`, `hsl()`, `hsla()`
- Variables CSS: `var(--variable-name)`
- Nombres de colores CSS estándar

### Temas por Defecto

Los temas light, dark y automatic incluyen datos predefinidos para garantizar previews consistentes.

## Integración con Theme Switcher

### Uso en JavaScript

```javascript
// Obtener todos los temas con datos de preview
frappe.xcall('frappe_themes_submodule.utils.theme_preview_api.get_theme_preview_data')
  .then(response => {
    if (response.status === 'success') {
      this.themes = response.themes.map(theme => ({
        ...theme,
        // Datos adicionales para el switcher
        preview_colors: theme.preview_colors || {},
        css_variables: theme.css_variables || {}
      }));
      
      this.render_previews();
    }
  });
```

### Renderizado de Previews

```javascript
generate_preview_html(theme) {
  const colors = theme.preview_components || {};
  
  return `
    <div class="theme-preview" style="${this.generate_preview_styles(theme)}">
      <div class="navbar" style="background: ${colors.navbar_bg}; color: ${colors.navbar_text};">
        <!-- Elementos del navbar -->
      </div>
      <div class="sidebar" style="background: ${colors.sidebar_bg}; color: ${colors.sidebar_text};">
        <!-- Elementos del sidebar -->
      </div>
      <div class="main" style="background: ${colors.main_bg}; color: ${colors.main_text};">
        <!-- Contenido principal -->
      </div>
    </div>
  `;
}
```

## Testing

### Script de Prueba

Ejecutar el script de prueba para verificar la funcionalidad:

```bash
bench --site [site-name] execute frappe-themes-submodule/utils/test_theme_preview.py
```

### Validación Manual

```javascript
// Desde la consola del navegador
frappe.xcall('frappe_themes_submodule.utils.theme_preview_api.validate_theme_preview_api')
  .then(result => console.log(result));
```

## Manejo de Errores

La API incluye manejo robusto de errores:

- **Fallback a temas por defecto** si falla la extracción de temas personalizados
- **Validación de URLs** antes de descargar CSS
- **Timeout en requests HTTP** (10 segundos)
- **Logging detallado** de errores en Frappe

## Rendimiento

- **Caché de resultados** para evitar re-extracciones innecesarias
- **Límite de tamaño** en contenido CSS (500 caracteres para preview)
- **Timeout en requests** para evitar bloqueos
- **Lazy loading** de datos de preview solo cuando se necesitan

## Compatibilidad

- **Frappe v13+**: Totalmente compatible
- **Temas legacy**: Fallback automático a datos por defecto
- **Apps personalizadas**: Detección automática de temas en hooks

## Próximas Funcionalidades

- Cache persistente de datos de preview
- Compresión de datos CSS
- Soporte para temas de apps específicas
- API de generación automática de colores complementarios