#pragma strict
private var animator : Animator;
public var game_sc : sc_game;
var player_sc : sc_player;
private var vehicle_sc : sc_vehicle;
private var script_weapon : sc_weapon;

var man : int;
var ws_index : int=50;
var money : int=100;
var speed_walk : int=2;
var swim_centr : float=1.4f;
var armor_ob : Transform;

public var kick : List.<int> = new List.<int> ();


public var team : int =0;        
public var max_health : int=100;
public var health : int=max_health;
public var health_100 : int=100;
public var max_armor : int=0;
public var armor : int=max_armor;

public var image : Texture2D;

public var doing : String="idle";
public var can_doing : int=0;
public var fire : boolean;
public var other_doing : boolean;
public var player : boolean;
public var death : boolean;
public var cop : boolean;
public var dellete : boolean=true;
public var destroy : boolean;
public var weapon_index : int;
public var invoke_damage : int;
public var danger : boolean;
public var wanted_score : float;
public var speed_max : int=1;
public var danger_timer : float;
public var danger_timer_max : float=20;
public var vehicle_place : ClassVehiclePlace;
public var my_vehicle_place : ClassVehiclePlace;
public var vehicle : Transform;
public var my_vehicle : Transform;
public var bip_target : Transform;
public var bip : Transform;
public var bip_collider : Transform;
public var killer : Transform;
public var place_death : Transform;
public var hand_l : Transform;
public var hand_r : Transform;
public var enemy : Transform;
public var parachute : Transform;

public var speed : float= 1;
private var speed_temp : int;
private var gravity : float= 9.81;
private var rotation_speed : int=10;
private var condition : int;
private var temp_direction : Vector2;
private var rotation_y : float;
private var rotation : float;
private var rotation_temp : float;
private var direction : Vector3;
private var direction_temp : Vector3;
private var anim_state : AnimatorStateInfo;
private var jump_timer : float;
private var hit : RaycastHit;
private var audio_source : AudioSource;
private var audio_voice : AudioSource;
private var step_timer : float;
private var fall_timer : float;
private var angle : float;
private var doing_angle : Vector3;
private var doing_position : Vector3;
private var rhand_object : Transform;
private var kick_hit : boolean;
private var swim_particle : boolean;
private var rag_doll : boolean;
private var engine_start : boolean=true;
private var open_parachute : boolean;

public var grounded : boolean;
public var runing : boolean;
public var collision : boolean;
public var run : boolean;
public var go_to_car : boolean;

function Start () {
script_weapon=GetComponent(sc_weapon);
if(!game_sc)game_sc=GameObject.Find("Game").GetComponent(sc_game);
//bip_target=transform.FindChild("genSWAT_Reference").FindChild("genSWAT_Hips").FindChild("genSWAT_Spine").FindChild("genSWAT_Spine1");
if(!bip)bip=transform.FindChild("Pelvis");
if(!bip_collider)bip_collider=bip.FindChild("Spine_0");
if(!bip_target)bip_target=bip_collider.FindChild("Spine_1").FindChild("Spine_2").FindChild("Neck_1");
/*
var temp_colider : CapsuleCollider;
temp_colider=bip_collider.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;
temp_colider.center.y=0.24;
temp_colider.radius=0.1;
temp_colider.height=0.35;
temp_colider.direction=1;
temp_colider.enabled=false;
temp_colider.isTrigger=true;*/

animator=GetComponent(Animator);
audio_voice=GetComponent(AudioSource);
audio_source=gameObject.AddComponent(typeof(AudioSource))as AudioSource;
audio_source.volume=0.4f;
game_sc.man.Add(transform);
GetComponent.<Rigidbody>().centerOfMass.y=1.3;
Invoke("AfterStart",0.001f);
}//Start

function AfterStart () {}

function Update () {
health_100=health/(max_health/100.0f); 
anim_state=animator.GetCurrentAnimatorStateInfo(0);
//animator.SetIKPosition(AvatarIKGoal.LeftHand,transform.position+Vector3(0,2,0));
if(danger){danger_timer+=Time.deltaTime;if(danger_timer>danger_timer_max){danger_timer=0;danger=false;}}
if(Physics.Raycast(transform.position+Vector3(0,1,0),Vector3(0,-1,0),hit,1.2) || collision){fall_timer=0;
grounded=true;}else{grounded=false;}

if(doing!="jump"){animator.SetBool("grounded",grounded);}

if(doing!="jump"&&doing!="parachute"&&!grounded&&doing!="fall"&&can_doing<3){
fall_timer+=Time.deltaTime;
if(fall_timer>0.5f){fall_timer=0;
if(doing=="fight")FightFalse();
can_doing=2;
doing="fall";
animator.SetInteger("doing",3);}}

if(doing=="stand_up"){
if(anim_state.normalizedTime>=0.88&&(anim_state.IsName("stand_up_front") || anim_state.IsName("stand_up_back"))){
MoveFalse();
ActivateComponents(true);
if(GetComponent(sc_bot)){if(my_vehicle&&SitMyVehicle()){runing=true;speed_temp=2;}else{GetComponent(sc_bot).FindNearPoint(0);}}
if(vehicle&&vehicle_place){vehicle_place.can_use=true;}
if(!player&&go_to_car)doing="go_to_vehicle";
}//anim_state
}//stand_up

else if(doing=="fly_car"){
transform.position=vehicle_place.place_point.position;
transform.eulerAngles=vehicle_place.place_point.eulerAngles;
if(anim_state.normalizedTime>=0.85&&anim_state.IsName("fly_car")){
vehicle_place.man=null;
vehicle=null;
vehicle_place=null;
GetComponent.<Rigidbody>().isKinematic=false;
GetComponent.<Rigidbody>().AddForce(bip.TransformDirection(Vector3.forward)*100000);
RagDoll();
}
}//fly_car

else if(doing=="go_to_vehicle"&&vehicle){
var temp_com : sc_door;
if(condition==0){
var temp_radius : float;
var temp_angle : Vector3=Quaternion.LookRotation(vehicle_place.door_point.position-transform.position).eulerAngles;
var temp_distance : float=Vector3.Distance(Vector3(vehicle_place.door_point.position.x,0,vehicle_place.door_point.position.z),Vector3(transform.position.x,0,transform.position.z));
Run(Vector3.forward,temp_angle.y,true);
if(vehicle_place.anim==2)temp_radius=8;
if(temp_distance<0.1+speed/10+temp_radius){

if(!vehicle_place.empty){
can_doing=3;
if(vehicle_place.door){
if(vehicle_place.door.GetComponent(sc_door)){temp_com=vehicle_place.door.GetComponent(sc_door);}
else{temp_com=vehicle_place.door.gameObject.AddComponent(typeof(sc_door));}
temp_com.Setting(0,vehicle_place,vehicle_place.direction);
temp_com.Invoke("Open",0.8);
}//door

animator.SetInteger("doing",4);
animator.SetInteger("place",vehicle_place.anim);
animator.applyRootMotion=false;
if((!vehicle_place.door || temp_com._open)&&vehicle_place.can_use){condition=2;}
else{animator.SetInteger("condition",0);condition=1;}
}//empty
else{
SitVehicle(vehicle,vehicle_place,true);
vehicle_place.can_use=true;}
if(vehicle.GetComponent(sc_motobike_js))vehicle.GetComponent(sc_motobike_js).Stand();
run=false;
if(vehicle_place.anim==2)condition=4;
}//temp_distance
}//condition=0

else if(condition==1){
RotateTo(vehicle_place.door_point.eulerAngles.y);
transform.position=vehicle_place.door_point.position;
if(anim_state.normalizedTime>0.9&&anim_state.IsName("open_right_door")&&vehicle_place.can_use){condition=2;}
}//condition==1

else if(condition==2){
if(vehicle_place.man){animator.SetInteger("condition",3);condition=3;Voice(1,20);}
else{condition=4;}
}//condition==2

else if(condition==3){
vehicle_place.can_use=false;
RotateTo(vehicle_place.door_point.eulerAngles.y);
transform.position=vehicle_place.door_point.position;
if(anim_state.IsName("out_car")){
if(anim_state.normalizedTime>=0.45&&vehicle_place.man){vehicle_place.man.GetComponent(sc_man).FlyCar();}
if(anim_state.normalizedTime>=0.93){
animator.SetInteger("condition",1);
condition=4;}
}//out_car
}//condition==3

else if(condition==4){
vehicle_place.can_use=false;
GetComponent(CapsuleCollider).enabled=false;
animator.SetInteger("condition",1);
condition=5;
}//condition==4

else if(condition==5){
RotateTo(vehicle_place.door_point.eulerAngles.y);
transform.position=vehicle_place.door_point.position;
if(anim_state.normalizedTime>=1&&anim_state.IsName("siting_car_right") || vehicle_place.anim==2){
if(vehicle_place.door&&vehicle_place.door.GetComponent(sc_door)){vehicle_place.door.GetComponent(sc_door).Invoke("Close",0.01);}
SitVehicle(vehicle,vehicle_place,engine_start);
vehicle_place.can_use=true;
condition=0;}
}//condition==5

if((script_weapon&&script_weapon.weapon_index!=0)&&
(condition==1 || condition==2 || condition==3 || condition==5)){
script_weapon.weapon_current=script_weapon.weapon_index;
script_weapon.WeaponSelect(0);}

}//go_to_vehicle

else if(doing=="go_out_vehicle"){
transform.position=vehicle_place.door_point.position;
transform.eulerAngles=vehicle_place.door_point.eulerAngles;
if(anim_state.normalizedTime>=0.88&&anim_state.IsName("out_car_right")||vehicle_place.anim==2){
animator.SetInteger("doing",0);
animator.SetInteger("condition",0);
var hit : RaycastHit;
Move();
GetComponent(CapsuleCollider).enabled=true;
GetComponent(AudioSource).enabled=true;
if(bip_collider){bip_collider.GetComponent(CapsuleCollider).enabled=false;}//bip_collider
GetComponent.<Rigidbody>().isKinematic=false;
ActivateComponents(true);
if(GetComponent(sc_car_cop)){vehicle.GetComponent(sc_car_cop).enabled=false;}
script_weapon.WeaponSelect(script_weapon.weapon_current);
if(vehicle_place==vehicle_sc.place[vehicle_sc.place_drive]&&vehicle_sc.engine_work){vehicle_sc.EngineStop();}
transform.eulerAngles.x=0;
transform.eulerAngles.z=0;
if(Physics.Raycast(vehicle_place.door_point.position+Vector3(0,1.5,0),Vector3(0,-1,0),hit,10)){
transform.position=hit.point;}
vehicle_place.man=null;
vehicle_place.use=false;
vehicle=null;
vehicle_place=null;
}//
}//go_out_vehicle

else if(doing=="sit_vehicle"){
transform.position=vehicle_place.place_point.position;
transform.eulerAngles=vehicle_place.place_point.eulerAngles;

if(script_weapon&&script_weapon.weapon_index!=0)script_weapon.WeaponSelect(0);
}//sit_vehicle

else if(doing=="swim"){
if(script_weapon&&script_weapon.weapon_index!=0){script_weapon.WeaponSelect(0);}


RotateTo(rotation_temp);
direction=Vector3.Lerp(direction,direction_temp,2*Time.deltaTime);
animator.SetFloat("direction_x",direction.x);
animator.SetFloat("direction_z",direction.z);
rotation=Quaternion.Slerp(Quaternion.Euler(0,rotation,0),Quaternion.Euler(0,rotation_temp,0),5*Time.deltaTime).eulerAngles.y;
if(direction.magnitude>0.05){
if(!swim_particle){Invoke("CreateSwimParticle",0.2);swim_particle=true;}
GetComponent.<Rigidbody>().AddForce(transform.TransformDirection(direction*1000));}
else{GetComponent.<Rigidbody>().AddForce(-Vector3(GetComponent.<Rigidbody>().velocity.x,0,GetComponent.<Rigidbody>().velocity.z)*100);}
direction_temp=Vector3.zero;
if(grounded){Move();}

}//swim

else if(doing=="jump"){
jump_timer+=Time.deltaTime;
if(jump_timer>1){Move();jump_timer=0;animator.SetBool("jump",false);}

if(grounded&&jump_timer>0.1){
Move();
animator.SetBool("jump",false);
animator.SetBool("grounded",true);
if(!audio_source.isPlaying){PlaySoundStep();}
}//grounded
}//jump

else if(doing=="fall"){
if(grounded){fall_timer=0;Move();if(!audio_source.isPlaying){PlaySoundStep();}}
}//fall

else if(doing=="parachute"){
RotateTo(rotation_temp);
direction=Vector3.Lerp(direction,direction_temp,2*Time.deltaTime);
if(direction.magnitude>0.05)GetComponent.<Rigidbody>().AddForce(transform.TransformDirection(direction*1000));
else GetComponent.<Rigidbody>().AddForce(-Vector3(GetComponent.<Rigidbody>().velocity.x,0,GetComponent.<Rigidbody>().velocity.z)*100);
direction_temp=Vector3.zero;

if(grounded){
fall_timer=0;
Move();
player_sc.NextCamera(0);
if(!audio_source.isPlaying)PlaySoundStep();
Destroy(parachute.gameObject);
GetComponent.<Rigidbody>().drag=0;
open_parachute=false;
}//grounded
}//fall

else if(doing=="fight"){
RotateTo(rotation_y);
if(kick.Count>0){
animator.SetInteger("kick",kick[0]);
if(!kick_hit&&anim_state.normalizedTime>0.5&&anim_state.normalizedTime<0.55){Kick();}
if(anim_state.normalizedTime>0.6&&anim_state.IsName("kick_"+kick[0])){
kick_hit=false;
kick.RemoveAt(0);
if(kick.Count==0){animator.SetInteger("kick",0);}}
}//Count

}//fight

else if(doing=="doing"){
if(condition==4){RotateTo(doing_angle.y);
transform.position=Vector3.Lerp(transform.position,Vector3(doing_position.x,transform.position.y,doing_position.z),10*Time.deltaTime);
}//condition
}//"doing"


if(run){
if(grounded){
step_timer+=Time.deltaTime;
if(step_timer>0.15/(speed/4)){step_timer=0;PlaySoundStep();}

var temp_velocity : Vector3=transform.TransformDirection(direction)*speed*speed_walk;
transform.GetComponent.<Rigidbody>().velocity.x=temp_velocity.x;
transform.GetComponent.<Rigidbody>().velocity.z=temp_velocity.z;
RotateTo(rotation_temp+angle);

direction=Vector3.Lerp(direction,direction_temp,10*Time.deltaTime);
speed=Mathf.Lerp(speed,speed_temp,10*Time.deltaTime);
animator.SetFloat("direction_x",direction.x);
animator.SetFloat("direction_z",direction.z);
animator.SetFloat("speed",speed);
animator.SetFloat("rotation_y",-Functions.AngleSingle180(transform.eulerAngles.y-rotation));
rotation=Quaternion.Slerp(Quaternion.Euler(0,rotation,0),Quaternion.Euler(0,rotation_temp,0),5*Time.deltaTime).eulerAngles.y;
if(runing){speed_temp=speed_max+1;
animator.SetBool("run",true);}
else{speed_temp=speed_max;
animator.SetBool("run",false);}
if(direction.magnitude<0.1&&doing!="go_to_vehicle"){MoveFalse();Idle();}
direction_temp=Vector3.zero;
}//grounded


}//run

}//Update
function OnCollisionStay (_collision : Collision) {
if (_collision.contacts.Length > 0&&_collision.contacts[0].point.y<transform.position.y+0.2f)collision=true;
}//
function OnCollisionEnter (_collision : Collision) {
if(_collision.rigidbody&&_collision.rigidbody.mass<30){return false;}
if(_collision.relativeVelocity.sqrMagnitude > 200){//_collision.transform.root.GetComponent(sc_vehicle)&&
if(_collision.transform.root.GetComponent(sc_vehicle)&&_collision.transform.root.GetComponent(sc_vehicle).place[0].man){
AudioSource.PlayClipAtPoint(game_sc.man_hit_car[0], transform.position,1);
killer=_collision.transform.root.GetComponent(sc_vehicle).place[0].man;
_collision.transform.root.GetComponent(sc_vehicle).place[0].man.GetComponent(sc_man).Danger();}
Damage(_collision.relativeVelocity.sqrMagnitude/5,_collision.relativeVelocity.sqrMagnitude*200,_collision.relativeVelocity.normalized,_collision.contacts[0].point,killer);
}//sqrMagnitude
}//OnCollisionEnter
function OnCollisionExit (_collision : Collision) {collision=false;
}//OnCollisionEnter

function Idle(){
animator.applyRootMotion=false;
animator.SetInteger("doing",0);
animator.SetInteger("condition",0);
other_doing=false;
doing="idle";
can_doing=0;
run=false;
}//Idle

function Run(_direction : Vector3,_rotation_y : float,_hit : boolean){
if(can_doing<2){
if(doing=="fight")FightFalse();
can_doing=1;
animator.SetInteger("doing",0);
if(_hit){
var hit : RaycastHit;
     if(Physics.Raycast(transform.position+Vector3(0,1,0),transform.TransformDirection(Vector3( 1,-0.5f,1)),hit,0.7f)&&hit.transform.tag!="door"){angle-=10;}
else if(Physics.Raycast(transform.position+Vector3(0,1,0),transform.TransformDirection(Vector3(-1,-0.5f,1)),hit,0.7f)&&hit.transform.tag!="door"){angle+=10;}
else if(angle>0){angle-=5;}
else if(angle<0){angle+=5;}}
else{angle=0;}

run=true;
}//can_doing
rotation_temp=_rotation_y;
direction_temp=_direction;
}//Run

function Go(_direction : Vector3,_rotation_y : float,_speed : float){
//if(GetComponent(CharacterController)){GetComponent(CharacterController).Move(_direction*Time.deltaTime*_speed);}
RotateTo(_rotation_y);


}//go


function RotateTo(_rotation : float){
transform.eulerAngles.y = Quaternion.Slerp(transform.rotation,Quaternion.Euler(0,_rotation,0),rotation_speed * Time.deltaTime).eulerAngles.y;
}//RotateTo



function Jump(){
if(grounded&&doing!="jump"&&can_doing<3){
run=false;
can_doing=2;
if(doing=="fight")FightFalse();
animator.SetInteger("doing",2);
doing="jump";
jump_timer=0;
GetComponent.<Rigidbody>().AddForce((Vector3(0,2,0)+transform.TransformDirection(direction_temp*(speed/5)))*6000);
animator.SetBool("grounded",false);
AudioSource.PlayClipAtPoint(game_sc.sound_jump[Random.Range(0,game_sc.sound_jump.Length)], transform.position,0.2);
}}//Jump

function Fight(_num : int,_rotation_y : float){
if(can_doing==0){
other_doing=true;
run=false;
animator.applyRootMotion=true;
//animator.SetBool("fight",true);
animator.SetInteger("doing",1);
doing="fight";
rotation_y=_rotation_y;
if(kick.Count<3){
if(kick.Count==0){kick.Add(_num);}
else if(kick[kick.Count-1]==4&&_num==2){kick.Add(7);}
else{kick.Add(_num+3);}}
}//can_doing
}//Fight

function Kick(){
var temp_hit : RaycastHit;
var temp_sound : int=6;
var temp_height : int=1.4;

if(kick[0]==3){temp_height=1;}
if(Physics.Raycast(transform.position+Vector3(0,temp_height,0),transform.TransformDirection(Vector3(0.2f,0,1)),temp_hit,1.5) ||
 Physics.Raycast(transform.position+Vector3(0,temp_height,0),transform.TransformDirection(Vector3(-0.2f,0,1)),temp_hit,1.5)){
if(temp_hit.transform.GetComponent(sc_man)){
if(temp_hit.transform.GetComponent(sc_man).cop)Danger();
temp_hit.transform.GetComponent(sc_man).Damage(Random.Range(20,30),60000,transform.TransformDirection(Vector3.forward),temp_hit.point,transform);}
else if(temp_hit.rigidbody){temp_hit.rigidbody.AddForce(transform.TransformDirection(Vector3.forward)*20000);}
else if(temp_hit.transform.root.GetComponent.<Rigidbody>()){temp_hit.transform.root.GetComponent.<Rigidbody>().AddForce(transform.TransformDirection(Vector3.forward)*20000);}


if(temp_hit.collider.name!="Terrain"){
if(temp_hit.collider.material.name=="Metal (Instance)"){temp_sound=5;}
else if(temp_hit.collider.material.name=="Wood (Instance)"){temp_sound=7;}
else if(temp_hit.collider.material.name=="man (Instance)"){temp_sound=Random.Range(0,4);}
else {temp_sound=6;
Damage(Random.Range(5,10),0,Vector3.zero,Vector3.zero,null);}                                                                                                     
}//Terrain



AudioSource.PlayClipAtPoint(game_sc.sound_kick[temp_sound], transform.position,0.5);
}//Raycast

kick_hit=true;
}//Kick

function FightFalse(){
Move();
kick.Clear();
animator.SetInteger("kick",0);
}//FightFalse

function Move(){
other_doing=false;
can_doing=1;
if(vehicle_place){vehicle_place.use=false;}
animator.applyRootMotion=false;
animator.SetInteger("doing",0);
doing="null";
if(!player&&go_to_car)doing="go_to_vehicle";
run=true;
}//Run

function MoveFalse(){
other_doing=false;
can_doing=1;
animator.applyRootMotion=false;
animator.SetInteger("doing",0);
animator.SetFloat("speed",0);
animator.SetBool("run",false);
animator.SetFloat("direction_x",0);
animator.SetFloat("direction_z",0);
speed=0;
runing=false;
run=false;
doing="idle";
Idle();
}//Run

function FindVehicle(_place : boolean){
if(doing=="stand_up")return false;
var temp_distance : float;
var temp_distance_big : float=20;
var temp_vehicle : Transform;
var temp_target : Transform;
var temp_place : ClassVehiclePlace;
var temp_near_place : ClassVehiclePlace;
for (var i=0;i< game_sc.vehicle.Count;i++){
    if(game_sc.vehicle[i].GetComponent(sc_vehicle).death) continue;
temp_vehicle=game_sc.vehicle[i];
temp_distance=Vector3.Distance(transform.position,temp_vehicle.position);
if(temp_distance<temp_distance_big){
temp_distance_big=temp_distance;
temp_target=temp_vehicle;
}//temp_distance
}//for
if(temp_target){
if(!_place){
temp_distance_big=50;
for (var j=0;j< temp_target.GetComponent(sc_vehicle).place.Length;j++){
temp_place=temp_target.GetComponent(sc_vehicle).place[j];
temp_distance=Vector3.Distance(transform.position,temp_place.door_point.position);
if(temp_distance<temp_distance_big){
temp_distance_big=temp_distance;
temp_near_place=temp_place;
}//temp_distance
}//for
}//_place
else{
temp_near_place=temp_target.GetComponent(sc_vehicle).place[0];
}//else
other_doing=true;
doing="go_to_vehicle";
go_to_car=true;
vehicle=temp_target;
vehicle_sc=vehicle.GetComponent(sc_vehicle);
vehicle_place=temp_near_place;
vehicle_place.use=true;
animator.SetInteger("condition",0);
animator.SetInteger("door_direction",vehicle_place.direction);
condition=0;
return true;
}
else {return false;}
}//FindVehicle

function SitMyVehicle(){
if(doing=="stand_up")return false;
if(my_vehicle&&my_vehicle_place){
var temp_distance : float=Vector3.Distance(transform.position,my_vehicle.position);
if(temp_distance<50){
doing="go_to_vehicle";
go_to_car=true;
vehicle=my_vehicle;
vehicle_sc=vehicle.GetComponent(sc_vehicle);
vehicle_place=my_vehicle_place;
other_doing=true;
//animator.SetInteger("doing",4);
animator.SetInteger("condition",0);
animator.SetInteger("door_direction",vehicle_place.direction);
condition=0;
return true;
}//temp_distance
else{return false;
my_vehicle=null;
my_vehicle_place=null;}
}//my_vehicle
else{return false;
my_vehicle=null;
my_vehicle_place=null;}
}//SitMyVehicle

function SitTheVehicle(_vehicle : Transform,_place : boolean,_place_num : int,_engine_start : boolean){
var temp_distance : float;
var temp_distance_big : float=20;
var temp_place : ClassVehiclePlace;
var temp_near_place : ClassVehiclePlace;
if(!animator)animator=GetComponent(Animator);
if(_vehicle){
temp_distance_big=50;

if(!_place){
for (var j=0;j< _vehicle.GetComponent(sc_vehicle).place.Length;j++){
temp_place=_vehicle.GetComponent(sc_vehicle).place[j];
temp_distance=Vector3.Distance(transform.position,temp_place.door_point.position);
if(temp_distance<temp_distance_big&&!temp_place.use){
temp_distance_big=temp_distance;
temp_near_place=temp_place;
}//temp_distance
}//for
}//_place
else if(_vehicle.GetComponent(sc_vehicle).place.Length>_place_num)
temp_near_place=_vehicle.GetComponent(sc_vehicle).place[_place_num];

if(temp_near_place){
other_doing=true;
doing="go_to_vehicle";
go_to_car=true;
engine_start=_engine_start;
vehicle=_vehicle;
vehicle_sc=vehicle.GetComponent(sc_vehicle);
vehicle_place=temp_near_place;
vehicle_place.use=true;
//animator.SetInteger("doing",4);
animator.SetInteger("condition",0);
animator.SetInteger("door_direction",vehicle_place.direction);
condition=0;
return true;
}//temp_near_place
}//_vehicle
}//SitMyVehicle

function SitVehicle(_vehicle : Transform,_place : ClassVehiclePlace,_engine_start : boolean){
if(_vehicle){
vehicle=_vehicle;
vehicle_sc=vehicle.GetComponent(sc_vehicle);
if(player){
vehicle_sc.limit_speed=vehicle_sc.max_speed;
player_sc.NextCameraVehicle(0,true);
if(vehicle.GetComponent(sc_car_cop))vehicle.GetComponent(sc_car_cop).enabled=false;
vehicle.GetComponent(RCC_CarControllerV3).canControl = true;
}//player
if(GetComponent(sc_bot)){
GetComponent(sc_bot).enabled=false;
vehicle_place=_place;
//if(!_engine_start){vehicle_place=vehicle_sc.place[vehicle_sc.place_drive];}
if(vehicle_place==vehicle_sc.place[vehicle_sc.place_drive]&&vehicle.GetComponent(sc_vehicle_bot)){vehicle.GetComponent(sc_vehicle_bot).enabled=true;vehicle.GetComponent(sc_vehicle_bot).Invoke("FindNearPoint",0.1);}
}//sc_bot
//if(GetComponent(sc_weapon))GetComponent(sc_weapon).EndFire();
vehicle_place.man=transform;
my_vehicle_place=vehicle_place;
my_vehicle=vehicle;
vehicle_sc.driver=transform;
vehicle_place.use=true;
doing="sit_vehicle";
go_to_car=false;
can_doing=4;
other_doing=false;
GetComponent(Animator).SetInteger("doing",4);
GetComponent(Animator).SetInteger("condition",2);
GetComponent(Animator).SetInteger("place",vehicle_place.anim);
GetComponent(Animator).SetInteger("door_direction",vehicle_place.direction);
GetComponent(CapsuleCollider).enabled=false;
if(bip_collider){bip_collider.GetComponent(CapsuleCollider).enabled=true;}//bip_collider
//Physics.IgnoreCollision(my_vehicle.collider,bip_collider.collider,true);}//bip_collider

GetComponent(AudioSource).enabled=false;
GetComponent.<Rigidbody>().isKinematic=true;
ActivateComponents(false);
if(GetComponent(sc_cop)&&vehicle.GetComponent(sc_car_cop)){vehicle.GetComponent(sc_car_cop).enabled=true;}
if(_engine_start&&vehicle_place==vehicle_sc.place[vehicle_sc.place_drive]&&!vehicle_sc.engine_work){vehicle_sc.EngineStart();}
}//temp_target

}//SitVehicle



function GoOutVehicle(){
var temp_com : sc_door;
can_doing=3;
doing="go_out_vehicle";
animator.SetInteger("doing",4);
animator.SetInteger("condition",3);
animator.SetInteger("door_direction",vehicle_place.direction);
if(player){
    player_sc.CameraCharacter();
    vehicle.GetComponent(RCC_CarControllerV3).canControl = false;
}
if(vehicle_place.door&&!vehicle_place.door.GetComponent(sc_door)){
if(vehicle_place.door.GetComponent(sc_door)){temp_com=vehicle_place.door.GetComponent(sc_door);}
else{temp_com=vehicle_place.door.gameObject.AddComponent(typeof(sc_door));}
temp_com.Setting(0,vehicle_place,vehicle_place.direction);
temp_com.Invoke("Open",0.1);}

if(GetComponent(sc_bot)){
if(vehicle_place==vehicle_sc.place[vehicle_sc.place_drive]){vehicle.GetComponent(sc_vehicle_bot).enabled=false;}}
if(vehicle.GetComponent(sc_car_cop)){vehicle.GetComponent(sc_car_cop).enabled=false;}
vehicle_sc.throttle=0;
vehicle_place.use=false;
}//GoOutVehicle



function StandUp(){
var hit : RaycastHit;
doing="stand_up";
can_doing=3;
rag_doll=false;
//animator.applyRootMotion=true;
if(Functions.AngleSingle180(bip.eulerAngles.z)<180&&Functions.AngleSingle180(bip.eulerAngles.z)>0){
transform.eulerAngles.y=bip.eulerAngles.y+90;
animator.SetInteger("stand_up",1);}
else{transform.eulerAngles.y=bip.eulerAngles.y+90;
animator.SetInteger("stand_up",0);}
animator.SetInteger("doing",5);
if(Physics.Raycast(bip.position+Vector3(0,0.5,0),Vector3(0,-1,0),hit,2)){transform.position.y=hit.point.y-0.3;}
}//StandUp

function FlyCar(){
    if(player)
    {
        player_sc.CameraCharacter();
        vehicle.GetComponent(RCC_CarControllerV3).canControl = false;
    }
animator.SetInteger("doing",6);
animator.SetInteger("condition",0);
animator.SetInteger("door_direction",vehicle_place.direction);
if(GetComponent(sc_bot)){
if(vehicle_place==vehicle_sc.place[vehicle_sc.place_drive]){vehicle.GetComponent(sc_vehicle_bot).enabled=false;}}
vehicle_sc.throttle=0;
vehicle_place.use=false;
doing="fly_car";
can_doing=3;
}//FlyCar

function Swim(){
if(!grounded){
GetComponent.<Rigidbody>().centerOfMass.y=swim_centr;
can_doing=3;
doing="swim";
animator.SetInteger("doing",8);
}//grounded
}//Swim

function CreateSwimParticle(){
var hit : RaycastHit;
//if(Physics.Raycast(transform.position+Vector3(0,1.9,0),Vector3(0,-1,0),hit,2)){
//Instantiate (game_sc.particle_swim,hit.point+Vector3(0,0.1,0),Quaternion.Euler(Vector3.zero));}
AudioSource.PlayClipAtPoint(game_sc.sound_step_water[Random.Range(0,game_sc.sound_step_water.Length)],transform.position,1);
swim_particle=false;
}//CreateSwimParticle

function Doing(_index : int, _time : float,_angle : Vector3,_position : Vector3){
MoveFalse();
doing_angle=_angle;
doing_position=_position;
condition=_index;
doing="doing";
can_doing=2;
animator.SetInteger("doing",7);
animator.SetInteger("condition",_index);
if(_index==4){
rhand_object= Instantiate (game_sc.object[Random.Range(0,2)],hand_r.position,hand_r.rotation);
rhand_object.parent=hand_r;
}//_index
else if(_index==5){
rhand_object= Instantiate (game_sc.object[3],hand_r.position,hand_r.rotation);
rhand_object.parent=hand_r;
}//_index

Invoke("DoingFalse",_time);
}//Dance

function DoingFalse(){
if(rhand_object){Destroy(rhand_object.gameObject);}
Idle();
}//DanceFalse

function Danger(){
if(!cop){
danger_timer=0;
danger=true;
}//sc_cop
}//Danger

function InvokeDamage(){
Damage(invoke_damage,0,Vector3.zero,Vector3.zero,null);
}//InvokeDamage

function Damage(_power : float,_force : float,_dir : Vector3,_point : Vector3,_killer : Transform){
if(!death){
if(armor>0){
armor-=_power;
if(armor<=0&&armor_ob){
armor=0;
armor_ob.gameObject.SetActive(false);}
if(player)PlayerPrefs.SetInt("armor",armor);
}//armor
if(armor<=0) health-=_power;
//transform.rigidbody.AddForce(_dir*_force);
if(player){player_sc.Hit();}
if(_killer){killer=_killer;}
if(health<=0){death=true;
game_sc.Death(man,transform);
if(player)player_sc.PlayerDeath();
//game_sc.CreatePD(transform,killer);
if(killer){killer.GetComponent(sc_man).AddWantedScore(ws_index);}
if(vehicle&&(vehicle.GetComponent(sc_motobike_js) || vehicle_sc.boat)){
if(vehicle.GetComponent(sc_vehicle_bot)){vehicle.GetComponent(sc_vehicle_bot).enabled=false;}
if(vehicle.GetComponent(sc_car_cop)){vehicle.GetComponent(sc_car_cop).enabled=false;}
if(vehicle.GetComponent(sc_motobike_js))vehicle.GetComponent(sc_motobike_js).crash=true;
vehicle_sc.throttle=0;
vehicle_place.use=false;
vehicle_place.man=null;
}//sc_motobike_js
if(doing=="sit_vehicle"&&!vehicle.GetComponent(sc_motobike_js)&&!vehicle_sc.boat){DeathInCar();}
else {
transform.GetComponent.<Rigidbody>().AddForceAtPosition(_dir*_force,_point);
RagDoll();
CreateMoney();}

}//health
if(_force>60000&&health>0&&!rag_doll){transform.GetComponent.<Rigidbody>().AddForceAtPosition(_dir*_force,_point);RagDoll();}
}//death
}//Damage

function RagDoll(){
rag_doll=true;
if(script_weapon)script_weapon.EndFire();
if(!GetComponent(sc_ragdoll)&&!GetComponent(sc_ragdoll_ready)){
run=false;
if(player) player_sc.CameraCharacter();
gameObject.AddComponent(typeof(sc_ragdoll));}
else if(GetComponent(sc_ragdoll_ready)){
run=false;
if(player) player_sc.CameraCharacter();
GetComponent(sc_ragdoll_ready).RagDoll();
}//else
bip_collider.GetComponent.<Collider>().enabled=false;
ActivateComponents(false);
}//RagDoll

function PlaySoundStep(){
audio_source.clip = game_sc.sound_step_default[Random.Range(0,game_sc.sound_step_default.Length)];
if(hit.collider&&hit.collider.GetType () != typeof(TerrainCollider)&&hit.collider.material){
     if(hit.collider.material.name=="Metal (Instance)"){audio_source.clip = game_sc.sound_step_metal[Random.Range(0,game_sc.sound_step_metal.Length)];}
else if(hit.collider.material.name=="Wood (Instance)" ){audio_source.clip = game_sc.sound_step_wood [Random.Range(0,game_sc.sound_step_wood.Length)];}
else if(hit.collider.material.name=="Water (Instance)"){audio_source.clip = game_sc.sound_step_water[Random.Range(0,game_sc.sound_step_water.Length)];}                                                                                                  
}//collider
audio_source.Play();

}//PlaySoundStep




function DeathInCar(){
vehicle_place.use=false;
animator.SetInteger("condition",4);
vehicle_sc.throttle=0;
if(GetComponent(CapsuleCollider)){Destroy(GetComponent(CapsuleCollider));}
if(script_weapon){Destroy(script_weapon);}
if(GetComponent(sc_bot)){Destroy(GetComponent(sc_bot));}
if(GetComponent(sc_cop)){Destroy(GetComponent(sc_cop));}
if(vehicle.GetComponent(sc_vehicle_bot)){vehicle.GetComponent(sc_vehicle_bot).enabled=false;}
if(vehicle.GetComponent(sc_car_cop)){vehicle.GetComponent(sc_car_cop).enabled=false;}
}//DeathInCar





function AddWantedScore(_index : int){
Danger();
if(wanted_score<600){
wanted_score+=_index;
if(wanted_score>600){wanted_score=600;}
}//600
}//AddWantedScore

function ActivateComponents(_index : boolean){
if(script_weapon){script_weapon.enabled=_index;}
if(GetComponent(sc_bot)){GetComponent(sc_bot).enabled=_index;}
if(GetComponent(sc_cop)){GetComponent(sc_cop).enabled=_index;}
if(GetComponent(sc_band)){GetComponent(sc_band).enabled=_index;}

}//ActivateComponents


function CreateMoney(){
var temp_object : Transform= Instantiate (game_sc.money_ob);
temp_object.position=transform.position+Vector3(0,1,0);
temp_object.GetComponent.<Rigidbody>().AddForce(transform.TransformDirection(Vector3.forward)*2000);
temp_object.GetComponent(sc_money).money=money;
}//CreateMoney

function GiveArmor(_armor : int){
armor=_armor;
max_armor=500;
if(player)PlayerPrefs.SetInt("armor",_armor);
if(armor_ob)armor_ob.gameObject.SetActive(true);
}//GiveArmor

function GiveParachute(){
if(parachute)return false;
if(player)PlayerPrefs.SetInt("parachute",1);
parachute=Instantiate (game_sc.parachute);
parachute.parent=bip_collider;
parachute.localPosition=Vector3.zero;
parachute.localEulerAngles=Vector3.zero;
}//GiveArmor



function OpenParachute(){
if(!parachute || open_parachute)return false;
if(player)PlayerPrefs.SetInt("parachute",0);
script_weapon.WeaponSelect(0);
parachute.transform.GetChild(0).transform.GetComponent.<Animation>().Play();
player_sc.NextCamera(3);
if(game_sc.sound_parachute){
parachute.gameObject.AddComponent(typeof (AudioSource));
parachute.GetComponent.<AudioSource>().clip=game_sc.sound_parachute;
parachute.GetComponent.<AudioSource>().Play();
}//sound_parachute
GetComponent.<Rigidbody>().drag=2;
can_doing=3;
doing="parachute";
animator.SetInteger("doing",15);
open_parachute=true;
}//OpenParachute

function Voice(_voice : int,_random : int){
if(audio_voice.isPlaying || death || Random.Range(0,100)>_random)return false;
audio_voice.clip = game_sc.sound_voice[man].voice[_voice].sound[Random.Range(0,game_sc.sound_voice[man].voice[_voice].sound.Count)];
audio_voice.Play();
}//Voice

function VoiceDeath(){Voice(2,50);}
function VoiceBandDeath(){Voice(3,50);}




