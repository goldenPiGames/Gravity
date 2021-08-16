//var ngio = new Newgrounds.io.core(app_id, aes_encryption_key);

function postStageTime(stageID, frames) {
	
    /* If there is no user attached to our ngio object, it means the user isn't logged in and we can't post anything */
    if (!ngio.user) return;
	
	ngio.callComponent('ScoreBoard.postScore', {id:board_name, value:score_value});
}

//postScore('test scores', 1234);