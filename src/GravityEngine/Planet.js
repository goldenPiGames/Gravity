class Planet {
	constructor(args) {
		this.x = args.x;
		this.y = args.y;
		this.radius = args.radius;
		this.radius2 = args.radius**2;
		this.gravRadius = args.gravRadius || args.radius*2;
		this.gravity = args.gravity || 0.5;
		this.priority = args.priority || 3;
		this.spriteSheet = args.spriteSheet;
		this.spriteName = args.spriteName;
		this.solidColor = args.solidColor;
		this.radGrid = args.radGrid;
		if (this.radGrid) {
			this.radGridRStart = args.radGridRStart;
			this.radiusInner = this.radGridRStart;
			this.radiusInner2 = this.radiusInner**2;
			this.radGridRScale = args.radGridRScale;
			this.radiusOuter = this.radGridRStart + this.radGrid[0].length * this.radGridRScale;
			this.radiusOuter2 = this.radiusOuter**2;
			this.radGridThetaScale = 2*Math.PI / this.radGrid.length;
			this.radGridThetaOffset = args.radGridThetaOffset || 0;
		}
	}
	isPixelSolid(x, y) {
		if (this.radGrid) {
			var r2 = (x-this.x)**2 + (y-this.y)**2;
			//console.log(x, this.x, x-this.x, (x-this.x)**2, y, this.y, y-this.y, (y-this.y)**2, r2)
			if (r2 > this.radiusOuter2) {
				return false;
			} else if (r2 < this.radiusInner2) {
				return true;
			} else {
				var v = new VectorRect(x-this.x, y-this.y);
				//console.log(v)
				var rC = Math.floor((v.r - this.radiusInner) / this.radGridRScale);
				var tC = Math.floor(v.theta / this.radGridThetaScale - this.radGridThetaOffset);
				while (tC < 0)
					tC += this.radGrid.length;
				//console.log(x, y, tC, rC)
				return this.radGrid[tC][rC];
			}
		} else {
			return (x-this.x)**2 + (y-this.y)**2 < this.radius2;
		}
	}
	getGravityAtPixel(x, y) {//TODO vector bullshit
		if ((x-this.x)**2 + (y-this.y)**2 < this.gravRadius**2)
			return new UnitVector(this.x-x, this.y-y).setR(this.gravity).setPriority(this.priority)
	}
	update(stage) {
		
	}
	draw() {
		
	}
	drawStatic() {
		if (this.spriteSheet) {
			this.spriteSheet.drawOnStaticWorld(this.spriteName, {x:this.x, y:this.y, xadj:.5, yadj:.5});
		} else if (this.solidColor) {
			staticWorldCtx.fillStyle = this.solidColor;
			staticWorldCtx.beginPath();
			staticWorldCtx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
			staticWorldCtx.fill();
		}
	}
}
registerObject(Planet);