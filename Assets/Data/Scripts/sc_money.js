#pragma strict
public var money : int=100;
private var player_sc : sc_player;
function Start () {
player_sc=GameObject.Find("Game").GetComponent(sc_player);
Destroy(gameObject,20);
}//Start

function Update () {
var distance : float=Vector3.Distance(player_sc.player.position,transform.position);
if(distance<1){player_sc.MoneyAdd(money+Random.Range(0,money/3));Destroy(gameObject);}
}//Update