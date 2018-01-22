#pragma strict

function Start () {
Invoke("ActivateFalse",1);
}

function ActivateFalse(){
gameObject.SetActive(false);
}//