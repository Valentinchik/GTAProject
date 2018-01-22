using UnityEngine;
using System.Collections;

public class MinimapObject : MonoBehaviour
{
    public Transform target;
    public Texture2D tex_arrow;

    bool fixed_rotation;

    public Game game_sc;

    public Transform _camera;
    private Transform icon_0;
    private Transform icon_1;
    private Transform place;

    void Start()
    {
        if (!game_sc) game_sc = GameObject.Find("Game").GetComponent<Game>();
        if (!_camera) _camera = GameObject.Find("Camera").transform;
        if (transform.FindChild("icon_man")) icon_0 = transform.FindChild("icon_man").transform;
        if (transform.FindChild("icon_car")) icon_1 = transform.FindChild("icon_car").transform;
        if (transform.FindChild("mission_place")) place = transform.FindChild("mission_place").transform;
    }//Start

    void FixedUpdate()
    {
        if (fixed_rotation && _camera)
        {
            transform.eulerAngles = new Vector3(transform.eulerAngles.x, _camera.eulerAngles.y, transform.eulerAngles.z);
        }//_camera

        if (target)
        {
            transform.position = target.position;
            transform.eulerAngles = new Vector3(transform.eulerAngles.x, target.eulerAngles.y, transform.eulerAngles.z);


            if (target.GetComponent<Man>() && icon_0 && icon_1)
            {
                Man temp_man_sc = target.GetComponent<Man>();
                if (temp_man_sc.doing == "sit_vehicle")
                {
                    if (icon_0.gameObject.active) { icon_0.gameObject.SetActive(false); }
                    if (!icon_1.gameObject.active) { icon_1.gameObject.SetActive(true); }
                    transform.position = temp_man_sc.vehicle.position;
                    transform.eulerAngles = new Vector3(transform.eulerAngles.x, temp_man_sc.vehicle.eulerAngles.y, transform.eulerAngles.z);
                }//sit_car
                else if (temp_man_sc.doing != "sit_vehicle" && icon_1.gameObject.active)
                {
                    icon_0.gameObject.SetActive(true);
                    icon_1.gameObject.SetActive(false);
                }//go_out_vehicle


            }//sc_man
            if (place)
            {
                if (target.GetComponent<Vehicle>() && target.GetComponent<Vehicle>().place[0].man &&
                target.GetComponent<Vehicle>().place[0].man.GetComponent<Man>().player)
                {
                    if (place.gameObject.active) place.gameObject.SetActive(false);
                }
                else if (!place.gameObject.active) place.gameObject.SetActive(true);

                if (target.GetComponent<Man>())
                {
                    Man temp_man_sc1 = target.GetComponent<Man>();
                    if (temp_man_sc1.doing == "sit_vehicle" && temp_man_sc1.vehicle && temp_man_sc1.vehicle.GetComponent<Vehicle>().place[0].man &&
                    temp_man_sc1.vehicle.GetComponent<Vehicle>().place[0].man.GetComponent<Man>().player)
                    {
                        if (place.gameObject.active) place.gameObject.SetActive(false);
                    }//player
                    else if (!place.gameObject.active) place.gameObject.SetActive(true);
                }//sc_man
            }//place

            if (target.GetComponent<Man>() && target.GetComponent<Man>().death) game_sc.DeleteMinimapObject(null, transform);
        }//target
    }//Update
}
