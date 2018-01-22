using UnityEngine;
using System.Collections;

public class Test_sc : MonoBehaviour {
	Vector3 force;
	Vector3 force_max;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		//force = new Vector3(rigidbody.,0,0);
		if(force.magnitude>force_max.magnitude)force_max=force;
	}

	void OnGUI(){
		GUI.Label (new Rect (Screen.width / 2, Screen.height / 2, 200, 100), "FORCE" + force);
		GUI.Label (new Rect (Screen.width / 2, Screen.height / 2+100, 200, 100), "MAX_FORCE" + force_max);
		}//
}
