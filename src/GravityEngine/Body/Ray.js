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
		var vect = new VectorPolar(this.r, this.rotation);
		//console.log(other.midX, this.x, vect.x, other.midY, this.y, vect.y, this.r**2);
		var t = ((other.midX - this.x) * vect.x + (other.midY - this.y) * vect.y) / this.r**2;
		//console.log(t);
		if (t < 0 || t > 1)
			return false;
		return (this.x + t*vect.x - other.midX)**2 + (this.y + t*vect.y - other.midY)**2 <= (this.width + other.radius)**2;
	}
	drawTest(args = {}) {
		
		var vect = new VectorPolar(this.r, this.rotation);
		//console.log(vect)
		worldCtx.lineWidth = Math.max(this.width, 1);
		worldCtx.strokeStyle = "#FF0000";
		worldCtx.beginPath();
		worldCtx.moveTo(this.x, this.y);
		worldCtx.lineTo(this.x+vect.x, this.y+vect.y);
		worldCtx.stroke();
	}
}