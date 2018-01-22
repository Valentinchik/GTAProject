#pragma strict
var mobile : boolean;
var input_man_sc : InputManager;
var script_weapinfo : sc_weapon_info;
var mobile_input : Transform;
var cross_texture : Texture2D[];
var cross_texture_vehicle : Texture2D[];
var health_bar_tex_0 : Texture2D;
var health_bar_tex_1 : Texture2D;
var health_bar_tex_2 : Texture2D;
var health_bar_tex_3 : Texture2D;
var tex_hit : Texture2D;
var tex_naru : Texture2D;
var tex_naru_red : Texture2D;
var tex_healthbar1 : Texture2D;
var tex_healthbar2 : Texture2D;
var tex_wanted_stars : Texture2D[];
var gs_cross_dis : GUIStyle;
var gs_bullets : GUIStyle;
var gstyle_0 : GUIStyle;
var gstyle_1 : GUIStyle;
var gstyle_2 : GUIStyle;
var gstyle_3 : GUIStyle;
var gstyle_4 : GUIStyle;
var gstyle_5 : GUIStyle;
var gstyle_help : GUIStyle;
var help_text : String[];
var weapon : int[];
var label_money : gui_label;
var label_health : gui_label;
var label_armor : gui_label;
var label_weapon_name : gui_label;
var label_bullets : gui_label;
var label_weapon_image : gui_label;
var label_stars : gui_label;
var label_cross : gui_label;
var label_price : gui_label;
var label_death : gui_label;

var but_parachute : Button;

var inv_band : gui_inventory;

public var player : Transform;
public var help : List.<ClassHelp> = new List.<ClassHelp> ();
public var band : List.<Transform> = new List.<Transform> ();
public var money : int=100;
public var boom : int=100;

var enemy : Transform;
private var _camera : Transform;
private var camera_children : Transform;
private var camera_transform : Transform;
private var game_sc : sc_game;
private var script_cam : sc_camera;
private var man_script : sc_man;
private var weapon_script : sc_weapon;
private var animator : Animator;
private var fire : boolean;
private var hit : boolean;
private var help_active : boolean;
private var aim : boolean;
private var help_timer : float;
private var fire_timer : float;
private var add_money_timer : float;
private var cross_width : int=15;
private var cross_height : int=4;
private var grenade : int;
private var add_money : int;
private var hit_point_turret : Vector2;
private var target_distance : float;
private var camera_int : int;
private var help_text2 : String;
private var text_0 : String;
public var price : String;
private var move_direction : Vector2;
var temp_vel_angle : Vector3;
var temp_tr_angle : Vector3;
var temp_diff_angle : float;
class ClassHelp {
var text : String;
var gstyle : GUIStyle;
}//ClassHelp

function Start () {
//GetComponent("InputManager").game=transform;
money=PlayerPrefs.GetInt("money");
//MoneyAdd(10000);
mobile_input=GameObject.Find("MobileInput").transform;
input_man_sc=mobile_input.GetComponent(InputManager);
script_weapinfo=GetComponent(sc_weapon_info);

game_sc=GetComponent(sc_game);
input_man_sc=mobile_input.GetComponent(InputManager);
man_script=player.GetComponent(sc_man);
weapon_script=player.GetComponent(sc_weapon);
_camera=GameObject.Find("Camera").transform;
camera_children=_camera.FindChild("camera_child");
camera_transform=camera_children.FindChild("Main Camera");
script_cam=_camera.GetComponent(sc_camera);
animator=player.GetComponent(Animator);
player.GetComponent(sc_man).player=true;
script_cam.target=player;
Invoke("LateStart",0.01);

text_0=
"Р’РљР›/Р’Р«РљР› РїРѕРґСЃРєР°Р·РєСѓ-------------I "+
"РџР•РЁРљРћРњ                           "+
"Р‘РµРі------------------------------------LShift "+
"РџСЂС‹Р¶РѕРє----------------------------------Space "+
"РЈРґР°СЂС‹ СЂСѓРєР°РјРё-------------------Р›РљРњ,РџРљРњ "+
"РЈРґР°СЂС‹ РЅРѕРіР°РјРё-------------РљРѕР»РµСЃРёРєРѕ РјС‹С€Рё "+
"Р’С‹Р±РѕСЂ РѕСЂСѓР¶РёСЏ-------------РљРѕР»РµСЃРёРєРѕ РјС‹С€Рё "+
"РћРіРѕРЅСЊ----------------------------Р›РљРњ "+
"РџСЂРёР±Р»РёР·РёС‚СЊ/РџСЂРёС†РµР»----------------РџРљРњ "+
"РџРµСЂРµР·Р°СЂСЏРґРёС‚СЊ-----------------------R "+
"РњРђРЁРРќРђ                               "+
"РЎРµСЃС‚СЊ/Р’С‹Р№С‚Рё РёР· РјР°С€РёРЅС‹-------------Р• "+
"РљР°РјРµСЂР° РЅР°Р·Р°Рґ---------------------LShift "+
"РЎРјРµРЅР° РєР°РјРµСЂС‹--------------------------V "+
"Р’РљР›/Р’Р«РљР› РґРІРёРіР°С‚РµР»СЊ----------------------P "+
"Р’РљР›/Р’Р«РљР› СЃРІРµС‚-------------------------------L "+
"Р’РљР›/Р’Р«РљР› РјРёРіР°Р»РєСѓ------------------------H "+
"РџСЂРёРєР°Р·Р°С‚СЊ РІРѕРґРёС‚РµР»СЋ РіРЅР°С‚СЊ/РџСЂРёРєР°Р·Р°С‚СЊ РІРѕРґРёС‚РµР»СЋ РµС…Р°С‚СЊ РјРµРґР»РµРЅРЅРѕ-----------Рљ ";

Invoke("Aim",5);
Invoke("HealthAdd",5);
//HelpActive(text_0);
AddBand(null,true);
}//Start

function LateStart(){



weapon_script.WeaponGive(0,false,0,0);
//weapon_script.WeaponGive(20,false,0,0);
for (var i=0;i<weapon.Length;i++)	{
if(PlayerPrefs.GetInt("weapon_"+weapon[i])!=0){weapon_script.WeaponGive(weapon[i],false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_"+weapon[i]);}
//PlayerPrefs.SetInt("weapon_"+weapon[i],0);
}//for
/*
weapon_script.WeaponGive(17,false,0,0);
weapon_script.WeaponGive(18,false,0,0);
weapon_script.WeaponGive(19,false,0,0);
weapon_script.WeaponGive(6,false,0,0);
weapon_script.WeaponGive(40,false,0,0);

if(PlayerPrefs.GetInt("weapon_7")!=0){weapon_script.WeaponGive(7,false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_7");}
if(PlayerPrefs.GetInt("weapon_10")!=0){weapon_script.WeaponGive(10,false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_10");}
if(PlayerPrefs.GetInt("weapon_11")!=0){weapon_script.WeaponGive(11,false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_11");}
if(PlayerPrefs.GetInt("weapon_12")!=0){weapon_script.WeaponGive(12,false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_12");}
if(PlayerPrefs.GetInt("weapon_13")!=0){weapon_script.WeaponGive(13,false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_13");}
if(PlayerPrefs.GetInt("weapon_14")!=0){weapon_script.WeaponGive(14,false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_14");}
if(PlayerPrefs.GetInt("weapon_15")!=0){weapon_script.WeaponGive(15,false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_15");}
if(PlayerPrefs.GetInt("weapon_16")!=0){weapon_script.WeaponGive(16,false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_16");}
if(PlayerPrefs.GetInt("weapon_30")!=0){weapon_script.WeaponGive(30,false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_30");}
if(PlayerPrefs.GetInt("weapon_41")!=0){weapon_script.WeaponGive(41,false,0,0);
weapon_script.weapon[weapon_script.weapon.Count-1].clips=PlayerPrefs.GetInt("weapon_41");}
*/
if(PlayerPrefs.GetInt("armor")>0)man_script.GiveArmor(PlayerPrefs.GetInt("armor"));
if(PlayerPrefs.GetInt("parachute")==1)man_script.GiveParachute();
//man_script.GiveParachute();
/*
weapon_script.WeaponGive(10,false,0,0);
weapon_script.WeaponGive(11,false,0,0);
weapon_script.WeaponGive(12,false,0,0);
weapon_script.WeaponGive(13,false,0,0);
weapon_script.WeaponGive(14,false,0,0);
weapon_script.WeaponGive(15,false,0,0);
weapon_script.WeaponGive(16,false,0,0);
weapon_script.WeaponGive(30,false,0,0);
weapon_script.WeaponGive(41,false,0,0);*/

weapon_script.WeaponSelect(0);
}//LateStart

function Update () {
if(input_man_sc.money_bonus>0){
MoneyAdd(input_man_sc.money_bonus);
input_man_sc.money_bonus=0;
}//money_bonus
label_money.text=money.ToString();
label_health.text=(man_script.health/(man_script.max_health/100)).ToString();
if(man_script.armor>0)label_armor.text=(man_script.armor/(man_script.max_armor/100)).ToString();

if(man_script.armor>0&&!label_armor.enabled)label_armor.enabled=true;
if(man_script.armor<=0&&label_armor.enabled)label_armor.enabled=false;
if(man_script.health>0&&!label_health.enabled)label_health.enabled=true;
if(man_script.health<=0&&label_health.enabled)label_health.enabled=false;

if(man_script.doing!="sit_vehicle"&&weapon_script.weapon.Count>0&&
(weapon_script.weapon[weapon_script.weapon_index].cross==0 || (!mobile&&!Input.GetKey(KeyCode.Mouse1)) || (mobile&&!aim))){
if(!label_cross.enabled)label_cross.enabled=true;}
else if(label_cross.enabled){label_cross.enabled=false;}

if(weapon_script.weapon.Count>0){
if(weapon_script.weapon_index>0)label_bullets.text=weapon_script.weapon[weapon_script.weapon_index].bullets+" / "+weapon_script.weapon[weapon_script.weapon_index].clips;
else label_bullets.text="";
label_weapon_name.text=weapon_script.weapon[weapon_script.weapon_index]._name;
label_weapon_image.texture=weapon_script.weapon[weapon_script.weapon_index].image;
}//Count

if(man_script.danger){
if(!label_stars.enabled)label_stars.enabled=true;
label_stars.texture=tex_wanted_stars[Mathf.Ceil(man_script.wanted_score/100)];
//GUI.DrawTexture(Rect(Screen.width-temp_tex_width/2,temp_tex_height+temp_tex_height/8*3,temp_tex_width/2,temp_tex_height/8),tex_wanted_stars[Mathf.Ceil(man_script.wanted_score/100)]);
}//danger
else if(label_stars.enabled)label_stars.enabled=false;

if(man_script.wanted_score>500)game_sc.helecopter_active[0]=true;
if(man_script.enabled&&!man_script.death){
input_man_sc.money.text=money+" $";

if(add_money!=0){
add_money_timer+=Time.deltaTime;
if(add_money>0){
input_man_sc.money_add.gui_style.normal.textColor=Color.green;
input_man_sc.money_add.text="+"+add_money+" $";
}//add_money
else if(add_money<0){
input_man_sc.money_add.gui_style.normal.textColor=Color.red;
input_man_sc.money_add.text=add_money+" $";
}//add_money

if(!input_man_sc.money_add.enabled)input_man_sc.money_add.enabled=true;
if(add_money_timer>3){
add_money_timer=0;
add_money=0;
input_man_sc.money_add.enabled=false;

}//add_money_timer
}//add_money

temp_vel_angle=Quaternion.LookRotation(player.GetComponent.<Rigidbody>().velocity.normalized).eulerAngles;
temp_tr_angle=Quaternion.LookRotation(player.TransformDirection(Vector3.forward)).eulerAngles;
temp_diff_angle=Functions.AngleSingle180(temp_vel_angle.y-temp_tr_angle.y);
if(man_script.doing!="sit_vehicle"){
if(man_script.parachute){
if(man_script.doing=="fall"&&!but_parachute.enabled)but_parachute.enabled=true;
else if(man_script.doing!="fall"&&but_parachute.enabled)but_parachute.enabled=false;
if(but_parachute.IsDownPressed()){man_script.OpenParachute();but_parachute.enabled=false;}
}//parachute


var hit1 : RaycastHit;
if (Physics.Raycast(Camera.main.transform.position, Camera.main.transform.TransformDirection(Vector3.forward),hit1, 6)){
if(hit1.transform.GetComponent(sc_buy_object)){
if(!input_man_sc.weapon_shop.gameObject.active){input_man_sc.weapon_shop.gameObject.SetActive(true);}
if(!label_price.enabled)label_price.enabled=true;
label_price.text="("+hit1.transform.GetComponent(sc_buy_object)._name+") "+hit1.transform.GetComponent(sc_buy_object).price+" $";
if((Input.GetKeyDown(KeyCode.B) || input_man_sc.weapon_buy)&&money>=hit1.transform.GetComponent(sc_buy_object).price){
if(hit1.transform.GetComponent(sc_buy_object).armor){
if(man_script.armor>=500)return false;
man_script.GiveArmor(500);
}//armor
if(hit1.transform.GetComponent(sc_buy_object).parachute){
if(man_script.parachute)return false;
man_script.GiveParachute();
}//armor
else{
weapon_script.WeaponGive(hit1.transform.GetComponent(sc_buy_object).num,false,0,0);
if(hit1.transform.GetComponent(sc_buy_object).price==0){Destroy(hit1.transform.gameObject);}
var temp_weapon : int=GetWeapon(hit1.transform.GetComponent(sc_buy_object).num);
PlayerPrefs.SetInt("weapon_"+hit1.transform.GetComponent(sc_buy_object).num,weapon_script.weapon[temp_weapon].clips);
weapon_script.WeaponSelect(temp_weapon);
}//else

MoneyAdd(-hit1.transform.GetComponent(sc_buy_object).price);
}//KeyCode
}//price
else{
if(label_price.enabled)label_price.enabled=false;
if(input_man_sc.weapon_shop.gameObject.active){input_man_sc.weapon_shop.gameObject.SetActive(false);}}
}//Physics
else{
if(label_price.enabled)label_price.enabled=false;
if(input_man_sc.weapon_shop.gameObject.active){input_man_sc.weapon_shop.gameObject.SetActive(false);}}

if(fire){
fire_timer+=Time.deltaTime;
weapon_script.RotateTo(script_cam.rotate_y,_camera.eulerAngles.y);
if(fire_timer>3 || man_script.doing=="go_to_vehicle"){
fire_timer=0;
fire=false;
weapon_script.EndFire();
if(man_script.doing=="fight")man_script.FightFalse();}
}//fire





var temp_direction : Vector3;
if(!mobile){
/*
if(weapon_script.weapon_index==0){
if(Input.GetKeyUp(KeyCode.Mouse0)){
man_script.Fight(1,_camera.eulerAngles.y);
}//mouse
if(Input.GetKeyDown(KeyCode.Mouse1)){
man_script.Fight(2,_camera.eulerAngles.y);
}//mouse

if(Input.GetKeyDown(KeyCode.Mouse2)){
man_script.Fight(3,_camera.eulerAngles.y);
}//mouse
}//weapon_index
else{
*/
if(weapon_script.weapon.Count>0&&weapon_script.weapon_index!=0){
if(Input.GetKey(KeyCode.Mouse1)){
script_cam.NextCamera(true,weapon_script.weapon[weapon_script.weapon_index]._camera);
fire=true;
fire_timer=0;
}//Mouse1

if(Input.GetKey(KeyCode.Mouse0)){
fire=true;
fire_timer=0;
var hit : RaycastHit;
var hit_point : Vector3;
if (Physics.Raycast(camera_transform.position, camera_transform.TransformDirection(Vector3.forward),hit, 5000)){hit_point=hit.point;}
else{hit_point=camera_transform.TransformPoint(Vector3(0,0,500));}
weapon_script.target_pos=hit_point;
weapon_script.fire=true;}

if(Input.GetKeyUp(KeyCode.Mouse1)||(Input.GetKeyUp(KeyCode.Mouse0)&&!Input.GetKey(KeyCode.Mouse1))){
script_cam.NextCamera(true,0);}
}//else
else if(Input.GetKeyDown(KeyCode.Mouse0)){
fire=true;
man_script.Fight(Random.Range(1,4),_camera.eulerAngles.y);
}//else







if(Input.GetAxis("Vertical")>0){temp_direction=Vector3.forward;
     if(Input.GetAxis("Horizontal")>0){temp_direction=Vector3( 1,0,1);}
else if(Input.GetAxis("Horizontal")<0){temp_direction=Vector3(-1,0,1);}
man_script.Run(temp_direction,_camera.eulerAngles.y,false);}

if(Input.GetAxis("Vertical")<0){temp_direction=Vector3.back;
     if(Input.GetAxis("Horizontal")>0){temp_direction=Vector3( 1,0,-1);}
else if(Input.GetAxis("Horizontal")<0){temp_direction=Vector3(-1,0,-1);}
man_script.Run(temp_direction,_camera.eulerAngles.y,false);}

if(Input.GetAxis("Horizontal")>0){temp_direction=Vector3.right;
     if(Input.GetAxis("Vertical")>0){temp_direction=Vector3(1,0, 1);}
else if(Input.GetAxis("Vertical")<0){temp_direction=Vector3(1,0,-1);}
man_script.Run(temp_direction,_camera.eulerAngles.y,false);}

if(Input.GetAxis("Horizontal")<0){temp_direction=Vector3.left;
     if(Input.GetAxis("Vertical")>0){temp_direction=Vector3(-1,0, 1);}
else if(Input.GetAxis("Vertical")<0){temp_direction=Vector3(-1,0,-1);}
man_script.Run(temp_direction,_camera.eulerAngles.y,false);}

if(Input.GetKey(KeyCode.LeftShift)){man_script.runing=true;}
if(Input.GetKeyUp(KeyCode.LeftShift)){man_script.runing=false;}

if(Input.GetKeyUp(KeyCode.E)&&man_script.doing!="go_to_vehicle"&&man_script.doing!="go_out_vehicle"){man_script.FindVehicle(true);}
if(Input.GetKeyUp(KeyCode.R)){weapon_script.Reload();}
if(Input.GetKeyUp(KeyCode.Space)){man_script.Jump();}
if(Input.GetKeyUp(KeyCode.T)){man_script.RagDoll();}
if(Input.GetKeyUp(KeyCode.P)){man_script.AddWantedScore(100);}
if(Input.GetKeyUp(KeyCode.V)){script_cam.NextCamera(false,1);}
if(Input.GetKeyUp(KeyCode.LeftControl)){if(man_script.speed_max!=1){man_script.speed_max=1;}else{man_script.speed_max=2;}}
if(!Input.GetKey(KeyCode.W)&&!Input.GetKey(KeyCode.S)&&!Input.GetKey(KeyCode.A)&&!Input.GetKey(KeyCode.D)&&man_script.can_doing==0){}
if(Input.GetKeyUp(KeyCode.J))man_script.Damage(200,0,Vector3.zero,Vector3.zero,null);
if(!Input.GetKey(KeyCode.C)&&!Input.GetKey(KeyCode.G)){
if (Input.GetAxis("Mouse ScrollWheel")>0&&!weapon_script.reload) {
weapon_script.weapon_index+=1;
if(weapon_script.weapon_index>=weapon_script.weapon.Count){weapon_script.weapon_index=0;}
weapon_script.WeaponSelect(weapon_script.weapon_index);}
if (Input.GetAxis("Mouse ScrollWheel")<0&&!weapon_script.reload) {
weapon_script.weapon_index-=1;
if(weapon_script.weapon_index<0){weapon_script.weapon_index=weapon_script.weapon.Count-1;}
weapon_script.WeaponSelect(weapon_script.weapon_index);}}



}//mobile
else {
if(!input_man_sc.man_control.gameObject.active){input_man_sc.man_control.gameObject.SetActive(true);}
if(input_man_sc.car_control.gameObject.active){input_man_sc.car_control.gameObject.SetActive(false);}

if(weapon_script.weapon.Count>0){
if(input_man_sc.aim){aim=!aim;}
if(aim){
script_cam.NextCamera(true,weapon_script.weapon[weapon_script.weapon_index]._camera);
fire=true;
fire_timer=0;
}//aim

else if(Camera.main.fieldOfView!=60){
script_cam.NextCamera(true,0);
}//Count




if(input_man_sc.fire){
fire=true;
fire_timer=0;
if(weapon_script.weapon_index>0){
var hit2 : RaycastHit;
var hit_point2 : Vector3;
if (Physics.Raycast(camera_transform.position, camera_transform.TransformDirection(Vector3.forward),hit2, 5000)){hit_point2=hit2.point;}
else{hit_point2=camera_transform.TransformPoint(Vector3(0,0,500));}
weapon_script.target_pos=hit_point2;
weapon_script.fire=true;
}//weapon_index
else if(input_man_sc.fire_down)man_script.Fight(Random.Range(1,4),_camera.eulerAngles.y);
}//fire



}//else






temp_direction=Vector3(input_man_sc.movement.x,0,-input_man_sc.movement.y);
//temp_direction=temp_direction.magnitude*temp_direction.normalized;
if(man_script.doing=="go_to_vehicle"&&man_script.can_doing<3&&temp_direction.magnitude>0.5){man_script.Move();}
if(temp_direction.magnitude>0)man_script.Run(temp_direction,_camera.eulerAngles.y,false);


if (input_man_sc.weapon_next&&!weapon_script.reload) {
weapon_script.weapon_index+=1;
if(weapon_script.weapon_index>=weapon_script.weapon.Count){weapon_script.weapon_index=0;}
weapon_script.WeaponSelect(weapon_script.weapon_index);}
else if (input_man_sc.weapon_previous&&!weapon_script.reload) {
weapon_script.weapon_index-=1;
if(weapon_script.weapon_index<0){weapon_script.weapon_index=weapon_script.weapon.Count-1;}
weapon_script.WeaponSelect(weapon_script.weapon_index);}


if(input_man_sc.jump){man_script.Jump();}
if(input_man_sc.sit_car&&man_script.doing!="go_to_vehicle"&&man_script.doing!="go_out_vehicle"){man_script.FindVehicle(true);}
if(input_man_sc.run){if(man_script.speed_max!=1){man_script.speed_max=1;}else{man_script.speed_max=2;}}
}//else

if(enemy&&fire){
var temp_distance : float=Vector3.Distance(enemy.position,_camera.position);
var temp_angle : Quaternion=Quaternion.LookRotation(enemy.GetComponent(sc_man).bip_target.position-_camera.position);
var temp_angle1 : Quaternion=Quaternion.LookRotation(enemy.GetComponent(sc_man).bip_target.position-camera_children.position);
var temp_angle_diff : float=5;
if(weapon_script.weapon_index==0)temp_angle_diff=30;


_camera.eulerAngles.y=Quaternion.Slerp(_camera.rotation,temp_angle1,0.05f).eulerAngles.y;
script_cam.rotate_y=Quaternion.Slerp(Quaternion.Euler(script_cam.rotate_y,0,0),temp_angle1,0.05f).eulerAngles.x;

var angle_diff : Vector3=Functions.Angle180Abs(temp_angle1.eulerAngles-camera_children.eulerAngles);
if(angle_diff.x>temp_angle_diff || angle_diff.y>temp_angle_diff || enemy.GetComponent(sc_man).health<=0){enemy=null;}
}//enemy

}//sit_vehicle
else if(man_script.doing=="sit_vehicle"&&man_script.vehicle&&man_script.vehicle.GetComponent(sc_vehicle)){
var vehicle_sc : sc_vehicle=man_script.vehicle.GetComponent(sc_vehicle);

if(!mobile){
if(script_cam.camera_type.look==4){
if(Input.GetKeyDown(KeyCode.LeftShift)){camera_children.localEulerAngles.y=180;}
else if(Input.GetKeyUp(KeyCode.LeftShift)){camera_children.localEulerAngles.y=0;}}
else{
if(Input.GetKeyDown(KeyCode.LeftShift)){camera_transform.localEulerAngles.y=180;}
else if(Input.GetKeyUp(KeyCode.LeftShift)){camera_transform.localEulerAngles.y=0;}}
if(Input.GetKeyUp(KeyCode.V)){NextCameraVehicle(0,false);}//V
if(Input.GetKeyUp(KeyCode.E)&&man_script.doing!="go_to_vehicle"&&man_script.doing!="go_out_vehicle"){man_script.GoOutVehicle();AllGoOutVehicle(vehicle_sc);}//E
if(Input.GetKeyUp(KeyCode.P)){if(!vehicle_sc.engine_work){vehicle_sc.EngineStart();}else{vehicle_sc.EngineStop();}}
if(Input.GetKeyUp(KeyCode.O)){man_script.vehicle.position.y+=1;man_script.vehicle.localEulerAngles.z=0;}//E
     if(Input.GetKeyUp(KeyCode.H)&&vehicle_sc.sirena&&!vehicle_sc.sirena.gameObject.active){vehicle_sc.sirena.gameObject.SetActive(true);}
else if(Input.GetKeyUp(KeyCode.H)&&vehicle_sc.sirena&&vehicle_sc.sirena.gameObject.active){vehicle_sc.sirena.gameObject.SetActive(false);}
if(Input.GetKeyUp(KeyCode.J))man_script.Damage(200,0,Vector3.zero,Vector3.zero,null);
if(vehicle_sc.engine_work&&man_script.vehicle_place==vehicle_sc.place[vehicle_sc.place_drive]){

vehicle_sc.throttle=Input.GetAxis("Vertical");
vehicle_sc.steer=Input.GetAxis("Horizontal");
vehicle_sc.rotate.y=_camera.eulerAngles.y;
vehicle_sc.rotate.x=_camera.GetComponent(sc_camera).camera_children.eulerAngles.x;

vehicle_sc.rotate.y=_camera.eulerAngles.y;
if (Input.GetKey(KeyCode.Space)){vehicle_sc.StopVehicle(100);}
}//place_drive

}//mobile

else {
if(script_cam.camera_type.look==4){
if(input_man_sc.backCameraButton.IsPressed ()){camera_children.localEulerAngles.y=180;}
else if(!input_man_sc.backCameraButton.IsPressed () || input_man_sc.sit_car){camera_children.localEulerAngles.y=0;}}
else {
if(input_man_sc.backCameraButton.IsPressed ()){camera_transform.localEulerAngles.y=180;}
else if(!input_man_sc.backCameraButton.IsPressed () || input_man_sc.sit_car){camera_transform.localEulerAngles.y=0;}}

if(vehicle_sc.engine_work&&man_script.vehicle_place==vehicle_sc.place[vehicle_sc.place_drive]){
if(!input_man_sc.car_control.gameObject.active){input_man_sc.car_control.gameObject.SetActive(true);}
if(input_man_sc.man_control.gameObject.active){input_man_sc.man_control.gameObject.SetActive(false);}
var temp_move1 : Vector2;
//var temp_move2 : Vector2;
if(input_man_sc.car_forward){temp_move1.y=1;}
else if(input_man_sc.car_back){temp_move1.y=-1;}
else{temp_move1.y=0;}

if(input_man_sc.car_left){temp_move1.x=-1;}
else if(input_man_sc.car_right){temp_move1.x=1;}
else{temp_move1.x=0;}
//move_direction=Vector2.Lerp(move_direction,temp_move1,5);
if(Input.GetAxis("Vertical")!=0)vehicle_sc.throttle=Input.GetAxis("Vertical");
else vehicle_sc.throttle=Mathf.Lerp(vehicle_sc.throttle,temp_move1.y,40f*Time.deltaTime);
if(Input.GetAxis("Horizontal")!=0)vehicle_sc.steer=Input.GetAxis("Horizontal");
else vehicle_sc.steer=Mathf.Lerp(vehicle_sc.steer,temp_move1.x,5*Time.deltaTime);
}//place_drive
if(input_man_sc.sit_car&&man_script.doing!="go_to_vehicle"&&man_script.doing!="go_out_vehicle"){man_script.GoOutVehicle();AllGoOutVehicle(vehicle_sc);}
if(input_man_sc.camera){NextCameraVehicle(0,false);}//V


}//mobile

}//sit_vehicle

if(band.Count>0){
for(var i = 0; i < band.Count; i++){
inv_band.price[i]=band[i].GetComponent(sc_man).health_100+"%";
if(band[i].GetComponent(sc_man).death)AddBand(band[i],false);
}//for
}//Count


}//death
else {
if(label_death.alpha<1&&Time.timeScale!=1)label_death.alpha+=0.005f;
}//else
}//Update

function NextCamera(_num : int){
script_cam.NextCamera(true,_num);
}//CameraCharacter

function CameraCharacter(){
script_cam.NextCamera(true,0);
script_cam.target=player;
}//CameraCharacter

function NextCameraVehicle(_num : int,_get_camera : boolean){
var vehicle_sc : sc_vehicle=man_script.vehicle.GetComponent(sc_vehicle);
camera_int+=1;
if(_get_camera){camera_int=_num;}
if(camera_int>vehicle_sc.camera_type.Length-1){camera_int=0;}
script_cam.NextCameraVehicle(true,vehicle_sc.camera_type[camera_int].num);
var temp_target : Transform=vehicle_sc.camera_type[camera_int].target;
if(temp_target){
if(!temp_target.gameObject.active)temp_target.gameObject.SetActive(true);
script_cam.target=temp_target;}
else{script_cam.target=player;}
}//NextCameraVehicle


function OnGUI(){
if(!input_man_sc.pause){
if(!man_script.death){
if(man_script.doing!="sit_vehicle"){
if(weapon_script.weapon.Count>0&&weapon_script.weapon[weapon_script.weapon_index].cross==0 || (!mobile&&!Input.GetKey(KeyCode.Mouse1)) || (mobile&&!aim)){
//GUI.DrawTexture(Rect((Screen.width-cross_height)/2, (Screen.height)/2-cross_width-4-weapon_script.now_return,cross_height,cross_width),cross_texture[0]);//up
//GUI.DrawTexture(Rect((Screen.width)/2-cross_width-4-weapon_script.now_return,(Screen.height-cross_height)/2,cross_width,cross_height),cross_texture[0]);//left
//GUI.DrawTexture(Rect((Screen.width-cross_height)/2, (Screen.height)/2+4+weapon_script.now_return,cross_height,cross_width),cross_texture[0]);//down
//GUI.DrawTexture(Rect((Screen.width)/2+4+weapon_script.now_return,            (Screen.height-cross_height)/2,cross_width,cross_height),cross_texture[0]);//right
}
else if(Input.GetKey(KeyCode.Mouse1) || aim){
GUI.DrawTexture(Rect(Screen.width/2-Screen.height/2,0,Screen.height,Screen.height),cross_texture[weapon_script.weapon[weapon_script.weapon_index].cross]);
}///else
//if(draw_price){DrawText(Vector2(Screen.width/2,Screen.height/2),price,gstyle_5);}

}//sit_vehicle


if(help.Count>0){
for(var i = 0; i < help.Count; i++){
DrawText(Vector2(Screen.width-150,100+20*i),help[i].text,help[i].gstyle);

}//for
}//Count
if(hit){
GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height),tex_hit);
}//hit

if(help_active){
GUI.Box(Rect(100,100,450,600),"");
GUI.color=Color.black;
GUI.TextArea(Rect(110,110,380,380),help_text2,gstyle_help);
GUI.color=Color.white;
GUI.TextArea(Rect(112,112,380,380),help_text2,gstyle_help);
help_timer+=Time.deltaTime;
if(help_timer>10){help_timer=0;help_active=false;}
}//help_active

//DrawText(Vector2(Screen.width-Screen.width/2.5,Screen.height/100),money+" $",gstyle_4);
//if(man_script.vehicle)DrawText(Vector2(Screen.width/2,Screen.height/3),"magnitude "+man_script.vehicle.rigidbody.velocity.magnitude,gstyle_4);


if(enemy&&fire){
var temp_script : sc_man=enemy.GetComponent(sc_man);
var temp_pos : Vector3  = Camera.main.WorldToScreenPoint (enemy.position + new Vector3 (0, 2.2f, 0));
var temp_in_camera : Vector3  = Camera.main.transform.InverseTransformPoint (enemy.position + new Vector3 (0, 2.2f, 0));
var temp_size : float  = (Screen.width+Screen.height)/30;

if (temp_in_camera.z > 0) {
GUI.color = Color.white;
GUI.DrawTexture (new Rect (temp_pos.x-temp_size/2,Screen.height-temp_pos.y-temp_size/5, temp_size, temp_size/5),tex_healthbar1);
GUI.color = Color.green;
if(temp_script.health<temp_script.max_health/3)GUI.color = Color.red;
else  if(temp_script.health<temp_script.max_health/1.5)GUI.color = Color.yellow;

GUI.DrawTexture (new Rect (temp_pos.x-temp_size/2,Screen.height-temp_pos.y-temp_size/5, temp_size/temp_script.max_health*temp_script.health, temp_size/5),tex_healthbar2);
}//temp_in_camera

}//health_bar

}//death
}//pause
}//OnGUI


function DrawText(_position : Vector2,_text : String,_style : GUIStyle){

GUI.color=Color.black;
GUI.Label(new Rect(_position.x,_position.y, 100, 100),_text,_style);
GUI.color=Color.white;
GUI.Label(new Rect(_position.x+3,_position.y+3, 100, 100),_text,_style);
}//DrawText

function AddHelp(_help_text : int,_gstyle : int,_other : boolean,_text : String){
return false;
var temp_text : String;
var temp_gstyle : GUIStyle;

     if(_gstyle==0){temp_gstyle=gstyle_0;}
else if(_gstyle==1){temp_gstyle=gstyle_1;}
else if(_gstyle==2){temp_gstyle=gstyle_2;}
else if(_gstyle==3){temp_gstyle=gstyle_3;}

if(_other){temp_text=_text;}
else {temp_text=help_text[_help_text];}

var temp_help : ClassHelp=new ClassHelp();
temp_help.text=temp_text;
temp_help.gstyle=temp_gstyle;

help.Add(temp_help);
Invoke("HelpFalse",5);
}//AddHelp

function HelpFalse(){
if(help.Count>0){help.RemoveAt(0);}
}//HelpFalse

function Hit(){
hit=true;
Invoke("HitFalse",0.5);
}//Hit

function HitFalse(){
hit=false;
}//HitFalse

function HelpActive(_text : String){
help_active=true;
help_text2=_text;
help_timer=0;
}//HelpActive

function HelpActiveFalse(){
help_active=false;
help_text2="РџСѓСЃС‚Рѕ";
help_timer=0;
}//HelpActiveFalse

function AllGoOutVehicle(_vehicle_sc : sc_vehicle){
for(var i = 0; i < _vehicle_sc.place.Length; i++){
if(_vehicle_sc.place[i].man&&_vehicle_sc.place[i].man!=transform&&_vehicle_sc.place[i].man.GetComponent(sc_man).health>0){
_vehicle_sc.place[i].man.GetComponent(sc_man).GoOutVehicle();
}//man
}//for
}//AllGoOutVehicle

function PlayerDeath(){
label_death.enabled=true;
mobile_input.gameObject.SetActive(false);
script_cam.rotation_speed=10;
script_cam.target=null;
Time.timeScale=0.3f;
Invoke("ReSpawn",2);
}//ReSpawn

function ReSpawn(){
Time.timeScale=1;
Application.LoadLevel ("Loading");

}//ReSpawn

function MoneyAdd(_money : int){
money+=_money;
add_money=_money;
PlayerPrefs.SetInt("money",money);
AudioSource.PlayClipAtPoint(game_sc.sound_effect[0], transform.position,1);
}//MoneyAdd

function GetWeapon(_num : int){

for(var i = 0; i < weapon_script.weapon.Count; i++){
if(weapon_script.weapon[i].index==_num){return i;}
}//for
}//GetWeapon

function EndFire(){
fire_timer=0;fire=false;
if(weapon_script.weapon_index!=0){weapon_script.EndFire();}
}//function

function HealthAdd(){
	MoneyAdd(2000);
if(man_script.health<man_script.max_health){
man_script.health+=man_script.max_health/100;
if(man_script.health>man_script.max_health)man_script.health=man_script.max_health;
}//max_health
Invoke("HealthAdd",5);
}//HealthAdd


function AddBand(_band : Transform,_add : boolean){
if(_add&&band.Count>=5)return false;
if(_band){
if(_add){
band.Add(_band);

}//add
else {
_band.GetComponent(sc_man).dellete=true;
band.Remove(_band);
}//else
}//band

if(band.Count>0){
inv_band.enabled=true;
inv_band.objects.Clear();
inv_band.price.Clear();
for(var i = 0; i < band.Count; i++){
inv_band.objects.Add(band[i].GetComponent(sc_man).image);
inv_band.price.Add(band[i].GetComponent(sc_man).health_100+"%");
}//for
inv_band.scale.x=band.Count;
}//Count
else inv_band.enabled=false;
}//AddBand

function Aim(){Invoke("Aim",0.1f);
if(!fire)return false;
var temp_enemy : Transform;
var temp_near_enemy : Transform;
var temp_distance_big : float=100;
var temp_angle_big : float=5;
var temp_distance : float;
var hit : RaycastHit;
var look_target : Vector3;
var angle_diff : Vector3;
var temp_angle_diff : float=5;
if(weapon_script.weapon_index==0)temp_angle_diff=30;

enemy=null;
for (var i=0;i<game_sc.man.Count;i++)	{
temp_enemy=game_sc.man[i];
if(temp_enemy!=transform&&temp_enemy.GetComponent(sc_man).health>0){
temp_distance=Vector3.Distance(temp_enemy.position, camera_children.position);

//look_target=Quaternion.LookRotation(temp_enemy.position+Vector3(0,1.5,0)-camera_children.position).eulerAngles;
//angle_diff=Vector3.Angle(Functions.Direction(look_target),Functions.Direction(camera_children.eulerAngles));
//if(angle_diff<temp_angle_big){
//temp_angle_big=angle_diff;
//temp_near_enemy=temp_enemy;
//}//angle
look_target=Quaternion.LookRotation(temp_enemy.position+Vector3(0,1.5,0)-camera_children.position).eulerAngles;
angle_diff=Functions.Angle180Abs(look_target-camera_children.eulerAngles);
if(angle_diff.x<temp_angle_diff&&angle_diff.y<temp_angle_big){
temp_angle_big=angle_diff.y;
temp_near_enemy=temp_enemy;
}//angle


}//team
}//for

if(temp_near_enemy){
enemy=temp_near_enemy;
}//temp_near_enemy

}//Aim
