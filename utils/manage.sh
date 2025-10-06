#!/bin/bash

# Utilidades adicionales para frappe-themes-submodule

# Lista las aplicaciones disponibles en frappe-bench
list_apps() {
    echo "Aplicaciones disponibles en este frappe-bench:"
    echo "=============================================="
    
    if [ -d "apps" ]; then
        for app in apps/*/; do
            if [ -d "$app" ]; then
                app_name=$(basename "$app")
                if [[ "$app_name" != "__pycache__" ]]; then
                    echo "  - $app_name"
                fi
            fi
        done
    else
        echo "Error: No se encontró el directorio 'apps'. ¿Estás en frappe-bench?"
        return 1
    fi
}

# Verifica si una app tiene temas instalados
check_themes() {
    local app_name=$1
    
    if [ -z "$app_name" ]; then
        echo "Uso: check_themes <nombre_app>"
        return 1
    fi
    
    local themes_dir="apps/$app_name/$app_name/website_theme"
    
    if [ -d "$themes_dir" ]; then
        echo "Temas instalados en $app_name:"
        echo "=============================="
        
        local count=0
        for theme in "$themes_dir"/*; do
            if [ -d "$theme" ]; then
                theme_name=$(basename "$theme")
                if [[ "$theme_name" != "__pycache__" ]]; then
                    echo "  ✓ $theme_name"
                    count=$((count + 1))
                fi
            fi
        done
        
        if [ $count -eq 0 ]; then
            echo "  (No se encontraron temas)"
        fi
    else
        echo "La aplicación '$app_name' no tiene directorio de temas."
        echo "¿Has ejecutado la instalación?"
    fi
}

# Elimina temas instalados de una app
uninstall_themes() {
    local app_name=$1
    
    if [ -z "$app_name" ]; then
        echo "Uso: uninstall_themes <nombre_app>"
        return 1
    fi
    
    local themes_dir="apps/$app_name/$app_name/website_theme"
    local fixtures_file="apps/$app_name/$app_name/fixtures/website_theme.json"
    
    echo "Desinstalando temas de $app_name..."
    
    # Eliminar directorio de temas
    if [ -d "$themes_dir" ]; then
        rm -rf "$themes_dir"
        echo "  ✓ Directorio de temas eliminado"
    fi
    
    # Eliminar fixtures
    if [ -f "$fixtures_file" ]; then
        rm "$fixtures_file"
        echo "  ✓ Fixtures eliminados"
    fi
    
    echo "  ⚠ NOTA: Debes eliminar manualmente las líneas de fixtures del hooks.py"
    echo "  Archivo: apps/$app_name/$app_name/hooks.py"
}

# Función principal
main() {
    case "$1" in
        "list")
            list_apps
            ;;
        "check")
            check_themes "$2"
            ;;
        "uninstall")
            uninstall_themes "$2"
            ;;
        *)
            echo "Frappe Themes Submodule - Utilidades"
            echo "===================================="
            echo ""
            echo "Uso: $0 <comando> [argumentos]"
            echo ""
            echo "Comandos disponibles:"
            echo "  list                    - Lista todas las apps disponibles"
            echo "  check <app>            - Verifica temas instalados en una app"
            echo "  uninstall <app>        - Desinstala temas de una app"
            echo ""
            echo "Ejemplos:"
            echo "  $0 list"
            echo "  $0 check dragon_ball_app"
            echo "  $0 uninstall dragon_ball_app"
            ;;
    esac
}

# Ejecutar función principal con todos los argumentos
main "$@"