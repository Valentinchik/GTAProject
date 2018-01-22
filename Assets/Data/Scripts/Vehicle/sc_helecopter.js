#pragma strict
private var vehicle_sc : sc_vehicle;
var sound_engine_work : AudioClip;

var rotor_0 : Transform;
var rotor_1 : Transform;

public var engine_start : boolean;
public var engine_stop : boolean;
public var normalized : boolean;
public var death : boolean;

private var sound_engine : AudioSource;
private var body : Transform;
private var controller : Transform;
private var rotor_speed : float=10;
var velocity_angle : float;
function Start () {
vehicle_sc=GetComponent(sc_vehicle);
body=transform.FindChild("body");
controller=transform.FindChild("controller");
//RotorActive(true);
if(gameObject.GetComponent(AudioSource))sound_engine=gameObject.GetComponent(AudioSource);
else sound_engine=gameObject.AddComponent(AudioSource);
}//Start

function Update () {

if(engine_start){
rotor_speed*=1.01;
sound_engine.pitch=0.1+(rotor_speed/1000);
rotor_0.Rotate(Vector3(0,rotor_speed*Time.deltaTime,0));
rotor_1.Rotate(Vector3(rotor_speed*2*Time.deltaTime,0,0));
if(rotor_speed>1500){
sound_engine.pitch=1;
rotor_speed=50;
engine_start=false;
engine_stop=false;
vehicle_sc.engine_work=true;
RotorActive(false);
}//rotor_speed
}//engine_start

if(engine_stop){
rotor_speed*=0.99;
sound_engine.pitch=0.1+(rotor_speed/1000);
rotor_0.Rotate(Vector3(0,rotor_speed*Time.deltaTime,0));
rotor_1.Rotate(Vector3(rotor_speed*Time.deltaTime,0,0));
if(rotor_speed<10){
rotor_speed=10;
engine_start=false;
engine_stop=false;
sound_engine.Stop();
}//rotor_speed

}//engine_stop

if(vehicle_sc.engine_work){
if(!death){
rotor_0.Rotate(Vector3(0,rotor_speed*Time.deltaTime,0));
rotor_1.Rotate(Vector3(rotor_speed*Time.deltaTime,0,0));
var magnitude : float=transform.GetComponent.<Rigidbody>().velocity.magnitude;
var temp_tr_angle : Vector3=Quaternion.LookRotation(transform.TransformDirection(Vector3.forward)).eulerAngles;
var temp_vel_angle : Vector3=Quaternion.LookRotation(transform.GetComponent.<Rigidbody>().velocity).eulerAngles;
velocity_angle=Functions.AngleSingle180(temp_vel_angle.y-temp_tr_angle.y);
if(magnitude>10){
if(velocity_angle>30&&velocity_angle<150)vehicle_sc.steer=-Mathf.Clamp(magnitude*0.05f,-1,1);
if(velocity_angle<-30&&velocity_angle>-150)vehicle_sc.steer=Mathf.Clamp(magnitude*0.05f,-1,1);
if(normalized){
if(velocity_angle>-30&&velocity_angle<30)vehicle_sc.rotate.x=-Mathf.Clamp(magnitude,-40,40);
if(velocity_angle<-150 || velocity_angle>150)vehicle_sc.rotate.x=Mathf.Clamp(magnitude,-40,40);
}//
}//magnitude
}//death
else{
vehicle_sc.rotate.y+=100*Time.deltaTime;
}//else
GetComponent.<Rigidbody>().velocity+=transform.TransformDirection(Vector3(0,9.5f+vehicle_sc.throttle*5,0))*Time.deltaTime;
transform.eulerAngles = Quaternion.Slerp(transform.rotation,Quaternion.Euler(vehicle_sc.rotate.x,vehicle_sc.rotate.y,-vehicle_sc.steer*45),1f * Time.deltaTime).eulerAngles;

}//engine_work

}//Update

function EngineStart(){
engine_start=true;
engine_stop=false;
sound_engine.clip = sound_engine_work;
sound_engine.loop = true;
sound_engine.Play();
}//EngineStart

function EngineStop(){
vehicle_sc.engine_work=false;
engine_start=false;
engine_stop=true;
rotor_speed=1500;
sound_engine.clip = sound_engine_work;
sound_engine.Play();
RotorActive(true);
}//EngineStop

function StopVehicle(index : float){
vehicle_sc.rotate.x=0;
}//StopVehicle

function RotorActive(_bool : boolean){
rotor_0.FindChild("rotor").gameObject.SetActive(_bool);
rotor_0.FindChild("rotor_speed").gameObject.SetActive(!_bool);
rotor_1.FindChild("rotor").gameObject.SetActive(_bool);
rotor_1.FindChild("rotor_speed").gameObject.SetActive(!_bool);


}//RotorActive

function Death(){
GetComponent(sc_vehicle).game_sc.transform.GetComponent(sc_player).MoneyAdd(2000);    
GetComponent(sc_helekop_bot).enabled=false;
vehicle_sc.fire=false;
}//Death

function OnGUI(){
//GUI.color=Color.black;
//GUI.Label(Rect(Screen.width/2,Screen.height/2,200,100),"angle"+velocity_angle);
}

