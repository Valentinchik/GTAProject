using UnityEngine;
using System.Collections;

public class ExplosionNew : MonoBehaviour
{

    public Transform[] expl_part;
    public Transform smoke;
    public Transform fire;
    public AudioClip[] sound_expl;
    public int part_count = 30;
    public float part_scale = 0.1f;
    public int part_mass = 50;

    public Transform root;
    public float radius = 10;
    public float destroy_timer = 3;
    public float power = 100;
    public float force = 100;
    public float exp_power = 2000;

    void Start()
    {
        Invoke("Explosion", 0.01f);
    }//Start



    public void Explosion()
    {
        int random_sound = Random.Range(0, sound_expl.Length);
        AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position, 1);
        AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position, 1);
        AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position, 1);
        AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position, 1);
        AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position, 1);
        AudioSource.PlayClipAtPoint(sound_expl[random_sound], transform.position, 1);

        Transform temp_object;
        if (smoke) temp_object = Instantiate(smoke, transform.position, transform.rotation) as Transform;
        if (fire) temp_object = Instantiate(fire, transform.position, transform.rotation) as Transform;


        for (var i = 0; i < part_count; i++)
        {
            temp_object = Instantiate(expl_part[Random.Range(0, expl_part.Length)]);
            temp_object.position = transform.position + new Vector3(Random.Range(-1.0f, 1.0f), Random.Range(-1.0f, 1.0f), Random.Range(-1.0f, 1.0f));
            temp_object.eulerAngles = new Vector3(Random.Range(0, 360), Random.Range(0, 360), Random.Range(0, 360));
            temp_object.localScale = new Vector3(Random.Range(part_scale, part_scale * 5), Random.Range(part_scale, part_scale * 5), Random.Range(part_scale, part_scale * 5));
            temp_object.GetComponent<Rigidbody>().mass = Random.Range(part_mass, part_mass * 2);
            Destroy(temp_object.gameObject, Random.Range(destroy_timer, destroy_timer * 2));

        }

        var explosionPosition = transform.position;
        Collider[] colliders = Physics.OverlapSphere(explosionPosition, radius);
        foreach (var hit in colliders)
        {
            var closestPoint = hit.ClosestPointOnBounds(explosionPosition);
            var distance = Vector3.Distance(closestPoint, explosionPosition);
            var hitPoints = 1.0 - Mathf.Clamp01(distance / radius);
            float temp_damage = (float)hitPoints * power;
            if (hit.GetComponent<Rigidbody>()) { hit.GetComponent<Rigidbody>().AddExplosionForce((float)(exp_power * hitPoints * force), explosionPosition, radius, 1); }
            if (hit.transform.parent && hit.transform.parent.GetComponent<Rigidbody>()) { hit.transform.parent.GetComponent<Rigidbody>().AddExplosionForce((float)(exp_power * hitPoints), explosionPosition, radius, 1); }
            if (hit.transform.GetComponent<Man>())
            {
                hit.transform.GetComponent<Man>().Damage(temp_damage * 2.5f, (float)(exp_power * hitPoints * force), Vector3.zero, Vector3.zero, root);
            }
            if (hit.transform.root.GetComponent<Vehicle>() && hit.transform.root.GetComponent<Vehicle>().health > 0) { hit.transform.root.GetComponent<Vehicle>().Damage(temp_damage, root); }

        }//colliders

        Destroy(gameObject);

    }//Explosion
}
