using UnityEngine;
using System.Collections;
using System;

[Serializable]
public class ClassCameraType
{
    public float zoom;
    public float height =1;
    public float flang =1;
    public int look;
    public Vector3 look_angle;
    public float rotate_speed =10;
    public float fieldOf_view =60;
    public bool raycast;
}

public class CameraScript : MonoBehaviour
{
    private Transform game_ob;
    private Game game_sc;
    private Player player_sc;
    private InputManager input_man_sc;

    public bool mobile;
    public Transform target;
    public Transform fog;
    public bool look_target;
    public bool raycast;
    public ClassCameraType[] camera_type_man;
    public ClassCameraType[] camera_type_vehicle;
    public ClassCameraType camera_type;
    public Transform camera_children;
    private Transform camera_transform;
    private Transform mini_map;
    private float mmap_height = 30;
    private int mmap_distance = 10;
    public int rotation_speed = 50;
    public float rotate_y = 0;
    public int index = 0;

    void Start()
    {
        game_ob = GameObject.Find("Game").transform;
        input_man_sc = GameObject.Find("MobileInput").GetComponent<InputManager>();
        game_sc = game_ob.GetComponent<Game>();
        player_sc = game_ob.GetComponent<Player>();

        camera_children = transform.FindChild("camera_child");
        camera_transform = camera_children.GetChild(0);
        if (PlayerPrefs.HasKey("camera_distance"))
        {
            int temp_distance = PlayerPrefs.GetInt("camera_distance");
            camera_transform.GetComponent<Camera>().farClipPlane = temp_distance;
            if (fog) fog.localScale = new Vector3(temp_distance, temp_distance, temp_distance);
        }//camera_distance
        if (PlayerPrefs.HasKey("touch_speed")) rotation_speed = PlayerPrefs.GetInt("touch_speed");
        camera_children.localPosition = game_sc.Vector(camera_type.flang, camera_type.height, camera_children.localPosition.z);
        camera_transform.localPosition = game_sc.Vector(camera_transform.localPosition.x, camera_transform.localPosition.y, camera_type.zoom);
        mini_map = transform.FindChild("MiniMap");
        if (mini_map) { mini_map.parent = null; }

        NextCamera(true, 0);
    }//Start

    void Update()
    {

        if (Input.GetKey(KeyCode.C))
        {
            if (Input.GetAxis("Mouse ScrollWheel") > 0) { camera_type.zoom += 0.5f; }
            if (Input.GetAxis("Mouse ScrollWheel") < 0) { camera_type.zoom -= 0.5f; }
        }
        if (Input.GetKeyDown(KeyCode.M)) { mmap_distance += 30; if (mmap_distance > 150) { mmap_distance = 10; } }


    }//Update

    void LateUpdate()
    {
        float temp_rotation_speed = rotation_speed * 0.03f;

        camera_children.localPosition = game_sc.Vector(Mathf.Lerp(camera_children.localPosition.x, camera_type.flang, 10 * Time.deltaTime),
            Mathf.Lerp(camera_children.localPosition.y, camera_type.height, 10 * Time.deltaTime), camera_children.localPosition.z);

        if (mini_map)
        {
            if (target)
            {
                mini_map.position = game_sc.Vector(target.position.x, mini_map.position.y, target.position.z);
                mini_map.eulerAngles = game_sc.Vector(mini_map.eulerAngles.x, target.eulerAngles.y, mini_map.eulerAngles.z);
                float temp_mmap_y = mini_map.position.y - target.position.y;
                if (target.root.GetComponent<Rigidbody>()) { mmap_height = mmap_distance + target.root.GetComponent<Rigidbody>().velocity.magnitude / 2; }
                else { mmap_height = mmap_distance + 20; }
                if (temp_mmap_y > mmap_height + 2)
                {
                    mini_map.position -= game_sc.Vector(mini_map.position.x, 0.1f + Mathf.Abs(temp_mmap_y / 30), mini_map.position.z);
                }
                else if (temp_mmap_y < mmap_height - 2)
                {
                    mini_map.position += game_sc.Vector(mini_map.position.x, 0.1f + Mathf.Abs(temp_mmap_y / 30), mini_map.position.z);
                }

            }//target
        }//mini_map

        RaycastHit hit;

        if (raycast && Physics.Raycast(camera_children.position, camera_children.TransformDirection(Vector3.back), out hit, Mathf.Abs(camera_type.zoom)))
        {
            camera_transform.localPosition = game_sc.Vector(camera_transform.localPosition.x, camera_transform.localPosition.y, -hit.distance + 0.3f);
        }
        else
        {
            camera_transform.localPosition = game_sc.Vector(camera_transform.localPosition.x, camera_transform.localPosition.y,
                Mathf.Lerp(camera_transform.localPosition.z, camera_type.zoom, 10 * Time.deltaTime));
        }

        if (target)
        {
            transform.position = Vector3.Lerp(transform.position, target.position, 100 * Time.deltaTime);
            if ((transform.position - target.position).magnitude < 1) transform.position = target.position;

            if (camera_type.look == 0)
            {
                transform.eulerAngles = game_sc.Vector(0, transform.eulerAngles.y, 0);
                if (!mobile)
                {
                    transform.Rotate(0, Input.GetAxis("Mouse X") * camera_type.rotate_speed * temp_rotation_speed, 0);
                    rotate_y += -Input.GetAxis("Mouse Y") * camera_type.rotate_speed * temp_rotation_speed;
                }
                else
                {
                    transform.Rotate(0, input_man_sc.view.x * camera_type.rotate_speed * temp_rotation_speed, 0);
                    rotate_y -= input_man_sc.view.y * camera_type.rotate_speed * temp_rotation_speed;
                }//else

                rotate_y = Functions.AngleSingle180(rotate_y);
                rotate_y = Mathf.Clamp(rotate_y, -90, 90);

                camera_children.eulerAngles = game_sc.Vector(rotate_y, camera_children.eulerAngles.y, camera_children.eulerAngles.z);
                camera_children.localEulerAngles = game_sc.Vector(camera_children.localEulerAngles.x, 0, camera_children.localEulerAngles.z);
            }//look

            else if (camera_type.look == 1)
            {
                transform.eulerAngles = target.eulerAngles;
                camera_children.localEulerAngles = game_sc.Vector(target.eulerAngles.x + camera_type.look_angle.x,
                    camera_children.localEulerAngles.y, camera_children.localEulerAngles.z);

                float temp_rotation1 = 0;
                if (target.root.GetComponent<Vehicle>() && target.root.GetComponent<Vehicle>().back_speed)
                {
                    temp_rotation1 = temp_rotation1 + 180;
                }
                camera_children.localEulerAngles = game_sc.Vector(camera_children.localEulerAngles.x, Quaternion.Slerp(camera_children.localRotation,
                    Quaternion.Euler(0, temp_rotation1, 0), camera_type.rotate_speed * Time.deltaTime).eulerAngles.y, camera_children.localEulerAngles.z);
                //camera_children.localEulerAngles.y=0;
            }//look

            else if (camera_type.look == 2)
            {
                if (!mobile) { transform.Rotate(0, Input.GetAxis("Mouse X") * camera_type.rotate_speed, 0); }
                else { transform.Rotate(0, input_man_sc.view.x * camera_type.rotate_speed, 0); }
                camera_children.eulerAngles = game_sc.Vector(camera_type.look_angle.x, camera_children.eulerAngles.y, camera_children.eulerAngles.z);
                camera_children.localEulerAngles = game_sc.Vector(camera_children.localEulerAngles.x, 0, camera_children.localEulerAngles.z);
            }//look

            else if (camera_type.look == 3)
            {
                //transform.RotateAround(Vector3(0,1,0), Input.GetAxis("Mouse X") * rotation_speed);
                //transform.localEulerAngles.y=transform.localEulerAngles.y+Input.GetAxis("Mouse X") * rotation_speed;
                transform.eulerAngles = target.eulerAngles;
                camera_children.localEulerAngles = game_sc.Vector(camera_type.look_angle.x, camera_children.localEulerAngles.y, camera_children.localEulerAngles.z);
                if (!mobile)
                {
                    camera_children.localEulerAngles = game_sc.Vector(camera_children.localEulerAngles.x, camera_children.localEulerAngles.y +
                        Input.GetAxis("Mouse X") * camera_type.rotate_speed, camera_children.localEulerAngles.z);
                }
                else
                {
                    camera_children.localEulerAngles = game_sc.Vector(camera_children.localEulerAngles.x, camera_children.localEulerAngles.y +
                 input_man_sc.view.x * camera_type.rotate_speed, camera_children.localEulerAngles.z);
                }
            }//look

            else if (camera_type.look == 4)
            {
                float temp_rotation = target.eulerAngles.y;
                if (target.root.GetComponent<Vehicle>() && target.root.GetComponent<Vehicle>().back_speed) { temp_rotation = temp_rotation + 180; }
                transform.eulerAngles = game_sc.Vector(transform.eulerAngles.x, Quaternion.Slerp(transform.rotation,
                    Quaternion.Euler(0, temp_rotation, 0), camera_type.rotate_speed * Time.deltaTime).eulerAngles.y, transform.eulerAngles.z);
                camera_children.eulerAngles = game_sc.Vector(target.eulerAngles.x + camera_type.look_angle.x, camera_children.eulerAngles.y, camera_children.eulerAngles.z);
                transform.eulerAngles = game_sc.Vector(0, transform.eulerAngles.y, 0);
            }//look

        }//target
    }//LateUpdate



    public void NextCamera(bool _get, int _get_num)
    {
        if (_get) { index = _get_num; }//get
        else { index += 1; }

        if (index > camera_type_man.Length - 1) { index = 0; }
        camera_type = camera_type_man[index];
        Camera.main.fieldOfView = camera_type.fieldOf_view;
        raycast = camera_type.raycast;
    }//NextCamera

    public void NextCameraVehicle(bool _get, int _get_num)
    {
        if (_get) { index = _get_num; }//get
        else { index += 1; }

        if (index > camera_type_vehicle.Length - 1) { index = 0; }
        camera_type = camera_type_vehicle[index];
        Camera.main.fieldOfView = camera_type.fieldOf_view;
        raycast = camera_type.raycast;
    }//NextCamera
}
