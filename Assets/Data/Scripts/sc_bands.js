#pragma strict
var index : int;
var price : int=10000;
var player_sc : sc_player;
var script_game : sc_game;
var gui : Transform;
var rotate_object : Transform;
var spawn_point : Transform;
var lab_info : gui_label;
var lab_price : gui_label;
var lab_help : gui_label;
var button : Button;
var mans : Transform[];
var text : ClassLanguage[];
var script_input : InputManager;
private var help : boolean;
private var help_timer : float;
function Start () {
}//Start

function Update(){

if(rotate_object){
rotate_object.eulerAngles.y+=50*Time.deltaTime;
}//rotate_object
if(help){
lab_help.text=text[script_input.language_num].language[1];
help_timer+=Time.deltaTime;
if(help_timer>1){
lab_help.enabled=false;
help=false;
help_timer=0;
}//help_timer
}//help
}//Update

function OnTriggerStay (_collision : Collider) {
if(_collision&&_collision.GetComponent(sc_man)&&_collision.GetComponent(sc_man).player&&
_collision.GetComponent(sc_man).doing!="sit_vehicle"){
if(!gui.gameObject.active)gui.gameObject.SetActive(true);
lab_info.text=text[script_input.language_num].language[0];
lab_price.text=price+ " $";

if(button.IsDownPressed ()&&player_sc.money>=price&&player_sc.band.Count<5){
lab_help.enabled=true;
lab_help.text=text[script_input.language_num].language[1];
player_sc.MoneyAdd(-price);
help=true;

var temp_object : Transform=Instantiate(mans[Random.Range(0,mans.Length)],spawn_point.position,spawn_point.rotation);
script_game.CreateMinimapObject(9,temp_object,temp_object.position);
temp_object.GetComponent(sc_band).boss=player_sc.player;
temp_object.GetComponent(sc_man).dellete=false;
temp_object.GetComponent(sc_weapon).Invoke("WeaponSelectInvoke",0.5f);
player_sc.AddBand(temp_object,true);
}//IsDownPressed
}//_collision
}//OnTriggerEnter

function OnTriggerExit (_collision : Collider) {
if(_collision&&_collision.GetComponent(sc_man)&&_collision.GetComponent(sc_man).player&&
_collision.GetComponent(sc_man).doing!="sit_vehicle"){
if(gui.gameObject.active)gui.gameObject.SetActive(false);
}//_collision
}//OnTriggerExit


