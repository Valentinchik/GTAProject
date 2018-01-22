#pragma strict
public var root : Transform;
function Start () {
Destroy(gameObject,5);
Invoke("Damage",0.01f);
}
function Damage(){
if(!gameObject.active)return false;
if(transform.root.GetComponent(sc_man)){
root.GetComponent(sc_man).enemy=transform.root;
transform.root.GetComponent(sc_man).Damage(10,0,Vector3.zero,Vector3.zero,root);}
else if(transform.root.GetComponent(sc_vehicle)){transform.root.GetComponent(sc_vehicle).Damage(100,root);}
else if(transform.parent&&transform.parent.gameObject.active&&transform.parent.GetComponent(sc_object_death)){transform.parent.GetComponent(sc_object_death).Damage(10);}
Invoke("Damage",1);
}//Damage
