class Goalpost extends GameObject {
	constructor(args) {
		super(args);
		this.body = new RayBody(args.body || args);
	}
	update(stag) {
		if (this.body.intersectsAny(stag.getAllPlayers())) {
			stag.touchGoal(this);
		}
	}
	draw() {
		this.body.drawTest();
	}
}
registerObject(Goalpost);

class GoalpostEditor extends EditorObject {
	constructor(args) {
		super(args);
		this.x = args.x;
		this.y = args.y;
		this.r = args.r;
		this.rotation = args.rotation;
	}
	draw() {
		new RayBody(this).drawTest();//TODO this is probably stupid
	}
	getEditorPanels() {
		return [
			new EditorPanelMove(this, "x", "y"),
			new EditorPanelNumber(this, {
				param : "r",
				min : 40,
				max : 255,
			}),
		];
	}
	getJSON() {
		return {
			object : "Goalpost",
			x : this.x,
			y : this.y,
			r : this.r,
			rotation : this.rotation,
		};
	}
}
registerEditor(GoalpostEditor, "Goalpost", {
	getNewArgs : cam=>({
		x : cam.centerX,
		y : cam.centerY,
		r : 60,
	})
});