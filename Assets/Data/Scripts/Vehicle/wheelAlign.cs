using UnityEngine;
using System.Collections;

//------------------------------------Please attach this script to EACH GRAPHIC wheel object----------------------------

public class wheelAlign : MonoBehaviour {
	
	public WheelCollider wheelCol;			//drag wheelCollider object for this graphic wheel here
	public float wheelOffset = 0.1f;		//offset of wheel. Should be same as Suspention Distance of collider
	private float rotation = 0.0f;
	private Vector3 wheelStartPos;
	public GameObject car;					//parental car object of wheel

	void Start () 
	{	
		wheelStartPos = transform.localPosition;
	}
	
	void FixedUpdate () 
	{
		wheelToCol();
	}
	
	void wheelToCol()
	{
		float delta = Time.fixedDeltaTime;    
        
        WheelHit hit; 
                                
        Vector3 lp = transform.localPosition; 
        if(wheelCol.GetGroundHit(out hit))
		{
        	lp.y -= Vector3.Dot(transform.position - hit.point, car.transform.up) - wheelCol.radius; 
		}
		else
		{           
            lp.y = wheelStartPos.y - wheelOffset; 
        }
        transform.localPosition = lp; 
                 
        rotation = Mathf.Repeat(rotation + delta * wheelCol.rpm * 360.0f / 60.0f, 360.0f); 
        transform.localRotation = Quaternion.Euler(rotation, wheelCol.steerAngle, 0.0f); 
	}
}
