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

class BackgroundLayerer extends Background {
	constructor(dats, ...rest) {
		super(dats, ...rest);
		this.layers = dats.map(d=>backgroundFromRegistry(d, ...rest));
	}
	update() {
		this.layers.forEach(l=>l.update());
	}
	draw(...a) {
		this.layers.forEach(l=>l.draw(...a));
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

class BackgroundGradientHorizon extends Background {
	constructor(args, ...rest) {
		super(args, ...rest);
		this.colorStops = args.colorStops;
		this.width = args.width || 300
	}
	update() {
		
	}
	draw(cam) {
		let vect = new VectorPolar(this.width, -cam.rotation);
		let grad = mainCtx.createLinearGradient(cam.screenCenterX + vect.x, cam.screenCenterY + vect.y, cam.screenCenterX - vect.x, cam.screenCenterY - vect.y);
		this.colorStops.forEach(st=>grad.addColorStop(st.offset, st.color));
		mainCtx.fillStyle = grad;
		mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
	}
}
registerBackground(BackgroundGradientHorizon, "GradientHorizon");

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


class BackgroundTileImage extends BackgroundSingleImage {
	constructor(args, ...rest) {
		super(args, ...rest);
		this.tileWidth = this.spriteSheet.getWidthOf(this.spriteName) * this.scale;
		this.tileHeight = this.spriteSheet.getHeightOf(this.spriteName) * this.scale;
	}
	update() {
		
	}
	draw(cam) {//TODO actually do the maffs for the bounds
		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1; j++) {
				this.spriteSheet.drawParallax(this.spriteName, {baseX:this.baseX+i*this.tileWidth, baseY:this.baseY+j*this.tileWidth, rotation:this.rotation, parallax:this.parallax, scale:this.scale}, cam);
			}
		}
	}
}
registerBackground(BackgroundTileImage, "TileImage");