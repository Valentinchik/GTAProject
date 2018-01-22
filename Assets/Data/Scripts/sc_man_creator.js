#pragma strict
public var point : ClassPointMan;
//public var man : Transform;
public var man : ClassMan;

public var info_sc : sc_info;
public var game_ob : Transform;
public var game_sc : sc_game;
public var creator_sc : sc_vehicle_creator;
function Start () {
Invoke("Delete",1);
Invoke("CreateOldMan",Random.Range(0,1.0f));
}//Start

function Update () {

}//Update

function Create(){
if(creator_sc.man_count>creator_sc.man_max)return false;
var temp_man : Transform=Instantiate(info_sc.man_ob[man.man[Random.Range(0,man.man.Count)]]);
temp_man.position=transform.position;
temp_man.GetComponent(sc_man).game_sc=game_sc;
temp_man.GetComponent(sc_bot).game_sc=game_sc;
if(temp_man.GetComponent(sc_weapon))temp_man.GetComponent(sc_weapon).game_ob=game_ob;
temp_man.GetComponent(sc_bot).GetThisPoint(point,false);
creator_sc.man_count++;
Delete();
}//create

function CreateOldMan(){
if(creator_sc.man_delete.Count<=0)return false;
if(!creator_sc.man_delete[0]){creator_sc.man_delete.RemoveAt(0);return false;}
var temp_man : Transform=creator_sc.man_delete[0];

temp_man.position=transform.position;
temp_man.GetComponent(sc_bot).GetThisPoint(point,false);
temp_man.GetComponent(sc_man).destroy=false;
creator_sc.man_delete.RemoveAt(0);
Delete();
}//CreateOldMan

function Delete(){
creator_sc.man.Remove(transform);
Destroy(gameObject);
}//Delete