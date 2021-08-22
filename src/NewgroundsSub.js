//https://bitbucket.org/newgrounds/newgrounds.io-for-javascript-html5/src/master/

//var ngio = new Newgrounds.io.core(app_id, aes_encryption_key);
var ngScoreboards, ngMedals;


/* handle loaded medals */
function onMedalsLoaded(result) {
	if (result.success)
		ngMedals = result.medals;
}

/* handle loaded scores */
function onScoreboardsLoaded(result) {
	if (result.success)
		ngScoreboards = result.scoreboards;
}

ngio.queueComponent("Medal.getList", {}, onMedalsLoaded);
ngio.queueComponent("ScoreBoard.getBoards", {}, onScoreboardsLoaded);
ngio.executeQueue();

function onScorePosted(scor, val) {
	console.log("Score updated: " + score);
}
function onMedalUnlocked(meds) {
	console.log("Medal unlocked: " + meds);
}

//from Carson on the server
function postScore(board_name, score_value) {
	/* If there is no user attached to our ngio object, it means the user isn't logged in and we can't post anything */
	if (!ngio || !ngio.user)
		return;
	var score;
	for (var i = 0; i < ngScoreboards.length; i++) {
		scoreboard = ngScoreboards[i];
		if (scoreboard.name == board_name) {
			ngio.callComponent('ScoreBoard.postScore', {id:scoreboard.id, value:score_value}, function(result) {
				if (result.success) {
					oneScorePosted(board_name, score_value);
				}
			});
		}
	}
}
//postScore('test scores', 1234);

function unlockMedal(medal_name) {

	/* If there is no user attached to our ngio object, it means the user isn't logged in and we can't unlock anything */
	if (!ngio || !ngio.user)
		return;

	var medal;

	for (var i = 0; i < medals.length; i++) {

		medal = medals[i];

		/* look for a matching medal name */
		if (medal.name == medal_name) {

			/* we can skip unlocking a medal that's already been earned */
			if (!medal.unlocked) {

				/* unlock the medal from the server */
				ngio.callComponent('Medal.unlock', {id:medal.id}, function(result) {

					if (result.success) {
						onMedalUnlocked(result.medal);
					}
				});
			}

			return;
		}
	}
}


function postStageTime(stageID, frames) {
	
	postScore("BestTime-"+stageID, frames);
	
	let b = getCompletionDegree();
	if (b >= 1)
		unlockBeatenMedal();
	if (b >= 2)
		unlockAllParMedal();
}

function unlockBeatenMedal() {
	unlockMedal("Climber");
}

function unlockAllParMedal() {
	unlockMedal("Conqueror");
}