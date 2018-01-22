using UnityEngine;
using System.Collections.Generic;

public class VehicleBot : MonoBehaviour
{
    public ClassPointCar point;
    public ClassPointCar next_point;
    public Transform target;
    public float see_range =200;
    public bool stopped =true;
    private Rigidbody rigid;

    public bool engine_work;
    public bool global_target;
    public bool racer;
    public bool have_point;
    public bool police;
    public bool go_to_target;
    public bool stop_on_target;
    public bool racer_collision=true;
    public Vector3 global_target_pos;
    public Vector3 target_pos;

    public Game game_sc;
    private Patches patch_script;
    private Vehicle vehicle_sc;
    private string doing="run";
    private float target_angle;
    private float target_distance;
    private float collision_timer;
    private float racer_timer;
    private bool back_speed;
    private bool collision=false;
    private bool collision_right;
    private bool collision_left;
    private Transform collider_driver;
    private Transform collider_stop;
    private Transform collider_racer;
    private Transform collider_left_ob;
    private Transform collider_right_ob;
    private Trigger col_stop_script;
    private Trigger col_right_script;
    private Trigger col_left_script;
    public float _magnitude;

    public RCC_CarControllerV3 CarController;
    public float Gas = 0;
    public float SteerAngel = 0;
    public bool Handbrake = false;

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
        CarController = GetComponent<RCC_CarControllerV3>();
        CarController.canControl = false;
        patch_script = GameObject.Find("Game").GetComponent<Patches>();
        collider_driver = transform.FindChild("controller").FindChild("collider_driver");
        collider_stop = collider_driver.FindChild("collider_stop");
        collider_racer = collider_driver.FindChild("collider_racer");
        if (collider_stop) col_stop_script = collider_stop.GetComponent<Trigger>();
        collider_right_ob = collider_racer.FindChild("collider_right").transform;
        collider_left_ob = collider_racer.FindChild("collider_left").transform;
        col_right_script = collider_right_ob.GetComponent<Trigger>();
        col_left_script = collider_left_ob.GetComponent<Trigger>();
        vehicle_sc = GetComponent<Vehicle>();
        Invoke("LateStart", 0.001f);
        rigid = GetComponent<Rigidbody>();
    }

    void LateStart()
    {
        if (engine_work)
        {
            vehicle_sc.EngineWork();
        }
        if (racer)
        {
            Racer(true, vehicle_sc.max_speed * 0.8f);
            FindNearPoint();
            vehicle_sc.EngineStart();
        }
    }

    void Update()
    {
        if(!racer)
        {
            NoRacerBot();
        }
        else
        {
            RacerBot();
        }
        /*Gas = CarController.BotGas;
        SteerAngel = CarController.BotSteer;
        Handbrake = CarController.BotHandbrake;

        if (doing == "run")
        {
            _magnitude = GetComponent< Rigidbody > ().velocity.magnitude; //узнаем длину вектора скорости
            target_angle = Quaternion.LookRotation(target_pos - transform.position).eulerAngles.y;
            float target_angle_diff= Functions.AngleSingle180(target_angle - transform.eulerAngles.y);
            float target_angle_diff_abs = Functions.AngleSingle180Abs(target_angle - transform.eulerAngles.y);

            if (!back_speed)//если !не задний ход!
            {
                collider_stop.localScale = Vector(collider_stop.localScale.x, collider_stop.localScale.y, 2 + _magnitude / 1.3f);
                float temp_throttle= 0.01f;
                if (racer) temp_throttle = 50;
                CarController.BotGas = Mathf.Lerp(CarController.BotGas, 1, Time.deltaTime * temp_throttle);
                if (!collision)
                {
                    CarController.BotSteer = target_angle_diff / 30;
                }

                if (target_angle_diff_abs > 90 && !vehicle_sc.boat)
                {
                    CarController.brake = 1000;//vehicle_sc.StopVehicle(100);
                    if (_magnitude < 1)
                    {
                        back_speed = true;
                        CarController.BotGas = -1;
                    }
                }//target_angle_diff_abs
            }//back_speed
            else
            {
                CarController.BotSteer = -target_angle_diff / 30;
                if (target_angle_diff_abs < 30)
                {
                    CarController.brake = 1500;//vehicle_sc.StopVehicle(200);
                    CarController.BotGas = 0;
                    if (_magnitude < 1) { back_speed = false; }
                }//target_angle_diff_abs
                else { CarController.BotGas = -1; }
            }//else
            if (!racer)
            {
                CarController.BotHandbrake = false;
                if (col_stop_script && col_stop_script.collision)
                {
                    if (stopped && col_stop_script.collision.name != "collider_stop" && col_stop_script.collision.name != "speed_limit" && col_stop_script.collision.tag != "road" &&
                    col_stop_script.collision.tag != "ignore_collider" && !racer)
                    {
                        CarController.BotGas = 0;
                        CarController.BotHandbrake = true;
                        return;
                        //CarController.brake=2500+_magnitude*2;//vehicle_sc.StopVehicle(80+_magnitude*2);
                    }
                }//collision
            }//racer

            else
            {
                RaycastHit temp_raycast;

                if (!collision_right && !collision_left && Physics.Raycast(collider_right_ob.position, collider_right_ob.TransformDirection(Vector3.forward), out temp_raycast, 1 + _magnitude * 0.6f)
                    && temp_raycast.collider.transform.root.tag == "vehicle")
                {
                    collision_right = true;
                }//collision_left
                else if (!collision_right && !collision_left && Physics.Raycast(collider_left_ob.position, collider_left_ob.TransformDirection(Vector3.forward), out temp_raycast, 1 + _magnitude * 0.6f)
                    && temp_raycast.collider.transform.root.tag == "vehicle")
                {
                    collision_left = true;
                }

                if (collision_right && racer_collision)
                {
                    CarController.BotSteer = Mathf.Lerp(CarController.BotSteer, -1, 500 * Time.deltaTime);
                    collision = true;
                    collision_timer += Time.deltaTime;
                }//collision_right
                else if (collision_left && racer_collision)
                {
                    CarController.BotSteer = Mathf.Lerp(CarController.BotSteer, 1, 500 * Time.deltaTime);
                    collision = true;
                    collision_timer += Time.deltaTime;
                }//collision_right
                else
                {
                    collision = false;
                }

                if (collision_timer > 0.06 + 50 / (_magnitude * _magnitude))
                {
                    collision_timer = 0;
                    collision_right = false;
                    collision_left = false;
                }//collision_timer

                if (GetComponent< Rigidbody > ().velocity.magnitude < 1)
                {
                    racer_timer += Time.deltaTime;
                    if (racer_timer > 10 && !back_speed) { back_speed = true; CarController.BotGas = 0; racer_timer = 0; }
                    else if (racer_timer > 10 && back_speed) { back_speed = false; CarController.BotGas = 0; racer_timer = 0; }
                }//magnitude
                else if (racer_timer != 0) { racer_timer = 0; }
            }//racer

            target_distance = Vector3.Distance(Vector(target_pos.x, 0, target_pos.z), Vector(transform.position.x, 0, transform.position.z));
            if (point != null && have_point)
            {
                Vector3 temp_point_angle = Quaternion.LookRotation(next_point._position - point._position).eulerAngles;
                Vector3 temp_point_angle_diff_abs = Functions.Angle180Abs(temp_point_angle - transform.eulerAngles);

                if (target_distance < 30 && temp_point_angle_diff_abs.y > 25 && _magnitude > 10 && !racer)
                {
                    CarController.brake = temp_point_angle_diff_abs.y;//.StopVehicle(temp_point_angle_diff_abs.y);
                }//racer
                else
                {
                    temp_point_angle = Quaternion.LookRotation(point._position - transform.position).eulerAngles;
                    temp_point_angle_diff_abs = Functions.Angle180Abs(temp_point_angle - transform.eulerAngles);
                    if (temp_point_angle_diff_abs.y > 60 && _magnitude > 20)
                    {
                        CarController.brake = 1000;//vehicle_sc.StopVehicle(100);
                    }
                }//racer
                if (target_distance < 2 + _magnitude / 1.5 && !go_to_target) NextPoint();

            }//point
            if (target_distance < 5 + _magnitude && go_to_target)
            {
                if (!stop_on_target) go_to_target = false;
                CarController.BotGas = 0;
                CarController.brake = 1500;//vehicle_sc.StopVehicle(200);
            }
        }//run
        else if (doing == "idle")
        {
            CarController.BotGas = 0;
        }
        */
    }//Update
    
    public void NoRacerBot()
    {
        Gas = CarController.BotGas;
        SteerAngel = CarController.BotSteer;
        Handbrake = CarController.BotHandbrake;

        CarController.BotHandbrake = false;

        if (doing == "run")
        {
            rigid.drag = 0;
            _magnitude = rigid.velocity.magnitude; //узнаем длину вектора скорости
            target_angle = Quaternion.LookRotation(target_pos - transform.position).eulerAngles.y;
            float target_angle_diff = Functions.AngleSingle180(target_angle - transform.eulerAngles.y);
            float target_angle_diff_abs = Functions.AngleSingle180Abs(target_angle - transform.eulerAngles.y);

            if (!back_speed)//если !не задний ход!
            {
                collider_stop.localScale = Vector(collider_stop.localScale.x, collider_stop.localScale.y, 2 + _magnitude / 1.3f);
                CarController.BotGas = 0.2f;
                
                if (target_angle_diff_abs > 90 && !vehicle_sc.boat)
                {
                    CarController.BotGas = -1;//vehicle_sc.StopVehicle(100);
                    rigid.drag = 1.5f;

                    if (_magnitude < 1)
                    {
                        back_speed = true;
                        rigid.drag = 0;
                    }
                }//target_angle_diff_abs
                else if (!collision)
                {
                    CarController.BotSteer = target_angle_diff / 30;
                }
            }//back_speed
            else
            {
                CarController.BotSteer = -target_angle_diff / 30;
                if (target_angle_diff_abs < 30)
                {
                    //CarController.BotGas = 0;//vehicle_sc.StopVehicle(200);
                    rigid.drag = 1.5f;
                    CarController.BotGas = 0.2f;
                    if (rigid.velocity.sqrMagnitude < 1)
                    {
                        back_speed = false;
                        rigid.drag = 0;
                    }
                }//target_angle_diff_abs
                else
                {
                    CarController.BotGas = -0.2f;
                }
            }//else
            
            if (col_stop_script && col_stop_script.collision)
            {
                if (stopped && col_stop_script.collision.name != "collider_stop" && col_stop_script.collision.name != "speed_limit" && col_stop_script.collision.tag != "road" &&
                col_stop_script.collision.tag != "ignore_collider")
                {
                    CarController.BotGas = 0;
                    rigid.drag = 2;
                    CarController.BotHandbrake = true;
                    return;
                    //CarController.brake=2500+_magnitude*2;//vehicle_sc.StopVehicle(80+_magnitude*2);
                }
            }//collision

            target_distance = Vector3.Distance(Vector(target_pos.x, 0, target_pos.z), Vector(transform.position.x, 0, transform.position.z));
            if (point != null && have_point)
            {
                Vector3 temp_point_angle = Quaternion.LookRotation(next_point._position - point._position).eulerAngles;
                Vector3 temp_point_angle_diff_abs = Functions.Angle180Abs(temp_point_angle - transform.eulerAngles);

                if (target_distance < 30 && temp_point_angle_diff_abs.y > 25 && _magnitude > 10)
                {
                    CarController.BotHandbrake = true;//.StopVehicle(temp_point_angle_diff_abs.y);
                }
                if (target_distance < 2 + _magnitude / 1.5 && !go_to_target) NextPoint();

            }//point
            if (target_distance < 5 + _magnitude && go_to_target)
            {
                if (!stop_on_target) go_to_target = false;
                CarController.BotGas = 0;
                CarController.BotHandbrake = true;
                rigid.drag = 2;//vehicle_sc.StopVehicle(200);
            }
        }//run
        else if (doing == "idle")
        {
            CarController.BotGas = 0;
        }
    }

    public void RacerBot()
    {
        Gas = CarController.BotGas;
        SteerAngel = CarController.BotSteer;
        Handbrake = CarController.BotHandbrake;

        if (doing == "run")
        {
            _magnitude = GetComponent<Rigidbody>().velocity.magnitude; //узнаем длину вектора скорости
            target_angle = Quaternion.LookRotation(target_pos - transform.position).eulerAngles.y;
            float target_angle_diff = Functions.AngleSingle180(target_angle - transform.eulerAngles.y);
            float target_angle_diff_abs = Functions.AngleSingle180Abs(target_angle - transform.eulerAngles.y);
            rigid.drag = 0;
            CarController.BotHandbrake = false;

            if (!back_speed)//если !не задний ход!
            {
                collider_stop.localScale = Vector(collider_stop.localScale.x, collider_stop.localScale.y, 2 + _magnitude / 1.3f);
                CarController.BotGas = 0.4f;
                if (!collision)
                {
                    CarController.BotSteer = target_angle_diff / 30;
                }

                if (target_angle_diff_abs > 90 && !vehicle_sc.boat)
                {
                    CarController.BotHandbrake = true;//vehicle_sc.StopVehicle(100);
                    rigid.drag = 2;
                    if (_magnitude < 1)
                    {
                        back_speed = true;
                        rigid.drag = 0;
                    }
                }//target_angle_diff_abs
            }//back_speed
            else
            {
                CarController.BotSteer = -target_angle_diff / 30;
                if (target_angle_diff_abs < 30)
                {
                    CarController.BotHandbrake = true;//vehicle_sc.StopVehicle(200);
                    CarController.BotGas = 0;
                    rigid.drag = 2;
                    if (_magnitude < 1)
                    {
                        back_speed = false;
                    }
                }//target_angle_diff_abs
                else
                {
                    CarController.BotGas = -1;
                }
            }//else

            RaycastHit temp_raycast;
            if (!collision_right && !collision_left && Physics.Raycast(collider_right_ob.position, collider_right_ob.TransformDirection(Vector3.forward), out temp_raycast, 1 + _magnitude * 0.6f)
                    && temp_raycast.collider.transform.root.tag == "vehicle" && temp_raycast.collider.transform.root != transform)
            {
                collision_right = true;
            }//collision_left
            else if (!collision_right && !collision_left && Physics.Raycast(collider_left_ob.position, collider_left_ob.TransformDirection(Vector3.forward), out temp_raycast, 1 + _magnitude * 0.6f)
                    && temp_raycast.collider.transform.root.tag == "vehicle" && temp_raycast.collider.transform.root != transform)
            {
                collision_left = true;
            }

            if (collision_right && racer_collision)
            {
                CarController.BotSteer = Mathf.Lerp(CarController.BotSteer, -1, 500 * Time.deltaTime);
                collision = true;
                collision_timer += Time.deltaTime;
            }//collision_right
            else if (collision_left && racer_collision)
            {
                CarController.BotSteer = Mathf.Lerp(CarController.BotSteer, 1, 500 * Time.deltaTime);
                collision = true;
                collision_timer += Time.deltaTime;
            }//collision_right
            else
            {
                collision = false;
            }

            if (collision_timer > 0.06 + 50 / (_magnitude * _magnitude))
            {
                collision_timer = 0;
                collision_right = false;
                collision_left = false;
            }//collision_timer

            if (GetComponent<Rigidbody>().velocity.magnitude < 1)
            {
                racer_timer += Time.deltaTime;
                if (racer_timer > 10 && !back_speed)
                {
                    back_speed = true;
                    CarController.BotGas = 0;
                    CarController.BotHandbrake = true;
                    rigid.drag = 2;
                    racer_timer = 0;
                }
                else if (racer_timer > 10 && back_speed)
                {
                    back_speed = false;
                    CarController.BotGas = 0;
                    CarController.BotHandbrake = true;
                    rigid.drag = 2;
                    racer_timer = 0;
                }
            }//magnitude
            else if (racer_timer != 0)
            {
                racer_timer = 0;
            }

            target_distance = Vector3.Distance(Vector(target_pos.x, 0, target_pos.z), Vector(transform.position.x, 0, transform.position.z));
            if (point != null && have_point)
            {
                Vector3 temp_point_angle = Quaternion.LookRotation(next_point._position - point._position).eulerAngles;
                Vector3 temp_point_angle_diff_abs = Functions.Angle180Abs(temp_point_angle - transform.eulerAngles);

                temp_point_angle = Quaternion.LookRotation(point._position - transform.position).eulerAngles;
                temp_point_angle_diff_abs = Functions.Angle180Abs(temp_point_angle - transform.eulerAngles);
                if (temp_point_angle_diff_abs.y > 60 && _magnitude > 20)
                {
                    CarController.BotHandbrake = true;//vehicle_sc.StopVehicle(100);
                    rigid.drag = 2;
                }
                if (target_distance < 2 + _magnitude / 1.5 && !go_to_target) NextPoint();

            }//point
            if (target_distance < 5 + _magnitude && go_to_target)
            {
                if (!stop_on_target) go_to_target = false;
                CarController.BotGas = 0;
                CarController.BotHandbrake = true;//vehicle_sc.StopVehicle(200);
                rigid.drag = 2;
            }
        }//run
        else if (doing == "idle")
        {
            CarController.BotGas = 0;
        }
    }

    public void FindNearPoint()
    {
        if (go_to_target) return;
        if (patch_script.point_car.Count > 0)
        {
            ClassPointCar temp_point;
            ClassPointCar temp_near_point = new ClassPointCar();
            float temp_distance_big= 1000;
            float temp_distance;

            for (var i = 0; i < patch_script.point_car.Count; i++)
            {
                temp_point = patch_script.point_car[i];
                temp_distance = Vector3.Distance(temp_point._position, transform.position);
                if (temp_distance < temp_distance_big) { temp_distance_big = temp_distance; temp_near_point = temp_point; }
            }//for
            if (temp_near_point.index != -1)
            {
                GetPoint(temp_near_point);
            }//temp_near_point

        }//Count
    }//FindNearPoint

    public void NextPoint()
    {
        GetPoint(next_point);
    }//NextPoint


    public void GetPoint(ClassPointCar _point)
    {
        if (go_to_target) return;
        have_point = true;
        point = _point;
        target_pos = point._position;
        if (global_target && point.near_point.Count > 1)
        {

            float temp_angle_big= 360;
            float temp_angle_point;
            ClassPointCar temp_point = new ClassPointCar();
            float temp_diff_angle;
            float temp_angle = Quaternion.LookRotation(global_target_pos - transform.position).eulerAngles.y;

            for (var i = 0; i < point.near_point.Count; i++)
            {
                temp_angle_point = Quaternion.LookRotation(patch_script.point_car[point.near_point[i]]._position - transform.position).eulerAngles.y;
                temp_diff_angle = Functions.AngleSingle180Abs(temp_angle - temp_angle_point);
                if (temp_diff_angle < temp_angle_big) { temp_angle_big = temp_diff_angle; temp_point = patch_script.point_car[point.near_point[i]]; }
            }//for
            next_point = temp_point;
        }//global_target
        else { next_point = patch_script.point_car[point.near_point[Random.Range(0, point.near_point.Count)]]; }



    }//GetPosition

    public void GetPointPolice(ClassPointCar _point)
    {
        point = _point;
        target_pos = point._position;
        if (point.near_point.Count > 1)
        {

            float temp_angle_big= 360;
            float temp_angle_point;
            ClassPointCar temp_point = new ClassPointCar();
            float temp_diff_angle;
            float temp_angle= Quaternion.LookRotation(global_target_pos - transform.position).eulerAngles.y;

            for (var i = 0; i < point.near_point.Count; i++)
            {
                temp_angle_point = Quaternion.LookRotation(patch_script.point_police[point.near_point[i]]._position - transform.position).eulerAngles.y;
                temp_diff_angle = Functions.AngleSingle180Abs(temp_angle - temp_angle_point);
                if (temp_diff_angle < temp_angle_big) { temp_angle_big = temp_diff_angle; temp_point = patch_script.point_police[point.near_point[i]]; }
            }//for
            next_point = temp_point;
        }//global_target
        else { next_point = patch_script.point_police[point.near_point[Random.Range(0, point.near_point.Count)]]; }



    }//GetPosition


    public void GetPointStart(ClassPointCar _point)
    {
        Patches temp_patch_sc = GameObject.Find("Game").GetComponent<Patches>();
        point = _point;
        target_pos = point._position;
        next_point = temp_patch_sc.point_car[point.near_point[Random.Range(0, point.near_point.Count)]];

    }//GetPosition

    public void FindCentrPoint()
    {
        Vector3 temp_pos = transform.position;
        float temp_angle= Quaternion.LookRotation(global_target_pos - transform.position).eulerAngles.y;
        float temp_distance = Vector3.Distance(global_target_pos, transform.position);
        temp_pos.z += temp_distance * 0.6f * Mathf.Sin(-(temp_angle - 90) * (Mathf.PI / 180));
        temp_pos.x += temp_distance * 0.6f * Mathf.Cos(-(temp_angle - 90) * (Mathf.PI / 180));
        FindTargetNearPoint(FindTargetPoint(temp_pos)._position);
        //Instantiate(target,temp_pos,transform.rotation);
    }//FindCentrPoint


    public ClassPointCar FindTargetPoint(Vector3 _pos)
    {
        if (patch_script.point_car.Count > 0)
        {
            ClassPointCar temp_point;
            ClassPointCar temp_near_point = new ClassPointCar();
            float temp_distance_big = 1000;
            float temp_distance;
            float temp_diff_angle;

            for (var i = 0; i < patch_script.point_car.Count; i++)
            {
                temp_point = patch_script.point_car[i];
                temp_distance = Vector3.Distance(temp_point._position, _pos);
                if (temp_distance < temp_distance_big) { temp_distance_big = temp_distance; temp_near_point = temp_point; }
            }//for
            if (temp_near_point.index != -1)
            {
                return temp_near_point;
            }//temp_near_point
            else return null;

        }//Count
        else
            return null;
    }//FindTargetPoint

    public void FindTargetNearPoint(Vector3 _pos)
    {
        if (patch_script.point_car.Count > 0)
        {
            ClassPointCar temp_point;
            ClassPointCar temp_near_point = new ClassPointCar();
            float temp_distance;
            float temp_angle_big = 360;
            float temp_diff_angle;
            float temp_angle_point;
            float temp_angle;

            for (var i = 0; i < patch_script.point_car.Count; i++)
            {
                temp_point = patch_script.point_car[i];
                temp_distance = Vector3.Distance(temp_point._position, _pos);
                if (temp_distance < 20)
                {
                    temp_angle = Quaternion.LookRotation(global_target_pos - temp_point._position).eulerAngles.y;
                    temp_angle_point = Quaternion.LookRotation(patch_script.point_car[temp_point.near_point[0]]._position - temp_point._position).eulerAngles.y;
                    temp_diff_angle = Functions.AngleSingle180Abs(temp_angle - temp_angle_point);
                    if (temp_diff_angle < temp_angle_big) { temp_angle_big = temp_diff_angle; temp_near_point = patch_script.point_car[i]; }
                }//temp_distance
            }//for
            if (temp_near_point.index != -1)
            {
                GetPoint(temp_near_point);
                //Instantiate(target,temp_near_point._position,transform.rotation);
            }//temp_near_point

        }//Count
    }//FindTargetNearPoint

    public void FindPolicePoint(Vector3 _pos)
    {
        if (patch_script.point_police.Count > 0)
        {
            ClassPointCar temp_point;
            ClassPointCar temp_near_point = new ClassPointCar();
            float temp_distance_big = 1000;
            float temp_distance;

            for (var i = 0; i < patch_script.point_police.Count; i++)
            {
                temp_point = patch_script.point_police[i];
                temp_distance = Vector3.Distance(temp_point._position, _pos);
                if (temp_distance < temp_distance_big) { temp_distance_big = temp_distance; temp_near_point = temp_point; }
            }//for
            if (temp_near_point.index != -1)
            {
                GetPoint(temp_near_point);
            }//temp_near_point

        }//Count
    }//FindTargetPoint

    public void SimpleRacer()
    {
        if (!vehicle_sc) vehicle_sc = GetComponent<Vehicle>();
        racer = true;
        if (vehicle_sc.place[0].man) vehicle_sc.place[0].man.GetComponent<Man>().Danger();
        vehicle_sc.limit_speed = (int)(vehicle_sc.max_speed * 0.8f);
    }//SimpleRacer

    public void Racer(bool _activate, float _speed)
    {
        //collider_stop.gameObject.SetActive(!_activate);
        //collider_racer.gameObject.SetActive(_activate);
        racer = _activate;

        if (_activate)
        {
            if (vehicle_sc.place[0].man) { vehicle_sc.place[0].man.GetComponent<Man>().Danger(); }
            vehicle_sc.limit_speed = (int)_speed;
        }
        else { vehicle_sc.limit_speed = 70; }
    }//racer
}
