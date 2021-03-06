const CC_BY_3 = "Creative Commons Attribution 3.0 License";
const CC_BY_4 = "Creative Commons Attribution 4.0 International License";
const MUSIC_GENRES = ["all", "chiptune"];
const MAIN_MENU_MUSIC = "Wyvernspawn";

const SONG_LIST_ABS = [
	{name:"Wyvernspawn", intensity:1/4, loopStart:43.394, loopEnd:110.947,
		by:"HOJL", yt:"csoAb9n6Jf8", ng:981306, sc:"user-986973517/wyvernspawn"},
	{name:"Notion", intensity:1/2, loopStart:9.604, loopEnd:172.288,
		by:"Hyenaedon, HOJL", yt:"_EuA_TfvC94", ng:939780, sc:"hyenaedon/notion"},
	{name:"Climbing", intensity:3/4, vars:2, varNames:["Normal", "Retro Game"],
		by:"PeriTune", yt:"oMi4OrwpClE", sc:"sei_peridot/climbingroyalty-free-music", siten:"PeriTune", site:"https://peritune.com/climbing/"},
	//{name:"Dungeon Tower", intensity:1/4, vars:2, varNames:["Normal", "Retro Game"],
	//	by:"PeriTune", yt:"C03wgPMeeUs", siten:"PeriTune", site:"https://peritune.com/dungeon_tower/"},
	//{name:"Soaring", intensity:1/2,
	//	by:"PeriTune", yt:"XYhFLYIDv3E", siten:"PeriTune", site:"https://peritune.com/soaring/"},
	//{name:"Joy Noise", intensity:1/2,
	//	by:"TeraVex", ng:913514},
	{name:"Walkin'", intensity:1/2, loopStart:41.202, loopEnd:150.909, vars:2, varNames:["Normal","Water"],
		by:"TeraVex", yt:"UOut1_-8_lU", ng:1052804},
]
//Because some sites have an upload size limit.
//const SONG_LIST = STRIP_SONGS ? SONG_LIST_ABS.filter(s=>s[STRIP_SONGS]) : SONG_LIST_ABS;
const SONG_LIST = SONG_LIST_ABS;

const MUSICIAN_CREDITS = [
	{name:"HOJL", links:[
		{name:"Newgrounds", href:"https://hojl.newgrounds.com/"},
		{name:"YouTube", href:"https://www.youtube.com/channel/UCuDfJda2Wptvw-h2nf02Ayw"},
		{name:"SoundCloud", href:"https://soundcloud.com/user-986973517"},
		{name:"Twitter", href:"https://twitter.com/Aero489"},
	]},
	{name:"Hyenaedon", links:[
		{name:"Newgrounds", href:"https://hyenaedon.newgrounds.com/"},
		{name:"YouTube", href:"https://www.youtube.com/c/Hyenaedon"},
		{name:"SoundCloud", href:"https://soundcloud.com/hyenaedon"},
		{name:"Bandcamp", href:"https://hyenaedon.bandcamp.com/"},
	]},
	{name:"TeraVex", links:[
		{name:"Newgrounds", href:"https://teravex.newgrounds.com/"},
		{name:"YouTube", href:"https://www.youtube.com/channel/UCPTJkhOccPmWqoySHgbZm_w"},
		{name:"Patreon", href:"http://patreon.com/TeraVex"},
		{name:"Twitter", href:"https://twitter.com/TeraVex"},
		{name:"Bandcamp", href:"https://teravex.bandcamp.com/"},
	]},
	{name:"PeriTune", links:[
		{name:"PeriTune", href:"https://peritune.com/", icon:"Website"},
		{name:"YouTube", href:"https://www.youtube.com/c/PeriTune/"},
		{name:"SoundCloud", href:"https://soundcloud.com/sei_peridot"},
		{name:"Twitter", href:"https://twitter.com/PeriTune_info"},
	]},
];

var SONG_HASH = {};
SONG_LIST.forEach(function(sing, dex) {
	sing.fullname = (sing.name + " - " + sing.by);
	if (!sing.iname)
		sing.iname = ((sing.fname || sing.name) + "-" + sing.by).replace(/\s/g, "");
	sing.srcs = ["src/Audio/Songs/" + sing.iname + ".mp3"];
	if (sing.vars > 1) {
		for (var i = 1; i < sing.vars; i++) {
			sing.srcs.push("src/Audio/Songs/" + sing.iname + "-"+i+".mp3");
		}
	}
	SONG_HASH[sing.iname] = sing;
	SONG_HASH[sing.name + " - " + sing.by] = sing;
	SONG_HASH[sing.name] = sing;
	sing.index = dex;
	sing.sites = [];
	if (sing.site)
		sing.sites.push({name:sing.siten, href:sing.site, icon:"Website"});
	if (sing.yt)
		sing.sites.push({name:"YouTube", href:"https://www.youtube.com/watch?v="+sing.yt});
	if (sing.ng)
		sing.sites.push({name:"Newgrounds", href:"https://www.newgrounds.com/audio/listen/"+sing.ng});
	if (sing.sc)
		sing.sites.push({name:"SoundCloud", href:"https://soundcloud.com/"+sing.sc});
	if (sing.spot)
		sing.sites.push({name:"Spotify", href:"https://open.spotify.com/album/"+sing.spot});
	if (sing.pat)
		sing.sites.push({name:"Patreon", href:"https://www.patreon.com/"+sing.pat});
});

function loadFavSongs() {
	var loaded = localStorage.getItem("FavSongs");
	if (loaded) {
		var favs = JSON.parse(loaded);
		SONG_LIST.forEach(sing => sing.fav = favs[sing.iname]);
	}
}

function toggleFavSong(sing) {
	if (sing) {
		sing.fav = !sing.fav;
		var favs;
		var loaded = localStorage.getItem("FavSongs");
		if (favs) {
			favs = JSON.parse(loaded);
			favs[sing.iname] = sing.fav;
		} else {
			favs = {};
			SONG_LIST.forEach(sang => favs[sang.iname] = sang.fav);
		}
		localStorage.setItem("FavSongs", JSON.stringify(favs));
	}
}

function playLocationMusic() {
	playMusicFromLeftOff("Taisho Roman Theme 2 (Piano)");
}
