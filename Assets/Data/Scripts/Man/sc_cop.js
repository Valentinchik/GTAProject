#pragma strict
var weapon : int[];
private var game_sc : sc_game;
private var man_script : sc_man;
private var bot_script : sc_bot;
private var man_script_enemy : sc_man;
private var weapon_script : sc_weapon;
private var target_angle : Vector3;
private var enemy_angle : Vector3;
private var old_pos : Vector3;
private var enemy_distance : float;
private var fire : boolean;
private var go_to_old_pos : boolean;
private var see_range : float;
private var bullets : int;

private var enemy : Transform;


function Start () {
game_sc=GameObject.Find("Game").GetComponent(sc_game);
man_script=GetComponent(sc_man);
bot_script=GetComponent(sc_bot);
weapon_script=GetComponent(sc_weapon);

//weapon_script.WeaponGive(0,false,0,0);
weapon_script.WeaponGive(weapon[Random.Range(0,weapon.Length)],false,0,0);
if(man_script.my_vehicle){weapon_script.WeaponSelect(1);}
weapon_script.WeaponSelect(weapon_script.weapon_index);

Invoke("FindEnemy",1);
Invoke("AfterStart",0.01);
}//Start

function AfterStart () {

}//AfterStart

function Update () {
if(fire&&enemy){
var temp_distance : float=Vector3.Distance(enemy.position,transform.position);
bot_script.other_doing=true;
man_script_enemy.danger_timer=0;
enemy_angle=Quaternion.LookRotation(man_script_enemy.bip_target.position-man_script.bip_target.position).eulerAngles;
if(man_script.doing=="swim"){man_script.Run(Vector3.forward,enemy_angle.y,true);}
weapon_script.RotateTo(Functions.AngleSingle180(enemy_angle.x),enemy_angle.y);
weapon_script.target_pos=man_script_enemy.bip_target.position;
if(temp_distance<weapon_script.weapon[weapon_script.weapon_index].range){
if(!weapon_script.fire&&Functions.AngleSingle180Abs(transform.eulerAngles.y-enemy_angle.y)<10){
if(bullets<Mathf.Ceil(200/enemy_distance)/weapon_script.weapon[weapon_script.weapon_index].bot_rate){
weapon_script.fire=true;
if(weapon_script.now_return<weapon_script.max_return){bullets+=1;}
}//fire_rate
else if(weapon_script.now_return<=weapon_script.min_return){bullets=0;}}
}//temp_distance
else{
if(man_script.fire){weapon_script.EndFire();}
man_script.runing=true;
man_script.Run(Vector3.forward,enemy_angle.y,true);}
}//fire
else if(go_to_old_pos){
var temp_angle : float=Quaternion.LookRotation(old_pos-transform.position).eulerAngles.y;
var temp_distance1 : float=Vector3.Distance(old_pos,transform.position);
man_script.runing=true;
man_script.Run(Vector3.forward,temp_angle,true);

if(temp_distance1<1){
man_script.runing=false;
go_to_old_pos=false;
bot_script.other_doing=false;}
}//go_to_old_pos

}//Update

function FindEnemy(){
Invoke("FindEnemy",1);
var temp_enemy_sc : sc_man;
var temp_weapon : ClassWeapon=weapon_script.weapon[weapon_script.weapon_index];
var temp_enemy : Transform;
var temp_near_enemy : Transform;
var temp_distance_big : float=100;
var temp_distance : float;
var hit : RaycastHit;


if(temp_weapon.range>temp_distance_big){temp_distance_big=temp_weapon.range;}
if(enemy&&man_script_enemy&&man_script_enemy.health>0){
temp_distance=Vector3.Distance(enemy.position, transform.position);
if (temp_distance < temp_distance_big&&Physics.Linecast (transform.position+Vector3(0,1.7,0),man_script_enemy.bip_target.position, hit)){
if(hit.transform==enemy || hit.transform.root==man_script_enemy.vehicle || (hit.collider.name!="Terrain"&&hit.collider.material.name=="Glass (Instance)")){
enemy_distance=temp_distance;
return false;
}//enemy
else {game_sc.GetPositionKiller(enemy);}
}//temp_distance
}//enemy


enemy=null;
for (var i=0;i<game_sc.man.Count;i++)	{
temp_enemy=game_sc.man[i];
temp_enemy_sc=temp_enemy.GetComponent(sc_man);
if(temp_enemy&&temp_enemy_sc&&temp_enemy_sc.health>0&&temp_enemy_sc.danger){
temp_distance=Vector3.Distance(temp_enemy.position, transform.position);
if (temp_distance < temp_distance_big&&Physics.Linecast (transform.position+Vector3(0,1.7,0),temp_enemy_sc.bip_target.position, hit)){
if(hit.transform==temp_enemy || hit.transform.root==temp_enemy || hit.transform.root==temp_enemy_sc.vehicle || (hit.collider.name!="Terrain"&&hit.collider.material.name=="Glass (Instance)")){
temp_near_enemy=temp_enemy;
temp_distance_big=temp_distance;
old_pos=temp_enemy.position;
}//temp_enemy
}//temp_distance
}//danger
}//for

if(temp_near_enemy){
if(weapon_script.weapon_index==0){weapon_script.WeaponSelect(1);return false;}
fire=true;
enemy=temp_near_enemy;
man_script_enemy=enemy.GetComponent(sc_man);
man_script_enemy.Danger();
enemy_distance=temp_distance_big;
old_pos=enemy.position;
}//temp_near_enemy
else if(fire){
fire=false;
go_to_old_pos=true;
weapon_script.EndFire();}

}//FindEnemy