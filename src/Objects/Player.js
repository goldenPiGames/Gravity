var player;

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
			//width : 14,
			//height : 35,
			//compressible : 17,
			slideGround : .6,
			slideAir : .95,
		});
		this.hittable = this.body;
		this.facing = args.facing;
		this.spriteSheet = getSpriteSheet("Player");
		this.drawCount = 0;
		this.drawState = "jumping";
		player = this;
	}
	update(stage) {
		//this.controller.setRelative(this.body); //TODO later: camera-relative controls
		/*if (!this.body.grounded) {
			this.height = PLAYER_NORMAL_HEIGHT;
		} else {
			this.crouching = (this.controller.crouc || isPixelSolid(this.x - this.width/2, this.y - PIXELS_PER_BLOCK - 1) || isPixelSolid(this.x + this.width/2, this.y - PIXELS_PER_BLOCK - 1) || isPixelSolid(this.x - this.width/2 + 4, this.y - 37) || isPixelSolid(this.x + this.width/2 - 4, this.y - 37)) /*&& (isPixelSolid(this.x-this.width/2, this.y + 1) || isPixelSolid(this.x+this.width/2, this.y + 1)) && !this.attacking;
		}*/
		//this.height = this.crouching ? PLAYER_CROUCH_HEIGHT : PLAYER_NORMAL_HEIGHT;
		let horiz = 0 + (this.controller.right?1:0) - (this.controller.left?1:0);//this.controller.horiz; TODO put horiz in controller
		if (horiz) {
			if (this.body.grounded) {
				this.body.selfMoveLateral({
					accel : 2 * horiz,
					//max : this.body.isCompressed() ? 5 : 2,
					max : 5,
					face : true,
				});
			} else {
				this.body.selfMoveLateral({
					accel : .75 * horiz,
					max : 6,
				});
			}
		}
		if (this.controller.jumpClicked && this.body.grounded) { //Jump
			//playSFX("Swish4");
			this.body.jump(9);
		}
		this.body.physics(stage);
		//if (this.dy >= 0 && this.lastdy < -2)
		//	playSFX("Bump");
		if (this.body.grounded) {
			if (horiz) {
				this.facing = horiz > 0;
				this.drawState = "walking";
			} else {
				this.drawState = "standing";
			}
		} else {
			this.drawState = "jumping";
			/*if (this.dy < 0) {
				if (this.drawStateLast == "crouching" || this.drawStateLast == "crawling" || this.controller.down && this.drawStateLast != "jumping" && this.drawStateLast != "crouchJumping")
					this.drawState = "crouchJumping";
				else
					this.drawState = "jumping";
			} else {
				this.drawState = "falling";
			}*/
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
		//this.body.drawTest({rads:TEST_RADS});
		this.spriteSheet.drawOnWorld(this.drawState+this.drawCount, {x:this.body.midX, y:this.body.midY, xadj:.5, yadj:.5, rotation:this.body.rotation, flipHoriz:!this.facing});
	}
	getHit(args) {
		super.getHit(args);
		playSFX("Hurt");
	}
}
registerObject(BasePlayer);
BasePlayer.prototype.controller = globalController;