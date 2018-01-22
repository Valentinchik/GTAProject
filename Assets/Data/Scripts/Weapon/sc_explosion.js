var expl_part : Transform[];
var smoke : Transform;
var fire : Transform;
var sound_expl : AudioClip[];
var part_count : int=30;
var part_scale : float=0.1;
var part_mass : int=50;

public var root : Transform;
public var radius  : float= 10;
public var destroy_timer  : float= 3;
public var power : float=100;
public var force : float=100;
public var exp_power : float=2000;
function Start () {
Invoke("Explosion",0.01);
}//Start



function Explosion(){
var random_sound : int=Random.Range(0,sound_expl.Length);
AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position,1);
AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position,1);
AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position,1);
AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position,1);
AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position,1);
AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position,1);

var temp_object : Transform;
if(smoke)temp_object = Instantiate (smoke,transform.position,transform.rotation);
if(fire)temp_object = Instantiate (fire,transform.position,transform.rotation);


for (var i=0;i<part_count;i++)	{
temp_object = Instantiate (expl_part[Random.Range(0,expl_part.Length)]);
temp_object.position=transform.position+Vector3(Random.Range(-1.0f,1.0f),Random.Range(-1.0f,1.0f),Random.Range(-1.0f,1.0f));
temp_object.eulerAngles=Vector3(Random.Range(0,360),Random.Range(0,360),Random.Range(0,360));
temp_object.localScale=Vector3(Random.Range(part_scale,part_scale*5),Random.Range(part_scale,part_scale*5),Random.Range(part_scale,part_scale*5));
temp_object.GetComponent.<Rigidbody>().mass=Random.Range(part_mass,part_mass*2);
Destroy (temp_object.gameObject,Random.Range(destroy_timer,destroy_timer*2));

}

var explosionPosition = transform.position;
var colliders : Collider[] = Physics.OverlapSphere (explosionPosition, radius);
for (var hit in colliders) {
var closestPoint = hit.ClosestPointOnBounds(explosionPosition);
var distance = Vector3.Distance(closestPoint, explosionPosition);
var hitPoints = 1.0 - Mathf.Clamp01(distance / radius);
var temp_damage : float=hitPoints * power;
if(hit.GetComponent.<Rigidbody>()){hit.GetComponent.<Rigidbody>().AddExplosionForce(exp_power*hitPoints*force, explosionPosition, radius,1);}
if(hit.transform.parent&&hit.transform.parent.GetComponent.<Rigidbody>()){hit.transform.parent.GetComponent.<Rigidbody>().AddExplosionForce(exp_power*hitPoints, explosionPosition, radius,1);}
if(hit.transform.GetComponent(sc_man)){hit.transform.GetComponent(sc_man).Damage(temp_damage*2.5,exp_power*hitPoints*force,Vector3.zero,Vector3.zero,root);}
if(hit.transform.root.GetComponent(sc_vehicle)&&hit.transform.root.GetComponent(sc_vehicle).health>0){hit.transform.root.GetComponent(sc_vehicle).Damage(temp_damage,root);}

}//colliders

Destroy (gameObject);

}//Explosion