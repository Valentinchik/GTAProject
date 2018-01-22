#pragma strict
public var vehicle_area : List.<ClassVehicleArea> = new List.<ClassVehicleArea> ();
public var vehicle : List.<Transform> = new List.<Transform> ();
public var vehicle_delete : List.<Transform> = new List.<Transform> ();
public var man : List.<Transform> = new List.<Transform> ();
public var man_delete : List.<Transform> = new List.<Transform> ();
public var police_cars : List.<sc_police_cars> = new List.<sc_police_cars> ();
public var distance : float=50;
public var distance_min : float=30;
public var distance_max : float=30;
public var vehicle_max : int=30;
public var man_max : int=40;
public var man_count : int;
public var cteate_timer : float=5;
var create_man : boolean;
var create_car : boolean;
var _collider : Transform;
var create_man_ob : Transform;
private var game_sc : sc_game;
private var info_sc : sc_info;
private var script_player : sc_man;
private var distance_min_temp : float=10;
private var timer_create : float;
private var timer_create_man : float;
private var timer_cpc : float;

private var camera_main : Transform;
var sphere : Transform;
function Start () {
game_sc=GetComponent(sc_game);
info_sc=GetComponent(sc_info);
script_player=GetComponent(sc_player).player.GetComponent(sc_man);
distance_min_temp=distance_min;
camera_main=Camera.main.transform;
vehicle_max=PlayerPrefs.GetInt("car_count");
man_max=PlayerPrefs.GetInt("man_count");
//cteate_timer=PlayerPrefs.GetInt("traffic_timer");
//if(PlayerPrefs.GetInt("create_man")==1)create_man=true;
//else create_man=false;
Invoke("CreateVehicle",2);
Invoke("DelleteVehicle",cteate_timer-1);
}//Start

function Update () {
if(vehicle.Count>0){
timer_create+=Time.deltaTime;
if(timer_create>1f&&game_sc.vehicle.Count<vehicle_max){
vehicle[0].GetComponent(sc_collider_creator).Create();
timer_create=0;
}//timer_create
}//Count

if(man.Count>0){
timer_create_man+=Time.deltaTime;
if(timer_create_man>0.5f&&man_count<man_max){
man[0].GetComponent(sc_man_creator).Create();
timer_create_man=0;
}//timer_create
}//Count

if(script_player.wanted_score>=300&&script_player.danger){
timer_cpc+=Time.deltaTime;
if(timer_cpc>5){
CreatePoliceCar();
timer_cpc=0;
}//timer_cpc
}//wanted_score
}//Update


function CreateVehicle(){
var temp_camera_pos : Vector3=Camera.main.transform.position;
var temp_point_pos : Vector3;
var temp_distance : float;

for(var i = 0; i < vehicle_area.Count; i++) {
if(Functions.HitArea(temp_camera_pos,vehicle_area[i]._position,vehicle_area[i].width+distance,vehicle_area[i].height+distance)){
if(create_car){//game_sc.vehicle.Count<vehicle_max&&
for(var j = 0; j < vehicle_area[i].point.Count; j++) {
var temp_procent : int=1;

if(Random.Range(0,100)<vehicle_area[i].procent/temp_procent){
temp_point_pos=vehicle_area[i].point[j]._position;
temp_distance=Vector3.Distance(temp_point_pos,temp_camera_pos);
if(temp_distance>distance_min_temp&&temp_distance<distance){
var temp_near_point : ClassPointCar=new ClassPointCar();
var temp_rotation : Quaternion;

if(!vehicle_area[i].point[j].stop){
    temp_near_point=GetComponent(Patches).point_car[vehicle_area[i].point[j].near_point[0]];
temp_rotation=Quaternion.LookRotation(temp_near_point._position-temp_point_pos);}
else{temp_rotation=Quaternion.Euler(vehicle_area[i].point[j]._rotation);temp_near_point=vehicle_area[i].point[j];}

var temp_collider : Transform=Instantiate(_collider,temp_point_pos+Vector3(0,2,0),temp_rotation);
var random_man : int=vehicle_area[i].man_procent[Random.Range(0,vehicle_area[i].man_procent.Count)];
var temp_man_type : ClassMan=info_sc.man[vehicle_area[i].man[random_man]];
var temp_script : sc_collider_creator=temp_collider.GetComponent(sc_collider_creator);
temp_script.point=temp_near_point;
temp_script.area=vehicle_area[i];
temp_script.man=temp_man_type;
temp_script.info_sc=info_sc;
temp_script.game_sc=game_sc;
temp_script.creator_sc=this;
vehicle.Add(temp_collider);
}//HitAreaOut
}//procent
}//for
}//vehicle_max
//MAN

if(create_man){//man_count<man_max&&
for(var j1 = 0; j1 < vehicle_area[i].point_man.Count; j1++) {
var temp_point : ClassPointMan=vehicle_area[i].point_man[j1];
temp_procent=1;
if(Random.Range(0,100)<vehicle_area[i].procent/temp_procent){
var random_man1 : int=vehicle_area[i].man_procent[Random.Range(0,vehicle_area[i].man_procent.Count)];
var temp_man_type1 : ClassMan=info_sc.man[vehicle_area[i].man[random_man1]];
temp_point_pos=temp_point._position;
temp_distance=Vector3.Distance(temp_point_pos,temp_camera_pos);
if(temp_distance>distance_min_temp&&temp_distance<distance){
/*
var temp_man : Transform=Instantiate(info_sc.man_ob[temp_man_type1.man[Random.Range(0,temp_man_type1.man.Count)]]);
temp_man.position=temp_point_pos+Vector3(Random.Range(-temp_point.distance,temp_point.distance),0,Random.Range(-temp_point.distance,temp_point.distance));
temp_man.GetComponent(sc_bot).GetThisPoint(temp_point,false);*/
var temp_create_man : Transform=Instantiate(create_man_ob);
var temp_script1 : sc_man_creator=temp_create_man.GetComponent(sc_man_creator);
temp_create_man.position=temp_point_pos+Vector3(Random.Range(-temp_point.distance,temp_point.distance),0,Random.Range(-temp_point.distance,temp_point.distance));
//temp_script1.man=info_sc.man_ob[temp_man_type1.man[Random.Range(0,temp_man_type1.man.Count)]];
temp_script1.man=temp_man_type1;
temp_script1.point=temp_point;
temp_script1.info_sc=info_sc;
temp_script1.game_sc=game_sc;
temp_script1.game_ob=transform;
temp_script1.creator_sc=this;
man.Add(temp_create_man);
}//distance
}//procent
}//for
}//man_max
}//HitArea
}//for

//Functions.HitAreaOut(temp_point_pos,temp_camera_pos,distance_min,distance_min)&&Functions.HitArea(temp_point_pos,temp_camera_pos,distance,distance)
//if(distance_min_temp!=distance_min){distance_min_temp=distance_min;}
Invoke("CreateVehicle",cteate_timer);
}//CreateVehicle

function DelleteVehicle(){
var temp_camera_pos : Vector3=camera_main.position;
var temp_distance : float;
var temp_vehicle : Transform;
var temp_script_vehicle : sc_vehicle;
var temp_script_man : sc_man;
for(var i = 0; i < game_sc.vehicle.Count; i++) {
temp_vehicle=game_sc.vehicle[i];
temp_script_vehicle=temp_vehicle.GetComponent(sc_vehicle);
if(temp_vehicle&&temp_script_vehicle.dellete){
temp_distance=Vector3.Distance(temp_vehicle.position,temp_camera_pos);
if(temp_distance>distance_max+100){
DeleteManInCar(temp_vehicle);
game_sc.vehicle.Remove(temp_vehicle);
vehicle_delete.Remove(temp_vehicle);
Destroy(temp_vehicle.gameObject);
}//distance_max
else if(temp_distance>distance_max&&!temp_script_vehicle.destroy&&!temp_script_vehicle.death){
vehicle_delete.Add(temp_vehicle);
temp_script_vehicle.destroy=true;

}//distance_max
else if(temp_distance<=distance_max&&temp_script_vehicle.destroy){
vehicle_delete.Remove(temp_vehicle);
temp_script_vehicle.destroy=false;
}//distance_max
}//temp_vehicle
}//for

if(create_man){
var temp_man : Transform;
for(var j = 0; j < game_sc.man.Count; j++) {
temp_man=game_sc.man[j];
temp_script_man=temp_man.GetComponent(sc_man);
if(temp_man&&temp_script_man.doing!="sit_vehicle"&&temp_script_man.dellete){
temp_distance=Vector3.Distance(temp_man.position,temp_camera_pos);
if(temp_distance>distance_max+100){
man_count--;
game_sc.man.Remove(temp_man);
man_delete.Remove(temp_man);
Destroy(temp_man.gameObject);
}//distance_max
else if(temp_distance>distance_max&&!temp_script_man.destroy&&!temp_script_man.death){
man_delete.Add(temp_man);
temp_script_man.destroy=true;
//var temp_sphere : Transform=Instantiate(sphere);

}//temp_distance
else if(temp_distance<=distance_max&&temp_script_man.destroy){
man_delete.Remove(temp_man);
temp_script_man.destroy=false;
}//temp_distance
}//temp_man
}//for
}//create_man
Invoke("DelleteVehicle",1.5f);
}//DelleteVehicle

function DeleteManInCar(_vehicle : Transform){
var temp_vs : sc_vehicle=_vehicle.GetComponent(sc_vehicle);
for(var i = 0; i < temp_vs.place.Length; i++) {
if(temp_vs.place[i].man){game_sc.man.Remove(temp_vs.place[i].man);Destroy(temp_vs.place[i].man.gameObject);}
}//for
}//DeleteManInCar

function CreatePoliceCar(){
//Invoke("CreatePoliceCar",1);

var temp_distance : float;
var temp_camera_pos : Vector3=camera_main.position;
for(var i = 0; i < police_cars.Count; i++) {
temp_distance=Vector3.Distance(police_cars[i].transform.position,temp_camera_pos);
if(temp_distance>distance_min_temp&&temp_distance<distance){
police_cars[i].CanCreate();
//CPC(police_cars[i]);
break;
}//temp_distance
}//for
}//CreatePoliceCar

function OnGUI(){

//GUI.Label(new Rect(100,200, 100, 100),"Cars: "+game_sc.vehicle.Count);
//GUI.Label(new Rect(100,300, 100, 100),"Mans: "+game_sc.man.Count);
}//OnGUI