#pragma strict
var gui_style : GUIStyle;
private var updateInterval : float= 0.5;
private var output : String;
private var	accum : float;
private var	timeleft : float;
private var	fps : float;
private var	frames : int;
var	num : float=0.3;
var	angle : Vector3;

function Start () {
timeleft = updateInterval;  
}//Start

function Update () {
FPS_Update();
if(Input.GetKeyUp(KeyCode.Z)){
//num=Mathf.DeltaAngle(20.0f,540.0f);
//angle=Vector3.ClampMagnitude(Vector3(45,90,45),0.1);
angle=Vector3.Exclude(Vector3(1,1,0),Vector3(100,100,0));
}
}//Update

function OnGUI(){

GUI.Label(new Rect(10, 20, 300, 20), output, gui_style);
//GUI.Label(new Rect(10, 50, 300, 20), "num "+num);
//GUI.Label(new Rect(10, 100, 300, 20), "angle "+angle);
}//OnGUI


function FPS_Update(){
timeleft -= Time.deltaTime;
accum += Time.timeScale/Time.deltaTime;
++frames;
	 
if(timeleft <= 0.0){
fps = accum/frames;
output = "FPS: " + "<color=" + SelectColor() + ">" + fps.ToString("f1") + "</color>";
timeleft = updateInterval;
accum = 0.0F;
frames = 0;
}//timeleft
}//FPS_Update
	
function SelectColor(){
if(fps < 30)
return "red";
if(fps >= 30 && fps < 50)
return "yellow";
if(fps >= 50)
return "lime";
return "wight";
}//SelectColor