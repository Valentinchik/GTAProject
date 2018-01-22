#pragma strict
public var target : Transform;
public var tex_arrow : Texture2D;

var fixed_rotation : boolean;

public var game_sc : sc_game;

public var _camera : Transform;
private var icon_0 : Transform;
private var icon_1 : Transform;
private var place : Transform;
function Start () {
if(!game_sc)game_sc=GameObject.Find("Game").GetComponent(sc_game);
if(!_camera)_camera=GameObject.Find("Camera").transform;
if(transform.FindChild("icon_man"))icon_0=transform.FindChild("icon_man").transform;
if(transform.FindChild("icon_car"))icon_1=transform.FindChild("icon_car").transform;
if(transform.FindChild("mission_place"))place=transform.FindChild("mission_place").transform;
}//Start

function FixedUpdate () {
if(fixed_rotation&&_camera){
transform.eulerAngles.y=_camera.eulerAngles.y;
}//_camera

if(target){
transform.position=target.position;
transform.eulerAngles.y=target.eulerAngles.y;


if(target.GetComponent(sc_man)&&icon_0&&icon_1){
var temp_man_sc : sc_man=target.GetComponent(sc_man);
if(temp_man_sc.doing=="sit_vehicle"){
if(icon_0.gameObject.active){icon_0.gameObject.SetActive(false);}
if(!icon_1.gameObject.active){icon_1.gameObject.SetActive(true);}
transform.position=temp_man_sc.vehicle.position;
transform.eulerAngles.y=temp_man_sc.vehicle.eulerAngles.y;
}//sit_car
else if(temp_man_sc.doing!="sit_vehicle"&&icon_1.gameObject.active){
icon_0.gameObject.SetActive(true);
icon_1.gameObject.SetActive(false);
}//go_out_vehicle


}//sc_man
if(place){
if(target.GetComponent(sc_vehicle)&&target.GetComponent(sc_vehicle).place[0].man&&
target.GetComponent(sc_vehicle).place[0].man.GetComponent(sc_man).player){
if(place.gameObject.active)place.gameObject.SetActive(false);}
else if(!place.gameObject.active) place.gameObject.SetActive(true);

if(target.GetComponent(sc_man)){
var temp_man_sc1 : sc_man=target.GetComponent(sc_man);
if(temp_man_sc1.doing=="sit_vehicle"&&temp_man_sc1.vehicle&&temp_man_sc1.vehicle.GetComponent(sc_vehicle).place[0].man&&
temp_man_sc1.vehicle.GetComponent(sc_vehicle).place[0].man.GetComponent(sc_man).player){
if(place.gameObject.active)place.gameObject.SetActive(false);
}//player
else if(!place.gameObject.active) place.gameObject.SetActive(true);
}//sc_man
}//place

if(target.GetComponent(sc_man)&&target.GetComponent(sc_man).death)game_sc.DeleteMinimapObject(null,transform);
}//target
}//Update