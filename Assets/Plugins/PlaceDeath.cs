using UnityEngine;
using System.Collections.Generic;

public class PlaceDeath : MonoBehaviour
{
    private Game game_sc;
    public List<Transform> car = new List<Transform>();
    public List<ClassPointMan> near_point = new List<ClassPointMan>();
    public Transform man;
    public Transform killer;
    public bool have_point;
    public int car_count = 2;

    void Start()
    {
        game_sc = GameObject.Find("Game").GetComponent<Game>();
        Invoke("ClearEmptyCar", 10);
    }//Start

    public void ClearEmptyCar()
    {
        if (!man)
        {
            game_sc.place_death.Remove(transform);
            Destroy(gameObject);
            return;
        }

        Invoke("ClearEmptyCar", 10);
        for (var i = 0; i < car.Count; i++)
        {
            if (!car[i]) { car.RemoveAt(i); }
        }//for
    }//ClearEmptyCar
}
