#pragma strict
var script_player : sc_player;
function Start () {
script_player=GameObject.Find("Game").GetComponent(sc_player);
}//

function Update () {
if(PlayerPrefs.GetInt("casino_money")!=0){
script_player.MoneyAdd(PlayerPrefs.GetInt("casino_money"));
PlayerPrefs.SetInt("casino_money",0);
}//casino_money
}//Update