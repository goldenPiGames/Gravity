const CIRCLE_BODY_NORMAL_CHECKS = 16;
var CIRCLE_BODY_MOVE_BEFORE = .5;

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
		this.velocity = new VectorRect(0, 0);
		this.doesGravity = args.doesGravity == undefined ? 1 : args.doesGravity;
	}
	physics(stage) {
		this.checkGrounded(stage);
		//console.log(this.midY);
		//this.attemptMove(stage, null, {stepSize:2, doGravity:this.doesGravity});
		
		for (var i = 0; i < 4; i++)//quarter steps like sm64, thanks pannenkoek
			this.velocity = this.attemptMove(stage, this.velocity.clone().multiply(1/4), {stepSize:2, doesGravity:1/4}).multiply(4);
		
		//console.log(this.midY);
		var grav = stage.getGravityAtPixel(this.getCenterX(), this.getCenterY(), this, this.object)
		this.rotation = grav.theta-Math.PI;
		if (this.grounded && !this.allowJumpNext) { //if you're grounded, try to stay grounded, even if moving on small round planets
			this.attemptStayGrounded(stage);
		}
		this.allowJumpNext = false;
		this.unOverlap(stage);
		if (this.doesGravity && !this.checkGrounded(stage)) {
			//console.log(this.velocity);
			this.velocity.add(grav.clone().multiply(this.doesGravity));
			//console.log(this.velocity);
		}
		
		/*if (Math.abs(this.dx) < 1e-4)
			this.dx = 0;
		if (Math.abs(this.dy) < 1e-4)
			this.dy = 0;*/
		//console.log("Before:", this.getRelativeDX())
		this.setRelativeDX(this.getRelativeDX() * (this.grounded ? this.slideGround : this.slideAir));
		//console.log("After:", this.getRelativeDX())
	}
	attemptMove(stage, invect, args = {}) {
		var vect = invect;
		//if (vect.r == 0)
			//return false;
		//console.log("Before:", this.midX, this.midY, dx, dy);
		//console.log(dx, dy)
		//if (!(this instanceof DemoPlayer)) console.log(vect)
		var loops = 0;
		var stepped = 0;
		var baseStepLength = Math.min(1 / Math.ceil(Math.max(Math.abs(vect.x), Math.abs(vect.y)) / (args.stepSize || MIN_SOLID_SIZE)), 1);
		//console.log(baseStepLength)
		var stepLength = baseStepLength;
		while (stepped < 1.0 && loops < 69) {
			//console.log(stepLength);
			loops++;
			var hypothesis = new HypotheticalCircleBody(this);
			let mvect = vect.clone().multiply(stepLength);
			hypothesis.midX = this.midX + mvect.x;
			hypothesis.midY = this.midY + mvect.y;
			var norms = hypothesis.checkCollideNormals(stage);
			if (!norms || norms.length < 1) {
				stepped += stepLength;
				this.midX = hypothesis.midX;
				this.midY = hypothesis.midY;
			} else if (mvect.r < MAX_REAL_STEP_2) {
				for (var i = 0; i < norms.length; i++) {
					vect = cancelVectorNormal(vect, norms[i]);
				}
				stepLength = Math.min(baseStepLength, 1-stepped);
			} else {
				stepLength /= 2;
			}
		}
		//console.log(loops)
		if (loops >= 69) {
			//console.log("reached the failsafe, probably a problem")
			this.unOverlap(stage, 1);
		}
		return vect;
		//console.log("After:", this.midX, this.midY, this.dx, this.dy);
		//console.log("Change:", this.midX-bx)
	}
	attemptMoveOmnistep(stage, invect, args = {}) {//An experimental version of attemptMove that doesn't work quier right.
		var own;
		var vect;
		if (invect) {
			own = false;
			vect = invect;
		} else {
			own = true;
			vect = this.velocity;
		}
		//if (vect.r <= 0)
			//return;
		var vectStart = vect.clone();
		var yStart = this.midY;
		
		var loops = 0;
		var stepped = 0;
		var baseStepLength = Math.min(1, 1 / Math.ceil(Math.max(Math.abs(vect.x), Math.abs(vect.y)) / (args.stepSize || MIN_SOLID_SIZE)));
		var stepLength = baseStepLength;
		while (stepped < 1.0 && loops < 69) {
			//console.log(stepLength);
			loops++;
			var hypothesis = new HypotheticalCircleBody(this);
			var mvect = vect.clone().multiply(stepLength);
			if (args.doGravity) {
				var gravBefore = stage.getGravityAtPixel(this.midX, this.midY, this, this.object);
				let gravBeforeH = gravBefore.clone().multiply(stepLength*CIRCLE_BODY_MOVE_BEFORE);
				var gravAfter = stage.getGravityAtPixel(hypothesis.midX, hypothesis.midY, hypothesis, this.object);
				mvect.add(gravBeforeH);
			}
			hypothesis.midX = this.midX + mvect.x;
			hypothesis.midY = this.midY + mvect.y;
			//throw "up";
			var norms = hypothesis.checkCollideNormals(stage);
			var obstructed = norms && norms.length >= 1;
			if (obstructed) {//smack your face against the solid object. losing the appropriate momentum
				if (mvect.r < MAX_REAL_STEP_2) {
					for (var i = 0; i < norms.length; i++) {
						vect = cancelVectorNormal(vect, norms[i]);
					}
					stepLength = Math.min(baseStepLength, 1-stepped);
				} else {
					stepLength /= 2;
				}
			} else if (args.doGravity && !gravBefore.closeEnough(gravAfter, MAX_REAL_STEP_2)) {
				if (mvect.r < MAX_REAL_STEP_2) {
					stepped += stepLength;
					this.midX = hypothesis.midX;
					this.midY = hypothesis.midY;
					stepLength = Math.min(baseStepLength, 1-stepped);
				} else {
					stepLength /= 2;
				}
			} else { //move on uninterrupted because it's clear and there's no gravity changes
				stepped += stepLength;
				this.midX = hypothesis.midX;
				this.midY = hypothesis.midY;
				if (args.doGravity) {
					vect.add(gravAfter.clone().multiply(stepLength));//.add(gravBeforeH);
				}
				stepLength = Math.min(baseStepLength, 1-stepped);
			}
		}
		if (own)
			this.velocity = vect;
		if (this.dyLog)
			this.dyLog.push(vect.y);
		//console.log(loops)
		
		console.log(vect.y - vectStart.y, this.midY - yStart);
		
		if (loops >= 69) {
			//console.log("reached the failsafe, probably a problem")
			this.unOverlap(stage, 1)
		}
		this.snapToIntPixel(MAX_REAL_STEP_2);
	}
	attemptStayGrounded(stage) {
		var hypothesis = new HypotheticalCircleBody(this);
		hypothesis.attemptMove(stage, stage.getGravityAtPixel(hypothesis.getCenterX(), hypothesis.getCenterY(), hypothesis, this.object).clone().multiply(STAY_GROUNDED_MULT));
		if (hypothesis.checkGrounded(stage)) {
			this.midX = hypothesis.midX;
			this.midY = hypothesis.midY;
			this.setRelativeDY(this.getRelativeDY()/STAY_GROUNDED_MULT);
			return true;
		} else
			return false;
	}
	checkCollideNormal(stage, out = 0) {
		return this.checkCollideNormals(stage, out)[0];
	}
	checkCollideNormals(stage, out = 0) {
		var toret = [];
		for (var t = -Math.PI; t <= Math.PI; t += Math.PI*2/CIRCLE_BODY_NORMAL_CHECKS) {
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
	snapToIntPixel(tolerance = MAX_REAL_STEP_2) {
		if (Math.abs(this.midX - Math.round(this.midX)) <= tolerance)
			this.midX = Math.round(this.midX);
		if (Math.abs(this.midY - Math.round(this.midY)) <= tolerance)
			this.midY = Math.round(this.midY);
	}
	noteTwosideEscape(dir, to, grabbity, stacks = 0) {
		//console.log("TwosideEscape", dir, to);
		//return;
		var diff;
		var vel;
		var grav;
		if (dir == "up" || dir == "down") {
			if (dir == "up")
				diff = to - this.midY - this.radius;
			else
				diff = to - this.midY + this.radius;
			vel = this.velocity.y;
			grav = grabbity.y;
		}
		var missed = willMissJump(diff, vel, grav);
		//console.log(missed);
		if (missed) {
			this.velocity.add(grabbity.clone().multiply(-.02));
			if (stacks < 10)
				this.noteTwosideEscape(dir, to, grabbity, stacks + 1);
		}
		/*max = vel**2/2/(-grav);
		var max;
		var rmax = 0;
		var velspec = vel;
		var dist = 0;
		while (
		if (diff < 0) {
			diff = -diff;
			max = -max;
		}
		console.log((max-diff).toFixed(3), diff.toFixed(3), max.toFixed(3));*/
	}
	getCenterX() {
		return this.midX;
	}
	getCenterY() {
		return this.midY;
	}
	getRTowards(x, y) {
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
		return this.velocity.clone().rotate(-this.rotation).x;
	}
	getRelativeDY() {
		return this.velocity.clone().rotate(-this.rotation).y;
	}
	setRelativeDX(nu) {
		this.velocity.rotate(-this.rotation).setX(nu).rotate(this.rotation);
	}
	setRelativeDY(nu) {
		this.velocity.rotate(-this.rotation).setY(nu).rotate(this.rotation);
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
		if (!(other instanceof Body)) {
			return this.intersects(other.body);
		}
		//TODO if I have kinds of body other than ellipse, I'll need to add some switch statements or something
		var dist2 = (this.midX-other.midX)**2+(this.midY-other.midY)**2;
		var reach2 = (this.getRTowards(other.midX, other.midY) + other.getRTowards(this.midX, this.midY))**2;
		return dist2 <= reach2;
	}
	getRadiusTowardsXY(x, y) {
		return this.radius;
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
registerBody(CircleBody, "Circle");

function willMissJump(height, velocity, gravity) {
	if (height < 0) {
		height = -height;
		velocity = -velocity;
		gravity = -gravity;
	}
	while (true) {//TODO maybe write an equation for this?
		velocity += gravity/4;
		height -= velocity/4;
		//console.log(height, velocity, gravity)
		if (height < 0)
			return false;
		if (velocity < 0)
			return height;
	}
}

class HypotheticalCircleBody extends CircleBody {
	
}