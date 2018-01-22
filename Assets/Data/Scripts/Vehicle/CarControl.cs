using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class CarControl : MonoBehaviour {
	
	public WheelCollider[] wColDrive;			//array of drive wheels
	public WheelCollider[] wColSteer;			//array of steer wheels
	public WheelCollider[] wColAll;		

	public	float sqrVelx = 0;
	public	float sqrvelz = 0;


	public float[] gearRatio;					//array of gearbox ratios
	public int currentGear;						//current gear of gearbox. You should not setup this
	public float maxEngineTorque = 4000.0f;		//maximum torque on EACH drive wheel. Please setup in Inspector
	public float minEngineTorque = 2500.0f;		//minimum engine torque
	public float engineTorque = 0.0f;			//current engine torque (depends of RPM)
	public float maxEngineRPM = 5500.0f;		//maximum engine RPM. Mathes to maxEngineTorque
	public float minEngineRPM = 3000.0f;		//RPM to shift gear down
	public float xxEngineRPM = 700.0f;	//Idle engine RPM. Matches to minEngineTorque
	public float startRPM;
	public float engineRPM = 0.0f;				//current engine RPM
	private float carSpeedKPH = 0.0f;			//current speed in KPH
	
	public float steer = 0;					//steer ratio
	public float maxSteer = 50;					//maximum steer angle
	public float minSteer = 10;					//minimum steer angle (depends of speed)
	public float maxBrake = 500000 ;				//maximum brake force
	public float minBrake =100;		
	public float directBrake = 0;//engine brake torque					
	
	//	public GameObject compas;					//navigate to next waypoint
	
	public float inputSteer = 0.0f;				//input value of steer
	public float inputTorque = 0.0f;	//input value of torque
	//	public float inertiaFactor = 0.0001f;
	
	public Vector2 Acc;							//coordinates of Brake and Throttle screenplaces 
	
	
	public Transform COM;						//center of gravity. Pls create empty game object and place it where you want
	public Transform PoV;						//point of view for Camera. Place it where you want and drag in to field Target of maincamera

	
	static public int lap=0;							//current lap


	
	private	float averageWheelRPM;						//average RPM of wheelColliders
	private int wheelDriveCount;						//count of drive wheels
	
	public float frictionForwardExtremumValue = 600;			//extremum value of wheel colliders
	public float frictionForwardMinValue = 200;
	public float frictionSidewaysExtremumValue = 400;			//extremum value of wheel colliders
	public float frictionSidewaysMinValue = 200;			//extremum value of wheel colliders
	
	private WheelFrictionCurve wfcF;						//wheelColliders friction curve setup
	private WheelFrictionCurve wfcS;						//wheelColliders friction curve setup
	
	public float testSQRVel=0;

	private bool isBrakeRelease = false;

	private float startTimeRPM;
	public float deltaRPM = .005f;
	private float deltaTimeForRPM = .0005f;
	
	public float shiftDelay = .01f;
	private float deltaTimeShift = 1.0f;
	private bool isNeutral = false;
	private bool canShiftUp = true;
	private bool canShiftDown = true;
	private bool isOverRPM = false;
	private float startTimeShiftUp;
	private float startTimeShiftDown;
	private float startTimeShiftDelay;

	public float startSpeedKPH;
	public Vector3 contPointCoord;

	public bool isAlife = true;
	public Vector3 point;
	
	public bool isStop = false;
	public float stopCount = 3.0f;
	public bool isRear = false;
	public float rearCount = 3.0f;
	public float stopTime;
	private float rearTime;
	public bool isPlayerTarget = false;

	int gameMode = 0;


	public GameObject marker;


	// Use this for initialization
	
	
	void Awake () 
	{

		GetComponent<Rigidbody>().centerOfMass = COM.localPosition;
		Screen.sleepTimeout = 0;
		SetupWheelFrictionCurve();
		startRPM = minEngineRPM;
		startSpeedKPH = 0.0f;

		gameMode = PlayerPrefs.GetInt("gameMode");
	}



	void Update ()
	{
		inputTorque = Input.GetAxis ("Vertical");
		inputSteer = Input.GetAxis ("Horizontal");	
	}
	

	void FixedUpdate () 
	{

		ShiftGears();
		CalculateStiffness();
		SetPoVOrientation();
		if (isAlife == true)
		{
			SetValuesToColliders();
		}
		else if (isAlife == false)
		{	
			foreach (WheelCollider col in wColAll)
			{
				col.brakeTorque = 999999;
			}
		}

	}

	
	public void OnCollisionEnter(Collision col)
	{
		if (col.relativeVelocity.magnitude > 5)
		{

//			foreach (ContactPoint contPoint in col.contacts)
//			{
			if (col.contacts.Length>0)
			{
				ContactPoint contPoint = col.contacts[0];
				contPointCoord = this.transform.InverseTransformPoint(contPoint.point);
				point = contPoint.point;


			}

		}



	}

	


	
	public void SetValuesToColliders()
	{
		if (isAlife == true)
			
		{
			foreach (WheelCollider col in wColSteer)
			{		
				if (directBrake==0)
				{
					col.steerAngle = steer * inputSteer;
				}
			}
			/*		if (inputSteer != 0)
		{
			steeringWheel.localRotation = Quaternion.Euler(45, 0, 180-steer * inputSteer*7);
		}
		else
		{
			steeringWheel.localRotation = Quaternion.Euler(45, 0, 180);
		}*/
			//		steeringWheel.rotation = steer * inputSteer;
			
			foreach (WheelCollider col in wColDrive)
			{	
				col.motorTorque = engineTorque * gearRatio[currentGear] * inputTorque/wColDrive.Length;
				col.brakeTorque = minBrake;
				if (col.rpm > maxEngineRPM/gearRatio[currentGear]+500)
				{
					col.brakeTorque = 1000000000;
				}
				else
				{
					col.brakeTorque = minBrake;
				}
			}
			
			
			foreach (WheelCollider col in wColAll)
			{
				if (inputTorque<0)
				{
					if (carSpeedKPH>0)
					{		
						col.motorTorque = 0;
						col.brakeTorque = maxBrake;
						isBrakeRelease = true;
					}	
					else 
					{
						col.brakeTorque = 0;
					}
				}		
				if (inputTorque>0)
				{
					if (carSpeedKPH<0)	
					{
						col.motorTorque = 0;
						col.brakeTorque = maxBrake;
					}
					else 
					{
						col.brakeTorque = 0;
						isBrakeRelease = false;
					}	
				}			
				if (inputTorque==0)
				{
					col.brakeTorque = minBrake;
					if (isBrakeRelease == true)
					{
						//						AudioSource.PlayClipAtPoint(brakeRelease, transform.position);
						isBrakeRelease = false;
					}
				}
				if (directBrake>0)
				{
					col.brakeTorque = directBrake;
				}
			}
		}
		else
		{
			foreach (WheelCollider col in wColAll)
			{
				col.brakeTorque = maxBrake;
			}
		}
		
	}
	
	public void SetPoVOrientation()
	{
		if (carSpeedKPH < -5)
		{
			PoV.transform.localRotation = Quaternion.Euler(0, 180, 0);
			/*			if (beep.isPlaying == false)
			{
				beep.Play();
			}*/
		}
		else 
		{
			PoV.transform.localRotation = Quaternion.Euler(0, 0, 0);
			/*			if (beep.isPlaying == true)
			{
				beep.Stop();
			}*/
		}	
	}
	
	public void CalculateStiffness()
	{
		Vector3 relativeVelocity = transform.InverseTransformDirection(GetComponent<Rigidbody>().velocity);
		carSpeedKPH = engineRPM/gearRatio[currentGear]*wColDrive[0].radius*2.0f*3.14f*60.0f/1000.0f;

		
		sqrVelx = relativeVelocity.x*relativeVelocity.x;
		sqrvelz = relativeVelocity.z*relativeVelocity.z;
		//		testSQRVel = sqrVel;		
		
		if (Mathf.Abs(carSpeedKPH) > 10)
		{	
			
			steer = maxSteer - Mathf.Abs(carSpeedKPH/3);
		}
		else
		{
			steer = maxSteer;
		}
		if (steer < minSteer)
		{
			steer = minSteer;
		}
		
		if (Mathf.Abs(carSpeedKPH)<5.0f && inputTorque==0)
		{

			wfcS.extremumValue = 1500.0f;
			wfcS.asymptoteValue = 750.0f;
			
			/*}*/
		}
		else
		{
			wfcS.extremumValue = Mathf.Clamp(frictionSidewaysExtremumValue - sqrVelx, 0, frictionSidewaysExtremumValue);
			wfcS.asymptoteValue = Mathf.Clamp(frictionSidewaysExtremumValue/2 - (sqrVelx / 2), 0, frictionSidewaysExtremumValue/2);
		}
		
		if (Mathf.Abs(sqrvelz)<1 && inputTorque==0)
		{
			wfcF.extremumValue = 2500;
			wfcF.asymptoteValue = 1250;
		}	
		else
		{
			wfcF.extremumValue = Mathf.Clamp(frictionForwardExtremumValue - sqrvelz*3, frictionForwardMinValue, frictionForwardExtremumValue);
			wfcF.asymptoteValue = Mathf.Clamp(frictionForwardExtremumValue/2 - (sqrvelz*3 / 2), frictionForwardMinValue/2, frictionForwardExtremumValue/2);
		}
		

		
		if (wfcS.extremumValue<frictionSidewaysMinValue)
		{
			wfcS.extremumValue = frictionSidewaysMinValue;
		}
		
		if (wfcS.asymptoteValue<frictionSidewaysMinValue/2)
		{
			wfcS.asymptoteValue = frictionSidewaysMinValue/2;
		}
		
		foreach (WheelCollider colDrive in wColDrive)
		{
			colDrive.forwardFriction = wfcF;
			colDrive.sidewaysFriction = wfcS;
		}
		foreach (WheelCollider colSteer in wColSteer)
		{
			colSteer.sidewaysFriction = wfcS;
			colSteer.forwardFriction = wfcF;
		}
	}
	
	public void SetupWheelFrictionCurve()
	{
		wfcF = new WheelFrictionCurve();
		wfcF.extremumSlip = 1;
		wfcF.extremumValue = 300;
		wfcF.asymptoteSlip = 2;
		wfcF.asymptoteValue = 150;
		wfcF.stiffness = 0.99f
			;
		wfcS = new WheelFrictionCurve();
		wfcS.extremumSlip = 1;
		wfcS.extremumValue = 300;
		wfcS.asymptoteSlip = 2;
		wfcS.asymptoteValue = 150;
		wfcS.stiffness = 1;
	}	
	
	public	void ShiftGears()
	{
		averageWheelRPM = 0.0f;
		wheelDriveCount = 0;
		
		foreach (WheelCollider col in wColDrive)	
		{
			averageWheelRPM += col.rpm;	
			wheelDriveCount+=1;	
		}	
		engineRPM = averageWheelRPM/wheelDriveCount*gearRatio[currentGear];
		
		if (Mathf.Abs(engineRPM)<xxEngineRPM)
		{
			GetComponent<AudioSource>().pitch = 0.3f;
		}	
		else
		{		
			GetComponent<AudioSource>().pitch = Mathf.Abs(engineRPM/maxEngineRPM);
		}
		
		if (engineRPM > maxEngineRPM)
		{
			//		engineTorque = 0.01f;
			if (currentGear < gearRatio.Length-1)
			{
				if (canShiftUp == true)
				{
					currentGear++;
					//					AudioSource.PlayClipAtPoint(shiftGear, steeringWheel.transform.position);
					isNeutral = true;
					canShiftDown = false;
					startTimeShiftDown = Time.time;
					startTimeShiftDelay = Time.time;
				}
			}
			else 
			{
				engineTorque = 0.01f;
				isOverRPM = true;
				return;
			}
		}
		else if (engineRPM < minEngineRPM)
		{
			isOverRPM = false;
			if (currentGear > 0)
			{
				if (canShiftDown == true)
				{
					currentGear--;	
					//					AudioSource.PlayClipAtPoint(shiftGear, steeringWheel.transform.position);
					isNeutral = true;
					canShiftUp = false;
					startTimeShiftUp = Time.time;
					startTimeShiftDelay = Time.time;
					engineTorque = 0.01f;
				}
			}
		}
		
		if (engineRPM > xxEngineRPM && Mathf.Abs(engineRPM) < maxEngineRPM)
		{
			isOverRPM = false;
			if (isNeutral == false)
			{

				engineTorque = (maxEngineTorque - minEngineTorque)*(engineRPM - xxEngineRPM)/(maxEngineRPM-xxEngineRPM)+minEngineTorque;
				startRPM += engineRPM-startRPM;
				isOverRPM = false;

			}
			else 
			{
				engineTorque = 0.01f;
				startRPM = engineRPM;
			}
		}
		else if (engineRPM < xxEngineRPM)	
		{
			engineTorque = minEngineTorque;
		}	
		else 
		{
			engineTorque = minEngineTorque;
		}
		if (carSpeedKPH < -40)
		{
			engineTorque = 0;
		}	
		if (Time.time > startTimeShiftUp + deltaTimeShift)
		{
			canShiftUp = true;
		}
		if (Time.time > startTimeShiftDown + deltaTimeShift)
		{
			canShiftDown = true;
		}
		if (Time.time > startTimeShiftDelay + shiftDelay)
		{
			isNeutral = false;
		}
		if (Mathf.Abs(engineRPM) > maxEngineRPM)
		{
			engineTorque = 0.01f;
		}
		
		startRPM = engineRPM;
		
	}		
	

	

	



}




