class CircleBody extends Body {
	constructor(args) {
		super();
		this.radius = args.radius || (args.diameter || args.height || args.width)/2;
		this.rotation = args.rotation || 0;
		if (args.footX && args.footY) {
			var vect = new VectorPolar(this.radius, this.rotation);
			this.midX = args.footX + vect.x;
			this.midY = args.footY + vect.y;
		} else {
			this.midX = args.midX;
			this.midY = args.midY || args.footY - args.height/2;//doesn't like getting 0, should probably fix
		}
		this.slideGround = args.slideGround || 0;
		this.slideAir = args.slideAir || 1;
		this.groundTolerance = args.groundTolerance || Math.PI/4;
		this.dx = 0;
		this.dy = 0;
		this.doesGravity = args.doesGravity == undefined ? 1 : args.doesGravity;
	}
	physics(stage) {
		this.checkGrounded(stage);
		this.attemptMove(stage);
		//console.log(this.grounded)
		var grav = stage.getGravityAtPixel(this.getCenterX(), this.getCenterY())
		this.rotation = grav.theta-Math.PI;
		if (this.grounded && !this.allowJumpNext) {
			var hypothesis = new HypotheticalCircleBody(this);
			hypothesis.attemptMove(stage, {dx:grav.x*STAY_GROUNDED_MULT, dy:grav.y*STAY_GROUNDED_MULT});
			if (hypothesis.checkGrounded) {
				this.midX = hypothesis.midX;
				this.midY = hypothesis.midY;
				this.setRelativeDY(this.getRelativeDY()/STAY_GROUNDED_MULT)
			}
		}
		this.allowJumpNext = false;
		this.unOverlap(stage);
		if (this.doesGravity && !this.checkGrounded(stage)) {
			this.dx += grav.x * this.doesGravity;
			this.dy += grav.y * this.doesGravity;
		}
		
		if (Math.abs(this.dx) < 1e-4)
			this.dx = 0;
		if (Math.abs(this.dy) < 1e-4)
			this.dy = 0;
		//console.log("Before:", this.getRelativeDX())
		this.setRelativeDX(this.getRelativeDX() * (this.grounded ? this.slideGround : this.slideAir));
		//console.log("After:", this.getRelativeDX())
		//if you're grounded, try to stay grounded, even if moving on round planets
	}
	attemptMove(stage, args = {}) {
		var own = true;
		var dx = this.dx;
		if (typeof args.dx == "number") {
			dx = args.dx;
			own = false;
		}
		var dy = this.dy;
		if (typeof args.dy == "number") {
			dy = args.dy;
			own = false;
		}
		if (!dx && !dy)
			return false;
		let bx = this.midX;
		//console.log("Before:", this.midX, this.midY, dx, dy);
		//console.log(dx, dy)
		var loops = 0;
		var stepped = 0;
		var baseStepLength = 1 / Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / (args.stepSize || MIN_SOLID_SIZE));
		//console.log(baseStepLength)
		var stepLength = baseStepLength;
		while (stepped < 1.0 && loops < 69) {
			//console.log(stepLength);
			loops++;
			var hypothesis = new HypotheticalCircleBody(this);
			hypothesis.midX = this.midX + dx * stepLength;
			hypothesis.midY = this.midY + dy * stepLength;
			var norms = hypothesis.checkCollideNormals(stage);
			if (!norms || norms.length < 1) {
				stepped += stepLength;
				this.midX = hypothesis.midX;
				this.midY = hypothesis.midY;
			} else if (stepLength*(dx*dx+dy*dy) < MAX_REAL_STEP_2) {
				var newv = new VectorRect(dx, dy);
				for (var i = 0; i < norms.length; i++) {
					newv = cancelVectorNormal(newv, norms[i]);
				}
				dx = newv.x;
				dy = newv.y;
				if (own) {
					this.dx = dx;
					this.dy = dy;
				}
				stepLength = Math.min(baseStepLength, 1-stepped);
			} else {
				stepLength /= 2;
			}
		}
		//console.log(loops)
		if (loops >= 69) {
			//console.log("reached the failsafe, probably a problem")
			this.unOverlap(stage, 1)
		}
		//console.log("After:", this.midX, this.midY, this.dx, this.dy);
		//console.log("Change:", this.midX-bx)
	}
	checkCollideNormal(stage, out = 0) {
		for (var t = -Math.PI; t <= Math.PI; t += Math.PI/8) {
			if (this.isEdgeSolid(stage, t, out))
				return new UnitVector(this.rotation+t-Math.PI);
		}
		return false;
	}
	checkCollideNormals(stage, out = 0) {
		var toret = [];
		for (var t = -Math.PI; t <= Math.PI; t += Math.PI/8) {
			if (this.isEdgeSolid(stage, t, out))
				toret.push(new UnitVector(this.rotation+t-Math.PI));
		}
		return toret;
	}
	unOverlap(stage, out=0) {
		var norm = this.checkCollideNormal(stage, out);
		if (norm) {
			this.midX += norm.x;
			this.midY += norm.y;
		}
	}
	getCenterX() {
		return this.midX;
	}
	getCenterY() {
		return this.midY;
	}
	getRTowards(x, y) {
		//TODO actually account for being elliptical
		return this.radius;
	}
	//is pixel solid relative inner from bottom
	isEdgeSolid(stage, relAngle, out) {//TODO actually account for rotation
		return stage.isPixelSolid(this.getEdgeX(relAngle, out), this.getEdgeY(relAngle, out));
	}
	getEdgeX(relAngle, out = 0) {
		return this.midX + (this.radius+out)*Math.sin(relAngle)*Math.cos(this.rotation) + (this.radius+out)*Math.cos(relAngle)*Math.sin(this.rotation);
	}
	getEdgeY(relAngle, out = 0) {
		return this.midY + (this.radius+out)*Math.sin(relAngle)*Math.sin(this.rotation) - (this.radius+out)*Math.cos(relAngle)*Math.cos(this.rotation);
	}
	checkGrounded(stage) {
		for (var i = 0; i < this.groundTolerance; i+=Math.PI/8) {
			if (this.isEdgeSolid(stage, Math.PI+i, 1) || this.isEdgeSolid(stage, Math.PI-i, 1)) {
				//console.log("y")
				this.grounded = true;
				return true;
			}
		}
		//console.log("n")
		this.grounded = false;
		return false;
	}
	getRelativeDX() {
		return new VectorRect(this.dx, this.dy).rotate(-this.rotation).x;
		//return this.dx;
	}
	getRelativeDY() {
		return new VectorRect(this.dx, this.dy).rotate(-this.rotation).y;
	}
	setRelativeDX(nu) {
		var newv = new VectorRect(this.dx, this.dy).rotate(-this.rotation).setX(nu).rotate(this.rotation);
		this.dx = newv.x;
		this.dy = newv.y;
	}
	setRelativeDY(nu) {
		var newv = new VectorRect(this.dx, this.dy).rotate(-this.rotation).setY(nu).rotate(this.rotation);
		this.dx = newv.x;
		this.dy = newv.y;
	}
	/*getCenterY() {
		return this.footY - this.height/2;
	}
	getBottomY() {
		return this.footY;
	}*/
	selfMoveLateral(args) {
		//console.log(args)
		//console.log(this.grounded)
		var reldx = this.getRelativeDX();
		if (reldx + args.accel < -args.max || reldx + args.accel > args.max)
			return;
		//console.log(-args.max, reldx + args.accel, args.max, Math.max(-args.max, Math.min(reldx + args.accel, args.max)));
		this.setRelativeDX(Math.max(-args.max, Math.min(reldx + args.accel, args.max)))
		//console.log("Before:", reldx, " After:", this.getRelativeDX());
	}
	jump(speed) {
		this.setRelativeDY(-Math.abs(speed));
		this.allowJumpNext = true;
	}
	intersects(other) {
		//TODO if I have kinds of body other than ellipse, I'll need to add some switch statements or something
		var dist2 = (this.midX-other.midX)**2+(this.midY-other.midY)**2;
		var reach2 = (this.getRTowards(other.midX, other.midY) + other.getRTowards(this.midX, this.midY))**2;
		return dist2 <= reach2;
	}
	drawTest(args = {}) {
		worldCtx.fillStyle = args.color || "#FF0000";
		worldCtx.beginPath();
		worldCtx.ellipse(this.midX, this.midY, this.radius, this.radius, this.rotation, 0, 2*Math.PI);
		worldCtx.fill();
		worldCtx.fillStyle = args.radColor || "#0000FF";
		if (args.rads) {
			args.rads.forEach(rad => {
				worldCtx.beginPath();
				//console.log(this.midX, this.midY, rad, this.getEdgeX(rad), this.getEdgeY(rad));
				worldCtx.arc(this.getEdgeX(rad), this.getEdgeY(rad), 3, 0, 2*Math.PI);
				worldCtx.fill();
			});
		}
	}
}

class HypotheticalCircleBody extends CircleBody {
	
}