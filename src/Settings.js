var settings = {
	lang : "en",
	music : .8,
	sfx : .8,
	sfxTick : false,
	focusOutPause : true,
	profanity : false,
	font : "sans-serif",
	sfxSystem : "audio",
	background_color : "#000000",
	normal_color : "#FFFFFF",
	colorblind : false,
	musicDontAsk : false,
}

function loadSettings() {
	var loaded = localStorage.getItem("60SSSSSettings");
	if (loaded) {
		loaded = JSON.parse(loaded);
		for (sett in loaded) {
			settings[sett] = loaded[sett];
		}
	}
	//loadFavSongs();
	//loadPaletteFromSettings();
	//setMusicVolume(settings.music);
	applyFont(settings.font);
}

function saveSettings() {
	localStorage.setItem("60SSSSSettings", JSON.stringify(settings));
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