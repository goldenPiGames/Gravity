class EditorSidebarMoveObject extends EditorSidebarSub {
	constructor(obj, xParam, yParam) {
		super([
			
		]);
		this.object = obj;
		this.xParam = xParam;
		this.yParam = yParam;
	}
	update(p) {
		super.update(p);
		var moveX = mouse.draggedX || 0;
		var moveY = mouse.draggedY || 0;
		if (globalController.isCommandPressedRepeating("menuLeft"))
			moveX -= globalController.menuAlt ? 20 : 1;
		if (globalController.isCommandPressedRepeating("menuRight"))
			moveX += globalController.menuAlt ? 20 : 1;
		if (globalController.isCommandPressedRepeating("menuUp"))
			moveY -= globalController.menuAlt ? 20 : 1;
		if (globalController.isCommandPressedRepeating("menuDown"))
			moveY += globalController.menuAlt ? 20 : 1;
		if (moveX || moveY) {
			this.object[this.xParam] += moveX;
			this.object[this.yParam] += moveY;
			this.object.afterMove();
		}
	}
	draw() {
		super.draw();
		drawTextInRect("X: "+this.object[this.xParam], this.x, this.y+200, this.width, 40, {fill:"#FFFFFF"});
		drawTextInRect("Y: "+this.object[this.yParam], this.x, this.y+250, this.width, 40, {fill:"#FFFFFF"});
	}
	back() {
		this.parent.switchSub(new EditorSidebarEditObject(this.object))
	}
}

class EditorPanelMove extends EditorPanel {
	constructor(object, xParam, yParam) {
		super({
			lText : "Editor-EditObject-Move",
		});
		this.object = object;
		this.xParam = xParam;
		this.yParam = yParam;
	}
	update(yarhar) {
		super.update(yarhar);
		if (this.clicked)
			yarhar.switchSub(new EditorSidebarMoveObject(this.object, this.xParam, this.yParam));
	}
	draw() {
		super.draw();
		this.drawTextNormally();
	}
}

class EditorPanelBoolean extends EditorPanel {constructor(object, args) {
		super({
			lText : args.lText || object.lText+"-"+args.param
		});
		this.object = object;
		this.param = args.param;
		this.setter = args.setter;
		this.after = args.after;
	}
	resize(...a) {
		let tret = super.resize(...a);
		this.boxWidth = Math.min(this.height, this.width/4);
		this.mainX = this.x + this.boxWidth;
		this.mainWidth = this.width - this.boxWidth;
		return tret;
	}
	update(yaro) {
		super.update(yaro);
		if (this.clicked) {
			this.object[this.param] = !this.object[this.param];
		}
	}
	draw() {
		super.draw();
		if (this.object[this.param]) {
			mainCtx.strokeStyle = "#00FF00";
			mainCtx.lineWidth = 2;
			mainCtx.beginPath();
			mainCtx.moveTo(this.x, this.y+this.height/2);
			mainCtx.lineTo(this.x+this.boxWidth/2, this.y+this.height);
			mainCtx.lineTo(this.x+this.boxWidth, this.y);
			mainCtx.stroke();
		} else {
			mainCtx.strokeStyle = "#FF0000";
			mainCtx.lineWidth = 2;
			mainCtx.beginPath();
			mainCtx.moveTo(this.x, this.y);
			mainCtx.lineTo(this.x+this.boxWidth, this.y+this.height);
			mainCtx.moveTo(this.x+this.boxWidth, this.y);
			mainCtx.lineTo(this.x, this.y+this.height);
			mainCtx.stroke();
		}
		drawTextInRect(this.text, this.mainX, this.y, this.mainWidth, this.height, {fill:"#FFFFFF"});
	}
}

class EditorPanelNumber extends EditorPanel {
	constructor(object, args) {
		super({
			lText : args.lText || object.lText+"-"+args.param
		})
		this.object = object;
		this.param = args.param;
		this.min = args.min || 0;
		this.max = args.max || 999;
		this.setter = args.setter;
		this.after = args.after;
		this.value = this.object[this.param];
		this.mouseZoneLeft = new MenuObject();
		this.mouseZoneMid = new MenuObject();
		this.mouseZoneRight = new MenuObject();
		this.mouseZones = [this.mouseZoneLeft, this.mouseZoneMid, this.mouseZoneRight];
	}
	resize(...a) {
		let tret = super.resize(...a);
		this.mouseZoneLeft.resize(this.x, 0, this.width/4, mainCanvas.height);
		this.mouseZoneMid.resize(this.x+this.width/4, 0, this.width/4, mainCanvas.height);
		this.mouseZoneRight.resize(this.x+this.width*3/4, 0, this.width/4, mainCanvas.height);
		return tret;
	}
	update(berk) {
		super.update(berk);
		if (this.hovered) {
			this.mouseZones.forEach(z=>z.update());
			let before = this.object[this.param];
			let after = before;
			if (globalController.isCommandPressedRepeating("menuLeft")) {
				after -= globalController.menuAlt ? 20 : 1;
			}
			if (globalController.isCommandPressedRepeating("menuRight")) {
				after += globalController.menuAlt ? 20 : 1;
			}
			if (this.mouseZoneLeft.mouseClicked)
				after -= 1;
			if (this.mouseZoneRight.mouseClicked)
				after += 1;
			if (after < this.min)
				after = this.min;
			if (after > this.max)
				after = this.max;
			if (after != before) {
				if (this.setter) {
					this.setter(after);
				} else {
					this.object[this.param] = after;
				}
				if (this.after)
					this.after(after);
				this.value = after;
				this.hitEdge = this.value == this.min || this.value == this.max;
			}
		}
	}
	draw() {
		super.draw();
		if (this.hovered) {
			drawTextInRect(this.value, this.x, this.y, this.width, this.height, {fill:this.hitEdge?"#FF8080":"#B0FFFF"});
		} else {
			this.drawTextNormally();
		}
	}
}