#pragma strict
var halo_1 : Transform;
var halo_2 : Transform;
private var timer : float;
function Start () {
halo_2.gameObject.SetActive(false);
}

function Update () {
timer+=Time.deltaTime;
if(timer>0.2f){
halo_1.gameObject.SetActive(!halo_1.gameObject.active);
halo_2.gameObject.SetActive(!halo_2.gameObject.active);
timer=0;
}//timer

}