#pragma strict
var target : Transform;
var see_range : float=200;
var rotation_speed : float=100;
var doing : String="idle";
var see_point : Transform;
var height_min : float=30;

private var vehicle_sc : sc_vehicle;
private var helecopter_sc : sc_helecopter;
private var weapon_sc : sc_vehicle_weapon;
private var man_script : sc_man;
private var game_sc : sc_game;
private var script_player : sc_player;
private var player : Transform;
private var global_target_pos : Vector3;
private var target_pos : Vector3;
private var target_angle : Vector3;
private var enemy_angle : Vector3;
private var enemy_distance : float;
private var target_distance : float;
private var timer_step : float;
private var timer_step_max : float;
private var fire : boolean;
private var have_bullets : boolean=true;
 var height : float;
  var velocity : float;
   var magnitude : float;
function Start () {
game_sc=GameObject.Find("Game").GetComponent(sc_game);
script_player=game_sc.transform.GetComponent(sc_player);
helecopter_sc=GetComponent(sc_helecopter);
player=script_player.player;
man_script=player.GetComponent(sc_man);
vehicle_sc=GetComponent(sc_vehicle);
weapon_sc=GetComponent(sc_vehicle_weapon);
timer_step_max=Random.Range(3.0f,5.0f);
Invoke("FindEnemy",1);
Invoke("LateStart",0.001);
doing="run";
}//Start

function LateStart(){
vehicle_sc.EngineStart();
}//LateStart

function Update () {
target_pos=player.position;
if(vehicle_sc.engine_work){
//timer_step+=Time.deltaTime;
if(timer_step>timer_step_max){
timer_step=0;
timer_step_max=Random.Range(5.0f,20.0f);
var random_doing : int=Random.Range(0,5);
     if(random_doing==0){doing="idle";timer_step_max=Random.Range(5.0f,10.0f);}
else if(random_doing>0){
doing="run";}
}//timer_step
var hit : RaycastHit;
var hit_point : Vector3=player.position;
if (Physics.Raycast(transform.position,Vector3.down,hit,500)) hit_point=hit.point;

velocity=GetComponent.<Rigidbody>().velocity.y;
magnitude=GetComponent.<Rigidbody>().velocity.magnitude;
target_distance=Vector3.Distance(Vector3(target_pos.x,0,target_pos.z), Vector3(transform.position.x,0,transform.position.z));
target_angle=Quaternion.LookRotation(target_pos-transform.position).eulerAngles;
if(!helecopter_sc.normalized)vehicle_sc.rotate.y=target_angle.y;

var temp_height_diff : float=Mathf.Abs(height-transform.position.y);
if(transform.position.y<height){
//vehicle_sc.throttle=0.1+0.1*Mathf.Abs(Mathf.Clamp(velocity,-10,0));
vehicle_sc.throttle=0.01f+Mathf.Abs(height-transform.position.y)/30;
if(velocity<-1)vehicle_sc.throttle=0.5+0.1*Mathf.Abs(Mathf.Clamp(velocity,-10,0));
}//height
else{vehicle_sc.throttle=-0.05f;}

if(doing=="run"){
var angle_diff : float=Functions.AngleSingle180(target_angle.y-transform.eulerAngles.y);
if(target_distance>10)vehicle_sc.steer=Mathf.Clamp(angle_diff/30,-1,1);
else vehicle_sc.steer=0;
if(target_distance<100){
//if(magnitude>20)vehicle_sc.rotate.x=Mathf.Clamp(-magnitude,0,-30);
if(magnitude>15&&(man_script.doing!="sit_vehicle" || (man_script.doing=="sit_vehicle"&&man_script.vehicle.GetComponent.<Rigidbody>().velocity.magnitude<10)))helecopter_sc.normalized=true;
else helecopter_sc.normalized=false;
vehicle_sc.rotate.x=0;
height=hit_point.y+15;}
else {height=hit_point.y+30;
helecopter_sc.normalized=false;
//if(target_distance<200&&magnitude>20&&man_script.doing!="sit_vehicle")vehicle_sc.rotate.x=-20;
vehicle_sc.rotate.x=Mathf.Clamp(target_distance/5,0,20);
}//else
}//run
else if(doing=="idle"){vehicle_sc.rotate.x=0;}


if(fire&&player){
var turret_angle : Vector3=Quaternion.LookRotation(vehicle_sc.target_pos-weapon_sc.weapon[weapon_sc.weapon_index].turret_point.position).eulerAngles;
var angle_diff_abs : Vector3 =Functions.Angle180Abs(weapon_sc.weapon[weapon_sc.weapon_index].turret_point.eulerAngles-turret_angle);
if(angle_diff_abs.y<weapon_sc.weapon[weapon_sc.weapon_index].fire_angle&&angle_diff_abs.x<weapon_sc.weapon[weapon_sc.weapon_index].fire_angle){vehicle_sc.fire=true;}

vehicle_sc.target_pos=man_script.bip_target.position;
}//fire
}//engine_work
}//Update








function NextWeapon(){
for (var i=0;i<weapon_sc.weapon.Length;i++)	{
if(weapon_sc.weapon[i].bullets>0){weapon_sc.weapon_index=i;return false;}
if(weapon_sc.weapon[weapon_sc.weapon.Length-1].bullets<=0){have_bullets=false;}
}//for
}//NextWeapon

function FindEnemy(){
Invoke("FindEnemy",1);
var temp_distance : float;
var hit : RaycastHit;
var temp_weapon : ClassVehicleWeapon=weapon_sc.weapon[weapon_sc.weapon_index];


temp_distance=Vector3.Distance(player.position, transform.position);
if (temp_distance < see_range&&Physics.Linecast (temp_weapon.turret_point.position,man_script.bip_target.position, hit)){
if(hit.transform.root==player || hit.transform.root==man_script.vehicle){
fire=true;
man_script.Danger();
}//player
else if(fire){fire=false;}
}//temp_distance
else if(fire){fire=false;}
}//FindEnemy
