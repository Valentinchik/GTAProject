#pragma strict
public var script_mission : sc_mission;
public var points : List.<Transform> = new List.<Transform> ();
var point : Transform;
var point_num : int;

private var bot_script : sc_vehicle_bot;
function Start () {
bot_script=GetComponent(sc_vehicle_bot);
}//Start

function Update () {
if(!point&&points.Count>0){
bot_script.SimpleRacer();
point=points[point_num];}

if(point){
bot_script.have_point=false;
bot_script.target_pos=point.position;
var temp_distance : float=Vector3.Distance(transform.position,point.position);
if(temp_distance<5+GetComponent.<Rigidbody>().velocity.magnitude){
point_num++;
if(point_num>=points.Count){
if(script_mission)script_mission.NextEvent(2);
point_num=0;}
point=points[point_num];
}//temp_distance

}//point
}//Update