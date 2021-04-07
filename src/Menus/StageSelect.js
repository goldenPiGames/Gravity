function getStageSelectData(sid) {
	return {
		lText : "Stage-"+sid,
		func : function() {
			switchScreen(new SingleStageEngine({
				stage : stageFromRegistry(sid),
				winFunc : ()=>switchScreen(new StageSelectMenu()),
				exitFunc : ()=>switchScreen(new StageSelectMenu()),
			}));
		}
	};
}

class StageSelectMenu extends SingleMenuScreen {
	constructor() {
		super({
			mainButtons : [
				...SELECTABLE_STAGES.map(s=>getStageSelectData(s)),
			],
		});
	}
}