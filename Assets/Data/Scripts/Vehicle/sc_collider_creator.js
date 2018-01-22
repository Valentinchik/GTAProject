#pragma strict
public var vehicle : Transform;
public var vehicle_old : Transform;
public var point : ClassPointCar;
public var area : ClassVehicleArea;
public var man : ClassMan;
public var info_sc : sc_info;
public var game_sc : sc_game;
public var creator_sc : sc_vehicle_creator;
function Start () {
if(point.boat)transform.localScale*=2;
//transform.position.y+=5;
if(!point.stop){GetComponent(BoxCollider).size.z=12;GetComponent(BoxCollider).center.z=3;}
Invoke("Delete",1.0f);
Invoke("CreateOldCar",Random.Range(0,1.0f));
}//Start

function OnTriggerEnter (_collision : Collider) {
if(!_collision.isTrigger){
creator_sc.vehicle.Remove(transform);
Destroy(gameObject);}
}//OnTriggerEnter

function Create(){
//if(game_sc.vehicle.Count>creator_sc.vehicle_max)return false;
var hit : RaycastHit;
var _position : Vector3=transform.position;
if(Physics.Raycast(transform.position,Vector3(0,-1,0),hit,100)){_position.y=hit.point.y+1;}
if(point.boat)vehicle=info_sc.boat_ob[man.boat[Random.Range(0,man.boat.Count)]];
else vehicle=info_sc.car_ob[man.car[Random.Range(0,man.car.Count)]];
var temp_vehicle : Transform=Instantiate(vehicle,_position,transform.rotation);
var temp_vehicle_sc : sc_vehicle=temp_vehicle.GetComponent(sc_vehicle);
var temp_bot_sc : sc_vehicle_bot=temp_vehicle.GetComponent(sc_vehicle_bot);
if(!point.stop){
var random_racer : int=Random.Range(0,20);
if(random_racer==0&&!temp_vehicle.GetComponent(sc_car_cop) || point.boat){temp_bot_sc.racer=true;}
temp_vehicle_sc.limit_speed=Random.Range(area.limit_speed*0.8,area.limit_speed*1.2);
temp_vehicle_sc.game_sc=game_sc;
temp_vehicle_sc.boat=point.boat;
temp_bot_sc.game_sc=game_sc;
temp_bot_sc.enabled=true;
temp_bot_sc.engine_work=true;
temp_bot_sc.GetPointStart(point);



var temp_man : Transform=Instantiate(info_sc.man_ob[man.man[Random.Range(0,man.man.Count)]]);
temp_man.position.y=-10000;
temp_man.GetComponent(sc_man).SitVehicle(temp_vehicle,temp_vehicle_sc.place[0],false);
temp_man.GetComponent(sc_man).game_sc=game_sc;
temp_man.GetComponent(sc_bot).game_sc=game_sc;

}//stop
creator_sc.vehicle.Remove(transform);
Destroy(gameObject);

}//Create

function OldCar(_vehicle : Transform){
vehicle_old=_vehicle;
Invoke("CreateOldCar",Random.Range(0,0.5f));
}//OldCar


function CreateOldCar(){
if(creator_sc.vehicle_delete.Count<=0)return false;
if(creator_sc.vehicle_delete[0].GetComponent(sc_vehicle).death){
creator_sc.vehicle_delete[0].GetComponent(sc_vehicle).destroy=false;
creator_sc.vehicle_delete.RemoveAt(0);
return false;}//death

var hit : RaycastHit;
var _vehicle : Transform=creator_sc.vehicle_delete[0];
var _position : Vector3=transform.position;
var temp_script : sc_vehicle_bot=_vehicle.GetComponent(sc_vehicle_bot);
var temp_script_vehicle : sc_vehicle=_vehicle.GetComponent(sc_vehicle);
var temp_old_man : Transform=temp_script_vehicle.place[0].man;
if(temp_script_vehicle.boat!=point.boat)return false;

if(Physics.Raycast(transform.position,Vector3(0,-1,0),hit,100))_position.y=hit.point.y+1;
_vehicle.position=_position;
_vehicle.eulerAngles=transform.eulerAngles;
_vehicle.GetComponent.<Rigidbody>().velocity=Vector3.zero;
if(_vehicle.GetComponent(sc_motobike_js))_vehicle.GetComponent(sc_motobike_js).crash=false;
if(!point.stop){
var random_racer : int=Random.Range(0,30);

if(random_racer==0&&!temp_script_vehicle.police){
temp_script.racer=true;}else{temp_script.racer=false;}

if(!temp_script_vehicle.police)temp_script_vehicle.limit_speed=Random.Range(area.limit_speed*0.8,area.limit_speed*1.2);
if(!temp_script.enabled)temp_script.enabled=true;
if(!temp_script_vehicle.engine_work)temp_script_vehicle.EngineWork();
temp_script.GetPointStart(point);
if(temp_old_man&&temp_old_man.GetComponent(sc_man).death){
temp_script_vehicle.place[0].use=false;
game_sc.man.Remove(temp_old_man);
Destroy(temp_old_man.gameObject);
}//temp_old_man
if(!temp_old_man){
if(temp_script_vehicle.police){
_vehicle.GetComponent(sc_car_cop).SeeEnemyFalse();
man=info_sc.man[4];}
else man=info_sc.man[0];
var temp_man : Transform=Instantiate(info_sc.man_ob[man.man[Random.Range(0,man.man.Count)]]);
temp_man.position.y=-10000;
temp_man.GetComponent(sc_man).SitVehicle(_vehicle,temp_script_vehicle.place[0],false);
}//man
}//stop
else{
if(temp_script_vehicle.sirena){temp_script_vehicle.sirena.gameObject.SetActive(false);}
temp_script_vehicle.EngineStop();
if(_vehicle.GetComponent(sc_car_cop))_vehicle.GetComponent(sc_car_cop).enabled=false;
if(temp_script.enabled)temp_script.enabled=false;
if(temp_old_man){
temp_script_vehicle.place[0].use=false;
game_sc.man.Remove(temp_old_man);
Destroy(temp_old_man.gameObject);
}//man
}//else
temp_script_vehicle.destroy=false;
creator_sc.vehicle_delete.RemoveAt(0);
creator_sc.vehicle.Remove(transform);
Destroy(gameObject);

}//Create

function Delete(){
creator_sc.vehicle.Remove(transform);
Destroy(gameObject);
}//Delete