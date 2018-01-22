#pragma strict
var objects : Transform[];
var objects_type : int[];


function Start () {
for(var i = 0; i <transform.childCount; i++){
var temp_object : Transform= Instantiate (objects[objects_type[i]],transform.GetChild(i).position,transform.GetChild(i).rotation);
temp_object.position.y+=1;
}//for
}//Start

function Update () {

}