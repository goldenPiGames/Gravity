class CustomVector {
	copy() {
		var newv = new CustomVector();
		newv.x = this.x;
		newv.y = this.y;
		newv.r = this.r;
		newv.theta = this.theta;
	}
	clone() {
		return new VectorClone(this);
	}
	rotate(by) {
		this.theta += by;
		this.mirrorPolarToRect();
		return this;
	}
	setR(to) {
		this.r = to;
		this.mirrorPolarToRect();
		return this;
	}
	capR(to) {
		if (this.r > to)
			this.setR(to);
		return this;
	}
	multiply(by) {
		this.r *= by;
		this.x *= by;
		this.y *= by;
		return this;
	}
	add(other) {
		this.x += other.x;
		this.y += other.y;
		this.mirrorRectToPolar();
		return this;
	}
	subtract(other) {
		this.x -= other.x;
		this.y -= other.y;
		this.mirrorRectToPolar();
		return this;
	}
	setX(to) {
		this.x = to;
		this.mirrorRectToPolar();
		return this;
	}
	setY(to) {
		this.y = to;
		this.mirrorRectToPolar();
		return this;
	}
	mirrorPolarToRect() {
		this.x = this.r*Math.sin(this.theta);
		this.y = -this.r*Math.cos(-this.theta);
		if (Math.abs(this.x) < .00001)
			this.x = 0;
		if (Math.abs(this.y) < .00001)
			this.y = 0;
		return this;
	}
	mirrorRectToPolar() {
		this.r = (this.x**2+this.y**2)**.5;
		this.theta = Math.atan2(this.x, -this.y);
		if (Math.abs(this.r - 1.0) < .00001)
			this.r = 1;
		return this;
	}
	setPriority(p) {
		this.priority = p;
		return this;
	}
	dot(other) {
		return dotproduct(this, other);
	}
	closeEnough(other, diff) {
		return (Math.abs(other.x - this.x) <= diff && Math.abs(other.y - this.y) <= diff);
	}
}

class UnitVector extends CustomVector {
	constructor(arg0, arg1) {
		super();
		if (arg1 === undefined) {
			this.theta = arg0;
			this.r = 1;
			this.mirrorPolarToRect();
		} else {
			this.x = arg0;
			this.y = arg1;
			this.mirrorRectToPolar();
			this.setR(1);
		}
	}
}

class VectorPolar extends CustomVector {
	constructor(r, theta) {
		super();
		this.r = r;
		this.theta = theta;
		this.mirrorPolarToRect();
	}
}

class VectorRect extends CustomVector {
	constructor(x, y) {
		super();
		this.x = x;
		this.y = y;
		this.mirrorRectToPolar();
	}
}

class VectorClone extends CustomVector {
	constructor(from) {
		super();
		this.x = from.x;
		this.y = from.y;
		this.r = from.r;
		this.theta = from.theta;
	}
}

function cancelVectorUnit(before, normal) {
	var dotp = dotproduct(before, normal);
	return new VectorRect(before.x - normal.x * dotp, before.y - normal.y * dotp);
}

function cancelVectorNormal(before, normal) {
	var dotp = dotproduct(before, normal);
	//var dotp = before.x * normal.x + before.y * normal.y;
	//console.log(before, normal, dotp)
	if (dotp > 0)
		return before;
	return new VectorRect(before.x - normal.x * dotp, before.y - normal.y * dotp);
}

function dotproduct(a, b) {
	return a.x * b.x + a.y * b.y;
}

function angleDifference(a, b) {
	let c = (b - a) % (2*Math.PI);
	if (c < Math.PI)
		c += 2*Math.PI
	if (c > Math.PI)
		c -= 2*Math.PI;
	return c;
}