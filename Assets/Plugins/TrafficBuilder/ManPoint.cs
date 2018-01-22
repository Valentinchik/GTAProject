using UnityEngine;
using System.Collections.Generic;
using UnityEditor;

public class ManPoint : MonoBehaviour
{
    public int index;
    public bool Create = true;
    public int Distance = 3;

    public List<ManPoint> NextPoints = new List<ManPoint>();

    void OnDrawGizmos()
    {
        Gizmos.color = Color.red;
        Gizmos.DrawSphere(transform.position, 1);
        for(int i=0; i<NextPoints.Count; i++)
        {
            if (NextPoints[i] == this) Debug.Log("Indicates itself: " + this.gameObject.name);
            if (NextPoints[i] == null) Debug.Log("Empty cell: " + this.gameObject.name);
            if (NextPoints[i] != null)
            {
                Gizmos.color = Color.red;
                Gizmos.DrawLine(transform.position, NextPoints[i].transform.position);
            }
        }
    }
}
