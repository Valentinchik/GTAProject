#pragma strict
var info_sc : sc_info;
var input_sc : InputManager;
var game_sc : sc_game;
var player_sc : sc_player;
var label_price : gui_label;

var collider_create_sc : sc_trigger;
var collider_buy_sc : sc_trigger;
var create_point : Transform;
var spawn_car : Transform;

public var text : List.<ClassLanguage> = new List.<ClassLanguage> ();

var gui_style_0 : GUIStyle;
private var car : Transform;
private var player : Transform;
private var num : int;
private var price : int;
private var help_num : int;
private var timer : float;
private var create : boolean;
private var draw_price : boolean;
private var help : boolean;

function Start () {
//for (var j=0;j<spawn_car.childCount;j++)	{PlayerPrefs.SetInt("car_"+j,0);}//for
input_sc=GameObject.Find("MobileInput").GetComponent(InputManager);
num=Random.Range(1,info_sc.car_shop.Length);
var text_russian : ClassLanguage=new ClassLanguage();
var text_english : ClassLanguage=new ClassLanguage();

text_russian.language.Add("У вас нехватает денег");
text_russian.language.Add("Эта машина будет появляться у вас в гараже");
text_russian.language.Add("Нет места для машин");
text_russian.language.Add("У вас есть эта машина");
text.Add(text_russian);

text_english.language.Add("Not enough money");
text_english.language.Add("This car will appear in your garage");
text_english.language.Add("There is no place for cars");
text_english.language.Add("You have this car");
text.Add(text_english);

}//Start

function Update () {
/*
if(collider_create_sc.collision){
var temp_collision : Transform=collider_create_sc.collision;
if(temp_collision.root.GetComponent(sc_vehicle)&&temp_collision.root.GetComponent(sc_vehicle).driver&&
temp_collision.root.GetComponent(sc_vehicle).driver.GetComponent(sc_man).player){temp_collision=temp_collision.root.GetComponent(sc_vehicle).driver;}
else if(temp_collision.root.GetComponent(sc_man)){temp_collision=temp_collision.root;}
if(temp_collision.GetComponent(sc_man)&&temp_collision.GetComponent(sc_man).player){
if(!create){
player=temp_collision;
Create();
}//create_objects
}//player
}//collision
else if(create){create=false;}
*/

/*
if(collider_buy_sc.collision){
if((collider_buy_sc.collision.root.GetComponent(sc_man)&&collider_buy_sc.collision.root.GetComponent(sc_man).player)||
(collider_buy_sc.collision.GetComponent(sc_man)&&collider_buy_sc.collision.GetComponent(sc_man).player)){
if(!input_sc.car_shop.gameObject.active){input_sc.car_shop.gameObject.SetActive(true);}
if(input_sc.car_next){CreateCar(1);}
else if(input_sc.car_previous){CreateCar(-1);}
}//player
}//collision
else if(input_sc.car_shop.gameObject.active){input_sc.car_shop.gameObject.SetActive(false);}
*/

if(create&&player){
var distance : float=Vector3.Distance(create_point.position,player.position);
if(distance<6){

if(!label_price.enabled)label_price.enabled=true;
label_price.text=car.GetComponent(sc_vehicle).price+" $";
if(!input_sc.car_shop.gameObject.active){input_sc.car_shop.gameObject.SetActive(true);}
if(input_sc.car_next){CreateCar(1);}
else if(input_sc.car_previous){CreateCar(-1);}
else if(input_sc.car_buy){CarBuy();}
}//distance
if((distance>6 || player.GetComponent(sc_man).doing=="sit_vehicle")&&input_sc.car_shop.gameObject.active){
if(label_price.enabled)label_price.enabled=false;
price=0;
input_sc.car_shop.gameObject.SetActive(false);}
}//create

}//Update

function OnTriggerEnter (_collision : Collider) {
if(_collision){
var temp_collision : Transform=_collision.transform;
if(temp_collision.root.GetComponent(sc_vehicle)&&temp_collision.root.GetComponent(sc_vehicle).driver&&
temp_collision.root.GetComponent(sc_vehicle).driver.GetComponent(sc_man).player){temp_collision=temp_collision.root.GetComponent(sc_vehicle).driver;}
else if(temp_collision.root.GetComponent(sc_man)){temp_collision=temp_collision.root;}
if(temp_collision.GetComponent(sc_man)&&temp_collision.GetComponent(sc_man).player){
if(!create){
player=temp_collision;
Create();
}//create_objects
}//player
}//collision
else if(create){create=false;}

}//OnTriggerEnter


function Create(){
create=true;
if(!car){car=Instantiate(info_sc.car_shop[num],create_point.position,create_point.rotation);}
}//Create

function CreateCar(_num : int){
if(car){game_sc.vehicle.Remove(car);
Destroy(car.gameObject);}
num+=_num;
if(num>=info_sc.car_shop.Length){num=1;}
else if(num<1){num=info_sc.car_shop.Length-1;}
car=Instantiate(info_sc.car_shop[num],create_point.position,create_point.rotation);
}//Create


function CarBuy(){
if(car&&player_sc.money>=car.GetComponent(sc_vehicle).price){
if(PlayerPrefs.GetInt("car_"+(spawn_car.childCount-1))!=0){
AddHelp(2);
return false;}

for (var i=0;i<spawn_car.childCount;i++)	{
if(PlayerPrefs.GetInt("car_"+i)==num){
AddHelp(3);
break;
return false;
}//num

if(PlayerPrefs.GetInt("car_"+i)==0){
AddHelp(1);
player_sc.MoneyAdd(-car.GetComponent(sc_vehicle).price);
PlayerPrefs.SetInt("car_"+i,num);
break;
return false;
}//car_

}//for


}//price
else {AddHelp(0);}

}//CarBuy



function OnGUI(){
//if(draw_price){
//DrawText(Vector2(Screen.width/2,Screen.height/2),price+"$",gui_style_0);}
if(help){
timer+=Time.deltaTime;
if(timer>=5){timer=0;help=false;}
DrawText(Vector2(Screen.width/2,Screen.height/4),text[game_sc.language].language[help_num],gui_style_0);
}//buy_car
}//OnGUI





function DrawText(_position : Vector2,_text : String,_style : GUIStyle){

GUI.color=Color.black;
GUI.Label(new Rect(_position.x,_position.y, 100, 100),_text,_style);
GUI.color=Color.white;
GUI.Label(new Rect(_position.x+4,_position.y+4, 100, 100),_text,_style);
}//DrawText

function AddHelp(_num : int){
timer=0;
help_num=_num;
help=true;
}//AddHelp
