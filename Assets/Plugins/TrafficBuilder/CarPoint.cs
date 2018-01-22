using UnityEngine;
using System.Collections.Generic;

public class CarPoint : MonoBehaviour
{
    public int index;
    public bool Stop = false;

    public List<CarPoint> NextPoints = new List<CarPoint>();

    void OnDrawGizmos()
    {
        Gizmos.color = Color.blue;
        Gizmos.DrawCube(transform.position, new Vector3(1, 1, 1));
        for (int i = 0; i < NextPoints.Count; i++)
        {
            if (NextPoints[i] == this) Debug.Log("Indicates itself: " + this.gameObject.name);
            if (NextPoints[i] == null) Debug.Log("Empty cell: " + this.gameObject.name);
            if (NextPoints[i] != null)
            {
                Gizmos.color = Color.blue;
                Gizmos.DrawLine(transform.position, NextPoints[i].transform.position);
            }
        }
    }
}
