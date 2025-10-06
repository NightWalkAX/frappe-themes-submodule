# Frappe Themes Submodule

Un sub-repositorio independiente que contiene temas tanto para Website como para Frappe Desk. Incluye sistema completo de gestión de temas con previews, auto-cargador y theme switcher mejorado.

## 🚀 Características

- ✨ **Temas Website**: Temas "Dickface" y "Dickhead" con estilos Bootstrap personalizados
- 🎨 **Temas Desk**: "Dark Purple Desk" y "Ocean Blue Desk" para interfaz de escritorio
- 🔧 **Instalación Automática**: Script que instala todo el sistema de temas
- 🎯 **Theme Switcher Mejorado**: Cambio instantáneo con previews visuales (Ctrl+Shift+G)
- 🤖 **Auto-Cargador**: Persistencia automática de temas entre sesiones
- 📊 **Theme Preview API**: Extracción automática de colores y variables CSS
- 📦 **Sin Dependencias**: No requiere instalaciones adicionales
- �️ **Plug & Play**: Funciona desde cualquier directorio frappe-bench
- 📱 **Responsive**: Diseños adaptables y modernos

## 📁 Estructura del Repositorio

```
frappe-themes-submodule/
├── themes/                              # Temas disponibles
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
├── utils/                               # Utilidades del sistema
│   ├── theme_switcher_enhanced.js       # Theme switcher mejorado
│   ├── desk.js                          # Auto-cargador integrado
│   ├── theme_preview_api.py             # API de previews de temas
│   └── user_extension.py                # Gestión de preferencias
├── fixtures/
│   └── website_theme.json               # Fixtures para instalación automática
├── install.sh                           # Script de instalación principal
├── THEME_PREVIEW_API.md                 # Documentación de la API
└── README.md                            # Este archivo
```

## 🛠️ Instalación

### Opción 1: Como Submódulo Git (Recomendado)

```bash
# 1. Agregar como submódulo en tu proyecto
cd /path/to/frappe-bench
git submodule add [URL_DE_ESTE_REPO] frappe-themes-submodule

# 2. Instalar sistema completo de temas
./frappe-themes-submodule/install.sh mi_app

# 3. Migrar para aplicar cambios
bench --site mi-sitio migrate

# 4. Construir assets de Frappe
bench build --app frappe

# 5. Limpiar cache para aplicar tema switcher
bench --site mi-sitio clear-cache

# 6. ¡Usar Ctrl+Shift+G para cambiar temas instantly!
```

### Opción 2: Descarga Directa

```bash
# 1. Descargar o clonar en frappe-bench
cd /path/to/frappe-bench
git clone [URL_DE_ESTE_REPO] themes-submodule

# 2. Ejecutar instalación
./themes-submodule/install.sh mi_app

# 3. Migrar
bench --site mi-sitio migrate
```

### Opción 3: Descarga Manual

```bash
# 1. Descargar y extraer en frappe-bench
cd /path/to/frappe-bench
wget [URL_DEL_ZIP]
unzip frappe-themes-submodule.zip

# 2. Instalar
./frappe-themes-submodule/install.sh mi_app
```

## 🔧 Uso del Script de Instalación

```bash
# Sintaxis básica
./install.sh [nombre_de_tu_app]

# Ejemplo práctico
./install.sh dragon_ball_app
```

### ¿Qué instala el script?

1. **Verifica el entorno**: Confirma que estás en un directorio frappe-bench válido
2. **Detecta módulo**: Lee automáticamente el módulo correcto desde `modules.txt`
3. **Copia temas**: Instala todos los temas (website + desk) con configuración automática
4. **Instala fixtures**: Copia y configura fixtures con módulo correcto
5. **Theme Switcher Mejorado**: Reemplaza el theme switcher de Frappe con versión enhanced
6. **Auto-Cargador de Temas**: Integra auto-loader en desk.js para persistencia automática
7. **Theme Preview API**: Instala endpoints para previews de temas con extracción de colores
8. **User Extensions**: Añade sistema de gestión de preferencias de usuario
9. **Backups**: Crea backups de archivos originales de Frappe
10. **Verifica instalación**: Confirma que todo funciona correctamente

## 📋 Requisitos

- ✅ Frappe Framework v13+ 
- ✅ Aplicación Frappe válida como destino
- ✅ Permisos de escritura en el directorio `apps/`
- ✅ Bash shell (Linux/macOS/WSL)

## 🎨 Temas Incluidos

### Website Themes
**Dickface Theme**
- Botones redondeados sin gradientes ni sombras
- Tipografía con pesos: 300-800
- Estilos Bootstrap personalizados

**Dickhead Theme**  
- Mismas características que Dickface
- Variación de colores y espaciado

### Desk Themes (Nuevos!)
**Dark Purple Desk**
- Tema oscuro con acentos púrpura elegantes
- Diseñado específicamente para la interfaz Frappe Desk
- Colores: Background #1a1a2e, Accent #533483, Text #e6e6fa
- Optimizado para formularios, listas y módulos

**Ocean Blue Desk**
- Tema moderno con gradientes azul océano
- Animaciones suaves y efectos visuales enhanced
- Gradientes dinámicos y transiciones fluidas
- Perfecto para uso diario con excelente legibilidad

## 🎛️ Sistema de Temas Mejorado

### Theme Switcher Enhanced (Ctrl+Shift+G)
- **Previews Visuales**: Ve cómo se verá cada tema antes de aplicarlo
- **Aplicación Instantánea**: Los temas se aplican inmediatamente sin refrescar
- **Detección Inteligente**: Reconoce automáticamente temas personalizados
- **Persistencia**: Guarda tu preferencia y la restaura automáticamente

### Auto-Cargador Integrado
- **Carga Automática**: Tu tema favorito se carga automáticamente al iniciar sesión
- **Sincronización**: Sincroniza preferencias entre diferentes dispositivos
- **Fallback Inteligente**: Sistema robusto de recuperación ante errores

### Theme Preview API
- **Extracción de Colores**: Analiza automáticamente CSS para generar previews
- **Variables CSS**: Detecta y mapea variables CSS personalizadas
- **Componentes**: Mapea colores específicos para navbar, sidebar, botones, etc.
- **Validación**: Sistema completo de validación de colores y estilos

## 🔄 Actualización de Submódulo

```bash
# Actualizar a la última versión
cd /path/to/frappe-bench
git submodule update --remote themes-submodule

# Reinstalar si hay cambios en temas
./themes-submodule/install.sh mi_app
bench --site mi-sitio migrate
```

## 🐛 Solución de Problemas

### Theme Switcher no aparece (Ctrl+Shift+G)

```bash
# 1. Verificar que se construyeron los assets
bench build --app frappe

# 2. Limpiar caché completamente  
bench --site mi-sitio clear-cache
bench --site mi-sitio clear-website-cache

# 3. Verificar que desk.js fue reemplazado
ls -la sites/assets/frappe/js/frappe/desk.js*

# 4. Refrescar el navegador completamente (Ctrl+F5)
```

### Los temas no aparecen en el Theme Switcher

```bash
# 1. Verificar que user_extension.py existe
ls apps/mi_app/mi_app/user_extension.py

# 2. Verificar import en __init__.py
grep "user_extension" apps/mi_app/mi_app/__init__.py

# 3. Probar API desde consola del navegador
frappe.xcall('mi_app.user_extension.get_available_themes')
```

### Los temas no se aplican o no persisten

```bash
# 1. Verificar Theme Preview API
frappe.xcall('mi_app.theme_preview_api.validate_theme_preview_api')

# 2. Verificar preferencias de usuario
frappe.xcall('mi_app.user_extension.get_desk_theme_preference')

# 3. Limpiar localStorage del navegador
# Abrir DevTools > Application > Local Storage > Clear
```

### Website themes no aparecen en la UI tradicional

```bash
# 1. Verificar migración
bench --site mi-sitio migrate --verbose

# 2. Reinstalar fixtures
bench --site mi-sitio install-fixtures

# 3. Limpiar caché
bench --site mi-sitio clear-cache
```

### Error de instalación

```bash
# Verificar permisos
ls -la apps/mi_app/mi_app/

# Verificar que la app existe
bench --site mi-sitio list-apps

# Reinstalar desde cero si es necesario
./install.sh mi_app
```

### Restaurar archivos originales de Frappe

```bash
# Si algo sale mal, restaurar backups
cp sites/assets/frappe/js/frappe/desk.js.original sites/assets/frappe/js/frappe/desk.js
cp sites/assets/frappe/js/frappe/ui/theme_switcher.js.original sites/assets/frappe/js/frappe/ui/theme_switcher.js

# Reconstruir
bench build --app frappe
```

## 🚀 Uso después de la Instalación

### Cambio Rápido de Temas (Recomendado)
1. **Usar Theme Switcher Mejorado:**
   - Presiona `Ctrl+Shift+G` desde cualquier parte del desk
   - Ve previews visuales de todos los temas disponibles
   - Haz clic en cualquier tema para aplicarlo instantáneamente
   - Tu selección se guarda automáticamente

### Gestión Tradicional de Website Themes
1. **Acceder a los website themes:**
   ```
   Setup > Website > Website Theme
   ```

2. **Los website themes aparecerán como:**
   - Dickface
   - Dickhead

3. **Seleccionar y configurar:**
   - Haz clic en el tema deseado
   - Ajusta las opciones (botones, sombras, etc.)
   - Guarda los cambios

### Temas de Desk Disponibles
- **Frappe Light**: Tema claro por defecto
- **Timeless Night**: Tema oscuro elegante
- **Automatic**: Se adapta al tema del sistema
- **Dark Purple Desk**: Tema púrpura personalizado 🆕
- **Ocean Blue Desk**: Tema azul con gradientes 🆕

## 🔧 Funcionalidades Avanzadas

### Theme Preview API
```javascript
// Obtener todos los temas con datos de preview
frappe.xcall('tu_app.theme_preview_api.get_theme_preview_data')
  .then(response => console.log(response.themes));

// Validar que la API funciona
frappe.xcall('tu_app.theme_preview_api.validate_theme_preview_api')
  .then(result => console.log(result));
```

### Gestión de Preferencias
```javascript
// Guardar tema preferido
frappe.xcall('tu_app.user_extension.save_desk_theme_preference', {
  theme_name: 'dark_purple_desk'
});

// Obtener tema preferido
frappe.xcall('tu_app.user_extension.get_desk_theme_preference')
  .then(result => console.log(result.theme));
```

## 🔧 Personalización Avanzada

### Modificar un tema existente

```bash
# 1. Editar el archivo JSON del tema
nano apps/mi_app/mi_app/website_theme/dickface/dickface.json

# 2. Personalizar el SCSS
# Edita el campo "theme_scss" en el JSON

# 3. Compilar assets
bench build --app mi_app
```

### Agregar un nuevo tema

```bash
# 1. Crear directorio para el nuevo tema
mkdir themes/mi_nuevo_tema

# 2. Crear archivo JSON
cat > themes/mi_nuevo_tema/mi_nuevo_tema.json << EOF
{
  "doctype": "Website Theme",
  "name": "Mi Nuevo Tema",
  "theme": "Mi Nuevo Tema", 
  "module": "Tu App",
  "theme_scss": "// Tu CSS aquí"
}
EOF

# 3. Crear __init__.py
touch themes/mi_nuevo_tema/__init__.py

# 4. Actualizar fixtures
# Editar fixtures/website_theme.json para incluir el nuevo tema

# 5. Reinstalar
./install.sh mi_app
```

## 📝 Ejemplo de Integración

### En tu aplicación Frappe:

```python
# hooks.py después de la instalación
fixtures = [
    {
        "doctype": "Website Theme",
        "filters": [
            ["name", "in", ["Dickface", "Dickhead"]]
        ]
    }
]
```

### Estructura resultante en tu app:

```
apps/mi_app/
├── mi_app/
│   ├── website_theme/              # ← Todos los temas instalados aquí
│   │   ├── dickface/               # Website theme
│   │   ├── dickhead/               # Website theme  
│   │   ├── dark_purple_desk/       # Desk theme 🆕
│   │   └── ocean_blue_desk/        # Desk theme 🆕
│   ├── fixtures/                   # ← Fixtures con configuración automática
│   │   └── website_theme.json
│   ├── theme_preview_api.py        # ← API de previews 🆕
│   ├── user_extension.py           # ← Gestión de preferencias 🆕
│   ├── hooks.py                    # ← Actualizado automáticamente
│   └── __init__.py                 # ← Imports agregados automáticamente

# Archivos de Frappe mejorados:
sites/assets/frappe/js/frappe/
├── desk.js                         # ← Con auto-loader integrado 🆕
└── ui/theme_switcher.js           # ← Theme switcher enhanced 🆕

# Backups automáticos creados:
sites/assets/frappe/js/frappe/
├── desk.js.original               # ← Backup del original
└── ui/theme_switcher.js.original  # ← Backup del original
```

## 🤝 Contribuir

1. Fork este repositorio
2. Crea una rama: `git checkout -b nueva-feature`
3. Haz tus cambios
4. Commit: `git commit -am 'Agregar nueva feature'`
5. Push: `git push origin nueva-feature`
6. Crea un Pull Request

## � Documentación Adicional

- **[Theme Preview API](THEME_PREVIEW_API.md)**: Documentación completa de la API de previews
- **Endpoints disponibles**: `get_theme_preview_data`, `validate_theme_preview_api`
- **Integración JavaScript**: Ejemplos de uso en el frontend
- **Extracción de colores**: Algoritmos de análisis CSS automático

## 🔄 Restauración y Mantenimiento

### Actualizar el sistema de temas
```bash
# Actualizar submódulo
git submodule update --remote frappe-themes-submodule

# Reinstalar con nuevas funcionalidades
./frappe-themes-submodule/install.sh mi_app
bench build --app frappe
bench --site mi-sitio clear-cache
```

### Agregar nuevos temas desk personalizados
```bash
# 1. Crear directorio del tema
mkdir themes/mi_tema_desk

# 2. Crear archivo JSON con css_content
cat > themes/mi_tema_desk/mi_tema_desk.json << 'EOF'
{
  "name": "Mi Tema Desk",
  "theme": "Mi Tema Desk", 
  "module": "Website",
  "css_content": "/* CSS para el desk aquí */"
}
EOF

# 3. Reinstalar
./install.sh mi_app
```

## ⚡ Características Técnicas

### Theme Switcher Enhanced
- **Previews en tiempo real**: Generación automática de previews visuales
- **Detección de temas**: Sistema inteligente de detección de temas personalizados
- **Aplicación instantánea**: Sin necesidad de refrescar página
- **Persistencia robusta**: Múltiples métodos de almacenamiento de preferencias

### Auto-Loader System
- **Carga automática**: Restaura tema preferido al iniciar sesión
- **Fallback inteligente**: Sistema robusto de recuperación ante errores
- **Multi-app support**: Funciona con cualquier app de Frappe
- **Cache management**: Optimización de rendimiento y memoria

### Theme Preview API
- **Extracción inteligente**: Análisis automático de CSS y variables
- **Mapeo de componentes**: Colores específicos para navbar, sidebar, etc.
- **Validación robusta**: Sistema completo de validación de colores
- **Error handling**: Manejo robusto de errores con fallbacks

## �📄 Licencia

MIT License - Úsalo libremente en tus proyectos.

## 🆘 Soporte

- **Issues**: [GitHub Issues del repositorio]
- **Documentación**: [THEME_PREVIEW_API.md](THEME_PREVIEW_API.md)
- **Community**: [Foro de Frappe]

---

**💡 Tips Importantes**:
- Usa `Ctrl+Shift+G` para cambiar temas rápidamente
- Los temas se guardan automáticamente por usuario
- Los backups de archivos originales se crean automáticamente
- Mantén este repositorio como submódulo para recibir actualizaciones