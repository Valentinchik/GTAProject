#pragma strict
var objects : Transform[];
function Start () {

}

function Update () {

}

function OnTriggerStay (_collision : Collider) {
if(_collision&&_collision.GetComponent(sc_man)&&_collision.GetComponent(sc_man).player&&
_collision.GetComponent(sc_man).doing!="sit_vehicle"){
for(var _object in objects){
if(!_object.gameObject.active)_object.gameObject.SetActive(true);
}//for
}//_collision
}//OnTriggerEnter

function OnTriggerExit (_collision : Collider) {
if(_collision&&_collision.GetComponent(sc_man)&&_collision.GetComponent(sc_man).player&&
_collision.GetComponent(sc_man).doing!="sit_vehicle"){
for(var _object in objects){
if(_object.gameObject.active)_object.gameObject.SetActive(false);
}//for
}//_collision
}//OnTriggerExit