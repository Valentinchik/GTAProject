#pragma strict

import System.Collections.Generic;
public var game_sc : sc_game;
var fire_ob : Transform;
var fire_point : Transform;

private var fire_num : int;

public var camera_type : ClassCamera[];
public var place : ClassVehiclePlace[];
public var team : int;
public var health_max : float=1000;
public var max_speed : float=180;
public var limit_speed : int=180;
public var price : int=5000;
public var health : float=100;
public var place_drive : int;
public var scale : int=6;
public var invoke_damage : int;
public var engine_work : boolean;
public var back_speed : boolean;
public var throttle : float;
public var steer : float;
public var rotate : Vector3;
public var target_pos : Vector3;
public var turret_point : Transform;
public var destroy_ob : Transform;
public var sirena : Transform;
public var driver : Transform;
public var killer : Transform;
public var light_material : Renderer;
public var fire : boolean;
public var police : boolean;
public var boat : boolean;
public var stop_fire : boolean;
public var dellete : boolean=true;
public var destroy : boolean;
public var health_bar : boolean;

public var death : boolean;
private var stop : boolean;
private var stop_timer : float;
function Start () {
health=health_max;
if(!game_sc)game_sc=GameObject.Find("Game").GetComponent(sc_game);
game_sc.vehicle.Add(transform);
}//Start

function Update () {
if(light_material){
if(throttle<0)light_material.material.color=Color.white;
else if(!stop)light_material.material.color=Color.gray;
if(stop){
stop_timer+=Time.deltaTime;
if(stop_timer>0.1f){stop=false;stop_timer=0;}}
}//light_material
}//Update

function EngineStart(){
if(GetComponent(sc_car2))GetComponent(sc_car2).EngineStart();
else if(GetComponent(sc_motobike_js))GetComponent(sc_motobike_js).EngineStart();
else if(GetComponent(sc_car))GetComponent(sc_car).EngineStart();
else if(GetComponent(sc_helecopter))GetComponent(sc_helecopter).EngineStart();
else if(GetComponent(sc_boat))GetComponent(sc_boat).EngineStart();
}//EngineStart

function EngineWork(){
if(GetComponent(sc_car2))GetComponent(sc_car2).EngineWork();
else if(GetComponent(sc_motobike_js))GetComponent(sc_motobike_js).EngineWork();
else if(GetComponent(sc_car))GetComponent(sc_car).EngineWork();
else if(GetComponent(sc_boat))GetComponent(sc_boat).EngineWork();
}//EngineWork

function EngineStop(){
throttle=0;
if(GetComponent(sc_car2))GetComponent(sc_car2).EngineStop();
else if(GetComponent(sc_motobike_js))GetComponent(sc_motobike_js).EngineStop();
else if(GetComponent(sc_car))GetComponent(sc_car).EngineStop();
else if(GetComponent(sc_boat))GetComponent(sc_boat).EngineStop();
}//EngineStart


function StopVehicle(_index : float){
if(GetComponent(sc_car2))GetComponent(sc_car2).StopVehicle(_index);
else if(GetComponent(sc_motobike_js))GetComponent(sc_motobike_js).StopVehicle(_index);
else if(GetComponent(sc_car))GetComponent(sc_car).StopVehicle(_index);
else if(GetComponent(sc_boat))GetComponent(sc_boat).StopVehicle(_index);
if(light_material)light_material.material.color=Color.white;
stop=true;
stop_timer=0;
}//StopVehicle

function InvokeDamage(){
Damage(invoke_damage,null);
}//InvokeDamage

function Damage(_power : float,_killer : Transform){
health-=_power;
if(_killer)killer=_killer;
if(!death){
if(health<=0){Death();}
else if(fire_num==0&&health<health_max/4&&health>=health_max/10){CreateFire(1);}
else if(fire_num!=2&&health<health_max/8){CreateFire(2);}
}//death
}//Damage

function CreateFire(_index : int){
if(fire_num==0){
var temp_object : Transform= Instantiate (fire_ob,fire_point.position,fire_point.rotation);
temp_object.parent=fire_point;
}//fire_num
fire_num=_index;

if(_index==1){
fire_point.GetChild(0).FindChild("smoke").gameObject.SetActive(true);
fire_point.GetChild(0).FindChild("fire").gameObject.SetActive(false);
max_speed*=0.8;
limit_speed*=0.8;
}//_index
else if(_index==2){
if(GetComponent(sc_helecopter)){
GetComponent(sc_helecopter).death=true;
GetComponent(sc_helekop_bot).enabled=false;
}//sc_helecopter
fire_point.GetChild(0).FindChild("smoke").gameObject.SetActive(false);
fire_point.GetChild(0).FindChild("fire").gameObject.SetActive(true);
max_speed*=0.5;
limit_speed*=0.5;
Invoke("FireDamage",1);
}//_index


}//CreateFire

function FireDamage(){
Damage(health_max/100,null);
if(!death){Invoke("FireDamage",1);}
}//FireDamage

function Death(){
death=true;
this.enabled=false;
if(killer)killer.GetComponent(sc_man).AddWantedScore(50);
for(var i = 0; i < place.Length; i++){
if(place[i].man){place[i].man.GetComponent(sc_man).Damage(1000,0,Vector3.zero,Vector3.zero,null);}
}//for
if(GetComponent(sc_helecopter)){
for(var j1 = 0; j1 < place.Length; j1++){
if(place[j1].man){
game_sc.man.Remove(place[j1].man);
Destroy(place[j1].man.gameObject);

}//man
}//for
game_sc.transform.GetComponent(sc_player).MoneyAdd(2000);    
var temp_destroy_ob : Transform=Instantiate (destroy_ob,transform.position,transform.rotation);
game_sc.vehicle.Remove(transform);
Destroy(temp_destroy_ob.gameObject,5);
Destroy(gameObject);
}//sc_helecopter
else{
GetComponent.<Rigidbody>().AddForce(Vector3.up*2000);
GetComponent.<Rigidbody>().AddTorque(Vector3(Random.Range(-1.0f,1.0f),Random.Range(-1.0f,1.0f),Random.Range(-1.0f,1.0f))*200000);

var temp_controller : Transform=transform.FindChild("controller").transform;
var temp_body : Transform=transform.FindChild("body").transform;
var temp_body1 : Transform=temp_body.FindChild("body").transform;


var temp_materials : Material[]=new Material[1];
temp_materials[0]=game_sc.death_car_mat;
for(var j = 0; j < temp_body1.childCount; j++){
var mr : MeshRenderer=temp_body1.GetChild(j).GetComponent(MeshRenderer);
mr.materials=temp_materials;}

temp_controller.parent=temp_body1;
temp_body1.parent=transform;
Destroy(temp_body.gameObject);
Destroy(GetComponent(AudioSource));
if(GetComponent(sc_vehicle_bot))Destroy(GetComponent(sc_vehicle_bot));
if(GetComponent(sc_car_cop))Destroy(GetComponent(sc_car_cop));

if(sirena)Destroy(sirena.gameObject);
if(GetComponent(sc_car2))GetComponent(sc_car2).Death();
else if(GetComponent(sc_motobike_js))GetComponent(sc_motobike_js).Death();
}//helecopter
Instantiate (game_sc.explosion_0,transform.position+Vector3(0,0,0),transform.rotation);



/*
var temp_controller : Transform=transform.FindChild("controller").transform;
var temp_body : Transform=transform.FindChild("body").transform;
var temp_body1 : Transform=temp_body.FindChild("body").transform;
var temp_wheels : Transform=temp_body.FindChild("wheels").transform;
var temp_points : Transform=temp_controller.FindChild("points").transform;
var temp_object : Transform= Instantiate (game_sc.explosion_0,transform.position+Vector3(0,0,0),transform.rotation);
Destroy(temp_body1.FindChild("glass").gameObject);
Destroy(temp_body.FindChild("body1").gameObject);
Destroy(temp_body.FindChild("body2").gameObject);
Destroy(temp_body.GetComponent(LODGroup));
Destroy(GetComponent(CarDamage));

var temp_materials : Material[]=new Material[1];
temp_materials[0]=game_sc.death_car_mat;
for(var j = 0; j < temp_body1.childCount; j++){
var mr : MeshRenderer=temp_body1.GetChild(j).GetComponent(MeshRenderer);
mr.materials=temp_materials;
}//

temp_controller.parent=temp_body;
Destroy(temp_wheels.gameObject);
Destroy(GetComponent(AudioSource));
Destroy(temp_controller.GetComponent(AudioSource));
if(GetComponent(sc_car)){Destroy(GetComponent(sc_car));}
if(GetComponent(sc_car2)){Destroy(GetComponent(sc_car2));}
if(GetComponent(sc_vehicle_bot)){Destroy(GetComponent(sc_vehicle_bot));}
if(GetComponent(sc_car_cop)){Destroy(GetComponent(sc_car_cop));}
this.enabled=false;
*/

}//Death

function OnGUI(){

if(health_bar){
var temp_distance : float=Vector3.Distance(transform.position,game_sc._camera.position);
var temp_pos : Vector3  = Camera.main.WorldToScreenPoint (transform.position + new Vector3 (0, 1, 0));
var temp_in_camera : Vector3  = Camera.main.transform.InverseTransformPoint (transform.position + new Vector3 (0, 1, 0));
var temp_size : float  = (Screen.width+Screen.height)/30;

if (temp_in_camera.z > 0&&temp_distance<100) {
GUI.color = Color.white;
GUI.DrawTexture (new Rect (temp_pos.x-temp_size/2,Screen.height-temp_pos.y-temp_size/5, temp_size, temp_size/5),game_sc.tex_healthbar1);
GUI.color = Color.green;
if(health<health_max/3)GUI.color = Color.red;
else  if(health<health_max/1.5)GUI.color = Color.yellow;

GUI.DrawTexture (new Rect (temp_pos.x-temp_size/2,Screen.height-temp_pos.y-temp_size/5, temp_size/health_max*health, temp_size/5),game_sc.tex_healthbar2);
}//temp_in_camera

}//health_bar
}//OnGUI
