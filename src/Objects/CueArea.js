class DialogCueArea extends GameObject {
	constructor(args) {
		super();
		this.body = bodyFromRegistry(args.body);
		this.dialogue = args.dialogue;
	}
	update(stag) {
		if (this.body.intersectsAny(stag.getAllPlayers())) {
			//console.log("talk now");
			stag.startDialog(this.dialogue);
			return OBRET_REMOVE;
		}
	}
	draw() {
		/*worldCtx.strokeStyle = "#80808080";
		worldCtx.lineWidth = 4;
		worldCtx.beginPath();
		worldCtx.arc(this.body.x, this.body.y, this.radius, 0, Math.PI/2);
		worldCtx.stroke();*/
		//this.body.drawTest();
	}
}
registerObject(DialogCueArea);