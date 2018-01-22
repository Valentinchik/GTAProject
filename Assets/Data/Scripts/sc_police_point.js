#pragma strict
var near_point : Transform[];
public var point : ClassPointCar;
private var script_path : Patches;
function Start () {
    script_path=GameObject.Find("Game").GetComponent(Patches);
Invoke("AddPoint",0.1f);
Invoke("FindPoint",0.2f);
}

function OnDrawGizmos() {
Gizmos.color = Color.cyan;
Gizmos.DrawWireSphere(transform.position,5);
}//OnDrawGizmos

function OnDrawGizmosSelected() {
Gizmos.color = Color.cyan;
if(near_point&&near_point.Length>0){
for (_point in near_point)	{
if(_point)Gizmos.DrawLine(_point.position,transform.position);
}//for
}//near_point
}//OnDrawSelect

 function AddPoint(){
point._position=transform.position;
point.index=script_path.point_car.Count;
script_path.point_car.Add(point);
}//AddPoint

 function FindPoint(){
 for (_point in near_point)	{
if(_point)script_path.point_car[point.index].near_point.Add(_point.GetComponent(sc_police_point).point.index);
}//for
script_path.point_police.Add(script_path.point_car[point.index]);
}//FindPoint