var player;
const GRAVITY_CHANGE_SFX_THRESHOLD = .6

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
		this.hittable = this.body;
		this.facing = args.facing || true;
		this.spriteSheet = getSpriteSheet("Player");
		this.drawCount = 0;
		requireSFX("HDMI", 2);
		requireSFX("Sprocket", 2);
		//requireSFX("DrawerThump", 2);
		this.drawState = "jumping";
		player = this;
		this.recording = "";
	}
	control() {
		var left = this.controller.left;
		var right = this.controller.right;
		this.ctrlMove = 0 + (right?1:0) - (left?1:0);//this.controller.getHoriz(); TODO put horiz in controller for camera and gamepad stuff
		this.ctrlJump = this.controller.jumpClicked;
		let toadd = (left?"L":"") + (right?"R":"") + (this.ctrlJump?"J":"") + ",";
		this.recording += toadd;
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
			playSFX("HDMI");
			this.body.jump(9);
		}
		var wasGrounded = this.body.grounded;
		this.body.physics(stage);
		if (this.body.grounded && !wasGrounded) { //Landing sound
			//playSFX("DrawerThump");//TODO find another sound effect for landing
		}
		if (Math.abs(angleDifference(this.body.rotation, lastRotation)) >= GRAVITY_CHANGE_SFX_THRESHOLD) { //Turning sound
			playSFX("Sprocket");
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
		playSFX("Hurt");
	}
}
registerObject(BasePlayer, "Player");
BasePlayer.prototype.controller = globalController;

class DemoPlayer extends BasePlayer {
	constructor(args) {
		super(args);
		this.scriptIndex = 0;
		this.script = args.script.split(",");
	}
	control() {
		var now = this.script[this.scriptIndex];
		this.ctrlMove = 0 + (now.includes("R")?1:0) - (now.includes("L")?1:0);
		this.ctrlJump = now.includes("J");
		this.scriptIndex++;
	}
	update(prongs) {
		let c = super.update(prongs);
		if (this.scriptIndex >= this.script.length)
			return OBRET_REMOVE;
		else
			return c;
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