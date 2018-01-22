#pragma strict
private var game_ob : Transform;
private var game_sc : sc_game;
private var player_sc : sc_player;
private var input_man_sc : InputManager;

var mobile : boolean;
var target : Transform;
var fog : Transform;
var look_target : boolean;
var raycast : boolean;
var camera_type_man : ClassCameraType[];
var camera_type_vehicle : ClassCameraType[];
var camera_type : ClassCameraType;
public var camera_children : Transform;
private var camera_transform : Transform;
private var mini_map : Transform;
private var mmap_height : float=30;
private var mmap_distance : int=10;
public var rotation_speed : int=50;
public var rotate_y : float=0;
public var index : int=0;

public class ClassCameraType{
var zoom : float;
var height : float=1;
var flang : float=1;
var look: int;
var look_angle : Vector3;
var rotate_speed : float=10;
var fieldOf_view : float=60;
var raycast : boolean;
}


function Start () {
game_ob=GameObject.Find("Game").transform;
input_man_sc=GameObject.Find("MobileInput").GetComponent(InputManager);
game_sc=game_ob.GetComponent(sc_game);
player_sc=game_ob.GetComponent(sc_player);

camera_children=transform.FindChild("camera_child");
camera_transform=camera_children.GetChild(0);
if(PlayerPrefs.HasKey("camera_distance")){
var temp_distance : int=PlayerPrefs.GetInt ("camera_distance");
camera_transform.GetComponent(Camera).farClipPlane=temp_distance;
if(fog)fog.localScale=new Vector3(temp_distance,temp_distance,temp_distance);
}//camera_distance
if(PlayerPrefs.HasKey("touch_speed"))rotation_speed=PlayerPrefs.GetInt ("touch_speed");
camera_children.localPosition.y=camera_type.height;
camera_children.localPosition.x=camera_type.flang;
camera_transform.localPosition.z=camera_type.zoom;
mini_map=transform.FindChild("MiniMap");
if(mini_map){mini_map.parent=null;}

NextCamera(true,0);
}//Start

function Update () {

if(Input.GetKey(KeyCode.C)){
if (Input.GetAxis("Mouse ScrollWheel")>0) {camera_type.zoom+=0.5;}
if (Input.GetAxis("Mouse ScrollWheel")<0) {camera_type.zoom-=0.5;}}
if(Input.GetKeyDown(KeyCode.M)){mmap_distance+=30;if(mmap_distance>150){mmap_distance=10;}}


}//Update

function LateUpdate() {
var temp_rotation_speed : float=rotation_speed*0.03f;

camera_children.localPosition.x=Mathf.Lerp(camera_children.localPosition.x,camera_type.flang,10*Time.deltaTime);
camera_children.localPosition.y=Mathf.Lerp(camera_children.localPosition.y,camera_type.height,10*Time.deltaTime);


if(mini_map){
if(target){
mini_map.position.z=target.position.z;
mini_map.position.x=target.position.x;
mini_map.eulerAngles.y=target.eulerAngles.y;
var temp_mmap_y : float=mini_map.position.y-target.position.y;
if(target.root.GetComponent(Rigidbody)){mmap_height=mmap_distance+target.root.GetComponent.<Rigidbody>().velocity.magnitude/2;}
else{mmap_height=mmap_distance+20;}
     if(temp_mmap_y>mmap_height+2){mini_map.position.y-=0.1+Mathf.Abs(temp_mmap_y/30);}
else if(temp_mmap_y<mmap_height-2){mini_map.position.y+=0.1+Mathf.Abs(temp_mmap_y/30);}

}//target
}//mini_map

var hit : RaycastHit;

if (raycast&&Physics.Raycast(camera_children.position,camera_children.TransformDirection(Vector3.back), hit,Mathf.Abs(camera_type.zoom))) {camera_transform.localPosition.z=-hit.distance+0.3;}
else{camera_transform.localPosition.z=Mathf.Lerp(camera_transform.localPosition.z,camera_type.zoom,10*Time.deltaTime);}



if(target){
transform.position=Vector3.Lerp(transform.position,target.position,100*Time.deltaTime);
if((transform.position-target.position).magnitude<1)transform.position=target.position;

if(camera_type.look==0){
transform.eulerAngles.z=0;
transform.eulerAngles.x=0;
if(!mobile){
transform.Rotate(0, Input.GetAxis("Mouse X") * camera_type.rotate_speed*temp_rotation_speed, 0);
rotate_y+=-Input.GetAxis("Mouse Y")*camera_type.rotate_speed*temp_rotation_speed;}
else{
transform.Rotate(0,input_man_sc.view.x * camera_type.rotate_speed*temp_rotation_speed, 0);
rotate_y-=input_man_sc.view.y*camera_type.rotate_speed*temp_rotation_speed;
}//else

rotate_y=Functions.AngleSingle180(rotate_y);
rotate_y=Mathf.Clamp(rotate_y,-90,90);

camera_children.eulerAngles.x=rotate_y;
camera_children.localEulerAngles.y=0;
}//look

else if(camera_type.look==1){
transform.eulerAngles=target.eulerAngles;
camera_children.localEulerAngles.x=target.eulerAngles.x+camera_type.look_angle.x;

var temp_rotation1 : float;
if(target.root.GetComponent(sc_vehicle)&&target.root.GetComponent(sc_vehicle).back_speed){temp_rotation1=temp_rotation1+180;}
camera_children.localEulerAngles.y=Quaternion.Slerp(camera_children.localRotation,Quaternion.Euler(0,temp_rotation1,0),camera_type.rotate_speed*Time.deltaTime).eulerAngles.y;
//camera_children.localEulerAngles.y=0;
}//look

else if(camera_type.look==2){
if(!mobile){transform.Rotate(0, Input.GetAxis("Mouse X") * camera_type.rotate_speed, 0);}
else{transform.Rotate(0, input_man_sc.view.x * camera_type.rotate_speed, 0);}
camera_children.eulerAngles.x=camera_type.look_angle.x;
camera_children.localEulerAngles.y=0;
}//look

else if(camera_type.look==3){
//transform.RotateAround(Vector3(0,1,0), Input.GetAxis("Mouse X") * rotation_speed);
//transform.localEulerAngles.y=transform.localEulerAngles.y+Input.GetAxis("Mouse X") * rotation_speed;
transform.eulerAngles=target.eulerAngles;
camera_children.localEulerAngles.x=camera_type.look_angle.x;
if(!mobile){
camera_children.localEulerAngles.y=camera_children.localEulerAngles.y+Input.GetAxis("Mouse X") * camera_type.rotate_speed;}
else{camera_children.localEulerAngles.y=camera_children.localEulerAngles.y+input_man_sc.view.x * camera_type.rotate_speed;}
}//look

else if(camera_type.look==4){
var temp_rotation : float=target.eulerAngles.y;
if(target.root.GetComponent(sc_vehicle)&&target.root.GetComponent(sc_vehicle).back_speed){temp_rotation=temp_rotation+180;}
transform.eulerAngles.y=Quaternion.Slerp(transform.rotation,Quaternion.Euler(0,temp_rotation,0),camera_type.rotate_speed*Time.deltaTime).eulerAngles.y;
camera_children.eulerAngles.x=target.eulerAngles.x+camera_type.look_angle.x;
transform.eulerAngles.x=0;
transform.eulerAngles.z=0;
}//look

}//target
}//LateUpdate



function NextCamera(_get : boolean,_get_num : int){
if(_get){index=_get_num;}//get
else{index+=1;}

if(index>camera_type_man.Length-1){index=0;}
camera_type=camera_type_man[index];
Camera.main.fieldOfView=camera_type.fieldOf_view;
raycast=camera_type.raycast;
}//NextCamera

function NextCameraVehicle(_get : boolean,_get_num : int){
if(_get){index=_get_num;}//get
else{index+=1;}

if(index>camera_type_vehicle.Length-1){index=0;}
camera_type=camera_type_vehicle[index];
Camera.main.fieldOfView=camera_type.fieldOf_view;
raycast=camera_type.raycast;
}//NextCamera