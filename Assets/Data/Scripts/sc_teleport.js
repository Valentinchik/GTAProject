#pragma strict
var point : Transform;
var object_activate : Transform;
var object_deactivate : Transform;
function OnTriggerEnter (_collision : Collider) {
if(_collision&&_collision.GetComponent(sc_man)&&_collision.GetComponent(sc_man).player&&
_collision.GetComponent(sc_man).doing!="sit_vehicle"){
if(point){
_collision.transform.position=point.position;
_collision.transform.eulerAngles=point.eulerAngles;
}//point

if(object_activate)object_activate.gameObject.SetActive(true);
if(object_deactivate)object_deactivate.gameObject.SetActive(false);
}//_collision
}//OnTriggerEnter