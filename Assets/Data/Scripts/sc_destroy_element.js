#pragma strict
var mass : int=30;
var breakForce : int=2000;
var breakTorque : int=2000;
var freeze_rot : boolean;
function Start () {
Create();
}//Start

function Create(){
var rb : Rigidbody=gameObject.AddComponent(typeof(Rigidbody));
var fj : FixedJoint=gameObject.AddComponent(typeof(FixedJoint));
rb.mass=mass;
if(freeze_rot){rb.freezeRotation=true;}
fj.breakForce=breakForce;
fj.breakTorque=breakTorque;
Destroy(this);
}//Create