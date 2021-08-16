var MENU_CURSOR_MOVE_MIN = 3;
var MENU_CURSOR_MOVE_PORTION = .40;

class MenuCursor extends MenuThing {
	constructor(menu) {
		super();
		this.menu = menu;
		this.resetPositionOut();
		this.sprites = getSpriteSheet("Cursor");
	}
	update()  {
		//console.log(mouse.changed)
		if (globalController.isCommandPressedRepeating("menuUp")) {
			this.menu.hover(this.menu.hovered.connectUp);
		}
		if (globalController.isCommandPressedRepeating("menuDown")) {
			this.menu.hover(this.menu.hovered.connectDown);
		}
		if (globalController.isCommandPressedRepeating("menuLeft")) {
			this.menu.hover(this.menu.hovered.connectLeft);
		}
		if (globalController.isCommandPressedRepeating("menuRight")) {
			this.menu.hover(this.menu.hovered.connectRight);
		}
		this.hovered = this.menu.hovered;
	}
	draw() {
		var lastHovered = this.hovered;
		this.hovered = this.menu.hovered;
		if (this.hovered) {
			let rect = this.hovered.getCursorRect();
			this.destLeft = rect.x;
			this.destRight = rect.x + rect.width;
			this.destUp = rect.y;
			this.destDown = rect.y + rect.height;
			this.currLeft = this.boundIn(this.currLeft, this.destLeft);
			this.currRight = this.boundIn(this.currRight, this.destRight);
			this.currUp = this.boundIn(this.currUp, this.destUp);
			this.currDown = this.boundIn(this.currDown, this.destDown);
			//mainCtx.lineWidth = 2;
			//mainCtx.strokeStyle = "#FFFFFF";
			//mainCtx.strokeRect(this.currLeft, this.currUp, this.currRight - this.currLeft, this.currDown - this.currUp);
			this.sprites.drawOnMain("UpRight", {x:this.currRight, y:this.currUp, xadj:1, yadj:0});
			this.sprites.drawOnMain("DownLeft", {x:this.currLeft, y:this.currDown, xadj:0, yadj:1});
			this.sprites.drawOnMain("DownRight", {x:this.currRight, y:this.currDown, xadj:1, yadj:1});
			this.sprites.drawOnMain("UpLeft", {x:this.currLeft, y:this.currUp, xadj:0, yadj:0});
		}
	}
	boundIn(curr, dest) {
		let diff = dest - curr;
		if (Math.abs(diff) < MENU_CURSOR_MOVE_MIN)
			return dest;
		else
			return curr + diff * MENU_CURSOR_MOVE_PORTION;
	}
	resetPositionOut() {
		this.currLeft = 0;
		this.currUp = 0;
		this.currRight = mainCanvas.width;
		this.currDown = mainCanvas.height;
	}
}