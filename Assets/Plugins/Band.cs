using UnityEngine;
using System.Collections;

public class Band : MonoBehaviour
{

    public int[] weapon;

    public bool weapon_give = true;

    private Game game_sc;
    private Man man_script;
    private Bot bot_script;
    private Man man_script_enemy;
    private Man man_script_boss;
    private Weapon weapon_script;
    private Vector3 target_angle;
    private Vector3 enemy_angle;
    private float enemy_distance;
    public bool fire;
    private float see_range;
    private int bullets;
    public Transform enemy;
    public Transform boss;
    private Vector3 boss_position;

    void Start()
    {
        man_script = GetComponent<Man>();
        game_sc = man_script.game_sc;
        if (!game_sc) game_sc = GameObject.Find("Game").GetComponent<Game>();
        bot_script = GetComponent<Bot>();
        weapon_script = GetComponent<Weapon>();
        //bot_script.have_point=false;
        boss_position = new Vector3(Random.Range(-2, 2), 0, Random.Range(-2, 2));
        Invoke("FindEnemy", 1);
        //Invoke("AfterStart", 0.01f);
        //weapon_script.WeaponGive(0,false,0,0);


        if (weapon.Length > 0) { weapon_script.WeaponGive(weapon[Random.Range(0, weapon.Length)], false, 0, 0); }
        if (man_script.my_vehicle) { weapon_script.WeaponSelect(1); }
        weapon_script.WeaponSelect(weapon_script.weapon_index);
    }//Start

    void Update()
    {
        if (fire && enemy && man_script.doing != "sit_vehicle" && man_script.doing != "go_to_vehicle")
        {
            bot_script.other_doing = true;
            enemy_angle = Quaternion.LookRotation(man_script_enemy.bip_target.position - man_script.bip_target.position).eulerAngles;
            weapon_script.RotateTo(Functions.AngleSingle180(enemy_angle.x), enemy_angle.y);
            weapon_script.target_pos = man_script_enemy.bip_target.position;
            if (!weapon_script.fire && Functions.AngleSingle180Abs(transform.eulerAngles.y - enemy_angle.y) < 10)
            {
                if (bullets < Mathf.Ceil(200 / enemy_distance) / weapon_script.weapon[weapon_script.weapon_index].bot_rate)
                {
                    weapon_script.fire = true;
                    if (weapon_script.now_return < weapon_script.max_return) { bullets += 1; }
                }//fire_rate
                else if (weapon_script.now_return <= weapon_script.min_return) { bullets = 0; }
            }
        }//fire
        if (boss)
        {
            if (bot_script.have_point) bot_script.have_point = false;
            if (!man_script_boss) { man_script_boss = boss.GetComponent<Man>(); }

            if (man_script.doing != "sit_vehicle")
            {
                if (man_script_boss.doing == "sit_vehicle" && man_script.doing != "go_to_vehicle")
                {
                    man_script.SitTheVehicle(man_script_boss.vehicle, false, 0, true);
                }//go_to_vehicle
                if (man_script.doing == "go_to_vehicle" && man_script_boss.vehicle != man_script.vehicle) { man_script.go_to_car = false; man_script.Move(); }
                if (!fire)
                {
                    float temp_distance = Vector3.Distance(transform.position, boss.position);
                    if (temp_distance > 3)
                    {
                        bot_script.target_pos = boss.position + boss_position;
                        bot_script.doing = "run";
                        if (temp_distance <= 6)
                        {
                            man_script.runing = false;
                            man_script.speed_max = 1;
                        }//temp_distance
                        else if (temp_distance > 6 && temp_distance <= 20)
                        {
                            man_script.runing = true;
                            man_script.speed_max = 1;
                        }//temp_distance
                        else if (temp_distance > 20)
                        {
                            man_script.runing = true;
                            man_script.speed_max = 2;
                        }//temp_distance
                    }//temp_distance
                }//fire
            }//sit_vehicle

            else if (man_script.doing == "sit_vehicle")
            {
                if (man_script_boss.vehicle.GetComponent<Vehicle>().place[0].man == transform && !man_script_boss.vehicle.GetComponent<VehicleBot>().racer)
                {
                    man_script_boss.vehicle.GetComponent<VehicleBot>().racer = true;
                }

                if (man_script_boss.doing != "sit_vehicle" && man_script.doing != "go_to_vehicle")
                {
                    man_script.GoOutVehicle();
                }//sit_vehicle
            }//sit_vehicle
        }//boss
    }//Update

    public void FindEnemy()
    {
        Invoke("FindEnemy", 1);
        if (man_script.doing == "sit_vehicle") { return; }
        Man temp_enemy_sc;
        ClassWeapon temp_weapon = weapon_script.weapon[weapon_script.weapon_index];
        Transform temp_enemy;
        Transform temp_near_enemy = null;
        float temp_distance_big = temp_weapon.range;
        float temp_distance;
        RaycastHit hit = new RaycastHit();

        if (enemy && man_script_enemy && man_script_enemy.health > 0)
        {
            temp_distance = Vector3.Distance(enemy.position, transform.position);
            if (temp_distance < temp_distance_big && Physics.Linecast(transform.position + new Vector3(0, 1.7f, 0), man_script_enemy.bip_target.position, out hit))
            {
                if (hit.transform == enemy || hit.transform.root == man_script_enemy.vehicle || (hit.collider.name != "Terrain" && hit.collider.material.name == "Glass (Instance)"))
                {
                    enemy_distance = temp_distance;
                    return;
                }//enemy
                else if (man_script_enemy.doing != "sit_vehicle") { game_sc.GetPositionKiller(enemy); }
            }//temp_distance
        }//enemy


        enemy = null;
        for (var i = 0; i < game_sc.man.Count; i++)
        {
            temp_enemy = game_sc.man[i];
            temp_enemy_sc = temp_enemy.GetComponent<Man>();
            if (temp_enemy && temp_enemy_sc && temp_enemy_sc.health > 0 && ((man_script.team != 0 && temp_enemy_sc.team != 0 && temp_enemy_sc.team != man_script.team) ||
             (boss && (man_script_boss.enemy == temp_enemy || (man_script_boss.danger && temp_enemy_sc.cop))) || (temp_enemy != boss && (temp_enemy_sc.team != man_script.team || man_script.team == 0) && (man_script.killer == temp_enemy || man_script.enemy == temp_enemy))))
            {
                temp_distance = Vector3.Distance(temp_enemy.position, transform.position);
                if (temp_distance < temp_distance_big && Physics.Linecast(transform.position + new Vector3(0, 1.7f, 0), temp_enemy_sc.bip_target.position, out hit))
                {
                    if (hit.transform == temp_enemy || hit.transform.root == temp_enemy || hit.transform.root == temp_enemy_sc.vehicle || (hit.collider.name != "Terrain" && hit.collider.material.name == "Glass (Instance)"))
                    {
                        temp_near_enemy = temp_enemy;
                        temp_distance_big = temp_distance;
                    }//temp_enemy
                }//temp_distance
            }//danger
        }//for

        if (temp_near_enemy != null)
        {
            if (weapon_script.weapon_index == 0 && weapon_script.weapon.Count > 1) { weapon_script.WeaponSelect(1); return; }
            fire = true;
            enemy = temp_near_enemy;
            man_script_enemy = enemy.GetComponent<Man>();
            enemy_distance = temp_distance_big;
            bot_script.have_point = false;
        }//temp_near_enemy
        else if (fire)
        {
            fire = false;
            if (!boss) bot_script.have_point = true;
            bot_script.other_doing = false;
            weapon_script.EndFire();
        }

    }//FindEnemy
}
