#pragma strict
public var game_sc : sc_game;
public var team : int;
public var root : Transform;
public var target : Transform;

var explosion : Transform;
var fire : Transform;
var use_gravity : boolean;

var type : int=1;
var _speed : float=100;
public var power : float=10;
public var force : float=10;
public var exp_radius : float=10;
function Start () {
Destroy(gameObject,1000/_speed);
if(type==2)Destroy(gameObject,1);
}//Start

function Update () {
var temp_direction : Vector3=transform.TransformDirection(Vector3.forward);
if(use_gravity){transform.eulerAngles.x+=10*Time.deltaTime;}

if(target){
var angle_diff : Vector3;
var target_angle : Vector3=Quaternion.LookRotation(target.position-transform.position).eulerAngles;
angle_diff.x=Functions.Angle180Abs(target_angle-transform.eulerAngles).x;
angle_diff.y=Functions.Angle180Abs(target_angle-transform.eulerAngles).y;

if(angle_diff.x<60 && angle_diff.y<60){
transform.eulerAngles = Quaternion.Slerp(transform.rotation,Quaternion.Euler(target_angle.x,target_angle.y,0),20 * Time.deltaTime).eulerAngles;}}

var hit : RaycastHit;
if (Physics.Raycast(transform.position,temp_direction,hit,_speed*Time.deltaTime)) {
if(hit.transform.root!==root){
var temp_destroy : boolean=true;
if(type==0){
if(hit.collider&&hit.collider.GetType () != typeof(TerrainCollider)){
     if(hit.collider.material.name=="Metal (Instance)")CrieteDecal(1,hit,false);//Metal
else if(hit.collider.material.name=="Water (Instance)")CrieteDecal(2,hit,false);//water
else if(hit.collider.material.name=="Wood (Instance)")CrieteDecal(3,hit,false);//wood
else if(hit.collider.material.name=="Glass (Instance)")CrieteDecal(5,hit,true);//glass
else if(hit.collider.material.name=="man (Instance)")CrieteDecal(4,hit,false);//wood
else if(hit.transform.root.tag!="man"){CrieteDecal(0,hit,false);}
}//Terrain
else if(hit.transform.root.tag!="man"){CrieteDecal(0,hit,false);}


if(hit.transform.root.GetComponent(sc_man)){
if(root){
if(hit.transform.root.GetComponent(sc_man).cop)root.GetComponent(sc_man).Danger();
root.GetComponent(sc_man).enemy=hit.transform.root;}
hit.transform.root.GetComponent(sc_man).Damage(power,force,temp_direction,hit.point,root);}
else if(hit.rigidbody){hit.rigidbody.AddForce((temp_direction*force)/10);}
else if(hit.transform.parent&&hit.transform.parent.GetComponent.<Rigidbody>()){hit.transform.parent.GetComponent.<Rigidbody>().AddForce((temp_direction*force)/10);}
if(hit.transform.root.GetComponent(sc_vehicle)){hit.transform.root.GetComponent(sc_vehicle).Damage(power,root);}


if(temp_destroy){Destroy(gameObject);}
//else{transform.position-=transform.TransformDirection(Vector3.forward*_speed*Time.deltaTime)*0.4;}
else{
transform.position=hit.point;
transform.position+=temp_direction*0.01;
return false;}
}//type
else if(type==1){
CrieteExpl();
}//type
else if(type==2){
CrieteFire(hit);
}//type

}//root
}//Physics
transform.position+=temp_direction*_speed*Time.deltaTime;
}//Update

function CrieteExpl(){
var temp_object : Transform= Instantiate (explosion);
temp_object.position=transform.position;
temp_object.GetComponent(sc_explosion).power=power;
temp_object.GetComponent(sc_explosion).force=force;
temp_object.GetComponent(sc_explosion).radius=exp_radius;
temp_object.GetComponent(sc_explosion).root=root;
Destroy(gameObject);
}//CrieteExpl

function CrieteFire(_hit : RaycastHit){
var temp_object : Transform= Instantiate (fire);
temp_object.GetComponent(sc_fire).root=root;
temp_object.position=transform.position;
if(_hit.rigidbody || _hit.transform.root.GetComponent.<Rigidbody>() || _hit.transform.GetComponent(sc_object_death))temp_object.parent=_hit.transform;
Destroy(gameObject);
}//CrieteExpl

function CrieteDecal(_index : int,_hit : RaycastHit,_decal : boolean){
var temp_decal : ClassDecal=game_sc.decal[_index];
var temp_object : Transform;
var particle_rotation : Quaternion=Quaternion.FromToRotation(Vector3.up, _hit.normal);

//particle
temp_object= Instantiate (temp_decal.particle,_hit.point,particle_rotation);
if(_hit.rigidbody)temp_object.parent=_hit.transform;

//sound
AudioSource.PlayClipAtPoint(temp_decal.sound[Random.Range(0,temp_decal.sound.Count)], transform.position,0.2);

//decal
if(_decal){
temp_object= Instantiate (temp_decal.decal[Random.Range(0,temp_decal.decal.Count)],_hit.point,particle_rotation);
temp_object.parent=_hit.collider.transform;
Destroy(temp_object.gameObject,5);
}//decal
}//CrieteDecal



