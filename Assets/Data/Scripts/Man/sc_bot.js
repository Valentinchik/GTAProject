#pragma strict
var point : ClassPointMan;
var old_point : ClassPointMan;
var target : Transform;
private var animator : Animator;

public var other_doing : boolean;
public var have_point : boolean=true;

public var game_sc : sc_game;
private var man_script : sc_man;
private var weapon_script : sc_weapon;
private var patch_script : Patches;
var doing : String="idle";
public var target_pos : Vector3;
private var global_target_pos : Vector3;
private var target_angle : Vector3;
private var target_distance : float;
private var timer_step : float;
private var timer_step_max : float;
 var angle : float;
private var random_point : List.<int> = new List.<int> ();
private var point_man : List.<ClassPointMan> =new List.<ClassPointMan> ();


function Start () {
animator=GetComponent(Animator);
if(!game_sc)game_sc=GameObject.Find("Game").GetComponent(sc_game);
patch_script=game_sc.script_path;
man_script=GetComponent(sc_man);
weapon_script=GetComponent(sc_weapon);
timer_step_max=Random.Range(0,2.0f);
man_script.speed_max=1;
Invoke("LateStart",0.001);
Invoke("PlayerNear",Random.Range(1.0f,5.0f));
}//Start

function LateStart(){
//man_script.FindVehicle();
}//LateStart

function Update () {//Debug.DrawLine(transform.position+Vector3(0,1,0),transform.TransformPoint(Vector3( 1,1,2)*1), Color.red, 0.05f, false);

    if(man_script.killer&&weapon_script&&!weapon_script.enabled&&!man_script.killer.GetComponent(sc_man).death){
        var temp_distance : float=Vector3.Distance(man_script.killer.position,transform.position);
        if(temp_distance<10){
            var temp_angle : Vector3=Quaternion.LookRotation(man_script.killer.position-transform.position).eulerAngles;
            if(temp_distance>1.5f){
                man_script.Run(Vector3.forward,temp_angle.y,true);
            }//temp_distance
        else man_script.Fight(Random.Range(1,4),temp_angle.y);
            other_doing=true;
        }//temp_distance
        else 
            other_doing=false;
    }//enemy


    if(!man_script.other_doing&&!other_doing){
        timer_step+=Time.deltaTime;
        if(timer_step>timer_step_max){
            timer_step=0;
            timer_step_max=Random.Range(5.0f,20.0f);
            var random_doing : int=Random.Range(0,5);
            if(random_doing==0){doing="idle";timer_step_max=Random.Range(5.0f,10.0f);}
            else if(random_doing>0){
                doing="run";}
        }//timer_step

        if(doing=="run"){
            Debug.Log("4");
            target_angle=Quaternion.LookRotation(target_pos-transform.position).eulerAngles;
            man_script.Run(Vector3.forward,target_angle.y,true);
            if(point){
                target_distance=Vector3.Distance(Vector3(target_pos.x,0,target_pos.z), Vector3(transform.position.x,0,transform.position.z));
                if(target_distance<0.5){if(have_point){NextPoint();}else{doing="idle";}}
            }//point
        }//run
    }//other_doing
}//Update

function FindNearPoint(_build : int){
    var temp_patch_script : Patches=GameObject.Find("Game").GetComponent(Patches);
     if(_build==1){point_man=temp_patch_script.point_man;}
else if(_build==2){point_man=temp_patch_script.point_man_build;}

if(point_man.Count>0){
var temp_point : ClassPointMan;
var temp_near_point : ClassPointMan;
var temp_distance_big : float=1000;
var temp_distance : float;

for (var i=0;i<point_man.Count;i++)	{
temp_point=point_man[i];
temp_distance=Vector3.Distance(temp_point._position, transform.position);
if(temp_distance<temp_distance_big){temp_distance_big=temp_distance;temp_near_point=temp_point;}
}//for
if(temp_near_point){
GetPoint(temp_near_point);}//temp_near_point
}//Count
}//FindNearPoint

function NextPoint(){
if(point.near_point.Count<=0){FindNearPoint(1);return false;}
var temp_point : int;
random_point.Clear();
if(point.near_point.Count>1){
for (var i=0; i<point.near_point.Count; i++)	{
if(point.near_point[i]!=old_point.index){random_point.Add(point.near_point[i]);}
}//for
temp_point=random_point[Random.Range(0,random_point.Count)];
}//Count
else{temp_point=point.near_point[0];}

GetPoint(point_man[temp_point]);
}//NextPoint


function GetPoint(_point : ClassPointMan){
old_point=point;
point=_point;
target_pos=point._position;
target_pos.x+=Random.Range(-point.distance,point.distance);target_pos.z+=Random.Range(-point.distance,point.distance);
Doing(old_point);
}//GetPoint

function GetThisPoint(_point : ClassPointMan,_build : boolean){
    var temp_patch_script : Patches=GameObject.Find("Game").GetComponent(Patches);
if(_build){point_man=temp_patch_script.point_man_build;}
else{point_man=temp_patch_script.point_man;}
GetPoint(_point);
}//GetThisPoint


function Doing(_point : ClassPointMan){
      if(_point.doing==0){return false;}
else if (_point.doing==1){doing="idle";timer_step_max=Random.Range(10.0f,20.0f);}
else {
doing="idle";
timer_step=0;
if (_point.doing==2){
timer_step_max=Random.Range(10.0f,20.0f);
man_script.Doing(Random.Range(1,4),timer_step_max,Vector3.zero,Vector3.zero);}
else if (_point.doing==3){
timer_step_max=Random.Range(10.0f,20.0f);
man_script.Doing(4,timer_step_max,_point.rotation,_point._position);}
else if (_point.doing==4){
timer_step_max=Random.Range(10.0f,20.0f);
man_script.Doing(5,timer_step_max,Vector3.zero,Vector3.zero);}
}//else

}//Doing



function PlayerNear(){
if(GetComponent(sc_band) || man_script.enemy==game_sc.player|| man_script.killer==game_sc.player)return false;
Invoke("PlayerNear",Random.Range(1.0f,5.0f));
var temp_distance : float=Vector3.Distance(game_sc.player.position, transform.position);
if(temp_distance<2)man_script.Voice(0,100);
}//PlayerNear

