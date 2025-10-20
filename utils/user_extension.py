#!/usr/bin/env python3
"""
Frappe Themes Submodule - User Extension
Este archivo se copia a la app durante la instalación para extender la funcionalidad del usuario
"""

import frappe


@frappe.whitelist()
def get_available_themes():
    """
    Obtiene solo los temas de desk disponibles desde archivos JSON locales.
    No incluye los website themes de la base de datos.
    """
    frappe.logger().info("[Frappe Themes] get_available_themes() called - desk themes only")
    themes = []
    
    # Solo buscar temas de desk desde archivos locales
    themes.extend(load_desk_themes_from_files())
    
    # Log para debugging
    if themes:
        frappe.logger().info(f"Frappe Themes Submodule: Found {len(themes)} desk themes")
    else:
        frappe.logger().info("[Frappe Themes] No desk themes found")
    
    return themes


def load_desk_themes_from_files():
    """
    Carga temas de desk desde archivos JSON locales en el directorio website_theme/
    Busca archivos CSS separados (.css) y hace fallback al JSON si no existen
    """
    import os
    import json
    
    themes = []
    
    try:
        # Obtener la ruta del directorio actual (donde está user_extension.py)
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Los temas están en website_theme/ relativo a este archivo
        themes_dir = os.path.join(current_dir, "website_theme")
        
        frappe.logger().info(f"[Frappe Themes] Looking for desk themes in: {themes_dir}")
        
        if os.path.exists(themes_dir):
            for theme_folder in os.listdir(themes_dir):
                theme_path = os.path.join(themes_dir, theme_folder)
                
                if os.path.isdir(theme_path) and theme_folder not in ["__pycache__"]:
                    json_file = os.path.join(theme_path, f"{theme_folder}.json")
                    css_file = os.path.join(theme_path, f"{theme_folder}.css")
                    
                    if os.path.exists(json_file):
                        try:
                            # 1. Leer metadata del JSON
                            with open(json_file, 'r', encoding='utf-8') as f:
                                theme_data = json.load(f)
                            
                            theme_name = theme_data.get("theme", theme_folder).lower()
                            
                            # Evitar temas por defecto
                            if theme_name not in ["light", "dark", "automatic", ""]:
                                # 2. Intentar leer CSS desde archivo separado
                                css_content = ""
                                css_source = ""
                                
                                if os.path.exists(css_file):
                                    # Prioridad 1: Leer desde archivo .css
                                    with open(css_file, 'r', encoding='utf-8') as f:
                                        css_content = f.read()
                                    css_source = "external CSS file"
                                    frappe.logger().info(f"[Frappe Themes] ✓ Loaded CSS from file: {css_file}")
                                else:
                                    # Prioridad 2: Fallback al CSS en JSON
                                    css_content = theme_data.get("css_content", "")
                                    css_source = "JSON css_content"
                                    frappe.logger().info(f"[Frappe Themes] ⚠ No CSS file found, using JSON for: {theme_folder}")
                                
                                # 3. Solo cargar temas que tengan CSS (de cualquier fuente)
                                if css_content:
                                    new_theme = {
                                        "name": theme_name.replace(" ", "_").lower(),
                                        "label": theme_data.get("theme", theme_folder),
                                        "info": f"Desk theme: {theme_data.get('theme', theme_folder)} (from {css_source})",
                                        "css_content": css_content,
                                        "theme_url": theme_data.get("theme_url"),
                                        "is_desk_theme": True
                                    }
                                    
                                    frappe.logger().info(f"[Frappe Themes] ✓ Loaded desk theme: {new_theme['name']} from {css_source}")
                                    themes.append(new_theme)
                                else:
                                    frappe.logger().info(f"[Frappe Themes] ✗ Skipped theme without CSS: {theme_name}")
                        
                        except Exception as e:
                            frappe.logger().error(f"[Frappe Themes] ✗ Error loading theme {theme_folder}: {str(e)}")
        else:
            frappe.logger().info(f"[Frappe Themes] Themes directory not found: {themes_dir}")
    
    except Exception as e:
        frappe.log_error(f"Error loading desk themes from files: {str(e)}", "Frappe Themes Submodule")
    
    return themes


@frappe.whitelist()
def save_desk_theme_preference(theme_name):
    """
    Guarda la preferencia de tema de desk del usuario actual
    """
    try:
        user = frappe.session.user
        if user and user != "Guest":
            # Usar DefaultValue para guardar la preferencia del usuario
            frappe.db.set_default("desk_theme", theme_name, user)
            frappe.logger().info(f"[Frappe Themes] Saved desk theme '{theme_name}' for user {user}")
            return {"status": "success", "message": "Theme preference saved"}
        else:
            frappe.logger().warning("[Frappe Themes] Cannot save theme for guest user")
            return {"status": "error", "message": "Guest user cannot save preferences"}
            
    except Exception as e:
        frappe.logger().error(f"[Frappe Themes] Error saving theme preference: {str(e)}")
        return {"status": "error", "message": str(e)}


@frappe.whitelist()
def get_desk_theme_preference():
    """
    Obtiene la preferencia de tema de desk del usuario actual
    """
    try:
        user = frappe.session.user
        if user and user != "Guest":
            # Obtener desde DefaultValue
            theme = frappe.db.get_default("desk_theme", user)
            if theme:
                return {"status": "success", "theme": theme}
                        
        return {"status": "success", "theme": "light"}  # tema por defecto
            
    except Exception as e:
        frappe.logger().error(f"[Frappe Themes] Error getting theme preference: {str(e)}")
        return {"status": "error", "message": str(e), "theme": "light"}


