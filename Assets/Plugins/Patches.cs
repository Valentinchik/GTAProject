using UnityEngine;
using System.Collections.Generic;

[System.Serializable]
public class ClassPointCar
{
    public bool use;
    public int index = -1;
    public Vector3 _position;
    public Vector3 _rotation;
    public List<int> near_point = new List<int>();
    public bool stop;
    public bool boat;
}

[System.Serializable]
public class ClassPointMan
{
    public bool use;
    public int index = -1;
    public Vector3 _position;
    public Vector3 rotation;
    public int distance;
    public int doing;
    public bool door;
    public bool create;
    public bool car;
    public List<int> near_point = new List<int>();
    public List<int> controll_point = new List<int>();
}

public class Patches : MonoBehaviour
{
    public List<ClassPointCar> point_car = new List<ClassPointCar>();
    public List<ClassPointMan> point_man = new List<ClassPointMan>();
    public List<ClassPointMan> point_man_build = new List<ClassPointMan>();
    public List<ClassPointCar> point_police = new List<ClassPointCar>();
}
