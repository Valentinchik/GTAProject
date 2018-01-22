using UnityEngine;
using System.Collections.Generic;

public class PoliceCars : MonoBehaviour
{
    public List<Transform> car = new List<Transform>();
    public List<Transform> man = new List<Transform>();
    public Transform cpc;

    public bool can_create;
    private Game script_game;
    private VehicleCreator script_creator;
    private Info info_sc;

    void Start()
    {
        script_game = GameObject.Find("Game").GetComponent<Game>();
        info_sc = script_game.transform.GetComponent<Info>();
        script_creator = script_game.transform.GetComponent<VehicleCreator>();

        Transform temp_cars = transform.FindChild("cars");
        for (var i = 0; i < temp_cars.childCount; i++)
        {
            car.Add(temp_cars.GetChild(i));
        }//for

        Transform temp_mans = transform.FindChild("mans");
        for (var j = 0; j < temp_mans.childCount; j++)
        {
            man.Add(temp_mans.GetChild(j));
        }//for

        transform.FindChild("cars").gameObject.SetActive(false);
        transform.FindChild("mans").gameObject.SetActive(false);
        GameObject.Find("Game").GetComponent<VehicleCreator>().police_cars.Add(this);
    }//Start

    void OnTriggerEnter(Collider _collision)
    {
        if (!_collision.isTrigger)
        {
            GetComponent<Collider>().enabled = false;
            can_create = false;
        }
    }//OnTriggerEnter

    public void CanCreate()
    {
        GetComponent<Collider>().enabled = true;
        can_create = true;
        Invoke("Create", 0.1f);
    }

    public void Create()
    {
        if (!can_create || script_game.vehicle.Count >= script_creator.vehicle_max || script_creator.man_count >= script_creator.man_max)
        {
            GetComponent<Collider>().enabled = false;
            return;
        }

        for (var i = 0; i < car.Count; i++)
        {
            CreateCar(car[i]);
        }//for
        for (var j = 0; j < man.Count; j++)
        {
            CreateMan(man[j]);
        }//for
        GetComponent<Collider>().enabled = false;
    }//Create


    public void CreateCar(Transform _point)
    {
        Transform temp_vehicle = Instantiate(cpc, _point.position, _point.rotation) as Transform;
        temp_vehicle.GetComponent<Cpc>().script_game = script_game;
        temp_vehicle.GetComponent<Cpc>().info_sc = info_sc;
    }//CreateCar

    public void CreateMan(Transform _point)
    {
        Transform man_ob = info_sc.man_ob[info_sc.man[4].man[Random.Range(0, info_sc.man[4].man.Count)]];
        Transform temp_man = Instantiate(man_ob, _point.position, _point.rotation) as Transform;
        temp_man.GetComponent<Man>().game_sc = script_game;
        temp_man.GetComponent<Bot>().game_sc = script_game;
        temp_man.GetComponent<Bot>().enabled = false;
        if (script_game.player.GetComponent<Man>().wanted_score >= 500)
            temp_man.GetComponent<Weapon>().WeaponGive(14, false, 0, 0);
    }//CreateCar
}
