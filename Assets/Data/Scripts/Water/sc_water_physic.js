#pragma strict
var force : float=1000;
var force_min : float=2;
var collision_transform : Transform;
var sound_hit : AudioClip;
var particle_hit : Transform[];
var timer : float;
function Start () {

}//Start

function Update () {

}//Update

function OnTriggerEnter (_collision : Collider) {
collision_transform=_collision.transform;
var _transform : Transform=_collision.transform;
if(_collision&&!_collision.isTrigger){
if(_transform.parent&&!_transform.GetComponent.<Rigidbody>()){
if(_transform.root.GetComponent.<Rigidbody>()){_transform=_transform.root.transform;}
else if(_transform.parent.GetComponent.<Rigidbody>()){_transform=_transform.parent.transform;}
}//parent

timer+=Time.deltaTime;
if(_transform.GetComponent.<Rigidbody>()&&timer>0.01&&_transform.GetComponent.<Rigidbody>().velocity.magnitude>5){timer=0;
var temp_particle : int=0;
var temp_volume : float=0.2;
if(_transform.GetComponent.<Rigidbody>().mass>500){temp_particle=2;temp_volume=2;}
else if(_transform.GetComponent.<Rigidbody>().mass>50){temp_particle=1;temp_volume=1;}
AudioSource.PlayClipAtPoint(sound_hit,_transform.position,temp_volume);
//var temp_object : Transform= Instantiate (particle_hit[temp_particle]);
//temp_object.position=_transform.position;
//temp_object.position.y=transform.position.y+0.1;

}//rigidbody
}//_collision
}//OnTriggerEnter

function OnTriggerStay (_collision : Collider) {
collision_transform=_collision.transform;
var _transform : Transform=_collision.transform;
if(_collision&&!_collision.isTrigger){
if(_transform.parent&&!_transform.GetComponent.<Rigidbody>()){
if(_transform.root.GetComponent.<Rigidbody>()){_transform=_transform.root.transform;}
else if(_transform.parent.GetComponent.<Rigidbody>()){_transform=_transform.parent.transform;}
}//parent


if(_transform.GetComponent.<Rigidbody>()){
var power : float=1;
var distance : float = transform.position.y-_transform.TransformPoint(_transform.GetComponent.<Rigidbody>().centerOfMass).y;
if(distance<-0.5){
//var temp_object : Transform= Instantiate (particle_hit[0]);
//temp_object.position=_transform.position;
//temp_object.position.y=transform.position.y+0.1;
}//distance


if(distance>0){
if(_transform.GetComponent(sc_man)&&_transform.GetComponent(sc_man).doing!="swim"){_transform.GetComponent(sc_man).Swim();}
//if(power<force_min){power=force_min;}
//if(distance<2){power*=0.8;}

var priboi_direction : Vector3=(transform.position-_transform.position).normalized;
if(_transform.GetComponent.<Rigidbody>().velocity.magnitude<1){_transform.GetComponent.<Rigidbody>().AddForce(Vector3(priboi_direction.x,0,priboi_direction.z)*_transform.GetComponent.<Rigidbody>().mass*0.05);}
_transform.GetComponent.<Rigidbody>().AddForce(Vector3.up*force*_transform.GetComponent.<Rigidbody>().mass*power*Mathf.Clamp(-_transform.GetComponent.<Rigidbody>().velocity.y*2,1,10));
if(_transform.GetComponent.<Rigidbody>().velocity.magnitude>5){_transform.GetComponent.<Rigidbody>().AddForce(-_transform.GetComponent.<Rigidbody>().velocity*_transform.GetComponent.<Rigidbody>().mass*20);}
}//distance
}//rigidbody
}//_collision

}//OnTriggerEnter