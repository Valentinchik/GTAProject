#pragma strict
public var car : List.<Transform> = new List.<Transform> ();
public var man : List.<Transform> = new List.<Transform> ();
var cpc : Transform;

var can_create : boolean;
private var script_game : sc_game;
private var script_creator : sc_vehicle_creator;
private var info_sc : sc_info;
function Start () {
script_game=GameObject.Find("Game").GetComponent(sc_game);
info_sc=script_game.transform.GetComponent(sc_info);
script_creator=script_game.transform.GetComponent(sc_vehicle_creator);

var temp_cars : Transform=transform.FindChild("cars");
for (var i=0;i<temp_cars.childCount;i++)	{
car.Add(temp_cars.GetChild(i));
}//for

var temp_mans : Transform=transform.FindChild("mans");
for (var j=0;j<temp_mans.childCount;j++)	{
man.Add(temp_mans.GetChild(j));
}//for

transform.FindChild("cars").gameObject.SetActive(false);
transform.FindChild("mans").gameObject.SetActive(false);
GameObject.Find("Game").GetComponent(sc_vehicle_creator).police_cars.Add(this);
}//Start

function Update () {

}//Update

function OnTriggerEnter (_collision : Collider) {
if(!_collision.isTrigger){
GetComponent.<Collider>().enabled=false;
can_create=false;}
}//OnTriggerEnter

function CanCreate(){
GetComponent.<Collider>().enabled=true;
can_create=true;
Invoke("Create",0.1f);}

function Create(){
if(!can_create || script_game.vehicle.Count>=script_creator.vehicle_max || script_creator.man_count>=script_creator.man_max){GetComponent.<Collider>().enabled=false;return false;}
 
for(var i = 0; i < car.Count; i++) {
CreateCar(car[i]);
}//for
for(var j = 0; j < man.Count; j++) {
CreateMan(man[j]);
}//for
GetComponent.<Collider>().enabled=false;
}//Create


function CreateCar(_point : Transform){
var temp_vehicle : Transform=Instantiate(cpc,_point.position,_point.rotation);
temp_vehicle.GetComponent(sc_cpc).script_game=script_game;
temp_vehicle.GetComponent(sc_cpc).info_sc=info_sc;
}//CreateCar

function CreateMan(_point : Transform){
var man_ob : Transform=info_sc.man_ob[info_sc.man[4].man[Random.Range(0,info_sc.man[4].man.Count)]];
var temp_man : Transform=Instantiate(man_ob,_point.position,_point.rotation);
temp_man.GetComponent(sc_man).game_sc=script_game;
temp_man.GetComponent(sc_bot).game_sc=script_game;
temp_man.GetComponent(sc_bot).enabled=false;
if(script_game.player.GetComponent(sc_man).wanted_score>=500)temp_man.GetComponent(sc_weapon).WeaponGive(14,false,0,0);
}//CreateCar