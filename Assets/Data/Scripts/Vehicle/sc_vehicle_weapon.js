#pragma strict
var weapon : ClassVehicleWeapon[];
var turret_speed : float = 100;

public var weapon_index : int;
public var metkost : int;
public var shoot : boolean;
public var target : Transform;


private var vehicle_sc : sc_vehicle;
private var body : Transform;
private var controller : Transform;
private var fire_timer : float;
private var game_script : sc_game;

function Start () {
game_script=GameObject.Find("Game").GetComponent(sc_game);
vehicle_sc=GetComponent(sc_vehicle);
body=transform.FindChild("body");
controller=transform.FindChild("controller");
//AllFireEffectFalse();
}//Start

function Update () {
if(vehicle_sc.engine_work){
var temp_weapon : ClassVehicleWeapon=weapon[weapon_index];
if(weapon.Length>0&&Functions.AngleSingle180(transform.localEulerAngles.z)<90&&Functions.AngleSingle180(transform.localEulerAngles.z)>-90&&vehicle_sc.engine_work&&!temp_weapon.rocket){
var turret_angle : Vector3=Quaternion.LookRotation(vehicle_sc.target_pos-temp_weapon.turret_point.position).eulerAngles;
var angle_diff : Vector3;
angle_diff =Functions.Angle180(temp_weapon.turret_point.eulerAngles-turret_angle);

     if(angle_diff.y> 0){temp_weapon.turret_point.localEulerAngles.y-=Mathf.Abs(angle_diff.y*turret_speed)/100;}
else if(angle_diff.y< 0){temp_weapon.turret_point.localEulerAngles.y+=Mathf.Abs(angle_diff.y*turret_speed)/100;}
     if(angle_diff.x> 0&&Functions.AngleSingle180(temp_weapon.turret_point.localEulerAngles.x)>-temp_weapon.angle.x){temp_weapon.turret_point.localEulerAngles.x-=Mathf.Abs(angle_diff.x*turret_speed)/100;}
else if(angle_diff.x< 0&&Functions.AngleSingle180(temp_weapon.turret_point.localEulerAngles.x)< temp_weapon.angle.y){temp_weapon.turret_point.localEulerAngles.x+=Mathf.Abs(angle_diff.x*turret_speed)/100;}
if(temp_weapon.turret){temp_weapon.turret.localEulerAngles.y=temp_weapon.turret_point.localEulerAngles.y;}
if(temp_weapon.dulo){temp_weapon.dulo.localEulerAngles.x=temp_weapon.turret_point.localEulerAngles.x;}


}//weapon.Length

if(vehicle_sc.fire){
if(!shoot&&temp_weapon.bullets>0){
shoot=true;
Shoot();
}//shoot

if(shoot){
fire_timer+=Time.deltaTime;
if(fire_timer>=temp_weapon.fire_rate){
fire_timer=0;
shoot=false;
vehicle_sc.fire=false;
if(temp_weapon.other_weapon.active){OtherWeapon();}
}//fire_timer
}//shoot

}//fire
}//engine_work
}//Update

function Shoot(){
var temp_weapon : ClassVehicleWeapon=weapon[weapon_index];
temp_weapon.bullets--;
FireEffectTrue();
Invoke("FireEffectFalse",0.05);
AudioSource.PlayClipAtPoint(temp_weapon.sound_shoot, transform.position,0.5);
var ran_hor : float=Random.Range(-(temp_weapon._return+metkost),temp_weapon._return+metkost)*0.1;
var ran_ver : float=Random.Range(-(temp_weapon._return+metkost),temp_weapon._return+metkost)*0.1;
var temp_hit : RaycastHit;
var temp_target_pos : Vector3;
if (Physics.Raycast(temp_weapon.turret_point.position, temp_weapon.turret_point.TransformDirection(Vector3.forward),temp_hit, 5000)){temp_target_pos=temp_hit.point;}
else{temp_target_pos=temp_weapon.turret_point.TransformPoint(Vector3(0,0,500));}
var temp_bullet_angle : Quaternion=Quaternion.LookRotation(temp_target_pos-temp_weapon.shoot_point.position);
var temp_object : Transform= Instantiate (temp_weapon.bullet,temp_weapon.shoot_point.position,temp_bullet_angle);
var temp_script : sc_bullet =temp_object.GetComponent(sc_bullet);
temp_object.localEulerAngles+=Vector3(ran_hor,ran_ver,0);
//temp_script.root=transform;
temp_script.power=temp_weapon.power;
temp_script.exp_radius=temp_weapon.exp_radius;
temp_script._speed=temp_weapon.bullet_speed;
temp_script.game_sc=game_script;
if(target){temp_script.target=target;}
GetComponent.<Rigidbody>().AddForceAtPosition(temp_weapon.turret_point.TransformDirection(Vector3.back)*temp_weapon.force*25,temp_weapon.turret_point.position);
//temp_object.rigidbody.velocity=temp_object.TransformDirection(Vector3 (0,0,300));

}//Shoot


function OtherWeapon(){

var temp_weapon : ClassVehicleWeapon=weapon[weapon_index];
var temp_spt_pos : Vector3=temp_weapon.other_weapon.centr_point.localPosition;
temp_weapon.other_weapon.point_pos.x+=1;
temp_weapon.shoot_point.localPosition.x=temp_spt_pos.x+temp_weapon.other_weapon.bullet_dis*temp_weapon.other_weapon.point_pos.x;
if(temp_weapon.other_weapon.point_pos.x>=temp_weapon.other_weapon.bullet_width){
temp_weapon.other_weapon.point_pos.x=0;
temp_weapon.shoot_point.localPosition.x=temp_spt_pos.x;
temp_weapon.other_weapon.point_pos.y+=1;
temp_weapon.shoot_point.localPosition.y=temp_spt_pos.y-temp_weapon.other_weapon.bullet_dis*temp_weapon.other_weapon.point_pos.y;
if(temp_weapon.other_weapon.point_pos.y>=temp_weapon.other_weapon.bullet_height){
temp_weapon.other_weapon.point_pos.y=0;
temp_weapon.other_weapon.point_pos.x=0;
temp_weapon.shoot_point.localPosition=temp_spt_pos;
}}
}//OtherWeapon

function FireEffectFalse(){
var temp_weapon : ClassVehicleWeapon=weapon[weapon_index];
temp_weapon.muzzle_flash.gameObject.SetActive(false);}

function FireEffectTrue(){
var temp_weapon : ClassVehicleWeapon=weapon[weapon_index];
temp_weapon.muzzle_flash.gameObject.SetActive(true);}

function AllFireEffectFalse(){
for (var i=0;i<weapon.Length;i++)	{
var temp_weapon : ClassVehicleWeapon=weapon[i];
temp_weapon.muzzle_flash.gameObject.SetActive(false);
}//for
}//AllFireEffectFalse
