var justResized = 2;

function addResizeEvents() {
	document.addEventListener("fullscreenchange", resizeLater);

	document.addEventListener("fullscreenerror", function(e) {
		qAlert(lg("Fullscreen-Reject"));
	});

	window.addEventListener("resize", resizeLater);
}

function resizeLater() {
	justResized = 2;
}

function updateResize() {
	if (justResized == 2) {
		justResized = 0;
		var width = window.innerWidth;
		var height = window.innerHeight;
		//console.log(width, height);
		//backgroundBox.style.width = width + "px";
		//backgroundBox.style.height = height + "px";
		mainCanvas.width = width;
		mainCanvas.height = height;
		setImageSmoothing(mainCtx, false);
		if (runnee && runnee.resize)
			runnee.resize();
		this.justResized = 1;
	} else if (justResized) {
		justResized = 1;
	} else {
		justResized = 0;
	}
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