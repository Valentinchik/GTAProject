using UnityEngine;
using System.Collections.Generic;

public class Man : MonoBehaviour
{
    private Animator animator;
    public Game game_sc;
    public Player player_sc;
    private Vehicle vehicle_sc;
    private Weapon script_weapon;

    public int man;
    public int ws_index = 50;
    public int money = 100;
    public int speed_walk = 2;
    public float swim_centr = 1.4f;
    public Transform armor_ob;

    public List<int> kick = new List<int>();


    public int team = 0;
    public int max_health = 100;
    public int health = 100;
    public int health_100 = 100;
    public int max_armor = 0;
    public int armor = 0;

    public Texture2D image;

    public string doing = "idle";
    public int can_doing = 0;
    public bool fire;
    public bool other_doing;
    public bool player;
    public bool death;
    public bool cop;
    public bool dellete = true;
    public bool destroy;
    public int weapon_index;
    public int invoke_damage;
    public bool danger;
    public float wanted_score;
    public int speed_max = 1;
    public float danger_timer;
    public float danger_timer_max = 20;
    public ClassVehiclePlace vehicle_place;
    public ClassVehiclePlace my_vehicle_place;
    public Transform vehicle;
    public Transform my_vehicle;
    public Transform bip_target;
    public Transform bip;
    public Transform bip_collider;
    public Transform killer;
    public Transform place_death;
    public Transform hand_l;
    public Transform hand_r;
    public Transform enemy;
    public Transform parachute;

    public float speed = 1;
    private int speed_temp;
    private float gravity = 9.81f;
    private int rotation_speed = 10;
    private int condition;
    private Vector2 temp_direction;
    private float rotation_y;
    private float rotation;
    private float rotation_temp;
    private Vector3 direction;
    private Vector3 direction_temp;
    private AnimatorStateInfo anim_state;
    private float jump_timer;
    //private RaycastHit hit;
    private AudioSource audio_source;
    private AudioSource audio_voice;
    private float step_timer;
    private float fall_timer;
    private float angle;
    private Vector3 doing_angle;
    private Vector3 doing_position;
    private Transform rhand_object;
    private bool kick_hit;
    private bool swim_particle;
    private bool rag_doll;
    private bool engine_start = true;
    private bool open_parachute;

    public bool grounded;
    public bool runing;
    public bool collision;
    public bool run;
    public bool go_to_car;

    private Ragdoll ragdoll;
    
    public TriggerPlayer TrigPlayer;

    private Vector3 tempVector;
    public Vector3 Vector(float x, float y, float z)
    {
        tempVector.x = x;
        tempVector.y = y;
        tempVector.z = z;
        return tempVector;
    }

    void Awake()
    {
        ragdoll = GetComponent<Ragdoll>();
    }

    void Start()
    {
        if(player)
        {
            max_health = player_sc.MInput.ManController.MaxHealthPlayer;
            health = max_health;
            max_armor = player_sc.MInput.ManController.MaxArmorPlayer;
            armor = player_sc.MInput.PlayerArmor;
            if(armor > 0 && armor_ob)
            {
                armor_ob.gameObject.SetActive(true);
            }
        }
        script_weapon = GetComponent<Weapon>();
        if (!game_sc) game_sc = GameObject.Find("Game").GetComponent<Game>();
        //bip_target=transform.FindChild("genSWAT_Reference").FindChild("genSWAT_Hips").FindChild("genSWAT_Spine").FindChild("genSWAT_Spine1");
        if (!bip) bip = transform.FindChild("Pelvis");
        if (!bip_collider) bip_collider = bip.FindChild("Spine_0");
        if (!bip_target) bip_target = bip_collider.FindChild("Spine_1").FindChild("Spine_2").FindChild("Neck_1");
        /*
        var temp_colider : CapsuleCollider;
        temp_colider=bip_collider.gameObject.AddComponent(typeof(CapsuleCollider)) as CapsuleCollider;
        temp_colider.center.y=0.24;
        temp_colider.radius=0.1;
        temp_colider.height=0.35;
        temp_colider.direction=1;
        temp_colider.enabled=false;
        temp_colider.isTrigger=true;*/

        animator = GetComponent<Animator>();
        audio_voice = GetComponent<AudioSource>();
        audio_source = gameObject.AddComponent(typeof(AudioSource)) as AudioSource;
        audio_source.volume = 0.4f;
        game_sc.man.Add(transform);
        Rigidbody rigid = GetComponent<Rigidbody>();
        rigid.centerOfMass = Vector(rigid.centerOfMass.x, 1.3f, rigid.centerOfMass.z);
        //Invoke("AfterStart", 0.001f);
    }//Start

    private float ragdolTimer = 0;

    void Update()
    {
        if(rag_doll && ragdolTimer<3 && !death)
        {
            ragdolTimer += Time.deltaTime;
        }
        else if(rag_doll && ragdolTimer >= 3 && !death)
        {
            ragdolTimer = 0;
            transform.position = ragdoll.boxCol[0].transform.position;
            StandUp();
        }
        //health_100 = (int)(health / (max_health / 100.0f));
        anim_state = animator.GetCurrentAnimatorStateInfo(0);
        //animator.SetIKPosition(AvatarIKGoal.LeftHand,transform.position+Vector3(0,2,0));
        if (danger) { danger_timer += Time.deltaTime; if (danger_timer > danger_timer_max) { danger_timer = 0; danger = false; } }
        RaycastHit hit;
        if (Physics.Raycast(transform.position + Vector(0, 1, 0), Vector(0, -1, 0), out hit, 1) || collision)
        {
            fall_timer = 0;
            grounded = true;
            if(player && !player_sc.MInput.ManController.JumpButton.activeSelf && doing != "jump")
            {
                player_sc.MInput.ManController.JumpButton.SetActive(true);
            }
        }
        else
        {
            grounded = false;
            if (player && player_sc.MInput.ManController.JumpButton.activeSelf)
            {
                player_sc.MInput.ManController.JumpButton.SetActive(false);
            }
        }

        if (doing != "jump") { animator.SetBool("grounded", grounded); }

        if (doing != "jump" && doing != "parachute" && !grounded && doing != "fall" && can_doing < 3)
        {
            fall_timer += Time.deltaTime;
            if (fall_timer > 0.5f)
            {
                fall_timer = 0;
                if (doing == "fight") FightFalse();
                can_doing = 2;
                doing = "fall";
                FallBigHaight = true;
                animator.SetInteger("doing", 3);
            }
        }

        if (doing == "stand_up")
        {
            if (anim_state.normalizedTime >= 0.88 && (anim_state.IsName("stand_up_front") || anim_state.IsName("stand_up_back")))
            {
                MoveFalse();
                ActivateComponents(true);
                if(!GetComponent<CapsuleCollider>().enabled && GetComponent<Rigidbody>().isKinematic)
                {
                    ragdoll.ActivateRagdoll(false);
                }
                if (GetComponent<Bot>())
                {
                    if (my_vehicle != null && SitMyVehicle())
                    {
                        runing = true;
                        speed_temp = 2;
                    }
                    else
                    {
                        GetComponent<Bot>().FindNearPoint(0);
                    }
                }
                if (vehicle != null && vehicle_place != null) { vehicle_place.can_use = true; }
                if (!player && go_to_car) doing = "go_to_vehicle";
            }//anim_state
        }//stand_up

        else if (doing == "fly_car")
        {
            if (vehicle_place != null)
            {
                transform.position = vehicle_place.place_point.position;
                transform.eulerAngles = vehicle_place.place_point.eulerAngles;
            }
            if (anim_state.normalizedTime >= 0.85 && anim_state.IsName("fly_car"))
            {
                if (vehicle_place != null) vehicle_place.man = null;
                vehicle = null;
                vehicle_place = null;
                GetComponent<Rigidbody>().isKinematic = false;
                GetComponent<Rigidbody>().AddForce(bip.TransformDirection(Vector3.forward) * 100000);
                RagDoll();
            }
        }//fly_car

        else if (doing == "go_to_vehicle" && vehicle)
        {
            Door temp_com = null;
            if (condition == 0)
            {
                float temp_radius = 0;
                Vector3 temp_angle = Quaternion.LookRotation(vehicle_place.door_point.position - transform.position).eulerAngles;
                float temp_distance = Vector3.Distance(Vector(vehicle_place.door_point.position.x, 0, vehicle_place.door_point.position.z), Vector(transform.position.x, 0, transform.position.z));
                Run(Vector3.forward, temp_angle.y, true);
                if (vehicle_place.anim == 2) temp_radius = 8;
                if (temp_distance < 0.1 + speed / 10 + temp_radius)
                {
                    if (!vehicle_place.empty)
                    {
                        can_doing = 3;
                        if (vehicle_place.door)
                        {
                            if (vehicle_place.door.GetComponent<Door>()) { temp_com = vehicle_place.door.GetComponent<Door>(); }
                            else { temp_com = vehicle_place.door.gameObject.AddComponent(typeof(Door)) as Door; }
                            temp_com.Setting(0, vehicle_place, vehicle_place.direction);
                            temp_com.Invoke("Open", 0.8f);
                        }//door

                        animator.SetInteger("doing", 4);
                        animator.SetInteger("place", vehicle_place.anim);
                        animator.applyRootMotion = false;
                        if ((!vehicle_place.door || temp_com._open) && vehicle_place.can_use) { condition = 2; }
                        else { animator.SetInteger("condition", 0); condition = 1; }
                    }//empty
                    else
                    {
                        SitVehicle(vehicle, vehicle_place, true);
                        vehicle_place.can_use = true;
                    }
                    //if (vehicle.GetComponent<sc_motobike_js>()) vehicle.GetComponent<sc_motobike_js>().Stand();//temp
                    run = false;
                    if (vehicle_place.anim == 2) condition = 4;
                }//temp_distance
            }//condition=0

            else if (condition == 1)
            {
                RotateTo(vehicle_place.door_point.eulerAngles.y);
                transform.position = vehicle_place.door_point.position;
                if (anim_state.normalizedTime > 0.9 && anim_state.IsName("open_right_door") && vehicle_place.can_use) { condition = 2; }
            }//condition==1

            else if (condition == 2)
            {
                if (vehicle_place.man)
                {
                    if (player)
                        StartCoroutine(player_sc.EclipseScreen(0.2f, 2));
                    else if(vehicle_place.man.GetComponent<Man>().player)
                        StartCoroutine(vehicle_place.man.GetComponent<Man>().player_sc.EclipseScreen(0.2f, 2));
                    animator.SetInteger("condition", 3); condition = 3; Voice(1, 20);
                }
                else
                {
                    if (player)
                        StartCoroutine(player_sc.EclipseScreen(0.2f, 1));
                    condition = 4;
                }
            }//condition==2

            else if (condition == 3)
            {
                vehicle_place.can_use = false;
                RotateTo(vehicle_place.door_point.eulerAngles.y);
                transform.position = vehicle_place.door_point.position;
                if (anim_state.IsName("out_car"))
                {
                    if (anim_state.normalizedTime >= 0.45 && vehicle_place.man) { vehicle_place.man.GetComponent<Man>().FlyCar(); }
                    if (anim_state.normalizedTime >= 0.93)
                    {
                        animator.SetInteger("condition", 1);
                        condition = 4;
                    }
                }//out_car
            }//condition==3

            else if (condition == 4)
            {
                vehicle_place.can_use = false;
                GetComponent<CapsuleCollider>().enabled = false;
                animator.SetInteger("condition", 1);
                condition = 5;
            }//condition==4

            else if (condition == 5)
            {
                RotateTo(vehicle_place.door_point.eulerAngles.y);
                transform.position = vehicle_place.door_point.position;
                if (anim_state.normalizedTime >= 1 && anim_state.IsName("siting_car_right") || vehicle_place.anim == 2)
                {
                    if (vehicle_place.door && vehicle_place.door.GetComponent<Door>()) { vehicle_place.door.GetComponent<Door>().Invoke("Close", 0.01f); }
                    SitVehicle(vehicle, vehicle_place, engine_start);
                    vehicle_place.can_use = true;
                    condition = 0;
                }
            }//condition==5

            if ((script_weapon && script_weapon.weapon_index != 0) &&
            (condition == 1 || condition == 2 || condition == 3 || condition == 5))
            {
                script_weapon.weapon_current = script_weapon.weapon_index;
                script_weapon.WeaponSelect(0);
            }

        }//go_to_vehicle

        else if (doing == "go_out_vehicle")
        {
            transform.position = vehicle_place.door_point.position;
            transform.eulerAngles = vehicle_place.door_point.eulerAngles;
            if (anim_state.normalizedTime >= 0.88 && anim_state.IsName("out_car_right") || vehicle_place.anim == 2)
            {
                animator.SetInteger("doing", 0);
                animator.SetInteger("condition", 0);
                RaycastHit hit1;
                Move();
                GetComponent<CapsuleCollider>().enabled = true;
                GetComponent<AudioSource>().enabled = true;
                if (bip_collider) { bip_collider.GetComponent<CapsuleCollider>().enabled = false; }//bip_collider
                GetComponent<Rigidbody>().isKinematic = false;
                ActivateComponents(true);
                if (GetComponent<CarCop>()) { vehicle.GetComponent<CarCop>().enabled = false; }
                script_weapon.WeaponSelect(script_weapon.weapon_current);
                if (vehicle_place == vehicle_sc.place[vehicle_sc.place_drive] && vehicle_sc.engine_work) { vehicle_sc.EngineStop(); }
                transform.eulerAngles = Vector(0, transform.eulerAngles.y, 0);
                if (Physics.Raycast(vehicle_place.door_point.position + Vector(0, 1.5f, 0), Vector(0, -1, 0), out hit1, 10))
                {
                    transform.position = hit1.point;
                }
                vehicle_place.man = null;
                vehicle_place.use = false;
                vehicle = null;
                vehicle_place = null;
            }//
            if (player) TrigPlayer.gameObject.SetActive(true);
        }//go_out_vehicle

        else if (doing == "sit_vehicle")
        {
            transform.position = vehicle_place.place_point.position;
            transform.eulerAngles = vehicle_place.place_point.eulerAngles;

            if (script_weapon && script_weapon.weapon_index != 0) script_weapon.WeaponSelect(0);
            if (player) TrigPlayer.gameObject.SetActive(false);
        }//sit_vehicle

        else if (doing == "swim")
        {
            if (script_weapon && script_weapon.weapon_index != 0) { script_weapon.WeaponSelect(0); }


            RotateTo(rotation_temp);
            direction = Vector3.Lerp(direction, direction_temp, 2 * Time.deltaTime);
            animator.SetFloat("direction_x", direction.x);
            animator.SetFloat("direction_z", direction.z);
            rotation = Quaternion.Slerp(Quaternion.Euler(0, rotation, 0), Quaternion.Euler(0, rotation_temp, 0), 5 * Time.deltaTime).eulerAngles.y;
            if (direction.magnitude > 0.05)
            {
                if (!swim_particle) { Invoke("CreateSwimParticle", 0.2f); swim_particle = true; }
                GetComponent<Rigidbody>().AddForce(transform.TransformDirection(direction * 1000));
            }
            else { GetComponent<Rigidbody>().AddForce(-Vector(GetComponent<Rigidbody>().velocity.x, 0, GetComponent<Rigidbody>().velocity.z) * 100); }
            direction_temp = Vector3.zero;
            if (grounded) { Move(); }

        }//swim

        else if (doing == "jump")
        {
            jump_timer += Time.deltaTime;
            if (jump_timer > 1) { Move(); jump_timer = 0; animator.SetBool("jump", false); }

            if (grounded && jump_timer > 0.1)
            {
                Move();
                animator.SetBool("jump", false);
                animator.SetBool("grounded", true);
                if (!audio_source.isPlaying) { PlaySoundStep(); }
            }//grounded
        }//jump

        else if (doing == "fall")
        {
            if(parachute && !player_sc.MInput.ManController.ParachuteButton.activeSelf)
                player_sc.MInput.ManController.ParachuteButton.SetActive(true);
            if (grounded)
            {
                fall_timer = 0;
                player_sc.MInput.ManController.ParachuteButton.SetActive(false);
                Move();
                if (!audio_source.isPlaying)
                {
                    PlaySoundStep();
                }
            }
        }//fall

        else if (doing == "parachute")
        {
            RotateTo(rotation_temp);
            direction = Vector3.Lerp(direction, direction_temp, 2 * Time.deltaTime);
            if (direction.magnitude > 0.05) GetComponent<Rigidbody>().AddForce(transform.TransformDirection(direction * 1000));
            else GetComponent<Rigidbody>().AddForce(-Vector(GetComponent<Rigidbody>().velocity.x, 0, GetComponent<Rigidbody>().velocity.z) * 100);
            direction_temp = Vector3.zero;

            if (grounded)
            {
                fall_timer = 0;
                Move();
                player_sc.NextCamera(0);
                if (!audio_source.isPlaying) PlaySoundStep();
                Destroy(parachute.gameObject);
                GetComponent<Rigidbody>().drag = 0;
                open_parachute = false;
            }//grounded
        }//fall

        else if (doing == "fight")
        {
            RotateTo(rotation_y);
            if (kick.Count > 0)
            {
                animator.SetInteger("kick", kick[0]);
                if (!kick_hit && anim_state.normalizedTime > 0.5 && anim_state.normalizedTime < 0.55)
                {
                    Kick();
                }
                if (anim_state.normalizedTime > 0.6 && anim_state.IsName("kick_" + kick[0]))
                {
                    kick_hit = false;
                    kick.RemoveAt(0);
                    if (kick.Count == 0)
                    {
                        animator.SetInteger("kick", 0);
                    }
                }
            }//Count

        }//fight

        else if (doing == "doing")
        {
            if (condition == 4)
            {
                RotateTo(doing_angle.y);
                transform.position = Vector3.Lerp(transform.position, Vector(doing_position.x, transform.position.y, doing_position.z), 10 * Time.deltaTime);
            }//condition
        }//"doing"


        if (run)
        {
            if (grounded)
            {
                step_timer += Time.deltaTime;
                if (step_timer > 0.15 / (speed / 4)) { step_timer = 0; PlaySoundStep(); }

                Vector3 temp_velocity = transform.TransformDirection(direction) * speed * speed_walk;
                transform.GetComponent<Rigidbody>().velocity = Vector(temp_velocity.x, transform.GetComponent<Rigidbody>().velocity.y, temp_velocity.z);
                RotateTo(rotation_temp + angle);

                direction = Vector3.Lerp(direction, direction_temp, 10 * Time.deltaTime);
                speed = Mathf.Lerp(speed, speed_temp, 10 * Time.deltaTime);
                animator.SetFloat("direction_x", direction.x);
                animator.SetFloat("direction_z", direction.z);
                animator.SetFloat("speed", speed);
                animator.SetFloat("rotation_y", -Functions.AngleSingle180(transform.eulerAngles.y - rotation));
                rotation = Quaternion.Slerp(Quaternion.Euler(0, rotation, 0), Quaternion.Euler(0, rotation_temp, 0), 5 * Time.deltaTime).eulerAngles.y;
                if (runing)
                {
                    speed_temp = speed_max + 1;
                    animator.SetBool("run", true);
                }
                else
                {
                    speed_temp = speed_max;
                    animator.SetBool("run", false);
                }
                if (direction.magnitude < 0.1 && doing != "go_to_vehicle") { MoveFalse(); Idle(); }
                direction_temp = Vector3.zero;
            }//grounded


        }//run

    }//Update
    void OnCollisionStay(Collision _collision)
    {
        if (_collision.contacts.Length > 0 && _collision.contacts[0].point.y < transform.position.y + 0.2f) collision = true;
    }//

    private bool FallBigHaight = false;
    void OnCollisionEnter(Collision _collision)
    {
        if (_collision.rigidbody && _collision.rigidbody.mass < 30) { return; }
        if(_collision.transform.root.GetComponent<Vehicle>() && _collision.relativeVelocity.sqrMagnitude > 70)
        {
            if (_collision.transform.root.GetComponent<Vehicle>().place[0].man)
            {
                AudioSource.PlayClipAtPoint(game_sc.man_hit_car[0], transform.position, 1);
                killer = _collision.transform.root.GetComponent<Vehicle>().place[0].man;
                _collision.transform.root.GetComponent<Vehicle>().place[0].man.GetComponent<Man>().Danger();
            }
            Damage(doing != "fall" ? _collision.relativeVelocity.sqrMagnitude / 5 : 80, 60000, _collision.relativeVelocity.normalized, _collision.contacts[0].point, killer);
        }
        if (_collision.relativeVelocity.sqrMagnitude > 200)
        {
            Damage(FallBigHaight ? max_health/100*80 : _collision.relativeVelocity.sqrMagnitude / 5, 60000, _collision.relativeVelocity.normalized, _collision.contacts[0].point, killer);
            if (FallBigHaight) FallBigHaight = false;
        }//sqrMagnitude
    }//OnCollisionEnter
    void OnCollisionExit(Collision _collision)
    {
        collision = false;
    }//OnCollisionEnter

    public void Idle()
    {
        animator.applyRootMotion = false;
        animator.SetInteger("doing", 0);
        animator.SetInteger("condition", 0);
        other_doing = false;
        doing = "idle";
        can_doing = 0;
        run = false;
    }//Idle

    public void Run(Vector3 _direction, float _rotation_y, bool _hit)
    {
        if (can_doing < 2)
        {
            if (doing == "fight") FightFalse();
            can_doing = 1;
            animator.SetInteger("doing", 0);
            if (_hit)
            {
                RaycastHit hit;
                if (Physics.Raycast(transform.position + Vector(0, 0.5f, 0), transform.TransformDirection(Vector(1, -0.5f, 1)), out hit, 0.7f) && hit.transform.tag != "door") { angle -= 10; }
                else if (Physics.Raycast(transform.position + Vector(0, 0.5f, 0), transform.TransformDirection(Vector(-1, -0.5f, 1)), out hit, 0.7f) && hit.transform.tag != "door") { angle += 10; }
                else if (angle > 0) { angle -= 5; }
                else if (angle < 0) { angle += 5; }
            }
            else { angle = 0; }

            run = true;
        }//can_doing
        rotation_temp = _rotation_y;
        direction_temp = _direction;
    }//Run

    public void RunPlayer(Vector3 _direction, float _rotation_y, bool _hit)
    {
        if (can_doing < 2)
        {
            if (doing == "fight") FightFalse();
            can_doing = 1;
            animator.SetInteger("doing", 0);
            if (_hit)
            {
                RaycastHit hit;
                if (Physics.Raycast(transform.position + Vector(0, 0.5f, 0), transform.TransformDirection(Vector(1, -0.5f, 1)), out hit, 0.7f) && hit.transform.tag != "door") { angle -= 10; }
                else if (Physics.Raycast(transform.position + Vector(0, 0.5f, 0), transform.TransformDirection(Vector(-1, -0.5f, 1)), out hit, 0.7f) && hit.transform.tag != "door") { angle += 10; }
                else if (angle > 0) { angle -= 5; }
                else if (angle < 0) { angle += 5; }
            }
            else { angle = 0; }

            run = true;
        }//can_doing
        rotation_temp = _rotation_y;
        direction_temp = _direction;
    }//Run

    public void Go(Vector3 _direction, float _rotation_y, float _speed)
    {
        //if(GetComponent(CharacterController)){GetComponent(CharacterController).Move(_direction*Time.deltaTime*_speed);}
        RotateTo(_rotation_y);
    }//go


    public void RotateTo(float _rotation)
    {
        transform.eulerAngles = Vector(transform.eulerAngles.x, Quaternion.Slerp(transform.rotation,
            Quaternion.Euler(0, _rotation, 0), rotation_speed * Time.deltaTime).eulerAngles.y, transform.eulerAngles.z);
    }//RotateTo



    public void Jump()
    {
        if (grounded && doing != "jump" && can_doing < 3)
        {
            run = false;
            can_doing = 2;
            if (doing == "fight") FightFalse();
            animator.SetInteger("doing", 2);
            doing = "jump";
            jump_timer = 0;
            GetComponent<Rigidbody>().AddForce((Vector(0, 2, 0) + transform.TransformDirection(direction_temp * (speed / 5))) * 6000);
            animator.SetBool("grounded", false);
            AudioSource.PlayClipAtPoint(game_sc.sound_jump[Random.Range(0, game_sc.sound_jump.Length)], transform.position, 0.2f);
        }
    }//Jump

    public void Fight(int _num, float _rotation_y)
    {
        if (can_doing == 0)
        {
            other_doing = true;
            run = false;
            animator.applyRootMotion = true;
            //animator.SetBool("fight",true);
            animator.SetInteger("doing", 1);
            doing = "fight";
            rotation_y = _rotation_y;
            if (kick.Count < 3)
            {
                if (kick.Count == 0)
                {
                    kick.Add(_num);
                }
                else if (kick[kick.Count - 1] == 4 && _num == 2)
                {
                    kick.Add(7);
                }
                else
                {
                    kick.Add(_num + 3);
                }
            }
        }//can_doing
    }//Fight

    public void Kick()
    {
        RaycastHit temp_hit;
        int temp_sound = 6;
        int temp_height = (int)1.4;

        if (kick[0] == 3) { temp_height = 1; }
        if (Physics.Raycast(transform.position + Vector(0, temp_height, 0), transform.TransformDirection(Vector(0.2f, 0, 1)), out temp_hit, 1.5f) ||
         Physics.Raycast(transform.position + Vector(0, temp_height, 0), transform.TransformDirection(Vector(-0.2f, 0, 1)), out temp_hit, 1.5f))
        {
            if (temp_hit.transform.GetComponent<Man>())
            {
                if (temp_hit.transform.GetComponent<Man>().cop) Danger();
                temp_hit.transform.GetComponent<Man>().Damage(Random.Range(20, 30), 60000, transform.TransformDirection(Vector3.forward), temp_hit.point, transform);
            }
            else if (temp_hit.rigidbody) { temp_hit.rigidbody.AddForce(transform.TransformDirection(Vector3.forward) * 20000); }
            else if (temp_hit.transform.root.GetComponent<Rigidbody>())
            {
                temp_hit.transform.root.GetComponent<Rigidbody>().AddForce(transform.TransformDirection(Vector3.forward) * 20000);
            }


            if (temp_hit.collider.name != "Terrain")
            {
                if (temp_hit.collider.material.name == "Metal (Instance)") { temp_sound = 5; }
                else if (temp_hit.collider.material.name == "Wood (Instance)") { temp_sound = 7; }
                else if (temp_hit.collider.material.name == "man (Instance)") { temp_sound = Random.Range(0, 4); }
                else
                {
                    temp_sound = 6;
                    Damage(Random.Range(5, 10), 0, Vector3.zero, Vector3.zero, null);
                }
            }//Terrain



            AudioSource.PlayClipAtPoint(game_sc.sound_kick[temp_sound], transform.position, 0.5f);
        }//Raycast

        kick_hit = true;
    }//Kick

    public void FightFalse()
    {
        Move();
        kick.Clear();
        animator.SetInteger("kick", 0);
    }//FightFalse

    public void Move()
    {
        other_doing = false;
        can_doing = 1;
        if (vehicle_place != null) { vehicle_place.use = false; }
        animator.applyRootMotion = false;
        animator.SetInteger("doing", 0);
        doing = "null";
        if (!player && go_to_car) doing = "go_to_vehicle";
        run = true;
    }//Run

    public void MoveFalse()
    {
        other_doing = false;
        can_doing = 1;
        animator.applyRootMotion = false;
        animator.SetInteger("doing", 0);
        animator.SetFloat("speed", 0);
        animator.SetBool("run", false);
        animator.SetFloat("direction_x", 0);
        animator.SetFloat("direction_z", 0);
        speed = 0;
        //runing = false; //прерывание режима бега, когда перс останавливается
        run = false;
        doing = "idle";
        Idle();
    }//Run

    public void FindVehicle(bool _place)
    {
        if (doing == "stand_up") return;
        float temp_distance;
        float temp_distance_big = 20;
        Transform temp_vehicle;
        Transform temp_target = null;
        ClassVehiclePlace temp_place;
        ClassVehiclePlace temp_near_place = null;
        for (var i = 0; i < game_sc.vehicle.Count; i++)
        {
            if (game_sc.vehicle[i].GetComponent<Vehicle>().death) continue;
            temp_vehicle = game_sc.vehicle[i];
            temp_distance = Vector3.Distance(transform.position, temp_vehicle.position);
            if (temp_distance < temp_distance_big)
            {
                temp_distance_big = temp_distance;
                temp_target = temp_vehicle;
            }//temp_distance
        }//for
        if (temp_target != null)
        {
            if (!_place)
            {
                temp_distance_big = 50;
                for (var j = 0; j < temp_target.GetComponent<Vehicle>().place.Length; j++)
                {
                    temp_place = temp_target.GetComponent<Vehicle>().place[j];
                    temp_distance = Vector3.Distance(transform.position, temp_place.door_point.position);
                    if (temp_distance < temp_distance_big)
                    {
                        temp_distance_big = temp_distance;
                        temp_near_place = temp_place;
                    }//temp_distance
                }//for
            }//_place
            else
            {
                temp_near_place = temp_target.GetComponent<Vehicle>().place[0];
            }//else
            other_doing = true;
            doing = "go_to_vehicle";
            go_to_car = true;
            vehicle = temp_target;
            vehicle_sc = vehicle.GetComponent<Vehicle>();
            vehicle_place = temp_near_place;
            vehicle_place.use = true;
            animator.SetInteger("condition", 0);
            animator.SetInteger("door_direction", vehicle_place.direction);
            condition = 0;
            return;
        }
        else { return; }
    }//FindVehicle

    public bool SitMyVehicle()
    {
        if (doing == "stand_up") return false;
        if (my_vehicle != null && my_vehicle_place != null)
        {
            float temp_distance = Vector3.Distance(transform.position, my_vehicle.position);
            if (temp_distance < 50)
            {
                doing = "go_to_vehicle";
                go_to_car = true;
                vehicle = my_vehicle;
                vehicle_sc = vehicle.GetComponent<Vehicle>();
                vehicle_place = my_vehicle_place;
                other_doing = true;
                //animator.SetInteger("doing",4);
                animator.SetInteger("condition", 0);
                animator.SetInteger("door_direction", vehicle_place.direction);
                condition = 0;
                return true;
            }//temp_distance
            else
            {
                return false;
                my_vehicle = null;
                my_vehicle_place = null;
            }
        }//my_vehicle
        else
        {
            return false;
            my_vehicle = null;
            my_vehicle_place = null;
        }
    }//SitMyVehicle

    public void SitTheVehicle(Transform _vehicle, bool _place, int _place_num, bool _engine_start)
    {
        float temp_distance;
        float temp_distance_big = 20;
        ClassVehiclePlace temp_place;
        ClassVehiclePlace temp_near_place = null;
        if (!animator) animator = GetComponent<Animator>();
        if (_vehicle)
        {
            temp_distance_big = 50;

            if (!_place)
            {
                for (var j = 0; j < _vehicle.GetComponent<Vehicle>().place.Length; j++)
                {
                    temp_place = _vehicle.GetComponent<Vehicle>().place[j];
                    temp_distance = Vector3.Distance(transform.position, temp_place.door_point.position);
                    if (temp_distance < temp_distance_big && !temp_place.use)
                    {
                        temp_distance_big = temp_distance;
                        temp_near_place = temp_place;
                    }//temp_distance
                }//for
            }//_place
            else if (_vehicle.GetComponent<Vehicle>().place.Length > _place_num)
                temp_near_place = _vehicle.GetComponent<Vehicle>().place[_place_num];

            if (temp_near_place != null)
            {
                other_doing = true;
                doing = "go_to_vehicle";
                go_to_car = true;
                engine_start = _engine_start;
                vehicle = _vehicle;
                vehicle_sc = vehicle.GetComponent<Vehicle>();
                vehicle_place = temp_near_place;
                vehicle_place.use = true;
                //animator.SetInteger("doing",4);
                animator.SetInteger("condition", 0);
                animator.SetInteger("door_direction", vehicle_place.direction);
                condition = 0;
                return;
            }//temp_near_place
        }//_vehicle
    }//SitMyVehicle

    public void SitVehicle(Transform _vehicle, ClassVehiclePlace _place, bool _engine_start)
    {
        if(player && player_sc.MInput.ManController.ManControllerPanel.activeSelf)
        {
            player_sc.MInput.ManController.ManControllerPanel.SetActive(false);
        } 
        if (_vehicle)
        {
            vehicle = _vehicle;
            vehicle_sc = vehicle.GetComponent<Vehicle>();
            if (player)
            {
                vehicle_sc.limit_speed = (int)vehicle_sc.max_speed;
                player_sc.NextCameraVehicle(0, true);
                if (vehicle.GetComponent<CarCop>()) vehicle.GetComponent<CarCop>().enabled = false;
                vehicle.GetComponent<RCC_CarControllerV3>().canControl = true;
            }//player
            if (GetComponent<Bot>())
            {
                GetComponent<Bot>().enabled = false;
                vehicle_place = _place;
                //if(!_engine_start){vehicle_place=vehicle_sc.place[vehicle_sc.place_drive];}
                if (vehicle_place == vehicle_sc.place[vehicle_sc.place_drive] && vehicle.GetComponent<VehicleBot>())
                {
                    vehicle.GetComponent<VehicleBot>().enabled = true;
                    vehicle.GetComponent<VehicleBot>().Invoke("FindNearPoint", 0.1f);
                }
            }//sc_bot
             //if(GetComponent(sc_weapon))GetComponent(sc_weapon).EndFire();
            vehicle_place.man = transform;
            my_vehicle_place = vehicle_place;
            my_vehicle = vehicle;
            vehicle_sc.driver = transform;
            vehicle_place.use = true;
            doing = "sit_vehicle";
            go_to_car = false;
            can_doing = 4;
            other_doing = false;
            GetComponent<Animator>().SetInteger("doing", 4);
            GetComponent<Animator>().SetInteger("condition", 2);
            GetComponent<Animator>().SetInteger("place", vehicle_place.anim);
            GetComponent<Animator>().SetInteger("door_direction", vehicle_place.direction);
            GetComponent<CapsuleCollider>().enabled = false;
            if (bip_collider)
            {
                bip_collider.GetComponent<CapsuleCollider>().enabled = true;
            }//bip_collider
                                                                                              //Physics.IgnoreCollision(my_vehicle.collider,bip_collider.collider,true);}//bip_collider

            GetComponent<AudioSource>().enabled = false;
            GetComponent<Rigidbody>().isKinematic = true;
            ActivateComponents(false);
            if (GetComponent<Cop>() && vehicle.GetComponent<CarCop>()) { vehicle.GetComponent<CarCop>().enabled = true; }
            if (_engine_start && vehicle_place == vehicle_sc.place[vehicle_sc.place_drive] && !vehicle_sc.engine_work) { vehicle_sc.EngineStart(); }
        }//temp_target

    }//SitVehicle



    public void GoOutVehicle()
    {
        Door temp_com = null;
        can_doing = 3;
        doing = "go_out_vehicle";
        animator.SetInteger("doing", 4);
        animator.SetInteger("condition", 3);
        animator.SetInteger("door_direction", vehicle_place.direction);
        if (player)
        {
            //StartCoroutine(player_sc.EclipseScreen());
            player_sc.CameraCharacter();
            vehicle.GetComponent<RCC_CarControllerV3>().canControl = false;
            if (!player_sc.MInput.ManController.ManControllerPanel.activeSelf)
            {
                player_sc.MInput.ManController.ManControllerPanel.SetActive(true);
            }
        }
        if (vehicle_place.door && !vehicle_place.door.GetComponent<Door>())
        {
            if (vehicle_place.door.GetComponent<Door>()) { temp_com = vehicle_place.door.GetComponent<Door>(); }
            else { temp_com = vehicle_place.door.gameObject.AddComponent(typeof(Door)) as Door; }
            temp_com.Setting(0, vehicle_place, vehicle_place.direction);
            temp_com.Invoke("Open", 0.1f);
        }

        if (GetComponent<Door>())
        {
            if (vehicle_place == vehicle_sc.place[vehicle_sc.place_drive]) { vehicle.GetComponent<VehicleBot>().enabled = false; }
        }
        if (vehicle.GetComponent<CarCop>()) { vehicle.GetComponent<CarCop>().enabled = false; }
        vehicle_sc.throttle = 0;
        vehicle_place.use = false;
    }//GoOutVehicle



    public void StandUp()
    {
        RaycastHit hit;
        doing = "stand_up";
        can_doing = 3;
        rag_doll = false;
        ragdoll.ActivateRagdoll(false);
        //animator.applyRootMotion=true;
        if (Functions.AngleSingle180(bip.eulerAngles.z) < 180 && Functions.AngleSingle180(bip.eulerAngles.z) > 0)
        {
            transform.eulerAngles = Vector(transform.eulerAngles.x, bip.eulerAngles.y + 90, transform.eulerAngles.z);
            animator.SetInteger("stand_up", 1);
        }
        else
        {
            transform.eulerAngles = Vector(transform.eulerAngles.x, bip.eulerAngles.y + 90, transform.eulerAngles.z);
            animator.SetInteger("stand_up", 0);
        }
        animator.SetInteger("doing", 5);
        if (Physics.Raycast(bip.position + Vector(0, 0.5f, 0), Vector(0, -1, 0), out hit, 2))
        {
            transform.position = Vector(transform.position.x, hit.point.y - 0.3f, transform.position.z);
        }
    }//StandUp

    public void FlyCar()
    {
        if (player)
        {
            player_sc.CameraCharacter();
            vehicle.GetComponent<RCC_CarControllerV3>().canControl = false;
            if (!player_sc.MInput.ManController.ManControllerPanel.activeSelf)
            {
                player_sc.MInput.ManController.ManControllerPanel.SetActive(true);
            }
        }
        animator.SetInteger("doing", 6);
        animator.SetInteger("condition", 0);
        animator.SetInteger("door_direction", vehicle_place.direction);
        if (GetComponent<Bot>())
        {
            if (vehicle_place == vehicle_sc.place[vehicle_sc.place_drive]) { vehicle.GetComponent<VehicleBot>().enabled = false; }
        }
        vehicle_sc.throttle = 0;
        vehicle_place.use = false;
        doing = "fly_car";
        can_doing = 3;
    }//FlyCar

    public void Swim()
    {
        if (!grounded)
        {
            Rigidbody rigid = GetComponent<Rigidbody>();
            rigid.centerOfMass = Vector(rigid.centerOfMass.x, swim_centr, rigid.centerOfMass.z);
            can_doing = 3;
            doing = "swim";
            animator.SetInteger("doing", 8);
        }//grounded
    }//Swim

    public void CreateSwimParticle()
    {
        //RaycastHit hit;
        //if(Physics.Raycast(transform.position+Vector3(0,1.9,0),Vector3(0,-1,0),hit,2)){
        //Instantiate (game_sc.particle_swim,hit.point+Vector3(0,0.1,0),Quaternion.Euler(Vector3.zero));}
        AudioSource.PlayClipAtPoint(game_sc.sound_step_water[Random.Range(0, game_sc.sound_step_water.Length)], transform.position, 1);
        swim_particle = false;
    }//CreateSwimParticle

    public void Doing(int _index, float _time, Vector3 _angle, Vector3 _position)
    {
        MoveFalse();
        doing_angle = _angle;
        doing_position = _position;
        condition = _index;
        doing = "doing";
        can_doing = 2;
        animator.SetInteger("doing", 7);
        animator.SetInteger("condition", _index);
        if (_index == 4)
        {
            rhand_object = Instantiate(game_sc.object1[Random.Range(0, 2)], hand_r.position, hand_r.rotation) as Transform;
            rhand_object.parent = hand_r;
        }//_index
        else if (_index == 5)
        {
            rhand_object = Instantiate(game_sc.object1[3], hand_r.position, hand_r.rotation) as Transform;
            rhand_object.parent = hand_r;
        }//_index

        Invoke("DoingFalse", _time);
    }//Dance

    public void DoingFalse()
    {
        if (rhand_object) { Destroy(rhand_object.gameObject); }
        Idle();
    }//DanceFalse

    public void Danger()
    {
        if (!cop)
        {
            if (player && !player_sc.WantCor)
            {
                player_sc.StartCoroutine(player_sc.WantedCoroutine());
            }
            else
            {
                danger_timer = 0;
                danger = true;
            }
        }//sc_cop
    }//Danger

    public void InvokeDamage()
    {
        Damage(invoke_damage, 0, Vector3.zero, Vector3.zero, null);
    }//InvokeDamage

    public void Damage(float _power, float _force, Vector3 _dir, Vector3 _point, Transform _killer)
    {
        if (!death)
        {
            if (armor > 0)
            {
                armor -= (int)_power;
                if (armor <= 0 && armor_ob)
                {
                    armor = 0;
                    armor_ob.gameObject.SetActive(false);
                }
            }//armor
            if (armor <= 0) health -= (int)_power;
            //transform.rigidbody.AddForce(_dir*_force);
            if (player) { player_sc.Hit(); }
            if (_killer) { killer = _killer; }
            if (health <= 0)
            {
                death = true;
                game_sc.Death(man, transform);
                if (player) player_sc.PlayerDeath();
                //game_sc.CreatePD(transform,killer);
                if (killer) { killer.GetComponent<Man>().AddWantedScore(ws_index); }
                if (vehicle && (/*vehicle.GetComponent<sc_motobike_js>() ||*/ vehicle_sc.boat))//temp
                {
                    if (vehicle.GetComponent<VehicleBot>()) { vehicle.GetComponent<VehicleBot>().enabled = false; }
                    if (vehicle.GetComponent<CarCop>()) { vehicle.GetComponent<CarCop>().enabled = false; }
                    //if (vehicle.GetComponent<sc_motobike_js>()) vehicle.GetComponent<sc_motobike_js>().crash = true;//temp
                    vehicle_sc.throttle = 0;
                    vehicle_place.use = false;
                    vehicle_place.man = null;
                }//sc_motobike_js
                if (doing == "sit_vehicle" /*&& !vehicle.GetComponent<sc_motobike_js>()*/ && !vehicle_sc.boat) { DeathInCar(); }//temp
                else
                {
                    transform.GetComponent<Rigidbody>().AddForceAtPosition(_dir * _force, _point);
                    RagDoll();
                    CreateMoney();
                }
            }//health
            if (_force > 40000 && health > 0 && !rag_doll)
            {
                transform.GetComponent<Rigidbody>().AddForceAtPosition(_dir * _force, _point);
                RagDoll();
            }
        }//death
        if(player)
        {
            player_sc.MInput.PlayerHealth = health;
            player_sc.MInput.PlayerArmor = armor;
        }
    }//Damage

    public void RagDoll()
    {
        rag_doll = true;
        if (script_weapon) script_weapon.EndFire();
        run = false;
        if (player) player_sc.CameraCharacter();
        if(ragdoll != null)
        {
            ragdoll.ActivateRagdoll(true);
        }
        //if (!GetComponent<Ragdoll>() && !GetComponent<Ragdoll_ready>())
        //{
        //    run = false;
        //    if (player) player_sc.CameraCharacter();
        //    gameObject.AddComponent(typeof(Ragdoll));
        //}
        //else if (GetComponent<Ragdoll_ready>())
        //{
        //    run = false;
        //    if (player) player_sc.CameraCharacter();
        //    GetComponent<Ragdoll_ready>().RagDoll();
        //}//else
        //if(bip_collider.GetComponent<Collider>())
        //    bip_collider.GetComponent<Collider>().enabled = false;
        ActivateComponents(false);
    }//RagDoll

    public List<BoxCollider> Boxes = new List<BoxCollider>();
    public List<SphereCollider> Spheres = new List<SphereCollider>();
    public List<CapsuleCollider> Capsules = new List<CapsuleCollider>();

    public void PlaySoundStep()
    {
        RaycastHit hit2 = new RaycastHit();
        audio_source.clip = game_sc.sound_step_default[Random.Range(0, game_sc.sound_step_default.Length)];
        if (hit2.collider && hit2.collider.GetType() != typeof(TerrainCollider) && hit2.collider.material)
        {
            if (hit2.collider.material.name == "Metal (Instance)") { audio_source.clip = game_sc.sound_step_metal[Random.Range(0, game_sc.sound_step_metal.Length)]; }
            else if (hit2.collider.material.name == "Wood (Instance)") { audio_source.clip = game_sc.sound_step_wood[Random.Range(0, game_sc.sound_step_wood.Length)]; }
            else if (hit2.collider.material.name == "Water (Instance)") { audio_source.clip = game_sc.sound_step_water[Random.Range(0, game_sc.sound_step_water.Length)]; }
        }//collider
        audio_source.Play();

    }//PlaySoundStep




    public void DeathInCar()
    {
        vehicle_place.use = false;
        animator.SetInteger("condition", 4);
        vehicle_sc.throttle = 0;
        if (GetComponent<CapsuleCollider>()) { Destroy(GetComponent<CapsuleCollider>()); }
        if (script_weapon) { Destroy(script_weapon); }
        if (GetComponent<Bot>()) { Destroy(GetComponent<Bot>()); }
        if (GetComponent<Cop>()) { Destroy(GetComponent<Cop>()); }
        if (vehicle.GetComponent<VehicleBot>()) { vehicle.GetComponent<VehicleBot>().enabled = false; }
        if (vehicle.GetComponent<CarCop>()) { vehicle.GetComponent<CarCop>().enabled = false; }
    }//DeathInCar

    public void AddWantedScore(int _index)
    {
        Danger();
        if (wanted_score < 600)
        {
            wanted_score += _index;
            if (wanted_score > 600) { wanted_score = 600; }
        }//600
    }//AddWantedScore

    public void ActivateComponents(bool _index)
    {
        if (script_weapon) { script_weapon.enabled = _index; }
        if (GetComponent<Bot>()) { GetComponent<Bot>().enabled = _index; }
        if (GetComponent<Cop>()) { GetComponent<Cop>().enabled = _index; }
        if (GetComponent<Band>()) { GetComponent<Band>().enabled = _index; }

    }//ActivateComponents


    public void CreateMoney()
    {
        Transform temp_object = Instantiate(game_sc.money_ob);
        temp_object.position = transform.position + Vector(0, 1, 0);
        temp_object.GetComponent<Rigidbody>().AddForce(transform.TransformDirection(Vector3.forward) * 2000);
        temp_object.GetComponent<Money>().money = money;
    }//CreateMoney

    public void GiveArmor(int _armor)
    {
        //max_armor = 500;
        if (player) player_sc.MInput.PlayerArmor = player_sc.MInput.ManController.MaxArmorPlayer;
        armor = player_sc.MInput.PlayerArmor;
        if (armor_ob) armor_ob.gameObject.SetActive(true);
    }//GiveArmor

    public void GiveParachute()
    {
        if (parachute) return;
        if (player) PlayerPrefs.SetInt("parachute", 1);
        parachute = Instantiate(game_sc.parachute);
        parachute.parent = bip_collider;
        parachute.localPosition = Vector3.zero;
        parachute.localEulerAngles = Vector3.zero;
    }//GiveArmor



    public void OpenParachute()
    {
        if (!parachute || open_parachute) return;
        if (player) PlayerPrefs.SetInt("parachute", 0);
        script_weapon.WeaponSelect(0);
        parachute.transform.GetChild(0).transform.GetComponent<Animation>().Play();
        player_sc.NextCamera(3);
        if (game_sc.sound_parachute)
        {
            parachute.gameObject.AddComponent(typeof(AudioSource));
            parachute.GetComponent<AudioSource>().clip = game_sc.sound_parachute;
            parachute.GetComponent<AudioSource>().Play();
        }//sound_parachute
        GetComponent<Rigidbody>().drag = 2;
        can_doing = 3;
        doing = "parachute";
        animator.SetInteger("doing", 15);
        open_parachute = true;
    }//OpenParachute

    public void Voice(int _voice, int _random)
    {
        if (audio_voice.isPlaying || death || Random.Range(0, 100) > _random) return;
        audio_voice.clip = game_sc.sound_voice[man].voice[_voice].sound[Random.Range(0, game_sc.sound_voice[man].voice[_voice].sound.Count)];
        audio_voice.Play();
    }//Voice

    public void VoiceDeath() { Voice(2, 50); }
    public void VoiceBandDeath() { Voice(3, 50); }
}
