using UnityEngine;
using System.Collections.Generic;

public class MiniMap : MonoBehaviour
{
    public Transform PlayerTr;

    void FixedUpdate()
    {
        transform.position = new Vector3(PlayerTr.position.x, PlayerTr.position.y + 30, PlayerTr.position.z);
        transform.eulerAngles = new Vector3(transform.eulerAngles.x, PlayerTr.eulerAngles.y, transform.eulerAngles.z);
    }
}