var player;
const GRAVITY_CHANGE_SFX_THRESHOLD = .6;
const GRAVITY_CHANGE_TURN_THRESHOLD = 2;

class BasePlayer extends Mob {
	constructor(args) {
		super({
			maxhp : 3,
		});
		this.body = new CircleBody({
			midX : args.midX,
			midY : args.midY,
			footX : args.footX,
			footY : args.footY,
			width : 16,
			slideGround : .6,
			slideAir : .95,
		});
		this.body.doesTwosideEscape = 1;
		this.hittable = this.body;
		this.facing = args.facing || true;
		this.spriteSheet = getSpriteSheet("Player");
		this.drawCount = 0;
		requireSFX("HDMI", 2);
		requireSFX("Sprocket", 2);
		//requireSFX("DrawerThump", 2);
		this.drawState = "jumping";
	}
	update(stage) {
		this.control();
		let horiz = this.ctrlMove;
		var lastRotation = this.body.rotation;
		if (horiz) {
			if (this.body.grounded) {
				this.body.selfMoveLateral({
					accel : 2 * horiz,
					max : 5,
					//face : true,
				});
			} else {
				this.body.selfMoveLateral({
					accel : .75 * horiz,
					max : 6,
				});
			}
		}
		if (this.ctrlJump && this.body.grounded) { //Jump
			this.playSFX("HDMI");
			this.body.jump(9);
		}
		var wasGrounded = this.body.grounded;
		this.body.physics(stage);
		if (this.body.grounded && !wasGrounded) { //Landing sound
			//this.playSFX("DrawerThump");//TODO find another sound effect for landing
		}
		let gravityChange = Math.abs(angleDifference(this.body.rotation, lastRotation))
		if (gravityChange >= GRAVITY_CHANGE_SFX_THRESHOLD) { //Turning sound
			this.playSFX("Sprocket");
			if (gravityChange >= GRAVITY_CHANGE_TURN_THRESHOLD) {
				this.facing = !this.facing;
			}
			//console.log(this.body.velocity.y);
		}
		//States for drawing
		if (this.body.grounded) {
			if (horiz) {
				this.facing = horiz > 0;
				this.drawState = "walking";
			} else {
				this.drawState = "standing";
			}
		} else {
			this.drawState = "jumping";
		}
		if (this.drawStateLast == this.drawState) {
			this.drawCount++;
			if (!this.spriteSheet.data[this.drawState+this.drawCount])
				this.drawCount = 0;
		} else {
			this.drawCount = 0;
		}
		this.drawStateLast = this.drawState;
	}
	draw() {
		if (this.dontDraw)
			return;
		this.spriteSheet.drawOnWorld(this.drawState+this.drawCount, {x:this.body.midX, y:this.body.midY, xadj:.5, yadj:.5, rotation:this.body.rotation, flipHoriz:!this.facing});
	}
	getHit(args) {
		super.getHit(args);
		this.playSFX("Hurt");
	}
	playSFX(snom) {
		playSFX(snom);
	}
	getLookForward(cam) {
		return new VectorPolar(1, this.body.rotation + Math.PI / 2 * (this.facing ? 1 : -1));
	}
}

class ActualPlayer extends BasePlayer {
	constructor(args) {
		super(args);
		player = this;
		this.recording = "";
		this.musicVar = args.musicVar;
	}
	control() {
		//var left = this.controller.left;
		//var right = this.controller.right;
		this.ctrlMove = this.controller.getHoriz(this.camera ? this.camera.getControlOffset(this.body.rotation) : 0);
		//this.ctrlMove = 0 + (right?1:0) - (left?1:0);//this.controller.getHoriz(); TODO put horiz in controller for camera and gamepad stuff
		this.ctrlJump = this.controller.jumpClicked;
		let toadd = (this.ctrlMove<0?"L":"") + (this.ctrlMove>0?"R":"") + (this.ctrlJump?"J":"") + ",";
		this.recording += toadd;
	}
	draw(...a) {
		super.draw(...a)
		if (this.musicVar)
			this.varMusic();
	}
	varMusic() {
		let r = this.body.rotation;
		switch (this.musicVar) {
			case "X2": setMusicVar(Math.floor((r / Math.PI * 2 + 4.5)) % 2); return;
			case "-": setMusicVar(Math.floor((r / Math.PI + 4.5)) % 2); return;
		}
	}
}
registerObject(ActualPlayer, "Player");
ActualPlayer.prototype.controller = globalController;

class DemoPlayer extends BasePlayer {
	constructor(args) {
		super(args);
		this.scriptIndex = 0;
		this.script = [];
		this.setScript(args.script);
	}
	setScript(bleh) {
		if (typeof bleh == "string")
			this.script = bleh.split(",");
	}
	control() {
		var now = this.script[this.scriptIndex];
		this.ctrlMove = 0 + (now.includes("R")?1:0) - (now.includes("L")?1:0);
		this.ctrlJump = now.includes("J");
		this.scriptIndex++;
	}
	update(prongs) {
		let c = super.update(prongs);
		if (this.scriptIndex >= this.script.length || this.body.midX != this.body.midX)
			return OBRET_REMOVE;
		else
			return c;
	}
	playSFX() {
		
	}
}
registerObject(DemoPlayer, "DemoPlayer");

class PlayerEditor extends EditorObject {
	constructor(args) {
		super(args);
		this.midX = args.midX;
		this.midY = args.midY;
		this.spriteSheet = getSpriteSheet("Player");
	}
	update() {
		super.update();
	}
	draw() {
		//console.log("b");
		this.spriteSheet.drawOnWorld("standing0", {x:this.midX, y:this.midY, xadj:.5, yadj:.5, rotation:0, flipHoriz:false});
	}
	getEditorPanels() {
		return [
			new EditorPanelMove(this, "midX", "midY"),
		];
	}
	getJSON() {
		return {
			object : "Player",
			midX : this.midX,
			midY : this.midY,
		};
	}
}
PlayerEditor.prototype.deletable = false;
registerEditor(PlayerEditor, "Player");