class Ugosign extends GameObject {
	constructor(args) {
		super(args);
		this.sprites = getSpriteSheet(args.sprites);
		this.midX = args.midX;
		this.midY = args.midY;
		this.scale = args.scale || 1;
		if (args.rotation == "upside-down")
			this.rotation = Math.PI;
		else
			this.rotation = args.rotation;
		this.timer = 0;
		this.frameDelays = this.sprites.data._frameDelays;
		this.cycleLength = this.frameDelays.reduce((a,c)=>a+c);
	}
	update(stag) {
		
	}
	draw() {
		this.timer = (this.timer + 1) % this.cycleLength;
		this.sprites.drawOnWorld(this.getSpriteName(), {x:this.midX, y:this.midY, xadj:.5, yadj:.5, scale:this.scale, rotation:this.rotation});
	}
	getSpriteName() {
		let tim = this.timer;
		return "frame" + this.frameDelays.findIndex(f => (tim -= f) <= 0);
	}
}
registerObject(Ugosign, "Ugosign");

class UgosignControl extends Ugosign {
	getSpriteName() {
		return super.getSpriteName() + getControllerType();
	}
}
registerObject(UgosignControl, "UgosignControl");