#pragma strict
private var game_ob : Transform;
private var game_sc : sc_game;
private var player_sc : sc_player;
public var player : Transform;
public var _camera : Transform;
public var sound_mc : AudioClip;
public var sound_mf : AudioClip;
public var sound_timer : AudioClip;

public var button_skip : Button;
public var button_restart : Button;


public var objects : List.<Transform> = new List.<Transform> ();

var mission_num : int;
var test : boolean;

public var label_timer : gui_label;
var label_0 : gui_label;
var label_1 : gui_label;

var text_mc : ClassLanguage[];
public var drugs : sc_object_death[];
public var drug_points : Transform[];


private var mission_script : sc_mission;
private var mission_transform : Transform;
private var mission_collider : Transform;
private var mission_points : Transform;

private var point : Transform;

private var condition_0 : int;
private var help_timer : float;
private var misend_timer : float;
private var timer : float;

private var activate : boolean;
private var help : boolean;
private var mission_end : boolean;
private var complete : boolean;
private var text : String[];
@HideInInspector
public var weapon_type : int[];

class ClassMission {
var draw : boolean;
var draw_create : boolean;
var draw_edit : boolean;
var draw_end_event : boolean;
var draw_text : boolean;
var text : String[]=new String[2];
var create : ClassCreate;
var edit : ClassEdit;
var man : List.<ClassManEdit> = new List.<ClassManEdit> ();

var next_event : ClassNextEvent;
var mission_complete : ClassNextEvent;
var mission_failed : ClassNextEvent;
@HideInInspector
var objects : ClassMissionObject;
}//ClassWheel

class ClassCreate {
var draw : boolean;
var car_draw : boolean;
var man_draw : boolean;
var object_draw : boolean;
var create_car : List.<ClassCarCreate> = new List.<ClassCarCreate> ();
var create_man : List.<ClassManCreate> = new List.<ClassManCreate> ();
var create_object : List.<ClassObjectCreate> = new List.<ClassObjectCreate> ();
}//ClassCreate

class ClassEdit {
var draw : boolean;
var car_draw : boolean;
var man_draw : boolean;
var object_draw : boolean;
var player_draw : boolean;
var point_draw : boolean;
var car : List.<ClassCarEdit> = new List.<ClassCarEdit> ();
var man : List.<ClassManEdit> = new List.<ClassManEdit> ();
var object : List.<ClassObjectEdit> = new List.<ClassObjectEdit> ();
var player : ClassPlayerEdit;
var point : ClassPointEdit;
}//ClassEdit

class ClassMissionObject {
var car : List.<Transform> = new List.<Transform> ();
var man : List.<Transform> = new List.<Transform> ();
var object : List.<Transform> = new List.<Transform> ();
}//ClassWheel

class ClassCarCreate {
var draw : boolean;
var health_bar : boolean;
var racer : boolean;
var car : Transform;
var point : Transform;
//var delete : boolean;
var health : int;
var minimap_icon : MisMiniMapIcon;
}//ClassCarCreate

class ClassManCreate {
var draw : boolean;
var man : Transform;
var point : Transform;
//var delete : boolean;
var player_boss : boolean;
var AI : boolean;
var sit_car : ClassManSitCar;
var go_to_car : ClassManSitCar;
var health : int;
var minimap_icon : MisMiniMapIcon;
var weapon : MisWeapon;
}//ClassCarCreate

class ClassObjectCreate {
var draw : boolean;
var object : Transform;
var point : Transform;
var minimap_icon : MisMiniMapIcon;
}//ClassCarCreate

class ClassCarEdit {
var draw : boolean;
var other_event : boolean;
var event : int;
var car : int;
var set_position : Transform;
var target_point : Transform;
var damage : int;
var health : int;
var delete_minimap_icon : boolean;
var minimap_icon : MisMiniMapIcon;
var engine_start : boolean;
var health_bar : boolean;
var go_to_target : boolean;
var stop_on_target : boolean=true;
}//ClassCarCreate

class ClassManEdit {
var draw : boolean;
var other_event : boolean;
var event : int;
var man : int;
var team : int=-1;
var damage : int;
var health : int;
var set_position : Transform;
var target_point : Transform;
var player_boss : boolean;
var player_is_enemy : boolean;
var AI : boolean=true;
var get_out_car : boolean;
var sit_car : ClassManSitCar;
var go_to_car : ClassManSitCar;
var go_to_target : boolean;
var run : boolean;
var delete_minimap_icon : boolean;
var minimap_icon : MisMiniMapIcon;
var weapon : MisWeapon;
}//ClassCarCreate

class ClassObjectEdit {
var draw : boolean;
var other_event : boolean;
var event : int;
var object : int;
var set_position : Transform;
var delete_minimap_icon : boolean;
var minimap_icon : MisMiniMapIcon;
var destroy : boolean;
}//ClassCarCreate

class ClassPlayerEdit {
var draw : boolean;
var team : int=-1;
var set_position : Transform;
var police : boolean;
var add_star : int;
var damage : int;
}//ClassCarCreate



class ClassPointEdit {
var point : Transform;
var set_position : Transform;
var delete_minimap_icon : boolean;
var minimap_icon : MisMiniMapIcon;
}//ClassCarCreate

class ClassManSitCar {
var draw : boolean;
var other_event : boolean;
var event : int;
var sit_car : boolean;
var car : int;
var set_place : boolean;
var place : int;
var engine_start : boolean;
var racer : boolean;
//var other_event : ClassOtherEvent;
}//ClassCarCreate

class ClassMisDistance {
var draw : boolean;
var greater : boolean;
var type : MisDistance;
var collect : boolean;
var step_icon : boolean;
var player_not_car : boolean;
var other_event_from : boolean;
var event_from  : int;
var other_event_to : boolean;
var event_to  : int;
var distance : float;
var from : MisDistance;
var from_index : int;
var to : MisDistance;
var to_index : int;
var point_from : Transform;
var point_to : Transform;
}//ClassCarCreate

class ClassNextEvent {
var draw : boolean;
var draw_car_death : boolean;
var draw_man_death : boolean;
var draw_distance : boolean;
var draw_other_condition : boolean;
var drugs : boolean;
var activate : boolean;
var next_event : boolean;
var only_one_car_condition : boolean;
var only_one_man_condition : boolean;

var type_distance : MisDistanceType;
//normal
var only_one_condition_distance : boolean;
//collect
var collect_destroy_object : boolean;
var collect_delete_minimap : boolean;
//by_step
var step : int;
var step_minimap_icon : MisMiniMapIcon;
var add_to_cars : boolean;
var cars_event : int;


var draw_timer : boolean;
var collect_audio : AudioClip;
var timer : float;
var car_death : List.<ClassEventDeath> = new List.<ClassEventDeath> ();
var man_death : List.<ClassEventDeath> = new List.<ClassEventDeath> ();
var distance : List.<ClassMisDistance> = new List.<ClassMisDistance> ();
var sit_car : ClassSitCar;
var other_event : ClassOtherEvent;
@HideInInspector
var temp_timer : float;
}//ClassCarCreate

class ClassEventDeath {
var draw : boolean;
var activate : boolean;
var other_event : boolean;
var event : int;
var object : int;
}//ClassCarCreate

class ClassSitCar {
var draw : boolean;
var only_one_condition : boolean;
var draw_player : boolean;
var draw_man : boolean;
var player_activate : boolean;
var player_sit_car : boolean=true;
var player_out_car : boolean;
var car : int;
var other_event : boolean;
var event : int;
var man_sit_car : List.<ClassMSC> = new List.<ClassMSC> ();
}//ClassCarCreate

class ClassMSC {
var draw : boolean;
var activate : boolean;
var man : int;
var other_event : boolean;
var event : int;

var car : int;
var car_other_event : boolean;
var car_event : int;
}//ClassManSitCar

class ClassOtherEvent {
var activate : boolean;
var event : int;
}//ClassManSitCar

enum MisDistance {
player = 0,
point = 1,
man = 2,
car = 3,
object = 4,
}//_Time

enum MisMiniMapIcon {
none = 0,
yellow_small = 1,
yellow_big = 2,
red_small = 3,
red_big = 4,
green_small = 5,
green_big = 6,
yellow_man = 7,
red_man = 8,
green_man = 9,
green_arrow = 10,
}//MisMiniMapIcon

enum MisWeapon {
none = 0,
pm = 1,
deagle = 2,
mac10 = 3,
aksu = 4,
p90 = 5,
ak74 = 6,
m16 = 7,
m4 = 8,
lr300 = 9,
fntps = 10,
m60 = 11,
awp = 12,
minigun = 13,
flame = 14,
rpg7 = 15,
}//MisWeapon

enum MisDistanceType {
normal = 0,
collect = 1,
byStep = 2,
}//MisWeapon

function Start () {
//PlayerPrefs.SetInt("mission",0);
if(!test)mission_num=PlayerPrefs.GetInt("mission");
game_ob=GameObject.Find("Game").transform;
game_sc=game_ob.GetComponent(sc_game);
player_sc=game_ob.GetComponent(sc_player);
weapon_type=new int[16];
weapon_type[0]=40;
weapon_type[1]=40;
weapon_type[2]=41;
weapon_type[3]=11;
weapon_type[4]=6;
weapon_type[5]=12;
weapon_type[6]=7;
weapon_type[7]=15;
weapon_type[8]=14;
weapon_type[9]=13;
weapon_type[10]=10;
weapon_type[11]=16;
weapon_type[12]=30;
weapon_type[13]=17;
weapon_type[14]=18;
weapon_type[15]=19;

Invoke("AfterStart",1);
}//Start

function AfterStart () {
//AddText();
ActivateMissions();
}//AfterStart

function Update () {
if(mission_collider&&!activate){
if(mission_collider.GetComponent(sc_trigger).collision){
var temp_collision : Transform=mission_collider.GetComponent(sc_trigger).collision;
if(temp_collision.root.GetComponent(sc_vehicle)&&temp_collision.root.GetComponent(sc_vehicle).driver&&
temp_collision.root.GetComponent(sc_vehicle).driver.GetComponent(sc_man).player){temp_collision=temp_collision.root.GetComponent(sc_vehicle).driver;}
else if(temp_collision.root.GetComponent(sc_man)){temp_collision=temp_collision.root;}
if(temp_collision.GetComponent(sc_man)&&temp_collision.GetComponent(sc_man).player){
ActivateMission();
}//player
}//collision
}//mission_collider

if(activate){
if(!button_skip.enabled)button_skip.enabled=true;
if(!button_restart.enabled)button_restart.enabled=true;

if(button_skip.IsDownPressed())MissionComplate(false,0,true,false);
if(button_restart.IsDownPressed())MissionComplate(false,0,false,true);
}//activate
else {
if(button_restart.enabled)button_restart.enabled=false;
if(button_skip.enabled)button_skip.enabled=false;}


if(help){
label_0.text=text[game_sc.language];

help_timer+=Time.deltaTime;
if(help_timer>5){
label_0.gameObject.SetActive(false);
help_timer=0;
help=false;
}//help_timer
}//help


if(mission_end){
if(complete){
label_1.text=text_mc[game_sc.language].language[0];
label_1.gui_style.normal.textColor=Color.green;}
else {
label_1.text=text_mc[game_sc.language].language[1];
label_1.gui_style.normal.textColor=Color.red;}


misend_timer+=Time.deltaTime;
if(misend_timer>5){
label_1.gameObject.SetActive(false);
misend_timer=0;
mission_end=false;
}//help_timer
}//mission_end


if(Input.GetKeyUp(KeyCode.M))MissionComplate(false,0,false,false);
if(Input.GetKeyUp(KeyCode.N))MissionComplate(true,5000,false,false);
}//Update

function ActivateMission(){
objects.Clear();
game_sc.DeleteMinimapObject(mission_collider,null);

mission_script.SetEvent(0);
activate=true;
}//ActivateMission

function ActivateMissions(){
for (var i=0;i<transform.childCount;i++)	{
if(i==mission_num){
mission_transform=transform.FindChild("Mission_"+i).transform;
mission_script=mission_transform.GetComponent(sc_mission);
mission_collider=mission_transform.FindChild("collider");
mission_points=mission_transform.FindChild("points");
if(mission_script.event.Count>0){
game_sc.CreateMinimapObject(0,mission_collider,mission_collider.position);
transform.GetChild(i).gameObject.SetActive(true);}
}//mission_num
else{
transform.GetChild(i).gameObject.SetActive(false);
}//else
}//for
}//ActivateMissions


function CreateObject(_object : Transform,_pos : Vector3,_rot : Vector3,_minimap : int){
var temp_object : Transform=Instantiate(_object,_pos,Quaternion.Euler(_rot));
if(_minimap>0)game_sc.CreateMinimapObject(_minimap,temp_object,temp_object.position);
objects.Add(temp_object);
return temp_object;
}//CreateObject


function MissionComplate(_index : boolean,_money : int,_skip : boolean,_restart : boolean){
if(_skip){
mission_num++;
PlayerPrefs.SetInt("mission",mission_num);
}//skip
else if(_index){
mission_num++;
if(_money>0){player_sc.MoneyAdd(_money);}
PlayerPrefs.SetInt("mission",mission_num);
if(sound_mc)AudioSource.PlayClipAtPoint(sound_mc, transform.position,1);
}//_index
else if(!_restart&&!_index&&sound_mf)AudioSource.PlayClipAtPoint(sound_mf, transform.position,1);

game_sc.DeleteAllMinimapObject();
ActivateMissions();
if(!_skip&&!_restart)MissionEnd(_index);

timer=0;
condition_0=0;
point=null;
activate=false;

for (var i=0;i<objects.Count;i++)	{
if(objects[i]){
if(objects[i].GetComponent(sc_man)){
if(!objects[i].GetComponent(sc_man).death&&objects[i].GetComponent(sc_man).doing=="sit_vehicle")objects[i].GetComponent(sc_man).GoOutVehicle();
if(objects[i].GetComponent(sc_band))objects[i].GetComponent(sc_band).boss=null;
objects[i].GetComponent(sc_man).dellete=true;}
else if(objects[i].GetComponent(sc_vehicle)){
objects[i].GetComponent(sc_vehicle).health_bar=false;
objects[i].GetComponent(sc_vehicle).dellete=true;}
else{Destroy(objects[i].gameObject);}
}//objects
}//for

mission_script.ClearEvents();
objects.Clear();
player.GetComponent(sc_man).team=0;
label_timer.enabled=false;
}//MissionComplate

function MissionEnd(_index : boolean){
label_1.gameObject.SetActive(true);
complete=_index;
misend_timer=0;
mission_end=true;
}//MissionEnd



function DrawText(_position : Vector2,_text : String,_style : GUIStyle){

GUI.color=Color.black;
GUI.Label(new Rect(_position.x,_position.y, 100, 100),_text,_style);
GUI.color=Color.white;
GUI.Label(new Rect(_position.x+4,_position.y+4, 100, 100),_text,_style);
}//DrawText

function DrawHelp(_text : String[]){
text=_text;
label_0.gameObject.SetActive(true);
help_timer=0;
help=true;
}//DrawHelp





