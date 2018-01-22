#pragma strict
var plane_depth : Transform;
var tex_radar : Texture2D;


private var _camera : Transform;
private var mini_camera : Transform;
private var minicam_com : Camera;

public var minimap_objects : List.<Transform> = new List.<Transform> ();
var minimap_object : Transform[];

function Start () {
_camera=GameObject.Find("Camera").transform;
mini_camera=transform.FindChild("MiniCamera").transform;
minicam_com=mini_camera.GetComponent(Camera);
//plane_depth.localScale.x=Screen.width*0.2*9;
//plane_depth.localScale.y=Screen.height*0.4*9;
}//Start

function FixedUpdate () {
transform.position=_camera.position;
transform.eulerAngles.y=_camera.eulerAngles.y;
}//FixedUpdate

function Update () {

minicam_com.pixelRect = new Rect(Screen.width * 0.01f - Screen.height * 0.015f, (Screen.height - Screen.width * 0.175f  - Screen.height * 0.015f)/1.5,Screen.width * 0.175f,Screen.width * 0.175f);
plane_depth.localScale = new Vector3(minicam_com.orthographicSize, minicam_com.orthographicSize, minicam_com.orthographicSize)*20;
}//Update

function OnGUI(){
var width : float=Screen.width*0.2;
var height : float=Screen.height*0.4;
var temp_texture : Texture2D;
//temp_texture=icon_car;
var rect_pos : Vector2=Vector2(minicam_com.pixelRect.x, Screen.height - minicam_com.pixelRect.y - minicam_com.pixelRect.height);
var rect_scale : Vector2=Vector2( minicam_com.pixelRect.width, minicam_com.pixelRect.height);
//GUI.DrawTexture(Rect(width/2-temp_texture.width/2,Screen.height-height/2-temp_texture.height/2,temp_texture.width,temp_texture.height),temp_texture);//up
var frame_rect : Rect= Rect(rect_pos.x,rect_pos.y,rect_scale.x,rect_scale.y);
GUI.DrawTexture(frame_rect, tex_radar);
//GUILayout.BeginArea(frame_rect);

if(minimap_objects.Count>0){
for (var i=0;i<minimap_objects.Count;i++)	{
if(minimap_objects[i]&&minimap_objects[i].GetComponent(sc_minimap_object).target){
var temp_target : Transform=minimap_objects[i].GetComponent(sc_minimap_object).target;
if(temp_target.gameObject.active){
var position_0 : Vector3=Vector3(temp_target.position.x,0,temp_target.position.z);
var position_1 : Vector3=Vector3(_camera.position.x,0,_camera.position.z);
var distance : float=Vector3.Distance(position_0,position_1);
if(distance>60){
var orgRotation : Matrix4x4 = GUI.matrix;
var temp_angle : float=Quaternion.LookRotation(position_0-position_1).eulerAngles.y-_camera.eulerAngles.y;
GUIUtility.RotateAroundPivot(temp_angle,rect_pos+Vector2(Screen.width * 0.175f/2,Screen.width * 0.175f/2));
GUI.DrawTexture(frame_rect,minimap_objects[i].GetComponent(sc_minimap_object).tex_arrow);
GUI.matrix = orgRotation;}
}//target_activate
}//target
}//for

}//Count
}//OnGUI






function CreateMinimapObject(_num : int,_object : Transform,_pos : Vector3){
if(minimap_objects.Count>0){
for (var i=0;i<minimap_objects.Count;i++)	{
if(minimap_objects[i]&&minimap_objects[i].GetComponent(sc_minimap_object).target==_object){
return false;
}//minimap_objects

}//for
}//Count

var temp_object : Transform=Instantiate (minimap_object[_num]);
if(_object){
temp_object.GetComponent(sc_minimap_object).target=_object;
}//_object
else{
temp_object.position=_pos;
}//else

minimap_objects.Add(temp_object);
}//CreateMinimapObject


function DeleteMinimapObject(_object : Transform,_minimap_object : Transform){
if(_object){
if(minimap_objects.Count>0){
for (var i=0;i<minimap_objects.Count;i++)	{
if(minimap_objects[i]&&minimap_objects[i].GetComponent(sc_minimap_object).target==_object){
Destroy(minimap_objects[i].gameObject);
minimap_objects.RemoveAt(i);
}//minimap_objects

}//for
}//Count
}//_object
else if(_minimap_object){
minimap_objects.Remove(_minimap_object);
Destroy(_minimap_object.gameObject);
}//else


}//DeleteMinimapObject

function DeleteAllMinimapObject(){

if(minimap_objects.Count>0){
for (var i=0;i<minimap_objects.Count;i++)	{
if(minimap_objects[i]){
Destroy(minimap_objects[i].gameObject);
}//minimap_objects

}//for
}//Count
minimap_objects.Clear();
}//DeleteMinimapObject











