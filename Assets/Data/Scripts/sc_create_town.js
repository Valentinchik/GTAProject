#pragma strict
var objects : Transform[];
var num : int;
private var timer : float;
function Start () {

}//Start

function Update () {
if(objects.Length>0){
timer+=Time.deltaTime;
if(timer>0.1f){
timer=0;
if(objects[num]){
var temp_object : Transform= Instantiate (objects[num]);
temp_object.parent=transform;
temp_object.localPosition=Vector3.zero;}

num++;
if(num>=objects.Length){Destroy(this);}
}//timer
}//Length
}//Update