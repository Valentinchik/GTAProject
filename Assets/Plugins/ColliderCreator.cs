using UnityEngine;
using System.Collections;

public class ColliderCreator : MonoBehaviour {

    public Transform vehicle;
    public Transform vehicle_old;
    public ClassPointCar point;
    public ClassVehicleArea area;
    public ClassMan man;
    public Info info_sc;
    public Game game_sc;
    public VehicleCreator creator_sc;

    void Start()
    {
        if (point.boat) transform.localScale *= 2;
        //transform.position.y+=5;
        //if (!point.stop)
        //{
        //    GetComponent<BoxCollider>().size = new Vector3(transform.position.x, transform.position.y, 12);
        //    GetComponent<BoxCollider>().center =  new Vector3(transform.position.x, transform.position.y, 3);
        //}
        Invoke("Delete", 1.0f);
        Invoke("CreateOldCar", Random.Range(0, 1.0f));
    }//Start

    void OnTriggerEnter(Collider _collision)
    {
        if (!_collision.isTrigger || _collision.transform.root.GetComponent<Vehicle>())
        {
            creator_sc.vehicle.Remove(transform);
            Destroy(gameObject);
        }
    }//OnTriggerEnter

    public void Create()
    {
        //if(game_sc.vehicle.Count>creator_sc.vehicle_max)return false;
        RaycastHit hit;
        Vector3 _position = transform.position;
        if (Physics.Raycast(transform.position, new Vector3(0, -1, 0), out hit, 100)) { _position.y = hit.point.y + 1; }
        if (point.boat) vehicle = info_sc.boat_ob[man.boat[Random.Range(0, man.boat.Count)]];
        else vehicle = info_sc.car_ob[man.car[Random.Range(0, man.car.Count)]];
        Transform temp_vehicle = Instantiate(vehicle, _position, transform.rotation)as Transform;
        Vehicle temp_vehicle_sc = temp_vehicle.GetComponent<Vehicle>();
        VehicleBot temp_bot_sc = temp_vehicle.GetComponent<VehicleBot>();
        if (!point.stop)
        {
            int random_racer = Random.Range(0, 20);
            if (random_racer == 0 && !temp_vehicle.GetComponent<CarCop>() || point.boat) { temp_bot_sc.racer = true; }
            temp_vehicle_sc.limit_speed = (int)Random.Range(area.limit_speed * 0.8f, (float)(area.limit_speed * 1.2f));
            temp_vehicle_sc.game_sc = game_sc;
            temp_vehicle_sc.boat = point.boat;
            temp_bot_sc.game_sc = game_sc;
            temp_bot_sc.enabled = true;
            temp_bot_sc.engine_work = true;
            temp_bot_sc.GetPointStart(point);



            Transform temp_man = Instantiate(info_sc.man_ob[man.man[Random.Range(0, man.man.Count)]]);
            temp_man.position = new Vector3(transform.position.x, -10000, transform.position.z);
            temp_man.GetComponent<Man>().SitVehicle(temp_vehicle, temp_vehicle_sc.place[0], false);
            temp_man.GetComponent<Man>().game_sc = game_sc;
            temp_man.GetComponent<Man>().game_sc = game_sc;

        }//stop
        creator_sc.vehicle.Remove(transform);
        Destroy(gameObject);

    }//Create

    public void OldCar(Transform _vehicle)
    {
        vehicle_old = _vehicle;
        Invoke("CreateOldCar", Random.Range(0, 0.5f));
    }//OldCar


    public void CreateOldCar()
    {
        if (creator_sc.vehicle_delete.Count <= 0) return;
        if (creator_sc.vehicle_delete[0].GetComponent<Vehicle>().death)
        {
            creator_sc.vehicle_delete[0].GetComponent<Vehicle>().destroy = false;
            creator_sc.vehicle_delete.RemoveAt(0);
            return;
        }//death

        RaycastHit hit;
        Transform _vehicle = creator_sc.vehicle_delete[0];
        Vector3 _position = transform.position;
        VehicleBot temp_script = _vehicle.GetComponent<VehicleBot>();
        Vehicle temp_script_vehicle = _vehicle.GetComponent<Vehicle>();
        Transform temp_old_man = temp_script_vehicle.place[0].man;
        if (temp_script_vehicle.boat != point.boat) return ;

        if (Physics.Raycast(transform.position, new Vector3(0, -1, 0), out hit, 100)) _position.y = hit.point.y + 1;
        _vehicle.position = _position;
        _vehicle.eulerAngles = transform.eulerAngles;
        _vehicle.GetComponent<Rigidbody>().velocity = Vector3.zero;
        //if (_vehicle.GetComponent<MotobikeJs>()) _vehicle.GetComponent<MotobikeJs>().crash = false;//temp
        if (!point.stop)
        {
            int random_racer = Random.Range(0, 30);

            if (random_racer == 0 && !temp_script_vehicle.police)
            {
                temp_script.racer = true;
            }
            else { temp_script.racer = false; }

            if (!temp_script_vehicle.police) temp_script_vehicle.limit_speed = (int)Random.Range(area.limit_speed * 0.8f, (float)(area.limit_speed * 1.2f));
            if (!temp_script.enabled) temp_script.enabled = true;
            if (!temp_script_vehicle.engine_work) temp_script_vehicle.EngineWork();
            temp_script.GetPointStart(point);
            if (temp_old_man && temp_old_man.GetComponent<Man>().death)
            {
                temp_script_vehicle.place[0].use = false;
                game_sc.man.Remove(temp_old_man);
                Destroy(temp_old_man.gameObject);
            }//temp_old_man
            if (!temp_old_man)
            {
                if (temp_script_vehicle.police)
                {
                    _vehicle.GetComponent<CarCop>().SeeEnemyFalse();
                    man = info_sc.man[4];
                }
                else man = info_sc.man[0];
                Transform temp_man = Instantiate(info_sc.man_ob[man.man[Random.Range(0, man.man.Count)]]);
                temp_man.position = new Vector3(transform.position.x, -10000, transform.position.z);
                temp_man.GetComponent<Man>().SitVehicle(_vehicle, temp_script_vehicle.place[0], false);
            }//man
        }//stop
        else
        {
            if (temp_script_vehicle.sirena) { temp_script_vehicle.sirena.gameObject.SetActive(false); }
            temp_script_vehicle.EngineStop();
            if (_vehicle.GetComponent<CarCop>()) _vehicle.GetComponent<CarCop>().enabled = false;
            if (temp_script.enabled) temp_script.enabled = false;
            if (temp_old_man)
            {
                temp_script_vehicle.place[0].use = false;
                game_sc.man.Remove(temp_old_man);
                Destroy(temp_old_man.gameObject);
            }//man
        }//else
        temp_script_vehicle.destroy = false;
        creator_sc.vehicle_delete.RemoveAt(0);
        creator_sc.vehicle.Remove(transform);
        Destroy(gameObject);

    }//Create

    public void Delete()
    {
        creator_sc.vehicle.Remove(transform);
        Destroy(gameObject);
    }//Delete
}
