function doDemo(dats) {
	pControllers = pControllers.filter(c=>!(c instanceof DemoController));
	pControllers.push(new DemoController(dats));
}

class DemoController extends Controller {
	constructor(dats) {
		super();
		this.list = dats;
		this.index = 0;
	}
	updateBefore() {
		if (this.index >= this.list.length)
			this.die();
		if (!this.dead) {
			this.current = this.list[this.index];
			COMMAND_LIST.forEach(com => {
				this[com] = this.current[com];
				this[com+"Clicked"] = this.current[com+"Clicked"];
			});
		}
		this.index++;
		//console.log(this.rightClicked);
	}
	die() {
		COMMAND_LIST.forEach(com => {
			this[com] = false;
			this[com+"Clicked"] = false;
		});
		this.dead = true;
	}
}