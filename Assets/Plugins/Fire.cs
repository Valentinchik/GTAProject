using UnityEngine;
using System.Collections;

public class Fire : MonoBehaviour
{
    public Transform root;

    void Start()
    {
        Destroy(gameObject, 5);
        Invoke("Damage", 0.01f);
    }
    public void Damage()
    {
        if (!gameObject.active) return ;
        if (transform.root.GetComponent<Man>())
        {
            root.GetComponent<Man>().enemy = transform.root;
            transform.root.GetComponent<Man>().Damage(10, 0, Vector3.zero, Vector3.zero, root);
        }
        else if (transform.root.GetComponent<Vehicle>()) { transform.root.GetComponent<Vehicle>().Damage(100, root); }
        else if (transform.parent && transform.parent.gameObject.active && transform.parent.GetComponent<Vehicle>()) { transform.parent.GetComponent<Object_death>().Damage(10); }
        Invoke("Damage", 1);
    }
}