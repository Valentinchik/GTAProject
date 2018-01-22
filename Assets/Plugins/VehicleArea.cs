using UnityEngine;
using System.Collections.Generic;

public class VehicleArea : MonoBehaviour
{
    private Patches patch_sc;
    private VehicleCreator vehicle_creator_sc;
    private Transform car_stay_ob;
    public int procent = 50;
    public int width = 100;
    public int height = 100;
    public int limit_speed = 90;
    public int important;
    public List<int> man = new List<int>();
    public List<int> man_procent = new List<int>();

    void Start()
    {
        if (GameObject.Find("CarStays")) car_stay_ob = GameObject.Find("CarStays").transform;
        patch_sc = GameObject.Find("Game").GetComponent<Patches>();
        vehicle_creator_sc = GameObject.Find("Game").GetComponent<VehicleCreator>();
        Invoke("FindPoint", important * 0.01f);
    }//Start

    public void FindPoint()
    {
        ClassVehicleArea new_vehicle_area = new ClassVehicleArea();
        new_vehicle_area._position = transform.position;
        new_vehicle_area.width = width;
        new_vehicle_area.height = height;
        new_vehicle_area.procent = procent;
        new_vehicle_area.limit_speed = limit_speed;
        new_vehicle_area.man = man;
        AddManProcent(new_vehicle_area.man_procent);

        for (var i = 0; i < patch_sc.point_car.Count; i++)
        {
            if (!patch_sc.point_car[i].use && Functions.HitArea(patch_sc.point_car[i]._position, transform.position, width, height))
            {
                patch_sc.point_car[i].use = true;
                new_vehicle_area.point.Add(patch_sc.point_car[i]);
            }
        }//for

        //ManPoint
        for (var j = 0; j < patch_sc.point_man.Count; j++)
        {
            if (!patch_sc.point_man[j].use && Functions.HitArea(patch_sc.point_man[j]._position, transform.position, width, height) && patch_sc.point_man[j].create)
            {
                patch_sc.point_man[j].use = true;
                new_vehicle_area.point_man.Add(patch_sc.point_man[j]);
            }
        }//for

        if (car_stay_ob && car_stay_ob.childCount > 0)
        {
            for (var i1 = 0; i1 < car_stay_ob.childCount; i1++)
            {
                if (car_stay_ob.GetChild(i1).gameObject.active && Functions.HitArea(car_stay_ob.GetChild(i1).position, transform.position, width, height))
                {
                    ClassPointCar temp_point = new ClassPointCar();
                    temp_point.index = -99999;
                    temp_point._position = car_stay_ob.GetChild(i1).position;
                    temp_point._rotation = car_stay_ob.GetChild(i1).eulerAngles;
                    temp_point.stop = true;
                    car_stay_ob.GetChild(i1).gameObject.SetActive(false);
                    new_vehicle_area.point.Add(temp_point);
                }//car_stay_ob
            }//for
        }//childCount

        if (new_vehicle_area.point.Count > 0 || new_vehicle_area.point_man.Count > 0) { vehicle_creator_sc.vehicle_area.Add(new_vehicle_area); }

    }//FindPoint

    public void AddManProcent(List<int> _procent)
    {
        for (var i = 0; i < man_procent.Count; i++)
        {
            for (var j = 0; j < man_procent[i]; j++)
            {
                _procent.Add(i);
            }//for
        }//for
    }//AddManProcent

    void OnDrawGizmos()
    {
        Gizmos.color = Color.green;
        if (important == 0) { Gizmos.color = Color.red; }
        else if (important == 1) { Gizmos.color = Color.yellow; }
        else if (important == 2) { Gizmos.color = Color.green; }

        Vector3 point_0 = transform.position + new Vector3(width, 0, height);
        Vector3 point_1 = transform.position + new Vector3(width, 0, -height);
        Vector3 point_2 = transform.position + new Vector3(-width, 0, -height);
        Vector3 point_3 = transform.position + new Vector3(-width, 0, height);
        Gizmos.DrawLine(point_0, point_1);
        Gizmos.DrawLine(point_2, point_3);
        Gizmos.DrawLine(point_0, point_3);
        Gizmos.DrawLine(point_1, point_2);
    }//OnDrawGizmos
}
