var ZOOM_MIN = .5;
var ZOOM_MAX = 3;
var ZOOM_SPEED = .05;
const CAMERA_CONTROL_SPEED = 12;

class Camera {
	constructor(stage) {
		this.stage = stage;
		this.zoom = 1;
		this.rotation = 0;
		this.setScreenCenter();
		this.centerX = this.screenCenterX;
		this.centerY = this.screenCenterY;
	}
	setScreenCenter(x, y) {
		this.screenCenterX = x || mainCanvas.width/2;
		this.screenCenterY = y || mainCanvas.height/2;
	}
	update() {
		this.move();
		this.moveMouse();
	}
	move() {
		if (this.focusObject) {
			this.focusX = Math.round(this.focusObject.getCameraX());
			this.focusY = Math.round(this.focusObject.getCameraY());
			this.centerX = this.focusX;
			this.centerY = this.focusY;
			if (this.rotateWithFocus) {
				this.focusRotation = this.focusObject.getCameraRotation();
				let rotationDif = angleDifference(this.rotation, this.focusRotation);
				if (rotationDif > Math.PI - .01 && this.focusObject.facing == false)
					rotationDif -= 2*Math.PI;
				if (Math.abs(rotationDif) <= .004)
					this.rotation = this.focusRotation;
				else if (rotationDif < 0)
					this.rotation -= Math.max(-rotationDif * .18, .006);
				else
					this.rotation += Math.max(rotationDif * .18, .006);
			}
		}
		if (this.controller.zoomIn)
			this.zoom = Math.min(this.zoom+ZOOM_SPEED, ZOOM_MAX);
		if (this.controller.zoomOut)
			this.zoom = Math.max(this.zoom-ZOOM_SPEED, ZOOM_MIN);
	}
	draw() {
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
	setFocus(ting) {
		this.focusObject = ting;
		this.centerX = this.focusObject.getCameraX();
		this.centerY = this.focusObject.getCameraX();
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
}
Camera.prototype.rotateWithFocus = true;
Camera.prototype.controller = globalController;

class DraggableCamera extends Camera {
	move() {
		if (mouse.middleDown) {
			this.centerX -= mouse.movedX || 0;
			this.centerY -= mouse.movedY || 0;
		} else {
			var vect = globalController.getCameraVector();
			this.centerX = Math.round(this.centerX + vect.x * CAMERA_CONTROL_SPEED);
			this.centerY = Math.round(this.centerY + vect.y * CAMERA_CONTROL_SPEED);
		}
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