#pragma strict

private var vehicle_sc : sc_vehicle;
private var game_sc : sc_game;
var detal : Transform[];
var glass : Transform[];
var wheel : ClassWheel[];
var wheel_info : ClassWheelInfo[];
var sound_engine : AudioSource;
var audio_skid : AudioSource;
var sound_engine_start : AudioClip;
var sound_engine_stop : AudioClip;
var sound_gear : AudioClip;
var gear_speed_max : float[];
var friction : ClassWheelFriction;

public var engine_start : boolean;
public var speed : float;
public var km_h : float;
public var doing : String="Idle";

private var body : Transform;
private var controller : Transform;


var suspensionRange : float = 0.3;
var suspensionDamper : float = 200;
var suspensionSpring : float = 20000;
var wheel_mass : float=2;
var impact_threeshold : float=0.6;
var impact_min_speed : float=2;
var centr_mass : float=0;

var power : float=40;
var max_steer : float=40;
var max_back_speed : float=70;
private var wheel_angle : float;
private var max_wheel_angle : float=50;
private var gear : int=0;
private var max_gear : int=5;
var rpm : float;
function Start () {
game_sc=GameObject.Find("Game").GetComponent(sc_game);
vehicle_sc=GetComponent(sc_vehicle);

body=transform.FindChild("body");
controller=transform.FindChild("controller");

LoadWheel();

sound_engine=gameObject.AddComponent(AudioSource);
audio_skid=controller.gameObject.AddComponent(AudioSource);
audio_skid.clip = game_sc.sound_skid;
audio_skid.loop = true;

gear_speed_max+=[0.0f];
gear_speed_max+=[20.0f];	
gear_speed_max+=[50.0f];	
gear_speed_max+=[90.0f];
gear_speed_max+=[130.0f];	
gear_speed_max+=[vehicle_sc.max_speed];
gear_speed_max+=[600.0f];
}//Start

function Update () {

speed=GetComponent.<Rigidbody>().velocity.magnitude;
km_h=speed*60*60/1000;
var temp_cm : float=-(centr_mass+Mathf.Abs(vehicle_sc.steer/5)+speed/90);
//if(temp_cm>0.5){temp_cm=0.5;}
GetComponent.<Rigidbody>().centerOfMass.y =temp_cm;
GetComponent.<Rigidbody>().centerOfMass.x =0;

if(engine_start){
if(!sound_engine.isPlaying){
sound_engine.clip = sound_gear;
sound_engine.loop = true;
sound_engine.Play();
vehicle_sc.engine_work=true;
engine_start=false;}
}//engine_start

if(vehicle_sc.engine_work){
//if(km_h>gear_speed_max[gear]&&gear<=max_gear){gear+=1;sound_engine.pitch+=1;sound_engine.clip = sound_gear;}
//if(km_h<gear_speed_max[gear]-1){gear-=1;sound_engine.pitch-=1;sound_engine.clip = sound_gear;}
sound_engine.pitch=1+Mathf.Abs(rpm/2000);
sound_engine.volume=1+Mathf.Abs(rpm/10);
}//engine_work
//var i :int;
SkidAudio(wheel[0].collider);

for (var _wheel in wheel){

if(_wheel.motor){rpm=_wheel.collider.rpm;}
//if(i==0){rpm=_wheel.collider.rpm;}
//i++;
var hit : RaycastHit;
var ColliderCenterPoint : Vector3 = _wheel.collider.transform.TransformPoint( _wheel.collider.center );
if ( Physics.Raycast( ColliderCenterPoint, -_wheel.collider.transform.up, hit, _wheel.collider.suspensionDistance + _wheel.collider.radius )) {
_wheel._transform.position = hit.point + (_wheel.collider.transform.up * _wheel.collider.radius);
}//Raycast
else{_wheel._transform.localPosition.y=-_wheel.collider.suspensionDistance;}

_wheel._rotation.x = Mathf.Repeat(_wheel._rotation.x + Time.deltaTime * _wheel.collider.rpm * 360.0f / 100.0f, 360.0f); 
_wheel.transform_child.localRotation=Quaternion.Euler(_wheel._rotation);

if(vehicle_sc.engine_work){
vehicle_sc.throttle=Mathf.Clamp(vehicle_sc.throttle,-1.0f,1.0f);
vehicle_sc.steer=Mathf.Clamp(vehicle_sc.steer,-1.0f,1.0f);

if(vehicle_sc.throttle>0&&km_h<vehicle_sc.limit_speed){doing="Move";
vehicle_sc.back_speed=false;
_wheel.collider.brakeTorque =0;
if(_wheel.motor){
_wheel.collider.motorTorque = power*vehicle_sc.throttle / (1+(GetComponent.<Rigidbody>().mass*0.00001));}
}
else if(vehicle_sc.throttle<0&&km_h<max_back_speed){doing="Move";
if(_wheel.collider.rpm>10){
vehicle_sc.back_speed=false;
_wheel.collider.brakeTorque =100;vehicle_sc.throttle=0;}
else{
_wheel.collider.brakeTorque=0;
vehicle_sc.back_speed=true;
if(_wheel.motor){
_wheel.collider.motorTorque = power*vehicle_sc.throttle / (1+(GetComponent.<Rigidbody>().mass*0.00001));}}
}//back_speed
else if(doing!="Stop"){_wheel.collider.motorTorque =0;_wheel.collider.brakeTorque =60;doing="Idle";}


if(_wheel.front){
_wheel.transform_child.Rotate(Vector3.right * (speed /_wheel.radius) * Time.deltaTime* Mathf.Rad2Deg);
_wheel.collider.steerAngle = (max_steer*vehicle_sc.steer / (1+(1500*0.00001)))/(1+(GetComponent.<Rigidbody>().velocity.magnitude/20)); 
wheel_angle=_wheel._transform.localEulerAngles.y;
if(wheel_angle>180){wheel_angle-=360;}
     if(wheel_angle>_wheel.collider.steerAngle*2+5){_wheel._transform.localEulerAngles.y-=200* Time.deltaTime;}
else if(wheel_angle<_wheel.collider.steerAngle*2-5){_wheel._transform.localEulerAngles.y+=200* Time.deltaTime;}
}//front

}//engine_work
else{_wheel.collider.brakeTorque =10;_wheel.collider.motorTorque =0;}
}//for



}//Update

function OnCollisionEnter (collision : Collision) {//collision.relativeVelocity.magnitude >= 10 && 
//if(collision.transform.root.GetComponent(sc_car)&&collision.transform.root.GetComponent(sc_car).place[0].man&&place[0].man){
//if(collision.transform.root.GetComponent(sc_car).place[0].man.GetComponent(sc_man).unit.respect[place[0].man.GetComponent(sc_man).unit.num]>-1){
//collision.transform.root.GetComponent(sc_car).place[0].man.GetComponent(sc_man).unit.respect[place[0].man.GetComponent(sc_man).unit.num]-=1;}

//}

if(collision.relativeVelocity.sqrMagnitude>100&&
GetComponent(sc_car_cop)&&vehicle_sc.place[0].man&&vehicle_sc.place[0].man.GetComponent(sc_man).cop&&
collision.transform.root.GetComponent(sc_vehicle)&&collision.transform.root.GetComponent(sc_vehicle).place[0].man&&
collision.transform.root.GetComponent(sc_vehicle).place[0].man.GetComponent(sc_man).player&&
!collision.transform.root.GetComponent(sc_vehicle).place[0].man.GetComponent(sc_man).danger){
collision.transform.root.GetComponent(sc_vehicle).place[0].man.GetComponent(sc_man).Danger();
}//sc_car_cop

Hit(collision);
}//OnCollisionEnter

function OnCollisionStay (collision : Collision) {

}//OnCollisionEnter

function LoadWheel(){
var temp_wheels_ob : Transform=body.FindChild("wheels");
var wc : WheelCollider;
var temp_wheel_ob : Transform;
var temp_wheel_parent : Transform;
for (var i=0;i< temp_wheels_ob.childCount;i++){
var temp_wheel : ClassWheel=new ClassWheel();
temp_wheel_parent=temp_wheels_ob.FindChild("wheel_"+i);
temp_wheel_ob=temp_wheel_parent.FindChild("wheel");

wc=temp_wheel_parent.gameObject.AddComponent(WheelCollider);
wc.suspensionDistance = suspensionRange;
wc.suspensionSpring.damper = suspensionDamper;
wc.suspensionSpring.spring = suspensionSpring;

temp_wheel._transform=temp_wheel_ob;
temp_wheel.transform_child=temp_wheel_ob.FindChild("wheel");
temp_wheel.collider=wc;
temp_wheel.radius = temp_wheel.transform_child.FindChild("wheel").GetComponent.<Renderer>().bounds.size.y / 2;
temp_wheel.collider.radius=temp_wheel.radius;
temp_wheel.collider.mass=wheel_mass;
temp_wheel.front=wheel_info[i].front;
temp_wheel.motor=wheel_info[i].motor;
temp_wheel.wheel_pos_start=temp_wheel_ob.localPosition.y;

wc.forwardFriction.extremumValue=friction.forward_friction_extrem;
wc.forwardFriction.asymptoteValue=friction.forward_friction_asymp;
if(temp_wheel.front){
wc.sidewaysFriction.extremumValue=friction.front_sideways_friction_extrem;
wc.sidewaysFriction.asymptoteValue=friction.front_sideways_friction_asymp;}
else{
wc.sidewaysFriction.extremumValue=friction.back_sideways_friction_extrem;
wc.sidewaysFriction.asymptoteValue=friction.back_sideways_friction_asymp;}
//wc.forwardFriction=fwfc;
//wc.sidewaysFriction=swfc;

wheel+=[temp_wheel];
}//for

}//LoadWheel


function StopVehicle(index : float){
doing="Stop";
vehicle_sc.throttle=0;
for (var _wheel in wheel){
_wheel.collider.brakeTorque =index;
_wheel.collider.motorTorque =0;
}//for
}//StopVehicle

function EngineStart(){
engine_start=true;
sound_engine.clip = sound_engine_start;
sound_engine.loop = false;
sound_engine.volume=1;
sound_engine.Play();
}//EngineStart

function EngineWork(){
sound_engine.clip = sound_gear;
sound_engine.loop = true;
sound_engine.Play();
vehicle_sc.engine_work=true;
engine_start=false;
vehicle_sc.throttle=1;
GetComponent.<Rigidbody>().velocity=transform.TransformDirection(Vector3.forward*vehicle_sc.limit_speed/4);
}//EngineWork

function EngineStop(){
engine_start=false;
vehicle_sc.engine_work=false;
sound_engine.loop = false;
sound_engine.pitch=1;
sound_engine.clip = sound_engine_stop;
sound_engine.Play();
}//EngineStart

function SkidAudio(_wheel : WheelCollider){
var temp_graund_hut : WheelHit;
_wheel.GetGroundHit(temp_graund_hut);

if(Mathf.Abs(temp_graund_hut.sidewaysSlip) > 5 || Mathf.Abs(temp_graund_hut.forwardSlip) > 7){
if(!audio_skid.isPlaying){audio_skid.Play();}
audio_skid.GetComponent.<AudioSource>().volume = Mathf.Abs(temp_graund_hut.sidewaysSlip)/20 + Mathf.Abs(temp_graund_hut.forwardSlip)/20;}
else{audio_skid.GetComponent.<AudioSource>().volume -= Time.deltaTime;if(audio_skid.GetComponent.<AudioSource>().volume<0.1){audio_skid.Stop();}}
		
}//SkidAudio


		
function Hit(_collision : Collision){
if (_collision.contacts.Length > 0 && _collision.transform.tag!="man"&& _collision.transform.root.tag!="man"){	
var temp_magnitude : float=_collision.relativeVelocity.magnitude;
if(temp_magnitude > 5){
if (_collision.contacts[0].thisCollider.GetType () != typeof(WheelCollider)){
AudioSource.PlayClipAtPoint(game_sc.sound_car_crush[Random.Range(0,game_sc.sound_car_crush.Length)],_collision.contacts[0].point,temp_magnitude*0.02);
}//WheelCollider
}//magnitude
}//Length
}//Hit	

