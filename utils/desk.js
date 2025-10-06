// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt
/* eslint-disable no-console */

// __('Modules') __('Domains') __('Places') __('Administration') # for translation, don't remove

frappe.start_app = function () {
	if (!frappe.Application) return;
	frappe.assets.check();
	frappe.provide("frappe.app");
	frappe.provide("frappe.desk");
	frappe.app = new frappe.Application();
};

$(document).ready(function () {
	if (!frappe.utils.supportsES6) {
		frappe.msgprint({
			indicator: "red",
			title: __("Browser not supported"),
			message: __(
				"Some of the features might not work in your browser. Please update your browser to the latest version."
			),
		});
	}
	frappe.start_app();
});

frappe.Application = class Application {
	constructor() {
		this.startup();
	}

	startup() {
		frappe.realtime.init();
		frappe.model.init();

		this.load_bootinfo();
		this.load_user_permissions();
		this.make_nav_bar();
		this.make_sidebar();
		this.set_favicon();
		this.set_fullwidth_if_enabled();
		this.add_browser_class();
		this.setup_copy_doc_listener();
		this.setup_broadcast_listeners();

		frappe.ui.keys.setup();

		this.setup_theme();

		// page container
		this.make_page_container();
		this.setup_tours();
		this.set_route();

		// trigger app startup
		$(document).trigger("startup");
		$(document).trigger("app_ready");

		// Initialize custom theme auto-loader after app is ready
		this.initialize_custom_theme_autoloader();

		this.show_notices();
		this.show_notes();

		if (frappe.ui.startup_setup_dialog && !frappe.boot.setup_complete) {
			frappe.ui.startup_setup_dialog.pre_show();
			frappe.ui.startup_setup_dialog.show();
		}

		// listen to build errors
		this.setup_build_events();

		if (frappe.sys_defaults.email_user_password) {
			var email_list = frappe.sys_defaults.email_user_password.split(",");
			for (var u in email_list) {
				if (email_list[u] === frappe.user.name) {
					this.set_password(email_list[u]);
				}
			}
		}

		// REDESIGN-TODO: Fix preview popovers
		this.link_preview = new frappe.ui.LinkPreview();

		frappe.broadcast.emit("boot", {
			csrf_token: frappe.csrf_token,
			user: frappe.session.user,
		});
	}

	make_sidebar() {
		this.sidebar = new frappe.ui.Sidebar({});
	}

	setup_theme() {
		frappe.ui.keys.add_shortcut({
			shortcut: "shift+ctrl+g",
			description: __("Switch Theme"),
			action: () => {
				if (frappe.theme_switcher && frappe.theme_switcher.dialog.is_visible) {
					frappe.theme_switcher.hide();
				} else {
					frappe.theme_switcher = new frappe.ui.ThemeSwitcher();
					frappe.theme_switcher.show();
				}
			},
		});

		frappe.ui.add_system_theme_switch_listener();
		const root = document.documentElement;

		const observer = new MutationObserver(() => {
			frappe.ui.set_theme();
		});
		observer.observe(root, {
			attributes: true,
			attributeFilter: ["data-theme-mode"],
		});

		frappe.ui.set_theme();
	}

	setup_tours() {
		if (
			!window.Cypress &&
			frappe.boot.onboarding_tours &&
			frappe.boot.user.onboarding_status != null
		) {
			let pending_tours = !frappe.boot.onboarding_tours.every(
				(tour) => frappe.boot.user.onboarding_status[tour[0]]?.is_complete
			);
			if (pending_tours && frappe.boot.onboarding_tours.length > 0) {
				frappe.require("onboarding_tours.bundle.js", () => {
					frappe.utils.sleep(1000).then(() => {
						frappe.ui.init_onboarding_tour();
					});
				});
			}
		}
	}

	show_notices() {
		if (frappe.boot.messages) {
			frappe.msgprint(frappe.boot.messages);
		}

		if (frappe.user_roles.includes("System Manager")) {
			// delayed following requests to make boot faster
			setTimeout(() => {
				this.show_change_log();
				this.show_update_available();
			}, 1000);
		}

		if (!frappe.boot.developer_mode) {
			let console_security_message = __(
				"Using this console may allow attackers to impersonate you and steal your information. Do not enter or paste code that you do not understand."
			);
			console.log(`%c${console_security_message}`, "font-size: large");
		}

		frappe.realtime.on("version-update", function () {
			var dialog = frappe.msgprint({
				message: __(
					"The application has been updated to a new version, please refresh this page"
				),
				indicator: "green",
				title: __("Version Updated"),
			});
			dialog.set_primary_action(__("Refresh"), function () {
				location.reload(true);
			});
			dialog.get_close_btn().toggle(false);
		});
	}

	set_route() {
		if (frappe.boot && localStorage.getItem("session_last_route")) {
			frappe.set_route(localStorage.getItem("session_last_route"));
			localStorage.removeItem("session_last_route");
		} else {
			// route to home page
			frappe.router.route();
		}
		frappe.router.on("change", () => {
			$(".tooltip").hide();
			if (frappe.frappe_toolbar && frappe.is_mobile()) frappe.frappe_toolbar.show_app_logo();
		});
	}

	set_password(user) {
		var me = this;
		frappe.call({
			method: "frappe.core.doctype.user.user.get_email_awaiting",
			args: {
				user: user,
			},
			callback: function (email_account) {
				email_account = email_account["message"];
				if (email_account) {
					var i = 0;
					if (i < email_account.length) {
						me.email_password_prompt(email_account, user, i);
					}
				}
			},
		});
	}

	email_password_prompt(email_account, user, i) {
		var me = this;
		const email_id = email_account[i]["email_id"];
		let d = new frappe.ui.Dialog({
			title: __("Password missing in Email Account"),
			fields: [
				{
					fieldname: "password",
					fieldtype: "Password",
					label: __(
						"Please enter the password for: <b>{0}</b>",
						[email_id],
						"Email Account"
					),
					reqd: 1,
				},
				{
					fieldname: "submit",
					fieldtype: "Button",
					label: __("Submit", null, "Submit password for Email Account"),
				},
			],
		});
		d.get_input("submit").on("click", function () {
			//setup spinner
			d.hide();
			var s = new frappe.ui.Dialog({
				title: __("Checking one moment"),
				fields: [
					{
						fieldtype: "HTML",
						fieldname: "checking",
					},
				],
			});
			s.fields_dict.checking.$wrapper.html('<i class="fa fa-spinner fa-spin fa-4x"></i>');
			s.show();
			frappe.call({
				method: "frappe.email.doctype.email_account.email_account.set_email_password",
				args: {
					email_account: email_account[i]["email_account"],
					password: d.get_value("password"),
				},
				callback: function (passed) {
					s.hide();
					d.hide(); //hide waiting indication
					if (!passed["message"]) {
						frappe.show_alert(
							{ message: __("Login Failed please try again"), indicator: "error" },
							5
						);
						me.email_password_prompt(email_account, user, i);
					} else {
						if (i + 1 < email_account.length) {
							i = i + 1;
							me.email_password_prompt(email_account, user, i);
						}
					}
				},
			});
		});
		d.show();
	}
	load_bootinfo() {
		if (frappe.boot) {
			this.setup_workspaces();
			frappe.model.sync(frappe.boot.docs);
			this.check_metadata_cache_status();
			this.set_globals();
			this.sync_pages();
			frappe.router.setup();
			this.setup_moment();
			if (frappe.boot.print_css) {
				frappe.dom.set_style(frappe.boot.print_css, "print-style");
			}

			frappe.boot.setup_complete = frappe.boot.sysdefaults["setup_complete"];
			frappe.user.name = frappe.boot.user.name;
			frappe.router.setup();
		} else {
			this.set_as_guest();
		}
	}

	setup_workspaces() {
		frappe.modules = {};
		frappe.workspaces = {};
		frappe.boot.allowed_workspaces = frappe.boot.sidebar_pages.pages;

		for (let page of frappe.boot.allowed_workspaces || []) {
			frappe.modules[page.module] = page;
			frappe.workspaces[frappe.router.slug(page.name)] = page;
		}
	}

	load_user_permissions() {
		frappe.defaults.load_user_permission_from_boot();

		frappe.realtime.on(
			"update_user_permissions",
			frappe.utils.debounce(() => {
				frappe.defaults.update_user_permissions();
			}, 500)
		);
	}

	check_metadata_cache_status() {
		if (frappe.boot.metadata_version != localStorage.metadata_version) {
			frappe.assets.clear_local_storage();
			frappe.assets.init_local_storage();
		}
	}

	set_globals() {
		frappe.session.user = frappe.boot.user.name;
		frappe.session.logged_in_user = frappe.boot.user.name;
		frappe.session.user_email = frappe.boot.user.email;
		frappe.session.user_fullname = frappe.user_info().fullname;

		frappe.user_defaults = frappe.boot.user.defaults;
		frappe.user_roles = frappe.boot.user.roles;
		frappe.sys_defaults = frappe.boot.sysdefaults;

		frappe.ui.py_date_format = frappe.boot.sysdefaults.date_format
			.replace("dd", "%d")
			.replace("mm", "%m")
			.replace("yyyy", "%Y");
		frappe.boot.user.last_selected_values = {};
	}
	sync_pages() {
		// clear cached pages if timestamp is not found
		if (localStorage["page_info"]) {
			frappe.boot.allowed_pages = [];
			var page_info = JSON.parse(localStorage["page_info"]);
			$.each(frappe.boot.page_info, function (name, p) {
				if (!page_info[name] || page_info[name].modified != p.modified) {
					delete localStorage["_page:" + name];
				}
				frappe.boot.allowed_pages.push(name);
			});
		} else {
			frappe.boot.allowed_pages = Object.keys(frappe.boot.page_info);
		}
		localStorage["page_info"] = JSON.stringify(frappe.boot.page_info);
	}
	set_as_guest() {
		frappe.session.user = "Guest";
		frappe.session.user_email = "";
		frappe.session.user_fullname = "Guest";

		frappe.user_defaults = {};
		frappe.user_roles = ["Guest"];
		frappe.sys_defaults = {};
	}
	make_page_container() {
		if ($("#body").length) {
			$(".splash").remove();
			frappe.temp_container = $("<div id='temp-container' style='display: none;'>").appendTo(
				"body"
			);
			frappe.container = new frappe.views.Container();
		}
	}
	make_nav_bar() {
		// toolbar
		if (frappe.boot && frappe.boot.home_page !== "setup-wizard") {
			frappe.frappe_toolbar = new frappe.ui.toolbar.Toolbar();
		}
	}
	logout() {
		var me = this;
		me.logged_out = true;
		return frappe.call({
			method: "logout",
			callback: function (r) {
				if (r.exc) {
					return;
				}

				me.redirect_to_login();
			},
		});
	}
	handle_session_expired() {
		frappe.app.redirect_to_login();
	}
	redirect_to_login() {
		window.location.href = `/login?redirect-to=${encodeURIComponent(
			window.location.pathname + window.location.search
		)}`;
	}
	set_favicon() {
		var link = $('link[type="image/x-icon"]').remove().attr("href");
		$('<link rel="shortcut icon" href="' + link + '" type="image/x-icon">').appendTo("head");
		$('<link rel="icon" href="' + link + '" type="image/x-icon">').appendTo("head");
	}
	trigger_primary_action() {
		// to trigger change event on active input before triggering primary action
		$(document.activeElement).blur();
		// wait for possible JS validations triggered after blur (it might change primary button)
		setTimeout(() => {
			if (window.cur_dialog && cur_dialog.display && !cur_dialog.is_minimized) {
				// trigger primary
				cur_dialog.get_primary_btn().trigger("click");
			} else if (cur_frm && cur_frm.page.btn_primary.is(":visible")) {
				cur_frm.page.btn_primary.trigger("click");
			} else if (frappe.container.page.save_action) {
				frappe.container.page.save_action();
			}
		}, 100);
	}

	show_change_log() {
		var me = this;
		let change_log = frappe.boot.change_log;

		// frappe.boot.change_log = [{
		// 	"change_log": [
		// 		[<version>, <change_log in markdown>],
		// 		[<version>, <change_log in markdown>],
		// 	],
		// 	"description": "ERP made simple",
		// 	"title": "ERPNext",
		// 	"version": "12.2.0"
		// }];

		if (
			!Array.isArray(change_log) ||
			!change_log.length ||
			window.Cypress ||
			cint(frappe.boot.sysdefaults.disable_change_log_notification)
		) {
			return;
		}

		// Iterate over changelog
		var change_log_dialog = frappe.msgprint({
			message: frappe.render_template("change_log", { change_log: change_log }),
			title: __("Updated To A New Version 🎉"),
			wide: true,
		});
		change_log_dialog.keep_open = true;
		change_log_dialog.custom_onhide = function () {
			frappe.call({
				method: "frappe.utils.change_log.update_last_known_versions",
			});
			me.show_notes();
		};
	}

	show_update_available() {
		if (!frappe.boot.has_app_updates) return;
		frappe.xcall("frappe.utils.change_log.show_update_popup");
	}

	add_browser_class() {
		$("html").addClass(frappe.utils.get_browser().name.toLowerCase());
	}

	set_fullwidth_if_enabled() {
		frappe.ui.toolbar.set_fullwidth_if_enabled();
	}

	show_notes() {
		var me = this;
		if (frappe.boot.notes.length) {
			frappe.boot.notes.forEach(function (note) {
				if (!note.seen || note.notify_on_every_login) {
					var d = new frappe.ui.Dialog({ content: note.content, title: note.title });
					d.keep_open = true;
					d.msg_area = $('<div class="msgprint">').appendTo(d.body);
					d.msg_area.append(note.content);
					d.onhide = function () {
						note.seen = true;
						// Mark note as read if the Notify On Every Login flag is not set
						if (!note.notify_on_every_login) {
							frappe.call({
								method: "frappe.desk.doctype.note.note.mark_as_seen",
								args: {
									note: note.name,
								},
							});
						} else {
							frappe.call({
								method: "frappe.desk.doctype.note.note.reset_notes",
							});
						}
					};
					d.show();
				}
			});
		}
	}

	setup_build_events() {
		if (frappe.boot.developer_mode) {
			frappe.require("build_events.bundle.js");
		}
	}

	setup_copy_doc_listener() {
		$("body").on("paste", (e) => {
			try {
				let pasted_data = frappe.utils.get_clipboard_data(e);
				let doc = JSON.parse(pasted_data);
				if (doc.doctype) {
					e.preventDefault();
					const sleep = frappe.utils.sleep;

					frappe.dom.freeze(__("Creating {0}", [doc.doctype]) + "...");
					// to avoid abrupt UX
					// wait for activity feedback
					sleep(500).then(() => {
						let res = frappe.model.with_doctype(doc.doctype, () => {
							let newdoc = frappe.model.copy_doc(doc);
							newdoc.__newname = doc.name;
							delete doc.name;
							newdoc.idx = null;
							newdoc.__run_link_triggers = false;
							newdoc.on_paste_event = true;
							newdoc = JSON.parse(JSON.stringify(newdoc));
							frappe.set_route("Form", newdoc.doctype, newdoc.name);
							frappe.dom.unfreeze();
						});
						res && res.fail?.(frappe.dom.unfreeze);
					});
				}
			} catch (e) {
				//
			}
		});
	}

	/// Setup event listeners for events across browser tabs / web workers.
	setup_broadcast_listeners() {
		// booted in another tab -> refresh csrf to avoid invalid requests.
		frappe.broadcast.on("boot", ({ csrf_token, user }) => {
			if (user && user != frappe.session.user) {
				frappe.msgprint({
					message: __(
						"You've logged in as another user from another tab. Refresh this page to continue using system."
					),
					title: __("User Changed"),
					primary_action: {
						label: __("Refresh"),
						action: () => {
							window.location.reload();
						},
					},
				});
				return;
			}

			if (csrf_token) {
				// If user re-logged in then their other tabs won't be usable without this update.
				frappe.csrf_token = csrf_token;
			}
		});
	}

	setup_moment() {
		moment.updateLocale("en", {
			week: {
				dow: frappe.datetime.get_first_day_of_the_week_index(),
			},
		});
		moment.locale("en");
		moment.user_utc_offset = moment().utcOffset();
		if (frappe.boot.timezone_info) {
			moment.tz.add(frappe.boot.timezone_info);
		}
	}

	initialize_custom_theme_autoloader() {
		// Initialize the custom theme auto-loader
		console.log('[Frappe Themes] Initializing custom theme auto-loader...');
		
		// Prevent multiple initialization
		if (frappe.ui._theme_autoloader_initialized) {
			console.log('[Frappe Themes] Theme auto-loader already initialized, skipping...');
			return;
		}
		
		try {
			frappe.provide("frappe.ui");
			if (!frappe.ui.ThemeAutoLoader) {
				frappe.ui.ThemeAutoLoader = this.create_theme_autoloader_class();
			}
			new frappe.ui.ThemeAutoLoader();
			frappe.ui._theme_autoloader_initialized = true;
		} catch (error) {
			console.error('[Frappe Themes] Error initializing theme auto-loader:', error);
		}
	}

	create_theme_autoloader_class() {
		return class ThemeAutoLoader {
			constructor() {
				console.log('[Frappe Themes] ThemeAutoLoader initialized');
				this.auto_load_saved_theme();
			}

			auto_load_saved_theme() {
				console.log('[Frappe Themes] Attempting to auto-load saved theme...');
				
				// Try to load theme preference from server
				this.load_theme_preference_from_server()
					.then((saved_theme) => {
						if (saved_theme) {
							console.log(`[Frappe Themes] Found saved theme: ${saved_theme}`);
							this.fetch_and_apply_theme(saved_theme);
						} else {
							console.log('[Frappe Themes] No saved theme found');
						}
					})
					.catch((error) => {
						console.error('[Frappe Themes] Error loading theme from server:', error);
					});
			}

			load_theme_preference_from_server() {
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
				
				return this.try_preference_methods(app_methods, 0);
			}

			try_preference_methods(methods, index) {
				return new Promise((resolve) => {
					if (index >= methods.length) {
						resolve(null);
						return;
					}
					
					const method = methods[index];
					frappe.xcall(method)
						.then((result) => {
							if (result && result.status === "success" && result.theme) {
								resolve(result.theme);
							} else {
								this.try_preference_methods(methods, index + 1).then(resolve);
							}
						})
						.catch(() => {
							this.try_preference_methods(methods, index + 1).then(resolve);
						});
				});
			}

			fetch_and_apply_theme(theme_name) {
				// Only apply if it's a custom theme (not system themes)
				if (!theme_name || theme_name === "light" || theme_name === "dark" || theme_name === "automatic") {
					return;
				}

				console.log(`[Frappe Themes] Fetching theme data for: ${theme_name}`);
				
				// Get available themes from server using the same methods as ThemeSwitcher
				this.fetch_available_themes()
					.then((themes) => {
						if (themes && themes.length > 0) {
							const theme_obj = themes.find(t => t.name === theme_name);
							if (theme_obj && theme_obj.css_content) {
								console.log(`[Frappe Themes] Found theme data, applying: ${theme_name}`);
								this.apply_custom_theme_css(theme_obj.css_content, theme_name);
							} else {
								console.warn(`[Frappe Themes] Theme data not found for: ${theme_name}`);
							}
						} else {
							console.warn('[Frappe Themes] No themes available from server');
						}
					})
					.catch((error) => {
						console.error(`[Frappe Themes] Error fetching theme data for ${theme_name}:`, error);
					});
			}

			fetch_available_themes() {
				const potential_methods = [];
				
				// Intentar obtener desde frappe.boot.installed_apps si está disponible
				if (frappe.boot?.installed_apps && Array.isArray(frappe.boot.installed_apps)) {
					frappe.boot.installed_apps.forEach(app => {
						potential_methods.push(`${app}.user_extension.get_available_themes`);
					});
				} else {
					// Fallback: probar apps conocidas
					const known_apps = ['doctyped_cheatsheets', 'erpnext', 'hrms', 'lms', 'wiki'];
					known_apps.forEach(app => {
						potential_methods.push(`${app}.user_extension.get_available_themes`);
					});
				}
				
				return this.try_theme_methods(potential_methods, 0);
			}

			try_theme_methods(methods, index) {
				return new Promise((resolve) => {
					if (index >= methods.length) {
						resolve([]);
						return;
					}
					
					const method = methods[index];
					frappe.xcall(method)
						.then((themes) => {
							if (themes && themes.length > 0) {
								resolve(themes);
							} else {
								this.try_theme_methods(methods, index + 1).then(resolve);
							}
						})
						.catch(() => {
							this.try_theme_methods(methods, index + 1).then(resolve);
						});
				});
			}

			apply_custom_theme_css(css_content, theme_name) {
				// Remove any existing custom themes first
				this.remove_custom_themes();
				
				// Create and inject new CSS
				const style_element = document.createElement('style');
				style_element.type = 'text/css';
				style_element.className = 'custom-desk-theme';
				style_element.id = `custom-theme-${theme_name}`;
				style_element.textContent = css_content;
				
				// Add to head
				document.head.appendChild(style_element);
				
				// Set attribute on document element
				document.documentElement.setAttribute("data-custom-theme", theme_name);
				
				console.log(`[Frappe Themes] Successfully applied custom theme: ${theme_name}`);
			}

			remove_custom_themes() {
				// Remove all existing custom theme styles
				document.querySelectorAll('.custom-desk-theme').forEach(element => {
					element.remove();
				});
				
				// Clear custom theme attribute
				document.documentElement.removeAttribute("data-custom-theme");
			}
		};
	}
};

frappe.get_module = function (m, default_module) {
	var module = frappe.modules[m] || default_module;
	if (!module) {
		return;
	}

	if (module._setup) {
		return module;
	}

	if (!module.label) {
		module.label = m;
	}

	if (!module._label) {
		module._label = __(module.label);
	}

	module._setup = true;

	return module;
};
