#pragma strict
private var patch_sc : Patches;
private var vehicle_creator_sc : sc_vehicle_creator;
private var car_stay_ob : Transform;
public var procent : int=50;
var width : int=100;
var height : int=100;
var limit_speed : int=90;
var important : int;
var man : List.<int> = new List.<int> ();
var man_procent : List.<int> = new List.<int> ();
function Start () {
if(GameObject.Find("CarStays"))car_stay_ob=GameObject.Find("CarStays").transform;
patch_sc=GameObject.Find("Game").GetComponent(Patches);
vehicle_creator_sc=GameObject.Find("Game").GetComponent(sc_vehicle_creator);
Invoke("FindPoint",important*0.01);
}//Start

function FindPoint(){
var new_vehicle_area : ClassVehicleArea=new ClassVehicleArea();
new_vehicle_area._position=transform.position;
new_vehicle_area.width=width;
new_vehicle_area.height=height;
new_vehicle_area.procent=procent;
new_vehicle_area.limit_speed=limit_speed;
new_vehicle_area.man=man;
AddManProcent(new_vehicle_area.man_procent);

for(var i = 0; i < patch_sc.point_car.Count; i++) {
if(!patch_sc.point_car[i].use&&Functions.HitArea(patch_sc.point_car[i]._position,transform.position,width,height)){
patch_sc.point_car[i].use=true;
new_vehicle_area.point.Add(patch_sc.point_car[i]);}
}//for

//ManPoint
for(var j = 0; j < patch_sc.point_man.Count; j++) {
if(!patch_sc.point_man[j].use&&Functions.HitArea(patch_sc.point_man[j]._position,transform.position,width,height)&&patch_sc.point_man[j].create){
patch_sc.point_man[j].use=true;
new_vehicle_area.point_man.Add(patch_sc.point_man[j]);}
}//for

if(car_stay_ob&&car_stay_ob.childCount>0){
for(var i1 = 0; i1 < car_stay_ob.childCount; i1++) {
if(car_stay_ob.GetChild(i1).gameObject.active&&Functions.HitArea(car_stay_ob.GetChild(i1).position,transform.position,width,height)){
var temp_point : ClassPointCar=new ClassPointCar();
temp_point.index=-99999;
temp_point._position=car_stay_ob.GetChild(i1).position;
temp_point._rotation=car_stay_ob.GetChild(i1).eulerAngles;
temp_point.stop=true;
car_stay_ob.GetChild(i1).gameObject.SetActive(false);
new_vehicle_area.point.Add(temp_point);
}//car_stay_ob
}//for
}//childCount

if(new_vehicle_area.point.Count>0 || new_vehicle_area.point_man.Count>0){vehicle_creator_sc.vehicle_area.Add(new_vehicle_area);}

}//FindPoint

function AddManProcent(_procent : List.<int>){
for(var i = 0; i < man_procent.Count; i++) {
for(var j = 0; j < man_procent[i]; j++) {
_procent.Add(i);
}//for
}//for
}//AddManProcent

function OnDrawGizmos(){
Gizmos.color = Color.green;
     if(important==0){Gizmos.color = Color.red;}
else if(important==1){Gizmos.color = Color.yellow;}
else if(important==2){Gizmos.color = Color.green;}

var point_0 : Vector3=transform.position+Vector3( width,0, height);
var point_1 : Vector3=transform.position+Vector3( width,0,-height);
var point_2 : Vector3=transform.position+Vector3(-width,0,-height);
var point_3 : Vector3=transform.position+Vector3(-width,0, height);
Gizmos.DrawLine(point_0,point_1);
Gizmos.DrawLine(point_2,point_3);
Gizmos.DrawLine(point_0,point_3);
Gizmos.DrawLine(point_1,point_2);
}//OnDrawGizmos