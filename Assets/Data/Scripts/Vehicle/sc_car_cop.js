#pragma strict
private var game_sc : sc_game;
private var bot_script : sc_vehicle_bot;
private var man_script_enemy : sc_man;
private var vehicle_sc : sc_vehicle;

var see_range : int=200;
var enemy : Transform;
var place_death : Transform;
private var enemy_distance : float;
private var see_enemy : boolean;
private var have_enemy : boolean;
private var have_point : boolean=true;
private var pd_pos : Vector3;
private var enemy_pos : Vector3;
private var stop_timer : float;
private var stop : boolean;
function Start () {
game_sc=GameObject.Find("Game").GetComponent(sc_game);
bot_script=GetComponent(sc_vehicle_bot);
vehicle_sc=GetComponent(sc_vehicle);
vehicle_sc.police=true;
bot_script.police=true;
Invoke("FindEnemy",1);
Invoke("SeePD",1);
}//Start

function Update () {
if(see_enemy&&vehicle_sc.engine_work){
if(enemy){
bot_script.global_target_pos=enemy.position;
enemy_distance=Vector3.Distance(transform.position,enemy.position);
if(enemy_distance<100)man_script_enemy.Danger();
var temp_radius : float=40;
var temp_magnitude : float=0.5f;

if(vehicle_sc.boat){
temp_radius=200;
temp_magnitude=10;}
if(enemy_distance<temp_radius){
have_point=false;
bot_script.have_point=false;
//if(enemy_distance<5)bot_script.target_pos=enemy.position;
 if(enemy_distance<20){
bot_script.racer_collision=false;
bot_script.target_pos=enemy.TransformPoint(enemy_pos);}
else {
bot_script.racer_collision=true;
bot_script.target_pos=enemy.position;}
}//30
else if(!have_point&&!vehicle_sc.boat){bot_script.FindPolicePoint(enemy.position);have_point=true;}

if(enemy_distance<20){
if((man_script_enemy.vehicle&&man_script_enemy.vehicle.GetComponent.<Rigidbody>().velocity.magnitude<10) || man_script_enemy.doing!="sit_vehicle"){
vehicle_sc.throttle=0;
vehicle_sc.StopVehicle(200);
if(GetComponent.<Rigidbody>().velocity.magnitude<temp_magnitude){AllOutVehicle();}
}//magnitude
//else if(enemy_distance<5){vehicle_sc.steer=1;}
}//enemy_distance
}//enemy
else if(place_death){
bot_script.global_target_pos=pd_pos;
var pd_distance : float=Vector3.Distance(transform.position,pd_pos);
if(pd_distance<60){
bot_script.target_pos=pd_pos;
stop_timer+=Time.deltaTime;
if(stop_timer>20){stop=true;}
}//pd_distance
if(pd_distance<20 || stop){
vehicle_sc.throttle=0;
vehicle_sc.StopVehicle(200);
if(GetComponent.<Rigidbody>().velocity.magnitude<0.5){
AllOutVehicle();
GetBPoint();
}//magnitude
}//pd_distance
}//place_death

}//engine_work

}//Update

function FindEnemy(){
Invoke("FindEnemy",2);
if(!this.enabled){return false;}
var temp_enemy_sc : sc_man;
var temp_enemy : Transform;
var temp_near_enemy : Transform;
var temp_distance_big : float=see_range;
var temp_distance : float;
var hit : RaycastHit;



if(enemy&&man_script_enemy&&man_script_enemy.health>0){
temp_distance=Vector3.Distance(enemy.position, transform.position);
if (temp_distance < temp_distance_big){//&&Physics.Linecast (transform.position+Vector3(0,1.5,0),man_script_enemy.bip_target.position, hit)
//if(hit.transform==enemy || hit.transform.root==enemy || hit.transform.root==man_script_enemy.vehicle){
enemy_distance=temp_distance;
bot_script.Racer(true,vehicle_sc.max_speed);
if(vehicle_sc.sirena)vehicle_sc.sirena.gameObject.SetActive(true);
return false;
//}//enemy
//else {game_sc.GetPositionKiller(enemy);}
}//temp_distance
}//enemy


enemy=null;
for (var i=0;i<game_sc.man.Count;i++)	{
temp_enemy=game_sc.man[i];
temp_enemy_sc=temp_enemy.GetComponent(sc_man);
if(temp_enemy&&temp_enemy_sc&&temp_enemy_sc.health>0&&temp_enemy_sc.danger){
temp_distance=Vector3.Distance(temp_enemy.position, transform.position);
if (temp_distance < temp_distance_big&&Physics.Linecast (transform.position+Vector3(0,1.5,0),temp_enemy_sc.bip_target.position, hit)){
if(hit.transform==temp_enemy || hit.transform.root==temp_enemy || hit.transform.root==temp_enemy_sc.vehicle){
temp_near_enemy=temp_enemy;
temp_distance_big=temp_distance;
}//temp_enemy
}//temp_distance
}//danger
}//for

if(temp_near_enemy){
enemy=temp_near_enemy;
man_script_enemy=enemy.GetComponent(sc_man);
place_death=null;
man_script_enemy.Danger();
SeeEnemyTrue(enemy.position,vehicle_sc.max_speed);
}//temp_near_enemy
else if(see_enemy){
have_enemy=false;
Invoke("SeeEnemyFalse",20);
}//else


}//FindEnemy

function SeeEnemyTrue(_pos : Vector3,_speed : float){
var random_pos : int=Random.Range(0,3);
if(random_pos==0)enemy_pos=Vector3(-3,0,5);
else if(random_pos==1)enemy_pos=Vector3(3,0,5);
else if(random_pos==2)enemy_pos=Vector3(0,0,-3);
vehicle_sc.limit_speed=_speed;
see_enemy=true;
have_enemy=true;
bot_script.global_target=true;
bot_script.Racer(true,_speed);
bot_script.global_target_pos=_pos;
if(!vehicle_sc.boat)bot_script.FindPolicePoint(transform.position);//transform.TransformPoint(Vector3.forward*50)
if(vehicle_sc.sirena)vehicle_sc.sirena.gameObject.SetActive(true);
}//SeeEnemyTrue

function SeeEnemyFalse(){
if(have_enemy || place_death || !bot_script) return false;
see_enemy=false;
bot_script.global_target=false;
bot_script.Racer(false,0);
if(vehicle_sc.sirena){vehicle_sc.sirena.gameObject.SetActive(false);}

}//SeeEnemyFalse

function AllOutVehicle(){
for (var i=0;i<vehicle_sc.place.Length;i++)	{
if(vehicle_sc.place[i].man&&vehicle_sc.place[i].man.GetComponent(sc_man).health>0){
vehicle_sc.place[i].man.GetComponent(sc_man).GoOutVehicle();
vehicle_sc.place[i].man.GetComponent(sc_bot).target_pos=bot_script.target_pos;
vehicle_sc.place[i].man.GetComponent(sc_bot).have_point=false;
}//man
}//for
GetComponent(sc_vehicle_bot).enabled=false;
vehicle_sc.throttle=0;
this.enabled=false;
if(vehicle_sc.sirena){vehicle_sc.sirena.gameObject.SetActive(false);}
}//AllOutVehicle

function SeePD(){
if(game_sc.place_death.Count<=0){return false;}

var temp_place_death : Transform;
var temp_near_pd : Transform;
var temp_distance_big : float=see_range+500;
var temp_distance : float;

place_death=null;
for (var i=0;i<game_sc.place_death.Count;i++)	{
temp_place_death=game_sc.place_death[i];
if(temp_place_death&&temp_place_death.GetComponent(sc_place_death).car.Count<temp_place_death.GetComponent(sc_place_death).car_count){
temp_distance=Vector3.Distance(temp_place_death.position, transform.position);
if (temp_distance < temp_distance_big){
temp_near_pd=temp_place_death;
temp_distance_big=temp_distance;
}//temp_distance
}//temp_place_death
}//for

if(temp_near_pd){
temp_near_pd.GetComponent(sc_place_death).car.Add(transform);

place_death=temp_near_pd;
pd_pos=place_death.position+Vector3(Random.Range(-10,10),0,Random.Range(-10,10));
SeeEnemyTrue(pd_pos,vehicle_sc.max_speed*0.7);
return true;}
}//SeePD


function GetBPoint(){
var temp_man : Transform;
if(place_death.GetComponent(sc_place_death).have_point){
for (var i=0;i<vehicle_sc.place.Length;i++)	{
temp_man=vehicle_sc.place[i].man;
if(temp_man){
temp_man.GetComponent(sc_bot).have_point=true;
temp_man.GetComponent(sc_bot).GetThisPoint(place_death.GetComponent(sc_place_death).near_point[Random.Range(0,place_death.GetComponent(sc_place_death).near_point.Count)],true);}
}//for
}//have_point
else{

}//else

}//GetBPoint