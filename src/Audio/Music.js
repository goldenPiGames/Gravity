//this.particles.push(new MusicInfoBar(name));
const MUSIC_MAX_VARS = 2;
var music;
var musicElems;
var songName;
var song;
var musicIsAlt;
const MUSIC_STOP = "STOP RIGHT THERE, CRIMINAL SCUM!";
//var canPlayOgg = !!(music.canPlayType && music.canPlayType('audio/ogg; codecs="vorbis"'));

function initMusic() {
	musicElems = [];
	for (var i = 0; i < MUSIC_MAX_VARS; i++) {
		musicElems[i] = document.getElementById("Music"+i);
		musicElems[i].volume = settings.musicVolume;
	}
	music = musicElems[0];
	setMusicShuffle(false);
	//setMusicShuffle(jukeboxSpecs.shuffle);
}

function playMusic(sin) {
	if (!music) {
		//return;
	}
	if (typeof sin == "number")
		sin = SONG_LIST[sin];
	if (sin == MUSIC_STOP || !sin) {
		music.pause();
		return;
	}
	if (typeof sin == "string") {
		let sinname = sin;
		sin = SONG_HASH[sin];
		if (!sin) {
			throwMaybe(sinname + " is not a song");
			music.pause();
			return;
		}
	}
	//console.log(sin, song, music.src, sin.src)
	if (sin == song && sin == songLast) {
		if (music.paused && !settings.muted)
			music.play();
		return;
	}
	if (song)
		song.leftOff = music.currentTime;
	song = sin;
	songLast = sin;
	songVar = 0;
	//music.volume = settings.musicVolume;
	music.pause();
	if (settings.musicVolume && !settings.muted) {
		music = musicElems[songVar];
		song.srcs.forEach((s, i) => musicElems[i].src = s);
		music.play();
	}
}

function setMusicVar(a) {
	if (a != songVar) {
		songVar = a;
		let musicOld = music;
		let musicNew = musicElems[songVar];
		music = musicNew;
		musicNew.currentTime = musicOld.currentTime;
		musicOld.pause();
		musicNew.play();
	}
}

function playMusicFromLeftOff(sin) {
	let justSong = song;
	playMusic(sin);
	if (song != justSong) {
		//console.log(song.leftOff)
		music.currentTime = song.leftOff || 0;
	}
}

function playMusicFromStart(sin) {
	let justSong = song;
	playMusic(sin);
	if (song != justSong) {
		//console.log(song.leftOff)
		music.currentTime = 0;
	}
}

/*function switchMusic() {
	if (song.alt) {
		var tim = music.currentTime;
		musicIsAlt = !musicIsAlt;
		var unsce = songName.replace(/\s/g, "");
		var end = "mp3"//(canPlayOgg && song.ogg) ? "ogg" : "mp3";
		music.src = "src/Music/" + unsce+(musicIsAlt ? "_Alt" : "") + "." + end;
		music.currentTime = tim;
		music.play();
	}
}*/

function setMusicShuffle(val) {
	if (val) {
		if (typeof music.loop == 'boolean') {
			musicElems.forEach(m => m.loop = false);
		} else {
			musicElems.forEach(m => m.removeEventListener('ended', awkwardLoopSubstitute, false));
		}
		musicElems.forEach(m => m.addEventListener('ended', shuffleMusic, false));
	} else {
		musicElems.forEach(m => m.removeEventListener('ended', shuffleMusic, false));
		if (typeof music.loop == 'boolean') {
			musicElems.forEach(m => m.loop = true);
		} else {
			musicElems.forEach(m => m.addEventListener('ended', awkwardLoopSubstitute, false));
		}
	}
}

function awkwardLoopSubstitute() {
	this.currentTime = 0;
	this.play();
}

function shuffleMusic() {
	var failsafe = 10;
	var toplay = null;
	while(failsafe > 0 && (!toplay || toplay == song)) {
		failsafe--;
		toplay = randomTerm(songList);
	}
	playMusic(toplay)
}

function setMusicVolume(pingas) {
	if (pingas == settings.musicVolume) {
		applyMusicVolume();
		return;
	}
	settings.musicVolume = pingas;
	applyMusicVolume();
}

function applyMusicVolume() {
	if (!music)
		return;
	var sp;
	if (!settings.musicVolume) {
		if (music.volume) {
			music.pause();
			//music.currentTime = 0;
			songLast = song;
		}
	} else if (!music.volume) {
		sp = true;
	}
	musicElems.forEach(mus => mus.volume = settings.musicVolume);
	if (sp) {
		playMusic(song);
	}
}

function getMusicVolume() {
	return settings.musicVolume;
}

function getMusicPosition() {
	return !song ? 0 : music.currentTime.toFixed(2);
}

//dead function xd
function toggleMute() {
	return;
	settings.muted = !settings.muted;
	saveSettings();
	if (settings.muted)
		music.pause();
	return settings.muted;
}

function setMusicPosition(tim) {
	if (tim == tim)
		music.currentTime = tim;
}

function musicLoopCheck() {
	//console.log(music.currentTime);
	if (globalController.muteClicked) {
		toggleMute();
	}
	if (song && song.loopEnd && music.currentTime >= song.loopEnd) {
		var d = song.loopEnd - song.loopStart;
		//music.pause();
		music.currentTime -= d;
		//music.play();
	}
}

var musicWasPlaying = true;

function musicFocus() {
	if (settings.focusOutPause) {
		if (musicWasPlaying)
			music.play();
	}
}

function musicFocusOut() {
	if (settings.focusOutPause) {
		musicWasPlaying = !music.paused;
		music.pause();
	}
}