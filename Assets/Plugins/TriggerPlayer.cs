using UnityEngine;
using System.Collections;

public class TriggerPlayer : MonoBehaviour
{
    public Transform collision;

    void OnTriggerEnter(Collider other)
    {
        if(other.transform.root.GetComponent<Vehicle>())
        {
            collision = other.transform.root;
        }
    }

    void OnTriggerExit(Collider other)
    {
        if(other.transform.root == collision)
        {
            collision = null;
        }
    }
}
