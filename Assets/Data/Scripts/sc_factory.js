#pragma strict
var index : int;
var price : int=10000;
var money_add : int=500;
var money : int=1000;
var player_sc : sc_player;
var input_factory : Transform;
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
//PlayerPrefs.SetInt("factory"+index,0);
if(PlayerPrefs.GetInt("factory"+index)==1){
object_0.gameObject.SetActive(false);
icon_0.gameObject.SetActive(false);
gameObject.SetActive(false);
Activate();}
else {
object_1.gameObject.SetActive(false);
icon_1.gameObject.SetActive(false);
}//else
//gameObject.SetActive(false);
}//Start

function Update(){
if(rotate_object){
rotate_object.eulerAngles.y+=50*Time.deltaTime;
}//rotate_object
if(help){
script_input.label_4.text=text[script_input.language_num].language[1];
help_timer+=Time.deltaTime;
if(help_timer>1){
script_input.label_4.gameObject.SetActive(false);
help=false;
help_timer=0;
}//help_timer
}//help
}//Update

function OnTriggerStay (_collision : Collider) {
if(_collision&&_collision.GetComponent(sc_man)&&_collision.GetComponent(sc_man).player&&
_collision.GetComponent(sc_man).doing!="sit_vehicle"){
if(!activate){
if(!input_factory.gameObject.active)input_factory.gameObject.SetActive(true);
script_input.label_0.text=text[script_input.language_num].language[0];
script_input.label_1.text=price+ " $";

if(script_input.factoryBuyButton.IsDownPressed ()&&player_sc.money>=price){
PlayerPrefs.SetInt("factory"+index,1);
input_factory.gameObject.SetActive(false);
gameObject.SetActive(false);
object_0.gameObject.SetActive(false);
icon_0.gameObject.SetActive(false);
object_1.gameObject.SetActive(true);
icon_1.gameObject.SetActive(true);
script_input.label_4.gameObject.SetActive(true);
script_input.label_4.text=text[script_input.language_num].language[1];
player_sc.MoneyAdd(-price);
help=true;
Activate();
}//IsDownPressed
}//active
else {
player_sc.MoneyAdd(money);
gameObject.SetActive(false);
money=0;
}//else


}//_collision
}//OnTriggerEnter

function OnTriggerExit (_collision : Collider) {
if(_collision&&_collision.GetComponent(sc_man)&&_collision.GetComponent(sc_man).player&&
_collision.GetComponent(sc_man).doing!="sit_vehicle"){
if(!activate){
if(input_factory.gameObject.active)input_factory.gameObject.SetActive(false);

}//activate
}//_collision
}//OnTriggerExit

function AddMoney(){
money+=money_add+Random.Range(-money_add/5,money_add/5);
PlayerPrefs.SetInt("factory_money"+index,money);
gameObject.SetActive(true);
Invoke("AddMoney",120);
}//AddMoney

function Activate(){
activate=true;
money=PlayerPrefs.GetInt("factory_money"+index);
Invoke("AddMoney",3);

}//Activate
