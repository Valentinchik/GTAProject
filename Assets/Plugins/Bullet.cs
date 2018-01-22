using UnityEngine;
using System.Collections;

public class Bullet : MonoBehaviour
{
    public Game game_sc;
    public int team;
    public Transform root;
    public Transform target;

    public Transform explosion;
    public Transform fire;
    public bool use_gravity;

    public int type = 1;
    public float _speed = 100;
    public float power = 10;
    public float force = 10;
    public float exp_radius = 10;

    void Start()
    {
        Destroy(gameObject, 1000 / _speed);
        if (type == 2) Destroy(gameObject, 1);
    }//Start

    void Update()
    {
        Vector3 temp_direction = transform.TransformDirection(Vector3.forward);
        if (use_gravity)
        {
            transform.eulerAngles += new Vector3(10 * Time.deltaTime,0,0); 
        }

        if (target)
        {
            Vector3 angle_diff;
            Vector3 target_angle = Quaternion.LookRotation(target.position - transform.position).eulerAngles;
            angle_diff.x = Functions.Angle180Abs(target_angle - transform.eulerAngles).x;
            angle_diff.y = Functions.Angle180Abs(target_angle - transform.eulerAngles).y;

            if (angle_diff.x < 60 && angle_diff.y < 60)
            {
                transform.eulerAngles = Quaternion.Slerp(transform.rotation, Quaternion.Euler(target_angle.x, target_angle.y, 0), 20 * Time.deltaTime).eulerAngles;
            }
        }

        RaycastHit hit;
        if (Physics.Raycast(transform.position, temp_direction, out hit, _speed * Time.deltaTime))
        {
            if (hit.transform.root != root)
            {
                bool temp_destroy = true;
                if (type == 0)
                {
                    if (hit.collider && hit.collider.GetType() != typeof(TerrainCollider))
                    {
                        if (hit.collider.material.name == "Metal (Instance)") CrieteDecal(1, hit, false);//Metal
                        else if (hit.collider.material.name == "Water (Instance)") CrieteDecal(2, hit, false);//water
                        else if (hit.collider.material.name == "Wood (Instance)") CrieteDecal(3, hit, false);//wood
                        else if (hit.collider.material.name == "Glass (Instance)") CrieteDecal(5, hit, true);//glass
                        else if (hit.collider.material.name == "man (Instance)") CrieteDecal(4, hit, false);//wood
                        else if (hit.transform.root.tag != "man") { CrieteDecal(0, hit, false); }
                    }//Terrain
                    else if (hit.transform.root.tag != "man") { CrieteDecal(0, hit, false); }


                    if (hit.transform.root.GetComponent<Man>())
                    {
                        if (root)
                        {
                            if (hit.transform.root.GetComponent<Man>().cop) root.GetComponent<Man>().Danger();
                            root.GetComponent<Man>().enemy = hit.transform.root;
                        }
                        hit.transform.root.GetComponent<Man>().Damage(power, force, temp_direction, hit.point, root);
                    }
                    else if (hit.rigidbody) { hit.rigidbody.AddForce((temp_direction * force) / 10); }
                    else if (hit.transform.parent && hit.transform.parent.GetComponent< Rigidbody > ()) { hit.transform.parent.GetComponent< Rigidbody > ().AddForce((temp_direction * force) / 10); }
                    if (hit.transform.root.GetComponent<Vehicle>())
                    {
                        hit.transform.root.GetComponent<Vehicle>().Damage(power, root);
                    }


                    if (temp_destroy) { Destroy(gameObject); }
                    //else{transform.position-=transform.TransformDirection(Vector3.forward*_speed*Time.deltaTime)*0.4;}
                    else
                    {
                        transform.position = hit.point;
                        transform.position += temp_direction * 0.01f;
                        return;
                    }
                }//type
                else if (type == 1)
                {
                    CrieteExpl();
                }//type
                else if (type == 2)
                {
                    CrieteFire(hit);
                }//type

            }//root
        }//Physics
        transform.position += temp_direction * _speed * Time.deltaTime;
    }//Update

    void CrieteExpl()
    {
        Transform temp_object  = Instantiate(explosion);
        temp_object.position = transform.position;
        temp_object.GetComponent<ExplosionNew>().power = power;
        temp_object.GetComponent<ExplosionNew>().force = force;
        temp_object.GetComponent<ExplosionNew>().radius = exp_radius;
        temp_object.GetComponent<ExplosionNew>().root = root;
        Destroy(gameObject);
    }//CrieteExpl

    public void CrieteFire(RaycastHit _hit)
    {
        Transform temp_object = Instantiate(fire);
        temp_object.GetComponent<Fire>().root = root;
        temp_object.position = transform.position;
        if (_hit.rigidbody || _hit.transform.root.GetComponent< Rigidbody > () || _hit.transform.GetComponent<Object_death>()) temp_object.parent = _hit.transform;
        Destroy(gameObject);
    }//CrieteExpl

    public void CrieteDecal(int _index , RaycastHit _hit , bool _decal)
    {
        ClassDecal temp_decal = game_sc.decal[_index];
        Transform temp_object;
        Quaternion particle_rotation = Quaternion.FromToRotation(Vector3.up, _hit.normal);

        //particle
        temp_object = Instantiate(temp_decal.particle, _hit.point, particle_rotation)as Transform;
        if (_hit.rigidbody) temp_object.parent = _hit.transform;

        //sound
        AudioSource.PlayClipAtPoint(temp_decal.sound[Random.Range(0, temp_decal.sound.Count)], transform.position, 0.2f);

        //decal
        if (_decal)
        {
            temp_object = Instantiate(temp_decal.decal[Random.Range(0, temp_decal.decal.Count)], _hit.point, particle_rotation)as Transform;
            temp_object.parent = _hit.collider.transform;
            Destroy(temp_object.gameObject, 5);
        }//decal
    }//CrieteDecal
}
