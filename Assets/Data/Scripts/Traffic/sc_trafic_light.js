#pragma strict
var _light : Transform[];
var timer : float[];
var _collider : Transform;
public var num : int;
private var col_pos : float;
 var random_timer : float;
function Start () {
col_pos=_collider.position.y;
Invoke("Timer",random_timer);
}//Start

function ActivateLight(_num : int){
for (var i=0; i < _light.Length; i++){_light[i].gameObject.SetActive(false);}//for
_light[_num].gameObject.SetActive(true);
if(_num==0 || _num==1 || _num==3){_collider.position.y=col_pos;}
else {_collider.position.y=col_pos-20;}
}//ActivateLight


function Timer(){
ActivateLight(num);
Invoke("Timer",timer[num]);
num++;if(num>_light.Length-1){num=0;}
}//Timer