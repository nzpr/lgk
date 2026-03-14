extends Control

const RouteView = preload("res://scripts/route_view.gd")

const ROUTES := [
	{
		"id": "fallen-ferry",
		"title": "Fallen Ferry",
		"region": "Lantern Reach",
		"goal": "Cross the broken ferry and relight the first beacon.",
		"palette": {
			"sky_top": Color("183052"),
			"sky_bottom": Color("e9b86c"),
			"far": Color("2a476e"),
			"mid": Color("406a8a"),
			"ground": Color("8d5c3b"),
			"accent": Color("ffd27d"),
		},
		"landmarks": [
			{"title": "Shoreline Bell", "kind": "start", "description": "Nilo steadies Mira on the first live plank of the route."},
			{"title": "Cargo Drift", "kind": "cache", "description": "A crate tears open in the clouds. A bold search may pull relics out of the wind."},
			{"title": "Dock Seal", "kind": "shrine", "description": "A brass route seal locks the boarding ramp.", "prompt": "Which marker belongs with the cargo glyph set?", "answers": ["Lantern crate", "Broken chain", "Sky moth"], "correct": 0},
			{"title": "Chain Gap", "kind": "hazard", "description": "Two chain lines cross the void: one steady, one bright with sparks.", "choice_prompt": "How should Mira cross?", "safe": "Take the steady chain", "risky": "Leap the spark chain"},
			{"title": "First Lantern", "kind": "beacon", "description": "The smallest beacon in Lantern Reach waits for a pulse to wake."},
		],
	},
	{
		"id": "signal-stair",
		"title": "Signal Stair",
		"region": "Lantern Reach",
		"goal": "Wake the hanging stair and recover the western roofline.",
		"palette": {
			"sky_top": Color("1b3359"),
			"sky_bottom": Color("f4cb85"),
			"far": Color("31537e"),
			"mid": Color("4d7695"),
			"ground": Color("7b6047"),
			"accent": Color("ffd987"),
		},
		"landmarks": [],
	},
	{
		"id": "sun-kite-orchard",
		"title": "Sun-Kite Orchard",
		"region": "Lantern Reach",
		"goal": "Find the hidden weather post among torn kites and orchard terraces.",
		"palette": {
			"sky_top": Color("173b59"),
			"sky_bottom": Color("efc768"),
			"far": Color("2f5d74"),
			"mid": Color("6f8f62"),
			"ground": Color("91633d"),
			"accent": Color("ffe07f"),
		},
		"landmarks": [],
	},
]

var unlocked_routes := 1
var completed_routes := {}
var current_route: Dictionary = {}
var current_index := 0
var resolved: Array[bool] = []
var route_charge := 5
var route_flow := 1
var route_peak := 1
var route_relics := 0

var background: ColorRect
var title_panel: PanelContainer
var atlas_panel: PanelContainer
var route_panel: PanelContainer
var atlas_routes_box: VBoxContainer
var route_title_label: Label
var route_goal_label: Label
var route_stats_label: Label
var route_description_label: Label
var route_prompt_label: Label
var route_view
var route_options_box: VBoxContainer
var route_feedback_label: Label

func _ready() -> void:
	_build_ui()
	_show_title()

func _build_ui() -> void:
	background = ColorRect.new()
	background.color = Color("09131f")
	background.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(background)

	var root_margin := MarginContainer.new()
	root_margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	root_margin.add_theme_constant_override("margin_left", 36)
	root_margin.add_theme_constant_override("margin_top", 28)
	root_margin.add_theme_constant_override("margin_right", 36)
	root_margin.add_theme_constant_override("margin_bottom", 28)
	add_child(root_margin)

	var stack := VBoxContainer.new()
	stack.add_theme_constant_override("separation", 16)
	root_margin.add_child(stack)

	title_panel = _make_panel()
	stack.add_child(title_panel)
	var title_box := VBoxContainer.new()
	title_box.add_theme_constant_override("separation", 12)
	title_panel.add_child(title_box)
	title_box.add_child(_make_heading("Sky of Many Lanterns: Echo Trail"))
	title_box.add_child(_make_body("A real Godot adventure build: route scenes, shrine seals, risky crossings, and world discovery in browser-playable form."))
	title_box.add_child(_make_button("Begin the journey", Callable(self, "_start_story")))
	title_box.add_child(_make_button("Play a mid-route demo", Callable(self, "_start_demo")))

	atlas_panel = _make_panel()
	stack.add_child(atlas_panel)
	var atlas_box := VBoxContainer.new()
	atlas_box.add_theme_constant_override("separation", 12)
	atlas_panel.add_child(atlas_box)
	atlas_box.add_child(_make_heading("Echo Trail Camp"))
	atlas_box.add_child(_make_body("Choose a route. The first route is fully playable in this slice; later routes are scaffolded for campaign migration."))
	atlas_routes_box = VBoxContainer.new()
	atlas_routes_box.add_theme_constant_override("separation", 10)
	atlas_box.add_child(atlas_routes_box)

	route_panel = _make_panel()
	stack.add_child(route_panel)
	var route_box := VBoxContainer.new()
	route_box.add_theme_constant_override("separation", 12)
	route_panel.add_child(route_box)
	route_title_label = _make_heading("")
	route_goal_label = _make_body("")
	route_stats_label = _make_body("")
	route_view = RouteView.new()
	route_view.custom_minimum_size = Vector2(0, 360)
	route_description_label = _make_body("")
	route_prompt_label = _make_body("")
	route_feedback_label = _make_body("")
	route_options_box = VBoxContainer.new()
	route_options_box.add_theme_constant_override("separation", 8)
	route_box.add_child(route_title_label)
	route_box.add_child(route_goal_label)
	route_box.add_child(route_stats_label)
	route_box.add_child(route_view)
	route_box.add_child(route_description_label)
	route_box.add_child(route_prompt_label)
	route_box.add_child(route_feedback_label)
	route_box.add_child(route_options_box)
	route_box.add_child(_make_button("Back to atlas", Callable(self, "_show_atlas")))

func _make_panel() -> PanelContainer:
	var panel := PanelContainer.new()
	panel.visible = false
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.05, 0.1, 0.16, 0.88)
	style.corner_radius_top_left = 24
	style.corner_radius_top_right = 24
	style.corner_radius_bottom_left = 24
	style.corner_radius_bottom_right = 24
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.border_color = Color(1, 0.94, 0.82, 0.14)
	style.content_margin_left = 22
	style.content_margin_right = 22
	style.content_margin_top = 20
	style.content_margin_bottom = 20
	panel.add_theme_stylebox_override("panel", style)
	return panel

func _make_heading(text: String) -> Label:
	var label := Label.new()
	label.text = text
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override("font_size", 32)
	label.add_theme_color_override("font_color", Color("f6f0df"))
	return label

func _make_body(text: String) -> Label:
	var label := Label.new()
	label.text = text
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override("font_size", 18)
	label.add_theme_color_override("font_color", Color("d8d2c2"))
	return label

func _make_button(text: String, action: Callable) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size = Vector2(0, 48)
	button.pressed.connect(action)
	return button

func _set_active(panel: PanelContainer) -> void:
	title_panel.visible = panel == title_panel
	atlas_panel.visible = panel == atlas_panel
	route_panel.visible = panel == route_panel

func _show_title() -> void:
	_set_active(title_panel)

func _show_atlas() -> void:
	_set_active(atlas_panel)
	for child in atlas_routes_box.get_children():
		child.queue_free()
	for index in ROUTES.size():
		var route: Dictionary = ROUTES[index]
		var button := Button.new()
		var locked := index >= unlocked_routes
		button.text = "%d. %s%s" % [index + 1, route["title"], "  (locked)" if locked else ""]
		button.disabled = locked or route.get("landmarks", []).is_empty()
		if not button.disabled:
			button.pressed.connect(func() -> void: _start_route(index))
		atlas_routes_box.add_child(button)
	var summary := _make_body("Completed: %d   Relics: %d   Best flow: %d" % [completed_routes.size(), _total_relics(), _best_flow()])
	atlas_routes_box.add_child(summary)

func _start_story() -> void:
	unlocked_routes = 1
	completed_routes.clear()
	_show_atlas()

func _start_demo() -> void:
	unlocked_routes = 3
	completed_routes = {"fallen-ferry": {"relics": 2, "flow": 5}}
	_show_atlas()

func _start_route(index: int) -> void:
	current_route = ROUTES[index]
	current_index = 0
	route_charge = 5
	route_flow = 1
	route_peak = 1
	route_relics = 0
	resolved = []
	for _i in current_route["landmarks"].size():
		resolved.append(false)
	_update_route_view("A fresh route opens. Decide how hard Mira pushes it.")
	_set_active(route_panel)

func _update_route_view(feedback: String = "") -> void:
	route_title_label.text = "%s  |  %s" % [current_route.get("region", ""), current_route.get("title", "")]
	route_goal_label.text = current_route.get("goal", "")
	route_stats_label.text = "Charge %d   Flow %d   Peak %d   Relics %d" % [route_charge, route_flow, route_peak, route_relics]
	var landmark: Dictionary = current_route["landmarks"][current_index]
	route_description_label.text = "%s\n%s" % [landmark.get("title", ""), landmark.get("description", "")]
	route_prompt_label.text = ""
	route_feedback_label.text = feedback
	route_view.configure(current_route, current_index, resolved, route_flow)
	for child in route_options_box.get_children():
		child.queue_free()

	if resolved[current_index]:
		if current_index == current_route["landmarks"].size() - 1:
			route_options_box.add_child(_make_button("Restore the route and return to camp", Callable(self, "_finish_route")))
		else:
			route_options_box.add_child(_make_button("Continue along the route", Callable(self, "_advance_route")))
		return

	if landmark.get("kind", "") == "shrine":
		route_prompt_label.text = landmark.get("prompt", "")
		var answers: Array = landmark.get("answers", [])
		for answer_index in answers.size():
			var button := _make_button(str(answers[answer_index]), func() -> void: _answer_shrine(answer_index))
			route_options_box.add_child(button)
		return

	if landmark.has("choice_prompt"):
		route_prompt_label.text = landmark["choice_prompt"]
		route_options_box.add_child(_make_button("%s  |  steady" % landmark["safe"], Callable(self, "_take_safe_choice")))
		route_options_box.add_child(_make_button("%s  |  risky" % landmark["risky"], Callable(self, "_take_risky_choice")))
		return

	route_prompt_label.text = "Choose how Mira handles this landmark."
	route_options_box.add_child(_make_button("Careful line  |  keep the run stable", Callable(self, "_take_careful")))
	route_options_box.add_child(_make_button("Bold line  |  push flow and relic pressure", Callable(self, "_take_bold")))

func _take_careful() -> void:
	var landmark: Dictionary = current_route["landmarks"][current_index]
	route_flow = max(0, route_flow + 1)
	route_peak = max(route_peak, route_flow)
	if landmark.get("kind", "") == "cache":
		route_relics += 1
	resolved[current_index] = true
	_update_route_view("%s steadies the route." % landmark["title"])

func _take_bold() -> void:
	var landmark: Dictionary = current_route["landmarks"][current_index]
	route_charge = max(1, route_charge - 1)
	route_flow = max(0, route_flow + 2)
	route_peak = max(route_peak, route_flow)
	route_relics += 1
	resolved[current_index] = true
	_update_route_view("%s yields to a hotter line. Mira wins speed and relic pressure." % landmark["title"])

func _answer_shrine(answer_index: int) -> void:
	var landmark: Dictionary = current_route["landmarks"][current_index]
	var correct: bool = int(landmark.get("correct", 0)) == answer_index
	if correct:
		route_flow = max(0, route_flow + 2)
		route_relics += 1
	else:
		route_charge = max(1, route_charge - 1)
		route_flow = max(0, route_flow - 2)
	route_peak = max(route_peak, route_flow)
	resolved[current_index] = true
	_update_route_view("The shrine opens and the boardwalk brightens." if correct else "The shrine fights back, but the route still yields.")

func _take_safe_choice() -> void:
	route_flow = max(0, route_flow + 1)
	route_peak = max(route_peak, route_flow)
	resolved[current_index] = true
	_update_route_view("Mira takes the stable chain and keeps the route alive.")

func _take_risky_choice() -> void:
	route_charge = max(1, route_charge - 1)
	route_flow = max(0, route_flow + 2)
	route_peak = max(route_peak, route_flow)
	route_relics += 1
	resolved[current_index] = true
	_update_route_view("Mira commits to the spark chain and tears a relic free from the arc.")

func _advance_route() -> void:
	current_index += 1
	_update_route_view("The route opens deeper into the sky.")

func _finish_route() -> void:
	completed_routes[current_route["id"]] = {"relics": route_relics, "flow": route_peak}
	unlocked_routes = max(unlocked_routes, min(ROUTES.size(), int(completed_routes.size()) + 1))
	_show_atlas()

func _total_relics() -> int:
	var total := 0
	for result in completed_routes.values():
		total += int(result.get("relics", 0))
	return total

func _best_flow() -> int:
	var best := 0
	for result in completed_routes.values():
		best = max(best, int(result.get("flow", 0)))
	return best
