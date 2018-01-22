using UnityEngine;
using System.Collections.Generic;

public class Ragdoll : MonoBehaviour
{
    //public List<Component>  components = new List<Component> ();
    //public List<Component> rigid_body_com = new List<Component> ();
    //public Transform BipPelvis;

    public Transform Pelvis;
    public CapsuleCollider MainCapsuleCollider;
    public BoxCollider[] boxCol;
    public SphereCollider[] spherCol;
    public CapsuleCollider[] cupsulCol;
    public Rigidbody[] rigids;

    void Awake()
    {
        MainCapsuleCollider = GetComponent<CapsuleCollider>();
        boxCol = Pelvis.transform.GetComponentsInChildren<BoxCollider>();
        spherCol = Pelvis.transform.GetComponentsInChildren<SphereCollider>();
        cupsulCol = Pelvis.transform.GetComponentsInChildren<CapsuleCollider>();
        rigids = Pelvis.transform.GetComponentsInChildren<Rigidbody>();
    }

    void Start()
    {
        ActivateRagdoll(false);

        if (GetComponent<Man>().vehicle == null)
        {
            MainCapsuleCollider.enabled = true;
            GetComponent<Rigidbody>().isKinematic = false;
        }
    }//Start

    public void ActivateRagdoll(bool active)
    {
        GetComponent<Animator>().enabled = !active;
        if(GetComponent<Man>().vehicle == null)
        {
            MainCapsuleCollider.enabled = !active;
            GetComponent<Rigidbody>().isKinematic = active;
        }
        int i = 0;
        for(i=0; i< boxCol.Length; i++)
        {
            boxCol[i].enabled = active;
        }
        for(i=0; i< spherCol.Length; i++)
        {
            spherCol[i].enabled = active;
        }
        for (i = 0; i < cupsulCol.Length; i++)
        {
            cupsulCol[i].enabled = active;
        }
        for (i = 0; i < rigids.Length; i++)
        {
            rigids[i].isKinematic = !active;
        }
    }
}