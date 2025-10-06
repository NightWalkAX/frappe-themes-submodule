# Frappe Themes Submodule

Un sub-repositorio independiente que contiene temas de website para aplicaciones Frappe. Diseñado para ser usado como submódulo Git en cualquier proyecto Frappe.

## 🚀 Características

- ✨ **Temas Listos**: Temas "Dickface" y "Dickhead" con estilos Bootstrap personalizados
- 🔧 **Instalación Automática**: Script que copia temas y configura fixtures automáticamente
- 📦 **Sin Dependencias**: No requiere instalación de aplicaciones adicionales
- 🎯 **Plug & Play**: Funciona desde cualquier directorio frappe-bench
- 📱 **Responsive**: Diseños adaptables y modernos

## 📁 Estructura del Repositorio

```
frappe-themes-submodule/
├── themes/                    # Temas disponibles
│   ├── dickface/
│   │   ├── dickface.json     # Definición del tema
│   │   └── __init__.py
│   └── dickhead/
│       ├── dickhead.json     # Definición del tema
│       └── __init__.py
├── fixtures/
│   └── website_theme.json    # Fixtures para instalación automática
├── install.sh               # Script de instalación principal
└── README.md               # Este archivo
```

## 🛠️ Instalación

### Opción 1: Como Submódulo Git (Recomendado)

```bash
# 1. Agregar como submódulo en tu proyecto
cd /path/to/frappe-bench
git submodule add [URL_DE_ESTE_REPO] themes-submodule

# 2. Instalar temas en tu aplicación
./themes-submodule/install.sh mi_app

# 3. Migrar para aplicar cambios
bench --site mi-sitio migrate
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

### ¿Qué hace el script?

1. **Verifica el entorno**: Confirma que estás en un directorio frappe-bench válido
2. **Valida la app destino**: Verifica que la aplicación existe en `apps/`
3. **Copia temas**: Copia todos los temas a `apps/tu_app/tu_app/website_theme/`
4. **Instala fixtures**: Copia `website_theme.json` a `apps/tu_app/tu_app/fixtures/`
5. **Actualiza hooks**: Agrega la configuración de fixtures al `hooks.py`
6. **Verifica instalación**: Confirma que todo se copió correctamente

## 📋 Requisitos

- ✅ Frappe Framework v13+ 
- ✅ Aplicación Frappe válida como destino
- ✅ Permisos de escritura en el directorio `apps/`
- ✅ Bash shell (Linux/macOS/WSL)

## 🎨 Temas Incluidos

### Dickface Theme
- Botones redondeados sin gradientes ni sombras
- Tipografía con pesos: 300-800
- Estilos Bootstrap personalizados

### Dickhead Theme  
- Mismas características que Dickface
- Variación de colores y espaciado

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

### Los temas no aparecen en la UI

```bash
# 1. Verificar migración
bench --site mi-sitio migrate --verbose

# 2. Reinstalar fixtures
bench --site mi-sitio install-fixtures

# 3. Limpiar caché
bench --site mi-sitio clear-cache
```

### Error: "No se encontró hooks.py"

- Verifica que la aplicación de destino existe
- Confirma que tienes permisos de escritura
- Asegúrate de estar en el directorio correcto

### Error: "Este script debe ejecutarse desde frappe-bench"

```bash
# Verifica tu ubicación
pwd

# Debes estar en un directorio que contenga:
ls -la | grep -E "(apps|sites)"
```

### Los fixtures no se aplican

```bash
# Verificar que el hooks.py fue actualizado
cat apps/mi_app/mi_app/hooks.py | grep -A 10 "Website Theme"

# Forzar reinstalación de fixtures
bench --site mi-sitio install-fixtures --force
```

## 🚀 Uso después de la Instalación

1. **Acceder a los temas:**
   ```
   Setup > Website > Website Theme
   ```

2. **Los temas aparecerán como:**
   - Dickface
   - Dickhead

3. **Seleccionar y configurar:**
   - Haz clic en el tema deseado
   - Ajusta las opciones (botones, sombras, etc.)
   - Guarda los cambios

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
│   ├── website_theme/          # ← Temas instalados aquí
│   │   ├── dickface/
│   │   └── dickhead/
│   ├── fixtures/               # ← Fixtures copiados aquí
│   │   └── website_theme.json
│   └── hooks.py               # ← Actualizado automáticamente
```

## 🤝 Contribuir

1. Fork este repositorio
2. Crea una rama: `git checkout -b nueva-feature`
3. Haz tus cambios
4. Commit: `git commit -am 'Agregar nueva feature'`
5. Push: `git push origin nueva-feature`
6. Crea un Pull Request

## 📄 Licencia

MIT License - Úsalo libremente en tus proyectos.

## 🆘 Soporte

- **Issues**: [GitHub Issues del repositorio]
- **Documentación**: [Wiki del proyecto]
- **Community**: [Foro de Frappe]

---

**💡 Tip**: Mantén este repositorio como submódulo para recibir actualizaciones automáticas de nuevos temas y mejoras.