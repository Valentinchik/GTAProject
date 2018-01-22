using UnityEngine;
using System.Collections;

public class Cop : MonoBehaviour
{
    public int[] weapon;
    private Game game_sc;
    private Man man_script;
    private Bot bot_script;
    private Man man_script_enemy;
    private Weapon weapon_script;
    private Vector3 target_angle;
    private Vector3 enemy_angle;
    private Vector3 old_pos;
    private float enemy_distance;
    private bool fire;
    private bool go_to_old_pos;
    private float see_range;
    private int bullets;

    private Transform enemy;


    void Start()
    {
        game_sc = GameObject.Find("Game").GetComponent<Game>();
        man_script = GetComponent<Man>();
        bot_script = GetComponent<Bot>();
        weapon_script = GetComponent<Weapon>();

        //weapon_script.WeaponGive(0,false,0,0);
        weapon_script.WeaponGive(weapon[Random.Range(0, weapon.Length)], false, 0, 0);
        if (man_script.my_vehicle) { weapon_script.WeaponSelect(1); }
        weapon_script.WeaponSelect(weapon_script.weapon_index);

        Invoke("FindEnemy", 1);
        //Invoke("AfterStart", 0.01f);
    }//Start

    void Update()
    {
        if (fire && enemy)
        {
            float temp_distance = Vector3.Distance(enemy.position, transform.position);
            bot_script.other_doing = true;
            man_script_enemy.danger_timer = 0;
            enemy_angle = Quaternion.LookRotation(man_script_enemy.bip_target.position - man_script.bip_target.position).eulerAngles;
            if (man_script.doing == "swim") { man_script.Run(Vector3.forward, enemy_angle.y, true); }
            weapon_script.RotateTo(Functions.AngleSingle180(enemy_angle.x), enemy_angle.y);
            weapon_script.target_pos = man_script_enemy.bip_target.position;
            if (temp_distance < weapon_script.weapon[weapon_script.weapon_index].range)
            {
                if (!weapon_script.fire && Functions.AngleSingle180Abs(transform.eulerAngles.y - enemy_angle.y) < 10)
                {
                    if (bullets < Mathf.Ceil(200 / enemy_distance) / weapon_script.weapon[weapon_script.weapon_index].bot_rate)
                    {
                        weapon_script.fire = true;
                        if (weapon_script.now_return < weapon_script.max_return) { bullets += 1; }
                    }//fire_rate
                    else if (weapon_script.now_return <= weapon_script.min_return) { bullets = 0; }
                }
            }//temp_distance
            else
            {
                if (man_script.fire) { weapon_script.EndFire(); }
                man_script.runing = true;
                man_script.Run(Vector3.forward, enemy_angle.y, true);
            }
        }//fire
        else if (go_to_old_pos)
        {
            float temp_angle = Quaternion.LookRotation(old_pos - transform.position).eulerAngles.y;
            float temp_distance1 = Vector3.Distance(old_pos, transform.position);
            man_script.runing = true;
            man_script.Run(Vector3.forward, temp_angle, true);
            if (temp_distance1 < 1)
            {
                man_script.runing = false;
                go_to_old_pos = false;
                bot_script.other_doing = false;
            }
        }//go_to_old_pos
    }//Update

    public void FindEnemy()
    {
        Invoke("FindEnemy", 1);
        Man temp_enemy_sc;
        ClassWeapon temp_weapon = weapon_script.weapon[weapon_script.weapon_index];
        Transform temp_enemy;
        Transform temp_near_enemy = null;
        float temp_distance_big = 100;
        float temp_distance;
        RaycastHit hit;


        if (temp_weapon.range > temp_distance_big) { temp_distance_big = temp_weapon.range; }
        if (enemy && man_script_enemy && man_script_enemy.health > 0)
        {
            temp_distance = Vector3.Distance(enemy.position, transform.position);
            if (temp_distance < temp_distance_big && Physics.Linecast(transform.position + game_sc.Vector(0, 1.7f, 0), man_script_enemy.bip_target.position, out hit))
            {
                if (hit.transform == enemy || hit.transform.root == man_script_enemy.vehicle || (hit.collider.name != "Terrain" && hit.collider.material.name == "Glass (Instance)"))
                {
                    enemy_distance = temp_distance;
                    return;
                }//enemy
                else { game_sc.GetPositionKiller(enemy); }
            }//temp_distance
        }//enemy


        enemy = null;
        for (var i = 0; i < game_sc.man.Count; i++)
        {
            temp_enemy = game_sc.man[i];
            temp_enemy_sc = temp_enemy.GetComponent<Man>();
            if (temp_enemy && temp_enemy_sc && temp_enemy_sc.health > 0 && temp_enemy_sc.danger)
            {
                temp_distance = Vector3.Distance(temp_enemy.position, transform.position);
                if (temp_distance < temp_distance_big && Physics.Linecast(transform.position + game_sc.Vector(0, 1.7f, 0), temp_enemy_sc.bip_target.position, out hit))
                {
                    if (hit.transform == temp_enemy || hit.transform.root == temp_enemy || hit.transform.root == temp_enemy_sc.vehicle || (hit.collider.name != "Terrain" && hit.collider.material.name == "Glass (Instance)"))
                    {
                        temp_near_enemy = temp_enemy;
                        temp_distance_big = temp_distance;
                        old_pos = temp_enemy.position;
                    }//temp_enemy
                }//temp_distance
            }//danger
        }//for

        if (temp_near_enemy != null)
        {
            if (weapon_script.weapon_index == 0) { weapon_script.WeaponSelect(1); return; }
            fire = true;
            enemy = temp_near_enemy;
            man_script_enemy = enemy.GetComponent<Man>();
            man_script_enemy.Danger();
            enemy_distance = temp_distance_big;
            old_pos = enemy.position;
        }//temp_near_enemy
        else if (fire)
        {
            fire = false;
            go_to_old_pos = true;
            weapon_script.EndFire();
        }

    }//FindEnemy
}
