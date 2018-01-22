#pragma strict
var BipPelvis: Transform;
	
var  BipLThigh: Transform;
var  BipRThigh: Transform;	
var  BipLCalf: Transform;
var  BipRCalf: Transform;
   
var bip_spine: Transform;

var BipHead: Transform;
var BipLUpperArm: Transform;
var BipRUpperArm: Transform;
var BipLForearm: Transform;
var BipRForearm: Transform;

function Start () {
//Activate(true);
//if(GetComponent(sc_man).health>0)Invoke("ActivateFalse",5);
}//Start

function Update () {
if(Input.GetKeyUp(KeyCode.T)){Activate(true);
if(GetComponent(sc_man).health>0)Invoke("ActivateFalse",5);}
}//Update

function RagDoll(){
Activate(true);
if(GetComponent(sc_man).health>0)Invoke("ActivateFalse",5);
}//RagDoll

function ActivateFalse(){
var hit : RaycastHit;
if((Physics.Raycast(BipPelvis.position,Vector3(0,1,0),hit,2)&&hit.transform.root!=transform) ||
GetComponent.<Rigidbody>().velocity.magnitude>5){Invoke("ActivateFalse",3);return false;}
transform.position.x=BipPelvis.position.x;
transform.position.z=BipPelvis.position.z;
transform.eulerAngles.x=0;
transform.eulerAngles.z=0;
Activate(false);
}//ActivateFalse

function  Activate(_active : boolean){
GetComponent(Animator).enabled=!_active;
GetComponent(sc_man).enabled=!_active;
transform.GetComponent.<Collider>().enabled=!_active;
if(GetComponent.<Rigidbody>().isKinematic)GetComponent.<Rigidbody>().isKinematic=false;
if(!_active)transform.GetComponent(sc_man).StandUp();

if(_active){
var joint : ConfigurableJoint=BipPelvis.gameObject.AddComponent(ConfigurableJoint);
joint.connectedBody=transform.GetComponent.<Rigidbody>();
joint.xMotion = ConfigurableJointMotion.Locked;
joint.yMotion = ConfigurableJointMotion.Locked;
joint.zMotion = ConfigurableJointMotion.Locked;}
else Destroy(BipPelvis.GetComponent(ConfigurableJoint));


bip_spine.GetComponent.<Rigidbody>().isKinematic=!_active;
BipHead.GetComponent.<Rigidbody>().isKinematic=!_active;
BipPelvis.GetComponent.<Rigidbody>().isKinematic=!_active;
BipLThigh.GetComponent.<Rigidbody>().isKinematic=!_active;
BipRThigh.GetComponent.<Rigidbody>().isKinematic=!_active;
BipLCalf.GetComponent.<Rigidbody>().isKinematic=!_active;
BipRCalf.GetComponent.<Rigidbody>().isKinematic=!_active;
BipLUpperArm.GetComponent.<Rigidbody>().isKinematic=!_active;
BipRUpperArm.GetComponent.<Rigidbody>().isKinematic=!_active;
BipLForearm.GetComponent.<Rigidbody>().isKinematic=!_active;
BipRForearm.GetComponent.<Rigidbody>().isKinematic=!_active;


bip_spine.GetComponent.<Collider>().enabled=_active;
BipHead.GetComponent.<Collider>().enabled=_active;
BipPelvis.GetComponent.<Collider>().enabled=_active;
BipLThigh.GetComponent.<Collider>().enabled=_active;
BipRThigh.GetComponent.<Collider>().enabled=_active;
BipLCalf.GetComponent.<Collider>().enabled=_active;
BipRCalf.GetComponent.<Collider>().enabled=_active;
BipLUpperArm.GetComponent.<Collider>().enabled=_active;
BipRUpperArm.GetComponent.<Collider>().enabled=_active;
BipLForearm.GetComponent.<Collider>().enabled=_active;
BipRForearm.GetComponent.<Collider>().enabled=_active;


//this.enabled=_active;
}//Activate

