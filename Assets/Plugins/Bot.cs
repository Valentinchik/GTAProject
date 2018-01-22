using UnityEngine;
using System.Collections.Generic;

public class Bot : MonoBehaviour
{
    public ClassPointMan point = new ClassPointMan();
    public ClassPointMan old_point;
    public Transform target;
    private Animator animator;

    public bool other_doing;
    public bool have_point = true;

    public Game game_sc;
    private Man man_script;
    private Weapon weapon_script;
    private Patches patch_script;
    public string doing = "idle";
    public Vector3 target_pos;
    private Vector3 global_target_pos;
    private Vector3 target_angle;
    private float target_distance;
    private float timer_step;
    private float timer_step_max;
    public float angle;
    private List<int> random_point = new List<int>();
    private List<ClassPointMan> point_man = new List<ClassPointMan>();


    void Start()
    {
        animator = GetComponent<Animator>();
        if (!game_sc) game_sc = GameObject.Find("Game").GetComponent<Game>();
        patch_script = game_sc.script_path;
        man_script = GetComponent<Man>();
        weapon_script = GetComponent<Weapon>();
        timer_step_max = Random.Range(0, 2.0f);
        man_script.speed_max = 1;
        Invoke("LateStart", 0.001f);
        Invoke("PlayerNear", Random.Range(1.0f, 5.0f));
    }//Start

    void LateStart()
    {
        //man_script.FindVehicle();
    }//LateStart

    void Update()
    {//Debug.DrawLine(transform.position+Vector3(0,1,0),transform.TransformPoint(Vector3( 1,1,2)*1), Color.red, 0.05f, false);

        if (man_script.killer && weapon_script && !weapon_script.enabled && !man_script.killer.GetComponent<Man>().death)
        {
            float temp_distance = Vector3.Distance(man_script.killer.position, transform.position);
            if (temp_distance < 10)
            {
                Vector3 temp_angle = Quaternion.LookRotation(man_script.killer.position - transform.position).eulerAngles;
                if (temp_distance > 1.5f)
                {
                    man_script.Run(Vector3.forward, temp_angle.y, true);
                }//temp_distance
                else man_script.Fight(Random.Range(1, 4), temp_angle.y);
                other_doing = true;
            }//temp_distance
            else
                other_doing = false;
        }//enemy


        if (!man_script.other_doing && !other_doing)
        {
            timer_step += Time.deltaTime;
            if (timer_step > timer_step_max)
            {
                timer_step = 0;
                timer_step_max = Random.Range(5.0f, 20.0f);
                int random_doing = Random.Range(0, 5);
                if (random_doing == 0) { doing = "idle"; timer_step_max = Random.Range(5.0f, 10.0f); }
                else if (random_doing > 0)
                {
                    doing = "run";
                }
            }//timer_step

            if (doing == "run")
            {
                target_angle = Quaternion.LookRotation(target_pos - transform.position).eulerAngles;
                man_script.Run(Vector3.forward, target_angle.y, true);
                target_distance = Vector3.Distance(new Vector3(target_pos.x, 0, target_pos.z), new Vector3(transform.position.x, 0, transform.position.z));
                if (target_distance < 0.5)
                {
                    if (have_point)
                    {
                        NextPoint();
                    }
                    else
                    {
                        doing = "idle";
                    }
                }
            }//run
        }//other_doing
    }//Update

    public void FindNearPoint(int _build)
    {
        Patches temp_patch_script = GameObject.Find("Game").GetComponent<Patches>();
        if (_build == 1) { point_man = temp_patch_script.point_man; }
        else if (_build == 2) { point_man = temp_patch_script.point_man_build; }

        if (point_man.Count > 0)
        {
            ClassPointMan temp_point;
            ClassPointMan temp_near_point = null;
            float temp_distance_big = 1000;
            float temp_distance;

            for (var i = 0; i < point_man.Count; i++)
            {
                temp_point = point_man[i];
                temp_distance = Vector3.Distance(temp_point._position, transform.position);
                if (temp_distance < temp_distance_big)
                {
                    temp_distance_big = temp_distance;
                    temp_near_point = temp_point;
                }
            }//for
            if (temp_near_point != null)
            {
                GetPoint(temp_near_point);
            }//temp_near_point
        }//Count
    }//FindNearPoint

    public void NextPoint()
    {
        if (point.near_point.Count <= 0)
        {
            FindNearPoint(1); return;
        }
        int temp_point;
        random_point.Clear();
        if (point.near_point.Count > 1)
        {
            for (var i = 0; i < point.near_point.Count; i++)
            {
                if (point.near_point[i] != old_point.index) { random_point.Add(point.near_point[i]); }
            }//for
            temp_point = random_point[Random.Range(0, random_point.Count)];
        }//Count
        else { temp_point = point.near_point[0]; }

        GetPoint(point_man[temp_point]);
    }//NextPoint


    public void GetPoint(ClassPointMan _point)
    {
        old_point = point;
        point = _point;
        target_pos = point._position;
        target_pos.x += Random.Range(-point.distance, point.distance); target_pos.z += Random.Range(-point.distance, point.distance);
        Doing(old_point);
    }//GetPoint

    public void GetThisPoint(ClassPointMan _point, bool _build)
    {
        Patches temp_patch_script = GameObject.Find("Game").GetComponent<Patches>();
        if (_build) { point_man = temp_patch_script.point_man_build; }
        else { point_man = temp_patch_script.point_man; }
        GetPoint(_point);
    }//GetThisPoint


    public void Doing(ClassPointMan _point)
    {
        if (_point.doing == 0) { return; }
        else if (_point.doing == 1) { doing = "idle"; timer_step_max = Random.Range(10.0f, 20.0f); }
        else
        {
            doing = "idle";
            timer_step = 0;
            if (_point.doing == 2)
            {
                timer_step_max = Random.Range(10.0f, 20.0f);
                man_script.Doing(Random.Range(1, 4), timer_step_max, Vector3.zero, Vector3.zero);
            }
            else if (_point.doing == 3)
            {
                timer_step_max = Random.Range(10.0f, 20.0f);
                man_script.Doing(4, timer_step_max, _point.rotation, _point._position);
            }
            else if (_point.doing == 4)
            {
                timer_step_max = Random.Range(10.0f, 20.0f);
                man_script.Doing(5, timer_step_max, Vector3.zero, Vector3.zero);
            }
        }//else

    }//Doing



    public void PlayerNear()
    {
        if (GetComponent<Band>() || man_script.enemy == game_sc.player || man_script.killer == game_sc.player) return;
        Invoke("PlayerNear", Random.Range(1.0f, 5.0f));
        float temp_distance = Vector3.Distance(game_sc.player.position, transform.position);
        if (temp_distance < 2) man_script.Voice(0, 100);
    }//PlayerNear
}
