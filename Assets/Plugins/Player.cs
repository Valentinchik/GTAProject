using UnityEngine;
using System.Collections.Generic;
using System.Collections;
using UnityEngine.UI;

public class ClassHelp
{
    public string text;
    public GUIStyle gstyle;
}//ClassHelp

public class Player : MonoBehaviour
{
    public bool mobile;
    public MainInput MInput;
    public InputManager input_man_sc;
    public WeaponInfo script_weapinfo;
    public Transform mobile_input;
    public Texture2D[] cross_texture;
    public Texture2D[] cross_texture_vehicle;
    public Texture2D health_bar_tex_0;
    public Texture2D health_bar_tex_1;
    public Texture2D health_bar_tex_2;
    public Texture2D health_bar_tex_3;
    public Texture2D tex_hit;
    public Texture2D tex_naru;
    public Texture2D tex_naru_red;
    public Texture2D tex_healthbar1;
    public Texture2D tex_healthbar2;
    public Texture2D[] tex_wanted_stars;
    public GUIStyle gs_cross_dis;
    public GUIStyle gs_bullets;
    public GUIStyle gstyle_0;
    public GUIStyle gstyle_1;
    public GUIStyle gstyle_2;
    public GUIStyle gstyle_3;
    public GUIStyle gstyle_4;
    public GUIStyle gstyle_5;
    public GUIStyle gstyle_help;
    public string[] help_text;
    public int[] weapon;
    public gui_label label_money;
    public gui_label label_health;
    public gui_label label_armor;
    public gui_label label_weapon_name;
    public gui_label label_bullets;
    public gui_label label_weapon_image;
    public gui_label label_stars;
    public gui_label label_cross;
    public gui_label label_price;
    public gui_label label_death;

    public Button but_parachute;

    public gui_inventory inv_band;

    public Transform player;
    public List<ClassHelp> help = new List<ClassHelp>();
    public List<Transform> band = new List<Transform>();
    public int money = 100;
    public int boom = 100;

    public Transform enemy;
    private Transform _camera;
    private Transform camera_children;
    private Transform camera_transform;
    private Game game_sc;
    private CameraScript script_cam;
    [HideInInspector]
    public Man man_script;
    private Weapon weapon_script;
    private Animator animator;
    private bool fire;
    private bool hit;
    private bool help_active;
    private bool aim;
    private float help_timer;
    private float fire_timer;
    private float add_money_timer;
    private int cross_width = 15;
    private int cross_height = 4;
    private int grenade;
    private int add_money;
    private Vector2 hit_point_turret;
    private float target_distance;
    private int camera_int;
    private string help_text2;
    private string text_0;
    public string price;
    private Vector2 move_direction;
    public Vector3 temp_vel_angle;
    public Vector3 temp_tr_angle;
    public float temp_diff_angle;
    public Transform Target;

    public Transform TargetAim;
    public Vehicle VehicleAim;
    public Man ManAim;
    private bool AimFix = false;
    private bool TargetCar = false;

    public float MaxTimeWanted = 10;
    [HideInInspector]
    public bool WantCor = false;
    [HideInInspector]
    public float TimeWanted = 0;

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
        //GetComponent("InputManager").game=transform;
        money = PlayerPrefs.GetInt("money");
        //MoneyAdd(10000);
        mobile_input = GameObject.Find("MobileInput").transform;
        input_man_sc = mobile_input.GetComponent<InputManager>();
        script_weapinfo = GetComponent<WeaponInfo>();

        game_sc = GetComponent<Game>();
        input_man_sc = mobile_input.GetComponent<InputManager>();
        man_script = player.GetComponent<Man>();
        weapon_script = player.GetComponent<Weapon>();
        _camera = GameObject.Find("Camera").transform;
        camera_children = _camera.FindChild("camera_child");
        camera_transform = camera_children.FindChild("Main Camera");
        script_cam = _camera.GetComponent<CameraScript>();
        animator = player.GetComponent<Animator>();
        player.GetComponent<Man>().player = true;
        script_cam.target = player;
        Invoke("LateStart", 0.01f);

        text_0 =
        "Р’РљР›/Р’Р«РљР› РїРѕРґСЃРєР°Р·РєСѓ-------------I " +
        "РџР•РЁРљРћРњ                           " +
        "Р‘РµРі------------------------------------LShift " +
        "РџСЂС‹Р¶РѕРє----------------------------------Space " +
        "РЈРґР°СЂС‹ СЂСѓРєР°РјРё-------------------Р›РљРњ,РџРљРњ " +
        "РЈРґР°СЂС‹ РЅРѕРіР°РјРё-------------РљРѕР»РµСЃРёРєРѕ РјС‹С€Рё " +
        "Р’С‹Р±РѕСЂ РѕСЂСѓР¶РёСЏ-------------РљРѕР»РµСЃРёРєРѕ РјС‹С€Рё " +
        "РћРіРѕРЅСЊ----------------------------Р›РљРњ " +
        "РџСЂРёР±Р»РёР·РёС‚СЊ/РџСЂРёС†РµР»----------------РџРљРњ " +
        "РџРµСЂРµР·Р°СЂСЏРґРёС‚СЊ-----------------------R " +
        "РњРђРЁРРќРђ                               " +
        "РЎРµСЃС‚СЊ/Р’С‹Р№С‚Рё РёР· РјР°С€РёРЅС‹-------------Р• " +
        "РљР°РјРµСЂР° РЅР°Р·Р°Рґ---------------------LShift " +
        "РЎРјРµРЅР° РєР°РјРµСЂС‹--------------------------V " +
        "Р’РљР›/Р’Р«РљР› РґРІРёРіР°С‚РµР»СЊ----------------------P " +
        "Р’РљР›/Р’Р«РљР› СЃРІРµС‚-------------------------------L " +
        "Р’РљР›/Р’Р«РљР› РјРёРіР°Р»РєСѓ------------------------H " +
        "РџСЂРёРєР°Р·Р°С‚СЊ РІРѕРґРёС‚РµР»СЋ РіРЅР°С‚СЊ/РџСЂРёРєР°Р·Р°С‚СЊ РІРѕРґРёС‚РµР»СЋ РµС…Р°С‚СЊ РјРµРґР»РµРЅРЅРѕ-----------Рљ ";

        Invoke("Aim", 5);
        Invoke("HealthAdd", 5);
        //HelpActive(text_0);
        AddBand(null, true);
    }//Start

    void LateStart()
    {
        weapon_script.WeaponGive(0, false, 0, 0);
        //weapon_script.WeaponGive(20,false,0,0);
        for (var i = 0; i < weapon.Length; i++)
        {
            if (PlayerPrefs.GetInt("weapon_" + weapon[i]) != 0)
            {
                weapon_script.WeaponGive(weapon[i], false, 0, 0);
                weapon_script.weapon[weapon_script.weapon.Count - 1].clips = PlayerPrefs.GetInt("weapon_" + weapon[i]);
            }
            //PlayerPrefs.SetInt("weapon_"+weapon[i],0);
        }//for
        //if (PlayerPrefs.GetInt("armor") > 0) man_script.GiveArmor(PlayerPrefs.GetInt("armor"));
        if (PlayerPrefs.GetInt("parachute") == 1) man_script.GiveParachute();

        weapon_script.WeaponSelect(0);
    }//LateStart

    void Update()
    {
        PlayerController();
        AimFunctions();
        /*if (input_man_sc.money_bonus > 0)
        {
            MoneyAdd(input_man_sc.money_bonus);
            input_man_sc.money_bonus = 0;
        }//money_bonus
        label_money.text = money.ToString();
        label_health.text = (man_script.health / (man_script.max_health / 100)).ToString();
        if (man_script.armor > 0) label_armor.text = (man_script.armor / (man_script.max_armor / 100)).ToString();

        if (man_script.armor > 0 && !label_armor.enabled) label_armor.enabled = true;
        if (man_script.armor <= 0 && label_armor.enabled) label_armor.enabled = false;
        if (man_script.health > 0 && !label_health.enabled) label_health.enabled = true;
        if (man_script.health <= 0 && label_health.enabled) label_health.enabled = false;

        if (man_script.doing != "sit_vehicle" && weapon_script.weapon.Count > 0 &&
        (weapon_script.weapon[weapon_script.weapon_index].cross == 0 || (!mobile && !Input.GetKey(KeyCode.Mouse1)) || (mobile && !aim)))
        {
            if (!label_cross.enabled) label_cross.enabled = true;
        }
        else if (label_cross.enabled) { label_cross.enabled = false; }

        if (weapon_script.weapon.Count > 0)
        {
            if (weapon_script.weapon_index > 0) label_bullets.text = weapon_script.weapon[weapon_script.weapon_index].bullets + " / " + weapon_script.weapon[weapon_script.weapon_index].clips;
            else label_bullets.text = "";
            label_weapon_name.text = weapon_script.weapon[weapon_script.weapon_index]._name;
            label_weapon_image.texture = weapon_script.weapon[weapon_script.weapon_index].image;
        }//Count

        if (man_script.danger)
        {
            if (!label_stars.enabled) label_stars.enabled = true;
            label_stars.texture = tex_wanted_stars[(int)Mathf.Ceil(man_script.wanted_score / 100)];
            //GUI.DrawTexture(Rect(Screen.width-temp_tex_width/2,temp_tex_height+temp_tex_height/8*3,temp_tex_width/2,temp_tex_height/8),tex_wanted_stars[Mathf.Ceil(man_script.wanted_score/100)]);
        }//danger
        else if (label_stars.enabled) label_stars.enabled = false;

        if (man_script.wanted_score > 500) game_sc.helecopter_active[0] = true;
        if (man_script.enabled && !man_script.death)
        {
            input_man_sc.money.text = money + " $";

            if (add_money != 0)
            {
                add_money_timer += Time.deltaTime;
                if (add_money > 0)
                {
                    input_man_sc.money_add.gui_style.normal.textColor = Color.green;
                    input_man_sc.money_add.text = "+" + add_money + " $";
                }//add_money
                else if (add_money < 0)
                {
                    input_man_sc.money_add.gui_style.normal.textColor = Color.red;
                    input_man_sc.money_add.text = add_money + " $";
                }//add_money

                if (!input_man_sc.money_add.enabled) input_man_sc.money_add.enabled = true;
                if (add_money_timer > 3)
                {
                    add_money_timer = 0;
                    add_money = 0;
                    input_man_sc.money_add.enabled = false;

                }//add_money_timer
            }//add_money

            //temp_vel_angle = Quaternion.LookRotation(player.GetComponent<Rigidbody>().velocity.normalized).eulerAngles;
            //temp_tr_angle = Quaternion.LookRotation(player.TransformDirection(Vector3.forward)).eulerAngles;
            //temp_diff_angle = Functions.AngleSingle180(temp_vel_angle.y - temp_tr_angle.y);
            if (man_script.doing != "sit_vehicle")
            {
                if (man_script.parachute)
                {
                    if (man_script.doing == "fall" && !but_parachute.enabled) but_parachute.enabled = true;
                    else if (man_script.doing != "fall" && but_parachute.enabled) but_parachute.enabled = false;
                    if (but_parachute.IsDownPressed()) { man_script.OpenParachute(); but_parachute.enabled = false; }
                }//parachute


                RaycastHit hit1;
                if (Physics.Raycast(Camera.main.transform.position, Camera.main.transform.TransformDirection(Vector3.forward), out hit1, 6))
                {
                    if (hit1.transform.GetComponent<BuyObject>())
                    {
                        if (!input_man_sc.weapon_shop.gameObject.activeSelf) { input_man_sc.weapon_shop.gameObject.SetActive(true); }
                        if (!label_price.enabled) label_price.enabled = true;
                        label_price.text = "(" + hit1.transform.GetComponent<BuyObject>()._name + ") " + hit1.transform.GetComponent<BuyObject>().price + " $";
                        if ((Input.GetKeyDown(KeyCode.B) || input_man_sc.weapon_buy) && money >= hit1.transform.GetComponent<BuyObject>().price)
                        {
                            if (hit1.transform.GetComponent<BuyObject>().armor)
                            {
                                if (man_script.armor >= 500) return;
                                man_script.GiveArmor(500);
                            }//armor
                            if (hit1.transform.GetComponent<BuyObject>().parachute)
                            {
                                if (man_script.parachute) return;
                                man_script.GiveParachute();
                            }//armor
                            else
                            {
                                weapon_script.WeaponGive(hit1.transform.GetComponent<BuyObject>().num, false, 0, 0);
                                if (hit1.transform.GetComponent<BuyObject>().price == 0) { Destroy(hit1.transform.gameObject); }
                                int temp_weapon = GetWeapon(hit1.transform.GetComponent<BuyObject>().num);
                                PlayerPrefs.SetInt("weapon_" + hit1.transform.GetComponent<BuyObject>().num, weapon_script.weapon[temp_weapon].clips);
                                weapon_script.WeaponSelect(temp_weapon);
                            }//else

                            MoneyAdd(-hit1.transform.GetComponent<BuyObject>().price);
                        }//KeyCode
                    }//price
                    else
                    {
                        if (label_price.enabled) label_price.enabled = false;
                        if (input_man_sc.weapon_shop.gameObject.activeSelf) { input_man_sc.weapon_shop.gameObject.SetActive(false); }
                    }
                }//Physics
                else
                {
                    if (label_price.enabled) label_price.enabled = false;
                    if (input_man_sc.weapon_shop.gameObject.activeSelf) { input_man_sc.weapon_shop.gameObject.SetActive(false); }
                }

                

                Vector3 temp_direction = Vector3.zero;
                if (!mobile)
                {
                    if (weapon_script.weapon.Count > 0 && weapon_script.weapon_index != 0)
                    {
                        if (Input.GetKey(KeyCode.Mouse0))
                        {
                            fire = true;
                            fire_timer = 0;
                            weapon_script.RotateTo(0, man_script.transform.eulerAngles.y);
                            RaycastHit hit;
                            Vector3 hit_point = Vector3.zero;

                            Transform shPoint = weapon_script.weapon[weapon_script.weapon_index]._transform.FindChild("shoot_point").transform;
                            if (shPoint && Target && Physics.Raycast(shPoint.position,
                                (TargetCar ? (Target.position + Vector(0, 0.5f, 0)) : ManAim.bip_collider.position) - shPoint.position, out hit, 5000)) { hit_point = hit.point; }
                            else { hit_point = shPoint.TransformPoint(Vector(0, 0, 500)); }
                            
                            weapon_script.target_pos = hit_point;
                            weapon_script.target_pos = hit_point;
                            weapon_script.fire = true;
                        }

                        if (Input.GetKeyUp(KeyCode.Mouse1) || (Input.GetKeyUp(KeyCode.Mouse0) && !Input.GetKey(KeyCode.Mouse1)))
                        {
                            script_cam.NextCamera(true, 0);
                        }
                    }//else
                    else if (Input.GetKeyDown(KeyCode.Mouse0))
                    {
                        fire = true;
                        man_script.Fight(Random.Range(1, 4), _camera.eulerAngles.y);
                    }//else

                    if (Input.GetAxis("Vertical") > 0)
                    {
                        temp_direction = Vector3.forward;
                        if (Input.GetAxis("Horizontal") > 0) { temp_direction = Vector(1, 0, 1); }
                        else if (Input.GetAxis("Horizontal") < 0) { temp_direction = Vector(-1, 0, 1); }
                        man_script.Run(temp_direction, _camera.eulerAngles.y, false);
                    }

                    if (Input.GetAxis("Vertical") < 0)
                    {
                        temp_direction = Vector3.back;
                        if (Input.GetAxis("Horizontal") > 0) { temp_direction = Vector(1, 0, -1); }
                        else if (Input.GetAxis("Horizontal") < 0) { temp_direction = Vector(-1, 0, -1); }
                        man_script.Run(temp_direction, _camera.eulerAngles.y, false);
                    }

                    if (Input.GetAxis("Horizontal") > 0)
                    {
                        temp_direction = Vector3.right;
                        if (Input.GetAxis("Vertical") > 0) { temp_direction = Vector(1, 0, 1); }
                        else if (Input.GetAxis("Vertical") < 0) { temp_direction = Vector(1, 0, -1); }
                        man_script.Run(temp_direction, _camera.eulerAngles.y, false);
                    }

                    if (Input.GetAxis("Horizontal") < 0)
                    {
                        temp_direction = Vector3.left;
                        if (Input.GetAxis("Vertical") > 0) { temp_direction = Vector(-1, 0, 1); }
                        else if (Input.GetAxis("Vertical") < 0) { temp_direction = Vector(-1, 0, -1); }
                        man_script.Run(temp_direction, _camera.eulerAngles.y, false);
                    }

                    if (Input.GetKey(KeyCode.Mouse1))
                    {
                        fire = true;
                        fire_timer = 0;
                    }//Mouse1

                    if (Input.GetKey(KeyCode.LeftShift)) { man_script.runing = true; }
                    if (Input.GetKeyUp(KeyCode.LeftShift)) { man_script.runing = false; }

                    if (Input.GetKeyUp(KeyCode.E) && man_script.doing != "go_to_vehicle" && man_script.doing != "go_out_vehicle") { man_script.FindVehicle(true); }
                    if (Input.GetKeyUp(KeyCode.R)) { weapon_script.Reload(); }
                    if (Input.GetKeyUp(KeyCode.Space)) { man_script.Jump(); }
                    if (Input.GetKeyUp(KeyCode.T)) { man_script.RagDoll(); }
                    if (Input.GetKeyUp(KeyCode.P)) { man_script.AddWantedScore(100); }
                    if (Input.GetKeyUp(KeyCode.V)) { script_cam.NextCamera(false, 1); }
                    if (Input.GetKeyUp(KeyCode.LeftControl)) { if (man_script.speed_max != 1) { man_script.speed_max = 1; } else { man_script.speed_max = 2; } }
                    if (!Input.GetKey(KeyCode.W) && !Input.GetKey(KeyCode.S) && !Input.GetKey(KeyCode.A) && !Input.GetKey(KeyCode.D) && man_script.can_doing == 0) { }
                    if (Input.GetKeyUp(KeyCode.J)) man_script.Damage(200, 0, Vector3.zero, Vector3.zero, null);
                    if (!Input.GetKey(KeyCode.C) && !Input.GetKey(KeyCode.G))
                    {
                        if (Input.GetAxis("Mouse ScrollWheel") > 0 && !weapon_script.reload)
                        {
                            weapon_script.weapon_index += 1;
                            if (weapon_script.weapon_index >= weapon_script.weapon.Count) { weapon_script.weapon_index = 0; }
                            weapon_script.WeaponSelect(weapon_script.weapon_index);
                        }
                        if (Input.GetAxis("Mouse ScrollWheel") < 0 && !weapon_script.reload)
                        {
                            weapon_script.weapon_index -= 1;
                            if (weapon_script.weapon_index < 0) { weapon_script.weapon_index = weapon_script.weapon.Count - 1; }
                            weapon_script.WeaponSelect(weapon_script.weapon_index);
                        }
                    }



                }//mobile
                else
                {
                    if (!input_man_sc.man_control.gameObject.activeSelf) { input_man_sc.man_control.gameObject.SetActive(true); }
                    if (input_man_sc.car_control.gameObject.activeSelf) { input_man_sc.car_control.gameObject.SetActive(false); }

                    if (weapon_script.weapon.Count > 0)
                    {
                        if (input_man_sc.aim) { aim = !aim; }
                        if (aim)
                        {
                            script_cam.NextCamera(true, weapon_script.weapon[weapon_script.weapon_index]._camera);
                            fire = true;
                            fire_timer = 0;
                        }//aim

                        else if (Camera.main.fieldOfView != 60)
                        {
                            script_cam.NextCamera(true, 0);
                        }//Count




                        if (input_man_sc.fire)
                        {
                            fire = true;
                            fire_timer = 0;
                            if (weapon_script.weapon_index > 0)
                            {
                                weapon_script.RotateTo(0, man_script.transform.eulerAngles.y);
                                RaycastHit hit2;
                                Vector3 hit_point2;
                                Transform shPoint = weapon_script.weapon[weapon_script.weapon_index]._transform.FindChild("shoot_point").transform;
                                float i = TargetCar ? 0.5f : 1.5f;
                                if (shPoint && Target && Physics.Raycast(shPoint.position,
                                    (Target.position + Vector(0, i, 0)) - shPoint.position, out hit2, 5000)) { hit_point2 = hit2.point; }
                                else { hit_point2 = shPoint.TransformPoint(Vector(0, 0, 500)); }
                                
                                weapon_script.target_pos = hit_point2;
                                weapon_script.fire = true;
                            }//weapon_index
                            else if (input_man_sc.fire_down) man_script.Fight(Random.Range(1, 4), _camera.eulerAngles.y);
                        }//fire
                    }//else
                    temp_direction = Vector(MInput.ManController.SimpJoyst.HorizintalAxis.Value > 0 ? Mathf.Ceil(MInput.ManController.SimpJoyst.HorizintalAxis.Value) : 
                        -Mathf.Ceil(MInput.ManController.SimpJoyst.HorizintalAxis.Value), 
                        0, MInput.ManController.SimpJoyst.VerticalAxis.Value> 0 ? Mathf.Ceil(MInput.ManController.SimpJoyst.VerticalAxis.Value) : -Mathf.Ceil(MInput.ManController.SimpJoyst.VerticalAxis.Value));
                    temp_direction = new Vector3(MInput.ManController.SimpJoyst.HorizintalAxis.Value, 0, MInput.ManController.SimpJoyst.VerticalAxis.Value).normalized;
                    Vector3 temp_angle = Quaternion.LookRotation(temp_direction).eulerAngles;
                    if (man_script.doing == "go_to_vehicle" && man_script.can_doing < 3 && temp_direction.magnitude > 0.5) { man_script.Move(); }
                    if (temp_direction.magnitude > 0) man_script.RunPlayer(Vector(0,0,1), _camera.eulerAngles.y + temp_angle.y, false);

                    if (input_man_sc.weapon_next && !weapon_script.reload)
                    {
                        weapon_script.weapon_index += 1;
                        if (weapon_script.weapon_index >= weapon_script.weapon.Count) { weapon_script.weapon_index = 0; }
                        weapon_script.WeaponSelect(weapon_script.weapon_index);
                    }
                    else if (input_man_sc.weapon_previous && !weapon_script.reload)
                    {
                        weapon_script.weapon_index -= 1;
                        if (weapon_script.weapon_index < 0) { weapon_script.weapon_index = weapon_script.weapon.Count - 1; }
                        weapon_script.WeaponSelect(weapon_script.weapon_index);
                    }
                    if (input_man_sc.jump) { man_script.Jump(); }
                    if (input_man_sc.sit_car && man_script.doing != "go_to_vehicle" && man_script.doing != "go_out_vehicle") { man_script.FindVehicle(true); }
                    if (input_man_sc.run) { if (man_script.speed_max != 1) { man_script.speed_max = 1; } else { man_script.speed_max = 2; } }
                }//else

                if (fire)
                {
                    fire_timer += Time.deltaTime;
                    if (Target != null)
                    {
                        float i = TargetCar ? 0.5f : 1.5f;
                        weapon_script.RotateTo(Quaternion.LookRotation((Target.position + Vector(0, i, 0)) - man_script.transform.position).eulerAngles.z,
                            Quaternion.LookRotation(Target.position - man_script.transform.position).eulerAngles.y);
                    }
                    if (fire_timer > 3 || man_script.doing == "go_to_vehicle")
                    {
                        fire_timer = 0;
                        fire = false;
                        weapon_script.EndFire();
                        if (man_script.doing == "fight") man_script.FightFalse();
                    }
                }//fire

                if (enemy && fire)
                {
                    float temp_distance = Vector3.Distance(enemy.position, _camera.position);
                    Quaternion temp_angle = Quaternion.LookRotation(enemy.GetComponent<Man>().bip_target.position - _camera.position);
                    Quaternion temp_angle1 = Quaternion.LookRotation(enemy.GetComponent<Man>().bip_target.position - camera_children.position);
                    float temp_angle_diff = 5;
                    if (weapon_script.weapon_index == 0) temp_angle_diff = 30;


                    _camera.eulerAngles = Vector(_camera.eulerAngles.x, Quaternion.Slerp(_camera.rotation, temp_angle1, 0.05f).eulerAngles.y, _camera.eulerAngles.z);
                    script_cam.rotate_y = Quaternion.Slerp(Quaternion.Euler(script_cam.rotate_y, 0, 0), temp_angle1, 0.05f).eulerAngles.x;

                    Vector3 angle_diff = Functions.Angle180Abs(temp_angle1.eulerAngles - camera_children.eulerAngles);
                    if (angle_diff.x > temp_angle_diff || angle_diff.y > temp_angle_diff || enemy.GetComponent<Man>().health <= 0) { enemy = null; }
                }//enemy

            }//sit_vehicle
            else if (man_script.doing == "sit_vehicle" && man_script.vehicle && man_script.vehicle.GetComponent<Vehicle>())
            {
                Vehicle vehicle_sc = man_script.vehicle.GetComponent<Vehicle>();

                if (!mobile)
                {
                    if (script_cam.camera_type.look == 4)
                    {
                        if (Input.GetKeyDown(KeyCode.LeftShift))
                        { camera_children.localEulerAngles = Vector(camera_children.localEulerAngles.x, 180, camera_children.localEulerAngles.z); }
                        else if (Input.GetKeyUp(KeyCode.LeftShift))
                        { camera_children.localEulerAngles = Vector(camera_children.localEulerAngles.x, 0, camera_children.localEulerAngles.z); }
                    }
                    else
                    {
                        if (Input.GetKeyDown(KeyCode.LeftShift)) { camera_transform.localEulerAngles = Vector(camera_transform.localEulerAngles.x, 180, camera_transform.localEulerAngles.z); }
                        else if (Input.GetKeyUp(KeyCode.LeftShift)) { camera_transform.localEulerAngles = Vector(camera_transform.localEulerAngles.x, 180, camera_transform.localEulerAngles.z); }
                    }
                    if (Input.GetKeyUp(KeyCode.V)) { NextCameraVehicle(0, false); }//V
                    if (Input.GetKeyUp(KeyCode.E) && man_script.doing != "go_to_vehicle" && man_script.doing != "go_out_vehicle")
                    {
                        man_script.GoOutVehicle();
                        AllGoOutVehicle(vehicle_sc);
                    }//E
                    if (Input.GetKeyUp(KeyCode.P)) { if (!vehicle_sc.engine_work) { vehicle_sc.EngineStart(); } else { vehicle_sc.EngineStop(); } }
                    if (Input.GetKeyUp(KeyCode.O))
                    {
                        man_script.vehicle.position += Vector(0, 1, 0);
                        man_script.vehicle.localEulerAngles = Vector(man_script.vehicle.localEulerAngles.x, man_script.vehicle.localEulerAngles.y, 0);
                    }//E
                    if (Input.GetKeyUp(KeyCode.H) && vehicle_sc.sirena && !vehicle_sc.sirena.gameObject.activeSelf) { vehicle_sc.sirena.gameObject.SetActive(true); }
                    else if (Input.GetKeyUp(KeyCode.H) && vehicle_sc.sirena && vehicle_sc.sirena.gameObject.activeSelf) { vehicle_sc.sirena.gameObject.SetActive(false); }
                    if (Input.GetKeyUp(KeyCode.J)) man_script.Damage(200, 0, Vector3.zero, Vector3.zero, null);
                    if (vehicle_sc.engine_work && man_script.vehicle_place == vehicle_sc.place[vehicle_sc.place_drive])
                    {

                        vehicle_sc.throttle = Input.GetAxis("Vertical");
                        vehicle_sc.steer = Input.GetAxis("Horizontal");
                        vehicle_sc.rotate.y = _camera.eulerAngles.y;
                        vehicle_sc.rotate.x = _camera.GetComponent<CameraScript>().camera_children.eulerAngles.x;

                        vehicle_sc.rotate.y = _camera.eulerAngles.y;
                        if (Input.GetKey(KeyCode.Space)) { vehicle_sc.StopVehicle(100); }
                    }//place_drive

                }//mobile

                else
                {
                    if (script_cam.camera_type.look == 4)
                    {
                        if (input_man_sc.backCameraButton.IsPressed())
                        {
                            camera_children.localEulerAngles = Vector(camera_children.localEulerAngles.x, 180, camera_children.localEulerAngles.z);
                        }
                        else if (!input_man_sc.backCameraButton.IsPressed() || input_man_sc.sit_car)
                        {
                            camera_children.localEulerAngles = Vector(camera_children.localEulerAngles.x, 0, camera_children.localEulerAngles.z);
                        }
                    }
                    else
                    {
                        if (input_man_sc.backCameraButton.IsPressed())
                        {
                            camera_transform.localEulerAngles = Vector(camera_transform.localEulerAngles.x, 180, camera_transform.localEulerAngles.z);
                        }
                        else if (!input_man_sc.backCameraButton.IsPressed() || input_man_sc.sit_car)
                        {
                            camera_transform.localEulerAngles = Vector(camera_transform.localEulerAngles.x, 0, camera_transform.localEulerAngles.z);
                        }
                    }

                    if (vehicle_sc.engine_work && man_script.vehicle_place == vehicle_sc.place[vehicle_sc.place_drive])
                    {
                        if (!input_man_sc.car_control.gameObject.activeSelf) { input_man_sc.car_control.gameObject.SetActive(true); }
                        if (input_man_sc.man_control.gameObject.activeSelf) { input_man_sc.man_control.gameObject.SetActive(false); }
                        Vector2 temp_move1;
                        //var temp_move2 : Vector2;
                        if (input_man_sc.car_forward) { temp_move1.y = 1; }
                        else if (input_man_sc.car_back) { temp_move1.y = -1; }
                        else { temp_move1.y = 0; }

                        if (input_man_sc.car_left) { temp_move1.x = -1; }
                        else if (input_man_sc.car_right) { temp_move1.x = 1; }
                        else { temp_move1.x = 0; }
                        //move_direction=Vector2.Lerp(move_direction,temp_move1,5);
                        if (Input.GetAxis("Vertical") != 0) vehicle_sc.throttle = Input.GetAxis("Vertical");
                        else vehicle_sc.throttle = Mathf.Lerp(vehicle_sc.throttle, temp_move1.y, 40f * Time.deltaTime);
                        if (Input.GetAxis("Horizontal") != 0) vehicle_sc.steer = Input.GetAxis("Horizontal");
                        else vehicle_sc.steer = Mathf.Lerp(vehicle_sc.steer, temp_move1.x, 5 * Time.deltaTime);
                    }//place_drive
                    if (input_man_sc.sit_car && man_script.doing != "go_to_vehicle" && man_script.doing != "go_out_vehicle") { man_script.GoOutVehicle(); AllGoOutVehicle(vehicle_sc); }
                    if (input_man_sc.camera) { NextCameraVehicle(0, false); }//V
                }//mobile
            }//sit_vehicle

            if (band.Count > 0)
            {
                for (var i = 0; i < band.Count; i++)
                {
                    inv_band.price[i] = band[i].GetComponent<Man>().health_100 + "%";
                    if (band[i].GetComponent<Man>().death)
                        AddBand(band[i], false);
                }//for
            }//Count
        }//death
        else
        {
            if (label_death.alpha < 1 && Time.timeScale != 1) label_death.alpha += 0.005f;
        }//else*/
    }//Update*/
    
    public IEnumerator WantedCoroutine()
    {
        WantCor = true;
        Image sprite = MInput.MainElements.WantedBar.GetComponent<Image>();
        Color col = sprite.color;
        float alpha = 0.6f;
        bool alphaUpDown = false;
        MInput.MainElements.WantedBar.gameObject.SetActive(true);
        while (WantCor)
        {
            TimeWanted += 0.02f;
            if(TimeWanted >= MaxTimeWanted)
            {
                WantCor = false;
                man_script.danger = false;
                man_script.wanted_score = 0;
                TimeWanted = 0;
                MInput.MainElements.WantedBar.gameObject.SetActive(false);
            }
            alpha += alphaUpDown ? 0.08f : -0.08f;
            col.a = alpha;
            sprite.color = col;
            if (!alphaUpDown && alpha <= 0.1f) alphaUpDown = true;
            if(alphaUpDown && alpha >= 0.6f) alphaUpDown = false;
            yield return new WaitForSeconds(0.02f);
        }
    }

    public void PlayerController()
    {
        //if (input_man_sc.money_bonus > 0) //для доната бабла
        //{
        //    MoneyAdd(input_man_sc.money_bonus);
        //    input_man_sc.money_bonus = 0;
        //}//money_bonus
        
        if (man_script.enabled && !man_script.death)
        {
            if (man_script.doing != "sit_vehicle")
            {
                Vector3 temp_direction = Vector3.zero;
                if (!mobile)
                {
                    if (weapon_script.weapon.Count > 0 && weapon_script.weapon_index != 0)
                    {
                        if (Input.GetKey(KeyCode.Mouse0))
                        {
                            fire = true;
                            fire_timer = 0;
                            weapon_script.RotateTo(0, man_script.transform.eulerAngles.y);
                            RaycastHit hit;
                            Vector3 hit_point = Vector3.zero;

                            Transform shPoint = weapon_script.weapon[weapon_script.weapon_index]._transform.FindChild("shoot_point").transform;
                            if (shPoint && Target && Physics.Raycast(shPoint.position,
                                (TargetCar ? (Target.position + Vector(0, 0.5f, 0)) : ManAim.bip_collider.position) - shPoint.position, out hit, 5000)) { hit_point = hit.point; }
                            else { hit_point = shPoint.TransformPoint(Vector(0, 0, 500)); }

                            weapon_script.target_pos = hit_point;
                            weapon_script.target_pos = hit_point;
                            weapon_script.fire = true;
                        }

                        if (Input.GetKeyUp(KeyCode.Mouse1) || (Input.GetKeyUp(KeyCode.Mouse0) && !Input.GetKey(KeyCode.Mouse1)))
                        {
                            script_cam.NextCamera(true, 0);
                        }
                    }//else
                    else if (Input.GetKeyDown(KeyCode.Mouse0))
                    {
                        fire = true;
                        man_script.Fight(Random.Range(1, 4), _camera.eulerAngles.y);
                    }//else

                    if (Input.GetAxis("Vertical") > 0)
                    {
                        temp_direction = Vector3.forward;
                        if (Input.GetAxis("Horizontal") > 0) { temp_direction = Vector(1, 0, 1); }
                        else if (Input.GetAxis("Horizontal") < 0) { temp_direction = Vector(-1, 0, 1); }
                        man_script.Run(temp_direction, _camera.eulerAngles.y, false);
                    }

                    if (Input.GetAxis("Vertical") < 0)
                    {
                        temp_direction = Vector3.back;
                        if (Input.GetAxis("Horizontal") > 0) { temp_direction = Vector(1, 0, -1); }
                        else if (Input.GetAxis("Horizontal") < 0) { temp_direction = Vector(-1, 0, -1); }
                        man_script.Run(temp_direction, _camera.eulerAngles.y, false);
                    }

                    if (Input.GetAxis("Horizontal") > 0)
                    {
                        temp_direction = Vector3.right;
                        if (Input.GetAxis("Vertical") > 0) { temp_direction = Vector(1, 0, 1); }
                        else if (Input.GetAxis("Vertical") < 0) { temp_direction = Vector(1, 0, -1); }
                        man_script.Run(temp_direction, _camera.eulerAngles.y, false);
                    }

                    if (Input.GetAxis("Horizontal") < 0)
                    {
                        temp_direction = Vector3.left;
                        if (Input.GetAxis("Vertical") > 0) { temp_direction = Vector(-1, 0, 1); }
                        else if (Input.GetAxis("Vertical") < 0) { temp_direction = Vector(-1, 0, -1); }
                        man_script.Run(temp_direction, _camera.eulerAngles.y, false);
                    }

                    if (Input.GetKey(KeyCode.Mouse1))
                    {
                        fire = true;
                        fire_timer = 0;
                    }//Mouse1

                    if (Input.GetKey(KeyCode.LeftShift)) { man_script.runing = true; }
                    if (Input.GetKeyUp(KeyCode.LeftShift)) { man_script.runing = false; }

                    if (Input.GetKeyUp(KeyCode.E) && man_script.doing != "go_to_vehicle" && man_script.doing != "go_out_vehicle") { man_script.FindVehicle(true); }
                    if (Input.GetKeyUp(KeyCode.R)) { weapon_script.Reload(); }
                    if (Input.GetKeyUp(KeyCode.Space)) { man_script.Jump(); }
                    if (Input.GetKeyUp(KeyCode.T)) { man_script.RagDoll(); }
                    if (Input.GetKeyUp(KeyCode.P)) { man_script.AddWantedScore(100); }
                    if (Input.GetKeyUp(KeyCode.V)) { script_cam.NextCamera(false, 1); }
                    if (Input.GetKeyUp(KeyCode.LeftControl)) { if (man_script.speed_max != 1) { man_script.speed_max = 1; } else { man_script.speed_max = 2; } }
                    if (!Input.GetKey(KeyCode.W) && !Input.GetKey(KeyCode.S) && !Input.GetKey(KeyCode.A) && !Input.GetKey(KeyCode.D) && man_script.can_doing == 0) { }
                    if (Input.GetKeyUp(KeyCode.J)) man_script.Damage(200, 0, Vector3.zero, Vector3.zero, null);
                    if (!Input.GetKey(KeyCode.C) && !Input.GetKey(KeyCode.G))
                    {
                        if (Input.GetAxis("Mouse ScrollWheel") > 0 && !weapon_script.reload)
                        {
                            weapon_script.weapon_index += 1;
                            if (weapon_script.weapon_index >= weapon_script.weapon.Count) { weapon_script.weapon_index = 0; }
                            weapon_script.WeaponSelect(weapon_script.weapon_index);
                        }
                        if (Input.GetAxis("Mouse ScrollWheel") < 0 && !weapon_script.reload)
                        {
                            weapon_script.weapon_index -= 1;
                            if (weapon_script.weapon_index < 0) { weapon_script.weapon_index = weapon_script.weapon.Count - 1; }
                            weapon_script.WeaponSelect(weapon_script.weapon_index);
                        }
                    }
                }//mobile
                else
                {

                    if (weapon_script.weapon.Count > 0)
                    {
                        if (input_man_sc.aim) { aim = !aim; }
                        if (aim)
                        {
                            script_cam.NextCamera(true, weapon_script.weapon[weapon_script.weapon_index]._camera);
                            fire = true;
                            fire_timer = 0;
                        }//aim

                        else if (Camera.main.fieldOfView != 60)
                        {
                            script_cam.NextCamera(true, 0);
                        }//Count

                        if (MInput.ManController.FireButton.ActiveButton)
                        {
                            fire = true;
                            fire_timer = 0;
                            if (weapon_script.weapon_index > 0)
                            {
                                weapon_script.RotateTo(0, man_script.transform.eulerAngles.y);
                                RaycastHit hit2;
                                Vector3 hit_point2;
                                Transform shPoint = weapon_script.weapon[weapon_script.weapon_index]._transform.FindChild("shoot_point").transform;
                                if (shPoint && Target && Physics.Raycast(shPoint.position,
                                    (TargetCar ? (Target.position + Vector(0, 0.5f, 0)) : ManAim.bip_collider.position) - shPoint.position, out hit2, 5000))
                                {
                                    hit_point2 = hit2.point;
                                }
                                else
                                {
                                    hit_point2 = shPoint.TransformPoint(Vector(0, 0, 500));
                                }

                                weapon_script.target_pos = hit_point2;
                                weapon_script.fire = true;
                            }//weapon_index
                            else if (MInput.ManController.FireButton.DownActive)
                            {
                                man_script.Fight(Random.Range(1, 4), _camera.eulerAngles.y);
                                MInput.ManController.FireButton.DownActive = false;
                            }
                        }//fire
                    }//else
                    //temp_direction = Vector(MInput.ManController.SimpJoyst.HorizintalAxis.Value > 0 ? Mathf.Ceil(MInput.ManController.SimpJoyst.HorizintalAxis.Value) :
                    //    -Mathf.Ceil(MInput.ManController.SimpJoyst.HorizintalAxis.Value),
                    //    0, MInput.ManController.SimpJoyst.VerticalAxis.Value > 0 ? Mathf.Ceil(MInput.ManController.SimpJoyst.VerticalAxis.Value) : -Mathf.Ceil(MInput.ManController.SimpJoyst.VerticalAxis.Value));

                    temp_direction = Vector(MInput.ManController.SimpJoyst.HorizintalAxis.Value, 0, MInput.ManController.SimpJoyst.VerticalAxis.Value).normalized;
                    Vector3 temp_angle = Vector3.zero;
                    if (temp_direction != Vector3.zero)
                    {
                        temp_angle = Quaternion.LookRotation(temp_direction).eulerAngles;
                    }
                    if (man_script.doing == "go_to_vehicle" && man_script.can_doing < 3 && temp_direction.magnitude > 0.5)
                    {
                        man_script.Move();
                    }
                    if (temp_direction.magnitude > 0)
                        man_script.RunPlayer(Vector(0, 0, 1), _camera.eulerAngles.y + temp_angle.y, false);

                    //if (input_man_sc.weapon_next && !weapon_script.reload) // выбор оружия кнопки
                    //{
                    //    weapon_script.weapon_index += 1;
                    //    if (weapon_script.weapon_index >= weapon_script.weapon.Count)
                    //    {
                    //        weapon_script.weapon_index = 0;
                    //    }
                    //    weapon_script.WeaponSelect(weapon_script.weapon_index);
                    //}
                    //else if (input_man_sc.weapon_previous && !weapon_script.reload)
                    //{
                    //    weapon_script.weapon_index -= 1;
                    //    if (weapon_script.weapon_index < 0) { weapon_script.weapon_index = weapon_script.weapon.Count - 1; }
                    //    weapon_script.WeaponSelect(weapon_script.weapon_index);
                    //}
                }//else

                if (fire)
                {
                    fire_timer += Time.deltaTime;
                    if (Target != null)
                    {
                        float i = TargetCar ? 0.5f : 1.5f;
                        weapon_script.RotateTo(Quaternion.LookRotation((Target.position + Vector(0, i, 0)) - man_script.transform.position).eulerAngles.z,
                            Quaternion.LookRotation(Target.position - man_script.transform.position).eulerAngles.y);
                    }
                    if (fire_timer > 3 || man_script.doing == "go_to_vehicle")
                    {
                        fire_timer = 0;
                        fire = false;
                        weapon_script.EndFire();
                        if (man_script.doing == "fight") man_script.FightFalse();
                    }
                }//fire
            }//sit_vehicle
            else if (man_script.doing == "sit_vehicle" && man_script.vehicle && man_script.vehicle.GetComponent<Vehicle>())
            {
                Vehicle vehicle_sc = man_script.vehicle.GetComponent<Vehicle>();

                if (!mobile)
                {
                    if (script_cam.camera_type.look == 4)
                    {
                        if (Input.GetKeyDown(KeyCode.LeftShift))
                        { camera_children.localEulerAngles = Vector(camera_children.localEulerAngles.x, 180, camera_children.localEulerAngles.z); }
                        else if (Input.GetKeyUp(KeyCode.LeftShift))
                        { camera_children.localEulerAngles = Vector(camera_children.localEulerAngles.x, 0, camera_children.localEulerAngles.z); }
                    }
                    else
                    {
                        if (Input.GetKeyDown(KeyCode.LeftShift)) { camera_transform.localEulerAngles = Vector(camera_transform.localEulerAngles.x, 180, camera_transform.localEulerAngles.z); }
                        else if (Input.GetKeyUp(KeyCode.LeftShift)) { camera_transform.localEulerAngles = Vector(camera_transform.localEulerAngles.x, 180, camera_transform.localEulerAngles.z); }
                    }
                    if (Input.GetKeyUp(KeyCode.V)) { NextCameraVehicle(0, false); }//V
                    if (Input.GetKeyUp(KeyCode.E) && man_script.doing != "go_to_vehicle" && man_script.doing != "go_out_vehicle")
                    {
                        man_script.GoOutVehicle();
                        AllGoOutVehicle(vehicle_sc);
                    }//E
                    if (Input.GetKeyUp(KeyCode.P)) { if (!vehicle_sc.engine_work) { vehicle_sc.EngineStart(); } else { vehicle_sc.EngineStop(); } }
                    if (Input.GetKeyUp(KeyCode.O))
                    {
                        man_script.vehicle.position += Vector(0, 1, 0);
                        man_script.vehicle.localEulerAngles = Vector(man_script.vehicle.localEulerAngles.x, man_script.vehicle.localEulerAngles.y, 0);
                    }//E
                    if (Input.GetKeyUp(KeyCode.H) && vehicle_sc.sirena && !vehicle_sc.sirena.gameObject.activeSelf) { vehicle_sc.sirena.gameObject.SetActive(true); }
                    else if (Input.GetKeyUp(KeyCode.H) && vehicle_sc.sirena && vehicle_sc.sirena.gameObject.activeSelf) { vehicle_sc.sirena.gameObject.SetActive(false); }
                    if (Input.GetKeyUp(KeyCode.J)) man_script.Damage(200, 0, Vector3.zero, Vector3.zero, null);
                    if (vehicle_sc.engine_work && man_script.vehicle_place == vehicle_sc.place[vehicle_sc.place_drive])
                    {

                        vehicle_sc.throttle = Input.GetAxis("Vertical");
                        vehicle_sc.steer = Input.GetAxis("Horizontal");
                        vehicle_sc.rotate.y = _camera.eulerAngles.y;
                        vehicle_sc.rotate.x = _camera.GetComponent<CameraScript>().camera_children.eulerAngles.x;

                        vehicle_sc.rotate.y = _camera.eulerAngles.y;
                        if (Input.GetKey(KeyCode.Space)) { vehicle_sc.StopVehicle(100); }
                    }//place_drive

                }//mobile
            }//sit_vehicle
        }//death
    }

    public void FindVehicle()
    {
        if (man_script.doing != "go_to_vehicle" && man_script.doing != "go_out_vehicle" && man_script.doing != "sit_vehicle")
        {
            man_script.FindVehicle(true);
        }
        else if(man_script.doing == "sit_vehicle" && man_script.doing != "go_out_vehicle" && man_script.doing != "go_to_vehicle")
        {
            Vehicle vehicle_sc = man_script.vehicle.GetComponent<Vehicle>();
            StartCoroutine(EclipseScreen(0.7f, 0.5f));
            man_script.GoOutVehicle();
            AllGoOutVehicle(vehicle_sc);
        }
    }

    public void JumpButtonClick()
    {
        man_script.Jump();
        MInput.ManController.JumpButton.SetActive(false);
    }

    public void OpenParachute()
    {
        man_script.OpenParachute();
        MInput.ManController.ParachuteButton.SetActive(false);
    }

    public void AimFunctions()
    {
        if (MInput.ManController.AimButton.ActiveButton || !mobile && Input.GetKey(KeyCode.Mouse1))
        {
            if (!AimFix)
            {
                float tempAngle = 1000;
                Transform target = null;
                List<Transform> objForAim = new List<Transform>();
                for (int r = 0; r < game_sc.man.Count; r++)
                {
                    if (Vector3.Distance(man_script.transform.position, game_sc.man[r].transform.position) < 100)
                    {
                        objForAim.Add(game_sc.man[r]);
                    }
                }
                for (int t = 0; t < game_sc.vehicle.Count; t++)
                {
                    if (Vector3.Distance(man_script.transform.position, game_sc.vehicle[t].transform.position) < 100)
                    {
                        objForAim.Add(game_sc.vehicle[t]);
                    }
                }
                for (int y = 0; y < objForAim.Count; y++)
                {
                    float tmp = Vector3.Angle(camera_transform.forward, objForAim[y].transform.position - camera_transform.transform.position);
                    if ((tmp < tempAngle) && ((objForAim[y].GetComponent<Man>() && !objForAim[y].GetComponent<Man>().death && !objForAim[y].GetComponent<Man>().player 
                        && objForAim[y].GetComponent<Man>().doing != "sit_vehicle") 
                        || (objForAim[y].GetComponent<Vehicle>() && !objForAim[y].GetComponent<Vehicle>().death)))
                    {
                        tempAngle = tmp;
                        Target = objForAim[y];
                    }
                }
                if (Target != null && Target.GetComponent<Vehicle>())
                {
                    VehicleAim = Target.GetComponent<Vehicle>();
                    TargetCar = true;
                }
                else if(Target != null)
                {
                    ManAim = Target.GetComponent<Man>();
                    TargetCar = false;
                }
                AimFix = true;
            }

            fire = true;

            if (Input.GetKey(KeyCode.T))
            {
                fire = true;
                fire_timer = 0;
                weapon_script.RotateTo(0, man_script.transform.eulerAngles.y);
                RaycastHit hit;
                Vector3 hit_point;
                Transform shPoint = weapon_script.weapon[weapon_script.weapon_index]._transform.FindChild("shoot_point").transform;
                if (shPoint && Target && Physics.Raycast(shPoint.position,
                    (TargetCar ? (Target.position + Vector(0,0.5f,0)) : ManAim.bip_collider.position) - shPoint.position, out hit, 5000)) { hit_point = hit.point; }
                else { hit_point = shPoint.TransformPoint(Vector(0, 0, 500)); }
                weapon_script.target_pos = hit_point;
                weapon_script.fire = true;
            }
        }
        else
        {
            Target = null;
            AimFix = false;
            ManAim = null;
            VehicleAim = null;
            TargetAim.gameObject.SetActive(false);
        }

        if(Target != null)
        {
            Vector3 temp_angle = Quaternion.LookRotation(Target.position - man_script.transform.position).eulerAngles;
            man_script.RotateTo(temp_angle.y);
            TargetAim.gameObject.SetActive(true);
            if (!TargetCar)
            {
                if (!TargetAim.GetChild(0).gameObject.activeSelf)
                {
                    TargetAim.GetChild(0).gameObject.SetActive(true);
                    TargetAim.GetChild(1).gameObject.SetActive(false);
                }
            }
            else
            {
                if (TargetAim.GetChild(0).gameObject.activeSelf)
                {
                    TargetAim.GetChild(0).gameObject.SetActive(false);
                    TargetAim.GetChild(1).gameObject.SetActive(true);
                }
            }
            float i = TargetCar ? 0.3f : 1f;
            TargetAim.transform.position = TargetCar ? Target.transform.position + Vector(0, i, 0) : ManAim.bip_collider.transform.position;
            TargetAim.LookAt(camera_transform.transform);
            if (!TargetCar && ManAim.death)
            {
                Target = null;
                ManAim = null;
                VehicleAim = null;
                AimFix = false;
            }
            else if (VehicleAim && VehicleAim.death)
            {
                Target = null;
                VehicleAim = null;
                ManAim = null;
                AimFix = false;
            }
        }
        else
        {
            TargetAim.gameObject.SetActive(false);
        }
    }

    public void NextCamera(int _num)
    {
        script_cam.NextCamera(true, _num);
    }//CameraCharacter

    public void CameraCharacter()
    {
        script_cam.NextCamera(true, 0);
        script_cam.target = player;
    }//CameraCharacter

    public void NextCameraVehicle(int _num, bool _get_camera)
    {
        Vehicle vehicle_sc = man_script.vehicle.GetComponent<Vehicle>();
        camera_int += 1;
        if (_get_camera) { camera_int = _num; }
        if (camera_int > vehicle_sc.camera_type.Length - 1) { camera_int = 0; }
        script_cam.NextCameraVehicle(true, vehicle_sc.camera_type[camera_int].num);
        Transform temp_target = vehicle_sc.camera_type[camera_int].target;
        if (temp_target)
        {
            if (!temp_target.gameObject.activeSelf) temp_target.gameObject.SetActive(true);
            script_cam.target = temp_target;
        }
        else { script_cam.target = player; }
    }//NextCameraVehicle


    void OnGUI()
    {
        if (!input_man_sc.pause)
        {
            if (!man_script.death)
            {
                if (man_script.doing != "sit_vehicle")
                {
                    //if (weapon_script.weapon.Count > 0 && weapon_script.weapon[weapon_script.weapon_index].cross == 0 || (!mobile && !Input.GetKey(KeyCode.Mouse1)) || (mobile && !aim))
                    //{
                    //    //GUI.DrawTexture(Rect((Screen.width-cross_height)/2, (Screen.height)/2-cross_width-4-weapon_script.now_return,cross_height,cross_width),cross_texture[0]);//up
                    //    //GUI.DrawTexture(Rect((Screen.width)/2-cross_width-4-weapon_script.now_return,(Screen.height-cross_height)/2,cross_width,cross_height),cross_texture[0]);//left
                    //    //GUI.DrawTexture(Rect((Screen.width-cross_height)/2, (Screen.height)/2+4+weapon_script.now_return,cross_height,cross_width),cross_texture[0]);//down
                    //    //GUI.DrawTexture(Rect((Screen.width)/2+4+weapon_script.now_return,            (Screen.height-cross_height)/2,cross_width,cross_height),cross_texture[0]);//right
                    //}
                    //else if (Input.GetKey(KeyCode.Mouse1) || aim)
                    //{
                    //    GUI.DrawTexture(new Rect(Screen.width / 2 - Screen.height / 2, 0, Screen.height, Screen.height), cross_texture[weapon_script.weapon[weapon_script.weapon_index].cross]);
                    //}///else
                    //if(draw_price){DrawText(Vector2(Screen.width/2,Screen.height/2),price,gstyle_5);}

                }//sit_vehicle


                if (help.Count > 0)
                {
                    for (var i = 0; i < help.Count; i++)
                    {
                        DrawText(new Vector2(Screen.width - 150, 100 + 20 * i), help[i].text, help[i].gstyle);

                    }//for
                }//Count
                if (hit)
                {
                    GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), tex_hit);
                }//hit

                if (help_active)
                {
                    GUI.Box(new Rect(100, 100, 450, 600), "");
                    GUI.color = Color.black;
                    GUI.TextArea(new Rect(110, 110, 380, 380), help_text2, gstyle_help);
                    GUI.color = Color.white;
                    GUI.TextArea(new Rect(112, 112, 380, 380), help_text2, gstyle_help);
                    help_timer += Time.deltaTime;
                    if (help_timer > 10) { help_timer = 0; help_active = false; }
                }//help_active

                //DrawText(Vector2(Screen.width-Screen.width/2.5,Screen.height/100),money+" $",gstyle_4);
                //if(man_script.vehicle)DrawText(Vector2(Screen.width/2,Screen.height/3),"magnitude "+man_script.vehicle.rigidbody.velocity.magnitude,gstyle_4);


                if (enemy && fire)
                {
                    Man temp_script = enemy.GetComponent<Man>();
                    Vector3 temp_pos = Camera.main.WorldToScreenPoint(enemy.position + Vector(0, 2.2f, 0));
                    Vector3 temp_in_camera = Camera.main.transform.InverseTransformPoint(enemy.position + Vector(0, 2.2f, 0));
                    float temp_size = (Screen.width + Screen.height) / 30;

                    if (temp_in_camera.z > 0)
                    {
                        GUI.color = Color.white;
                        GUI.DrawTexture(new Rect(temp_pos.x - temp_size / 2, Screen.height - temp_pos.y - temp_size / 5, temp_size, temp_size / 5), tex_healthbar1);
                        GUI.color = Color.green;
                        if (temp_script.health < temp_script.max_health / 3) GUI.color = Color.red;
                        else if (temp_script.health < temp_script.max_health / 1.5) GUI.color = Color.yellow;

                        GUI.DrawTexture(new Rect(temp_pos.x - temp_size / 2, Screen.height - temp_pos.y - temp_size / 5, temp_size / temp_script.max_health * temp_script.health, temp_size / 5), tex_healthbar2);
                    }//temp_in_camera

                }//health_bar

            }//death
        }//pause
    }//OnGUI


    public void DrawText(Vector2 _position, string _text, GUIStyle _style)
    {

        GUI.color = Color.black;
        GUI.Label(new Rect(_position.x, _position.y, 100, 100), _text, _style);
        GUI.color = Color.white;
        GUI.Label(new Rect(_position.x + 3, _position.y + 3, 100, 100), _text, _style);
    }//DrawText

    public void AddHelp(int _help_text, int _gstyle, bool _other, string _text)
    {
        return;
        GUIStyle temp_gstyle;
        string temp_text;

        if (_gstyle == 0) { temp_gstyle = gstyle_0; }
        else if (_gstyle == 1) { temp_gstyle = gstyle_1; }
        else if (_gstyle == 2) { temp_gstyle = gstyle_2; }
        else if (_gstyle == 3) { temp_gstyle = gstyle_3; }

        if (_other) { temp_text = _text; }
        else { temp_text = help_text[_help_text]; }

        ClassHelp temp_help = new ClassHelp();
        temp_help.text = temp_text;
        temp_help.gstyle = temp_gstyle;

        help.Add(temp_help);
        Invoke("HelpFalse", 5);
    }//AddHelp

    public void HelpFalse()
    {
        if (help.Count > 0) { help.RemoveAt(0); }
    }//HelpFalse

    public void Hit()
    {
        hit = true;
        Invoke("HitFalse", 0.5f);
    }//Hit

    public void HitFalse()
    {
        hit = false;
    }//HitFalse

    public void HelpActive(string _text)
    {
        help_active = true;
        help_text2 = _text;
        help_timer = 0;
    }//HelpActive

    public void HelpActiveFalse()
    {
        help_active = false;
        help_text2 = "РџСѓСЃС‚Рѕ";
        help_timer = 0;
    }//HelpActiveFalse

    public void AllGoOutVehicle(Vehicle _vehicle_sc)
    {
        for (var i = 0; i < _vehicle_sc.place.Length; i++)
        {
            if (_vehicle_sc.place[i].man && _vehicle_sc.place[i].man != transform && _vehicle_sc.place[i].man.GetComponent<Man>().health > 0)
            {
                _vehicle_sc.place[i].man.GetComponent<Man>().GoOutVehicle();
            }//man
        }//for
    }//AllGoOutVehicle

    public void PlayerDeath()
    {
        label_death.enabled = true;
        mobile_input.gameObject.SetActive(false);
        script_cam.rotation_speed = 10;
        script_cam.target = null;
        Time.timeScale = 0.3f;
        Invoke("ReSpawn", 2);
    }//ReSpawn

    public void ReSpawn()
    {
        Time.timeScale = 1;
        Application.LoadLevel("Loading");

    }//ReSpawn

    public void MoneyAdd(int _money)
    {
        money += _money;
        MInput.MoneyPlayer = _money;
        //PlayerPrefs.SetInt("money", money);
        AudioSource.PlayClipAtPoint(game_sc.sound_effect[0], transform.position, 1);
    }//MoneyAdd

    public int GetWeapon(int _num)
    {

        for (var i = 0; i < weapon_script.weapon.Count; i++)
        {
            if (weapon_script.weapon[i].index == _num)
            {
                return i;
            }
        }//for
        return 0;
    }//GetWeapon

    public void EndFire()
    {
        fire_timer = 0; fire = false;
        if (weapon_script.weapon_index != 0) { weapon_script.EndFire(); }
    }//function

    public void HealthAdd()
    {
        //MoneyAdd(2000);
        if (man_script.health < man_script.max_health)
        {
            man_script.health += man_script.max_health / 100;
            if (man_script.health > man_script.max_health) man_script.health = man_script.max_health;
        }//max_health
        Invoke("HealthAdd", 5);
    }//HealthAdd


    public void AddBand(Transform _band, bool _add)
    {
        if (_add && band.Count >= 5) return;
        if (_band)
        {
            if (_add)
            {
                band.Add(_band);

            }//add
            else
            {
                _band.GetComponent<Man>().dellete = true;
                band.Remove(_band);
            }//else
        }//band

        if (band.Count > 0)
        {
            inv_band.enabled = true;
            inv_band.objects.Clear();
            inv_band.price.Clear();
            for (var i = 0; i < band.Count; i++)
            {
                inv_band.objects.Add(band[i].GetComponent<Man>().image);
                inv_band.price.Add(band[i].GetComponent<Man>().health_100 + "%");
            }//for
            inv_band.scale.x = band.Count;
        }//Count
        else inv_band.enabled = false;
    }//AddBand

    public void Aim()
    {
        Invoke("Aim", 0.1f);
        if (!fire) return;
        Transform temp_enemy;
        Transform temp_near_enemy = null;
        float temp_angle_big = 5;
        float temp_distance;
        RaycastHit hit;
        Vector3 look_target;
        Vector3 angle_diff;
        float temp_angle_diff = 5;
        if (weapon_script.weapon_index == 0) temp_angle_diff = 30;

        enemy = null;
        for (var i = 0; i < game_sc.man.Count; i++)
        {
            temp_enemy = game_sc.man[i];
            if (temp_enemy != transform && temp_enemy.GetComponent<Man>().health > 0)
            {
                temp_distance = Vector3.Distance(temp_enemy.position, camera_children.position);

                //look_target=Quaternion.LookRotation(temp_enemy.position+Vector3(0,1.5,0)-camera_children.position).eulerAngles;
                //angle_diff=Vector3.Angle(Functions.Direction(look_target),Functions.Direction(camera_children.eulerAngles));
                //if(angle_diff<temp_angle_big){
                //temp_angle_big=angle_diff;
                //temp_near_enemy=temp_enemy;
                //}//angle
                look_target = Quaternion.LookRotation(temp_enemy.position + Vector(0, 1.5f, 0) - camera_children.position).eulerAngles;
                angle_diff = Functions.Angle180Abs(look_target - camera_children.eulerAngles);
                if (angle_diff.x < temp_angle_diff && angle_diff.y < temp_angle_big)
                {
                    temp_angle_big = angle_diff.y;
                    temp_near_enemy = temp_enemy;
                }//angle


            }//team
        }//for

        if (temp_near_enemy != null)
        {
            enemy = temp_near_enemy;
        }//temp_near_enemy

    }//Aim

    public IEnumerator EclipseScreen(float startAlpha, float time)
    {
        MInput.MainElements.BlackFone.gameObject.SetActive(true);
        float alpha = startAlpha;
        Color col = MInput.MainElements.BlackFone.color;
        col.a = alpha;
        MInput.MainElements.BlackFone.color = col;
        bool temp = true;
        while(temp)
        {
            yield return new WaitForSeconds(0.02f);
            alpha += 0.05f;
            col.a = alpha;
            MInput.MainElements.BlackFone.color = col;
            if(alpha >= 1)
            {
                temp = false;
            }
        }
        yield return new WaitForSeconds(time);
        StartCoroutine(LighteningScreen());
    }

    public IEnumerator LighteningScreen()
    {
        float alpha = 1;
        Color col = MInput.MainElements.BlackFone.color;
        col.a = alpha;
        MInput.MainElements.BlackFone.color = col;
        bool temp = true;
        while (temp)
        {
            yield return new WaitForSeconds(0.02f);
            alpha -= 0.05f;
            col.a = alpha;
            MInput.MainElements.BlackFone.color = col;
            if (alpha <= 0.2f)
            {
                temp = false;
            }
        }
        MInput.MainElements.BlackFone.gameObject.SetActive(false);
    }
}
