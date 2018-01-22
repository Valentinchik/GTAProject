using UnityEngine;
using System.Collections.Generic;

public class VehicleCreator : MonoBehaviour
{
    public List<ClassVehicleArea> vehicle_area = new List<ClassVehicleArea>();
    public List<Transform> vehicle = new List<Transform>();
    public List<Transform> vehicle_delete = new List<Transform>();
    public List<Transform> man = new List<Transform>();
    public List<Transform> man_delete = new List<Transform>();
    public List<PoliceCars> police_cars = new List<PoliceCars>();
    public float distance = 50;
    public float distance_min = 30;
    public float distance_max = 30;
    public int vehicle_max = 30;
    public int man_max = 40;
    public int man_count;
    public float cteate_timer = 5;
    public bool create_man;
    public bool create_car;
    public Transform _collider;
    public Transform create_man_ob;
    private Game game_sc;
    private Info info_sc;
    private Man script_player;
    private float distance_min_temp = 10;
    private float timer_create;
    private float timer_create_man;
    private float timer_cpc;

    private Transform camera_main;
    public Transform sphere;

    public int LimitDeathMans = 2;
    public int LimitDeathCars = 2;
    public List<Transform> MansDeath = new List<Transform>();
    public List<Transform> CarsDeath = new List<Transform>();

    void Start()
    {
        game_sc = GetComponent<Game>();
        info_sc = GetComponent<Info>();
        script_player = GetComponent<Player>().player.GetComponent<Man>();
        distance_min_temp = distance_min;
        camera_main = Camera.main.transform;
        vehicle_max = PlayerPrefs.GetInt("car_count");
        man_max = PlayerPrefs.GetInt("man_count");
        //cteate_timer=PlayerPrefs.GetInt("traffic_timer");
        //if(PlayerPrefs.GetInt("create_man")==1)create_man=true;
        //else create_man=false;
        Invoke("CreateVehicle", 2);
        Invoke("DelleteVehicle", cteate_timer - 1);
    }//Start

    void Update()
    {
        if (vehicle.Count > 0)
        {
            timer_create += Time.deltaTime;
            if (timer_create > 1f && game_sc.vehicle.Count < vehicle_max)
            {
                vehicle[0].GetComponent<ColliderCreator>().Create();
                timer_create = 0;
            }//timer_create
        }//Count

        if (man.Count > 0)
        {
            timer_create_man += Time.deltaTime;
            if (timer_create_man > 0.5f && man_count < man_max)
            {
                man[0].GetComponent<ManCreator>().Create();
                timer_create_man = 0;
            }//timer_create
        }//Count

        if (script_player.wanted_score >= 300 && script_player.danger)
        {
            timer_cpc += Time.deltaTime;
            if (timer_cpc > 5)
            {
                CreatePoliceCar();
                timer_cpc = 0;
            }//timer_cpc
        }//wanted_score

        if(CarsDeath.Count > LimitDeathCars)
        {
            game_sc.vehicle.Remove(CarsDeath[0]);
            Transform temp = CarsDeath[0];
            CarsDeath.Remove(CarsDeath[0]);
            Vehicle tempVehSc = temp.GetComponent<Vehicle>();
            if(tempVehSc)
            {
                if(tempVehSc.place[0].man)
                {
                    Debug.Log("1234");
                    game_sc.man.Remove(tempVehSc.place[0].man);
                    MansDeath.Remove(tempVehSc.place[0].man);
                    Destroy(tempVehSc.place[0].man.gameObject);
                }
                if(tempVehSc.place[1].man)
                {
                    game_sc.man.Remove(tempVehSc.place[1].man);
                    MansDeath.Remove(tempVehSc.place[1].man);
                    Destroy(tempVehSc.place[1].man.gameObject);
                }
            }
            Destroy(temp.gameObject);
        }
        if (MansDeath.Count > LimitDeathMans)
        {
            game_sc.man.Remove(MansDeath[0]);
            Transform tempM = MansDeath[0];
            MansDeath.Remove(MansDeath[0]);
            Destroy(tempM.gameObject);
        }
        }//Update


    public void CreateVehicle()
    {
        Vector3 temp_camera_pos = Camera.main.transform.position;
        Vector3 temp_point_pos;
        float temp_distance;

        for (var i = 0; i < vehicle_area.Count; i++)
        {
            if (Functions.HitArea(temp_camera_pos, vehicle_area[i]._position, vehicle_area[i].width + distance, vehicle_area[i].height + distance))
            {
                int temp_procent = 1;
                if (create_car)
                {//game_sc.vehicle.Count<vehicle_max&&
                    for (int j = 0; j < vehicle_area[i].point.Count; j++)
                    {

                        if (Random.Range(0, 100) < vehicle_area[i].procent / temp_procent)
                        {
                            temp_point_pos = vehicle_area[i].point[j]._position;
                            temp_distance = Vector3.Distance(temp_point_pos, temp_camera_pos);
                            if (temp_distance > distance_min_temp && temp_distance < distance)
                            {
                                ClassPointCar temp_near_point = new ClassPointCar();
                                Quaternion temp_rotation;

                                if (!vehicle_area[i].point[j].stop)
                                {
                                    temp_near_point = GetComponent<Patches>().point_car[vehicle_area[i].point[j].near_point[0]];
                                    temp_rotation = Quaternion.LookRotation(temp_near_point._position - temp_point_pos);
                                }
                                else { temp_rotation = Quaternion.Euler(vehicle_area[i].point[j]._rotation); temp_near_point = vehicle_area[i].point[j]; }

                                Transform temp_collider = Instantiate(_collider, temp_point_pos + new Vector3(0, 2, 0), temp_rotation) as Transform;
                                int random_man = vehicle_area[i].man_procent[Random.Range(0, vehicle_area[i].man_procent.Count)];
                                ClassMan temp_man_type = info_sc.man[vehicle_area[i].man[random_man]];
                                ColliderCreator temp_script = temp_collider.GetComponent<ColliderCreator>();
                                temp_script.point = temp_near_point;
                                temp_script.area = vehicle_area[i];
                                temp_script.man = temp_man_type;
                                temp_script.info_sc = info_sc;
                                temp_script.game_sc = game_sc;
                                temp_script.creator_sc = this;
                                vehicle.Add(temp_collider);
                            }//HitAreaOut
                        }//procent
                    }//for
                }//vehicle_max
                 //MAN

                if (create_man)
                {//man_count<man_max&&
                    for (var j1 = 0; j1 < vehicle_area[i].point_man.Count; j1++)
                    {
                        ClassPointMan temp_point = vehicle_area[i].point_man[j1];
                        temp_procent = 1;
                        if (Random.Range(0, 100) < vehicle_area[i].procent / temp_procent)
                        {
                            int random_man1 = vehicle_area[i].man_procent[Random.Range(0, vehicle_area[i].man_procent.Count)];
                            ClassMan temp_man_type1 = info_sc.man[vehicle_area[i].man[random_man1]];
                            temp_point_pos = temp_point._position;
                            temp_distance = Vector3.Distance(temp_point_pos, temp_camera_pos);
                            if (temp_distance > distance_min_temp && temp_distance < distance)
                            {
                                /*
                                var temp_man : Transform=Instantiate(info_sc.man_ob[temp_man_type1.man[Random.Range(0,temp_man_type1.man.Count)]]);
                                temp_man.position=temp_point_pos+Vector3(Random.Range(-temp_point.distance,temp_point.distance),0,Random.Range(-temp_point.distance,temp_point.distance));
                                temp_man.GetComponent(sc_bot).GetThisPoint(temp_point,false);*/
                                Transform temp_create_man = Instantiate(create_man_ob);
                                ManCreator temp_script1 = temp_create_man.GetComponent<ManCreator>();
                                temp_create_man.position = temp_point_pos + game_sc.Vector(Random.Range(-temp_point.distance, temp_point.distance), 0, Random.Range(-temp_point.distance, temp_point.distance));
                                //temp_script1.man=info_sc.man_ob[temp_man_type1.man[Random.Range(0,temp_man_type1.man.Count)]];
                                temp_script1.man = temp_man_type1;
                                temp_script1.point = temp_point;
                                temp_script1.info_sc = info_sc;
                                temp_script1.game_sc = game_sc;
                                temp_script1.game_ob = transform;
                                temp_script1.creator_sc = this;
                                man.Add(temp_create_man);
                            }//distance
                        }//procent
                    }//for
                }//man_max
            }//HitArea
        }//for

        //Functions.HitAreaOut(temp_point_pos,temp_camera_pos,distance_min,distance_min)&&Functions.HitArea(temp_point_pos,temp_camera_pos,distance,distance)
        //if(distance_min_temp!=distance_min){distance_min_temp=distance_min;}
        Invoke("CreateVehicle", cteate_timer);
    }//CreateVehicle

    public void DelleteVehicle()
    {
        Vector3 temp_camera_pos = camera_main.position;
        float temp_distance;
        Transform temp_vehicle;
        Vehicle temp_script_vehicle;
        Man temp_script_man;
        for (var i = 0; i < game_sc.vehicle.Count; i++)
        {
            temp_vehicle = game_sc.vehicle[i];
            temp_script_vehicle = temp_vehicle.GetComponent<Vehicle>();
            if (temp_vehicle && temp_script_vehicle.dellete)
            {
                temp_distance = Vector3.Distance(temp_vehicle.position, temp_camera_pos);
                if (temp_distance > distance_max + 100)
                {
                    DeleteManInCar(temp_vehicle);
                    game_sc.vehicle.Remove(temp_vehicle);
                    vehicle_delete.Remove(temp_vehicle);
                    Destroy(temp_vehicle.gameObject);
                }//distance_max
                else if (temp_distance > distance_max && !temp_script_vehicle.destroy && !temp_script_vehicle.death)
                {
                    vehicle_delete.Add(temp_vehicle);
                    temp_script_vehicle.destroy = true;

                }//distance_max
                else if (temp_distance <= distance_max && temp_script_vehicle.destroy)
                {
                    vehicle_delete.Remove(temp_vehicle);
                    temp_script_vehicle.destroy = false;
                }//distance_max
            }//temp_vehicle
        }//for

        if (create_man)
        {
            Transform temp_man;
            for (var j = 0; j < game_sc.man.Count; j++)
            {
                temp_man = game_sc.man[j];
                temp_script_man = temp_man.GetComponent<Man>();
                if (temp_man && temp_script_man.doing != "sit_vehicle" && temp_script_man.dellete)
                {
                    temp_distance = Vector3.Distance(temp_man.position, temp_camera_pos);
                    if (temp_distance > distance_max + 100)
                    {
                        man_count--;
                        game_sc.man.Remove(temp_man);
                        man_delete.Remove(temp_man);
                        Destroy(temp_man.gameObject);
                    }//distance_max
                    else if (temp_distance > distance_max && !temp_script_man.destroy && !temp_script_man.death)
                    {
                        man_delete.Add(temp_man);
                        temp_script_man.destroy = true;
                        //var temp_sphere : Transform=Instantiate(sphere);

                    }//temp_distance
                    else if (temp_distance <= distance_max && temp_script_man.destroy)
                    {
                        man_delete.Remove(temp_man);
                        temp_script_man.destroy = false;
                    }//temp_distance
                }//temp_man
            }//for
        }//create_man
        Invoke("DelleteVehicle", 1.5f);
    }//DelleteVehicle

    public void DeleteManInCar(Transform _vehicle)
    {
        Vehicle temp_vs = _vehicle.GetComponent<Vehicle>();
        for (var i = 0; i < temp_vs.place.Length; i++)
        {
            if (temp_vs.place[i].man) { game_sc.man.Remove(temp_vs.place[i].man); Destroy(temp_vs.place[i].man.gameObject); }
        }//for
    }//DeleteManInCar

    public void CreatePoliceCar()
    {
        //Invoke("CreatePoliceCar",1);

        float temp_distance;
        Vector3 temp_camera_pos = camera_main.position;
        for (var i = 0; i < police_cars.Count; i++)
        {
            temp_distance = Vector3.Distance(police_cars[i].transform.position, temp_camera_pos);
            if (temp_distance > distance_min_temp && temp_distance < distance)
            {
                police_cars[i].CanCreate();
                //CPC(police_cars[i]);
                break;
            }//temp_distance
        }//for
    }//CreatePoliceCar
}
