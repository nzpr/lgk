extends Control

var palette := {
	"sky_top": Color("183052"),
	"sky_bottom": Color("e9b86c"),
	"far": Color("2a476e"),
	"mid": Color("406a8a"),
	"ground": Color("8d5c3b"),
	"accent": Color("ffd27d"),
}
var route_data: Dictionary = {}
var landmarks: Array = []
var current_index := 0
var resolved: Array = []
var flow := 1
var drift_time := 0.0

func _ready() -> void:
	set_process(true)

func _process(delta: float) -> void:
	drift_time += delta
	queue_redraw()

func configure(next_route_data: Dictionary, next_index: int, resolved_state: Array, next_flow: int) -> void:
	route_data = next_route_data
	palette = route_data.get("palette", palette)
	landmarks = route_data.get("landmarks", [])
	current_index = next_index
	resolved = resolved_state
	flow = next_flow
	queue_redraw()

func _draw() -> void:
	var size := get_size()
	var sway := sin(drift_time * 0.55) * 18.0
	var horizon := size.y * 0.42
	_draw_sky(size, sway)
	_draw_cloud_bands(size, sway)
	_draw_far_islands(size, horizon, sway)
	_draw_region_backdrop(size, horizon, sway)
	_draw_boardwalk(size, sway)
	var points := _landmark_points(size, sway)
	_draw_route_ribbon(points)
	_draw_landmarks(points, size)
	_draw_traveler(size, sway)
	_draw_foreground(size, sway)

func _draw_sky(size: Vector2, sway: float) -> void:
	draw_polygon(
		PackedVector2Array([Vector2.ZERO, Vector2(size.x, 0), size, Vector2(0, size.y)]),
		PackedColorArray([palette["sky_top"], palette["sky_top"], palette["sky_bottom"], palette["sky_bottom"]]),
	)
	var sun_center := Vector2(size.x * 0.78 + sway * 0.25, size.y * 0.18 + sin(drift_time * 0.3) * 8.0)
	draw_circle(sun_center, 62, Color(1.0, 0.93, 0.72, 0.18))
	draw_circle(sun_center, 40, Color(1.0, 0.94, 0.76, 0.78))

func _draw_cloud_bands(size: Vector2, sway: float) -> void:
	for index in 4:
		var y := size.y * (0.16 + index * 0.08) + sin(drift_time * (0.3 + index * 0.06)) * 6.0
		var x_shift := sway * (0.3 + index * 0.08)
		var cloud := PackedVector2Array([
			Vector2(size.x * 0.05 + x_shift, y),
			Vector2(size.x * 0.24 + x_shift, y - 10),
			Vector2(size.x * 0.42 + x_shift, y + 6),
			Vector2(size.x * 0.58 + x_shift, y - 8),
			Vector2(size.x * 0.8 + x_shift, y + 10),
			Vector2(size.x * 0.96 + x_shift, y + 4),
			Vector2(size.x * 0.96 + x_shift, y + 24),
			Vector2(size.x * 0.05 + x_shift, y + 24),
		])
		draw_colored_polygon(cloud, Color(1, 1, 1, 0.05 + index * 0.02))

func _draw_far_islands(size: Vector2, horizon: float, sway: float) -> void:
	draw_colored_polygon(
		PackedVector2Array([
			Vector2(0, horizon + 70),
			Vector2(size.x * 0.14, horizon + 18),
			Vector2(size.x * 0.28, horizon + 46),
			Vector2(size.x * 0.42, horizon + 12),
			Vector2(size.x * 0.58, horizon + 42),
			Vector2(size.x * 0.74, horizon + 8),
			Vector2(size.x, horizon + 34),
			Vector2(size.x, size.y),
			Vector2(0, size.y),
		]),
		palette["far"],
	)
	draw_colored_polygon(
		PackedVector2Array([
			Vector2(-24 + sway * 0.2, horizon + 110),
			Vector2(size.x * 0.18 + sway * 0.22, horizon + 56),
			Vector2(size.x * 0.36 + sway * 0.18, horizon + 88),
			Vector2(size.x * 0.5 + sway * 0.16, horizon + 48),
			Vector2(size.x * 0.68 + sway * 0.1, horizon + 90),
			Vector2(size.x * 0.86 + sway * 0.08, horizon + 54),
			Vector2(size.x + 32, horizon + 84),
			Vector2(size.x + 32, size.y),
			Vector2(-24, size.y),
		]),
		palette["mid"],
	)

func _draw_region_backdrop(size: Vector2, horizon: float, sway: float) -> void:
	var region := str(route_data.get("region", "Lantern Reach"))
	match region:
		"Wind Archive":
			for index in 5:
				var x := size.x * (0.16 + index * 0.16) + sway * (0.15 + index * 0.03)
				var height := 84.0 + float(index % 2) * 24.0
				draw_rect(Rect2(Vector2(x, horizon - height), Vector2(26, height + 60.0)), Color(0.14, 0.17, 0.26, 0.42), true)
				draw_rect(Rect2(Vector2(x + 5, horizon - height - 24.0), Vector2(16, 20)), Color(0.78, 0.9, 0.86, 0.22), true)
		"Stormglass Wilds":
			for index in 6:
				var x := size.x * (0.1 + index * 0.15) + sway * 0.1
				draw_colored_polygon(
					PackedVector2Array([
						Vector2(x, horizon + 24),
						Vector2(x + 18, horizon - 86 - float(index % 2) * 18.0),
						Vector2(x + 36, horizon + 24),
					]),
					Color(0.78, 0.95, 0.92, 0.2),
				)
		"High Observatory":
			for index in 4:
				var x := size.x * (0.18 + index * 0.19) + sway * 0.12
				draw_circle(Vector2(x, horizon + 4), 34 + float(index) * 4.0, Color(0.17, 0.2, 0.31, 0.34))
				draw_rect(Rect2(Vector2(x - 18, horizon + 2), Vector2(36, 90)), Color(0.18, 0.2, 0.3, 0.4), true)
		_:
			for index in 6:
				var x := size.x * (0.08 + index * 0.14) + sway * 0.08
				var width := 34.0 + float(index % 2) * 12.0
				var height := 72.0 + float(index % 3) * 22.0
				draw_rect(Rect2(Vector2(x, horizon - height), Vector2(width, height + 56.0)), Color(0.18, 0.2, 0.3, 0.32), true)
				draw_colored_polygon(
					PackedVector2Array([
						Vector2(x - 6, horizon - height),
						Vector2(x + width * 0.5, horizon - height - 18),
						Vector2(x + width + 6, horizon - height),
					]),
					Color(0.22, 0.25, 0.34, 0.32),
				)

func _draw_boardwalk(size: Vector2, sway: float) -> void:
	var near_left := Vector2(size.x * 0.08, size.y * 0.9)
	var near_right := Vector2(size.x * 0.92, size.y * 0.9)
	var far_left := Vector2(size.x * 0.36 + sway * 0.08, size.y * 0.58)
	var far_right := Vector2(size.x * 0.64 + sway * 0.08, size.y * 0.58)
	draw_colored_polygon(PackedVector2Array([near_left, near_right, far_right, far_left]), Color("5a3827"))
	draw_colored_polygon(
		PackedVector2Array([
			Vector2(size.x * 0.1, size.y * 0.86),
			Vector2(size.x * 0.9, size.y * 0.86),
			Vector2(size.x * 0.63 + sway * 0.08, size.y * 0.6),
			Vector2(size.x * 0.37 + sway * 0.08, size.y * 0.6),
		]),
		palette["accent"],
	)
	draw_line(Vector2(size.x * 0.18, size.y * 0.84), Vector2(size.x * 0.41 + sway * 0.08, size.y * 0.58), Color(1, 1, 1, 0.25), 4)
	draw_line(Vector2(size.x * 0.82, size.y * 0.84), Vector2(size.x * 0.59 + sway * 0.08, size.y * 0.58), Color(1, 1, 1, 0.25), 4)
	for step in 8:
		var t := float(step) / 7.0
		var y: float = lerp(size.y * 0.83, size.y * 0.61, t)
		var left: float = lerp(size.x * 0.14, size.x * 0.4 + sway * 0.08, t)
		var right: float = lerp(size.x * 0.86, size.x * 0.6 + sway * 0.08, t)
		draw_line(Vector2(left, y), Vector2(right, y), Color(0.1, 0.07, 0.05, 0.28), 3)

func _landmark_points(size: Vector2, sway: float) -> Array:
	var points := []
	if landmarks.is_empty():
		return points
	for index in landmarks.size():
		var t: float = 0.0 if landmarks.size() <= 1 else float(index) / float(landmarks.size() - 1)
		points.append(Vector2(
			lerp(size.x * 0.22, size.x * 0.78, t) + sway * (0.12 + t * 0.08),
			lerp(size.y * 0.79, size.y * 0.49, t),
		))
	return points

func _draw_route_ribbon(points: Array) -> void:
	if points.size() < 2:
		return
	for index in points.size() - 1:
		var from_point: Vector2 = points[index]
		var to_point: Vector2 = points[index + 1]
		draw_line(from_point, to_point, Color(1.0, 0.84, 0.48, 0.2), 10)
		draw_line(from_point, to_point, Color(1.0, 0.94, 0.78, 0.9), 4)

func _draw_landmarks(points: Array, size: Vector2) -> void:
	for index in points.size():
		var point: Vector2 = points[index]
		var t: float = 0.0 if points.size() <= 1 else float(index) / float(points.size() - 1)
		var radius: float = lerp(22.0, 13.0, t)
		var landmark: Dictionary = landmarks[index]
		var kind := str(landmark.get("kind", "vista"))
		var glow := Color("ffd47a")
		if kind == "shrine":
			glow = Color("8fdbff")
		elif kind == "beacon":
			glow = Color("fff1b4")
		elif kind == "hazard":
			glow = Color("ff9b76")
		elif kind == "cache":
			glow = Color("b8f08c")
		if index < resolved.size() and bool(resolved[index]):
			draw_circle(point, radius + 15.0, glow * Color(1, 1, 1, 0.14))
		if index == current_index:
			draw_circle(point, radius + 18.0 + sin(drift_time * 2.8) * 3.0, Color("80d8ff") * Color(1, 1, 1, 0.22))
		draw_circle(point + Vector2(0, radius + 24.0), radius * 1.1, Color(0, 0, 0, 0.12))
		_draw_landmark_prop(point, radius, landmark, size)
		draw_circle(point, radius, glow)
		draw_line(point + Vector2(0, radius), point + Vector2(0, radius + 18.0), Color(1, 1, 1, 0.24), 4)

func _draw_landmark_prop(point: Vector2, radius: float, landmark: Dictionary, size: Vector2) -> void:
	var kind := str(landmark.get("kind", "vista"))
	match kind:
		"shrine":
			draw_colored_polygon(
				PackedVector2Array([
					point + Vector2(-radius * 1.8, radius * 0.8),
					point + Vector2(-radius * 1.1, -radius * 0.9),
					point + Vector2(radius * 1.1, -radius * 0.9),
					point + Vector2(radius * 1.8, radius * 0.8),
				]),
				Color(0.1, 0.18, 0.24, 0.8),
			)
		"cache":
			draw_rect(Rect2(point + Vector2(-radius * 1.4, -radius * 0.4), Vector2(radius * 2.8, radius * 1.5)), Color(0.26, 0.22, 0.12, 0.86), true)
			draw_line(point + Vector2(-radius * 1.4, radius * 0.35), point + Vector2(radius * 1.4, radius * 0.35), Color(1, 0.92, 0.72, 0.3), 2)
		"hazard":
			for spark in 3:
				var offset := Vector2(-radius + spark * radius, sin(drift_time * 4.0 + spark) * 8.0)
				draw_line(point + offset, point + offset + Vector2(radius * 0.4, -radius * 0.8), Color(1.0, 0.6, 0.35, 0.7), 2)
		"beacon":
			draw_rect(Rect2(point + Vector2(-radius * 0.6, -radius * 2.1), Vector2(radius * 1.2, radius * 2.2)), Color(0.18, 0.14, 0.08, 0.92), true)
			draw_circle(point + Vector2(0, -radius * 2.2), radius * 0.9 + sin(drift_time * 2.4) * 2.0, Color(1.0, 0.9, 0.65, 0.28))
		"vista":
			draw_line(point + Vector2(0, -radius * 1.8), point + Vector2(0, radius * 0.4), Color(0.25, 0.2, 0.14, 0.88), 3)
			draw_colored_polygon(
				PackedVector2Array([
					point + Vector2(0, -radius * 1.8),
					point + Vector2(radius * 1.3, -radius * 1.45),
					point + Vector2(0, -radius * 1.05),
				]),
				Color(1.0, 0.9, 0.66, 0.7),
			)
		_:
			draw_rect(Rect2(point + Vector2(-radius * 0.6, -radius * 1.1), Vector2(radius * 1.2, radius * 1.2)), Color(0.2, 0.18, 0.12, 0.76), true)
			draw_line(point + Vector2(-radius * 0.6, -radius * 1.1), point + Vector2(radius * 0.6, -radius * 1.8), Color(0.45, 0.38, 0.22, 0.86), 2)

func _draw_traveler(size: Vector2, sway: float) -> void:
	if landmarks.is_empty():
		return
	var hero_t: float = 0.0 if landmarks.size() <= 1 else float(current_index) / float(landmarks.size() - 1)
	var hero_pos := Vector2(
		lerp(size.x * 0.2, size.x * 0.8, hero_t) + sway * (0.12 + hero_t * 0.08),
		lerp(size.y * 0.86, size.y * 0.56, hero_t),
	)
	draw_circle(hero_pos + Vector2(0, 18), 18, Color(0, 0, 0, 0.12))
	draw_circle(hero_pos + Vector2(0, -20), 8, Color("efe2c7"))
	draw_rect(Rect2(hero_pos + Vector2(-10, -14), Vector2(20, 30)), Color("14253d"), true)
	draw_line(hero_pos + Vector2(-6, 14), hero_pos + Vector2(-10, 30), Color("14253d"), 3)
	draw_line(hero_pos + Vector2(6, 14), hero_pos + Vector2(10, 30), Color("14253d"), 3)
	draw_circle(hero_pos + Vector2(18, -22), 12 + flow, Color(1.0, 0.9, 0.6, 0.15))
	draw_circle(hero_pos + Vector2(18, -22), 7, Color("ffe1a0"))
	draw_line(hero_pos + Vector2(8, 0), hero_pos + Vector2(18, -16), Color(1.0, 0.95, 0.76, 0.55), 2)

func _draw_foreground(size: Vector2, sway: float) -> void:
	for index in 8:
		var base_x := size.x * (0.02 + index * 0.12)
		var blade_height := 30.0 + float(index % 3) * 14.0
		draw_line(
			Vector2(base_x, size.y * 0.92),
			Vector2(base_x + sway * 0.05 + 6.0, size.y * 0.92 - blade_height),
			Color(0.06, 0.1, 0.08, 0.28),
			2,
		)
