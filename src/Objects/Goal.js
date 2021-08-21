const GOALPOST_RIFT_LINE_RANDOMNESS = 3;

class Goalpost extends GameObject {
	constructor(args) {
		super(args);
		this.body = new RayBody(args.body || args);
		this.skin = args.skin || "Rift";
		switch (args.skin) {
			case "Flag":
				this.sprites = getSpriteSheet("GoalpostFlag");
				this.drawSkin = this.drawFlag;
				break;
			case "Rift": default: 
				//this.sprites = getSpriteSheet("GoalpostRift");
				this.drawSkin = this.drawRift;
				break;
		}
	}
	update(stag) {
		if (this.body.intersectsAny(stag.getAllPlayers())) {
			stag.touchGoal(this);
		}
	}
	draw() {
		this.drawSkin();
	}
	drawRift() {
		//this.body.drawTest();
		worldCtx.lineWidth = 2;
		worldCtx.lineJoin = "round";
		worldCtx.strokeStyle = this.color || "#000000";
		let vect = new VectorPolar(this.body.r, this.body.rotation);
		let sx = this.body.x;
		let sy = this.body.y;
		let vx = vect.x;
		let vy = vect.y;
		worldCtx.beginPath();
		worldCtx.moveTo(sx, sy);
		for (var i = .05; i < 1; i += .05) {
			worldCtx.lineTo(sx + vx * i - GOALPOST_RIFT_LINE_RANDOMNESS * (.5 - Math.random()), sy + vy * i - GOALPOST_RIFT_LINE_RANDOMNESS * (.5 - Math.random()));
		}
		worldCtx.lineTo(sx + vx, sy + vy);
		worldCtx.stroke();
	}
	drawFlag() {//yes, this is incapable of drawing accurately at angles other than 0. no, i do not care. i can change it later
		var r = this.body.r;
		this.sprites.drawOnWorld("flag0", {x:this.body.x, y:this.body.y-r, xadj:0, yadj:0});
		this.sprites.drawOnWorld("postTop", {x:this.body.x, y:this.body.y-r, xadj:0.5, yadj:0});
		r -= this.sprites.getHeightOf("postTop");
		let hit = this.sprites.getHeightOf("postMid");
		while (r >= hit) {
			this.sprites.drawOnWorld("postMid", {x:this.body.x, y:this.body.y-r, xadj:0.5, yadj:0});
			r -= hit;
		}
		this.sprites.drawOnWorld("postBase", {x:this.body.x, y:this.body.y, xadj:0.5, yadj:1});
	}
}
registerObject(Goalpost, "Goalpost");

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