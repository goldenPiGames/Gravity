function nextStartup() {
	if (!settings.initialSettingsDone)
		switchScreen(new LangSelectMenu())
	else {
		switchScreen(new MainMenu());
	}
}