//mouse
var mouse = {
	x:NaN,
	y:0,
	clicked:false,
	down:false,
	unClick : function() {
		this.moved = false;
		this.clicked = false;
		this.rightClicked = false;
		this.middleClicked = false;
		this.wasPressed = this.pressed;
		this.lastX = this.x;
		this.lastY = this.y;
		this.movedX = 0;
		this.movedY = 0;
		this.scrolled = 0;
		this.draggedX = 0;
		this.draggedY = 0;
		this.obstructed = false;
		//console.log("bluh")
	},
	obstruct() {
		this.obstructed = true;
	}
}

function setMousePosition(clientX, clientY) {
	//var rekt = mainCanvas.getBoundingClientRect();
	//mouse.x = (clientX - rekt.x) / rekt.width * WIDTH;
	//mouse.y = (clientY - rekt.y) / rekt.height * HEIGHT;
	mouse.x = clientX;
	mouse.y = clientY;
	mouse.movedX = mouse.x - mouse.lastX;
	mouse.movedY = mouse.y - mouse.lastY;
	if (mouse.down) {
		mouse.draggedX = mouse.movedX;
		mouse.draggedY = mouse.movedY;
	}
}

var rightClickDisabled = false;

function addMouseEvents() {
	mainCanvas.addEventListener("mousemove", function(e) {
		setMousePosition(e.clientX, e.clientY);
		mouse.moved = true;
		mouse.changed = true;
	});
	
	mainCanvas.addEventListener("mousedown", function(e) {
		mouse.changed = true;
		switch (e.button) {
			case 0:
				mouse.clicked = true;
				mouse.down = true;
				break;
			case 1:
				mouse.middleClicked = true;
				mouse.middleDown = true;
				e.preventDefault();
				break;
			case 2:
				mouse.rightClicked = true;
				mouse.rightDown = true;
				break;
		}
		mouse.lastUsed = "mouse";
	});
	
	document.addEventListener("mouseup", function(e) {
		switch (e.button) {
			case 0:
				mouse.down = false;
				break;
			case 1:
				mouse.middleDown = false;
				e.preventDefault();
				break;
			case 2:
				mouse.rightDown = false;
				break;
		}
		mouse.down = false;
		mouse.clicked;
	});
	
	mainCanvas.addEventListener("mouseleave", function(e) {
		mouse.x = NaN;
		mouse.y = NaN;
	});
	
	mainCanvas.addEventListener("wheel", function(e) {
		e.preventDefault();
		mouse.scrolled += e.deltaY > 0 ? 1 : -1;
		//console.log(mouse.scrolled);
		mouse.lastUsed = "mouse";
	});
	
	mainCanvas.addEventListener("mouseclick", function (e) {
		//e.preventDefault();
	});
	
	mainCanvas.addEventListener("dblclick", function (e) {
		e.preventDefault();
	});
	
	mainCanvas.addEventListener("touchstart", function(e) {
		//if (runnee.overrideTouch) because otherwise it'll sometimes click twice and i don't know how else to fix that
			e.preventDefault();
		mouse.clicked = true;
		mouse.down = true;
		setMousePosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		mouse.lastUsed = "touch";
	});
	
	backgroundBox.addEventListener("contextmenu", function(e) {
		if (!rightClickDisabled)
			e.preventDefault();
	});
	
	mainCanvas.addEventListener("touchend", function(e) {
		if (runnee.overrideTouch)
			e.preventDefault();
		mouse.down = false;
		mouse.x = NaN;
		mouse.y = NaN;
	});
	
	mainCanvas.addEventListener("touchcancel", function(e) {
		if (runnee.overrideTouch)
			e.preventDefault();
		mouse.down = false;
		mouse.x = NaN;
		mouse.y = NaN;
	});
	
	mainCanvas.addEventListener("touchmove", function(e) {
		if (runnee.overrideTouch)
			e.preventDefault();
		setMousePosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		mouse.lastUsed = "touch";
	});
	
	document.addEventListener("fullscreenchange", resize);
	
	document.addEventListener("fullscreenerror", function(e) {
		qAlert(lg("Fullscreen-Reject"));
	});
	
	//window.addEventListener("focus", musicFocus);
	
	//window.addEventListener("blur", musicFocusOut);
	
	window.addEventListener("resize", resize);
	
	resize();
}

function disableRightClick() {
	rightClickDisabled = true;
}

function attemptFullscreen() {
	if (document.fullscreen) {
		document.exitFullscreen();
	} else {
		try {
			backgroundBox.requestFullscreen();
		} catch (e) {
			qAlert(lg("Fullscreen-Reject"));
		}
	}
}

function resize() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	//console.log(width, height);
	//backgroundBox.style.width = width + "px";
	//backgroundBox.style.height = height + "px";
	mainCanvas.width = width;
	mainCanvas.height = height;
	if (runnee && runnee.resize)
		runnee.resize();
}