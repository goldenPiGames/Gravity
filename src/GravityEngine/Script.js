class Script {
	constructor(mlep) {
		for (var myum in mlep) {
			if (typeof this[myum] != "function")
				this[myum] = mlep[myum];
		}
	}
	execute(stage) {
		let func = SCRIPTS[this.what];
		if (!func) {
			console.log(this.what + " is not a scripting function.");
		} else {
			func(this, stage);
		}
	}
}

const SCRIPTS = {
	"dialog" : function(args, stage) {
		stage.startDialog(args.dialog);
	},
	"scriptDelay" : function(args, stage) {
		stage.addObject(new ScriptDelayer(args.script. args.time));
	},
	"scriptCancel" : function(args, stage) {
		stage.scripts[args.script].cancel();
	},
	"addObject" : function(args, stage) {
		stage.addObject(objectFromRegistry(args.object));
	}
}

class ScriptDelayer extends GameObject {
	constructor(script, time) {
		super();
		this.script = script;
		this.time = time;
	}
	update() {
		this.time--;
		if (this.time <= 0) {
			return OBRET_REMOVE
		}
	}
	draw() {
		
	}
}