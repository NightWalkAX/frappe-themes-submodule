#!/bin/bash

# Frappe Themes Submodule Installer
# Instalador de temas como submódulo independiente
# Uso: ./install.sh [nombre_de_app_destino]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

echo -e "${GREEN}=== Frappe Themes Submodule Installer ===${NC}"

# Verificar argumentos
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Debes proporcionar el nombre de la aplicación de destino${NC}"
    echo "Uso: $0 <nombre_app_destino>"
    echo "Ejemplo: $0 mi_app"
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

# Copiar temas
for theme_dir in "$SOURCE_THEMES_DIR"/*; do
    if [ -d "$theme_dir" ] && [[ ! "$(basename "$theme_dir")" == "__pycache__" ]]; then
        theme_name=$(basename "$theme_dir")
        echo "  - Copiando tema: $theme_name"
        cp -r "$theme_dir" "$TARGET_THEMES_DIR/"
        
        # Verificar que se copió correctamente
        if [ -d "$TARGET_THEMES_DIR/$theme_name" ]; then
            echo -e "    ${GREEN}✓ Tema $theme_name copiado exitosamente${NC}"
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

# Copiar fixtures
SOURCE_FIXTURES="$SCRIPT_DIR/fixtures/website_theme.json"
if [ -f "$SOURCE_FIXTURES" ]; then
    echo "Copiando fixtures de temas..."
    cp "$SOURCE_FIXTURES" "$TARGET_FIXTURES_DIR/"
    echo -e "${GREEN}✓ Fixtures copiados${NC}"
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

echo ""
echo -e "${GREEN}✓ ¡Instalación completada exitosamente!${NC}"
echo ""
echo -e "${BLUE}Próximos pasos:${NC}"
echo "1. Ejecutar migración:"
echo "   ${YELLOW}bench --site [tu-sitio] migrate${NC}"
echo ""
echo "2. Verificar temas en la UI:"
echo "   ${YELLOW}Setup > Website > Website Theme${NC}"
echo ""
echo "3. Si los temas no aparecen, reinstalar la app:"
echo "   ${YELLOW}bench --site [tu-sitio] install-app $TARGET_APP${NC}"
echo ""
echo -e "${BLUE}Los temas 'Dickface' y 'Dickhead' deberían estar disponibles.${NC}"