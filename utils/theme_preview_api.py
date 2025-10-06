#!/usr/bin/env python3
"""
Frappe Themes Submodule - Theme Preview API
Endpoint específico para obtener datos de preview de temas
"""

import frappe
import re
import requests
from urllib.parse import urljoin


@frappe.whitelist()
def get_theme_preview_data(theme_name=None):
    """
    Endpoint principal para obtener datos de preview de temas
    Incluye colores principales, variables CSS y metadata para renderizar previews

    Args:
        theme_name (str, optional): Nombre del tema específico. Si no se proporciona, devuelve todos.

    Returns:
        dict or list: Datos de preview del tema o lista de todos los temas
    """
    try:
        if theme_name:
            # Obtener datos de un tema específico
            return get_single_theme_preview(theme_name)
        else:
            # Obtener datos de todos los temas disponibles
            all_themes = []

            # Agregar temas por defecto
            default_themes = get_default_themes_preview()
            all_themes.extend(default_themes)

            # Agregar temas personalizados
            custom_themes = get_custom_themes_preview()
            all_themes.extend(custom_themes)

            return {
                "status": "success",
                "themes": all_themes,
                "count": len(all_themes)
            }

    except Exception as e:
        frappe.log_error(f"Error in get_theme_preview_data: {str(e)}", "Frappe Themes Preview API")
        return {
            "status": "error",
            "message": str(e),
            "themes": get_default_themes_preview()  # Fallback a temas por defecto
        }


def get_default_themes_preview():
    """
    Devuelve datos de preview para los temas por defecto de Frappe
    """
    return [
        {
            "name": "light",
            "label": "Frappe Light",
            "info": "Light Theme",
            "is_custom": False,
            "is_desk_theme": True,
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
            "css_variables": {
                "--primary-color": "#007bff",
                "--text-color": "#212529",
                "--bg-color": "#ffffff",
                "--navbar-bg": "#ffffff",
                "--sidebar-bg": "#f8f9fa",
                "--border-color": "#dee2e6"
            },
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
        },
        {
            "name": "dark",
            "label": "Timeless Night",
            "info": "Dark Theme",
            "is_custom": False,
            "is_desk_theme": True,
            "preview_colors": {
                "primary": "#5e72e4",
                "secondary": "#8898aa",
                "success": "#2dce89",
                "warning": "#fb6340",
                "danger": "#f5365c",
                "background": "#1a1d29",
                "surface": "#232631",
                "text": "#ffffff",
                "text_muted": "#8898aa",
                "navbar": "#232631",
                "sidebar": "#1a1d29",
                "border": "#2d3748"
            },
            "css_variables": {
                "--primary-color": "#5e72e4",
                "--text-color": "#ffffff",
                "--bg-color": "#1a1d29",
                "--navbar-bg": "#232631",
                "--sidebar-bg": "#1a1d29",
                "--border-color": "#2d3748"
            },
            "preview_components": {
                "navbar_bg": "#232631",
                "navbar_text": "#ffffff",
                "sidebar_bg": "#1a1d29",
                "sidebar_text": "#ffffff",
                "main_bg": "#1a1d29",
                "main_text": "#ffffff",
                "card_bg": "#232631",
                "card_border": "#2d3748",
                "button_primary": "#5e72e4",
                "button_primary_text": "#ffffff"
            }
        },
        {
            "name": "automatic",
            "label": "Automatic",
            "info": "Uses system's theme to switch between light and dark mode",
            "is_custom": False,
            "is_desk_theme": True,
            "preview_colors": {
                "primary": "#007bff",
                "secondary": "#6c757d",
                "success": "#28a745",
                "warning": "#ffc107",
                "danger": "#dc3545", 
                "background": "var(--auto-bg)",
                "surface": "var(--auto-surface)",
                "text": "var(--auto-text)",
                "text_muted": "var(--auto-text-muted)",
                "navbar": "var(--auto-navbar)",
                "sidebar": "var(--auto-sidebar)",
                "border": "var(--auto-border)"
            },
            "css_variables": {
                "--primary-color": "#007bff",
                "--text-color": "var(--auto-text)",
                "--bg-color": "var(--auto-bg)",
                "--navbar-bg": "var(--auto-navbar)",
                "--sidebar-bg": "var(--auto-sidebar)",
                "--border-color": "var(--auto-border)"
            },
            "preview_components": {
                "navbar_bg": "linear-gradient(45deg, #ffffff 50%, #232631 50%)",
                "navbar_text": "linear-gradient(45deg, #212529 50%, #ffffff 50%)",
                "sidebar_bg": "linear-gradient(45deg, #f8f9fa 50%, #1a1d29 50%)",
                "sidebar_text": "linear-gradient(45deg, #495057 50%, #ffffff 50%)",
                "main_bg": "linear-gradient(45deg, #ffffff 50%, #1a1d29 50%)",
                "main_text": "linear-gradient(45deg, #212529 50%, #ffffff 50%)",
                "card_bg": "linear-gradient(45deg, #ffffff 50%, #232631 50%)",
                "card_border": "linear-gradient(45deg, #dee2e6 50%, #2d3748 50%)",
                "button_primary": "#007bff",
                "button_primary_text": "#ffffff"
            }
        }
    ]


def get_custom_themes_preview():
    """
    Obtiene datos de preview para temas personalizados incluyendo desk themes
    """
    custom_themes = []

    try:
        # Importar user_extension para obtener temas de desk
        from .user_extension import get_available_themes

        available_themes = get_available_themes()

        for theme_info in available_themes:
            theme_name = theme_info.get('name')
            if theme_name:
                # Crear preview data para tema de desk
                preview_data = create_desk_theme_preview(theme_info)
                if preview_data:
                    custom_themes.append(preview_data)
     
    except Exception as e:
        frappe.log_error(f"Error getting custom themes preview: {str(e)}", "Frappe Themes Preview API")

    return custom_themes


def create_desk_theme_preview(theme_info):
    """
    Crea datos de preview para un tema de desk desde theme_info
    """
    try:
        theme_name = theme_info.get('name', '')
        css_content = theme_info.get('css_content', '')

        # Extraer colores del CSS content
        extracted_colors = extract_colors_from_css(css_content)
        css_variables = extract_css_variables(css_content)
        preview_components = generate_preview_components(extracted_colors)

        return {
            "name": theme_name.lower(),
            "label": theme_info.get('label', theme_name),
            "info": theme_info.get('info', f"Desk theme: {theme_name}"),
            "is_custom": True,
            "is_desk_theme": True,
            "css_content_preview": css_content[:500] if css_content else "",
            "preview_colors": extracted_colors,
            "css_variables": css_variables,
            "preview_components": preview_components
        }

    except Exception as e:
        theme_name_safe = theme_info.get('name', 'unknown')
        frappe.log_error(f"Desk theme preview error {theme_name_safe}: {str(e)}",
                         "Theme Preview API")
        return None


def get_single_theme_preview(theme_name):
    """
    Obtiene datos de preview para un tema específico
    """
    try:
        theme_name_lower = theme_name.lower()

        # Verificar si es un tema por defecto
        default_themes = get_default_themes_preview()
        for theme in default_themes:
            if theme['name'] == theme_name_lower:
                return theme

        # Buscar tema personalizado en la base de datos
        try:
            # Buscar por nombre del tema
            theme_docs = frappe.get_all(
                "Website Theme",
                fields=["name", "theme", "theme_url", "disabled"],
                filters={"disabled": 0}
            )

            theme_doc = None
            for doc in theme_docs:
                if doc.get('theme', '').lower() == theme_name_lower:
                    theme_doc = frappe.get_doc("Website Theme", doc.name)
                    break

            if not theme_doc:
                return None
 
        except Exception:
            return None

        # Extraer datos del tema personalizado
        css_content = ""
        theme_url = theme_doc.get("theme_url")

        if theme_url:
            css_content = fetch_css_content(theme_url)

        # Extraer colores y variables del CSS
        extracted_colors = extract_colors_from_css(css_content)
        css_variables = extract_css_variables(css_content)
        preview_components = generate_preview_components(extracted_colors)

        return {
            "name": theme_name_lower,
            "label": theme_doc.get("theme") or theme_name,
            "info": f"Custom theme: {theme_doc.get('theme') or theme_name}",
            "is_custom": True,
            "is_desk_theme": True,  # Asumimos que es para desk
            "theme_url": theme_url,
            "css_content_preview": css_content[:500] if css_content else "",  # Solo un preview
            "preview_colors": extracted_colors,
            "css_variables": css_variables,
            "preview_components": preview_components
        }

    except Exception as e:
        frappe.log_error(f"Error getting preview for theme {theme_name}: {str(e)}", "Frappe Themes Preview API")
        return None


def fetch_css_content(theme_url):
    """
    Descarga el contenido CSS de una URL de manera segura
    """
    try:
        # Si es una URL relativa, convertirla a absoluta
        if theme_url.startswith('/'):
            base_url = frappe.utils.get_url()
            theme_url = urljoin(base_url, theme_url)

        # Usar requests con timeout y manejo de errores
        response = requests.get(theme_url, timeout=10, verify=False)
        response.raise_for_status()

        return response.text

    except Exception as e:
        frappe.log_error(f"Error fetching CSS from {theme_url}: {str(e)}", "Frappe Themes Preview API")
        return ""


def extract_colors_from_css(css_content):
    """
    Extrae colores principales del contenido CSS usando patrones inteligentes
    """
    # Colores por defecto
    colors = {
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
    }

    if not css_content:
        return colors

    try:
        # Patrones más específicos para encontrar colores
        color_patterns = {
            "primary": [
                r'--primary[^:]*:\s*([^;;\n]+)',
                r'\.btn-primary[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)',
                r'\.primary[^{]*{[^}]*color[^:]*:\s*([^;;\n]+)',
                r'\.text-primary[^{]*{[^}]*color[^:]*:\s*([^;;\n]+)'
            ],
            "background": [
                r'--bg[^:]*:\s*([^;;\n]+)',
                r'body[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)',
                r'\.bg-light[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)',
                r'html[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)'
            ],
            "text": [
                r'--text[^:]*:\s*([^;;\n]+)',
                r'body[^{]*{[^}]*color[^:]*:\s*([^;;\n]+)',
                r'\.text-dark[^{]*{[^}]*color[^:]*:\s*([^;;\n]+)'
            ],
            "navbar": [
                r'\.navbar[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)',
                r'--navbar-bg[^:]*:\s*([^;;\n]+)',
                r'\.navbar-light[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)'
            ],
            "sidebar": [
                r'\.sidebar[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)',
                r'--sidebar-bg[^:]*:\s*([^;;\n]+)',
                r'\.layout-side-section[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)'
            ],
            "secondary": [
                r'--secondary[^:]*:\s*([^;;\n]+)',
                r'\.btn-secondary[^{]*{[^}]*background[^:]*:\s*([^;;\n]+)',
                r'\.text-muted[^{]*{[^}]*color[^:]*:\s*([^;;\n]+)'
            ]
        }

        # Buscar colores usando los patrones
        for color_name, patterns in color_patterns.items():
            for pattern in patterns:
                matches = re.findall(pattern, css_content, re.IGNORECASE | re.DOTALL)
                if matches:
                    color_value = matches[0].strip()
                    # Limpiar y validar el valor del color
                    clean_color = clean_color_value(color_value)
                    if clean_color:
                        colors[color_name] = clean_color
                        break

        # Extraer colores adicionales de variables CSS
        css_vars = extract_css_variables(css_content)
        map_css_variables_to_colors(css_vars, colors)

    except Exception as e:
        frappe.log_error(f"Error extracting colors from CSS: {str(e)}", "Frappe Themes Preview API")

    return colors


def clean_color_value(color_value):
    """
    Limpia y valida un valor de color CSS
    """
    if not color_value:
        return None

    # Limpiar espacios y caracteres no deseados
    color_value = color_value.strip().rstrip(';')

    # Ignorar valores que son variables CSS o funciones complejas
    if color_value.startswith('var(') or color_value.startswith('calc('):
        return None

    # Validar formatos de color comunes
    color_patterns = [
        r'^#[0-9a-fA-F]{3}$',  # #RGB
        r'^#[0-9a-fA-F]{6}$',  # #RRGGBB
        r'^rgb\([^)]+\)$',     # rgb()
        r'^rgba\([^)]+\)$',    # rgba()
        r'^hsl\([^)]+\)$',     # hsl()
        r'^hsla\([^)]+\)$',    # hsla()
    ]

    # Nombres de colores CSS válidos
    css_color_names = {
        'white', 'black', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta',
        'silver', 'gray', 'maroon', 'olive', 'lime', 'aqua', 'teal', 'navy',
        'fuchsia', 'purple', 'transparent', 'inherit', 'currentcolor'
    }

    # Verificar si es un patrón de color válido
    for pattern in color_patterns:
        if re.match(pattern, color_value, re.IGNORECASE):
            return color_value
    
    # Verificar si es un nombre de color CSS
    if color_value.lower() in css_color_names:
        return color_value

    return None


def extract_css_variables(css_content):
    """
    Extrae variables CSS del contenido
    """
    variables = {}

    if not css_content:
        return variables

    try:
        # Buscar variables CSS (--variable-name: value)
        pattern = r'--([^:]+):\s*([^;;\n]+)'
        matches = re.findall(pattern, css_content, re.IGNORECASE)

        for var_name, var_value in matches:
            clean_name = f"--{var_name.strip()}"
            clean_value = var_value.strip().rstrip(';')

            # Validar que el valor no esté vacío
            if clean_value and not clean_value.isspace():
                variables[clean_name] = clean_value

    except Exception as e:
        frappe.log_error(f"Error extracting CSS variables: {str(e)}", "Frappe Themes Preview API")

    return variables


def map_css_variables_to_colors(css_vars, colors):
    """
    Mapea variables CSS a colores conocidos
    """
    # Mapeo de variables CSS comunes a nombres de colores
    var_mappings = {
        'primary': ['--primary', '--primary-color', '--color-primary'],
        'secondary': ['--secondary', '--secondary-color', '--color-secondary'],
        'background': ['--bg', '--background', '--bg-color', '--background-color'],
        'text': ['--text', '--text-color', '--color-text', '--foreground'],
        'navbar': ['--navbar', '--navbar-bg', '--header-bg'],
        'sidebar': ['--sidebar', '--sidebar-bg', '--menu-bg']
    }

    for color_name, var_names in var_mappings.items():
        for var_name in var_names:
            if var_name in css_vars:
                clean_color = clean_color_value(css_vars[var_name])
                if clean_color:
                    colors[color_name] = clean_color
                    break


def generate_preview_components(colors):
    """
    Genera colores específicos para componentes del preview
    """
    return {
        "navbar_bg": colors.get("navbar", colors.get("surface", "#f8f9fa")),
        "navbar_text": colors.get("text", "#212529"),
        "sidebar_bg": colors.get("sidebar", colors.get("surface", "#f8f9fa")),
        "sidebar_text": colors.get("text", "#495057"),
        "main_bg": colors.get("background", "#ffffff"),
        "main_text": colors.get("text", "#212529"),
        "card_bg": colors.get("surface", colors.get("background", "#ffffff")),
        "card_border": colors.get("border", "#dee2e6"),
        "button_primary": colors.get("primary", "#007bff"),
        "button_primary_text": "#ffffff"
    }


@frappe.whitelist()
def validate_theme_preview_api():
    """
    Endpoint para validar que la API de preview funciona correctamente
    """
    try:
        # Probar obtener todos los temas
        all_themes = get_theme_preview_data()

        # Probar obtener un tema específico
        light_theme = get_theme_preview_data("light")

        return {
            "status": "success",
            "message": "Theme Preview API is working correctly",
            "tests": {
                "all_themes_count": len(all_themes.get("themes", [])),
                "light_theme_found": light_theme is not None,
                "api_endpoints": [
                    "get_theme_preview_data",
                    "get_single_theme_preview", 
                    "validate_theme_preview_api"
                ]
            }
        }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Theme Preview API validation failed: {str(e)}"
        }
