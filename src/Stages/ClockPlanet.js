const SSSSS_WIDTH = 1600;

class Stage60SSSS extends Stage {
	constructor(args) {
		super(args);
		//loadSFX("Tick1", 2);
	}
	update() {
		if (this.time % FPS == 0 && settings.sfxTick) {
			playSFX("Tick1");
		}
		if (this.player.hp < 0)
			this.lost = true;
		super.update();
	}
}

class Stage60SSSS_Meteor extends Stage60SSSS {
	constructor() {
		var clock = new ClockPlanet({
			spriteSheet : getSpriteSheet("Clock160brown"),
			spriteName : "body",
			x : SSSSS_WIDTH/2,
			y : SSSSS_WIDTH/2,
			radius : 80,
			gravRadius : Infinity,
		});
		var player = new BasePlayer({
			midX : SSSSS_WIDTH/2,
			footY : SSSSS_WIDTH/2 - clock.radius,
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
		if (this.time % (FPS*5) == 0 && this.hittables && this.hittables.length >= 1) {
			var d = new UnitVector(this.player.body.midX - this.clock.x, this.player.body.midY - this.clock.y);
			//console.log(d)
			this.addObject(new Meteor({
				x : SSSSS_WIDTH/2 + 599*d.x,
				y : SSSSS_WIDTH/2 + 599*d.y,
				speed : 6,
			}));
		} else if (this.time % 10 == 0) {
			var d = Math.random()*2*Math.PI;
			this.addObject(new Meteor({
				x : SSSSS_WIDTH/2 + 600*Math.sin(d),
				y : SSSSS_WIDTH/2 + 600*Math.cos(d),
				speed : 6,
			}));
		}
		super.update();
	}
}
//Stage60SSSS

class ClockPlanet extends Planet {
	constructor(args) {
		super(args);
		if (args.deathHand) {
			this.hand = new ClockPlanetDeathHand({
				parent : this,
				r : this.radiusOuter - 20 || SSSSS_WIDTH*Math.SQRT2,
			});
		}
	}
	update(stage) {
		this.time = stage.time;
		super.update(stage);
		if (this.hand) {
			this.hand.update(stage);
		}
	}
	draw(...stuff) {
		super.draw(...stuff);
		this.drawHand();
	}
	drawHand() {
		if (this.hand) {
			this.hand.draw();
		} else if (this.spriteSheet.data.hand) {
			var rotation = this.time * 2*Math.PI / (60*FPS)
			this.spriteSheet.drawOnWorld("hand", {x:this.x, y:this.y, xadj:.5, yadj:.5, rotation:rotation});
		}
	}
}