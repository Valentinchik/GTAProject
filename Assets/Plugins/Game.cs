using UnityEngine;
using System.Collections.Generic;

public class Game : MonoBehaviour
{

    private MiniMap minimap_sc;

    public AudioClip[] sound_step_default;
    public AudioClip[] sound_step_metal;
    public AudioClip[] sound_step_wood;
    public AudioClip[] sound_step_water;
    public AudioClip[] sound_jump;
    public AudioClip[] sound_death_woman;
    public AudioClip[] sound_car_crush;
    public AudioClip[] man_hit_car;
    public AudioClip[] sound_kick;
    public AudioClip[] sound_effect;
    public AudioClip sound_skid;
    public AudioClip sound_parachute;
    public Texture2D tex_healthbar1;
    public Texture2D tex_healthbar2;
    public ClassSound[] sound_death;
    public ClassSound[] sound_hit_bullet;
    public ClassVoice[] sound_voice;
    public Transform[] particle_hit_bullet;
    public Transform[] grenade;
    public ClassGlass[] glass;
    public ClassDecal[] decal;
    public Transform[] destroy_wheel;
    public Transform[] object1;
    public Transform[] helecopter;
    public Transform[] helecopter_ob;
    public Transform[] helecopter_point;
    public bool[] helecopter_active;
    public Color[] car_color;
    public List<ClassLightObject> light_object = new List<ClassLightObject>();
    public int language;
    public int car_damage;
    public int car_colorran;
    public int car_count;

    public Transform[] spawn_car_point;
    public Transform[] spawn_player_point;
    public Transform place_death_ob;
    public Transform particle_swim;
    public Transform weapon_ob;
    public Transform money_ob;
    public Transform explosion_0;
    public Transform factory;
    public Transform _camera;
    public Transform parachute;

    public Material death_car_mat;
    public Patches script_path;

    public List<Transform> man = new List<Transform>();
    public List<Transform> vehicle = new List<Transform>();
    public List<Transform> place_death = new List<Transform>();

    public Transform player;
    public RCC_Skidmarks SkidmarksMenager;

    private float hele_timer;

    private Vector3 tempVector;
    public Vector3 Vector(float x, float y, float z)
    {
        tempVector.x = x;
        tempVector.y = y;
        tempVector.z = z;
        return tempVector;
    }

    void Start()
    {
        Application.targetFrameRate = 60;
        language = PlayerPrefs.GetInt("language");
        car_damage = PlayerPrefs.GetInt("car_damage");
        //car_colorran=PlayerPrefs.GetInt("car_color");
        car_count = PlayerPrefs.GetInt("car_count");
        //minimap_sc=GameObject.Find("MiniMap").GetComponent(sc_minimap);//temp commit
        //EnabledFactory();
        PlayerPrefs.SetInt("house0", 1);
        if (!PlayerPrefs.HasKey("start_house")) PlayerPrefs.SetInt("start_house", 0);
        CreateCar();
        GetComponent<Player>().player.position = spawn_player_point[PlayerPrefs.GetInt("start_house")].position;
        GetComponent<Player>().player.eulerAngles = spawn_player_point[PlayerPrefs.GetInt("start_house")].eulerAngles;
        _camera.eulerAngles = spawn_player_point[PlayerPrefs.GetInt("start_house")].eulerAngles;

        player = GetComponent<Player>().player;
    }//Start

    void Update()
    {
        if (helecopter_active[0] && !helecopter[0])
        {
            hele_timer += Time.deltaTime;
            if (hele_timer > 30)
            {
                hele_timer = 0;
                CreateHelecopter(0);
            }
        }
    }//Update



    public void CreatePD(Transform _transform, Transform _killer)
    {
        bool temp_return = false;
        if (place_death.Count > 0)
        {
            Transform temp_pd;
            float temp_distance;
            for (var i = 0; i < place_death.Count; i++)
            {
                temp_pd = place_death[i];
                if (temp_pd)
                {
                    temp_distance = Vector3.Distance(_transform.position, temp_pd.position);
                    if (temp_distance < 100 && _killer == temp_pd.GetComponent<PlaceDeath>().killer)
                    {
                        temp_pd.GetComponent<PlaceDeath>().car_count += 1;
                        temp_pd.position = FindBuildPoint(_transform.position, temp_pd);
                        i = 1000;
                        temp_return = true;
                    }//temp_distance
                }//temp_pd
            }//for
        }//Count

        if (!temp_return)
        {
            Transform temp_object = Instantiate(place_death_ob);
            temp_object.position = FindBuildPoint(_transform.position, temp_object);
            temp_object.GetComponent<PlaceDeath>().man = _transform;
            if (_killer)
            {
                temp_object.GetComponent<PlaceDeath>().killer = _killer;
                _killer.GetComponent<Man>().place_death = temp_object;
            }//_killer
            place_death.Add(temp_object);
        }//temp_return
    }//CreatePD

    public Vector3 FindBuildPoint(Vector3 _pos, Transform _transform)
    {
        Patches temp_patch_sc = GetComponent<Patches>();
        ClassPointMan temp_point;
        ClassPointMan temp_near_point = new ClassPointMan();
        float temp_distance;
        float temp_distance_big = 20;
        bool temp_find_point = false;
        Vector3 temp_position = _pos;

        for (var i = 0; i < temp_patch_sc.point_man_build.Count; i++)
        {
            temp_point = temp_patch_sc.point_man_build[i];
            temp_distance = Vector3.Distance(_pos, temp_point._position);
            if (temp_distance < temp_distance_big)
            {
                temp_distance_big = temp_distance;
                temp_near_point = temp_patch_sc.point_man_build[i];
                temp_find_point = true;
            }
        }//for
        if (temp_find_point && temp_near_point.controll_point.Count != 0)
        {
            _transform.GetComponent<PlaceDeath>().have_point = true;
            for (var j = 0; j < temp_near_point.controll_point.Count; j++)
            {
                _transform.GetComponent<PlaceDeath>().near_point.Add(temp_patch_sc.point_man_build[temp_near_point.controll_point[j]]);
            }//for
            ClassPointMan temp_point1 = temp_patch_sc.point_man_build[temp_near_point.controll_point[Random.Range(0, temp_near_point.controll_point.Count)]];
            temp_position = temp_point1._position;
        }
        return temp_position;
    }//FindBuildPoint

    public void GetPositionKiller(Transform _transform)
    {
        if (_transform)
        {
            Transform temp_pd = _transform.GetComponent<Man>().place_death;
            if (temp_pd)
            {
                temp_pd.position = FindBuildPoint(_transform.position, temp_pd);
            }//place_death
        }//_transform
    }//GetPosition



    public void CreateMinimapObject(int _num, Transform _object, Vector3 _pos)
    {
        //minimap_sc.CreateMinimapObject(_num, _object, _pos);
    }//CreateMinimapObject

    public void DeleteMinimapObject(Transform _object, Transform _minimap_object)
    {
        //minimap_sc.DeleteMinimapObject(_object, _minimap_object);
    }//DeleteMinimapObject

    public void DeleteAllMinimapObject()
    {
        //minimap_sc.DeleteAllMinimapObject();
    }//DeleteAllMinimapObject


    public void CreateCar()
    {
        for (var i = 0; i < spawn_car_point[PlayerPrefs.GetInt("start_house")].childCount; i++)
        {
            int temp_num = PlayerPrefs.GetInt("car_" + i);
            if (temp_num != 0)
            {//PlayerPrefs.SetInt("car_"+i,0);
                Instantiate(GetComponent<Info>().car_shop[temp_num], spawn_car_point[PlayerPrefs.GetInt("start_house")].GetChild(i).position, spawn_car_point[PlayerPrefs.GetInt("start_house")].GetChild(i).rotation);
            }//PlayerPrefs
        }//for
    }//CreateCar




    public void CreateHelecopter(int _num)
    {
        helecopter[_num] = Instantiate(helecopter_ob[_num], helecopter_point[_num].position, helecopter_point[_num].rotation) as Transform;
        helecopter_active[_num] = true;
        Transform temp_man = Instantiate(GetComponent<Info>().man_ob[25]);
        temp_man.position = Vector(temp_man.position.x, -10000, temp_man.position.z);
        temp_man.GetComponent<Man>().SitVehicle(helecopter[_num], helecopter[_num].GetComponent<Vehicle>().place[0], false);
        temp_man.GetComponent<Man>().dellete = false;
        temp_man.GetComponent<Man>().game_sc = this;
        temp_man.GetComponent<Man>().game_sc = this;
    }//CreateHelecopter

    public void Death(int _man, Transform _transform)
    {
        GetComponent<VehicleCreator>().MansDeath.Add(_transform);
        AudioSource.PlayClipAtPoint(sound_death[_man].sound[Random.Range(0, sound_death[_man].sound.Count)], _transform.position, 1);
        float temp_distance;
        Man temp_script;
        for (var i = 0; i < man.Count; i++)
        {
            temp_script = man[i].GetComponent<Man>();
            if (man[i] != _transform && man[i] != player && !temp_script.death && temp_script.doing != "sit_vehicle")
            {
                temp_distance = Vector3.Distance(man[i].position, _transform.position);
                if (temp_distance < 20)
                {
                    if (man[i].GetComponent<Band>()) man[i].GetComponent<Man>().Invoke("VoiceBandDeath", Random.Range(1.0f, 5.0f));
                    else man[i].GetComponent<Man>().Invoke("VoiceDeath", Random.Range(1.0f, 5.0f));
                }//temp_distance
            }//man
        }//for
    }//Death
}
