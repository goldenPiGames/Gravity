class startLevelEditor() {
	switchScreen(new EditorEngine());
}

class EditorEngine {
	constructor(stage) {
		if (!stage || !(stage instanceof Stage)) {
			stage = new Stage(Stage);
		}
	}
}

class StageEditing {
	constructor(stuff) {
		if (!stuff) {
			stuff = {
				width : 800,
				height : 600,
				objects : [
					{
						object : "BasePlayer",
						midX : 50,
						midY : 50,
					},
					{
						object : "Planet",
						midX : 50,
						midY : 50,
					},
				]
			}
		}
	}
}

class EditorObject {
	constructor(args) {
		this.name = name;
	}
	updateSelected() {
		if (this.controlPoints) {
			this.controlPoints.forEach(p=>p.update());
		}
	}
	draw() {
		
	}
}

class EditorControlPoint {
	constructor(parent, xParam, yParam) {
		this.parent = parent;
		this.xParam = param;
		this.yParam = param;
	}
	update() {
		this.x = this.parent[this.xParam];
		this.y = this.parent[this.yParam];
	}
}

class PlanetEditor extends EditorObject {
	constructor(args) {
		super(args);
		this.controlPoints = new EditorControlPoint(this, "x", "y");
	}
	update() {
		super.update();
	}
	draw() {
		
	}
}