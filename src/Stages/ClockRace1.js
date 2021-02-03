
class Stage60SSSS_Race extends Stage60SSSS {
	constructor() {
		var clock = new ClockPlanet({
			spriteSheet : getSpriteSheet("ClockRadGridTest"),
			spriteName : "body",
			x : SSSSS_WIDTH/2,
			y : SSSSS_WIDTH/2,
			gravRadius : Infinity,
			radGrid : [
				[0,0,0,0,0,0,0,1,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,1,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,1,1,1,1,0,0,0,1],
				[0,0,0,0,0,0,0,1,0,0,0,1],
				[0,0,0,0,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,1,1,1,1,1,1,1,1],
				[0,0,0,0,0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,0,0,0,0,1],
				[1,1,1,1,0,0,0,1,1,1,1,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,1,1,0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,1,0,0,0,1],
				[1,1,1,1,1,1,1,1,0,0,0,1],
				[0,0,0,0,0,0,0,1,0,0,0,1],
				[0,0,0,0,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[1,0,0,1,1,0,0,1,1,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[1,0,0,1,1,1,1,1,1,1,1,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,0,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[1,0,0,1,1,0,0,1,1,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,1,0,0,0,1,0,0,0,1],
				[0,0,0,0,0,0,0,1,0,0,0,1],
				[0,0,0,0,0,0,0,1,0,0,0,1],
				[1,1,1,1,1,1,1,1,0,0,0,1],
			],
			radGridRStart : 240,
			radGridRScale : 20,
			radGridThetaOffset : .5,
			deathHand : true,
		});
		var vect = new VectorPolar(clock.radiusInner, Math.PI/6);
		var player = new BasePlayer({
			footX : SSSSS_WIDTH/2 + vect.x,
			footY : SSSSS_WIDTH/2 + vect.y,
		});
		super({
			width : SSSSS_WIDTH,
			height : SSSSS_WIDTH,
			objects : [
				clock,
				player,
			],
		});
		this.clock = clock;
		this.player = player;
	}
	update() {
		super.update();
	}
	drawStop() {
		this.width = this.clock.radiusOuter*2;
		this.height = this.clock.radiusOuter*2;
		worldCanvas.width = this.width + 100;
		worldCanvas.height = this.height;
		this.clock.x = this.width/2;
		this.clock.y = this.height/2;
		worldCtx.fillStyle = "#8B6914";
		worldCtx.arc(this.clock.x, this.clock.y, this.clock.radiusOuter-1, 0, 2*Math.PI);
		worldCtx.fill();
		worldCtx.fillStyle = "#FFF8DC";
		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {
				if (this.clock.isPixelSolid(i, j))
					worldCtx.fillRect(i, j, 1, 1);
			}
		}
	}
}

class ClockPlanetDeathHand extends GameObject {
	constructor(args) {
		super();
		this.parent = args.parent;
		this.body = new RayBody({
			x : this.parent.x,
			y : this.parent.y,
			r : args.r,
			rotation : 0,
			width : 4,
		});
	}
	update(stage) {
		this.body.rotation = this.parent.time * 2*Math.PI / (60*FPS)
		stage.sendHitbox({
			source : this,
			body : this.body,
			damage : 69,
		});
	}
	draw() {
		this.body.drawTest();
		//console.log(this.body.x, this.body.y, vect.x, vect.y)
	}
}