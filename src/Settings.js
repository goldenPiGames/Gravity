var settings = {
	lang : "en",
	voiceLang : "en",
	voiceVolume : .8,
	musicVolume : .8,
	sfxVolume : .8,
	sfxTick : false,
	focusOutPause : true,
	profanity : false,
	font : "sans-serif",
	sfxSystem : "audio",
	background_color : "#000000",
	normal_color : "#FFFFFF",
	colorblind : false,
	musicDontAsk : false,
	directTouch : false,
	cameraRotateWithFocus : true,
	gamepadEnabled : true,
	initialSettingsDone : false,
	initialLangDone : false,
	ignoreBrowserWarning : false,
}

function loadSettings() {
	var loaded = localStorage.getItem("GravitySettings");
	if (loaded) {
		loaded = JSON.parse(loaded);
		for (sett in loaded) {
			settings[sett] = loaded[sett];
		}
	}
	//loadFavSongs();
	//loadPaletteFromSettings();
	applyMusicVolume();
	applyFont(settings.font);
}

function saveSettings() {
	localStorage.setItem("GravitySettings", JSON.stringify(settings));
}

function setSetting(syet, tyu) {
	settings[syet] = tyu;
	switch(syet) {
		case "musicVolume" : applyMusicVolume(); break;
		case "sfx" : applySFXVolume(); break;
	}
	saveSettings();
}

function profane() {
	return settings.profanity;
}

function doSettings() {
	runnee = new SettingsScreen();
}

function setFont(now) {
	settings.font = now;
	applyFont(settings.font);
}

function applyFont(now) {
	document.body.font = now;
	//if (inputs)
	//	inputs.forEach(i=>i.style.fontFamily=now);
}