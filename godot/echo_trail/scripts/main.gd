extends Control

const RouteView = preload("res://scripts/route_view.gd")

const CAMPAIGN_PATH := "res://data/campaign.json"
const SAVE_PATH := "user://echo_trail_save.json"
const STARTING_CHARGE := 5
const STARTING_FLOW := 1

var campaign_title := "Sky of Many Lanterns: Echo Trail"
var campaign_levels: Array = []
var save_state: Dictionary = {}

var current_route: Dictionary = {}
var current_index := 0
var resolved: Array = []
var shrine_results: Dictionary = {}
var route_charge := STARTING_CHARGE
var route_flow := STARTING_FLOW
var route_peak := STARTING_FLOW
var route_relics := 0

var background: ColorRect
var title_panel: PanelContainer
var atlas_panel: PanelContainer
var route_panel: PanelContainer
var title_status_label: Label
var title_continue_button: Button
var title_reset_button: Button
var atlas_summary_label: Label
var atlas_resume_button: Button
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
	campaign_levels = _load_campaign()
	_build_ui()
	_load_or_create_state()
	_show_title()

func _build_ui() -> void:
	background = ColorRect.new()
	background.color = Color("09131f")
	background.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(background)

	var scroll := ScrollContainer.new()
	scroll.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(scroll)

	var root_margin := MarginContainer.new()
	root_margin.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	root_margin.add_theme_constant_override("margin_left", 36)
	root_margin.add_theme_constant_override("margin_top", 28)
	root_margin.add_theme_constant_override("margin_right", 36)
	root_margin.add_theme_constant_override("margin_bottom", 28)
	scroll.add_child(root_margin)

	var stack := VBoxContainer.new()
	stack.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	stack.add_theme_constant_override("separation", 16)
	root_margin.add_child(stack)

	title_panel = _make_panel()
	stack.add_child(title_panel)
	var title_box := VBoxContainer.new()
	title_box.add_theme_constant_override("separation", 12)
	title_panel.add_child(title_box)
	title_box.add_child(_make_heading(campaign_title))
	title_box.add_child(_make_body("A browser-published Godot adventure. Walk routes, read shrine logic, gamble on wind lines, and relight a 20-level sky campaign."))
	title_status_label = _make_body("")
	title_box.add_child(title_status_label)
	title_continue_button = _make_button("Continue the journey", Callable(self, "_continue_journey"))
	title_box.add_child(title_continue_button)
	title_box.add_child(_make_button("Begin a new journey", Callable(self, "_start_story")))
	title_box.add_child(_make_button("Play a mid-campaign demo", Callable(self, "_start_demo")))
	title_reset_button = _make_button("Erase local save", Callable(self, "_reset_save"))
	title_box.add_child(title_reset_button)

	atlas_panel = _make_panel()
	stack.add_child(atlas_panel)
	var atlas_box := VBoxContainer.new()
	atlas_box.add_theme_constant_override("separation", 12)
	atlas_panel.add_child(atlas_box)
	atlas_box.add_child(_make_heading("Echo Trail Atlas"))
	atlas_box.add_child(_make_body("Every route is playable in this campaign slice. Clear routes to unlock the next district, collect upgrades, and build enough charge to reach the Lantern Spine."))
	atlas_summary_label = _make_body("")
	atlas_box.add_child(atlas_summary_label)
	atlas_resume_button = _make_button("Resume current route", Callable(self, "_continue_journey"))
	atlas_box.add_child(atlas_resume_button)
	var atlas_scroll := ScrollContainer.new()
	atlas_scroll.custom_minimum_size = Vector2(0, 520)
	atlas_scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	atlas_box.add_child(atlas_scroll)
	atlas_routes_box = VBoxContainer.new()
	atlas_routes_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	atlas_routes_box.add_theme_constant_override("separation", 10)
	atlas_scroll.add_child(atlas_routes_box)
	atlas_box.add_child(_make_button("Back to title", Callable(self, "_show_title")))

	route_panel = _make_panel()
	stack.add_child(route_panel)
	var route_box := VBoxContainer.new()
	route_box.add_theme_constant_override("separation", 12)
	route_panel.add_child(route_box)
	route_title_label = _make_heading("")
	route_goal_label = _make_body("")
	route_stats_label = _make_body("")
	route_view = RouteView.new()
	route_view.custom_minimum_size = Vector2(0, 320)
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
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
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

func _load_campaign() -> Array:
	var file := FileAccess.open(CAMPAIGN_PATH, FileAccess.READ)
	if file == null:
		push_error("Missing campaign data at %s" % CAMPAIGN_PATH)
		return []

	var parsed = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		push_error("Campaign data is not a dictionary")
		return []

	campaign_title = str(parsed.get("title", campaign_title))
	var levels: Array = []
	for raw_level in parsed.get("levels", []):
		levels.append(_normalize_route(raw_level))
	return levels

func _normalize_route(raw_level: Dictionary) -> Dictionary:
	var palette: Dictionary = raw_level.get("palette", {})
	return {
		"id": raw_level.get("id", ""),
		"index": int(raw_level.get("index", 0)),
		"region": raw_level.get("region", ""),
		"title": raw_level.get("title", ""),
		"tagline": raw_level.get("tagline", ""),
		"goal": raw_level.get("goal", ""),
		"story_beat": raw_level.get("story_beat", ""),
		"reward": raw_level.get("reward", ""),
		"reward_upgrade": raw_level.get("reward_upgrade", null),
		"palette": {
			"sky_top": Color(str(palette.get("sky_top", "#183052"))),
			"sky_bottom": Color(str(palette.get("sky_bottom", "#e9b86c"))),
			"far": Color(str(palette.get("far", "#2a476e"))),
			"mid": Color(str(palette.get("mid", "#406a8a"))),
			"ground": Color(str(palette.get("ground", "#8d5c3b"))),
			"accent": Color(str(palette.get("accent", "#ffd27d"))),
		},
		"landmarks": raw_level.get("landmarks", []),
	}

func _load_or_create_state() -> void:
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		save_state = _fresh_state()
		return

	var parsed = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		save_state = _fresh_state()
		return

	save_state = parsed
	save_state["completed_routes"] = save_state.get("completed_routes", {})
	save_state["upgrades"] = save_state.get("upgrades", [])
	save_state["active_run"] = save_state.get("active_run", {})

func _fresh_state() -> Dictionary:
	return {
		"version": 1,
		"unlocked_route_index": 1,
		"completed_routes": {},
		"upgrades": [],
		"active_run": {},
		"ending_unlocked": false,
	}

func _persist_state() -> void:
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		push_error("Unable to write save file")
		return
	file.store_string(JSON.stringify(save_state, "\t"))

func _reset_save() -> void:
	save_state = _fresh_state()
	current_route = {}
	current_index = 0
	resolved = []
	shrine_results = {}
	route_charge = STARTING_CHARGE
	route_flow = STARTING_FLOW
	route_peak = STARTING_FLOW
	route_relics = 0
	var dir := DirAccess.open("user://")
	if dir != null and dir.file_exists("echo_trail_save.json"):
		dir.remove("echo_trail_save.json")
	_show_title()

func _set_active(panel: PanelContainer) -> void:
	title_panel.visible = panel == title_panel
	atlas_panel.visible = panel == atlas_panel
	route_panel.visible = panel == route_panel

func _show_title() -> void:
	_refresh_title()
	_set_active(title_panel)

func _refresh_title() -> void:
	var has_progress: bool = not save_state.get("completed_routes", {}).is_empty() or not save_state.get("active_run", {}).is_empty()
	title_status_label.text = "Routes unlocked: %d / %d   Completed: %d   Upgrades: %s" % [
		int(save_state.get("unlocked_route_index", 1)),
		campaign_levels.size(),
		save_state.get("completed_routes", {}).size(),
		_upgrade_summary(),
	]
	title_continue_button.visible = has_progress
	title_reset_button.visible = has_progress

func _show_atlas() -> void:
	_refresh_atlas()
	_set_active(atlas_panel)

func _refresh_atlas() -> void:
	for child in atlas_routes_box.get_children():
		child.queue_free()

	var active_run: Dictionary = save_state.get("active_run", {})
	atlas_summary_label.text = "Relics %d   Best flow %d   Upgrades %s%s" % [
		_total_relics(),
		_best_flow(),
		_upgrade_summary(),
		"   Campaign complete" if bool(save_state.get("ending_unlocked", false)) else "",
	]
	atlas_resume_button.visible = not active_run.is_empty()
	if not active_run.is_empty():
		atlas_resume_button.text = "Resume %s" % _route_by_id(str(active_run.get("route_id", ""))).get("title", "current route")

	for index in campaign_levels.size():
		var route: Dictionary = campaign_levels[index]
		var route_id: String = str(route.get("id", ""))
		var completion: Dictionary = save_state.get("completed_routes", {}).get(route_id, {})
		var locked: bool = int(route.get("index", index + 1)) > int(save_state.get("unlocked_route_index", 1))
		var is_active: bool = not active_run.is_empty() and str(active_run.get("route_id", "")) == route_id
		var button := Button.new()
		var state_bits: Array[String] = []
		if locked:
			state_bits.append("locked")
		elif is_active:
			state_bits.append("in progress")
		elif not completion.is_empty():
			state_bits.append("%s %s★" % [completion.get("rank", "A"), str(completion.get("stars", 1))])
		else:
			state_bits.append("unplayed")
		button.text = "%02d. %s  |  %s  |  %s" % [
			int(route.get("index", index + 1)),
			route.get("title", ""),
			route.get("region", ""),
			", ".join(state_bits),
		]
		button.disabled = locked
		button.pressed.connect(Callable(self, "_open_route").bind(route_id))
		atlas_routes_box.add_child(button)

		var detail := _make_body("%s\nGoal: %s" % [route.get("tagline", ""), route.get("goal", "")])
		detail.add_theme_font_size_override("font_size", 15)
		detail.add_theme_color_override("font_color", Color("b4c6d1"))
		atlas_routes_box.add_child(detail)

func _start_story() -> void:
	save_state = _fresh_state()
	_persist_state()
	_show_atlas()

func _start_demo() -> void:
	save_state = _fresh_state()
	save_state["unlocked_route_index"] = 6
	save_state["completed_routes"] = {
		"fallen-ferry": {"relics": 2, "flow": 5, "charge_left": 4, "stars": 3, "rank": "A", "completed_at": "demo"},
		"signal-stair": {"relics": 2, "flow": 4, "charge_left": 4, "stars": 2, "rank": "A", "completed_at": "demo"},
		"sun-kite-orchard": {"relics": 3, "flow": 6, "charge_left": 3, "stars": 3, "rank": "S", "completed_at": "demo"},
	}
	save_state["upgrades"] = ["windThread"]
	_persist_state()
	_show_atlas()

func _continue_journey() -> void:
	var active_run: Dictionary = save_state.get("active_run", {})
	if active_run.is_empty():
		_show_atlas()
		return
	_hydrate_active_run(active_run)

func _open_route(route_id: String) -> void:
	var active_run: Dictionary = save_state.get("active_run", {})
	if not active_run.is_empty() and str(active_run.get("route_id", "")) == route_id:
		_hydrate_active_run(active_run)
		return
	var route: Dictionary = _route_by_id(route_id)
	if route.is_empty():
		return
	_start_new_run(route)

func _route_by_id(route_id: String) -> Dictionary:
	for route in campaign_levels:
		if str(route.get("id", "")) == route_id:
			return route
	return {}

func _start_new_run(route: Dictionary) -> void:
	current_route = route
	current_index = 0
	route_charge = STARTING_CHARGE + (1 if _has_upgrade("echoLens") else 0)
	route_flow = STARTING_FLOW + (1 if _has_upgrade("spineFlame") else 0)
	route_peak = route_flow
	route_relics = 0
	shrine_results = {}
	resolved = []
	for _i in current_route.get("landmarks", []).size():
		resolved.append(false)
	_sync_active_run()
	_update_route_view("Mira steps onto %s. %s" % [current_route.get("title", ""), current_route.get("story_beat", "")])
	_set_active(route_panel)

func _hydrate_active_run(active_run: Dictionary) -> void:
	var route: Dictionary = _route_by_id(str(active_run.get("route_id", "")))
	if route.is_empty():
		save_state["active_run"] = {}
		_persist_state()
		_show_atlas()
		return

	current_route = route
	current_index = int(active_run.get("current_index", 0))
	route_charge = int(active_run.get("route_charge", STARTING_CHARGE))
	route_flow = int(active_run.get("route_flow", STARTING_FLOW))
	route_peak = int(active_run.get("route_peak", route_flow))
	route_relics = int(active_run.get("route_relics", 0))
	resolved = active_run.get("resolved", [])
	shrine_results = active_run.get("shrine_results", {})
	_update_route_view("The wind picks up where Mira left it.")
	_set_active(route_panel)

func _sync_active_run() -> void:
	if current_route.is_empty():
		return
	save_state["active_run"] = {
		"route_id": current_route.get("id", ""),
		"current_index": current_index,
		"route_charge": route_charge,
		"route_flow": route_flow,
		"route_peak": route_peak,
		"route_relics": route_relics,
		"resolved": resolved,
		"shrine_results": shrine_results,
	}
	_persist_state()

func _clear_active_run() -> void:
	save_state["active_run"] = {}
	current_route = {}
	current_index = 0
	resolved = []
	shrine_results = {}

func _update_route_view(feedback: String = "") -> void:
	if current_route.is_empty():
		return

	var landmark: Dictionary = current_route.get("landmarks", [])[current_index]
	route_title_label.text = "%02d. %s  |  %s" % [
		int(current_route.get("index", 0)),
		current_route.get("title", ""),
		current_route.get("region", ""),
	]
	route_goal_label.text = "%s\n%s" % [current_route.get("tagline", ""), current_route.get("goal", "")]
	route_stats_label.text = "Charge %d   Flow %d (%s)   Peak %d   Relics %d   Upgrades %s" % [
		route_charge,
		route_flow,
		_flow_status(route_flow),
		route_peak,
		route_relics,
		_upgrade_summary(),
	]
	route_description_label.text = "%s\n%s\nScene: %s" % [
		landmark.get("title", ""),
		landmark.get("description", ""),
		landmark.get("scene_detail", ""),
	]
	route_prompt_label.text = ""
	route_feedback_label.text = feedback
	route_view.configure(current_route, current_index, resolved, route_flow)
	for child in route_options_box.get_children():
		child.queue_free()

	if resolved[current_index]:
		if current_index == current_route.get("landmarks", []).size() - 1:
			route_options_box.add_child(_make_button("Relight the beacon and close the route", Callable(self, "_finish_route")))
		else:
			route_options_box.add_child(_make_button("Continue along the route", Callable(self, "_advance_route")))
		_sync_active_run()
		return

	if landmark.get("kind", "") == "shrine":
		route_prompt_label.text = "%s\nHint: %s" % [landmark.get("prompt", ""), _route_hint_text(landmark)]
		for answer_index in landmark.get("answers", []).size():
			var button := _make_button(str(landmark.get("answers", [])[answer_index]), Callable(self, "_answer_shrine").bind(answer_index))
			route_options_box.add_child(button)
		return

	if landmark.get("choice", null) != null:
		var choice: Dictionary = landmark.get("choice", {})
		route_prompt_label.text = "%s\nCalm line: %s\nBright line: %s" % [
			choice.get("prompt", ""),
			choice.get("safe", {}).get("summary", ""),
			choice.get("risky", {}).get("summary", ""),
		]
		route_options_box.add_child(_make_button(str(choice.get("safe", {}).get("label", "Take the safe route")), Callable(self, "_take_safe_choice")))
		route_options_box.add_child(_make_button(str(choice.get("risky", {}).get("label", "Take the risky route")), Callable(self, "_take_risky_choice")))
		return

	route_prompt_label.text = "Choose how Mira handles this landmark."
	route_options_box.add_child(_make_button("Attune carefully", Callable(self, "_take_careful")))
	route_options_box.add_child(_make_button("Surge through it", Callable(self, "_take_bold")))

func _route_hint_text(landmark: Dictionary) -> String:
	if _has_upgrade("echoLens") or int(current_route.get("index", 1)) <= 5:
		return str(landmark.get("hint", "Trust the route pattern instead of the noise around it."))
	return "Read the shrine cleanly. The best answer is the one fully supported by the route."

func _apply_resolution(flow_delta: int, charge_delta: int, relic_delta: int, feedback: String, journal_success: bool = true) -> void:
	route_charge = max(1, route_charge + charge_delta)
	route_relics = max(0, route_relics + relic_delta)
	route_flow = max(0, route_flow + flow_delta)
	route_peak = max(route_peak, route_flow)
	resolved[current_index] = true
	_sync_active_run()
	_update_route_view(feedback if journal_success else "%s The route still yields, but it stings on the way through." % feedback)

func _take_careful() -> void:
	var landmark: Dictionary = current_route.get("landmarks", [])[current_index]
	var charge_delta: int = int(landmark.get("charge_delta", 0))
	var relic_delta: int = int(landmark.get("relic_delta", 0))
	if landmark.get("kind", "") == "cache" and _has_upgrade("bridgeSeed"):
		relic_delta += 1
	var flow_delta: int = 1 + (1 if _has_upgrade("spineFlame") and landmark.get("kind", "") == "beacon" else 0)
	_apply_resolution(flow_delta, charge_delta, relic_delta, "%s settles under Mira's careful line. %s" % [landmark.get("title", ""), landmark.get("journal_text", "")])

func _take_bold() -> void:
	var landmark: Dictionary = current_route.get("landmarks", [])[current_index]
	var charge_delta: int = int(landmark.get("charge_delta", 0)) - 1
	if _has_upgrade("windThread") and landmark.get("kind", "") in ["hazard", "vista"]:
		charge_delta += 1
	var relic_delta: int = int(landmark.get("relic_delta", 0)) + 1
	if landmark.get("kind", "") == "cache" and _has_upgrade("bridgeSeed"):
		relic_delta += 1
	var flow_delta: int = 2 + (1 if _has_upgrade("spineFlame") and landmark.get("kind", "") == "beacon" else 0)
	_apply_resolution(flow_delta, charge_delta, relic_delta, "%s breaks open under a hotter line. %s" % [landmark.get("title", ""), landmark.get("journal_text", "")])

func _answer_shrine(answer_index: int) -> void:
	var landmark: Dictionary = current_route.get("landmarks", [])[current_index]
	var correct: bool = int(landmark.get("correct", 0)) == answer_index
	shrine_results[landmark.get("id", "")] = correct
	var flow_delta: int = 2 if correct else -2
	var charge_delta: int = 0 if correct else -1
	var relic_delta: int = 1 if correct else 0
	var feedback: String = "The shrine opens cleanly. %s" % landmark.get("journal_text", "")
	if not correct:
		feedback = "The shrine bites back. %s" % landmark.get("journal_text", "")
	_apply_resolution(flow_delta, charge_delta, relic_delta, feedback, correct)

func _take_safe_choice() -> void:
	var landmark: Dictionary = current_route.get("landmarks", [])[current_index]
	var choice: Dictionary = landmark.get("choice", {}).get("safe", {})
	var charge_delta: int = int(choice.get("charge_delta", 0))
	if _has_upgrade("windThread") and charge_delta < 1:
		charge_delta += 1
	_apply_resolution(1, charge_delta, int(choice.get("relic_delta", 0)), str(choice.get("outcome", "")))

func _take_risky_choice() -> void:
	var landmark: Dictionary = current_route.get("landmarks", [])[current_index]
	var choice: Dictionary = landmark.get("choice", {}).get("risky", {})
	var charge_delta: int = int(choice.get("charge_delta", 0))
	if _has_upgrade("windThread") and charge_delta < 0:
		charge_delta += 1
	var relic_delta: int = int(choice.get("relic_delta", 0))
	if _has_upgrade("bridgeSeed"):
		relic_delta += 1
	_apply_resolution(2, charge_delta, relic_delta, str(choice.get("outcome", "")))

func _advance_route() -> void:
	if current_index >= current_route.get("landmarks", []).size() - 1:
		return
	current_index += 1
	_sync_active_run()
	_update_route_view("The route opens deeper into the sky.")

func _finish_route() -> void:
	var route_id: String = str(current_route.get("id", ""))
	var route_title: String = str(current_route.get("title", "This route"))
	var completion: Dictionary = {
		"relics": route_relics,
		"flow": route_peak,
		"charge_left": route_charge,
		"stars": _stars_for_route(),
		"rank": _rank_for_peak(route_peak),
		"completed_at": str(int(Time.get_unix_time_from_system())),
	}
	var completed_routes: Dictionary = save_state.get("completed_routes", {})
	completed_routes[route_id] = completion
	save_state["completed_routes"] = completed_routes
	save_state["unlocked_route_index"] = min(campaign_levels.size(), max(int(save_state.get("unlocked_route_index", 1)), int(current_route.get("index", 1)) + 1))
	if current_route.get("reward_upgrade", null) != null and not _has_upgrade(str(current_route.get("reward_upgrade", ""))):
		var upgrades: Array = save_state.get("upgrades", [])
		upgrades.append(str(current_route.get("reward_upgrade", "")))
		save_state["upgrades"] = upgrades
	save_state["ending_unlocked"] = int(current_route.get("index", 0)) >= campaign_levels.size()
	var reward_text: String = str(current_route.get("reward", "The route wakes and the atlas grows brighter."))
	_clear_active_run()
	_persist_state()
	_show_atlas()
	atlas_summary_label.text = "%s\n%s restored with rank %s and %s★." % [
		atlas_summary_label.text,
		route_title,
		completion.get("rank", "A"),
		str(completion.get("stars", 1)),
	]
	atlas_summary_label.text = "%s\n%s" % [atlas_summary_label.text, reward_text]

func _stars_for_route() -> int:
	var shrine_total := 0
	var shrine_correct := 0
	for landmark in current_route.get("landmarks", []):
		if landmark.get("kind", "") == "shrine":
			shrine_total += 1
			if bool(shrine_results.get(landmark.get("id", ""), false)):
				shrine_correct += 1
	return 1 + (1 if route_relics >= 3 else 0) + (1 if shrine_total > 0 and shrine_correct == shrine_total else 0)

func _rank_for_peak(flow_peak: int) -> String:
	if flow_peak >= 8:
		return "SS"
	if flow_peak >= 6:
		return "S"
	if flow_peak >= 4:
		return "A"
	return "B"

func _flow_status(flow_value: int) -> String:
	if flow_value >= 7:
		return "Skyfire"
	if flow_value >= 5:
		return "Bright"
	if flow_value >= 3:
		return "Settled"
	if flow_value >= 1:
		return "Faint"
	return "Broken"

func _has_upgrade(upgrade_id: String) -> bool:
	return save_state.get("upgrades", []).has(upgrade_id)

func _upgrade_summary() -> String:
	var upgrades: Array = save_state.get("upgrades", [])
	if upgrades.is_empty():
		return "none"
	var labels: Array[String] = []
	for upgrade in upgrades:
		labels.append(_upgrade_label(str(upgrade)))
	return ", ".join(labels)

func _upgrade_label(upgrade_id: String) -> String:
	return {
		"windThread": "Wind Thread",
		"echoLens": "Echo Lens",
		"bridgeSeed": "Bridge Seed",
		"spineFlame": "Spine Flame",
	}.get(upgrade_id, upgrade_id)

func _total_relics() -> int:
	var total := 0
	for result in save_state.get("completed_routes", {}).values():
		total += int(result.get("relics", 0))
	return total

func _best_flow() -> int:
	var best := 0
	for result in save_state.get("completed_routes", {}).values():
		best = max(best, int(result.get("flow", 0)))
	return best
