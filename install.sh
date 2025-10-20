#!/bin/bash

# Frappe Themes Submodule Installer
# Theme installer as independent submodule
# Usage: ./install.sh [target_app_name]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No color

echo -e "${GREEN}=== Frappe Themes Submodule Installer ===${NC}"

# Verify arguments
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: You must provide the target application name${NC}"
    echo "Usage: $0 <target_app_name>"
    echo "Example: $0 my_app"
    exit 1
fi

TARGET_APP=$1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BENCH_DIR="$(pwd)"

echo -e "${BLUE}Script ejecutándose desde: $SCRIPT_DIR${NC}"
echo -e "${BLUE}Directorio de trabajo: $BENCH_DIR${NC}"

# Verificar que estemos en un directorio de frappe-bench
if [ ! -d "apps" ] || [ ! -f "sites/common_site_config.json" ]; then
    echo -e "${RED}Error: Este script debe ejecutarse desde el directorio raíz de frappe-bench${NC}"
    echo "Directorio actual: $(pwd)"
    echo "Asegúrate de estar en el directorio que contiene las carpetas 'apps' y 'sites'"
    exit 1
fi

# Verificar que la app de destino existe
if [ ! -d "apps/$TARGET_APP" ]; then
    echo -e "${RED}Error: La aplicación '$TARGET_APP' no existe en apps/${NC}"
    echo "Aplicaciones disponibles:"
    ls -1 apps/ | grep -v __pycache__ || echo "No se encontraron aplicaciones"
    exit 1
fi

# Obtener el nombre del módulo desde modules.txt
MODULES_FILE="apps/$TARGET_APP/$TARGET_APP/modules.txt"
if [ -f "$MODULES_FILE" ]; then
    MODULE_NAME=$(head -n 1 "$MODULES_FILE" | tr -d '\n\r')
    echo -e "${BLUE}Nombre del módulo detectado: '$MODULE_NAME'${NC}"
else
    echo -e "${YELLOW}⚠ No se encontró modules.txt, usando nombre de app como módulo${NC}"
    MODULE_NAME="$TARGET_APP"
fi

echo -e "${YELLOW}Instalando temas en la aplicación: $TARGET_APP${NC}"

# Crear directorio de website_theme en la app de destino si no existe
TARGET_THEMES_DIR="apps/$TARGET_APP/$TARGET_APP/website_theme"
if [ ! -d "$TARGET_THEMES_DIR" ]; then
    echo "Creando directorio de temas: $TARGET_THEMES_DIR"
    mkdir -p "$TARGET_THEMES_DIR"
fi

# Verificar que existen los temas fuente
SOURCE_THEMES_DIR="$SCRIPT_DIR/themes"

if [ ! -d "$SOURCE_THEMES_DIR" ]; then
    echo -e "${RED}Error: No se encontró el directorio de temas fuente: $SOURCE_THEMES_DIR${NC}"
    exit 1
fi

echo "Copiando temas desde: $SOURCE_THEMES_DIR"
echo "Hacia: $TARGET_THEMES_DIR"

# Copiar temas y configurar módulo
for theme_dir in "$SOURCE_THEMES_DIR"/*; do
    if [ -d "$theme_dir" ] && [[ ! "$(basename "$theme_dir")" == "__pycache__" ]]; then
        theme_name=$(basename "$theme_dir")
        echo "  - Copiando tema: $theme_name"
        cp -r "$theme_dir" "$TARGET_THEMES_DIR/"
        
        # Actualizar el módulo en el archivo JSON del tema
        THEME_JSON_FILE="$TARGET_THEMES_DIR/$theme_name/$theme_name.json"
        if [ -f "$THEME_JSON_FILE" ]; then
            echo "    - Configurando módulo en $theme_name.json"
            # Reemplazar "Website" con el nombre del módulo desde modules.txt
            sed -i "s/\"module\": \"Website\"/\"module\": \"$MODULE_NAME\"/g" "$THEME_JSON_FILE"
            echo -e "    ${GREEN}✓ Módulo configurado como '$MODULE_NAME'${NC}"
        else
            echo -e "    ${YELLOW}⚠ No se encontró archivo JSON para $theme_name${NC}"
        fi
        
        # Verificar archivos copiados
        if [ -d "$TARGET_THEMES_DIR/$theme_name" ]; then
            echo -e "    ${GREEN}✓ Tema $theme_name copiado exitosamente${NC}"
            
            # Verificar archivos específicos copiados
            if [ -f "$TARGET_THEMES_DIR/$theme_name/$theme_name.json" ]; then
                echo -e "      ✓ $theme_name.json"
            fi
            if [ -f "$TARGET_THEMES_DIR/$theme_name/$theme_name.css" ]; then
                echo -e "      ${GREEN}✓ $theme_name.css (archivo CSS separado)${NC}"
            fi
            if [ -f "$TARGET_THEMES_DIR/$theme_name/__init__.py" ]; then
                echo -e "      ✓ __init__.py"
            fi
        else
            echo -e "    ${RED}✗ Error copiando tema $theme_name${NC}"
        fi
    fi
done

# Crear directorio de fixtures si no existe
TARGET_FIXTURES_DIR="apps/$TARGET_APP/$TARGET_APP/fixtures"
if [ ! -d "$TARGET_FIXTURES_DIR" ]; then
    echo "Creando directorio de fixtures: $TARGET_FIXTURES_DIR"
    mkdir -p "$TARGET_FIXTURES_DIR"
fi

# Copiar y configurar fixtures
SOURCE_FIXTURES="$SCRIPT_DIR/fixtures/website_theme.json"
if [ -f "$SOURCE_FIXTURES" ]; then
    echo "Copiando fixtures de temas..."
    cp "$SOURCE_FIXTURES" "$TARGET_FIXTURES_DIR/"
    
    # Actualizar el módulo en el archivo de fixtures
    TARGET_FIXTURES_FILE="$TARGET_FIXTURES_DIR/website_theme.json"
    if [ -f "$TARGET_FIXTURES_FILE" ]; then
        echo "Configurando módulo en fixtures..."
        sed -i "s/\"module\": \"Website\"/\"module\": \"$MODULE_NAME\"/g" "$TARGET_FIXTURES_FILE"
        echo -e "${GREEN}✓ Fixtures copiados y configurados para '$MODULE_NAME'${NC}"
    fi
else
    echo -e "${YELLOW}⚠ No se encontraron fixtures en: $SOURCE_FIXTURES${NC}"
fi

# Actualizar hooks.py
HOOKS_FILE="apps/$TARGET_APP/$TARGET_APP/hooks.py"
if [ -f "$HOOKS_FILE" ]; then
    echo "Verificando hooks.py..."
    
    # Verificar si ya tiene fixtures para Website Theme
    if grep -q "Website Theme" "$HOOKS_FILE"; then
        echo -e "${YELLOW}⚠ El hooks.py ya contiene referencias a Website Theme${NC}"
        echo "Revisa manualmente el archivo: $HOOKS_FILE"
    else
        echo "Agregando fixtures al hooks.py..."
        cat >> "$HOOKS_FILE" << 'EOF'

# Website Theme Fixtures (agregado por frappe-themes-submodule)
# ------------------------------------------------------------
if not globals().get('fixtures'):
    fixtures = []

fixtures.extend([
    {
        "doctype": "Website Theme",
        "filters": [
            [
                "name", "in", [
                    "Dickface",
                    "Dickhead"
                ]
            ]
        ]
    }
])
EOF
        echo -e "${GREEN}✓ Fixtures agregados al hooks.py${NC}"
    fi
else
    echo -e "${RED}Error: No se encontró hooks.py en $HOOKS_FILE${NC}"
    exit 1
fi

# Verificar instalación
echo ""
echo -e "${GREEN}=== Verificación de Instalación ===${NC}"

# Contar temas instalados
INSTALLED_THEMES=$(find "$TARGET_THEMES_DIR" -maxdepth 1 -type d ! -name "website_theme" | wc -l)
echo "Temas instalados: $INSTALLED_THEMES"

# Listar temas
if [ "$INSTALLED_THEMES" -gt 0 ]; then
    echo "Temas disponibles:"
    for theme_dir in "$TARGET_THEMES_DIR"/*; do
        if [ -d "$theme_dir" ]; then
            theme_name=$(basename "$theme_dir")
            if [ -f "$theme_dir/$theme_name.json" ]; then
                echo -e "  ${GREEN}✓ $theme_name${NC}"
            else
                echo -e "  ${YELLOW}? $theme_name (sin archivo JSON)${NC}"
            fi
        fi
    done
fi

# Instalar mejoras al theme switcher
echo ""
echo -e "${BLUE}=== Instalando mejoras al Theme Switcher ===${NC}"

THEME_SWITCHER_PATH="sites/assets/frappe/js/frappe/ui/theme_switcher.js"
ENHANCED_THEME_SWITCHER="$SCRIPT_DIR/utils/theme_switcher_enhanced.js"
USER_EXTENSION_SOURCE="$SCRIPT_DIR/utils/user_extension.py"
USER_EXTENSION_TARGET="apps/$TARGET_APP/$TARGET_APP/user_extension.py"

if [ -f "$THEME_SWITCHER_PATH" ]; then
    echo "Encontrado theme_switcher.js original..."
    
    # Hacer backup del archivo original
    if [ ! -f "${THEME_SWITCHER_PATH}.original" ]; then
        echo "Creando backup del theme_switcher.js original..."
        cp "$THEME_SWITCHER_PATH" "${THEME_SWITCHER_PATH}.original"
        echo -e "${GREEN}✓ Backup creado: ${THEME_SWITCHER_PATH}.original${NC}"
    else
        echo -e "${YELLOW}⚠ Ya existe backup del theme_switcher.js original${NC}"
    fi
    
    # Reemplazar con la versión mejorada
    if [ -f "$ENHANCED_THEME_SWITCHER" ]; then
        echo "Instalando theme_switcher.js mejorado..."
        cp "$ENHANCED_THEME_SWITCHER" "$THEME_SWITCHER_PATH"
        echo -e "${GREEN}✓ Theme switcher mejorado instalado${NC}"
    else
        echo -e "${RED}Error: No se encontró el theme_switcher mejorado en: $ENHANCED_THEME_SWITCHER${NC}"
    fi
else
    echo -e "${YELLOW}⚠ No se encontró theme_switcher.js en la ruta esperada${NC}"
    echo "Ruta buscada: $THEME_SWITCHER_PATH"
fi

# Instalar mejoras al desk.js (Auto-cargador de temas)
echo ""
echo -e "${BLUE}=== Instalando Auto-cargador de Temas en desk.js ===${NC}"

DESK_PATH="sites/assets/frappe/js/frappe/desk.js"
ENHANCED_DESK="$SCRIPT_DIR/utils/desk.js"

if [ -f "$DESK_PATH" ]; then
    echo "Encontrado desk.js original..."
    
    # Hacer backup del archivo original
    if [ ! -f "${DESK_PATH}.original" ]; then
        echo "Creando backup del desk.js original..."
        cp "$DESK_PATH" "${DESK_PATH}.original"
        echo -e "${GREEN}✓ Backup creado: ${DESK_PATH}.original${NC}"
    else
        echo -e "${YELLOW}⚠ Ya existe backup del desk.js original${NC}"
    fi
    
    # Reemplazar con la versión mejorada
    if [ -f "$ENHANCED_DESK" ]; then
        echo "Instalando desk.js mejorado con auto-cargador de temas..."
        cp "$ENHANCED_DESK" "$DESK_PATH"
        echo -e "${GREEN}✓ Desk.js mejorado instalado con auto-cargador integrado${NC}"
    else
        echo -e "${RED}Error: No se encontró el desk.js mejorado en: $ENHANCED_DESK${NC}"
    fi
else
    echo -e "${YELLOW}⚠ No se encontró desk.js en la ruta esperada${NC}"
    echo "Ruta buscada: $DESK_PATH"
fi

# Copiar extensión de usuario
if [ -f "$USER_EXTENSION_SOURCE" ]; then
    echo "Copiando extensión de usuario..."
    cp "$USER_EXTENSION_SOURCE" "$USER_EXTENSION_TARGET"
    echo -e "${GREEN}✓ Extensión de usuario copiada${NC}"
    
    # Agregar import en __init__.py si no existe
    INIT_FILE="apps/$TARGET_APP/$TARGET_APP/__init__.py"
    if [ -f "$INIT_FILE" ]; then
        if ! grep -q "user_extension" "$INIT_FILE"; then
            echo "" >> "$INIT_FILE"
            echo "# Frappe Themes Submodule Extension" >> "$INIT_FILE"
            echo "from . import user_extension" >> "$INIT_FILE"
            echo -e "${GREEN}✓ Import agregado a __init__.py${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠ No se encontró user_extension.py${NC}"
fi

echo ""
echo -e "${GREEN}✓ ¡Instalación completada exitosamente!${NC}"
echo ""
echo -e "${BLUE}Próximos pasos:${NC}"
echo "1. Ejecutar migración:"
echo "   ${YELLOW}bench --site [tu-sitio] migrate${NC}"
echo ""
echo "2. Construir archivos para aplicar cambios:"
echo "   ${YELLOW}bench build --app frappe${NC}"
echo ""
echo "3. Limpiar cache:"
echo "   ${YELLOW}bench --site [tu-sitio] clear-cache${NC}"
echo ""
echo "4. Verificar temas en la UI:"
echo "   ${YELLOW}Usar Ctrl+Shift+G para abrir theme switcher${NC}"
echo ""
echo "5. Los temas personalizados ahora se cargan automáticamente al refrescar la página"
echo ""
echo "6. Si los temas no aparecen, reinstalar la app:"
echo "   ${YELLOW}bench --site [tu-sitio] install-app $TARGET_APP${NC}"
echo ""
echo ""
echo -e "${YELLOW}=== Instalando Theme Preview API ===${NC}"

# Crear el archivo de extensión para el Theme Preview API
THEME_EXTENSION_FILE="apps/$TARGET_APP/$TARGET_APP/theme_preview_api.py"
echo "Creando Theme Preview API en: $THEME_EXTENSION_FILE"

cat > "$THEME_EXTENSION_FILE" << 'EOF'
"""
Theme Preview API - Auto-generado por frappe-themes-submodule
Proporciona endpoints para obtener datos de preview de temas
"""

import frappe
import re
import requests
from urllib.parse import urljoin
from frappe.utils import cstr


@frappe.whitelist()
def get_theme_preview_data(theme_name=None):
    """
    Endpoint principal para obtener datos de preview de temas
    """
    try:
        if theme_name:
            return get_single_theme_preview(theme_name)
        else:
            all_themes = []
            
            # Agregar temas por defecto
            default_themes = get_default_themes()
            all_themes.extend(default_themes)
            
            # Agregar temas personalizados
            custom_themes = get_custom_themes()
            all_themes.extend(custom_themes)
            
            return {
                "status": "success",
                "themes": all_themes,
                "count": len(all_themes)
            }
            
    except Exception as e:
        frappe.log_error(f"Error in theme preview API: {str(e)}", "Theme Preview API")
        return {
            "status": "error",
            "message": str(e),
            "themes": get_default_themes()
        }


def get_default_themes():
    """Temas por defecto de Frappe"""
    return [
        {
            "name": "light",
            "label": "Frappe Light",
            "info": "Light Theme",
            "is_custom": False,
            "preview_colors": {
                "primary": "#007bff",
                "background": "#ffffff",
                "text": "#212529",
                "navbar": "#ffffff",
                "sidebar": "#f8f9fa"
            }
        },
        {
            "name": "dark",
            "label": "Timeless Night", 
            "info": "Dark Theme",
            "is_custom": False,
            "preview_colors": {
                "primary": "#5e72e4",
                "background": "#1a1d29",
                "text": "#ffffff",
                "navbar": "#232631",
                "sidebar": "#1a1d29"
            }
        },
        {
            "name": "automatic",
            "label": "Automatic",
            "info": "Uses system's theme",
            "is_custom": False,
            "preview_colors": {
                "primary": "#007bff",
                "background": "auto",
                "text": "auto"
            }
        }
    ]


def get_custom_themes():
    """Obtiene temas personalizados"""
    custom_themes = []
    
    try:
        website_themes = frappe.get_all(
            "Website Theme",
            fields=["name", "theme", "theme_url", "disabled"],
            filters={"disabled": 0}
        )
        
        for theme_doc in website_themes:
            theme_name = cstr(theme_doc.get("theme", "")).lower()
            if theme_name and theme_name not in ["light", "dark", "automatic"]:
                preview_data = get_single_theme_preview(theme_name)
                if preview_data:
                    custom_themes.append(preview_data)
                    
    except Exception as e:
        frappe.log_error(f"Error getting custom themes: {str(e)}", "Theme Preview API")
    
    return custom_themes


def get_single_theme_preview(theme_name):
    """Obtiene preview de un tema específico"""
    try:
        # Buscar tema en la base de datos
        theme_docs = frappe.get_all(
            "Website Theme",
            fields=["name", "theme", "theme_url"],
            filters={"disabled": 0}
        )
        
        theme_doc = None
        for doc in theme_docs:
            if doc.get('theme', '').lower() == theme_name.lower():
                theme_doc = frappe.get_doc("Website Theme", doc.name)
                break
        
        if not theme_doc:
            return None
            
        return {
            "name": theme_name.lower(),
            "label": theme_doc.get("theme") or theme_name,
            "info": f"Custom theme: {theme_doc.get('theme') or theme_name}",
            "is_custom": True,
            "theme_url": theme_doc.get("theme_url"),
            "preview_colors": extract_basic_colors(theme_doc.get("theme_url"))
        }
        
    except Exception as e:
        frappe.log_error(f"Error getting theme preview for {theme_name}: {str(e)}", "Theme Preview API")
        return None


def extract_basic_colors(theme_url):
    """Extrae colores básicos de un tema"""
    colors = {
        "primary": "#007bff",
        "background": "#ffffff", 
        "text": "#212529"
    }
    
    if not theme_url:
        return colors
    
    try:
        if theme_url.startswith('/'):
            base_url = frappe.utils.get_url()
            theme_url = urljoin(base_url, theme_url)
        
        response = requests.get(theme_url, timeout=5)
        css_content = response.text
        
        # Buscar colores básicos
        primary_match = re.search(r'--primary[^:]*:\s*([^;\n]+)', css_content, re.IGNORECASE)
        if primary_match:
            colors["primary"] = primary_match.group(1).strip()
            
        bg_match = re.search(r'background[^:]*:\s*([^;\n]+)', css_content, re.IGNORECASE)  
        if bg_match:
            colors["background"] = bg_match.group(1).strip()
            
    except Exception:
        pass  # Usar colores por defecto
    
    return colors


@frappe.whitelist()
def validate_theme_preview_api():
    """Valida que el API funcione"""
    try:
        result = get_theme_preview_data()
        return {
            "status": "success",
            "message": "Theme Preview API is working",
            "theme_count": len(result.get("themes", []))
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
EOF

if [ -f "$THEME_EXTENSION_FILE" ]; then
    echo -e "${GREEN}✓ Theme Preview API creado exitosamente${NC}"
else
    echo -e "${RED}✗ Error creando Theme Preview API${NC}"
fi

echo ""
echo -e "${BLUE}Características instaladas:${NC}"
echo -e "${GREEN}✓ Auto-cargador de temas integrado en desk.js${NC}"
echo -e "${GREEN}✓ Theme switcher mejorado para temas del desk${NC}"
echo -e "${GREEN}✓ Persistencia de temas en el servidor${NC}"
echo -e "${GREEN}✓ Theme Preview API con datos de colores${NC}"
echo ""
echo -e "${BLUE}Theme Preview API instalado en:${NC}"
echo -e "${YELLOW}$THEME_EXTENSION_FILE${NC}"
echo ""
echo -e "${BLUE}Para probar el API desde la consola del navegador:${NC}"
echo -e "${YELLOW}frappe.xcall('$TARGET_APP.theme_preview_api.get_theme_preview_data')${NC}"
echo -e "${YELLOW}  .then(result => console.log(result));${NC}"
echo ""
echo -e "${BLUE}Para restaurar archivos originales:${NC}"
echo -e "Theme switcher: ${YELLOW}cp ${THEME_SWITCHER_PATH}.original $THEME_SWITCHER_PATH${NC}"
echo -e "Desk.js: ${YELLOW}cp ${DESK_PATH}.original $DESK_PATH${NC}"
echo -e "Theme API: ${YELLOW}rm $THEME_EXTENSION_FILE${NC}"