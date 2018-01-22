using UnityEngine;
using System.Collections.Generic;

public class Vehicle : MonoBehaviour
{
    public Game game_sc;
    public Transform fire_ob;
    public Transform fire_point;

    private int fire_num;

    public ClassCamera[] camera_type;
    public ClassVehiclePlace[] place;
    public int team;
    public float health_max = 1000;
    public float max_speed = 180;
    public int limit_speed = 180;
    public int price = 5000;
    public float health = 100;
    public int place_drive;
    public int scale = 6;
    public int invoke_damage;
    public bool engine_work;
    public bool back_speed;
    public float throttle;
    public float steer;
    public Vector3 rotate;
    public Vector3 target_pos;
    public Transform turret_point;
    public Transform destroy_ob;
    public Transform sirena;
    public Transform driver;
    public Transform killer;
    public Renderer light_material;
    public bool fire;
    public bool police;
    public bool boat;
    public bool stop_fire;
    public bool dellete = true;
    public bool destroy;
    public bool health_bar;

    public bool death;
    private bool stop;
    private float stop_timer;

    void Awake()
    {
        if (!game_sc) game_sc = GameObject.Find("Game").GetComponent<Game>();
        GetComponent<VehicleBot>().game_sc = game_sc;
    }

    void Start()
    {
        health = health_max;
        game_sc.vehicle.Add(transform);
    }//Start

    void Update()
    {
        if (light_material)
        {
            if (throttle < 0) light_material.material.color = Color.white;
            else if (!stop) light_material.material.color = Color.gray;
            if (stop)
            {
                stop_timer += Time.deltaTime;
                if (stop_timer > 0.1f) { stop = false; stop_timer = 0; }
            }
        }//light_material
    }//Update

    public void EngineStart()
    {
        //if (GetComponent(sc_car2)) GetComponent(sc_car2).EngineStart();
        //else if (GetComponent(sc_motobike_js)) GetComponent(sc_motobike_js).EngineStart();
        //else if (GetComponent(sc_car)) GetComponent(sc_car).EngineStart();
        //else if (GetComponent(sc_helecopter)) GetComponent(sc_helecopter).EngineStart();
        //else if (GetComponent(sc_boat)) GetComponent(sc_boat).EngineStart();
    }//EngineStart

    public void EngineWork()
    {
        //if (GetComponent(sc_car2)) GetComponent(sc_car2).EngineWork();
        //else if (GetComponent(sc_motobike_js)) GetComponent(sc_motobike_js).EngineWork();
        //else if (GetComponent(sc_car)) GetComponent(sc_car).EngineWork();
        //else if (GetComponent(sc_boat)) GetComponent(sc_boat).EngineWork();
    }//EngineWork

    public void EngineStop()
    {
        throttle = 0;
        //if (GetComponent(sc_car2)) GetComponent(sc_car2).EngineStop();
        //else if (GetComponent(sc_motobike_js)) GetComponent(sc_motobike_js).EngineStop();
        //else if (GetComponent(sc_car)) GetComponent(sc_car).EngineStop();
        //else if (GetComponent(sc_boat)) GetComponent(sc_boat).EngineStop();
    }//EngineStart


    public void StopVehicle(float _index)
    {
        //if (GetComponent(sc_car2)) GetComponent(sc_car2).StopVehicle(_index);
        //else if (GetComponent(sc_motobike_js)) GetComponent(sc_motobike_js).StopVehicle(_index);
        //else if (GetComponent(sc_car)) GetComponent(sc_car).StopVehicle(_index);
        //else if (GetComponent(sc_boat)) GetComponent(sc_boat).StopVehicle(_index);
        if (light_material) light_material.material.color = Color.white;
        stop = true;
        stop_timer = 0;
    }//StopVehicle

    public void InvokeDamage()
    {
        Damage(invoke_damage, null);
    }//InvokeDamage

    public void Damage(float _power, Transform _killer)
    {
        health -= _power;
        if (_killer) killer = _killer;
        if (!death)
        {
            if (health <= 0) { Death(); }
            else if (fire_num == 0 && health < health_max / 4 && health >= health_max / 10)
            {
                CreateFire(1);
            }
            else if (fire_num != 2 && health < health_max / 8)
            {
                CreateFire(2);
            }
        }//death
    }//Damage

    public void CreateFire(int _index)
    {
        if (fire_num == 0)
        {
            Transform temp_object = Instantiate(fire_ob, fire_point.position, fire_point.rotation) as Transform;
            temp_object.parent = fire_point;
        }//fire_num
        fire_num = _index;

        if (_index == 1)
        {
            fire_point.GetChild(0).FindChild("smoke").gameObject.SetActive(true);
            fire_point.GetChild(0).FindChild("fire").gameObject.SetActive(false);
            max_speed *= 0.8f;
            limit_speed *= (int)0.8f;
        }//_index
        else if (_index == 2)
        {
            //if (GetComponent(sc_helecopter))//temp
            //{
            //    GetComponent(sc_helecopter).death = true;
            //    GetComponent(sc_helekop_bot).enabled = false;
            //}//sc_helecopter
            fire_point.GetChild(0).FindChild("smoke").gameObject.SetActive(false);
            fire_point.GetChild(0).FindChild("fire").gameObject.SetActive(true);
            max_speed *= 0.5f;
            limit_speed *= (int)0.5;
            Invoke("FireDamage", 1);
        }//_index


    }//CreateFire

    public void FireDamage()
    {
        Damage(health_max / 100, null);
        if (!death) { Invoke("FireDamage", 1); }
    }//FireDamage

    public void Death()
    {
        death = true;
        this.enabled = false;
        if (killer) killer.GetComponent<Man>().AddWantedScore(50);
        for (var i = 0; i < place.Length; i++)
        {
            if (place[i].man)
            {
                place[i].man.GetComponent<Man>().Damage(1000, 0, Vector3.zero, Vector3.zero, null);
            }
        }

        //if (GetComponent<sc_helecopter>())//temp
        //{
        //    for (var j1 = 0; j1 < place.Length; j1++)
        //    {
        //        if (place[j1].man)
        //        {
        //            game_sc.man.Remove(place[j1].man);
        //            Destroy(place[j1].man.gameObject);

        //        }//man
        //    }//for
        //    game_sc.transform.GetComponent<sc_player>().MoneyAdd(2000);
        //    Transform temp_destroy_ob = Instantiate(destroy_ob, transform.position, transform.rotation) as Transform;
        //    game_sc.vehicle.Remove(transform);
        //    Destroy(temp_destroy_ob.gameObject, 5);
        //    Destroy(gameObject);
        //}//sc_helecopter
        //else
        //{
        GetComponent<Rigidbody>().AddForce(Vector3.up * 2000);
        GetComponent<Rigidbody>().AddTorque(new Vector3(Random.Range(-1.0f, 1.0f), Random.Range(-1.0f, 1.0f), Random.Range(-1.0f, 1.0f)) * 200000);

        Transform temp_controller = transform.FindChild("controller").transform;
        Transform temp_body = transform.FindChild("body").transform;
        Transform temp_body1 = temp_body.FindChild("body").transform;

        Material[] temp_materials = new Material[1];
        temp_materials[0] = game_sc.death_car_mat;
        for (var j = 0; j < temp_body1.childCount; j++)
        {
            MeshRenderer mr = temp_body1.GetChild(j).GetComponent<MeshRenderer>();
            mr.materials = temp_materials;
        }

        temp_controller.parent = temp_body1;
        temp_body1.parent = transform;
        Destroy(temp_body.gameObject);
        Destroy(GetComponent<AudioSource>());
        if (GetComponent<VehicleBot>()) Destroy(GetComponent<VehicleBot>());
        if (GetComponent<CarCop>()) Destroy(GetComponent<CarCop>());
        if (GetComponent<RCC_CarControllerV3>())
        {
            GetComponent<RCC_CarControllerV3>().DestroyWheels();
            Destroy(GetComponent<RCC_CarControllerV3>());
        }

        if (sirena) Destroy(sirena.gameObject);
        //if (GetComponent(sc_car2)) GetComponent(sc_car2).Death();
        //else if (GetComponent(sc_motobike_js)) GetComponent(sc_motobike_js).Death();
        //}//helecopter
        Instantiate(game_sc.explosion_0, transform.position + new Vector3(0, 0, 0), transform.rotation);
        game_sc.GetComponent<VehicleCreator>().CarsDeath.Add(this.transform);

    }//Death

    public void OnGUI()
    {
        if (health_bar)
        {
            float temp_distance = Vector3.Distance(transform.position, game_sc._camera.position);
            Vector3 temp_pos = Camera.main.WorldToScreenPoint(transform.position + new Vector3(0, 1, 0));
            Vector3 temp_in_camera = Camera.main.transform.InverseTransformPoint(transform.position + new Vector3(0, 1, 0));
            float temp_size = (Screen.width + Screen.height) / 30;

            if (temp_in_camera.z > 0 && temp_distance < 100)
            {
                GUI.color = Color.white;
                GUI.DrawTexture(new Rect(temp_pos.x - temp_size / 2, Screen.height - temp_pos.y - temp_size / 5, temp_size, temp_size / 5), game_sc.tex_healthbar1);
                GUI.color = Color.green;
                if (health < health_max / 3) GUI.color = Color.red;
                else if (health < health_max / 1.5) GUI.color = Color.yellow;

                GUI.DrawTexture(new Rect(temp_pos.x - temp_size / 2, Screen.height - temp_pos.y - temp_size / 5, temp_size / health_max * health, temp_size / 5), game_sc.tex_healthbar2);
            }//temp_in_camera
        }//health_bar
    }//OnGUI
}
