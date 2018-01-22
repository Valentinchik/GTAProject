#pragma strict
import System.Collections.Generic;
private var minimap_sc : sc_minimap;

public var sound_step_default : AudioClip[];
public var sound_step_metal : AudioClip[];
public var sound_step_wood : AudioClip[];
public var sound_step_water : AudioClip[];
public var sound_jump : AudioClip[];
public var sound_death_woman : AudioClip[];
public var sound_car_crush : AudioClip[];
public var man_hit_car : AudioClip[];
public var sound_kick : AudioClip[];
public var sound_effect : AudioClip[];
public var sound_skid : AudioClip;
public var sound_parachute : AudioClip;
public var tex_healthbar1 : Texture2D;
public var tex_healthbar2 : Texture2D;
public var sound_death : ClassSound[];
public var sound_hit_bullet : ClassSound[];
public var sound_voice : ClassVoice[];
public var particle_hit_bullet : Transform[];
public var grenade : Transform[];
public var glass : ClassGlass[];
public var decal : ClassDecal[];
public var destroy_wheel : Transform[];
public var object : Transform[];
public var helecopter : Transform[];
public var helecopter_ob : Transform[];
public var helecopter_point : Transform[];
public var helecopter_active : boolean[];
public var car_color : Color[];
public var light_object : List.<ClassLightObject> = new List.<ClassLightObject> ();
public var language : int;
public var car_damage : int;
public var car_colorran : int;
public var car_count : int;

var spawn_car_point : Transform[];
var spawn_player_point : Transform[];
var place_death_ob : Transform;
var particle_swim : Transform;
var weapon_ob : Transform;
var money_ob : Transform;
var explosion_0 : Transform;
var factory : Transform;
var _camera : Transform;
var parachute : Transform;

var death_car_mat : Material;
var script_path : Patches;

public var man : List.<Transform> = new List.<Transform> ();
public var vehicle : List.<Transform> = new List.<Transform> ();
public var place_death : List.<Transform> = new List.<Transform> ();

public var player : Transform;

private var hele_timer : float;

function Start () {
Application.targetFrameRate = 60;
language=PlayerPrefs.GetInt("language");
car_damage=PlayerPrefs.GetInt("car_damage");
//car_colorran=PlayerPrefs.GetInt("car_color");
car_count=PlayerPrefs.GetInt("car_count");
//minimap_sc=GameObject.Find("MiniMap").GetComponent(sc_minimap);//temp commit
//EnabledFactory();
PlayerPrefs.SetInt("house0",1);
if(!PlayerPrefs.HasKey("start_house"))PlayerPrefs.SetInt("start_house",0);
CreateCar();
GetComponent(sc_player).player.position=spawn_player_point[PlayerPrefs.GetInt("start_house")].position;
GetComponent(sc_player).player.eulerAngles=spawn_player_point[PlayerPrefs.GetInt("start_house")].eulerAngles;
_camera.eulerAngles=spawn_player_point[PlayerPrefs.GetInt("start_house")].eulerAngles;

player=GetComponent(sc_player).player;
}//Start

function Update () {
if(helecopter_active[0]&&!helecopter[0]){
hele_timer+=Time.deltaTime;
if(hele_timer>30){
hele_timer=0;
CreateHelecopter(0);}}
}//Update



function CreatePD(_transform : Transform,_killer : Transform){
if(place_death.Count>0){
var temp_pd : Transform;
var temp_distance : float;
var temp_return : boolean;
for (var i=0;i<place_death.Count;i++)	{
temp_pd=place_death[i];
if(temp_pd){
temp_distance=Vector3.Distance(_transform.position,temp_pd.position);
if(temp_distance<100&&_killer==temp_pd.GetComponent(sc_place_death).killer){
temp_pd.GetComponent(sc_place_death).car_count+=1;
temp_pd.position=FindBuildPoint(_transform.position,temp_pd);
i=1000;
temp_return=true;
}//temp_distance
}//temp_pd
}//for
}//Count

if(!temp_return){
var temp_object : Transform= Instantiate (place_death_ob);
temp_object.position=FindBuildPoint(_transform.position,temp_object);
temp_object.GetComponent(sc_place_death).man=_transform;
if(_killer){
temp_object.GetComponent(sc_place_death).killer=_killer;
_killer.GetComponent(sc_man).place_death=temp_object;
}//_killer
place_death.Add(temp_object);
}//temp_return
}//CreatePD

function FindBuildPoint(_pos : Vector3,_transform : Transform){
    var temp_patch_sc : Patches=GetComponent(Patches);
var temp_point : ClassPointMan;
var temp_near_point : ClassPointMan;
var temp_distance : float;
var temp_distance_big : float=20;
var temp_find_point : boolean;
var temp_position : Vector3=_pos;

for (var i=0;i<temp_patch_sc.point_man_build.Count;i++)	{
temp_point=temp_patch_sc.point_man_build[i];
temp_distance=Vector3.Distance(_pos,temp_point._position);
if(temp_distance<temp_distance_big){
temp_distance_big=temp_distance;
temp_near_point=temp_patch_sc.point_man_build[i];
temp_find_point=true;}
}//for
if(temp_find_point&&temp_near_point.controll_point!=0){
_transform.GetComponent(sc_place_death).have_point=true;
for (var j=0;j<temp_near_point.controll_point.Count;j++)	{
_transform.GetComponent(sc_place_death).near_point.Add(temp_patch_sc.point_man_build[temp_near_point.controll_point[j]]);
}//for
var temp_point1 : ClassPointMan=temp_patch_sc.point_man_build[temp_near_point.controll_point[Random.Range(0,temp_near_point.controll_point.Count)]];
temp_position=temp_point1._position;}
return temp_position;
}//FindBuildPoint

function GetPositionKiller(_transform : Transform){
if(_transform){
var temp_pd : Transform=_transform.GetComponent(sc_man).place_death;
if(temp_pd){
temp_pd.position=FindBuildPoint(_transform.position,temp_pd);
}//place_death
}//_transform
}//GetPosition



function CreateMinimapObject(_num : int,_object : Transform,_pos : Vector3){
minimap_sc.CreateMinimapObject(_num,_object,_pos);
}//CreateMinimapObject

function DeleteMinimapObject(_object : Transform,_minimap_object : Transform){
minimap_sc.DeleteMinimapObject(_object,_minimap_object);
}//DeleteMinimapObject

function DeleteAllMinimapObject(){
minimap_sc.DeleteAllMinimapObject();
}//DeleteAllMinimapObject


function CreateCar(){
for (var i=0;i<spawn_car_point[PlayerPrefs.GetInt("start_house")].childCount;i++)	{
var temp_num : int=PlayerPrefs.GetInt("car_"+i);
if(temp_num!=0){//PlayerPrefs.SetInt("car_"+i,0);
Instantiate (GetComponent(sc_info).car_shop[temp_num],spawn_car_point[PlayerPrefs.GetInt("start_house")].GetChild(i).position,spawn_car_point[PlayerPrefs.GetInt("start_house")].GetChild(i).rotation);
}//PlayerPrefs
}//for


}//CreateCar




function CreateHelecopter(_num : int){
helecopter[_num]= Instantiate (helecopter_ob[_num],helecopter_point[_num].position,helecopter_point[_num].rotation);
helecopter_active[_num]=true;
var temp_man : Transform=Instantiate(GetComponent(sc_info).man_ob[25]);
temp_man.position.y=-10000;
temp_man.GetComponent(sc_man).SitVehicle(helecopter[_num],helecopter[_num].GetComponent(sc_vehicle).place[0],false);
temp_man.GetComponent(sc_man).dellete=false;
temp_man.GetComponent(sc_man).game_sc=this;
temp_man.GetComponent(sc_bot).game_sc=this;
}//CreateHelecopter

function Death(_man : int,_transform : Transform){
AudioSource.PlayClipAtPoint(sound_death[_man].sound[Random.Range(0,sound_death[_man].sound.Count)], _transform.position,1);
var temp_distance : float;
var temp_script : sc_man;
for (var i=0;i<man.Count;i++)	{
temp_script=man[i].GetComponent(sc_man);
if(man[i]!=_transform&&man[i]!=player&&!temp_script.death&&temp_script.doing!="sit_vehicle"){
temp_distance=Vector3.Distance(man[i].position, _transform.position);
if(temp_distance<20){
if(man[i].GetComponent(sc_band))man[i].GetComponent(sc_man).Invoke("VoiceBandDeath",Random.Range(1.0f,5.0f));
else man[i].GetComponent(sc_man).Invoke("VoiceDeath",Random.Range(1.0f,5.0f));
}//temp_distance
}//man
}//for
}//Death
