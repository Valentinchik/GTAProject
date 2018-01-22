import System.Collections.Generic;
import System.Collections.Generic;

#pragma strict
var weapon_ob : Transform;
var muzzle_flash : Transform;
var particle : Transform;
var sound_wg : AudioClip;
var sound_wo : AudioClip;
var sound_reload : AudioClip;

public var game_ob : Transform;
private var shoot_point : Transform;
private var game_script : sc_game;
private var weapon_info_script : sc_weapon_info;
private var man_script : sc_man;
public var weapon : List.<ClassWeapon> = new List.<ClassWeapon> ();

private var fire_timer : float;
private var wait_timer : float;
private var fire_rate : float=0.1;
private var animator : Animator;
private var anim_state : AnimatorStateInfo;
private var _return : float;
public var max_return : float;
public var min_return : float;
private var recovery_return : float;
private var grenade : boolean;
private var grenade_num : int;
private var grenade_create : boolean;
public var reload : boolean;

public var weapon_index : int;
public var weapon_current : int;
public var metkost : float=1;
public var fire : boolean;
public var shoot : boolean;
public var target_pos : Vector3;
public var now_return : float;
public var target : Transform;
function Start () {
if(!game_ob)game_ob=GameObject.Find("Game").transform;
game_script=game_ob.GetComponent(sc_game);
weapon_info_script=game_ob.GetComponent(sc_weapon_info);
man_script=GetComponent(sc_man);
animator=GetComponent(Animator);
if(!weapon_ob){
weapon_ob= Instantiate(game_script.weapon_ob);
weapon_ob.parent=man_script.hand_r;
weapon_ob.localPosition=Vector3.zero;
weapon_ob.localEulerAngles=Vector3.zero;}//weapon_ob



}//Start

function Update () {



if(weapon.Count>0&&man_script.can_doing<2){
if(fire){
if(!shoot&&weapon[weapon_index].bullets>0){

if(particle&&!particle.GetComponent.<ParticleEmitter>().emit){
particle.GetComponent(AudioSource).Play();
particle.GetComponent.<ParticleEmitter>().emit=true;}
shoot=true;
Shoot();
}//shoot

if(shoot){
fire_timer+=Time.deltaTime;
if(fire_timer>=weapon[weapon_index].fire_rate){
fire_timer=0;
shoot=false;
fire=false;
if(particle&&particle.GetComponent.<ParticleEmitter>().emit){
//particle.GetComponent(AudioSource).Stop();
particle.GetComponent.<ParticleEmitter>().emit=false;}
if(GetComponent(sc_bot)&&weapon_index!=1&&weapon[weapon_index].clips<=0&&weapon[weapon_index].bullets<=0){WeaponSelect(1);}
}//fire_timer

}//shoot
}//fire
if(weapon[weapon_index].clips>0&&!reload&&weapon[weapon_index].bullets<=0){Reload();}
}//Count

if(now_return>min_return){now_return-=recovery_return;}
if(now_return<min_return){now_return=min_return;}

if(grenade){
var anim_state : AnimatorStateInfo=animator.GetCurrentAnimatorStateInfo(4);
if(anim_state.normalizedTime>0.4&&anim_state.IsName("Grenade")&&!grenade_create){grenade_create=true;
var temp_object : Transform= Instantiate (game_script.grenade[grenade_num],transform.TransformPoint(Vector3(-0.5,1.8,1)),transform.rotation);
temp_object.GetComponent.<Rigidbody>().AddForce(transform.TransformDirection(Vector3(0,1,2))*500);
}//normalizedTime
if(anim_state.normalizedTime>0.8&&anim_state.IsName("Grenade")){
animator.SetBool("grenade",false);
grenade=false;}
}//grenade

//if(weapon_index!=0){man_script.danger_timer=0;}
}//Update


function RotateTo(_angle_y : float,_angle_x : float){
man_script.fire=true;
man_script.RotateTo(_angle_x);
animator.SetFloat("aim_ver",_angle_y);
animator.SetBool("fire",true);
}//RotateTo


function EndFire(){
if(man_script)man_script.fire=false;
if(animator)animator.SetBool("fire",false);
}//EndFire

function FireEffectFalse(){
animator.SetBool("shot",false);
if(muzzle_flash)muzzle_flash.gameObject.SetActive(false);}

function FireEffectTrue(){
animator.SetBool("shot",true);
if(muzzle_flash)muzzle_flash.gameObject.SetActive(true);}


function WeaponGive (index : int,_find_weapon : boolean,_bullets : int,_clips : int) {
if(!weapon_info_script)weapon_info_script=GameObject.Find("Game").GetComponent(sc_weapon_info);
for (var i=0;i<weapon.Count;i++)	{
if(weapon[i].index==index){
weapon[i].clips+=weapon[i].max_clips;
return false;
}//index
}//for


AudioSource.PlayClipAtPoint(sound_wg, transform.position,0.2);

var new_weapon : ClassWeapon=new ClassWeapon();
if(index!=0){
var temp_object : Transform= Instantiate (weapon_info_script.weapon[index].prefab, weapon_ob.FindChild("create_point").position, weapon_ob.FindChild("create_point").rotation);
temp_object.parent=weapon_ob;
new_weapon._transform=temp_object;
}//index

new_weapon.index=index;
new_weapon.sound_shoot=weapon_info_script.weapon[index].sound_shoot;
new_weapon.type=weapon_info_script.weapon[index].type;
new_weapon.power=weapon_info_script.weapon[index].power;
new_weapon.force=weapon_info_script.weapon[index].force;
new_weapon.fire_rate=weapon_info_script.weapon[index].fire_rate;
new_weapon.fire_wait=weapon_info_script.weapon[index].fire_wait;
new_weapon.bot_rate=weapon_info_script.weapon[index].bot_rate;
new_weapon._return=weapon_info_script.weapon[index]._return;
new_weapon.max_return=weapon_info_script.weapon[index].max_return;
new_weapon.min_return=weapon_info_script.weapon[index].min_return;
new_weapon.recovery_return=weapon_info_script.weapon[index].recovery_return;
new_weapon.bullet=weapon_info_script.weapon[index].bullet;
new_weapon.cross=weapon_info_script.weapon[index].cross;
new_weapon._camera=weapon_info_script.weapon[index]._camera;
new_weapon.bullet_speed=weapon_info_script.weapon[index].bullet_speed;
new_weapon.auto_target=weapon_info_script.weapon[index].auto_target;
new_weapon.range=weapon_info_script.weapon[index].range;
new_weapon.bullets=weapon_info_script.weapon[index].bullets;
new_weapon.clips=weapon_info_script.weapon[index].clips;
new_weapon.max_bullets=weapon_info_script.weapon[index].max_bullets;
new_weapon.max_clips=weapon_info_script.weapon[index].max_clips;
new_weapon.image=weapon_info_script.weapon[index].image;
new_weapon._name=weapon_info_script.weapon[index]._name;
new_weapon.target_type=weapon_info_script.weapon[index].target_type;
new_weapon.bullet_count=weapon_info_script.weapon[index].bullet_count;
weapon.Add(new_weapon);

}//weapon_give

function WeaponSelect (index : int) {
if(reload)return false;
if(!this.enabled)this.enabled=true;
if(!animator)animator=GetComponent(Animator);
AudioSource.PlayClipAtPoint(sound_wo, transform.position,0.2);
animator.SetInteger("weapon",weapon[index].type);
//EndFire();
for (var i=0;i<weapon.Count;i++)	{
if (i == index){
weapon_index=i;
_return=weapon[i]._return;
max_return=weapon[i].max_return;
min_return=weapon[i].min_return;
now_return=weapon[i].min_return;
recovery_return=weapon[i].recovery_return;
if(index!=0){
shoot_point=weapon[weapon_index]._transform.FindChild("shoot_point");
weapon[i]._transform.gameObject.SetActive(true);
muzzle_flash=weapon[i]._transform.FindChild("muzzle_flash");
particle=weapon[i]._transform.FindChild("particle");
if(muzzle_flash){muzzle_flash.gameObject.SetActive(false);}

}//index

}//index
else {if(i!=0){weapon[i]._transform.gameObject.SetActive(false);}}
if(i==0){animator.SetFloat("aim_ver",0);}

}//for
//if(weapon_index!=0){man_script.Danger();}


}//WeaponSelect

function WeaponSelectType (_num : int) {
for(var i = 0; i < weapon.Count; i++){
if(weapon[i].index==_num){WeaponSelect(i);}
}//for
}//WeaponSelectType


function WeaponSelectInvoke(){
WeaponSelect(1);
}//WeaponSelectInvoke

function Shoot(){
var temp_weapon : ClassWeapon=weapon[weapon_index];

FireEffectTrue();
Invoke("FireEffectFalse",0.05);

if(temp_weapon.sound_shoot)AudioSource.PlayClipAtPoint(temp_weapon.sound_shoot, transform.position,0.5);
var temp_return : float=now_return*metkost;
for (var i=0;i<temp_weapon.bullet_count;i++)	{
var ran_hor : float=Random.Range(-temp_return,temp_return)*0.1;
var ran_ver : float=Random.Range(-temp_return,temp_return)*0.1;

var temp_bullet_angle : Quaternion=Quaternion.LookRotation(target_pos-shoot_point.position);
var temp_object : Transform= Instantiate (temp_weapon.bullet,shoot_point.position,temp_bullet_angle);
var temp_script : sc_bullet =temp_object.GetComponent(sc_bullet);
temp_object.localEulerAngles+=Vector3(ran_hor,ran_ver,0);
temp_script.root=transform;
temp_script.power=temp_weapon.power;
temp_script._speed=temp_weapon.bullet_speed;
temp_script.force=temp_weapon.force;
temp_script.game_sc=game_script;
if(target){temp_script.target=target;}
}//for
if(now_return<max_return){now_return+=_return;}
temp_weapon.bullets--;
}//Shoot

function Grenade(_num : int){
if(man_script.can_doing<2&&!grenade){
if(man_script.doing=="fight"){man_script.FightFalse();}
animator.SetBool("grenade",true);
grenade_create=false;
grenade=true;
grenade_num=_num;
}//can_doing
}//Grenade

function Reload(){
reload=true;
AudioSource.PlayClipAtPoint(sound_reload, transform.position,0.5);
animator.SetBool("reload",true);
Invoke("ReloadAfter",3.5);
}//Reload

function ReloadAfter(){
if(!reload)return false;
weapon[weapon_index].bullets=weapon[weapon_index].max_bullets;
weapon[weapon_index].clips--;
if(man_script.player)PlayerPrefs.SetInt("weapon_"+weapon[weapon_index].index,weapon[weapon_index].clips);
reload=false;
fire_timer=0;
shoot=false;
fire=false;
animator.SetBool("reload",false);
}//ReloadAfter