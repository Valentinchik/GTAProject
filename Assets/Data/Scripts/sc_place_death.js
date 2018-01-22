#pragma strict
private var game_sc : sc_game;

public var car : List.<Transform> = new List.<Transform> ();
public var near_point : List.<ClassPointMan> = new List.<ClassPointMan> ();
public var man : Transform;
public var killer : Transform;
public var have_point : boolean;
public var car_count : int=2;
function Start () {
game_sc=GameObject.Find("Game").GetComponent(sc_game);
Invoke("ClearEmptyCar",10);
}//Start

function Update () {

}//Update

function ClearEmptyCar(){
if(!man){
game_sc.place_death.Remove(transform);
Destroy(gameObject);
return false;}

Invoke("ClearEmptyCar",10);
for (var i=0;i<car.Count;i++)	{
if(!car[i]){car.RemoveAt(i);}
}//for
}//ClearEmptyCar