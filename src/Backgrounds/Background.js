class Background {
	constructor(args, stage) {
		this.stage = stage;
	}
	update() {
		
	}
}

class BackgroundNothing {
	draw() {
		
	}
}

class BackgroundSolid extends Background {
	constructor(args, ...rest) {
		super(args, ...rest);
		this.color = args.color || "#000000";
	}
	update() {
		
	}
	draw(cam) {
		mainCtx.fillStyle = this.color;
		mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
	}
}
registerBackground(BackgroundSolid, "Solid");

class BackgroundSingleImage extends Background {
	constructor(args, ...rest) {
		super(args, ...rest);
		this.spriteSheet = getSpriteSheet(args.spriteSheet);
		this.spriteName = args.spriteName || "background";
		this.parallax = args.parallax || 0;
		this.baseX = args.baseX || (this.stage.width/2 * this.parallax);
		this.baseY = args.baseY || (this.stage.height/2 * this.parallax);
		this.rotation = args.baseX || 0;
		this.scale = args.scale || 2;
	}
	update() {
		
	}
	draw(cam) {
		this.spriteSheet.drawParallax(this.spriteName, {baseX:this.baseX, baseY:this.baseY, rotation:this.rotation, parallax:this.parallax, scale:this.scale}, cam);
	}
}
registerBackground(BackgroundSingleImage, "SingleImage");