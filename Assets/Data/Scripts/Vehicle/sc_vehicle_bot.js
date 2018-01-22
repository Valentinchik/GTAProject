#pragma strict
var point : ClassPointCar;
var next_point : ClassPointCar; 
var target : Transform;
var see_range : float=200;
var stopped : boolean=true;

public var engine_work : boolean;
public var global_target : boolean;
public var racer : boolean;
public var have_point : boolean;
public var police : boolean;
public var go_to_target : boolean;
public var stop_on_target : boolean;
public var racer_collision : boolean=true;
public var global_target_pos : Vector3;
public var target_pos : Vector3;

public var game_sc : sc_game;
private var patch_script : Patches;
private var vehicle_sc : sc_vehicle;
private var man_script_enemy : sc_man;
private var doing : String="run";
private var target_angle : float;
private var target_distance : float;
private var collision_timer : float;
private var racer_timer : float;
private var back_speed : boolean;
private var collision : boolean=false;
private var collision_right : boolean;
private var collision_left : boolean;
private var collider_driver : Transform;
private var collider_stop : Transform;
private var collider_racer : Transform;
private var collider_left_ob : Transform;
private var collider_right_ob : Transform;
private var col_stop_script : sc_trigger;
private var col_right_script : sc_trigger;
private var col_left_script : sc_trigger;
var _magnitude : float;

public var CarController : RCC_CarControllerV3;
public var Gas : float = 0;
public var SteerAngel : float = 0;
public var Handbrake : boolean = false;

function Start () {
    CarController = GetComponent(RCC_CarControllerV3);
    CarController.canControl = false;
if(!game_sc)game_sc=GameObject.Find("Game").GetComponent(sc_game);
patch_script=game_sc.script_path;
collider_driver=transform.FindChild("controller").FindChild("collider_driver");
collider_stop=collider_driver.FindChild("collider_stop");
collider_racer=collider_driver.FindChild("collider_racer");
if(collider_stop)col_stop_script=collider_stop.GetComponent(sc_trigger);
collider_right_ob=collider_racer.FindChild("collider_right").transform;
collider_left_ob=collider_racer.FindChild("collider_left").transform;
col_right_script=collider_right_ob.GetComponent(sc_trigger);
col_left_script=collider_left_ob.GetComponent(sc_trigger);
vehicle_sc=GetComponent(sc_vehicle);


Invoke("LateStart",0.001);
}//Start

function LateStart(){
if(engine_work){vehicle_sc.EngineWork();}
if(racer){
Racer(true,vehicle_sc.max_speed*0.8f);
FindNearPoint();
vehicle_sc.EngineStart();}
}//LateStart

function Update () {
    Gas = CarController.BotGas;
    SteerAngel = CarController.BotSteer;
    Handbrake = CarController.BotHandbrake;

if(doing=="run"){
_magnitude=GetComponent.<Rigidbody>().velocity.magnitude;
target_angle=Quaternion.LookRotation(target_pos-transform.position).eulerAngles.y;
var target_angle_diff : float=Functions.AngleSingle180(target_angle-transform.eulerAngles.y);
var target_angle_diff_abs : float=Functions.AngleSingle180Abs(target_angle-transform.eulerAngles.y);

if(!back_speed){
collider_stop.localScale.z=2+_magnitude/1.3;
var temp_throttle : float=0.01f;
if(racer)temp_throttle=50;
CarController.BotGas=Mathf.Lerp(CarController.BotGas,1,Time.deltaTime*temp_throttle);
if(!collision){CarController.BotSteer=target_angle_diff/30;}

if(target_angle_diff_abs>90&&!vehicle_sc.boat){CarController.brake=1000;//vehicle_sc.StopVehicle(100);
    if(_magnitude<1){back_speed=true;CarController.BotGas=0;}
}//target_angle_diff_abs
}//back_speed
else{
    CarController.BotSteer=-target_angle_diff/30;
if(target_angle_diff_abs<30){
    CarController.brake=1500;//vehicle_sc.StopVehicle(200);
CarController.BotGas=0;
if(_magnitude<1){back_speed=false;}
}//target_angle_diff_abs
else{CarController.BotGas=-1;}
}//else
if(!racer){
    CarController.BotHandbrake = false;
    if(col_stop_script&&col_stop_script.collision){
if(stopped&&col_stop_script.collision.name!="collider_stop"&&col_stop_script.collision.name!="speed_limit"&&col_stop_script.collision.tag!="road"&&
col_stop_script.collision.tag!="ignore_collider"&&!racer)
{
    CarController.BotGas = 0;
    CarController.BotHandbrake = true;
    return false;
    //CarController.brake=2500+_magnitude*2;//vehicle_sc.StopVehicle(80+_magnitude*2);
}
}//collision
}//racer

else {
var temp_raycast : RaycastHit;

if(!collision_right&&!collision_left&&Physics.Raycast(collider_right_ob.position,collider_right_ob.TransformDirection(Vector3.forward),temp_raycast,1+_magnitude*0.6)
    &&temp_raycast.collider.transform.root.tag=="vehicle"){
collision_right=true;
}//collision_left
else if(!collision_right&&!collision_left&&Physics.Raycast(collider_left_ob.position,collider_left_ob.TransformDirection(Vector3.forward),temp_raycast,1+_magnitude*0.6)
    &&temp_raycast.collider.transform.root.tag=="vehicle"){
collision_left=true;
}

if(collision_right&&racer_collision){
    CarController.BotSteer=Mathf.Lerp(CarController.BotSteer,-1,500*Time.deltaTime);
collision=true;
collision_timer+=Time.deltaTime;
}//collision_right

else if(collision_left&&racer_collision){
    CarController.BotSteer=Mathf.Lerp(CarController.BotSteer,1,500*Time.deltaTime);
collision=true;
collision_timer+=Time.deltaTime;
}//collision_right

else{collision=false;}

if(collision_timer>0.06+50/(_magnitude*_magnitude)){
collision_timer=0;
collision_right=false;
collision_left=false;
}//collision_timer

if(GetComponent.<Rigidbody>().velocity.magnitude<1){
racer_timer+=Time.deltaTime;
if(racer_timer>10&&!back_speed){back_speed=true;CarController.BotGas=0;racer_timer=0;}
else if(racer_timer>10&&back_speed){back_speed=false;CarController.BotGas=0;racer_timer=0;}
}//magnitude
else if(racer_timer!=0){racer_timer=0;}
}//racer

target_distance=Vector3.Distance(Vector3(target_pos.x,0,target_pos.z), Vector3(transform.position.x,0,transform.position.z));
if(point&&have_point){
var temp_point_angle : Vector3=Quaternion.LookRotation(next_point._position-point._position).eulerAngles;
var temp_point_angle_diff_abs : Vector3=Functions.Angle180Abs(temp_point_angle-transform.eulerAngles);

if(target_distance<30&&temp_point_angle_diff_abs.y>25&&_magnitude>10&&!racer){
    CarController.brake=temp_point_angle_diff_abs.y;//.StopVehicle(temp_point_angle_diff_abs.y);
}//racer
else {
temp_point_angle=Quaternion.LookRotation(point._position-transform.position).eulerAngles;
temp_point_angle_diff_abs=Functions.Angle180Abs(temp_point_angle-transform.eulerAngles);
if(temp_point_angle_diff_abs.y>60&&_magnitude>20){
    CarController.brake=1000;//vehicle_sc.StopVehicle(100);
}
}//racer
if(target_distance<2+_magnitude/1.5&&!go_to_target)NextPoint();

}//point
if(target_distance<5+_magnitude&&go_to_target){
if(!stop_on_target)go_to_target=false;
CarController.BotGas=0;
CarController.brake=1500;//vehicle_sc.StopVehicle(200);
}

}//run
else if(doing=="idle"){CarController.BotGas=0;}



}//Update

function FindNearPoint(){
if(go_to_target)return false;
if(patch_script.point_car.Count>0){
var temp_point : ClassPointCar;
var temp_near_point : ClassPointCar;
var temp_distance_big : float=1000;
var temp_distance : float;

for (var i=0;i<patch_script.point_car.Count;i++)	{
temp_point=patch_script.point_car[i];
temp_distance=Vector3.Distance(temp_point._position, transform.position);
if(temp_distance<temp_distance_big){temp_distance_big=temp_distance;temp_near_point=temp_point;}
}//for
if(temp_near_point){
GetPoint(temp_near_point);
}//temp_near_point

}//Count
}//FindNearPoint

function NextPoint(){
//if(police&&global_target)GetPointPolice(next_point);
GetPoint(next_point);
}//NextPoint


function GetPoint(_point : ClassPointCar){
if(go_to_target)return false;
have_point=true;
point=_point;
target_pos=point._position;
if(global_target&&point.near_point.Count>1){

var temp_angle_big : float=360;
var temp_angle_point : float;
var temp_point : ClassPointCar;
var temp_diff_angle : float;
var temp_angle : float=Quaternion.LookRotation(global_target_pos-transform.position).eulerAngles.y;

for (var i=0;i<point.near_point.Count;i++)	{
temp_angle_point=Quaternion.LookRotation(patch_script.point_car[point.near_point[i]]._position-transform.position).eulerAngles.y;
temp_diff_angle=Functions.AngleSingle180Abs(temp_angle-temp_angle_point);
if(temp_diff_angle<temp_angle_big){temp_angle_big=temp_diff_angle;temp_point=patch_script.point_car[point.near_point[i]];}
}//for
next_point=temp_point;
}//global_target
else{next_point=patch_script.point_car[point.near_point[Random.Range(0,point.near_point.Count)]];}



}//GetPosition

function GetPointPolice(_point : ClassPointCar){
point=_point;
target_pos=point._position;
if(point.near_point.Count>1){

var temp_angle_big : float=360;
var temp_angle_point : float;
var temp_point : ClassPointCar;
var temp_diff_angle : float;
var temp_angle : float=Quaternion.LookRotation(global_target_pos-transform.position).eulerAngles.y;

for (var i=0;i<point.near_point.Count;i++)	{
temp_angle_point=Quaternion.LookRotation(patch_script.point_police[point.near_point[i]]._position-transform.position).eulerAngles.y;
temp_diff_angle=Functions.AngleSingle180Abs(temp_angle-temp_angle_point);
if(temp_diff_angle<temp_angle_big){temp_angle_big=temp_diff_angle;temp_point=patch_script.point_police[point.near_point[i]];}
}//for
next_point=temp_point;
}//global_target
else{next_point=patch_script.point_police[point.near_point[Random.Range(0,point.near_point.Count)]];}



}//GetPosition


function GetPointStart(_point : ClassPointCar){
    var temp_patch_sc : Patches=GameObject.Find("Game").GetComponent(Patches);
point=_point;
target_pos=point._position;
next_point=temp_patch_sc.point_car[point.near_point[Random.Range(0,point.near_point.Count)]];

}//GetPosition

function FindCentrPoint(){
var temp_pos : Vector3=transform.position;
var temp_angle : float=Quaternion.LookRotation(global_target_pos-transform.position).eulerAngles.y;
var temp_distance : float=Vector3.Distance(global_target_pos,transform.position);
temp_pos.z += temp_distance*0.6*Mathf.Sin(-(temp_angle-90)*(Mathf.PI/180));
temp_pos.x += temp_distance*0.6*Mathf.Cos(-(temp_angle-90)*(Mathf.PI/180));
FindTargetNearPoint(FindTargetPoint(temp_pos)._position);
//Instantiate(target,temp_pos,transform.rotation);
}//FindCentrPoint


function FindTargetPoint(_pos : Vector3){
if(patch_script.point_car.Count>0){
var temp_point : ClassPointCar;
var temp_near_point : ClassPointCar;
var temp_distance_big : float=1000;
var temp_distance : float;
var temp_diff_angle : float;

for (var i=0;i<patch_script.point_car.Count;i++)	{
temp_point=patch_script.point_car[i];
temp_distance=Vector3.Distance(temp_point._position, _pos);
if(temp_distance<temp_distance_big){temp_distance_big=temp_distance;temp_near_point=temp_point;}
}//for
if(temp_near_point){
return temp_near_point;
}//temp_near_point

}//Count
}//FindTargetPoint

function FindTargetNearPoint(_pos : Vector3){
if(patch_script.point_car.Count>0){
var temp_point : ClassPointCar;
var temp_near_point : ClassPointCar;
var temp_distance : float;
var temp_angle_big : float=360;
var temp_diff_angle : float;
var temp_angle_point : float;
var temp_angle : float;

for (var i=0;i<patch_script.point_car.Count;i++)	{
temp_point=patch_script.point_car[i];
temp_distance=Vector3.Distance(temp_point._position, _pos);
if(temp_distance<20){
temp_angle=Quaternion.LookRotation(global_target_pos-temp_point._position).eulerAngles.y;
temp_angle_point=Quaternion.LookRotation(patch_script.point_car[temp_point.near_point[0]]._position-temp_point._position).eulerAngles.y;
temp_diff_angle=Functions.AngleSingle180Abs(temp_angle-temp_angle_point);
if(temp_diff_angle<temp_angle_big){temp_angle_big=temp_diff_angle;temp_near_point=patch_script.point_car[i];}
}//temp_distance
}//for
if(temp_near_point){
GetPoint(temp_near_point);
//Instantiate(target,temp_near_point._position,transform.rotation);
}//temp_near_point

}//Count
}//FindTargetNearPoint

function FindPolicePoint(_pos : Vector3){
if(patch_script.point_police.Count>0){
var temp_point : ClassPointCar;
var temp_near_point : ClassPointCar;
var temp_distance_big : float=1000;
var temp_distance : float;
var temp_diff_angle : float;

for (var i=0;i<patch_script.point_police.Count;i++)	{
temp_point=patch_script.point_police[i];
temp_distance=Vector3.Distance(temp_point._position, _pos);
if(temp_distance<temp_distance_big){temp_distance_big=temp_distance;temp_near_point=temp_point;}
}//for
if(temp_near_point){
GetPoint(temp_near_point);
}//temp_near_point

}//Count
}//FindTargetPoint

function SimpleRacer(){
if(!vehicle_sc)vehicle_sc=GetComponent(sc_vehicle);
racer=true;
if(vehicle_sc.place[0].man)vehicle_sc.place[0].man.GetComponent(sc_man).Danger();
vehicle_sc.limit_speed=vehicle_sc.max_speed*0.8f;
}//SimpleRacer

function Racer(_activate : boolean,_speed : float){
//collider_stop.gameObject.SetActive(!_activate);
//collider_racer.gameObject.SetActive(_activate);
racer=_activate;

if(_activate){
if(vehicle_sc.place[0].man){vehicle_sc.place[0].man.GetComponent(sc_man).Danger();}
vehicle_sc.limit_speed=_speed;}
else{vehicle_sc.limit_speed=70;}
}//racer
