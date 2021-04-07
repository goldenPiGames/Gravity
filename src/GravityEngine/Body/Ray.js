class RayBody extends Body {
	constructor(args) {
		super();
		this.x = args.x;
		this.y = args.y;
		this.r = args.r;
		this.width = args.width || 0;
		this.rotation = args.rotation || 0;
	}
	intersects(other) {
		if (!(other instanceof Body)) {
			return this.intersects(other.body);
		}
		var vect = new VectorPolar(this.r, this.rotation);
		//console.log(other.midX, this.x, vect.x, other.midY, this.y, vect.y, this.r**2);
		var t = ((other.midX - this.x) * vect.x + (other.midY - this.y) * vect.y) / this.r**2;
		//console.log(t);
		var tc = Math.max(0, Math.min(1, t));
		var closeX = this.x + vect.x * tc;
		var closeY = this.y + vect.y * tc;
		var dist = (this.x + tc*vect.x - other.midX)**2 + (this.y + tc*vect.y - other.midY)**2;
		return dist <= (this.width + other.getRadiusTowardsXY(closeX, closeY))**2;
	}
	drawTest(args = {}) {
		
		var vect = new VectorPolar(this.r, this.rotation);
		//console.log(vect)
		worldCtx.lineWidth = Math.max(this.width, 2);
		worldCtx.strokeStyle = "#FF0000";
		worldCtx.beginPath();
		worldCtx.moveTo(this.x, this.y);
		worldCtx.lineTo(this.x+vect.x, this.y+vect.y);
		worldCtx.stroke();
	}
}
registerBody(RayBody, "Ray");