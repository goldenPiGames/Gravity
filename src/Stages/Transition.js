const STAGES_60SSSS = [
	Stage60SSSS_Race,
	Stage60SSSS_Meteor,
]

const TRANSITION_DISTANCE = 690;

class SolarSystemEngine extends SingleStageEngine {
	constructor(index = 0) {
		super(new STAGES_60SSSS[index](), new HUD60());
		this.index = index;
	}
	update() {
		super.update();
		if (this.stage.time >= 60*FPS) {
			this.win();
		} if (this.stage.player.hp <= 0) {
			this.lose();
		}
	}
	draw() {
		super.draw();
	}
	win() {
		//runnee = new SolarSystemEngine((this.index+1) % STAGES_60SSSS.length);
		runnee = new SolarSystemTransitionOut(this, (this.index+1) % STAGES_60SSSS.length);
	}
	lose() {
		runnee = new SolarSystemEngine(this.index);
	}
}

class SolarSystemTransitionOut {
	constructor(from, index) {
		//super();
		this.engine = from;
		this.player = this.engine.stage.player;
		this.index = index;
		this.fromX = this.player.body.midX;
		this.fromY = this.player.body.midY;
		var vect = new VectorPolar(TRANSITION_DISTANCE, this.player.body.rotation);
		this.spaceX = vect.x;
		this.spaceY = vect.y;
		this.completion = 0;
	}
	update() {
		this.completion += .02;
		var spaceMult = this.completion;
		this.player.body.midX = this.fromX + this.spaceX * spaceMult;
		this.player.body.midY = this.fromY + this.spaceY * spaceMult;
		if (this.completion > 1) {
			runnee = new SolarSystemTransitionIn(this.index, this.player);
		}
	}
	draw() {
		this.engine.draw();
	}
}

class SolarSystemTransitionIn {
	constructor(to) {
		//super();
		if (typeof to == "number") {
			this.engine = new SolarSystemEngine(to);
		} else {
			this.engine = to;
		}
		this.player = this.engine.stage.player;
		this.toX = this.player.body.midX;
		this.toY = this.player.body.midY;
		var vect = new VectorPolar(TRANSITION_DISTANCE, this.player.body.rotation);
		this.spaceX = vect.x;
		this.spaceY = vect.y;
		console.log(this.spaceX, this.spaceY);
		//this.toRotation = this.player.body.rotation;
		this.completion = 0;
	}
	update() {
		this.completion += .02;
		var spaceMult = 1 - (this.completion);
		this.player.body.midX = this.toX + this.spaceX * spaceMult;
		this.player.body.midY = this.toY + this.spaceY * spaceMult;
		//console.log(this.player.body.midX, this.player.body.midY)
		if (this.completion > 1) {
			runnee = this.engine;
			this.player.body.midX = this.toX;
			this.player.body.midY = this.toY;
		}
	}
	draw() {
		this.engine.draw();
	}
}