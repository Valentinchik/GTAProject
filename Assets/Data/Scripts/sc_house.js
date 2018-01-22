#pragma strict
var index : int;
var price : int=10000;
var player_sc : sc_player;
var input_house : Transform;
var rotate_object : Transform;
var object_0 : Transform;
var object_1 : Transform;
var icon_0 : Transform;
var icon_1 : Transform;
var script_input : InputManager;
var text : ClassLanguage[];
private var activate : boolean; 
private var help : boolean;
private var help_timer : float;
function Start () {
//PlayerPrefs.SetInt("house"+index,0);
if(PlayerPrefs.GetInt("house"+index)==1){
object_0.gameObject.SetActive(false);
icon_0.gameObject.SetActive(false);
activate=true;}
else {
object_1.gameObject.SetActive(false);
icon_1.gameObject.SetActive(false);}
//gameObject.SetActive(false);
}//Start

function Update(){
if(rotate_object){
rotate_object.eulerAngles.y+=50*Time.deltaTime;
}//rotate_object

if(help){
help_timer+=Time.deltaTime;
if(help_timer>3){
script_input.label_4.gameObject.SetActive(false);
help=false;
help_timer=0;
}//help_timer
}//help
}//Update

function OnTriggerStay (_collision : Collider) {
if(_collision&&_collision.GetComponent(sc_man)&&_collision.GetComponent(sc_man).player&&
_collision.GetComponent(sc_man).doing!="sit_vehicle"){
script_input.houseSaveButton.text=text[script_input.language_num].language[3];
if(!activate){
if(!input_house.gameObject.active)input_house.gameObject.SetActive(true);
script_input.label_2.text=text[script_input.language_num].language[0];
script_input.label_3.text=price+ " $";


if(script_input.houseBuyButton.IsDownPressed ()&&player_sc.money>=price){
PlayerPrefs.SetInt("house"+index,1);
input_house.gameObject.SetActive(false);
object_0.gameObject.SetActive(false);
icon_0.gameObject.SetActive(false);
object_1.gameObject.SetActive(true);
icon_1.gameObject.SetActive(true);
script_input.label_4.gameObject.SetActive(true);
script_input.label_4.text=text[script_input.language_num].language[1];
player_sc.MoneyAdd(-price);
activate=true;
help=true;
}//IsDownPressed
}//active
else {
if(!script_input.houseSaveButton.gameObject.active)script_input.houseSaveButton.gameObject.SetActive(true);
if(script_input.houseSaveButton.down_pressed){
script_input.label_4.gameObject.SetActive(true);
script_input.label_4.text=text[script_input.language_num].language[2];
help=true;
PlayerPrefs.SetInt("start_house",index);}
}//else


}//_collision
}//OnTriggerEnter

function OnTriggerExit (_collision : Collider) {
if(_collision&&_collision.GetComponent(sc_man)&&_collision.GetComponent(sc_man).player&&
_collision.GetComponent(sc_man).doing!="sit_vehicle"){
if(!activate){
if(input_house.gameObject.active)input_house.gameObject.SetActive(false);

}//activate
else{
if(script_input.houseSaveButton.gameObject.active)script_input.houseSaveButton.gameObject.SetActive(false);
}//else
}//_collision
}//OnTriggerExit



