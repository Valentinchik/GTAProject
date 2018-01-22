#pragma strict
private var _rigidbody : Rigidbody;
private var _collider : BoxCollider;
private var _join : HingeJoint;
private var timer : float;
private var info_sc : sc_info;
private var angle : Vector3;
private var _position : Vector3;
private var place : ClassVehiclePlace;
private var type : ClassVehicleDoor;
private var direction : int;

public var open : int;
public var activate : boolean;
public var _open : boolean;
public var velo : float;
function Start () {
angle=transform.localEulerAngles;
_position=transform.localPosition;
}//Start

function Update () {
if(activate&&!_join){Destroy(GetComponent(sc_door));place.door=null;}
if(activate&&_join){
if(Mathf.Abs(_join.angle-0)<25){_open=false;}else{_open=true;}
if(open==1&&Mathf.Abs(_join.angle-_join.limits.max)<5){timer+=Time.deltaTime;if(timer>=3){OpenFalse();}}
if(open!=1&&_join.velocity>10*direction*-1&&_join.angle*direction<2){CloseFalse();}
velo=_join.angle;
}//activate
}//Update

function Open(){
if(!activate){Activate();
AudioSource.PlayClipAtPoint(type.sound_open, transform.position,0.5);}
_join.useSpring=true;
_join.spring.spring=300;
_join.spring.targetPosition=_join.limits.max;
timer=0;
open=1;
}//function

function OpenFalse(){
_join.useSpring=false;
timer=0;
open=0;
}//function

function CloseFalse(){
AudioSource.PlayClipAtPoint(type.sound_close, transform.position,0.5);
Destroy(_join);
Destroy(_collider);
Destroy(_rigidbody);
Destroy(GetComponent(sc_door));
transform.localEulerAngles=angle;
transform.localPosition=_position;
}//function


function Close(){
_join.useSpring=true;
_join.spring.spring=1000;
_join.spring.targetPosition=0;
timer=0;
open=2;
}//function


function Activate(){
activate=true;
_rigidbody=gameObject.AddComponent(typeof(Rigidbody));
_collider=gameObject.AddComponent(typeof(BoxCollider));
_join=gameObject.AddComponent(typeof(HingeJoint));
//_collider.material=
_rigidbody.mass=80;
_rigidbody.angularDrag=20;
_collider.size.x=0.15;
_collider.size.y=0.6;
_collider.size.z=1.1;
_collider.center.z=-_collider.size.z/2;
_collider.center.x=direction*(_collider.size.x/2);
_join.connectedBody=transform.root.GetComponent.<Rigidbody>();
_join.axis=Vector3(0,1,0);
_join.useLimits=true;
_join.limits.min=0;
_join.limits.max=60*direction;
Invoke("Break",0.1);
}//Activate

function Break(){
_join.breakForce=2000;
_join.breakTorque=2000;
}//Break

function Setting(_type : int,_place : ClassVehiclePlace,_direction : int){
info_sc=GameObject.Find("Game").GetComponent(sc_info);
type=info_sc.vehicle_door[_type];
place=_place;
direction=_direction;
}//function
