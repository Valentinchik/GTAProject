#pragma strict
#pragma strict
var near_point : Transform[];
public var point : ClassPointCar;
private var script_path : Patches;
function Start () {
    script_path=GameObject.Find("Game").GetComponent(Patches);
Invoke("AddPoint",0.005f);
Invoke("FindPoint",0.01f);
}

function OnDrawGizmos() {
Gizmos.color = Color.green;
Gizmos.DrawWireSphere(transform.position,10);
}//OnDrawGizmos

function OnDrawGizmosSelected() {
Gizmos.color = Color.green;
if(near_point!=null&&near_point.Length>0){
for (_point in near_point)	{
if(_point)Gizmos.DrawLine(_point.position,transform.position);
}//for
}//Length
}//OnDrawSelect

 function AddPoint(){
point._position=transform.position;
point._rotation=transform.eulerAngles;
point.boat=true;
point.index=script_path.point_car.Count;
script_path.point_car.Add(point);
}//AddPoint

 function FindPoint(){
 for (_point in near_point)	{
if(_point)script_path.point_car[point.index].near_point.Add(_point.GetComponent(sc_boat_point).point.index);
}//for

}//FindPoint