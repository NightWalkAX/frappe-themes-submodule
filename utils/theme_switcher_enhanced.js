frappe.provide("frappe.ui");

frappe.ui.ThemeSwitcher = class ThemeSwitcher {
	constructor() {
		// Prevent multiple instances
		if (frappe.ui._theme_switcher_instance) {
			console.log("[Frappe Themes] ThemeSwitcher already exists, returning existing instance");
			return frappe.ui._theme_switcher_instance;
		}
		
		console.log("[Frappe Themes] Creating new ThemeSwitcher instance");
		frappe.ui._theme_switcher_instance = this;
		
		this.inject_preview_styles();
		this.setup_dialog();
		this.refresh();
	}
	
	inject_preview_styles() {
		// Inject CSS styles for theme previews if not already present
		if (document.getElementById('theme-preview-styles')) return;
		
		const styles = `
			<style id="theme-preview-styles">
				.theme-preview-container {
					width: 120px;
					height: 80px;
					border: 2px solid var(--border-color);
					border-radius: 8px;
					overflow: hidden;
					position: relative;
					margin: 0 auto 10px;
					cursor: pointer;
					transition: transform 0.2s ease, box-shadow 0.2s ease;
				}
				
				.theme-preview-container:hover {
					transform: scale(1.05);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				}
				
				.preview-header {
					position: absolute;
					top: 4px;
					right: 4px;
					z-index: 10;
					display: flex;
					gap: 4px;
				}
				
				.preview-check {
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: var(--green-500);
					display: flex;
					align-items: center;
					justify-content: center;
					color: white;
					font-size: 10px;
					opacity: 0;
					transition: opacity 0.2s ease;
				}
				
				.selected .preview-check {
					opacity: 1;
				}
				
				.custom-badge {
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: var(--orange-500);
					display: flex;
					align-items: center;
					justify-content: center;
					color: white;
					font-size: 10px;
				}
				
				.preview-navbar {
					height: 16px;
					width: 100%;
					display: flex;
					align-items: center;
					padding: 2px 4px;
					box-sizing: border-box;
				}
				
				.preview-nav-item {
					width: 12px;
					height: 8px;
					background: rgba(255, 255, 255, 0.3);
					border-radius: 2px;
					margin-right: 2px;
				}
				
				.preview-nav-item.active {
					background: rgba(255, 255, 255, 0.8);
				}
				
				.preview-content {
					display: flex;
					height: 64px;
				}
				
				.preview-sidebar {
					width: 36px;
					display: flex;
					flex-direction: column;
					padding: 4px;
					box-sizing: border-box;
				}
				
				.sidebar-item {
					height: 6px;
					background: rgba(255, 255, 255, 0.2);
					border-radius: 1px;
					margin-bottom: 2px;
				}
				
				.sidebar-item.active {
					background: rgba(255, 255, 255, 0.6);
				}
				
				.preview-main {
					flex: 1;
					padding: 4px;
					box-sizing: border-box;
				}
				
				.preview-card {
					width: 100%;
					height: 100%;
					border-radius: 3px;
					border: 1px solid;
					padding: 3px;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
				}
				
				.card-header {
					height: 8px;
					background: rgba(0, 0, 0, 0.1);
					border-radius: 1px;
					margin-bottom: 2px;
				}
				
				.card-body {
					flex: 1;
					display: flex;
					align-items: flex-end;
					justify-content: flex-end;
				}
				
				.preview-button {
					width: 20px;
					height: 8px;
					border-radius: 2px;
				}
				
				.theme-title {
					font-size: 12px;
					font-weight: 500;
					text-align: center;
					margin: 5px 0;
				}
				
				.applying-theme {
					opacity: 0.7;
					pointer-events: none;
				}
				
				.applying-theme .theme-preview-container {
					border-color: var(--blue-500);
					animation: pulse 1.5s ease-in-out infinite;
				}
				
				@keyframes pulse {
					0%, 100% { opacity: 0.7; }
					50% { opacity: 1; }
				}
			</style>
		`;
		
		document.head.insertAdjacentHTML('beforeend', styles);
	}
	
	static getInstance() {
		if (!frappe.ui._theme_switcher_instance) {
			new frappe.ui.ThemeSwitcher();
		}
		return frappe.ui._theme_switcher_instance;
	}

	setup_dialog() {
		this.dialog = new frappe.ui.Dialog({
			title: __("Switch Theme"),
		});
		this.body = $(`<div class="theme-grid"></div>`).appendTo(this.dialog.$body);
		this.bind_events();
	}

	bind_events() {
		this.dialog.$wrapper.on("keydown", (e) => {
			if (!this.themes) return;

			const key = frappe.ui.keys.get_key(e);
			let increment_by;

			if (key === "right") {
				increment_by = 1;
			} else if (key === "left") {
				increment_by = -1;
			} else if (e.keyCode === 13) {
				// keycode 13 is for 'enter'
				this.hide();
			} else {
				return;
			}

			const current_index = this.themes.findIndex((theme) => {
				return theme.name === this.current_theme;
			});

			const new_theme = this.themes[current_index + increment_by];
			if (!new_theme) return;

			new_theme.$html.click();
			return false;
		});
	}

	refresh() {
		console.log("[Frappe Themes] Starting refresh process...");
		
		// Cargar tema actual (incluir temas personalizados)
		this.load_current_theme();
		
		this.fetch_themes().then((themes) => {
			console.log("[Frappe Themes] Themes fetched successfully:", themes);
			this.render();
			// Aplicar el tema actual después de cargar todos los temas disponibles
			this.apply_current_theme();
			console.log("[Frappe Themes] Refresh process completed");
		}).catch((error) => {
			console.error("[Frappe Themes] Error during refresh:", error);
			// Asegurar que al menos se rendericen los temas por defecto
			this.themes = [
				{
					name: "light",
					label: __("Frappe Light"),
					info: __("Light Theme"),
				},
				{
					name: "dark",
					label: __("Timeless Night"),
					info: __("Dark Theme"),
				},
				{
					name: "automatic",
					label: __("Automatic"),
					info: __("Uses system's theme to switch between light and dark mode"),
				},
			];
			console.log("[Frappe Themes] Fallback: rendering default themes");
			this.render();
		});
	}
	
	load_current_theme() {
		// Intentar cargar desde el servidor primero
		this.load_theme_from_server().then((server_theme) => {
			if (server_theme) {
				this.current_theme = server_theme;
			} else {
				// Fallback a métodos locales
				this.load_theme_locally();
			}
		}).catch(() => {
			this.load_theme_locally();
		});
	}
	
	load_theme_from_server() {
		const app_methods = [];
		
		// Intentar obtener desde frappe.boot.installed_apps si está disponible
		if (frappe.boot?.installed_apps && Array.isArray(frappe.boot.installed_apps)) {
			frappe.boot.installed_apps.forEach(app => {
				app_methods.push(`${app}.user_extension.get_desk_theme_preference`);
			});
		} else {
			// Fallback: probar apps conocidas
			const known_apps = ['doctyped_cheatsheets', 'erpnext', 'hrms', 'lms', 'wiki'];
			known_apps.forEach(app => {
				app_methods.push(`${app}.user_extension.get_desk_theme_preference`);
			});
		}
		
		return this.try_load_methods(app_methods, 0);
	}
	
	try_load_methods(methods, index) {
		return new Promise((resolve) => {
			if (index >= methods.length) {
				resolve(null);
				return;
			}
			
			const method = methods[index];
			frappe.xcall(method).then((result) => {
				if (result && result.status === "success" && result.theme) {
					console.log(`[Frappe Themes] Loaded saved theme from server: ${result.theme}`);
					resolve(result.theme);
				} else {
					this.try_load_methods(methods, index + 1).then(resolve);
				}
			}).catch(() => {
				this.try_load_methods(methods, index + 1).then(resolve);
			});
		});
	}
	
	load_theme_locally() {
		// Verificar si hay un tema personalizado guardado localmente
		let custom_theme = document.documentElement.getAttribute("data-custom-theme");
		
		// Si no hay tema en el DOM, intentar cargar desde localStorage
		if (!custom_theme) {
			try {
				custom_theme = localStorage.getItem("frappe_custom_desk_theme");
			} catch (error) {
				console.log("Could not access localStorage:", error);
			}
		}
		
		if (custom_theme && custom_theme !== "light" && custom_theme !== "dark" && custom_theme !== "automatic") {
			this.current_theme = custom_theme;
		} else {
			this.current_theme = document.documentElement.getAttribute("data-theme-mode") || "light";
		}
	}
	
	apply_current_theme() {
		// Aplicar el tema actual al cargar la página
		if (this.current_theme && this.current_theme !== "light" && this.current_theme !== "dark" && this.current_theme !== "automatic") {
			const theme_obj = this.themes.find(t => t.name === this.current_theme);
			if (theme_obj && theme_obj.is_custom) {
				console.log(`[Frappe Themes] Applying saved theme on page load: ${this.current_theme}`);
				this.apply_custom_desk_theme(theme_obj);
			} else {
				console.log(`[Frappe Themes] Saved theme '${this.current_theme}' not found in available themes`);
			}
		}
	}

	fetch_themes() {
		// Usar directamente user_extension.get_available_themes() para desk themes
		console.log("[Frappe Themes] Fetching desk themes directly...");
		
		return this.fetch_desk_themes_direct();
	}

	fetch_desk_themes_direct() {
		console.log("[Frappe Themes] Fetching desk themes directly using user_extension...");
		
		const desk_methods = [];
		
		// Intentar obtener desde frappe.boot.installed_apps si está disponible
		if (frappe.boot?.installed_apps && Array.isArray(frappe.boot.installed_apps)) {
			frappe.boot.installed_apps.forEach(app => {
				desk_methods.push(`${app}.user_extension.get_available_themes`);
			});
		} else {
			// Fallback: probar apps conocidas
			const known_apps = ['doctyped_cheatsheets', 'erpnext', 'hrms', 'lms', 'wiki'];
			known_apps.forEach(app => {
				desk_methods.push(`${app}.user_extension.get_available_themes`);
			});
		}
		
		return this.try_desk_theme_methods(desk_methods, 0);
	}

	try_desk_theme_methods(methods, index) {
		return new Promise((resolve, reject) => {
			if (index >= methods.length) {
				console.log("[Frappe Themes] No desk themes found, using defaults only");
				resolve([]);
				return;
			}
			
			const method = methods[index];
			console.log(`[Frappe Themes] Trying desk method ${index + 1}/${methods.length}: ${method}`);
			
			frappe.xcall(method)
				.then((desk_themes) => {
					console.log(`[Frappe Themes] Success with method: ${method}`, desk_themes);
					
					if (desk_themes && desk_themes.length > 0) {
						// Procesar directamente los desk themes
						this.process_desk_themes(desk_themes);
						resolve(this.themes);
					} else {
						console.log(`[Frappe Themes] Method ${method} returned no themes, trying next...`);
						this.try_desk_theme_methods(methods, index + 1)
							.then(resolve)
							.catch(reject);
					}
				})
				.catch((error) => {
					console.log(`[Frappe Themes] Method ${method} failed:`, error.message);
					this.try_desk_theme_methods(methods, index + 1)
						.then(resolve)
						.catch(reject);
				});
		});
	}

	process_desk_themes(desk_themes) {
		console.log(`[Frappe Themes] Processing ${desk_themes.length} desk themes`);
		
		// Inicializar con temas por defecto
		this.themes = [
			{
				name: "light",
				label: __("Frappe Light"),
				info: __("Light Theme"),
			},
			{
				name: "dark",
				label: __("Timeless Night"),
				info: __("Dark Theme"),
			},
			{
				name: "automatic",
				label: __("Automatic"),
				info: __("Uses system's theme to switch between light and dark mode"),
			}
		];
		
		// Agregar desk themes
		desk_themes.forEach((theme, index) => {
			console.log(`[Frappe Themes] Adding desk theme ${index + 1}: ${theme.name}`, {
				has_preview_colors: !!theme.preview_colors,
				has_preview_components: !!theme.preview_components,
				has_css_variables: !!theme.css_variables
			});
			const processedTheme = {
				name: theme.name.toLowerCase(),
				label: theme.label || frappe.utils.to_title_case(theme.name),
				info: theme.info || `${theme.label || theme.name} Custom Theme`,
				is_custom: true,
				is_desk_theme: true,
				css_content: theme.css_content,
				theme_url: theme.theme_url || "",
				preview_colors: theme.preview_colors || {},
				preview_components: theme.preview_components || {},
				css_variables: theme.css_variables || {}
			};
			this.themes.push(processedTheme);
		});
		
		console.log(`[Frappe Themes] Processed themes: ${this.themes.length} total (3 default + ${desk_themes.length} desk)`);
	}

	fetch_themes_with_preview_api() {
		console.log("[Frappe Themes] Fetching themes using Submodule Preview API...");
		
		// Lista de métodos a probar (instalados por install.sh)
		const preview_methods = [
			// Métodos en apps que tienen el Theme Preview API instalado
			'doctyped_cheatsheets.theme_preview_api.get_theme_preview_data',
			'erpnext.theme_preview_api.get_theme_preview_data',
			'hrms.theme_preview_api.get_theme_preview_data',
			'wiki.theme_preview_api.get_theme_preview_data',
			'lms.theme_preview_api.get_theme_preview_data',
			'dragon_ball_app.theme_preview_api.get_theme_preview_data',
			'job_cost_automator.theme_preview_api.get_theme_preview_data',
		];
		
		return this.try_preview_methods(preview_methods, 0);
	}

	try_preview_methods(methods, index) {
		return new Promise((resolve, reject) => {
			if (index >= methods.length) {
				reject(new Error("All submodule methods failed"));
				return;
			}
			
			const method = methods[index];
			console.log(`[Frappe Themes] Trying submodule method ${index + 1}/${methods.length}: ${method}`);
			
			frappe.xcall(method)
				.then((response) => {
					console.log(`[Frappe Themes] Success with method: ${method}`, response);
					
					if (response && (response.status === "success" || response.themes)) {
						const themes = response.themes || response;
						console.log(`[Frappe Themes] Successfully loaded ${themes.length} themes with preview data`);
						
						// Inicializar con temas por defecto
						this.themes = [
							{
								name: "light",
								label: __("Frappe Light"),
								info: __("Light Theme"),
							},
							{
								name: "dark",
								label: __("Timeless Night"),
								info: __("Dark Theme"),
							},
							{
								name: "automatic",
								label: __("Automatic"),
								info: __("Uses system's theme to switch between light and dark mode"),
							}
						];
						
						// Agregar solo temas personalizados que NO sean duplicados de los temas por defecto
						const default_theme_names = ["light", "dark", "automatic"];
						const custom_themes = themes.filter(theme => 
							!default_theme_names.includes(theme.name.toLowerCase())
						).map(theme => ({
							name: theme.name.toLowerCase(),
							label: theme.label,
							info: theme.info,
							is_custom: theme.is_custom,
							is_desk_theme: theme.is_desk_theme,
							css_content: theme.css_content || theme.css_content_preview || "",
							theme_url: theme.theme_url,
							preview_colors: theme.preview_colors || {},
							css_variables: theme.css_variables || {},
							preview_components: theme.preview_components || {}
						}));
						
						// Agregar los temas personalizados únicos
						this.themes.push(...custom_themes);
						
						console.log(`[Frappe Themes] Processed themes: ${this.themes.length} total (3 default + ${custom_themes.length} custom)`);
						console.log("[Frappe Themes] Final themes:", this.themes);
						resolve(this.themes);
					} else {
						throw new Error("Invalid response format");
					}
				})
				.catch((error) => {
					console.log(`[Frappe Themes] Method ${method} failed:`, error.message);
					this.try_preview_methods(methods, index + 1)
						.then(resolve)
						.catch(reject);
				});
		});
	}

	fetch_themes_legacy() {
		// Método legacy como fallback
		console.log("[Frappe Themes] Using legacy theme detection...");
		console.log("[Frappe Themes] frappe.boot:", frappe.boot);
		console.log("[Frappe Themes] Installed apps:", frappe.boot?.installed_apps);
		
		const potential_methods = [];
		
		// Métodos conocidos que podríamos probar directamente
		const known_apps = ['doctyped_cheatsheets', 'erpnext', 'hrms', 'lms', 'wiki'];
		
		// Primero intentar desde frappe.boot.installed_apps si está disponible
		if (frappe.boot?.installed_apps && Array.isArray(frappe.boot.installed_apps)) {
			frappe.boot.installed_apps.forEach(app => {
				const method = `${app}.user_extension.get_available_themes`;
				potential_methods.push(method);
				console.log(`[Frappe Themes] Added method from boot: ${method}`);
			});
		} else {
			console.warn("[Frappe Themes] frappe.boot.installed_apps not available, trying known apps");
			// Fallback: probar apps conocidas
			known_apps.forEach(app => {
				const method = `${app}.user_extension.get_available_themes`;
				potential_methods.push(method);
				console.log(`[Frappe Themes] Added known method: ${method}`);
			});
		}
		
		console.log(`[Frappe Themes] Total methods to try: ${potential_methods.length}`);
		return this.try_theme_methods(potential_methods);
	}

	try_theme_methods(methods) {
		console.log(`[Frappe Themes] Trying ${methods.length} methods:`, methods);
		return new Promise((resolve) => {
			let method_index = 0;
			
			const try_next_method = () => {
				if (method_index >= methods.length) {
					// No hay más métodos que probar, devolver temas por defecto
					console.log("[Frappe Themes] All methods exhausted, no custom themes found");
					resolve([]);
					return;
				}
				
				const method = methods[method_index];
				method_index++;
				
				console.log(`[Frappe Themes] Attempting method ${method_index}/${methods.length}: ${method}`);
				
				frappe.xcall(method)
					.then((themes) => {
						console.log(`[Frappe Themes] Success! Method ${method} returned:`, themes);
						resolve(themes || []);
					})
					.catch((error) => {
						console.log(`[Frappe Themes] Method ${method} failed:`, error.message);
						console.log(`[Frappe Themes] Error details:`, error);
						try_next_method();
					});
			};
			
			try_next_method();
		})
		.then((server_themes) => {
				console.log("[Frappe Themes] Processing themes from server:", server_themes);
				
				// Temas por defecto que siempre estarán disponibles
				this.themes = [
					{
						name: "light",
						label: __("Frappe Light"),
						info: __("Light Theme"),
					},
					{
						name: "dark",
						label: __("Timeless Night"),
						info: __("Dark Theme"),
					},
					{
						name: "automatic",
						label: __("Automatic"),
						info: __("Uses system's theme to switch between light and dark mode"),
					},
				];

				// Agregar temas personalizados encontrados (desk Y website themes)
				if (server_themes && server_themes.length > 0) {
					console.log(`[Frappe Themes] Processing ${server_themes.length} server themes`);
					
					const default_theme_names = ["light", "dark", "automatic"];
					const custom_themes = server_themes.filter(theme => 
						!default_theme_names.includes(theme.name.toLowerCase())
					);
					
					console.log(`[Frappe Themes] Found ${custom_themes.length} unique custom themes (filtered out ${server_themes.length - custom_themes.length} duplicates)`);
					
					custom_themes.forEach((theme, index) => {
						console.log(`[Frappe Themes] Processing custom theme ${index + 1}:`, {
							name: theme.name,
							has_preview_colors: !!theme.preview_colors,
							has_preview_components: !!theme.preview_components,
							has_css_variables: !!theme.css_variables
						});
						const newTheme = {
							name: theme.name.toLowerCase(),
							label: theme.label || frappe.utils.to_title_case(theme.name),
							info: theme.info || `${theme.label || theme.name} Custom Theme`,
							is_custom: true,
							css_content: theme.css_content,
							theme_url: theme.theme_url,
							is_desk_theme: theme.is_desk_theme,
							preview_colors: theme.preview_colors || {},
							preview_components: theme.preview_components || {},
							css_variables: theme.css_variables || {}
						};
						console.log(`[Frappe Themes] Added custom theme:`, newTheme.name);
						this.themes.push(newTheme);
					});
				} else {
					console.log("[Frappe Themes] No custom themes found from server");
				}

				console.log(`[Frappe Themes] Final theme list: ${this.themes.length} total (3 default + ${this.themes.length - 3} custom)`);
				console.log("[Frappe Themes] Theme switcher loaded successfully");
				return this.themes;
			})
			.catch((error) => {
				console.log("[Frappe Themes] Could not fetch custom themes from server, using defaults only");
				console.log("[Frappe Themes] Error:", error);
				
				// Fallback a temas por defecto si hay error
				this.themes = [
					{
						name: "light",
						label: __("Frappe Light"),
						info: __("Light Theme"),
					},
					{
						name: "dark",
						label: __("Timeless Night"),
						info: __("Dark Theme"),
					},
					{
						name: "automatic",
						label: __("Automatic"),
						info: __("Uses system's theme to switch between light and dark mode"),
					},
				];
				console.log(`[Frappe Themes] Fallback: Using ${this.themes.length} default themes`);
				return this.themes;
			});
	}

	render() {
		console.log(`[Frappe Themes] Rendering theme switcher with ${this.themes?.length || 0} themes`);
		console.log(`[Frappe Themes] Themes to render:`, this.themes);
		
		// Limpiar contenido previo
		this.body.empty();
		
		if (!this.themes || this.themes.length === 0) {
			console.warn("[Frappe Themes] No themes to render!");
			this.body.append('<div class="text-center p-4"><small>No themes available</small></div>');
			return;
		}
		
		this.themes.forEach((theme, index) => {
			console.log(`[Frappe Themes] Rendering theme ${index + 1}: ${theme.name}`);
			let html = this.get_preview_html(theme);
			html.appendTo(this.body);
			theme.$html = html;
		});
		
		console.log(`[Frappe Themes] Finished rendering ${this.themes.length} themes`);
	}

	get_preview_html(theme) {
		const is_auto_theme = theme.name === "automatic";
		const is_custom_theme = theme.is_custom;
		
		// Obtener colores de preview con fallbacks apropiados
		const preview_colors = this.get_theme_preview_colors(theme);
		
		// Agregar clase especial para temas personalizados
		const custom_class = is_custom_theme ? "custom-theme" : "";
		
		const preview = $(`<div class="${this.current_theme == theme.name ? "selected" : ""} ${custom_class}">
			<div data-theme=${is_auto_theme ? "light" : theme.name}
				data-is-auto-theme="${is_auto_theme}" 
				data-is-custom-theme="${is_custom_theme}" 
				title="${theme.info}">
				<div class="theme-preview-container">
					<div class="preview-header">
						<div class="preview-check" data-theme=${is_auto_theme ? "dark" : theme.name}>
							${frappe.utils.icon("tick", "xs")}
						</div>
						${is_custom_theme ? `<div class="custom-badge">${frappe.utils.icon("star", "xs")}</div>` : ''}
					</div>
					<div class="preview-navbar" style="background: ${preview_colors.navbar_bg} !important; color: ${preview_colors.navbar_text} !important;">
						<div class="preview-nav-item"></div>
						<div class="preview-nav-item active"></div>
					</div>
					<div class="preview-content">
						<div class="preview-sidebar" style="background: ${preview_colors.sidebar_bg} !important; color: ${preview_colors.sidebar_text} !important;">
							<div class="sidebar-item"></div>
							<div class="sidebar-item active"></div>
						</div>
						<div class="preview-main" style="background: ${preview_colors.main_bg} !important; color: ${preview_colors.main_text} !important;">
							<div class="preview-card" style="background: ${preview_colors.card_bg} !important; border-color: ${preview_colors.card_border} !important;">
								<div class="card-header"></div>
								<div class="card-body">
									<div class="preview-button" style="background: ${preview_colors.button_primary} !important; color: ${preview_colors.button_primary_text} !important;"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-3 text-center">
				<h5 class="theme-title">${theme.label}</h5>
				${is_custom_theme ? '<small class="text-muted">Custom Theme</small>' : ''}
				${preview_colors.has_custom_colors ? '<small class="text-success d-block">Enhanced Preview</small>' : ''}
			</div>
		</div>`);

		preview.on("click", () => {
			if (this.current_theme === theme.name) return;

			// Mostrar feedback inmediato visual
			preview.addClass("applying-theme");
			
			this.themes.forEach((th) => {
				th.$html.removeClass("selected");
			});

			preview.addClass("selected");
			
			// Aplicar tema con callback para limpiar estado visual
			this.toggle_theme(theme.name, () => {
				preview.removeClass("applying-theme");
			});
		});

		return preview;
	}

	get_theme_preview_colors(theme) {
		// Debug: Log theme data to see what's available
		console.log(`[Frappe Themes] Preview colors for theme "${theme.name}":`, {
			preview_components: theme.preview_components,
			preview_colors: theme.preview_colors,
			css_variables: theme.css_variables,
			css_content: theme.css_content ? `${theme.css_content.substring(0, 100)}...` : null
		});
		
		// Definir colores por defecto basados en el tipo de tema
		const default_colors = this.get_default_theme_colors(theme);
		
		// Usar datos de la API de Theme Preview si están disponibles
		let api_colors = {};
		
		// Prioridad: preview_components > preview_colors > css_variables > css_content extraction
		if (theme.preview_components && Object.keys(theme.preview_components).length > 0) {
			api_colors = theme.preview_components;
		} else if (theme.preview_colors && Object.keys(theme.preview_colors).length > 0) {
			// Mapear preview_colors de la API a componentes específicos
			const colors = theme.preview_colors;
			api_colors = {
				navbar_bg: colors.navbar || colors.background || colors.primary,
				navbar_text: colors.text,
				sidebar_bg: colors.sidebar || colors.background,
				sidebar_text: colors.text,
				main_bg: colors.background,
				main_text: colors.text,
				card_bg: colors.background,
				card_border: colors.primary && `${colors.primary}20`, // 20% opacity
				button_primary: colors.primary,
				button_primary_text: colors.background || '#ffffff'
			};
		} else if (theme.css_variables && Object.keys(theme.css_variables).length > 0) {
			// Extraer colores de variables CSS si están disponibles
			const vars = theme.css_variables;
			api_colors = {
				navbar_bg: vars['--navbar-bg'] || vars['--bg-color'] || vars['--primary-color'],
				navbar_text: vars['--navbar-text'] || vars['--text-color'],
				sidebar_bg: vars['--sidebar-bg'] || vars['--bg-color'],
				sidebar_text: vars['--sidebar-text'] || vars['--text-color'],
				main_bg: vars['--bg-color'] || vars['--main-bg'],
				main_text: vars['--text-color'] || vars['--main-text'],
				card_bg: vars['--card-bg'] || vars['--bg-color'],
				card_border: vars['--border-color'],
				button_primary: vars['--primary-color'] || vars['--btn-primary-bg'],
				button_primary_text: vars['--btn-primary-text'] || vars['--primary-text']
			};
		} else if (theme.css_content && theme.is_custom) {
			// Como último recurso, extraer colores del CSS para temas personalizados
			api_colors = this.extract_colors_from_css(theme);
		}
		
		// Combinar colores de la API con valores por defecto
		const preview_colors = {
			navbar_bg: api_colors.navbar_bg || default_colors.navbar_bg,
			navbar_text: api_colors.navbar_text || default_colors.navbar_text,
			sidebar_bg: api_colors.sidebar_bg || default_colors.sidebar_bg,
			sidebar_text: api_colors.sidebar_text || default_colors.sidebar_text,
			main_bg: api_colors.main_bg || default_colors.main_bg,
			main_text: api_colors.main_text || default_colors.main_text,
			card_bg: api_colors.card_bg || default_colors.card_bg,
			card_border: api_colors.card_border || default_colors.card_border,
			button_primary: api_colors.button_primary || default_colors.button_primary,
			button_primary_text: api_colors.button_primary_text || default_colors.button_primary_text,
			has_custom_colors: Object.keys(api_colors).filter(k => api_colors[k]).length > 0
		};
		
		return preview_colors;
	}

	extract_colors_from_css(theme) {
		const colors = {};
		
		if (!theme.css_content) {
			return colors;
		}
		
		// Patrones para temas específicos conocidos
		if (theme.name.includes('purple')) {
			colors.navbar_bg = "#4a148c";
			colors.navbar_text = "#ffffff";
			colors.sidebar_bg = "#6a1b9a";
			colors.sidebar_text = "#ffffff";
			colors.main_bg = "#f3e5f5";
			colors.main_text = "#4a148c";
			colors.card_bg = "#ffffff";
			colors.card_border = "#9c27b0";
			colors.button_primary = "#9c27b0";
			colors.button_primary_text = "#ffffff";
		} else if (theme.name.includes('blue')) {
			colors.navbar_bg = "#0d47a1";
			colors.navbar_text = "#ffffff";
			colors.sidebar_bg = "#1565c0";
			colors.sidebar_text = "#ffffff";
			colors.main_bg = "#e3f2fd";
			colors.main_text = "#0d47a1";
			colors.card_bg = "#ffffff";
			colors.card_border = "#2196f3";
			colors.button_primary = "#2196f3";
			colors.button_primary_text = "#ffffff";
		} else if (theme.name.includes('green')) {
			colors.navbar_bg = "#1b5e20";
			colors.navbar_text = "#ffffff";
			colors.sidebar_bg = "#2e7d32";
			colors.sidebar_text = "#ffffff";
			colors.main_bg = "#e8f5e8";
			colors.main_text = "#1b5e20";
			colors.card_bg = "#ffffff";
			colors.card_border = "#4caf50";
			colors.button_primary = "#4caf50";
			colors.button_primary_text = "#ffffff";
		} else if (theme.name.includes('red')) {
			colors.navbar_bg = "#b71c1c";
			colors.navbar_text = "#ffffff";
			colors.sidebar_bg = "#c62828";
			colors.sidebar_text = "#ffffff";
			colors.main_bg = "#ffebee";
			colors.main_text = "#b71c1c";
			colors.card_bg = "#ffffff";
			colors.card_border = "#f44336";
			colors.button_primary = "#f44336";
			colors.button_primary_text = "#ffffff";
		}
		
		// Intentar extraer variables CSS del contenido
		try {
			const cssVars = this.parse_css_variables(theme.css_content);
			if (Object.keys(cssVars).length > 0) {
				// Mapear variables comunes
				colors.navbar_bg = cssVars['--navbar-bg'] || cssVars['--primary-color'] || colors.navbar_bg;
				colors.navbar_text = cssVars['--navbar-text'] || cssVars['--text-on-primary'] || colors.navbar_text;
				colors.sidebar_bg = cssVars['--sidebar-bg'] || cssVars['--secondary-color'] || colors.sidebar_bg;
				colors.sidebar_text = cssVars['--sidebar-text'] || cssVars['--text-on-secondary'] || colors.sidebar_text;
				colors.main_bg = cssVars['--bg-color'] || cssVars['--background'] || colors.main_bg;
				colors.main_text = cssVars['--text-color'] || cssVars['--text'] || colors.main_text;
				colors.card_bg = cssVars['--card-bg'] || cssVars['--surface'] || colors.card_bg;
				colors.card_border = cssVars['--border-color'] || cssVars['--outline'] || colors.card_border;
				colors.button_primary = cssVars['--btn-primary'] || cssVars['--accent'] || colors.button_primary;
				colors.button_primary_text = cssVars['--btn-primary-text'] || cssVars['--text-on-accent'] || colors.button_primary_text;
			}
		} catch (e) {
			console.log(`[Frappe Themes] Error parsing CSS variables for ${theme.name}:`, e);
		}
		
		return colors;
	}
	
	parse_css_variables(css) {
		const variables = {};
		
		// Buscar patrones de variables CSS
		const varPattern = /--[\w-]+\s*:\s*[^;]+/g;
		const matches = css.match(varPattern);
		
		if (matches) {
			matches.forEach(match => {
				const [name, value] = match.split(':').map(s => s.trim());
				if (name && value) {
					variables[name] = value.replace(/;$/, '');
				}
			});
		}
		
		return variables;
	}

	get_default_theme_colors(theme) {
		// Colores por defecto según el tipo de tema
		if (theme.name === "dark") {
			return {
				navbar_bg: "#2d3436",
				navbar_text: "#ddd",
				sidebar_bg: "#353739",
				sidebar_text: "#ddd",
				main_bg: "#282c34",
				main_text: "#ffffff",
				card_bg: "#3c4142",
				card_border: "#525659",
				button_primary: "#007bff",
				button_primary_text: "#ffffff"
			};
		} else if (theme.name === "automatic") {
			// Para tema automático, usar colores neutros
			return {
				navbar_bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				navbar_text: "#ffffff",
				sidebar_bg: "#f8f9fa",
				sidebar_text: "#495057",
				main_bg: "#ffffff",
				main_text: "#212529",
				card_bg: "#ffffff",
				card_border: "#dee2e6",
				button_primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				button_primary_text: "#ffffff"
			};
		} else if (theme.is_custom) {
			// Para temas personalizados, usar colores basados en el nombre
			if (theme.name.includes('purple')) {
				return {
					navbar_bg: "#4a148c",
					navbar_text: "#ffffff",
					sidebar_bg: "#6a1b9a",
					sidebar_text: "#ffffff",
					main_bg: "#f3e5f5",
					main_text: "#4a148c",
					card_bg: "#ffffff",
					card_border: "#9c27b0",
					button_primary: "#9c27b0",
					button_primary_text: "#ffffff"
				};
			} else if (theme.name.includes('blue')) {
				return {
					navbar_bg: "#0d47a1",
					navbar_text: "#ffffff",
					sidebar_bg: "#1565c0",
					sidebar_text: "#ffffff",
					main_bg: "#e3f2fd",
					main_text: "#0d47a1",
					card_bg: "#ffffff",
					card_border: "#2196f3",
					button_primary: "#2196f3",
					button_primary_text: "#ffffff"
				};
			} else if (theme.name.includes('green')) {
				return {
					navbar_bg: "#1b5e20",
					navbar_text: "#ffffff",
					sidebar_bg: "#2e7d32",
					sidebar_text: "#ffffff",
					main_bg: "#e8f5e8",
					main_text: "#1b5e20",
					card_bg: "#ffffff",
					card_border: "#4caf50",
					button_primary: "#4caf50",
					button_primary_text: "#ffffff"
				};
			} else {
				// Tema personalizado genérico
				return {
					navbar_bg: "#37474f",
					navbar_text: "#ffffff",
					sidebar_bg: "#455a64",
					sidebar_text: "#ffffff",
					main_bg: "#eceff1",
					main_text: "#37474f",
					card_bg: "#ffffff",
					card_border: "#607d8b",
					button_primary: "#607d8b",
					button_primary_text: "#ffffff"
				};
			}
		} else {
			// Tema light (por defecto)
			return {
				navbar_bg: "#ffffff",
				navbar_text: "#495057",
				sidebar_bg: "#f8f9fa",
				sidebar_text: "#495057",
				main_bg: "#ffffff",
				main_text: "#212529",
				card_bg: "#ffffff",
				card_border: "#dee2e6",
				button_primary: "#007bff",
				button_primary_text: "#ffffff"
			};
		}
	}

	generate_preview_styles(theme) {
		// Generar estilos CSS personalizados para el preview
		if (!theme.css_variables && !theme.preview_colors) {
			return "";
		}

		let styles = [];
		
		// Aplicar variables CSS si están disponibles
		if (theme.css_variables) {
			Object.entries(theme.css_variables).forEach(([varName, varValue]) => {
				styles.push(`${varName}: ${varValue}`);
			});
		}

		return styles.join('; ');
	}

	toggle_theme(theme, callback) {
		this.current_theme = theme.toLowerCase();
		
		// Buscar si es un tema personalizado
		const theme_obj = this.themes.find(t => t.name === theme);
		const is_custom_theme = theme_obj && theme_obj.is_custom;
		
		if (is_custom_theme) {
			// Aplicar tema personalizado al desk
			this.apply_custom_desk_theme(theme_obj, callback);
		} else {
			// Limpiar temas personalizados antes de aplicar tema estándar
			this.remove_custom_themes();
			// Aplicar tema estándar (light, dark, automatic)
			document.documentElement.setAttribute("data-theme-mode", this.current_theme);
			frappe.ui.set_theme();
			
			// Forzar recálculo inmediato de estilos
			this.force_style_recalculation();
			
			// Ejecutar callback si se proporciona
			if (callback) callback();
		}
		
		frappe.show_alert(__("Theme Applied Instantly"), 3);

		// Guardar preferencia del usuario
		this.save_theme_preference(theme);
	}
	
	apply_custom_desk_theme(theme_obj, callback) {
		console.log(`[Frappe Themes] Applying custom theme:`, theme_obj);
		
		// Remover cualquier tema personalizado previo
		this.remove_custom_themes();
		
		// Aplicar el nuevo tema personalizado
		if (theme_obj.theme_url || theme_obj.css_content) {
			console.log(`[Frappe Themes] Loading CSS for theme: ${theme_obj.name}`);
			console.log(`[Frappe Themes] Has CSS content: ${!!theme_obj.css_content}`);
			console.log(`[Frappe Themes] Has theme URL: ${!!theme_obj.theme_url}`);
			console.log(`[Frappe Themes] Is desk theme: ${theme_obj.is_desk_theme}`);
			
			this.load_custom_theme_css(theme_obj, callback);
		}
		
		// Establecer atributos para el tema personalizado
		document.documentElement.setAttribute("data-theme-mode", "custom");
		document.documentElement.setAttribute("data-custom-theme", theme_obj.name);
		
		// Aplicar variables CSS si están disponibles
		if (theme_obj.css_variables) {
			this.apply_css_variables(theme_obj.css_variables);
		}
		
		// Forzar recálculo inmediato de estilos
		this.force_style_recalculation();
		
		// Si no hay CSS para cargar, ejecutar callback inmediatamente
		if (!theme_obj.theme_url && !theme_obj.css_content && callback) {
			callback();
		}
	}
	
	load_custom_theme_css(theme_obj, callback) {
		const theme_id = `custom-desk-theme-${theme_obj.name}`;
		
		// Crear elemento style para el tema personalizado
		const style_element = document.createElement('style');
		style_element.id = theme_id;
		style_element.className = 'custom-desk-theme';
		
		if (theme_obj.css_content) {
			// Si tenemos contenido CSS directo (temas de desk)
			console.log(`[Frappe Themes] Applying direct CSS for theme: ${theme_obj.name}`);
			style_element.textContent = theme_obj.css_content;
			document.head.appendChild(style_element);
			// Forzar aplicación inmediata
			this.force_css_application(style_element);
			// Ejecutar callback después de aplicar
			if (callback) {
				setTimeout(callback, 50); // Pequeño delay para asegurar que el CSS se aplique
			}
		} else if (theme_obj.theme_url) {
			// Si tenemos una URL, cargar el CSS (temas de website)
			console.log(`[Frappe Themes] Loading CSS from URL for theme: ${theme_obj.name}`);
			// Usar cache-busting para evitar CSS cacheado
			const cache_buster = `?t=${Date.now()}`;
			fetch(theme_obj.theme_url + cache_buster)
				.then(response => {
					if (!response.ok) {
						throw new Error(`HTTP ${response.status}: ${response.statusText}`);
					}
					return response.text();
				})
				.then(css => {
					// Determinar si necesitamos adaptar el CSS al desk
					const desk_css = theme_obj.is_desk_theme === false ? this.adapt_css_for_desk(css) : css;
					style_element.textContent = desk_css;
					document.head.appendChild(style_element);
					// Forzar aplicación inmediata
					this.force_css_application(style_element);
					console.log(`[Frappe Themes] Successfully loaded theme: ${theme_obj.name}`);
					// Ejecutar callback después de cargar
					if (callback) {
						setTimeout(callback, 50); // Pequeño delay para asegurar que el CSS se aplique
					}
				})
				.catch(error => {
					console.error('Error loading custom theme CSS:', error);
					frappe.show_alert(__("Error loading custom theme: ") + error.message, 5);
					if (callback) callback(); // Ejecutar callback incluso en caso de error
				});
		} else {
			console.warn(`[Frappe Themes] No CSS content or URL found for theme: ${theme_obj.name}`);
			if (callback) callback();
		}
	}
	
	adapt_css_for_desk(website_css) {
		// Convertir CSS de website a CSS para desk
		// Reemplazar selectores comunes del website con selectores del desk
		let desk_css = website_css;
		
		// Mapeo de selectores del website a selectores del desk
		const selector_mappings = {
			'body': '.layout-main, body',
			'.container': '.layout-main .container, .layout-side-section',
			'.navbar': '.navbar, .desk .navbar',
			'.btn': '.btn, .desk .btn',
			'.card': '.widget, .desk .card',
			'.form-control': '.form-control, .desk .form-control',
			'.bg-light': '.layout-side-section, .bg-light',
			'.bg-primary': '.navbar-nav .active, .bg-primary',
			// Agregar más mapeos según sea necesario
		};
		
		// Aplicar los mapeos
		Object.entries(selector_mappings).forEach(([website_selector, desk_selector]) => {
			const regex = new RegExp(`\\b${website_selector}\\b`, 'g');
			desk_css = desk_css.replace(regex, desk_selector);
		});
		
		// Agregar prefijo para que solo se aplique al desk
		desk_css = `.layout-main { ${desk_css} }`;
		
		return desk_css;
	}
	
	remove_custom_themes() {
		// Remover todos los temas personalizados previos
		document.querySelectorAll('.custom-desk-theme').forEach(element => {
			console.log(`[Frappe Themes] Removing previous theme: ${element.id}`);
			element.remove();
		});
		
		// Limpiar variables CSS personalizadas del root
		const root = document.documentElement;
		const rootStyle = root.style;
		
		// Remover variables CSS que puedan ser de temas personalizados
		for (let i = rootStyle.length - 1; i >= 0; i--) {
			const property = rootStyle[i];
			if (property.startsWith('--') && (
				property.includes('theme') || 
				property.includes('primary') || 
				property.includes('bg') || 
				property.includes('text')
			)) {
				root.style.removeProperty(property);
				console.log(`[Frappe Themes] Removed CSS variable: ${property}`);
			}
		}
		
		// Limpiar atributos
		document.documentElement.removeAttribute("data-custom-theme");
		
		// Forzar recálculo después de limpiar
		this.force_style_recalculation();
	}
	
	save_theme_preference(theme) {
		// Obtener el nombre de la app que contiene la extensión
		const app_methods = [];
		
		// Intentar obtener desde frappe.boot.installed_apps si está disponible
		if (frappe.boot?.installed_apps && Array.isArray(frappe.boot.installed_apps)) {
			frappe.boot.installed_apps.forEach(app => {
				app_methods.push(`${app}.user_extension.save_desk_theme_preference`);
			});
		} else {
			// Fallback: probar apps conocidas
			const known_apps = ['doctyped_cheatsheets', 'erpnext', 'hrms', 'lms', 'wiki'];
			known_apps.forEach(app => {
				app_methods.push(`${app}.user_extension.save_desk_theme_preference`);
			});
		}
		
		// Probar métodos hasta que uno funcione
		this.try_save_methods(app_methods, theme, 0);
	}
	
	try_save_methods(methods, theme, index) {
		if (index >= methods.length) {
			// No hay más métodos, usar localStorage como último recurso
			console.log("[Frappe Themes] All server methods failed, using localStorage");
			try {
				localStorage.setItem("frappe_custom_desk_theme", theme);
				console.log("[Frappe Themes] Theme preference saved to localStorage");
			} catch (localError) {
				console.log("[Frappe Themes] Could not save to localStorage either:", localError);
			}
			return;
		}
		
		const method = methods[index];
		console.log(`[Frappe Themes] Trying to save theme using: ${method}`);
		
		frappe.xcall(method, {
			theme_name: theme
		}).then((result) => {
			if (result && result.status === "success") {
				console.log("[Frappe Themes] Theme preference saved successfully to server");
				// También guardar en localStorage como backup
				try {
					localStorage.setItem("frappe_custom_desk_theme", theme);
				} catch (e) {}
			} else {
				console.log("[Frappe Themes] Server save returned error, trying next method");
				this.try_save_methods(methods, theme, index + 1);
			}
		}).catch((error) => {
			console.log(`[Frappe Themes] Method ${method} failed:`, error.message);
			this.try_save_methods(methods, theme, index + 1);
		});
	}

	show() {
		this.dialog.show();
	}

	hide() {
		this.dialog.hide();
	}
	
	// Métodos auxiliares para aplicación inmediata de temas
	force_style_recalculation() {
		// Forzar recálculo de estilos en toda la página
		document.body.style.display = 'none';
		document.body.offsetHeight; // Trigger reflow
		document.body.style.display = '';
		
		// Disparar evento personalizado para notificar cambio de tema
		const themeChangeEvent = new CustomEvent('frappe:theme-changed', {
			detail: {
				theme: this.current_theme,
				timestamp: Date.now()
			}
		});
		document.dispatchEvent(themeChangeEvent);
		
		console.log(`[Frappe Themes] Forced style recalculation for theme: ${this.current_theme}`);
	}
	
	force_css_application(style_element) {
		// Forzar que el navegador aplique inmediatamente el CSS
		if (style_element && style_element.sheet) {
			// Acceder a las reglas CSS para forzar parsing
			try {
				const rules = style_element.sheet.cssRules || style_element.sheet.rules;
				console.log(`[Frappe Themes] CSS rules applied: ${rules.length}`);
			} catch (e) {
				// Algunos navegadores pueden bloquear el acceso por CORS
				console.log('[Frappe Themes] CSS applied (CORS protected)');
			}
		}
		
		// Forzar recálculo de layout
		document.body.offsetHeight;
		
		// Actualizar cualquier elemento con data-theme
		document.querySelectorAll('[data-theme]').forEach(el => {
			el.offsetHeight; // Force reflow on themed elements
		});
	}
	
	apply_css_variables(css_variables) {
		// Aplicar variables CSS dinámicamente al root
		const root = document.documentElement;
		
		Object.entries(css_variables).forEach(([varName, varValue]) => {
			// Asegurar que la variable tenga el prefijo --
			const cssVarName = varName.startsWith('--') ? varName : `--${varName}`;
			root.style.setProperty(cssVarName, varValue);
			console.log(`[Frappe Themes] Applied CSS variable: ${cssVarName} = ${varValue}`);
		});
		
		// Forzar recálculo después de aplicar variables
		root.offsetHeight;
	}
};

// Agregar estilos CSS mejorados para los temas con preview
if (!document.querySelector('#frappe-themes-submodule-styles')) {
	const style = document.createElement('style');
	style.id = 'frappe-themes-submodule-styles';
	style.textContent = `
		.theme-grid .custom-theme {
			position: relative;
		}
		
		.theme-grid .custom-badge {
			position: absolute;
			top: 5px;
			right: 5px;
			background: var(--primary-color, #007bff);
			color: white;
			border-radius: 50%;
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 10px;
			z-index: 2;
		}
		
		.theme-grid .custom-theme .theme-title {
			color: var(--primary-color, #007bff);
		}

		/* Estilos mejorados para preview de temas */
		.theme-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 20px;
			padding: 20px;
		}

		.theme-grid > div {
			cursor: pointer;
			transition: all 0.2s ease;
		}

		.theme-preview-container {
			border-radius: 8px;
			overflow: hidden;
			border: 2px solid #e9ecef;
			transition: all 0.2s ease;
			min-height: 120px;
			background: #fff;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		}

		.theme-grid > div.selected .theme-preview-container {
			border-color: var(--primary-color, #007bff);
			box-shadow: 0 4px 16px rgba(0, 123, 255, 0.25);
		}

		.preview-header {
			position: relative;
			height: 8px;
			background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 100%);
		}

		.preview-navbar {
			height: 24px;
			display: flex;
			align-items: center;
			padding: 0 8px;
			gap: 4px;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		}

		.preview-nav-item {
			width: 16px;
			height: 8px;
			background: currentColor;
			opacity: 0.4;
			border-radius: 2px;
			transition: opacity 0.2s ease;
		}

		.preview-nav-item.active {
			opacity: 0.9;
		}

		.preview-content {
			display: flex;
			height: 88px;
		}

		.preview-sidebar {
			width: 50px;
			padding: 4px;
			display: flex;
			flex-direction: column;
			gap: 3px;
			border-right: 1px solid rgba(0, 0, 0, 0.1);
		}

		.sidebar-item {
			height: 12px;
			background: currentColor;
			opacity: 0.5;
			border-radius: 2px;
			transition: opacity 0.2s ease;
		}

		.sidebar-item.active {
			opacity: 0.9;
		}

		.preview-main {
			flex: 1;
			padding: 6px;
		}

		.preview-card {
			height: 100%;
			border-radius: 4px;
			border: 1px solid;
			display: flex;
			flex-direction: column;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		}

		.card-header {
			height: 16px;
			background: currentColor;
			opacity: 0.2;
			border-radius: 3px 3px 0 0;
		}

		.card-body {
			flex: 1;
			padding: 4px;
			display: flex;
			align-items: end;
			justify-content: end;
		}

		.preview-button {
			width: 24px;
			height: 10px;
			border-radius: 3px;
			border: none;
			box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		}

		.preview-check {
			position: absolute;
			top: 2px;
			left: 2px;
			width: 16px;
			height: 16px;
			background: var(--primary-color, #007bff);
			color: white;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 8px;
			opacity: 0;
			transition: opacity 0.2s ease;
			z-index: 3;
		}

		.theme-grid > div.selected .preview-check {
			opacity: 1;
		}

		/* Hover effects */
		.theme-grid > div:hover .theme-preview-container {
			transform: translateY(-2px);
			box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
		}

		.theme-grid > div:hover .preview-check {
			opacity: 0.7;
		}

		/* Applying theme animation */
		.theme-grid > div.applying-theme .theme-preview-container {
			transform: scale(0.98);
			transition: transform 0.2s ease;
			border-color: var(--primary-color, #007bff);
			background: linear-gradient(45deg, 
				rgba(0, 123, 255, 0.1) 0%, 
				rgba(0, 123, 255, 0.05) 100%);
		}

		.theme-grid > div.applying-theme .theme-title {
			color: var(--primary-color, #007bff);
			font-weight: 600;
		}

		.theme-grid > div.applying-theme::after {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			width: 20px;
			height: 20px;
			margin: -10px 0 0 -10px;
			border: 2px solid var(--primary-color, #007bff);
			border-top-color: transparent;
			border-radius: 50%;
			animation: theme-applying-spin 0.6s linear infinite;
			z-index: 10;
		}

		@keyframes theme-applying-spin {
			to { transform: rotate(360deg); }
		}
	`;
	document.head.appendChild(style);
}

frappe.ui.add_system_theme_switch_listener = () => {
	frappe.ui.dark_theme_media_query.addEventListener("change", () => {
		frappe.ui.set_theme();
	});
};

frappe.ui.dark_theme_media_query = window.matchMedia("(prefers-color-scheme: dark)");

frappe.ui.set_theme = (theme) => {
	const root = document.documentElement;
	let theme_mode = root.getAttribute("data-theme-mode");
	if (!theme) {
		if (theme_mode === "automatic") {
			theme = frappe.ui.dark_theme_media_query.matches ? "dark" : "light";
		}
	}
	root.setAttribute("data-theme", theme || theme_mode);
};

// Theme switcher enhanced for desk themes - Auto-loader is now integrated in desk.js