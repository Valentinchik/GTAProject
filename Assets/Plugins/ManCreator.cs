using UnityEngine;
using System.Collections;

public class ManCreator : MonoBehaviour
{
    public ClassPointMan point;
    public ClassMan man;

    public Info info_sc;
    public Transform game_ob;
    public Game game_sc;
    public VehicleCreator creator_sc;

    void Start()
    {
        Invoke("Delete", 1);
        Invoke("CreateOldMan", Random.Range(0, 1.0f));
    }//Start

    public void Create()
    {
        if (creator_sc.man_count > creator_sc.man_max) return;
        Transform temp_man = Instantiate(info_sc.man_ob[man.man[Random.Range(0, man.man.Count)]]) as Transform;
        temp_man.position = transform.position;
        temp_man.GetComponent<Man>().game_sc = game_sc;
        temp_man.GetComponent<Bot>().game_sc = game_sc;
        if (temp_man.GetComponent<Weapon>()) temp_man.GetComponent<Weapon>().game_ob = game_ob;
        temp_man.GetComponent<Bot>().GetThisPoint(point, false);
        creator_sc.man_count++;
        Delete();
    }//create

    public void CreateOldMan()
    {
        if (creator_sc.man_delete.Count <= 0) return;
        if (!creator_sc.man_delete[0]) { creator_sc.man_delete.RemoveAt(0); return; }
        Transform temp_man = creator_sc.man_delete[0];

        temp_man.position = transform.position;
        temp_man.GetComponent<Bot>().GetThisPoint(point, false);
        temp_man.GetComponent<Man>().destroy = false;
        creator_sc.man_delete.RemoveAt(0);
        Delete();
    }//CreateOldMan

    public void Delete()
    {
        creator_sc.man.Remove(transform);
        Destroy(gameObject);
    }//Delete
}
