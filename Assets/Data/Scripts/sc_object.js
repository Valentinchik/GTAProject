#pragma strict

var type : object_type;
var object : Transform;
var sound : AudioClip[];
var weapon_num : int;
enum object_type {
	armor = 0,
	health = 1,
	weapon = 2,
    parachute = 3,
}


function Start () {

}//Start

function Update () {
if(object){
object.eulerAngles.y+=50*Time.deltaTime;
}//object
}//Update

function OnTriggerEnter (_collision : Collider) {
if(_collision&&_collision.GetComponent(sc_man)&&_collision.GetComponent(sc_man).player&&_collision.GetComponent(sc_man).doing!="sit_vehicle"){
var temp_script : sc_man=_collision.GetComponent(sc_man);
if(type==object_type.armor)temp_script.GiveArmor(500);
else if(type==object_type.health)temp_script.health=temp_script.max_health;
else if(type==object_type.weapon){
_collision.GetComponent(sc_weapon).WeaponGive(weapon_num,false,0,0);
_collision.GetComponent(sc_weapon).WeaponSelectType(weapon_num);}
else if(type==object_type.parachute)temp_script.GiveParachute();


AudioSource.PlayClipAtPoint(sound[type], transform.position,1);
Destroy(gameObject);
}//_collision
}//OnTriggerEnter