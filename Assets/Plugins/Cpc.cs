using UnityEngine;
using System.Collections;

public class Cpc : MonoBehaviour
{
    public Game script_game;
public Info info_sc;

void Start()
    {
        Invoke("CreateCar", Random.Range(0, 1.0f));
    }//Start

    public void CreateCar()
    {
        Transform vehicle_ob = info_sc.car_ob[info_sc.man[4].car[Random.Range(0, info_sc.man[4].car.Count - 1)]];
        Transform temp_vehicle = Instantiate(vehicle_ob, transform.position, transform.rotation) as Transform;
        temp_vehicle.GetComponent<Vehicle>().game_sc = script_game;
        temp_vehicle.GetComponent<VehicleBot>().game_sc = script_game;
        Destroy(gameObject);
    }//CreateCar
}
