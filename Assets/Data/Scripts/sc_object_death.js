#pragma strict
public var health : int= 1000;
var object : Transform;
var object_death : Transform;
var sound_death: AudioClip;

function Damage(_power : int){
health-=_power;
if(health<=0){
if(sound_death)AudioSource.PlayClipAtPoint(sound_death, transform.position,1);
if(object)object.gameObject.SetActive(false);
if(object_death)object_death.gameObject.SetActive(true);
}//health
}//