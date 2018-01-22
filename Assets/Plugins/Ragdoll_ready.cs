using UnityEngine;
using System.Collections;

public class Ragdoll_ready : MonoBehaviour
{
//    public Transform BipPelvis;

//    public Transform BipLThigh;
//    public Transform BipRThigh;
//    public Transform BipLCalf;
//    public Transform BipRCalf;

//    public Transform bip_spine;

//    public Transform BipHead;
//    public Transform BipLUpperArm;
//    public Transform BipRUpperArm;
//    public Transform BipLForearm;
//    public Transform BipRForearm;

//    void Start()
//    {
//        //Activate(true);
//        //if(GetComponent(sc_man).health>0)Invoke("ActivateFalse",5);
//    }//Start

//    void Update()
//    {
//        if (Input.GetKeyUp(KeyCode.T))
//        {
//            Activate(true);
//            if (GetComponent<Man>().health > 0) Invoke("ActivateFalse", 5);
//        }
//    }//Update

//    public void RagDoll()
//    {
//        Activate(true);
//        if (GetComponent<Man>().health > 0) Invoke("ActivateFalse", 5);
//    }//RagDoll

//   public  void ActivateFalse()
//    {
//        RaycastHit hit;
//        if ((Physics.Raycast(BipPelvis.position, new Vector3(0, 1, 0), out hit, 2) && hit.transform.root != transform) ||
//        GetComponent<Rigidbody>().velocity.magnitude > 5) { Invoke("ActivateFalse", 3); return; }
//        transform.position = new Vector3(BipPelvis.position.x, transform.position.y, BipPelvis.position.z);
//        transform.eulerAngles = new Vector3(0, transform.position.y, 0);
//        Activate(false);
//    }//ActivateFalse

//    public void Activate(bool _active)
//    {
//        GetComponent<Animator>().enabled = !_active;
//        GetComponent<Man>().enabled = !_active;
//        transform.GetComponent<Collider>().enabled = !_active;
//        if (GetComponent<Rigidbody>().isKinematic) GetComponent<Rigidbody>().isKinematic = false;
//        if (!_active) transform.GetComponent<Man>().StandUp();

//        if (_active)
//        {
//            ConfigurableJoint joint = BipPelvis.gameObject.AddComponent<ConfigurableJoint>();
//            joint.connectedBody = transform.GetComponent<Rigidbody>();
//            joint.xMotion = ConfigurableJointMotion.Locked;
//            joint.yMotion = ConfigurableJointMotion.Locked;
//            joint.zMotion = ConfigurableJointMotion.Locked;
//        }
//        else Destroy(BipPelvis.GetComponent<ConfigurableJoint>());


//        bip_spine.GetComponent<Rigidbody>().isKinematic = !_active;
//        BipHead.GetComponent<Rigidbody>().isKinematic = !_active;
//        BipPelvis.GetComponent<Rigidbody>().isKinematic = !_active;
//        BipLThigh.GetComponent<Rigidbody>().isKinematic = !_active;
//        BipRThigh.GetComponent<Rigidbody>().isKinematic = !_active;
//        BipLCalf.GetComponent<Rigidbody>().isKinematic = !_active;
//        BipRCalf.GetComponent<Rigidbody>().isKinematic = !_active;
//        BipLUpperArm.GetComponent<Rigidbody>().isKinematic = !_active;
//        BipRUpperArm.GetComponent<Rigidbody>().isKinematic = !_active;
//        BipLForearm.GetComponent<Rigidbody>().isKinematic = !_active;
//        BipRForearm.GetComponent<Rigidbody>().isKinematic = !_active;


//        bip_spine.GetComponent<Collider>().enabled = _active;
//        BipHead.GetComponent<Collider>().enabled = _active;
//        BipPelvis.GetComponent<Collider>().enabled = _active;
//        BipLThigh.GetComponent<Collider>().enabled = _active;
//        BipRThigh.GetComponent<Collider>().enabled = _active;
//        BipLCalf.GetComponent<Collider>().enabled = _active;
//        BipRCalf.GetComponent<Collider>().enabled = _active;
//        BipLUpperArm.GetComponent<Collider>().enabled = _active;
//        BipRUpperArm.GetComponent<Collider>().enabled = _active;
//        BipLForearm.GetComponent<Collider>().enabled = _active;
//        BipRForearm.GetComponent<Collider>().enabled = _active;


//        //this.enabled=_active;
//    }//Activate
}


