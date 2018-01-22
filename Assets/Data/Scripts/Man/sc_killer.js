#pragma strict
var weapon : int[];

public var weapon_give : boolean=true;

private var game_sc : sc_game;
private var man_script : sc_man;
private var bot_script : sc_bot;
private var man_script_enemy : sc_man;
private var man_script_boss : sc_man;
private var weapon_script : sc_weapon;
private var target_angle : Vector3;
private var enemy_angle : Vector3;
private var enemy_distance : float;
 var fire : boolean;
private var see_range : float;
private var bullets : int;
private var enemy : Transform;
public var boss : Transform;
private var boss_position : Vector3;
function Start () {
game_sc=GameObject.Find("Game").GetComponent(sc_game);
man_script=GetComponent(sc_man);
bot_script=GetComponent(sc_bot);
weapon_script=GetComponent(sc_weapon);
bot_script.have_point=false;
boss_position=Vector3(Random.Range(-2,2),0,Random.Range(-2,2));
Invoke("FindEnemy",1);
Invoke("AfterStart",0.01);
}//Start

function AfterStart () {
weapon_script.WeaponGive(0,false,0,0);
weapon_script.WeaponGive(weapon[Random.Range(0,weapon.Length)],false,0,0);
weapon_script.WeaponSelect(1);
}//AfterStart

function Update () {
if(fire&&enemy&&man_script.doing!="sit_vehicle"&&man_script.doing!="go_to_vehicle"){bot_script.other_doing=true;
enemy_angle=Quaternion.LookRotation(man_script_enemy.bip_target.position-man_script.bip_target.position).eulerAngles;
weapon_script.RotateTo(Functions.AngleSingle180(enemy_angle.x),enemy_angle.y);
weapon_script.target_pos=man_script_enemy.bip_target.position;
if(!weapon_script.fire&&Functions.AngleSingle180Abs(transform.eulerAngles.y-enemy_angle.y)<10){
if(bullets<Mathf.Ceil(200/enemy_distance)/weapon_script.weapon[weapon_script.weapon_index].bot_rate){
weapon_script.fire=true;
if(weapon_script.now_return<weapon_script.max_return){bullets+=1;}
}//fire_rate
else if(weapon_script.now_return<=weapon_script.min_return){bullets=0;}}
}//fire
if(boss){
if(!man_script_boss){man_script_boss=boss.GetComponent(sc_man);}

if(man_script.doing!="sit_vehicle"){
if(man_script_boss.doing=="sit_vehicle"&&man_script.doing!="go_to_vehicle"){
man_script.SitTheVehicle(man_script_boss.vehicle,false,0,true);
}//go_to_vehicle
if(!fire){
var temp_distance : float=Vector3.Distance(transform.position,boss.position);
if(temp_distance>10){
bot_script.target_pos=boss.position+boss_position;
bot_script.doing="run";
if(temp_distance<=15){
man_script.runing=false;
man_script.speed_max=1;
}//temp_distance
else if(temp_distance>15&&temp_distance<=30){
man_script.runing=true;
man_script.speed_max=1;
}//temp_distance
else if(temp_distance>30){
man_script.runing=true;
man_script.speed_max=2;
}//temp_distance
}//temp_distance
}//fire
}//sit_vehicle

else if(man_script.doing=="sit_vehicle"){
if(man_script_boss.vehicle.GetComponent(sc_vehicle).place[0].man==transform&&!man_script_boss.vehicle.GetComponent(sc_vehicle_bot).racer){
man_script_boss.vehicle.GetComponent(sc_vehicle_bot).racer=true;}

if(man_script_boss.doing!="sit_vehicle"&&man_script.doing!="go_to_vehicle"){
man_script.GoOutVehicle();
}//sit_vehicle
}//sit_vehicle
}//boss
}//Update

function FindEnemy(){
Invoke("FindEnemy",1);
if(man_script.doing=="sit_vehicle"){return false;}
var temp_enemy_sc : sc_man;
var temp_weapon : ClassWeapon=weapon_script.weapon[weapon_script.weapon_index];
var temp_enemy : Transform;
var temp_near_enemy : Transform;
var temp_distance_big : float=temp_weapon.range;
var temp_distance : float;
var hit : RaycastHit;



if(enemy&&man_script_enemy&&man_script_enemy.health>0){
temp_distance=Vector3.Distance(enemy.position, transform.position);
if (temp_distance < temp_distance_big&&Physics.Linecast (transform.position+Vector3(0,1.7,0),man_script_enemy.bip_target.position, hit)){
if(hit.transform==enemy || hit.transform.root==man_script_enemy.vehicle || (hit.collider.name!="Terrain"&&hit.collider.material.name=="Glass (Instance)")){
enemy_distance=temp_distance;
return false;
}//enemy
else if(man_script_enemy.doing!="sit_vehicle"){game_sc.GetPositionKiller(enemy);}
}//temp_distance
}//enemy


enemy=null;
for (var i=0;i<game_sc.man.Count;i++)	{
temp_enemy=game_sc.man[i];
temp_enemy_sc=temp_enemy.GetComponent(sc_man);
if(temp_enemy&&temp_enemy_sc&&temp_enemy_sc.health>0&&(temp_enemy_sc.team!=man_script.team || (boss&&man_script_boss.enemy==temp_enemy) || man_script.killer==temp_enemy || man_script.enemy==temp_enemy)){
temp_distance=Vector3.Distance(temp_enemy.position, transform.position);
if (temp_distance < temp_distance_big&&Physics.Linecast (transform.position+Vector3(0,1.7,0),temp_enemy_sc.bip_target.position, hit)){
if(hit.transform==temp_enemy || hit.transform.root==temp_enemy_sc.vehicle || (hit.collider.name!="Terrain"&&hit.collider.material.name=="Glass (Instance)")){
temp_near_enemy=temp_enemy;
temp_distance_big=temp_distance;
}//temp_enemy
}//temp_distance
}//danger
}//for

if(temp_near_enemy){
if(weapon_script.weapon_index==0){weapon_script.WeaponSelect(1);return false;}
fire=true;
enemy=temp_near_enemy;
man_script_enemy=enemy.GetComponent(sc_man);
enemy_distance=temp_distance_big;
}//temp_near_enemy
else if(fire){
fire=false;
bot_script.other_doing=false;
weapon_script.EndFire();}

}//FindEnemy

