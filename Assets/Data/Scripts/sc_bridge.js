#pragma strict
var bridge : Transform;
var traffic : sc_trafic_light;
var sound : AudioSource;
private var up : boolean;
function Start () {

}//Start

function Update () {
if(traffic.num==1)up=true;
if(traffic.num==2)up=false;
if(up)Up();
else Down();
}//Update

function Up(){
if(bridge.localPosition.y<15){bridge.localPosition.y+=2*Time.deltaTime;
if(!sound.isPlaying)sound.Play();}
else if(bridge.localPosition.y>15)bridge.localPosition.y=15;
}//Up

function Down(){
if(bridge.localPosition.y>0){bridge.localPosition.y-=2*Time.deltaTime;
if(!sound.isPlaying)sound.Play();}
else if(bridge.localPosition.y<0)bridge.localPosition.y=0;
}//Up