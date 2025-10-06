import os
import shutil
import frappe
from frappe.utils import get_site_path


def install_themes_to_app(target_app_path):
    """
    Instala los temas de business_theme_v14 en otra aplicación de Frappe.
    
    Args:
        target_app_path (str): Ruta de la aplicación de destino
    """
    source_themes_path = frappe.get_app_path("business_theme_v14", "business_theme_v14", "website_theme")
    target_themes_path = os.path.join(target_app_path, "website_theme")
    
    if not os.path.exists(source_themes_path):
        frappe.throw(f"No se encontró la carpeta de temas en: {source_themes_path}")
    
    # Crear directorio de destino si no existe
    os.makedirs(target_themes_path, exist_ok=True)
    
    # Copiar cada tema
    for theme_name in os.listdir(source_themes_path):
        theme_source = os.path.join(source_themes_path, theme_name)
        if os.path.isdir(theme_source) and theme_name not in ['__pycache__']:
            theme_target = os.path.join(target_themes_path, theme_name)
            
            # Copiar el directorio completo del tema
            if os.path.exists(theme_target):
                shutil.rmtree(theme_target)
            shutil.copytree(theme_source, theme_target)
            
            frappe.msgprint(f"Tema '{theme_name}' copiado exitosamente a {theme_target}")


def update_target_app_hooks(target_app_name, theme_names):
    """
    Actualiza el hooks.py de la aplicación objetivo para incluir los temas.
    
    Args:
        target_app_name (str): Nombre de la aplicación objetivo
        theme_names (list): Lista de nombres de temas a agregar
    """
    target_hooks_path = frappe.get_app_path(target_app_name, "hooks.py")
    
    if not os.path.exists(target_hooks_path):
        frappe.throw(f"No se encontró hooks.py en: {target_hooks_path}")
    
    # Leer el contenido actual
    with open(target_hooks_path, 'r') as f:
        content = f.read()
    
    # Agregar fixtures si no existen
    fixtures_section = f'''
# Website Theme Fixtures
# ----------------------
fixtures = [
    {{
        "doctype": "Website Theme",
        "filters": [
            [
                "name", "in", {theme_names}
            ]
        ]
    }}
]
'''
    
    if "fixtures = [" not in content:
        content += fixtures_section
        
        with open(target_hooks_path, 'w') as f:
            f.write(content)
        
        frappe.msgprint(f"Hooks actualizados en {target_app_name}")
    else:
        frappe.msgprint("Los fixtures ya existen en el hooks.py de la aplicación objetivo")


def get_available_themes():
    """
    Retorna una lista de temas disponibles en business_theme_v14.
    
    Returns:
        list: Lista de nombres de temas disponibles
    """
    themes_path = frappe.get_app_path("business_theme_v14", "business_theme_v14", "website_theme")
    themes = []
    
    if os.path.exists(themes_path):
        for item in os.listdir(themes_path):
            item_path = os.path.join(themes_path, item)
            if os.path.isdir(item_path) and item not in ['__pycache__']:
                # Verificar si tiene el archivo JSON del tema
                json_file = os.path.join(item_path, f"{item}.json")
                if os.path.exists(json_file):
                    themes.append(item)
    
    return themes


@frappe.whitelist()
def install_themes_via_ui(target_app):
    """
    Función para instalar temas desde la UI de Frappe.
    
    Args:
        target_app (str): Nombre de la aplicación objetivo
    """
    try:
        available_themes = get_available_themes()
        
        if not available_themes:
            frappe.throw("No se encontraron temas disponibles")
        
        target_app_path = frappe.get_app_path(target_app)
        install_themes_to_app(target_app_path)
        update_target_app_hooks(target_app, available_themes)
        
        frappe.msgprint(f"Temas instalados exitosamente en {target_app}: {', '.join(available_themes)}")
        
    except Exception as e:
        frappe.throw(f"Error al instalar temas: {str(e)}")