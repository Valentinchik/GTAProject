
#pragma strict
import UnityEngine;
import System;
import System.Collections;
import System.Collections.Generic;
import UnityEditor;
@CustomEditor(sc_mission)
 class sc_mission_editor extends Editor {
 
 
override function OnInspectorGUI () {
    
EditorGUIUtility.LookLikeControls();
var target_script : sc_mission=target as sc_mission;
GUI.color = Color.white;

EditorGUILayout.Space();
GUILayout.Box("MISSION", GUILayout.MinWidth(253), GUILayout.MaxWidth(1500), GUILayout.Height(20));
target_script.money =  EditorGUILayout.IntField("Money", target_script.money);
//END EVENT
var temp_end_event : ClassNextEvent=new ClassNextEvent();
if(target_script.mission_complete.draw)GUI.color = Color.green;
var startButton_mc : Rect  = EditorGUILayout.BeginHorizontal();
startButton_mc.x = startButton_mc.width / 2 - 200;
startButton_mc.width = 200;
startButton_mc.height = 30;
if (GUI.Button(startButton_mc, "MISSION COMPLETE")) {
if(!target_script.mission_complete.draw){
target_script.mission_complete.draw=true;
target_script.mission_failed.draw=false;}
else target_script.mission_complete.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

GUI.color = Color.white;
if(target_script.mission_failed.draw)GUI.color = Color.green;
var startButton_mf : Rect  = EditorGUILayout.BeginHorizontal();
startButton_mf.x = startButton_mf.width / 2 +20;
startButton_mf.width = 200;
startButton_mf.height = 30;
if (GUI.Button(startButton_mf, "MISSION FAILED")) {
if(!target_script.mission_failed.draw){
target_script.mission_complete.draw=false;
target_script.mission_failed.draw=true;}
else target_script.mission_failed.draw=false;
GUIUtility.ExitGUI();}

EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

if(target_script.mission_complete.draw)temp_end_event=target_script.mission_complete;
else if(target_script.mission_failed.draw)temp_end_event=target_script.mission_failed;

DrawEndEvent(temp_end_event);

//EVENTS
GUI.color = Color.white;
var startButton : Rect  = EditorGUILayout.BeginHorizontal();
startButton.x = startButton.width / 2 - 200;
startButton.width = 200;
startButton.height = 30;
if (GUI.Button(startButton, "ADD EVENT")) {target_script.AddEvent();GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
var startButton1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton1.x = startButton1.width / 2 +20;
startButton1.width = 200;
startButton1.height = 30;
if (GUI.Button(startButton1, "REMOVE EVENT")) {target_script.RemoveEvent();GUIUtility.ExitGUI();}

EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

EditorGUILayout.Space();
GUILayout.Box("EVENTS", GUILayout.MinWidth(253), GUILayout.MaxWidth(1500), GUILayout.Height(20));

for (var i=0;i<target_script.event.Count;i++)	{
var temp_event : ClassMission=target_script.event[i];
target_script.editor_event=temp_event;
temp_event=target_script.editor_event;

GUI.color = Color.cyan;
if(temp_event.draw)GUI.color = Color.blue;
var startButton2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton2.x = startButton2.width / 2 - 230;
startButton2.width = 480;
startButton2.height = 40;
if (GUI.Button(startButton2, i+" EVENT")) {
if(!temp_event.draw)temp_event.draw=true;
else temp_event.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
GUI.color = Color.blue;
if(temp_event.draw){
GUILayout.Box( "=================================", GUILayout.MinWidth(253), GUILayout.MaxWidth(1500), GUILayout.Height(20));
GUI.color = Color.white;

temp_event.draw_text= EditorGUILayout.Toggle("DrawText",temp_event.draw_text);	
if(temp_event.draw_text){
temp_event.text[1]= EditorGUILayout.TextField( "TextEng",temp_event.text[1]);
temp_event.text[0]= EditorGUILayout.TextField( "TextRus",temp_event.text[0]);
}//temp_event.draw_text
if(temp_event.draw_create)GUI.color = Color.green;
var startButton3 : Rect  = EditorGUILayout.BeginHorizontal();
startButton3.x = startButton3.width / 2 - 200;
startButton3.width = 140;
startButton3.height = 30;
if (GUI.Button(startButton3, " CREATE")) {
if(!temp_event.draw_create){
temp_event.draw_create=true;
temp_event.draw_edit=false;
temp_event.draw_end_event=false;}
else temp_event.draw_create=false;
GUIUtility.ExitGUI();}

EditorGUILayout.EndHorizontal();
GUI.color = Color.white;
if(temp_event.draw_edit)GUI.color = Color.green;
var startButton3_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton3_1.x = startButton3_1.width / 2 - 60;
startButton3_1.width = 140;
startButton3_1.height = 30;
if (GUI.Button(startButton3_1, " EDIT")) {
if(!temp_event.draw_edit){
temp_event.draw_create=false;
temp_event.draw_edit=true;
temp_event.draw_end_event=false;}
else temp_event.draw_edit=false;
GUIUtility.ExitGUI();}

EditorGUILayout.EndHorizontal();
GUI.color = Color.white;
if(temp_event.draw_end_event)GUI.color = Color.green;
var startButton3_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton3_2.x = startButton3_2.width / 2 +80;
startButton3_2.width = 140;
startButton3_2.height = 30;
if (GUI.Button(startButton3_2, " END EVENT")) {
if(!temp_event.draw_end_event){
temp_event.draw_create=false;
temp_event.draw_edit=false;
temp_event.draw_end_event=true;}
else temp_event.draw_end_event=false;
GUIUtility.ExitGUI();}


EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

GUI.color = Color.white;
var temp_text : String="";
if(temp_event.draw_create)temp_text= "CREATE";
else if(temp_event.draw_edit)temp_text= "EDIT";
else if(temp_event.draw_end_event)temp_text= "END EVENT";
GUILayout.Box(temp_text, GUILayout.MinWidth(253), GUILayout.MaxWidth(1500), GUILayout.Height(20));


//CREATE
GUI.color = Color.white;
if(temp_event.draw_create){
GUI.color = Color.white;
if(temp_event.create.car_draw)GUI.color = Color.green;
var startButton4 : Rect  = EditorGUILayout.BeginHorizontal();
startButton4.x = startButton4.width / 2 - 200;
startButton4.width = 140;
startButton4.height = 30;
if (GUI.Button(startButton4, "CAR")) {
if(!temp_event.create.car_draw){
temp_event.create.car_draw=true;
temp_event.create.man_draw=false;
temp_event.create.object_draw=false;}
else temp_event.create.car_draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
GUI.color = Color.white;
if(temp_event.create.man_draw)GUI.color = Color.green;
var startButton4_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton4_1.x = startButton4_1.width / 2 - 60;
startButton4_1.width = 140;
startButton4_1.height = 30;
if (GUI.Button(startButton4_1, "MAN")) {
if(!temp_event.create.man_draw){
temp_event.create.man_draw=true;
temp_event.create.car_draw=false;
temp_event.create.object_draw=false;}
else temp_event.create.man_draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
GUI.color = Color.white;
if(temp_event.create.object_draw)GUI.color = Color.green;
var startButton4_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton4_2.x = startButton4_2.width / 2 +80;
startButton4_2.width = 140;
startButton4_2.height = 30;
if (GUI.Button(startButton4_2, "OBJECT")) {
if(!temp_event.create.object_draw){
temp_event.create.object_draw=true;
temp_event.create.man_draw=false;
temp_event.create.car_draw=false;}
else temp_event.create.object_draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

GUI.color = Color.white;
var temp_text1 : String="";
if(temp_event.create.car_draw)temp_text1= "CAR";
else if(temp_event.create.man_draw)temp_text1= "MAN";
else if(temp_event.create.object_draw)temp_text1= "OBJECT";
GUILayout.Box(temp_text1, GUILayout.MinWidth(253), GUILayout.MaxWidth(1500), GUILayout.Height(20));

//CAR
if(temp_event.create.car_draw){
var startButton5 : Rect  = EditorGUILayout.BeginHorizontal();
startButton5.x = startButton5.width / 2 - 150;
startButton5.width = 150;
startButton5.height = 30;
if (GUI.Button(startButton5, "ADD CAR")) {target_script.AddCar(temp_event.create);GUIUtility.ExitGUI();}

EditorGUILayout.EndHorizontal();
var startButton6 : Rect  = EditorGUILayout.BeginHorizontal();
startButton6.x = startButton6.width / 2 +20;
startButton6.width = 150;
startButton6.height = 30;
if (GUI.Button(startButton6, "REMOVE CAR")) {target_script.RemoveCar(temp_event.create);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

for (var i1=0;i1<temp_event.create.create_car.Count;i1++)	{
var temp_car : ClassCarCreate=temp_event.create.create_car[i1];

GUI.color = Color.white;
if(temp_car.draw)GUI.color = Color.green;
var startButton7 : Rect  = EditorGUILayout.BeginHorizontal();
startButton7.x = startButton7.width / 2 -100;
startButton7.width = 200;
startButton7.height = 30;
if (GUI.Button(startButton7, i1+" CAR")) {
if(!temp_car.draw)temp_car.draw=true;
else temp_car.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

GUI.color = Color.white;
if(temp_car.draw){
EditorGUILayout.Space();
temp_car.car =EditorGUILayout.ObjectField("Car", temp_car.car , typeof(Transform), true);
temp_car.point =EditorGUILayout.ObjectField("Point", temp_car.point , typeof(Transform), true);
temp_car.minimap_icon = EditorGUILayout.EnumPopup("MinimapIcon", temp_car.minimap_icon );
temp_car.health_bar= EditorGUILayout.Toggle("HealthBar",temp_car.health_bar);
temp_car.racer= EditorGUILayout.Toggle("Racer",temp_car.racer);
//EditorGUILayout.Separator();
EditorGUILayout.BeginHorizontal();
temp_car.health =  EditorGUILayout.IntField("Health", temp_car.health);
EditorGUILayout.EndHorizontal();
}//draw

}//for
}//car_draw


//MAN
if(temp_event.create.man_draw){
GUI.color = Color.white;
var startButton5_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton5_1.x = startButton5_1.width / 2 - 150;
startButton5_1.width = 150;
startButton5_1.height = 30;
if (GUI.Button(startButton5_1, "ADD MAN")) {target_script.AddMan(temp_event.create);GUIUtility.ExitGUI();}

EditorGUILayout.EndHorizontal();
var startButton6_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton6_1.x = startButton6_1.width / 2 +20;
startButton6_1.width = 150;
startButton6_1.height = 30;
if (GUI.Button(startButton6_1, "REMOVE MAN")) {target_script.RemoveMan(temp_event.create);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

for (var i2=0;i2<temp_event.create.create_man.Count;i2++)	{
var temp_man : ClassManCreate=temp_event.create.create_man[i2];

GUI.color = Color.white;
if(temp_man.draw)GUI.color = Color.green;
var startButton7_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton7_1.x = startButton7_1.width / 2 -100;
startButton7_1.width = 200;
startButton7_1.height = 30;
if (GUI.Button(startButton7_1, i2+" MAN")) {
if(!temp_man.draw)temp_man.draw=true;
else temp_man.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

GUI.color = Color.white;
if(temp_man.draw){
EditorGUILayout.Space();
temp_man.man =EditorGUILayout.ObjectField("Man", temp_man.man , typeof(Transform), true);
temp_man.point =EditorGUILayout.ObjectField("Point", temp_man.point , typeof(Transform), true);
temp_man.minimap_icon = EditorGUILayout.EnumPopup("MinimapIcon", temp_man.minimap_icon );
temp_man.weapon = EditorGUILayout.EnumPopup("Weapon", temp_man.weapon );
//EditorGUILayout.Separator();
EditorGUILayout.BeginHorizontal();
temp_man.health =  EditorGUILayout.IntField("Health", temp_man.health);
EditorGUILayout.EndHorizontal();
}//draw

}//for
}//man_draw

//OBJECT
if(temp_event.create.object_draw){
GUI.color = Color.white;
var startButton5_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton5_2.x = startButton5_2.width / 2 - 150;
startButton5_2.width = 150;
startButton5_2.height = 30;
if (GUI.Button(startButton5_2, "ADD OBJECT")) {target_script.AddObject(temp_event.create);GUIUtility.ExitGUI();}

EditorGUILayout.EndHorizontal();
var startButton6_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton6_2.x = startButton6_2.width / 2 +20;
startButton6_2.width = 150;
startButton6_2.height = 30;
if (GUI.Button(startButton6_2, "REMOVE OBJECT")) {target_script.RemoveObject(temp_event.create);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

for (var i3=0;i3<temp_event.create.create_object.Count;i3++)	{
var temp_object : ClassObjectCreate=temp_event.create.create_object[i3];

GUI.color = Color.white;
if(temp_object.draw)GUI.color = Color.green;
var startButton7_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton7_2.x = startButton7_2.width / 2 -100;
startButton7_2.width = 200;
startButton7_2.height = 30;
if (GUI.Button(startButton7_2, i3+" OBJECT")) {
if(!temp_object.draw)temp_object.draw=true;
else temp_object.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

GUI.color = Color.white;
if(temp_object.draw){
EditorGUILayout.Space();
temp_object.object =EditorGUILayout.ObjectField("Object", temp_object.object , typeof(Transform), true);
temp_object.point =EditorGUILayout.ObjectField("Point", temp_object.point , typeof(Transform), true);
temp_object.minimap_icon = EditorGUILayout.EnumPopup("MinimapIcon", temp_object.minimap_icon );

}//draw

}//for
}//object_draw



}//draw



//EDIT
GUI.color = Color.white;
if(temp_event.draw_edit){
GUI.color = Color.white;
if(temp_event.edit.car_draw)GUI.color = Color.green;
var startButton4_3 : Rect  = EditorGUILayout.BeginHorizontal();
startButton4_3.x = startButton4_3.width / 2 - 200;
startButton4_3.width = 84;
startButton4_3.height = 30;
if (GUI.Button(startButton4_3, "CAR")) {
if(!temp_event.edit.car_draw){
temp_event.edit.car_draw=true;
temp_event.edit.man_draw=false;
temp_event.edit.object_draw=false;
temp_event.edit.player_draw=false;
temp_event.edit.point_draw=false;}
else temp_event.edit.car_draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

GUI.color = Color.white;
if(temp_event.edit.man_draw)GUI.color = Color.green;
var startButton4_4 : Rect  = EditorGUILayout.BeginHorizontal();
startButton4_4.x = startButton4_4.width / 2 - 116;
startButton4_4.width = 84;
startButton4_4.height = 30;
if (GUI.Button(startButton4_4, "MAN")) {
if(!temp_event.edit.man_draw){
temp_event.edit.man_draw=true;
temp_event.edit.car_draw=false;
temp_event.edit.object_draw=false;
temp_event.edit.player_draw=false;
temp_event.edit.point_draw=false;}
else temp_event.edit.man_draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

GUI.color = Color.white;
if(temp_event.edit.object_draw)GUI.color = Color.green;
var startButton4_5 : Rect  = EditorGUILayout.BeginHorizontal();
startButton4_5.x = startButton4_5.width / 2 -32;
startButton4_5.width = 84;
startButton4_5.height = 30;
if (GUI.Button(startButton4_5, "OBJECT")) {
if(!temp_event.edit.object_draw){
temp_event.edit.object_draw=true;
temp_event.edit.man_draw=false;
temp_event.edit.car_draw=false;
temp_event.edit.player_draw=false;
temp_event.edit.point_draw=false;}
else temp_event.edit.object_draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

GUI.color = Color.white;
if(temp_event.edit.player_draw)GUI.color = Color.green;
var startButton4_6 : Rect  = EditorGUILayout.BeginHorizontal();
startButton4_6.x = startButton4_6.width / 2 +52;
startButton4_6.width = 84;
startButton4_6.height = 30;
if (GUI.Button(startButton4_6, "PLAYER")) {
if(!temp_event.edit.player_draw){
temp_event.edit.player_draw=true;
temp_event.edit.object_draw=false;
temp_event.edit.man_draw=false;
temp_event.edit.car_draw=false;
temp_event.edit.point_draw=false;}
else temp_event.edit.player_draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

GUI.color = Color.white;
if(temp_event.edit.point_draw)GUI.color = Color.green;
var startButton4_6_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton4_6_1.x = startButton4_6_1.width / 2 +136;
startButton4_6_1.width = 84;
startButton4_6_1.height = 30;
if (GUI.Button(startButton4_6_1, "POINT")) {
if(!temp_event.edit.point_draw){
temp_event.edit.player_draw=false;
temp_event.edit.object_draw=false;
temp_event.edit.man_draw=false;
temp_event.edit.car_draw=false;
temp_event.edit.point_draw=true;}
else temp_event.edit.point_draw=false;
GUIUtility.ExitGUI();}

EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

GUI.color = Color.white;
var temp_text2 : String="";
if(temp_event.edit.car_draw)temp_text2= "CAR";
else if(temp_event.edit.man_draw)temp_text2= "MAN";
else if(temp_event.edit.object_draw)temp_text2= "OBJECT";
else if(temp_event.edit.player_draw)temp_text2= "PLAYER";
else if(temp_event.edit.point_draw)temp_text2= "POINT";
GUILayout.Box(temp_text2, GUILayout.MinWidth(253), GUILayout.MaxWidth(1500), GUILayout.Height(20));

//EDIT CAR
if(temp_event.edit.car_draw){
var startButton5_3 : Rect  = EditorGUILayout.BeginHorizontal();
startButton5_3.x = startButton5_3.width / 2 - 150;
startButton5_3.width = 150;
startButton5_3.height = 30;
if (GUI.Button(startButton5_3, "ADD CAR")) {target_script.AddEditCar(temp_event.edit);GUIUtility.ExitGUI();}

EditorGUILayout.EndHorizontal();
var startButton5_4 : Rect  = EditorGUILayout.BeginHorizontal();
startButton5_4.x = startButton5_4.width / 2 +20;
startButton5_4.width = 150;
startButton5_4.height = 30;
if (GUI.Button(startButton5_4, "REMOVE CAR")) {target_script.RemoveEditCar(temp_event.edit);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

for (var i4=0;i4<temp_event.edit.car.Count;i4++)	{
var temp_car1 : ClassCarEdit=temp_event.edit.car[i4];

GUI.color = Color.white;
if(temp_car1.draw)GUI.color = Color.green;
var startButton5_5 : Rect  = EditorGUILayout.BeginHorizontal();
startButton5_5.x = startButton5_5.width / 2 -100;
startButton5_5.width = 200;
startButton5_5.height = 30;
if (GUI.Button(startButton5_5, i4+" CAR")) {
if(!temp_car1.draw)temp_car1.draw=true;
else temp_car1.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

GUI.color = Color.white;
if(temp_car1.draw){
temp_car1.other_event= EditorGUILayout.Toggle("OtherEvent",temp_car1.other_event);	
if(temp_car1.other_event)temp_car1.event =  EditorGUILayout.IntField("Event", temp_car1.event);
temp_car1.car =  EditorGUILayout.IntField("Car", temp_car1.car);
temp_car1.set_position =EditorGUILayout.ObjectField("SetPosition", temp_car1.set_position , typeof(Transform), true);
temp_car1.minimap_icon = EditorGUILayout.EnumPopup("MinimapIcon", temp_car1.minimap_icon );
temp_car1.delete_minimap_icon= EditorGUILayout.Toggle("DeleteMinimapIcon",temp_car1.delete_minimap_icon);	
temp_car1.health =  EditorGUILayout.IntField("Health", temp_car1.health);
temp_car1.damage =  EditorGUILayout.IntField("Damage", temp_car1.damage);
temp_car1.engine_start= EditorGUILayout.Toggle("EngineStart",temp_car1.engine_start);
temp_car1.health_bar= EditorGUILayout.Toggle("HealthBar",temp_car1.health_bar);	
temp_car1.go_to_target= EditorGUILayout.Toggle("GoToTarget",temp_car1.go_to_target);
if(temp_car1.go_to_target){
temp_car1.stop_on_target= EditorGUILayout.Toggle("StopOnTarget",temp_car1.stop_on_target);
temp_car1.target_point =EditorGUILayout.ObjectField("TargetPoint", temp_car1.target_point , typeof(Transform), true);}
}//draw

}//for
}//CAR

//EDIT MAN
if(temp_event.edit.man_draw){
var startButton8 : Rect  = EditorGUILayout.BeginHorizontal();
startButton8.x = startButton8.width / 2 - 150;
startButton8.width = 150;
startButton8.height = 30;
if (GUI.Button(startButton8, "ADD MAN")) {target_script.AddEditMan(temp_event.edit);GUIUtility.ExitGUI();}

EditorGUILayout.EndHorizontal();
var startButton8_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton8_1.x = startButton8_1.width / 2 +20;
startButton8_1.width = 150;
startButton8_1.height = 30;
if (GUI.Button(startButton8_1, "REMOVE MAN")) {target_script.RemoveEditMan(temp_event.edit);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

for (var i5=0;i5<temp_event.edit.man.Count;i5++)	{
var temp_man1 : ClassManEdit=temp_event.edit.man[i5];

GUI.color = Color.white;
if(temp_man1.draw)GUI.color = Color.green;
var startButton8_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton8_2.x = startButton8_2.width / 2 -100;
startButton8_2.width = 200;
startButton8_2.height = 30;
if (GUI.Button(startButton8_2, i5+" MAN")) {
if(!temp_man1.draw)temp_man1.draw=true;
else temp_man1.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

GUI.color = Color.white;
if(temp_man1.draw){
temp_man1.other_event= EditorGUILayout.Toggle("OtherEvent",temp_man1.other_event);	
if(temp_man1.other_event)temp_man1.event =  EditorGUILayout.IntField("Event", temp_man1.event);
temp_man1.man =  EditorGUILayout.IntField("Man", temp_man1.man);
temp_man1.set_position =EditorGUILayout.ObjectField("SetPosition", temp_man1.set_position , typeof(Transform), true);
temp_man1.minimap_icon = EditorGUILayout.EnumPopup("MinimapIcon", temp_man1.minimap_icon );
temp_man1.delete_minimap_icon= EditorGUILayout.Toggle("DeleteMinimapIcon",temp_man1.delete_minimap_icon);	
temp_man1.weapon = EditorGUILayout.EnumPopup("Weapon", temp_man1.weapon );
temp_man1.team =  EditorGUILayout.IntField("Team", temp_man1.team);
temp_man1.health =  EditorGUILayout.IntField("Health", temp_man1.health);
temp_man1.damage =  EditorGUILayout.IntField("Damage", temp_man1.damage);

//temp_man1.AI =  EditorGUILayout.Toggle("AI", temp_man1.AI);
temp_man1.player_boss =  EditorGUILayout.Toggle("GoToPlayer", temp_man1.player_boss);
temp_man1.player_is_enemy =  EditorGUILayout.Toggle("PlayerIsEnemy", temp_man1.player_is_enemy);
temp_man1.get_out_car =  EditorGUILayout.Toggle("GetOutCar", temp_man1.get_out_car);
temp_man1.go_to_target =  EditorGUILayout.Toggle("GoToTarget", temp_man1.go_to_target);
if(temp_man1.go_to_target){
temp_man1.target_point =EditorGUILayout.ObjectField("Target", temp_man1.target_point , typeof(Transform), true);
temp_man1.run =  EditorGUILayout.Toggle("Run", temp_man1.run);}
//SIT CAR
GUI.color = Color.white;
if(temp_man1.sit_car .draw)GUI.color = Color.green;
var startButton11 : Rect  = EditorGUILayout.BeginHorizontal();
startButton11.x = startButton11.width / 2 -250;
startButton11.width = 100;
startButton11.height = 20;
if (GUI.Button(startButton11, "sit car")) {
if(!temp_man1.sit_car .draw)temp_man1.sit_car .draw=true;
else temp_man1.sit_car .draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
if(temp_man1.sit_car .draw){
temp_man1.sit_car.sit_car= EditorGUILayout.Toggle("Activate",temp_man1.sit_car.sit_car);	
temp_man1.sit_car.other_event= EditorGUILayout.Toggle("OtherEvent",temp_man1.sit_car.other_event);	
if(temp_man1.sit_car.other_event)temp_man1.sit_car.event =  EditorGUILayout.IntField("Event", temp_man1.sit_car.event);
temp_man1.sit_car.car =  EditorGUILayout.IntField("Car", temp_man1.sit_car.car);
temp_man1.sit_car.place =  EditorGUILayout.IntField("Place", temp_man1.sit_car.place);
temp_man1.sit_car.engine_start= EditorGUILayout.Toggle("EngineStart",temp_man1.sit_car.engine_start);	
temp_man1.sit_car.racer= EditorGUILayout.Toggle("Racer",temp_man1.sit_car.racer);	

GUI.color = Color.white;
}//sit_car

//GO TO CAR
GUI.color = Color.white;
if(temp_man1.go_to_car .draw)GUI.color = Color.green;
var startButton11_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton11_1.x = startButton11_1.width / 2 -250;
startButton11_1.width = 100;
startButton11_1.height = 20;
if (GUI.Button(startButton11_1, "go to car")) {
if(!temp_man1.go_to_car .draw)temp_man1.go_to_car .draw=true;
else temp_man1.go_to_car .draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
if(temp_man1.go_to_car .draw){
temp_man1.go_to_car.sit_car= EditorGUILayout.Toggle("Activate",temp_man1.go_to_car.sit_car);	
temp_man1.go_to_car.other_event= EditorGUILayout.Toggle("OtherEvent",temp_man1.go_to_car.other_event);	
if(temp_man1.go_to_car.other_event)temp_man1.go_to_car.event =  EditorGUILayout.IntField("Event", temp_man1.go_to_car.event);
temp_man1.go_to_car.car =  EditorGUILayout.IntField("Car", temp_man1.go_to_car.car);
temp_man1.go_to_car.set_place= EditorGUILayout.Toggle("SetPlace",temp_man1.go_to_car.set_place);	
if(temp_man1.go_to_car.set_place)temp_man1.go_to_car.place =  EditorGUILayout.IntField("Place", temp_man1.go_to_car.place);
temp_man1.go_to_car.engine_start= EditorGUILayout.Toggle("EngineStart",temp_man1.go_to_car.engine_start);	
temp_man1.go_to_car.racer= EditorGUILayout.Toggle("Racer",temp_man1.go_to_car.racer);	

GUI.color = Color.white;
}//sit_car

}//draw

}//for
}//MAN

//EDIT OBJECT
if(temp_event.edit.object_draw){
var startButton9 : Rect  = EditorGUILayout.BeginHorizontal();
startButton9.x = startButton9.width / 2 - 150;
startButton9.width = 150;
startButton9.height = 30;
if (GUI.Button(startButton9, "ADD OBJECT")) {target_script.AddEditObject(temp_event.edit);GUIUtility.ExitGUI();}

EditorGUILayout.EndHorizontal();
var startButton9_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton9_1.x = startButton9_1.width / 2 +20;
startButton9_1.width = 150;
startButton9_1.height = 30;
if (GUI.Button(startButton9_1, "REMOVE OBJECT")) {target_script.RemoveEditObject(temp_event.edit);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

for (var i6=0;i6<temp_event.edit.object.Count;i6++)	{
var temp_object1 : ClassObjectEdit=temp_event.edit.object[i6];

GUI.color = Color.white;
if(temp_object1.draw)GUI.color = Color.green;
var startButton9_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton9_2.x = startButton9_2.width / 2 -100;
startButton9_2.width = 200;
startButton9_2.height = 30;
if (GUI.Button(startButton9_2, i6+" OBJECT")) {
if(!temp_object1.draw)temp_object1.draw=true;
else temp_object1.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

GUI.color = Color.white;
if(temp_object1.draw){
temp_object1.other_event= EditorGUILayout.Toggle("OtherEvent",temp_object1.other_event);	
if(temp_object1.other_event)temp_object1.event =  EditorGUILayout.IntField("Event", temp_object1.event);
temp_object1.object =  EditorGUILayout.IntField("Object", temp_object1.object);
temp_object1.set_position =EditorGUILayout.ObjectField("SetPosition", temp_object1.set_position , typeof(Transform), true);
temp_object1.minimap_icon = EditorGUILayout.EnumPopup("MinimapIcon", temp_object1.minimap_icon );
temp_object1.delete_minimap_icon= EditorGUILayout.Toggle("DeleteMinimapIcon",temp_object1.delete_minimap_icon);	
temp_object1.destroy= EditorGUILayout.Toggle("Destroy",temp_object1.destroy);	
}//draw

}//for
}//OBJECT

//EDIT PLAYER
if(temp_event.edit.player_draw){
GUI.color = Color.white;
temp_event.edit.player.set_position =EditorGUILayout.ObjectField("SetPosition", temp_event.edit.player.set_position , typeof(Transform), true);
temp_event.edit.player.team =  EditorGUILayout.IntField("Team", temp_event.edit.player.team);
temp_event.edit.player.police= EditorGUILayout.Toggle("Wanted",temp_event.edit.player.police);	
temp_event.edit.player.add_star =  EditorGUILayout.IntField("AddStars", temp_event.edit.player.add_star);
temp_event.edit.player.damage =  EditorGUILayout.IntField("Damage", temp_event.edit.player.damage);
}//PLAYER

//EDIT POINT
if(temp_event.edit.point_draw){
GUI.color = Color.white;
temp_event.edit.point.point =EditorGUILayout.ObjectField("Point", temp_event.edit.point.point , typeof(Transform), true);
temp_event.edit.point.set_position =EditorGUILayout.ObjectField("SetPosition", temp_event.edit.point.set_position , typeof(Transform), true);
temp_event.edit.point.minimap_icon = EditorGUILayout.EnumPopup("MinimapIcon", temp_event.edit.point.minimap_icon );
temp_event.edit.point.delete_minimap_icon= EditorGUILayout.Toggle("DeleteMiniMapIcon",temp_event.edit.point.delete_minimap_icon);	
}//POINT

}//EDIT


//END EVENT
GUI.color = Color.white;
if(temp_event.draw_end_event){
var temp_next_event : ClassNextEvent=new ClassNextEvent();
if(temp_event.next_event.draw)GUI.color = Color.green;
var startButton10 : Rect  = EditorGUILayout.BeginHorizontal();
startButton10.x = startButton10.width / 2 - 200;
startButton10.width = 140;
startButton10.height = 30;
if (GUI.Button(startButton10, "NEXT EVENT")) {
if(!temp_event.next_event.draw){
temp_event.next_event.draw=true;
temp_event.mission_complete.draw=false;
temp_event.mission_failed.draw=false;}
else temp_event.next_event.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
GUI.color = Color.white;
if(temp_event.mission_complete.draw)GUI.color = Color.green;
var startButton10_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton10_1.x = startButton10_1.width / 2 - 60;
startButton10_1.width = 140;
startButton10_1.height = 30;
if (GUI.Button(startButton10_1, "MISSION COMPLETE")) {
if(!temp_event.mission_complete.draw){
temp_event.next_event.draw=false;
temp_event.mission_complete.draw=true;
temp_event.mission_failed.draw=false;}
else temp_event.mission_complete.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
GUI.color = Color.white;
if(temp_event.mission_failed.draw)GUI.color = Color.green;
var startButton10_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton10_2.x = startButton10_2.width / 2 +80;
startButton10_2.width = 140;
startButton10_2.height = 30;
if (GUI.Button(startButton10_2, "MISSION FAILED")) {
if(!temp_event.mission_failed.draw){
temp_event.next_event.draw=false;
temp_event.mission_complete.draw=false;
temp_event.mission_failed.draw=true;}
else temp_event.mission_failed.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();


if(temp_event.next_event.draw)temp_next_event=temp_event.next_event;
else if(temp_event.mission_complete.draw)temp_next_event=temp_event.mission_complete;
else if(temp_event.mission_failed.draw)temp_next_event=temp_event.mission_failed;

DrawEndEvent(temp_next_event);

/*
//mission_complete
if(temp_event.mission_complete.draw){
GUI.color = Color.white;
temp_event.mission_complete.activate= EditorGUILayout.Toggle("Activate",temp_event.mission_complete.activate);	
temp_event.mission_complete.next_event= EditorGUILayout.Toggle("NextEvent",temp_event.mission_complete.next_event);	
temp_event.mission_complete.timer =  EditorGUILayout.IntField("Timer", temp_event.mission_complete.timer);

}//next_event

//mission_failed
if(temp_event.mission_failed.draw){
GUI.color = Color.white;
temp_event.mission_failed.activate= EditorGUILayout.Toggle("Activate",temp_event.mission_failed.activate);	
temp_event.mission_failed.next_event= EditorGUILayout.Toggle("NextEvent",temp_event.mission_failed.next_event);	
temp_event.mission_failed.timer =  EditorGUILayout.IntField("Timer", temp_event.mission_failed.timer);

}//next_event
*/
}//END EVENT

EditorGUILayout.Space();
GUI.color = Color.blue;
GUILayout.Box("=================================", GUILayout.MinWidth(253), GUILayout.MaxWidth(1500), GUILayout.Height(20));

}//draw
}//for
}//OnInspectorGUI


function OnSceneGUI(){

}//OnSceneGUI   

function DrawEndEvent(temp_next_event : ClassNextEvent){
var target_script : sc_mission=target as sc_mission;
//next_event
if(temp_next_event.draw){
GUI.color = Color.white;
temp_next_event.activate= EditorGUILayout.Toggle("Activate",temp_next_event.activate);	
temp_next_event.next_event= EditorGUILayout.Toggle("NextEvent",temp_next_event.next_event);	
temp_next_event.timer =  EditorGUILayout.IntField("Timer", temp_next_event.timer);
temp_next_event.draw_timer= EditorGUILayout.Toggle("DrawTimer",temp_next_event.draw_timer);	
//car death
GUI.color = Color.white;
if(temp_next_event.draw_car_death)GUI.color = Color.green;
var startButton15 : Rect  = EditorGUILayout.BeginHorizontal();
startButton15.x = startButton15.width / 2 -250;
startButton15.width = 100;
startButton15.height = 20;
if (GUI.Button(startButton15, "car death")) {
if(!temp_next_event.draw_car_death){
temp_next_event.draw_car_death=true;}
else temp_next_event.draw_car_death=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

if(temp_next_event.draw_car_death){
temp_next_event.only_one_car_condition= EditorGUILayout.Toggle("OnlyOneCondition",temp_next_event.only_one_car_condition);	
var startButton15_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton15_1.x = startButton15_1.width / 2 -250;
startButton15_1.width = 30;
startButton15_1.height = 15;
if (GUI.Button(startButton15_1, "+")) {target_script.AddDeathObject(temp_next_event.car_death);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

var startButton15_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton15_2.x = startButton15_2.width / 2 -220;
startButton15_2.width = 30;
startButton15_2.height = 15;
if (GUI.Button(startButton15_2, "-")) {target_script.RemoveDeathObject(temp_next_event.car_death);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

for (var y=0;y<temp_next_event.car_death.Count;y++)	{
var temp_dath : ClassEventDeath=temp_next_event.car_death[y];
EditorGUILayout.Separator();
var startButton15_3 : Rect  = EditorGUILayout.BeginHorizontal();
startButton15_3.x = startButton15_3.width / 2 -250;
startButton15_3.width = 60;
startButton15_3.height = 15;
if (GUI.Button(startButton15_3, y+" car")) {if(!temp_dath.draw){temp_dath.draw=true;}else temp_dath.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
if(temp_dath.draw){
//temp_dath.activate= EditorGUILayout.Toggle("Activate",temp_dath.activate);	
temp_dath.other_event= EditorGUILayout.Toggle("OtherEvent",temp_dath.other_event);	
if(temp_dath.other_event)
temp_dath.event =  EditorGUILayout.IntField("Event", temp_dath.event);
temp_dath.object =  EditorGUILayout.IntField("Car", temp_dath.object);
}//draw
}//for

EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
}//draw_car_death

//man death
GUI.color = Color.white;
if(temp_next_event.draw_man_death)GUI.color = Color.green;
var startButton16 : Rect  = EditorGUILayout.BeginHorizontal();
startButton16.x = startButton16.width / 2 -250;
startButton16.width = 100;
startButton16.height = 20;
if (GUI.Button(startButton16, "man death")) {
if(!temp_next_event.draw_man_death){
temp_next_event.draw_man_death=true;}
else temp_next_event.draw_man_death=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();


if(temp_next_event.draw_man_death){
temp_next_event.only_one_man_condition= EditorGUILayout.Toggle("OnlyOneCondition",temp_next_event.only_one_man_condition);	
var startButton15_4 : Rect  = EditorGUILayout.BeginHorizontal();
startButton15_4.x = startButton15_4.width / 2 -250;
startButton15_4.width = 30;
startButton15_4.height = 15;
if (GUI.Button(startButton15_4, "+")) {target_script.AddDeathObject(temp_next_event.man_death);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

var startButton15_5 : Rect  = EditorGUILayout.BeginHorizontal();
startButton15_5.x = startButton15_5.width / 2 -220;
startButton15_5.width = 30;
startButton15_5.height = 15;
if (GUI.Button(startButton15_5, "-")) {target_script.RemoveDeathObject(temp_next_event.man_death);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

for (var y1=0;y1<temp_next_event.man_death.Count;y1++)	{
var temp_dath1 : ClassEventDeath=temp_next_event.man_death[y1];
EditorGUILayout.Separator();
var startButton15_6 : Rect  = EditorGUILayout.BeginHorizontal();
startButton15_6.x = startButton15_6.width / 2 -250;
startButton15_6.width = 60;
startButton15_6.height = 15;
if (GUI.Button(startButton15_6, y1+" man")) {if(!temp_dath1.draw){temp_dath1.draw=true;}else temp_dath1.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
if(temp_dath1.draw){
//temp_dath1.activate= EditorGUILayout.Toggle("Activate",temp_dath1.activate);	
temp_dath1.other_event= EditorGUILayout.Toggle("OtherEvent",temp_dath1.other_event);	
if(temp_dath1.other_event)
temp_dath1.event =  EditorGUILayout.IntField("Event", temp_dath1.event);
temp_dath1.object =  EditorGUILayout.IntField("Man", temp_dath1.object);
}//draw
}//for

EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
}//draw_car_death

//sit_car
GUI.color = Color.white;
if(temp_next_event.sit_car.draw)GUI.color = Color.green;
var startButton17 : Rect  = EditorGUILayout.BeginHorizontal();
startButton17.x = startButton17.width / 2 -250;
startButton17.width = 100;
startButton17.height = 20;
if (GUI.Button(startButton17, "sit car")) {
if(!temp_next_event.sit_car.draw){
temp_next_event.sit_car.draw=true;}
else temp_next_event.sit_car.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();


if(temp_next_event.sit_car.draw){
//player
temp_next_event.sit_car.only_one_condition= EditorGUILayout.Toggle("OnlyOneCondition",temp_next_event.sit_car.only_one_condition);	
var startButton17_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton17_1.x = startButton17_1.width / 2 -230;
startButton17_1.width = 100;
startButton17_1.height = 16;
if (GUI.Button(startButton17_1, "player")) {
if(!temp_next_event.sit_car.draw_player){
temp_next_event.sit_car.draw_player=true;}
else temp_next_event.sit_car.draw_player=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

if(temp_next_event.sit_car.draw_player){
temp_next_event.sit_car.player_activate= EditorGUILayout.Toggle("Activate",temp_next_event.sit_car.player_activate);
if(!temp_next_event.sit_car.player_out_car)temp_next_event.sit_car.player_sit_car= EditorGUILayout.Toggle("SitCar",temp_next_event.sit_car.player_sit_car);
if(!temp_next_event.sit_car.player_sit_car)temp_next_event.sit_car.player_out_car= EditorGUILayout.Toggle("OutCar",temp_next_event.sit_car.player_out_car);	
temp_next_event.sit_car.other_event= EditorGUILayout.Toggle("OtherEvent",temp_next_event.sit_car.other_event);	
if(temp_next_event.sit_car.other_event)
temp_next_event.sit_car.event =  EditorGUILayout.IntField("Event", temp_next_event.sit_car.event);
temp_next_event.sit_car.car =  EditorGUILayout.IntField("Car", temp_next_event.sit_car.car);

}//draw_player

//man
var startButton17_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton17_2.x = startButton17_2.width / 2 -230;
startButton17_2.width = 100;
startButton17_2.height = 16;
if (GUI.Button(startButton17_2, "man")) {
if(!temp_next_event.sit_car.draw_man){
temp_next_event.sit_car.draw_man=true;}
else temp_next_event.sit_car.draw_man=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

if(temp_next_event.sit_car.draw_man){
var startButton17_3 : Rect  = EditorGUILayout.BeginHorizontal();
startButton17_3.x = startButton17_3.width / 2 -210;
startButton17_3.width = 30;
startButton17_3.height = 15;
if (GUI.Button(startButton17_3, "+")) {target_script.AddSitCar(temp_next_event.sit_car.man_sit_car);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

var startButton17_4 : Rect  = EditorGUILayout.BeginHorizontal();
startButton17_4.x = startButton17_4.width / 2 -180;
startButton17_4.width = 30;
startButton17_4.height = 15;
if (GUI.Button(startButton17_4, "-")) {target_script.RemoveSitCar(temp_next_event.sit_car.man_sit_car);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

for (var y2=0;y2<temp_next_event.sit_car.man_sit_car.Count;y2++)	{
var temp_sit_car : ClassMSC=temp_next_event.sit_car.man_sit_car[y2];
EditorGUILayout.Separator();
var startButton17_5 : Rect  = EditorGUILayout.BeginHorizontal();
startButton17_5.x = startButton17_5.width / 2 -210;
startButton17_5.width = 60;
startButton17_5.height = 15;
if (GUI.Button(startButton17_5, y2+" man")) {if(!temp_sit_car.draw){temp_sit_car.draw=true;}else temp_sit_car.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
if(temp_sit_car.draw){
//temp_sit_car.activate= EditorGUILayout.Toggle("Activate",temp_sit_car.activate);	
temp_sit_car.other_event= EditorGUILayout.Toggle("OtherEvent",temp_sit_car.other_event);	
if(temp_sit_car.other_event)
temp_sit_car.event =  EditorGUILayout.IntField("ManEvent", temp_sit_car.event);
temp_sit_car.man =  EditorGUILayout.IntField("Man", temp_sit_car.man);

temp_sit_car.car_other_event= EditorGUILayout.Toggle("OtherEvent",temp_sit_car.car_other_event);	
if(temp_sit_car.car_other_event)
temp_sit_car.car_event =  EditorGUILayout.IntField("CarEvent", temp_sit_car.car_event);
temp_sit_car.car =  EditorGUILayout.IntField("Car", temp_sit_car.car);
}//draw
}//for
EditorGUILayout.Separator();
EditorGUILayout.Separator();
}//draw_man

}//sit_car


//DISTANCE
GUI.color = Color.white;
if(temp_next_event.draw_distance)GUI.color = Color.green;
var startButton18 : Rect  = EditorGUILayout.BeginHorizontal();
startButton18.x = startButton18.width / 2 -250;
startButton18.width = 100;
startButton18.height = 20;
if (GUI.Button(startButton18, "distance")) {
if(!temp_next_event.draw_distance){
temp_next_event.draw_distance=true;}
else temp_next_event.draw_distance=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

if(temp_next_event.draw_distance){
temp_next_event.type_distance = EditorGUILayout.EnumPopup("Type", temp_next_event.type_distance );
if(temp_next_event.type_distance==0){
temp_next_event.only_one_condition_distance= EditorGUILayout.Toggle("OnlyOneCondition",temp_next_event.only_one_condition_distance);	
}//type_distance
else if(temp_next_event.type_distance==1){
temp_next_event.collect_delete_minimap= EditorGUILayout.Toggle("DeleteMiniMapIcon",temp_next_event.collect_delete_minimap);
}//type_distance
else if(temp_next_event.type_distance==2){
temp_next_event.step_minimap_icon = EditorGUILayout.EnumPopup("MiniMapIcon", temp_next_event.step_minimap_icon );
temp_next_event.add_to_cars= EditorGUILayout.Toggle("AddPathToCars",temp_next_event.add_to_cars);
if(temp_next_event.add_to_cars)temp_next_event.cars_event= EditorGUILayout.IntField("CarsEvent",temp_next_event.cars_event);
}//type_distance
if(temp_next_event.type_distance==2 || temp_next_event.type_distance==1){
temp_next_event.collect_destroy_object= EditorGUILayout.Toggle("DestroyObject",temp_next_event.collect_destroy_object);
temp_next_event.collect_audio =EditorGUILayout.ObjectField("Sound", temp_next_event.collect_audio  , typeof(AudioClip), true);
}//type_distance
var startButton18_1 : Rect  = EditorGUILayout.BeginHorizontal();
startButton18_1.x = startButton18_1.width / 2 -250;
startButton18_1.width = 30;
startButton18_1.height = 15;
if (GUI.Button(startButton18_1, "+")) {target_script.AddDistance(temp_next_event.distance);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();

var startButton18_2 : Rect  = EditorGUILayout.BeginHorizontal();
startButton18_2.x = startButton18_2.width / 2 -220;
startButton18_2.width = 30;
startButton18_2.height = 15;
if (GUI.Button(startButton18_2, "-")) {target_script.RemoveDistance(temp_next_event.distance);GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();

for (var y3=0;y3<temp_next_event.distance.Count;y3++)	{
var temp_distance : ClassMisDistance=temp_next_event.distance[y3];
EditorGUILayout.Separator();
var startButton18_3 : Rect  = EditorGUILayout.BeginHorizontal();
startButton18_3.x = startButton18_3.width / 2 -250;
startButton18_3.width = 60;
startButton18_3.height = 15;
if (GUI.Button(startButton18_3, y3+" ")) {if(!temp_distance.draw){temp_distance.draw=true;}else temp_distance.draw=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
if(temp_distance.draw){
temp_distance.distance =  EditorGUILayout.IntField("Distance", temp_distance.distance);
temp_distance.greater= EditorGUILayout.Toggle("Greater",temp_distance.greater);
if(temp_distance.from==0 || temp_distance.to==0)
temp_distance.player_not_car= EditorGUILayout.Toggle("PlayerNotCar",temp_distance.player_not_car);
temp_distance.from = EditorGUILayout.EnumPopup("From", temp_distance.from );
if(temp_distance.from==1)
temp_distance.point_from =EditorGUILayout.ObjectField("Point", temp_distance.point_from , typeof(Transform), true);
if(temp_distance.from!=0&&temp_distance.from!=1){
temp_distance.from_index =  EditorGUILayout.IntField("Index", temp_distance.from_index);
temp_distance.other_event_from= EditorGUILayout.Toggle("OtherEvent",temp_distance.other_event_from);	
if(temp_distance.other_event_from)temp_distance.event_from =  EditorGUILayout.IntField("Event", temp_distance.event_from);}

temp_distance.to = EditorGUILayout.EnumPopup("To", temp_distance.to );
if(temp_distance.to==1)
temp_distance.point_to =EditorGUILayout.ObjectField("Point", temp_distance.point_to , typeof(Transform), true);
if(temp_distance.to!=0&&temp_distance.to!=1){
temp_distance.to_index =  EditorGUILayout.IntField("Index", temp_distance.to_index);
temp_distance.other_event_to= EditorGUILayout.Toggle("OtherEvent",temp_distance.other_event_to);	
if(temp_distance.other_event_to)temp_distance.event_to =  EditorGUILayout.IntField("Event", temp_distance.event_to);}

}//draw
}//for

EditorGUILayout.Separator();
EditorGUILayout.Separator();

}//draw
GUI.color = Color.white;
if(temp_next_event.draw_other_condition)GUI.color = Color.green;
var startButton_oe : Rect  = EditorGUILayout.BeginHorizontal();
startButton_oe.x = startButton_oe.width / 2 -250;
startButton_oe.width = 100;
startButton_oe.height = 20;
if (GUI.Button(startButton_oe, "OtherCondition")) {
if(!temp_next_event.draw_other_condition){
temp_next_event.draw_other_condition=true;}
else temp_next_event.draw_other_condition=false;
GUIUtility.ExitGUI();}
EditorGUILayout.EndHorizontal();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
EditorGUILayout.Separator();
if(temp_next_event.draw_other_condition){
temp_next_event.drugs= EditorGUILayout.Toggle("Drugs",temp_next_event.drugs);	
}//draw_other_condition

}//next_event
}//DrawEndEvent

}//RoadBuilderEditor
