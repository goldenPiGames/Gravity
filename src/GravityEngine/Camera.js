var ZOOM_MIN = .5;
var ZOOM_MAX = 3;
var ZOOM_SPEED = .05;
var CAMERA_MOVE_MIN = 1.4;
var CAMERA_MOVE_PORTION = .20;
var CAMERA_ROTATE_MIN = .010;
var CAMERA_ROTATE_PORTION = .20;
var CAMERA_ZOOM_STEP_MIN = .025;
var CAMERA_ZOOM_STEP_PORTION = .35;
var CAMERA_LOOK_FORWARD = 0;
const CAMERA_CONTROL_SPEED = 12;

class Camera {
	constructor(stage) {
		this.stage = stage;
		this.destZoom = stage.startZoom || 1;
		this.zoom = this.destZoom;
		this.rotation = 0;
		this.destRotation = 0;
		this.hasSetInitialPosition = false;
	}
	resize(right) {
		this.setScreenCenter((right || mainCanvas.width)/2, mainCanvas.height/2);
		if (!this.hasSetInitialPosition) {
			this.setInitialPosition();
			this.hasSetInitialPosition = true;
		}
	}
	setInitialPosition() {
		this.destX = this.screenCenterX;
		this.destY = this.screenCenterY;
		this.centerX = this.destX;
		this.centerY = this.destY;
	}
	setScreenCenter(x, y) {
		this.screenCenterX = x;
		this.screenCenterY = y;
	}
	update() {
		this.moveDest();
		this.move();
		this.moveMouse();
	}
	move() {
		var posDif = new VectorRect(this.destX - this.centerX, this.destY - this.centerY);
		if (posDif.r <= CAMERA_MOVE_MIN/this.zoom) {
			this.centerX = this.destX;
			this.centerY = this.destY;
		} else {
			posDif.multiply(CAMERA_MOVE_PORTION);
			if (posDif.r < CAMERA_MOVE_MIN/this.zoom)
				posDif.setR(CAMERA_MOVE_MIN/this.zoom);
			this.centerX += posDif.x;
			this.centerY += posDif.y;
		}
		if (this.rotation != this.destRotation) {
			let rotationDif = angleDifference(this.rotation, this.destRotation);
			if (rotationDif > Math.PI - .01 && this.focusObject.facing == false)
				rotationDif -= 2*Math.PI;
			if (Math.abs(rotationDif) <= CAMERA_ROTATE_MIN)
				this.rotation = this.destRotation;
			else if (rotationDif < 0)
				this.rotation -= Math.max(-rotationDif * CAMERA_ROTATE_PORTION, CAMERA_ROTATE_MIN);
			else
				this.rotation += Math.max(rotationDif * CAMERA_ROTATE_PORTION, CAMERA_ROTATE_MIN);
			if (this.rotation < 0)
				this.rotation += 2 * Math.PI;
		}
		if (this.zoom != this.destZoom) {
			let zoomStep = Math.log2(this.zoom);
			let destZoomStep = Math.log2(this.destZoom);
			let zoomStepDif = destZoomStep - zoomStep;
			if (Math.abs(zoomStepDif) <= CAMERA_ZOOM_STEP_MIN)
				this.zoom = this.destZoom;
			else {
				if (zoomStepDif < 0)
					zoomStep -= Math.max(-zoomStepDif * CAMERA_ZOOM_STEP_PORTION, CAMERA_ZOOM_STEP_MIN);
				else
					zoomStep += Math.max(zoomStepDif * CAMERA_ZOOM_STEP_PORTION, CAMERA_ZOOM_STEP_MIN);
				this.zoom = 2**zoomStep;
			}
		}
		if (this.controller.zoomIn)
			this.zoom = Math.min(this.zoom+ZOOM_SPEED, ZOOM_MAX);
		if (this.controller.zoomOut)
			this.zoom = Math.max(this.zoom-ZOOM_SPEED, ZOOM_MIN);
	}
	snapToDest() {
		this.centerX = this.destX;
		this.centerY = this.destY;
		this.rotation = this.destRotation;
	}
	draw() {
		clearWorld();
		this.stage.background.draw(this);
		this.stage.drawWorld(this.engine, worldCtx);//TODO is engine actually used?
		this.transfer();
	}
	transfer() {
		setImageSmoothing(mainCtx, this.zoom < 1);
		mainCtx.translate(Math.floor(this.screenCenterX), Math.floor(this.screenCenterY));
		mainCtx.rotate(-this.rotation);
		mainCtx.drawImage(worldCanvas, -this.centerX * this.zoom, -this.centerY * this.zoom, worldCanvas.width*this.zoom, worldCanvas.height*this.zoom);
		mainCtx.setTransform(1, 0, 0, 1, 0, 0);
	}
	rotateCW(amount) {
		this.rotation += amount;
	}
	doManualZoom() {
		var zooming;
		if (this.controller.cameraZoomInClicked)
			zooming = 1;
		else if (this.controller.cameraZoomOutClicked)
			zooming = -1;
		if (zooming) {
			var currStep = Math.round(Math.log2(this.destZoom)*2);
			this.destZoom = Math.SQRT2**(currStep+zooming);
		}
	}
	moveMouse() {
		this.mouseX = this.screenToWorldX(mouse.x);
		this.mouseY = this.screenToWorldY(mouse.y);
	}
	screenToWorldX(x) {//TODO account for zoom
		return this.centerX + (x - this.screenCenterX) / this.zoom;
	}
	screenToWorldY(y) {
		return this.centerY + (y - this.screenCenterY) / this.zoom;
	}
	worldToScreenX(x) {
		return this.screenCenterX + (x - this.centerX) * this.zoom;
	}
	worldToScreenY(y) {
		return this.screenCenterY + (y - this.centerY) * this.zoom;
	}
	getControlOffset(tings) {
		return tings - this.destRotation;
	}
}
Camera.prototype.controller = globalController;

class FollowingCamera extends Camera {
	constructor(...punch) {
		super(...punch);
		this.rotateWithFocus = settings.cameraRotateWithFocus;
	}
	moveDest() {
		if (this.focusObject) {
			let lf = this.focusObject.getLookForward(this);
			this.focusX = Math.round(this.focusObject.getCameraX() + lf.x * CAMERA_LOOK_FORWARD);
			this.focusY = Math.round(this.focusObject.getCameraY() + lf.y * CAMERA_LOOK_FORWARD);
			this.destX = this.focusX;
			this.destY = this.focusY;
			if (globalController.cameraToggleRotateClicked) {
				settings.cameraRotateWithFocus = !settings.cameraRotateWithFocus;
				saveSettings();
				this.rotateWithFocus = settings.cameraRotateWithFocus;
			}
			if (this.rotateWithFocus) {
				this.destRotation = this.focusObject.getCameraRotation();
			} else {
				this.destRotation = 0;
			}
		}
		this.doManualZoom();
	}
	setFocus(ting) {
		this.focusObject = ting;
		if (this.stage.time <= 1)
			this.snapToFocus();
		this.focusObject.camera = this;
	}
	snapToFocus() {
		this.moveDest();
		this.snapToDest();
		this.hasSetInitialPosition = true;
	}
}

class DraggableCamera extends Camera {
	moveDest() {
		if (mouse.middleDown) {
			this.destX -= mouse.movedX || 0;
			this.centerX -= mouse.movedX || 0;
			this.destY -= mouse.movedY || 0;
			this.centerY -= mouse.movedY || 0;
		} else {
			var vect = globalController.getCameraVector();
			this.destX = Math.round(this.destX + vect.x * CAMERA_CONTROL_SPEED);
			this.destY = Math.round(this.destY + vect.y * CAMERA_CONTROL_SPEED);
		}
		this.doManualZoom();
	}
}

class FixedCamera extends Camera {
	moveDest() {
		
	}
}

class AttractCamera extends Camera {
	constructor(stage, args) {
		super(stage);
		this.cycle = -Math.PI;
		this.cycleSpeed = .02;
	}
	resize() {
		super.resize();
		let stageWidth = this.stage.width;
		let stageHeight = this.stage.height;
		let canvasWidth = mainCanvas.width;
		let canvasHeight = mainCanvas.height;
		if (canvasWidth >= stageWidth) {
			this.needMoveX = false;
			this.destX = stageWidth/2;
			this.centerX = stageWidth/2;
			this.screenCenterX = canvasWidth - stageWidth/2;//TODO make alignment adjustible
		} else {
			this.needMoveX = true;
			this.minX = canvasWidth/2;
			this.maxX = stageWidth - canvasWidth/2;
			this.midX = (this.maxX + this.minX) / 2;
			this.varX = this.maxX - this.midX;
		}
		if (canvasHeight >= stageHeight) {
			this.needMoveY = false;
			this.destY = stageHeight/2;
			this.centerY = stageHeight/2;
			this.screenCenterY = stageHeight/2;//TODO make alignment adjustible
		} else {
			this.needMoveY = true;
			this.minY = canvasHeight/2;
			this.maxY = stageHeight - canvasHeight/2;
			this.midY = (this.maxY + this.minY) / 2;
			this.varY = this.maxY - this.midY;
		}
		this.moveDest();
		this.snapToDest();
		this.hasSetInitialPosition = false;
	}
	moveDest() {
		/*if (this.atDest) {
			this.destX = 
		}*/
		this.cycle = (this.cycle + this.cycleSpeed);
		if (this.needMoveX)
			this.destX = this.midX + this.varX * Math.cos(this.cycle);
		if (this.needMoveY)
			this.destY = this.midY + this.varY * Math.sin(this.cycle);
		//this.moveHard();
	}
}

class MultiFocus {
	constructor(list) {
		this.list = list;
	}
	update() {
		this.x = this.list.reduce((acc, cur) => acc + cur.x, 0) / this.list.length;
		this.y = this.list.reduce((acc, cur) => acc + cur.y, 0) / this.list.length;
	}
}