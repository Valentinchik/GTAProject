using UnityEngine;
using System.Collections.Generic;
using System;

[Serializable]
class ClassWheel
{
    public Transform _transform;
    public Transform transform_child;
    public WheelCollider collider;
    public bool front;
    public bool motor;
    public Vector3 _rotation;
    public float wheel_pos_start;
}

[Serializable]
class ClassWheelFriction
{
    public float forward_friction_extrem = 10000;
    public float forward_friction_asymp = 5000;
    public float front_sideways_friction_extrem = 500;
    public float front_sideways_friction_asymp = 250;
    public float back_sideways_friction_extrem = 1000;
    public float back_sideways_friction_asymp = 150;
}//ClassWheel

[Serializable]
class ClassWheelInfo
{
    public bool front;
    public bool motor;
    public bool _static;
}// ClassWheelInfo

[Serializable]
class ClassVehicleWeapon
{
    public Transform turret;
    public Transform dulo;
    public Transform shoot_point;
    public Transform turret_point;
    public Transform muzzle_flash;
    public Transform _light;
    public Transform bullet;
    public AudioClip sound_shoot;
    public int fire_angle = 5;
    public float force;
    public float fire_rate;
    public float fire_wait;
    public float power;
    public float exp_radius;
    public float bullet_speed = 500;
    public Vector2 target_type = new Vector2(0, 2);
    public int _return;
    public Texture2D image;
    public ClassOtherWeapon other_weapon;
    public int bullets;
    public int bullet_count = 1;
    public Vector2 angle;
    public bool rocket;
    public bool auto_target;
}//ClassVehicleWeapon

[Serializable]
public class ClassWeapon
{
    public int index;
    public Transform prefab;
    public Transform _transform;
    public string _name;
    public Transform bullet;
    public int cross;
    public Texture2D image;
    public int _camera = 1;
    public float bullet_speed = 500;
    public int shoot_num;
    public AudioClip sound_shoot;
    public int type;
    public int bullet_count = 1;
    public Vector2 target_type = new Vector2(0, 2);
    public bool auto_target;

    public float range;
    public float bot_rate;
    public float _return;
    public float max_return;
    public float min_return;
    public float recovery_return;

    public int bullets;
    public int clips;
    public int max_bullets;
    public int max_clips;
    public float fire_rate;
    public int fire_wait;

    public int force;
    public float power;
    public float exp_radius;
}//ClassWeapon

[Serializable]
public class ClassOtherWeapon
{
    public bool active;
    public int bullet_width;
    public int bullet_height;
    public float bullet_dis;
    public Vector2 point_pos;
    public Transform centr_point;

}//ClassOtherWeapon

[Serializable]
public class ClassSound
{
    public List<AudioClip> sound = new List<AudioClip> ();
}//ClassSound

[Serializable]
public class ClassVoice
{
    public List<ClassSound> voice = new List<ClassSound>();
}//ClassSound

[Serializable]
public class ClassTeam
{
    public List<Transform> unit = new List<Transform>();
}//ClassSound

[Serializable]
public class ClassCamera
{
    public int num;
    public Transform target;
}//ClassCameraType

[Serializable]
public class ClassVehiclePlace
{
    public Transform place_point;
    public Transform door_point;
    public Transform door;
    public Transform man;
    public int door_setting;
    public int anim;
    public int direction;
    public bool use;
    public bool can_use = true;
    public bool empty = false;
}//ClassCameraType

[Serializable]
public class ClassVehicleArea
{
    public Vector3 _position;
    public List<ClassPointCar> point = new List<ClassPointCar>();
    public List<ClassPointMan> point_man = new List<ClassPointMan>();
    public List<int> man = new List<int>();
    public List<int> man_procent = new List<int>();
    public int width;
    public int height;
    public int procent;
    public int limit_speed;
}//ClassCameraType

[Serializable]
public class ClassMan
{
    public int type;
    public List<int> man = new List<int>();
    public List<int> car = new List<int>();
    public List<int> boat = new List<int>();
}//ClassCameraType

[Serializable]
public class ClassVehicleDoor
{
    public Vector3 collider_size;
    public Vector3 axis;
    public Vector2 limit;
    public float break_force;
    public float break_torque;
    public AudioClip sound_open;
    public AudioClip sound_close;
}//ClassCameraType

[Serializable]
public class ClassGlass
{
    public Transform destroy_object;
    public AudioClip sound;
}//ClassGlass

[Serializable]
public class ClassDecal
{
    public List<Transform> decal = new List<Transform>();
    public List<AudioClip> sound = new List<AudioClip>();
    public Transform particle;
}//ClassGlass

[Serializable]
public class ClassLightObject
{
    public List<Transform> object1 = new List<Transform>();
    public List<Transform> object2 = new List<Transform>();
}//ClassGlass

[Serializable]
public class ClassManArea
{
    public int man;
    public int procent;
}//ClassGlass

[Serializable]
public class ClassLanguage
{
    public List<string> language = new List<string>();
}//ClassGlass
