class BackgroundGravColorSolid extends Background {
	constructor(args, ...rest) {
		super(args, ...rest);
		this.color = args.color || "#000000";
	}
	update() {
		
	}
	draw(cam) {
		mainCtx.fillStyle = getColorScint(cam.rotation / Math.PI * 0x300 + 0x300);
		mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
	}
}
registerBackground(BackgroundGravColorSolid, "GravColorSolid");

/*
 D  0 F F
 L  F F 0
 U  F 0 0
 R  0 F 0
*/
function getGravColor(rot) {
	rot = Math.round((rot / Math.PI * 2 + 4) * 0x100) % 0x400;
	if (rot < 0x100)
		return "#"+getHex2(rot)+"ff"+getHex2(0xff-rot);
	else if (rot < 0x200)
		return "#ff"+getHex2(0x1ff-rot)+"00";
	else if (rot < 0x300)
		return "#"+getHex2(0x2ff-rot)+getHex2(rot-0x200)+"00";
	else if (rot < 0x400)
		return "#00ff"+getHex2(rot-0x300);
}


function getHex2(num) {
	let str = num.toString(16);
	if (str.length < 2)
		str = "0" + str;
	return str;
}

function getColorScint(time) {
	time = Math.floor(time % (0x100 * 6));
	if (time < 0x100)
		return "#ff"+getHex2(time-0x000)+"00";
	else if (time < 0x200)
		return "#"+getHex2(0x1FF-time)+"ff00";
	else if (time < 0x300)
		return "#00ff"+getHex2(time-0x200);
	else if (time < 0x400)
		return "#00"+getHex2(0x3FF-time)+"ff";
	else if (time < 0x500)
		return "#"+getHex2(time-0x400)+"00ff";
	else
		return "#ff00"+getHex2(0x5FF-time);
}
