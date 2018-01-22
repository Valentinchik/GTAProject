#pragma strict
public var script_game : sc_game;
public var info_sc : sc_info;
function Start () {
Invoke("CreateCar",Random.Range(0,1.0f));
}//Start

function CreateCar(){
var vehicle_ob : Transform=info_sc.car_ob[info_sc.man[4].car[Random.Range(0,info_sc.man[4].car.Count-1)]];
var temp_vehicle : Transform=Instantiate(vehicle_ob,transform.position,transform.rotation);
temp_vehicle.GetComponent(sc_vehicle).game_sc=script_game;
temp_vehicle.GetComponent(sc_vehicle_bot).game_sc=script_game;
Destroy(gameObject);
}//CreateCar