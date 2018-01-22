using UnityEngine;
using System.Collections;

public class Trigger : MonoBehaviour
{

    public Transform collision;

    void OnTriggerEnter(Collider _collision)
    {
        if (_collision && !_collision.GetComponent<Trigger>() /*&& !_collision.GetComponent<sc_collider_creator>()*/)
        {
            collision = _collision.transform;
        }
    }

    void OnTriggerExit(Collider _collision)
    {
        collision = null;
    }
}
