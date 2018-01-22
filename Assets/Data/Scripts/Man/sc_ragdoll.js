#pragma strict
var components : List.<Component> = new List.<Component> ();
var rigid_body_com : List.<Component> = new List.<Component> ();
var BipPelvis: Transform;
function Start () {
Activate();
if(GetComponent(sc_man).health>0){Invoke("ActivateFalse",5);}
}//Start

function Update () {
}//Update

function ActivateFalse(){
var hit : RaycastHit;
if((Physics.Raycast(BipPelvis.position,Vector3(0,1,0),hit,2)&&hit.transform.root!=transform) ||
GetComponent.<Rigidbody>().velocity.magnitude>5){Invoke("ActivateFalse",3);return false;}
transform.position.x=BipPelvis.position.x;
transform.position.z=BipPelvis.position.z;
transform.eulerAngles.x=0;
transform.eulerAngles.z=0;
ActivCom(true);
DeleteCom();
}//ActivateFalse

function ActivCom(_index : boolean){
if(GetComponent(CapsuleCollider)){GetComponent(CapsuleCollider).enabled=_index;}
if(GetComponent(Animator)){GetComponent(Animator).enabled=_index;}
if(GetComponent(sc_man)){GetComponent(sc_man).enabled=_index;}
var rb : Rigidbody=GetComponent(Rigidbody);
if(rb.isKinematic){rb.isKinematic=false;}
//rb.freezeRotation=_index;
if(_index){transform.GetComponent(sc_man).StandUp();};
}//ActivCom

function  Activate(){
ActivCom(false);	
BipPelvis=transform.FindChild("Pelvis");	
	
var  BipLThigh: Transform=BipPelvis.FindChild("L_Thigh");
var   BipLCalf: Transform=BipLThigh.FindChild("L_Leg");
var  BipRThigh: Transform=BipPelvis.FindChild("R_Thigh");
var    BipRCalf: Transform=BipRThigh.FindChild("R_Leg");
   
var bip_spine: Transform=BipPelvis.FindChild("Spine_0");
var BipSpine1: Transform=bip_spine.FindChild("Spine_1");
var BipSpine2: Transform=BipSpine1.FindChild("Spine_2");
var BipNeck: Transform=BipSpine2.FindChild("Neck_1");

var   BipHead: Transform=BipNeck.FindChild("Head");
var   BipLClavicle: Transform=BipSpine2.FindChild("L_Clavicle");
var     BipLUpperArm: Transform=BipLClavicle.FindChild("L_Shoulder");
var      BipLForearm: Transform=BipLUpperArm.FindChild("L_Forearm");
var   BipRClavicle: Transform=BipSpine2.FindChild("R_Clavicle");
var     BipRUpperArm: Transform=BipRClavicle.FindChild("R_Shoulder");
var       BipRForearm: Transform=BipRUpperArm.FindChild("R_Forearm");


/*
var colider2 : BoxCollider;
colider2=BipPelvis.gameObject.AddComponent(typeof(BoxCollider)) as BoxCollider;components.Add(colider2);
colider2.center.x=0;
colider2.center.y=0.06;
colider2.center.z=0;

colider2.size.x=0.1;
colider2.size.y=0.16;
colider2.size.z=0.15;*/

var colider : CapsuleCollider;
colider=BipPelvis.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0;
colider.center.y=0.06;
colider.center.z=0;

colider.radius=0.1;
colider.height=0.2;
colider.direction=1;


colider=BipLThigh.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0;
colider.center.y=0.09896981;
colider.center.z=0;

colider.radius=0.05938189;
colider.height=0.1979396;
colider.direction=1;

colider=BipRThigh.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0;
colider.center.y=0.09896981;
colider.center.z=0;

colider.radius=0.05938189;
colider.height=0.1979396;
colider.direction=1;

colider=BipLCalf.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0;
colider.center.y=0.1247915;
colider.center.z=0;

colider.radius=0.05;
colider.height=0.249583;
colider.direction=1;


colider=BipRCalf.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0;
colider.center.y=0.1247915;
colider.center.z=0;

colider.radius=0.05;
colider.height=0.249583;
colider.direction=1;

colider=BipSpine2.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0;
colider.center.y=0.08;
colider.center.z=0;

colider.radius=0.06;
colider.height=0.22;
colider.direction=2;

colider=BipHead.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0.01;
colider.center.y=0.03;
colider.center.z=0;

colider.radius=0.05;
colider.height=0.15;
colider.direction=1;

colider=BipLUpperArm.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0;
colider.center.y=0.0652466;
colider.center.z=0;

colider.radius=0.045;
colider.height=0.16;
colider.direction=1;

colider=BipRUpperArm.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0;
colider.center.y=0.0652466;
colider.center.z=0;

colider.radius=0.045;
colider.height=0.16;
colider.direction=1;

colider=BipLForearm.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0;
colider.center.y=0.12;
colider.center.z=0;

colider.radius=0.04;
colider.height=0.2102311;
colider.direction=1;

colider=BipRForearm.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;components.Add(colider);
colider.center.x=0;
colider.center.y=0.12;
colider.center.z=0;

colider.radius=0.04;
colider.height=0.2102311;
colider.direction=1;

var rigid_body : Rigidbody;
rigid_body=BipPelvis.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
rigid_body=BipLThigh.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
rigid_body=BipRThigh.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
rigid_body=BipLCalf.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
rigid_body=BipRCalf.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
rigid_body=BipSpine2.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
rigid_body=BipHead.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
rigid_body=BipLUpperArm.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
rigid_body=BipRUpperArm.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
rigid_body=BipLForearm.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
rigid_body=BipRForearm.gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;rigid_body_com.Add(rigid_body);
BipLThigh.GetComponent.<Rigidbody>().mass=20;
BipRThigh.GetComponent.<Rigidbody>().mass=20;
BipLCalf.GetComponent.<Rigidbody>().mass=20;
BipRCalf.GetComponent.<Rigidbody>().mass=20;
BipSpine2.GetComponent.<Rigidbody>().mass=20;
BipHead.GetComponent.<Rigidbody>().mass=20;
BipLUpperArm.GetComponent.<Rigidbody>().mass=20;
BipRUpperArm.GetComponent.<Rigidbody>().mass=20;
BipLForearm.GetComponent.<Rigidbody>().mass=20;
BipRForearm.GetComponent.<Rigidbody>().mass=20;

//var fixed_joint : FixedJoint;
//fixed_joint=gameObject.AddComponent(typeof(FixedJoint)) as FixedJoint;components.Add(fixed_joint);
//fixed_joint.connectedBody=bip.rigidbody;


var joint : CharacterJoint;
/*
joint=BipPelvis.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=transform.rigidbody;

joint.axis.x=0;
joint.axis.y=-1;
joint.axis.z=0;

joint.swingAxis.x=-1;
joint.swingAxis.y=0;
joint.swingAxis.z=0;

joint.lowTwistLimit.limit=-180;
joint.highTwistLimit.limit=180;
joint.swing1Limit.limit=180;
*/

var joint1 : ConfigurableJoint=BipPelvis.gameObject.AddComponent(ConfigurableJoint);components.Add(joint1);
joint1.connectedBody=transform.GetComponent.<Rigidbody>();
joint1.xMotion = ConfigurableJointMotion.Locked;
joint1.yMotion = ConfigurableJointMotion.Locked;
joint1.zMotion = ConfigurableJointMotion.Locked;

//spina
joint=BipSpine2.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=BipPelvis.GetComponent.<Rigidbody>();

joint.axis.x=0;
joint.axis.y=0;
joint.axis.z=-1;

joint.swingAxis.x=1;
joint.swingAxis.y=0;
joint.swingAxis.z=0;

joint.lowTwistLimit.limit=-20;
joint.highTwistLimit.limit=20;
joint.swing1Limit.limit=10;

//golova
joint=BipHead.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=BipSpine2.GetComponent.<Rigidbody>();

joint.axis.x=0;
joint.axis.y=0;
joint.axis.z=-1;

joint.swingAxis.x=1;
joint.swingAxis.y=0;
joint.swingAxis.z=0;

joint.lowTwistLimit.limit=-40;
joint.highTwistLimit.limit=25;
joint.swing1Limit.limit=25;

//ple4o
joint=BipLUpperArm.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=BipSpine2.GetComponent.<Rigidbody>();

joint.axis.x=-1;
joint.axis.y=0;
joint.axis.z=0;

joint.swingAxis.x=0;
joint.swingAxis.y=0;
joint.swingAxis.z=-1;

joint.lowTwistLimit.limit=-70;
joint.highTwistLimit.limit=10;
joint.swing1Limit.limit=50;

//ple4o
joint=BipRUpperArm.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=BipSpine2.GetComponent.<Rigidbody>();

joint.axis.x=-1;
joint.axis.y=0;
joint.axis.z=0;

joint.swingAxis.x=0;
joint.swingAxis.y=0;
joint.swingAxis.z=1;

joint.lowTwistLimit.limit=-70;
joint.highTwistLimit.limit=10;
joint.swing1Limit.limit=50;

//lokotb
joint=BipLForearm.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=BipLUpperArm.GetComponent.<Rigidbody>();

joint.axis.x=0;
joint.axis.y=0;
joint.axis.z=-1;

joint.swingAxis.x=-1;
joint.swingAxis.y=0;
joint.swingAxis.z=0;

joint.lowTwistLimit.limit=-90;
joint.highTwistLimit.limit=0;
joint.swing1Limit.limit=0;

//lokorb
joint=BipRForearm.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=BipRUpperArm.GetComponent.<Rigidbody>();

joint.axis.x=0;
joint.axis.y=0;
joint.axis.z=1;

joint.swingAxis.x=-1;
joint.swingAxis.y=0;
joint.swingAxis.z=0;

joint.lowTwistLimit.limit=-90;
joint.highTwistLimit.limit=0;
joint.swing1Limit.limit=0;

//bedro
joint=BipLThigh.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=BipPelvis.GetComponent.<Rigidbody>();

joint.axis.x=1;
joint.axis.y=0;
joint.axis.z=0;

joint.swingAxis.x=0;
joint.swingAxis.y=0;
joint.swingAxis.z=-1;

joint.lowTwistLimit.limit=-20;
joint.highTwistLimit.limit=70;
joint.swing1Limit.limit=30;

//bedro
joint=BipRThigh.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=BipPelvis.GetComponent.<Rigidbody>();

joint.axis.x=-1;
joint.axis.y=0;
joint.axis.z=0;

joint.swingAxis.x=0;
joint.swingAxis.y=0;
joint.swingAxis.z=1;

joint.lowTwistLimit.limit=-20;
joint.highTwistLimit.limit=70;
joint.swing1Limit.limit=30;

//golenb
joint=BipLCalf.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=BipLThigh.GetComponent.<Rigidbody>();

joint.axis.x=1;
joint.axis.y=0;
joint.axis.z=0;

joint.swingAxis.x=0;
joint.swingAxis.y=0;
joint.swingAxis.z=-1;

joint.lowTwistLimit.limit=-80;
joint.highTwistLimit.limit=0;
joint.swing1Limit.limit=0;

//golenb
joint=BipRCalf.gameObject.AddComponent(typeof(CharacterJoint)) as CharacterJoint;components.Add(joint);
joint.connectedBody=BipRThigh.GetComponent.<Rigidbody>();

joint.axis.x=-1;
joint.axis.y=0;
joint.axis.z=0;

joint.swingAxis.x=0;
joint.swingAxis.y=0;
joint.swingAxis.z=1;

joint.lowTwistLimit.limit=-80;
joint.highTwistLimit.limit=0;
joint.swing1Limit.limit=0;



}//Activate

function DeleteCom(){
for(var i = 0; i < components.Count; i++) {
if(components[i]){Destroy(components[i]);}
}//for
for(var j = 0; j < rigid_body_com.Count; j++) {
if(rigid_body_com[j]){Destroy(rigid_body_com[j]);}
}//for

Destroy(GetComponent(sc_ragdoll));
}//DeleteCom