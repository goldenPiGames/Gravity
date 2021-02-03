class Meteor extends GameObject {
	constructor(args) {
		super();
		this.body = new UprightEllipseBody({
			midX : args.x,
			midY : args.y,
			width : 20,
			height : 20,
			doesGravity : 1,
		});
		//console.log(this.body.midX, this.body.midY)
		this.facing = args.facing;
		this.speed = args.speed;
		this.spriteSheet = getSpriteSheet("Meteor");
	}
	update(stage) {
		this.body.physics(stage);
		if (this.body.doesGravity) {
			var vel = new VectorRect(this.body.dx, this.body.dy).setR(this.speed);
			this.body.dx = vel.x;
			this.body.dy = vel.y;
			this.body.doesGravity = false;
		}
		if (stage.sendHitbox({
			source : this,
			body : this.body,
			damage : 1,
		}).length > 0 || this.body.grounded) {//only accounts for collision with floors
			stage.addObject(new MeteorExplosion(this));
			return OBRET_REMOVE;
		}
		this.drawCount++;
		if (!this.spriteSheet.data["falling"+this.drawCount])
			this.drawCount = 0;
	}
	draw() {
		this.spriteSheet.drawOnWorld("falling"+this.drawCount, {x:this.body.midX, y:this.body.midY, xadj:.5, yadj:.5, rotation:this.body.rotation});
	}
}

class MeteorExplosion extends GameObject {
	constructor(met) {
		super();
	}
	update() {
		return OBRET_REMOVE;
	}
	draw() {
		
	}
}