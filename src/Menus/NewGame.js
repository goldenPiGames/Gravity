function selectNewGame() {
	startTutorial();
	//switchScreen(new SingleStageEngine(new DemoStageGrid()));
	//switchScreen(new EpisodeSelectScreen());
}

class NewGameMenu extends MenuScreen {
	constructor() {
		super({
			mainButtons : [
				{
					lText : "Episode-Tutorial",
					func : function() {
						switchScreen(new GameEngine({
							controller : getController(NormalKeyboardController),
							episode : new EpisodeTutorial(),
						}));
					}
				},
				{
					lText : "Episode-First",
					func : function() {
						switchScreen(new GameEngine({
							controller : getController(NormalKeyboardController),
							episode : new EpisodeFirst(),
						}));
					}
				},
			],
		});
		this.sprites = getSpriteSheet("MainMenu");
		this.flowY = 0;
		this.flowFirst = true;
		this.buttonIndex = 0;
	}
}