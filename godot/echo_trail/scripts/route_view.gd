extends Control

var palette := {
	"sky_top": Color("183052"),
	"sky_bottom": Color("e9b86c"),
	"far": Color("2a476e"),
	"mid": Color("406a8a"),
	"ground": Color("8d5c3b"),
	"accent": Color("ffd27d"),
}
var landmarks: Array = []
var current_index := 0
var resolved: Array[bool] = []
var flow := 1

func configure(route_data: Dictionary, next_index: int, resolved_state: Array[bool], next_flow: int) -> void:
	palette = route_data.get("palette", palette)
	landmarks = route_data.get("landmarks", [])
	current_index = next_index
	resolved = resolved_state
	flow = next_flow
	queue_redraw()

func _draw() -> void:
	var size := get_size()
	var top_color: Color = palette["sky_top"]
	var bottom_color: Color = palette["sky_bottom"]
	draw_polygon(
		PackedVector2Array([Vector2.ZERO, Vector2(size.x, 0), size, Vector2(0, size.y)]),
		PackedColorArray([top_color, top_color, bottom_color, bottom_color]),
	)

	draw_circle(Vector2(size.x * 0.82, size.y * 0.18), 56, Color(1.0, 0.92, 0.7, 0.82))
	draw_colored_polygon(
		PackedVector2Array([
			Vector2(0, size.y * 0.62),
			Vector2(size.x * 0.18, size.y * 0.5),
			Vector2(size.x * 0.34, size.y * 0.58),
			Vector2(size.x * 0.5, size.y * 0.42),
			Vector2(size.x * 0.7, size.y * 0.56),
			Vector2(size.x * 0.86, size.y * 0.4),
			Vector2(size.x, size.y * 0.48),
			Vector2(size.x, size.y),
			Vector2(0, size.y),
		]),
		palette["far"],
	)
	draw_colored_polygon(
		PackedVector2Array([
			Vector2(0, size.y * 0.7),
			Vector2(size.x * 0.16, size.y * 0.6),
			Vector2(size.x * 0.32, size.y * 0.68),
			Vector2(size.x * 0.46, size.y * 0.54),
			Vector2(size.x * 0.62, size.y * 0.66),
			Vector2(size.x * 0.8, size.y * 0.5),
			Vector2(size.x, size.y * 0.58),
			Vector2(size.x, size.y),
			Vector2(0, size.y),
		]),
		palette["mid"],
	)
	draw_colored_polygon(
		PackedVector2Array([
			Vector2(size.x * 0.08, size.y * 0.88),
			Vector2(size.x * 0.92, size.y * 0.88),
			Vector2(size.x * 0.64, size.y * 0.56),
			Vector2(size.x * 0.36, size.y * 0.56),
		]),
		Color("6a452e"),
	)
	draw_colored_polygon(
		PackedVector2Array([
			Vector2(size.x * 0.1, size.y * 0.84),
			Vector2(size.x * 0.9, size.y * 0.84),
			Vector2(size.x * 0.63, size.y * 0.59),
			Vector2(size.x * 0.37, size.y * 0.59),
		]),
		palette["accent"],
	)

	for index in landmarks.size():
		var t: float = 0.0 if landmarks.size() <= 1 else float(index) / float(landmarks.size() - 1)
		var pos: Vector2 = Vector2(lerp(size.x * 0.18, size.x * 0.82, t), lerp(size.y * 0.78, size.y * 0.48, t))
		var radius: float = lerp(20.0, 13.0, t)
		var glow: Color = Color("ffd47a")
		if landmarks[index].get("kind", "") == "shrine":
			glow = Color("7bd6ff")
		elif landmarks[index].get("kind", "") == "beacon":
			glow = Color("fff2bc")
		if index < resolved.size() and resolved[index]:
			draw_circle(pos, radius + 10, glow * Color(1, 1, 1, 0.18))
		if index == current_index:
			draw_circle(pos, radius + 12, Color("80d8ff") * Color(1, 1, 1, 0.26))
		draw_circle(pos, radius, glow)
		draw_line(pos + Vector2(0, radius), pos + Vector2(0, radius + 18), Color(1, 1, 1, 0.28), 4)

	var hero_t: float = 0.0 if landmarks.size() <= 1 else float(current_index) / float(landmarks.size() - 1)
	var hero_pos: Vector2 = Vector2(lerp(size.x * 0.18, size.x * 0.82, hero_t), lerp(size.y * 0.84, size.y * 0.54, hero_t))
	draw_circle(hero_pos + Vector2(0, -18), 8, Color("efe2c7"))
	draw_rect(Rect2(hero_pos + Vector2(-9, -12), Vector2(18, 28)), Color("14253d"), true)
	draw_circle(hero_pos + Vector2(18, -20), 11 + flow, Color(1.0, 0.9, 0.6, 0.3))
	draw_circle(hero_pos + Vector2(18, -20), 7, Color("ffe1a0"))
