//----------------------------------------------
//            Realistic Car Controller
//
// Copyright © 2015 BoneCracker Games
// http://www.bonecrackergames.com
//
//----------------------------------------------

//#pragma warning disable 0414

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[AddComponentMenu("BoneCracker Games/Realistic Car Controller/Realistic Car Controller V3")]
[RequireComponent (typeof(Rigidbody))]
public class RCC_CarControllerV3 : MonoBehaviour {

	private RCC_Settings RCCSettings{get{return RCC_Settings.Instance;}}
	private Rigidbody rigid;		// Rigidbody.
	internal bool sleepingRigid = false;		// Used For Disabling Unnecessary Raycasts When RB Is Sleeping.

	public bool AIController = false;		// Use AI Controller.
	
	// Wheel Transforms Of The Vehicle.
	public Transform FrontLeftWheelTransform;
	public Transform FrontRightWheelTransform;
	public Transform RearLeftWheelTransform;
	public Transform RearRightWheelTransform;
	
	// Wheel Colliders Of The Vehicle.
	public RCC_WheelCollider FrontLeftWheelCollider;
	public RCC_WheelCollider FrontRightWheelCollider;
	public RCC_WheelCollider RearLeftWheelCollider;
	public RCC_WheelCollider RearRightWheelCollider;

	// All Wheel Colliders.
	internal RCC_WheelCollider[] allWheelColliders;
	
	// Extra Wheels. In case of if your vehicle has extra wheels.
	public Transform[] ExtraRearWheelsTransform;
	public RCC_WheelCollider[] ExtraRearWheelsCollider;
	
	public bool applyEngineTorqueToExtraRearWheelColliders = true;		//Applies Engine Torque To Extra Rear Wheels.

	public Transform SteeringWheel;		// Driver Steering Wheel. In case of if your vehicle has individual steering wheel model in interior.
	
	// Set wheel drive of the vehicle. If you are using rwd, you have to be careful with your rear wheel collider
	// settings and com of the vehicle. Otherwise, vehicle will behave like a toy.
	public WheelType _wheelTypeChoise = WheelType.RWD;
	public enum WheelType{FWD, RWD, AWD, BIASED}
	
	//Center of mass.
	public Transform COM;
	
	public bool canControl = true;      // Enables/Disables controlling the vehicle.
    public bool runEngineAtAwake = true;		// Двигатель при старте заведен или нет
	public bool engineRunning = true;      // Engine Running Now?
	private bool engineStarting = false;
    public bool autoReverse = false;		// авто задний ход
	private bool canGoReverseNow = false;
	
	public AnimationCurve[] engineTorqueCurve;		// Each Gear Ratio Curves Generated By Editor Script.
	public float[] gearSpeed;		// Target Speed For Changing Gear.
	public float engineTorque = 3000f;		// Default Engine Torque.
	public float maxEngineRPM = 7000f;		// Maximum Engine RPM.
	public float minEngineRPM = 1000f;		// Minimum Engine RPM.
	[Range(.75f, 2f)]public float engineInertia = 1f;
	public bool useRevLimiter = true;
	
	public float steerAngle = 40f;		// Maximum Steer Angle Of Your Vehicle.
	public float highspeedsteerAngle = 15f;		// Maximum Steer Angle At Highest Speed.
	public float highspeedsteerAngleAtspeed = 100f;		// Highest Speed For Maximum Steer Angle.
	public float antiRollFrontHorizontal = 5000f;		// Anti Roll Force For Preventing Flip Overs And Stability.
	public float antiRollRearHorizontal = 5000f;		// Anti Roll Force For Preventing Flip Overs And Stability.

	public float speed;		// Vehicle Speed.
	public float brake = 2500f;		// Maximum Brake Torque.
	public float maxspeed = 220f;		//Maximum Speed.
    
	private float orgSteerAngle = 0f;
	public float fuelInput = 1f;

	// Gears.
	public int currentGear = 0;		// Current Gear Of The Vehicle.
	public int totalGears = 6;			// Total Gears Of The Vehicle.
	[Range(0f, .5f)]public float gearShiftingDelay = .35f;
	public bool changingGear = false;		// Changing Gear Currently.
	public int direction = 1;		// Reverse Gear Currently.
    
	
	//AudioSources and AudioClips.
	private AudioSource engineStartSound;
	public AudioClip engineStartClip;
	internal AudioSource engineSoundOn;
	public AudioClip engineClipOn;
	private AudioSource engineSoundOff;
	public AudioClip engineClipOff;
	private AudioSource engineSoundIdle;
	public AudioClip engineClipIdle;
	private AudioSource gearShiftingSound;
	private AudioClip[] gearShiftingClips{get{return RCCSettings.gearShiftingClips;}}
	private AudioSource crashSound;
	private AudioClip[] crashClips{get{return RCCSettings.crashClips;}}
	private AudioSource reversingSound;
	private AudioClip reversingClip{get{return RCCSettings.reversingClip;}}
	private AudioSource windSound;
	private AudioClip windClip{get{return RCCSettings.windClip;}}
	private AudioSource brakeSound;
	private AudioClip brakeClip{get{return RCCSettings.brakeClip;}}
	private AudioSource turboSound;
	private AudioClip turboClip{get{return RCCSettings.turboClip;}}
	private AudioSource blowSound;

	[Range(.25f, 1f)]public float minEngineSoundPitch = .75f;
	[Range(1.25f, 2f)]public float maxEngineSoundPitch = 1.75f;

	public GameObject allAudioSources;
	private GameObject allContactParticles;
	
	// Inputs.
	[HideInInspector]public float gasInput = 0f;
	[HideInInspector]public float brakeInput = 0f;
	[HideInInspector]public float steerInput = 0f;
	[HideInInspector]public float clutchInput = 0f;
	[HideInInspector]public float handbrakeInput = 0f;
	[HideInInspector]public float boostInput = 1f;
	[HideInInspector]public bool cutGas = false;
	[HideInInspector]public float idleInput = 0f;

	internal float _gasInput{get{

			if(fuelInput <= .25f)
				return 0f;

			
				if(!changingGear && !cutGas)
					return (direction == 1 ? Mathf.Clamp01(gasInput) : Mathf.Clamp01(brakeInput));
				else
					return 0f;
				
		}set{gasInput = value;}}

	internal float _brakeInput{get{
				if(!cutGas)
					return (direction == 1 ? Mathf.Clamp01(brakeInput) : Mathf.Clamp01(gasInput));
				else
					return 0f;
		}set{brakeInput = value;}}

	internal float _boostInput
    {
        get
        { 
				return 1f;
		}
        set
        {
            boostInput = value;
        }
    }

	internal float engineRPM = 0f;		// Actual Engine RPM.
	internal float rawEngineRPM = 0f;		// Smoothed Engine RPM.
	
	// Lights.
	public bool lowBeamHeadLightsOn = false;
	public bool highBeamHeadLightsOn = false;
	public float indicatorTimer = 0f;

	// Damage.
	public bool useDamage = true;
	struct originalMeshVerts{public Vector3[] meshVerts;}
	public MeshFilter[] deformableMeshFilters;
	public float randomizeVertices = 1f;
	public float damageRadius = .5f;
	
	private float minimumVertDistanceForDamagedMesh = .002f;		// Comparing Original Vertex Positions Between Last Vertex Positions To Decide Mesh Is Repaired Or Not.
	
	private originalMeshVerts[] originalMeshData;
	[HideInInspector]public bool sleep = true;
	
	public float maximumDamage = .5f;		// Maximum Vert Distance For Limiting Damage. 0 Value Will Disable The Limit.
	private float minimumCollisionForce = 5f;
	public float damageMultiplier = 1f;
	
	public GameObject contactSparkle{get{return RCCSettings.contactParticles;}}
	public int maximumContactSparkle = 5;
	private List<ParticleSystem> contactSparkeList = new List<ParticleSystem>();
	public bool repairNow = false;
	
	private Vector3 localVector;
	private Quaternion rot = Quaternion.identity;

	//Driving Assistances.
	public bool ABS = true;
	public bool TCS = true;
	public bool ESP = true;
	public bool steeringHelper = true;
	public bool tractionHelper = true;
	
	public bool ABSAct = false;
	public bool TCSAct = false;
	
	[Range(.05f, .5f)]public float ABSThreshold = .35f;
	[Range(0f, 1f)]public float TCSStrength = 1f;
	[Range(0f, 1f)] public float steerHelperStrength = .1f;
	[Range(0f, 1f)] public float tractionHelperStrength = .1f;

	// Drift Variables
	internal float driftAngle = 0f;
	private bool applyCounterSteering = false;

	public float frontCamber = 0f;
	public float rearCamber = 0f;

	float angle;

	float angularVelo;

 	//private WheelCollider anyWheel;
	public float turboBoost = 0f;
	public bool useTurbo = false;

    public VehicleBot BotCar;

	void Awake (){

        BotCar = GetComponent<VehicleBot>();
        
        Time.fixedDeltaTime = RCCSettings.fixedTimeStep;

		rigid = GetComponent<Rigidbody>();
		rigid.maxAngularVelocity = RCCSettings.maxAngularVelocity;
		rigid.drag = .05f;
		rigid.angularDrag = .5f;

		allWheelColliders = GetComponentsInChildren<RCC_WheelCollider>();

		FrontLeftWheelCollider.wheelModel = FrontLeftWheelTransform;
		FrontRightWheelCollider.wheelModel = FrontRightWheelTransform;
		RearLeftWheelCollider.wheelModel = RearLeftWheelTransform;
		RearRightWheelCollider.wheelModel = RearRightWheelTransform;

		for (int i = 0; i < ExtraRearWheelsCollider.Length; i++) {
			ExtraRearWheelsCollider[i].wheelModel = ExtraRearWheelsTransform[i];
		}
			
		orgSteerAngle = steerAngle;

		allAudioSources = new GameObject("All Audio Sources");
		allAudioSources.transform.SetParent(transform, false);

		allContactParticles = new GameObject("All Contact Particles");
		allContactParticles.transform.SetParent(transform, false);

		switch(RCCSettings.behaviorType){

		case RCC_Settings.BehaviorType.SemiArcade:
			steeringHelper = true;
			tractionHelper = true;
			ABS = false;
			ESP = false;
			TCS = false;
			steerHelperStrength = Mathf.Clamp(steerHelperStrength, .25f, 1f);
			tractionHelperStrength = Mathf.Clamp(tractionHelperStrength, .25f, 1f);
			antiRollFrontHorizontal = Mathf.Clamp(antiRollFrontHorizontal, 10000f, Mathf.Infinity);
			antiRollRearHorizontal = Mathf.Clamp(antiRollRearHorizontal, 10000f, Mathf.Infinity);
			break;

		case RCC_Settings.BehaviorType.Drift:
			steeringHelper = false;
			tractionHelper = false;
			ABS = false;
			ESP = false;
			TCS = false;
			highspeedsteerAngle = Mathf.Clamp(highspeedsteerAngle, 40f, 50f);
			highspeedsteerAngleAtspeed = Mathf.Clamp(highspeedsteerAngleAtspeed, 100f, maxspeed);
			applyCounterSteering = true;
			engineTorque = Mathf.Clamp(engineTorque, 5000f, Mathf.Infinity);
			antiRollFrontHorizontal = Mathf.Clamp(antiRollFrontHorizontal, 3500f, Mathf.Infinity);
			antiRollRearHorizontal = Mathf.Clamp(antiRollRearHorizontal, 3500f, Mathf.Infinity);
			gearShiftingDelay = Mathf.Clamp(gearShiftingDelay, 0f, .15f);
			break;

		case RCC_Settings.BehaviorType.Fun:
			steeringHelper = false;
			tractionHelper = false;
			ABS = false;
			ESP = false;
			TCS = false;
			highspeedsteerAngle = Mathf.Clamp(highspeedsteerAngle, 30f, 50f);
			highspeedsteerAngleAtspeed = Mathf.Clamp(highspeedsteerAngleAtspeed, 100f, maxspeed);
			antiRollFrontHorizontal = Mathf.Clamp(antiRollFrontHorizontal, 50000f, Mathf.Infinity);
			antiRollRearHorizontal = Mathf.Clamp(antiRollRearHorizontal, 50000f, Mathf.Infinity);
			gearShiftingDelay = Mathf.Clamp(gearShiftingDelay, 0f, .1f);
			break;

		case RCC_Settings.BehaviorType.Racing:
			steeringHelper = true;
			tractionHelper = true;
			steerHelperStrength = Mathf.Clamp(steerHelperStrength, .25f, 1f);
			tractionHelperStrength = Mathf.Clamp(tractionHelperStrength, .25f, 1f);
			antiRollFrontHorizontal = Mathf.Clamp(antiRollFrontHorizontal, 10000f, Mathf.Infinity);
			antiRollRearHorizontal = Mathf.Clamp(antiRollRearHorizontal, 10000f, Mathf.Infinity);
			break;

		case RCC_Settings.BehaviorType.Simulator:
			antiRollFrontHorizontal = Mathf.Clamp(antiRollFrontHorizontal, 2500f, Mathf.Infinity);
			antiRollRearHorizontal = Mathf.Clamp(antiRollRearHorizontal, 2500f, Mathf.Infinity);
			break;

		}

	}

	void Start(){

		SoundsInitialize();

		if(useDamage)
			DamageInit();

		if(runEngineAtAwake)
			KillOrStartEngine();

		rigid.centerOfMass = transform.InverseTransformPoint(COM.transform.position);

		//if(canControl){
		//	if(RCC_Settings.Instance.controllerType == RCC_Settings.ControllerType.Mobile){
		//	}
            
		//}

	}
	
	public void CreateWheelColliders ()//функция для редактора
    {
		
		List <Transform> allWheelModels = new List<Transform>();
		allWheelModels.Add(FrontLeftWheelTransform); allWheelModels.Add(FrontRightWheelTransform); allWheelModels.Add(RearLeftWheelTransform); allWheelModels.Add(RearRightWheelTransform);
		
		if(allWheelModels != null && allWheelModels[0] == null){
			Debug.LogError("You haven't choose your Wheel Models. Please select all of your Wheel Models before creating Wheel Colliders. Script needs to know their sizes and positions, aye?");
			return;
		}
		
		transform.rotation = Quaternion.identity;
		
		GameObject WheelColliders = new GameObject("Wheel Colliders");
		WheelColliders.transform.SetParent(transform, false);
		WheelColliders.transform.localRotation = Quaternion.identity;
		WheelColliders.transform.localPosition = Vector3.zero;
		WheelColliders.transform.localScale = Vector3.one;
		
		foreach(Transform wheel in allWheelModels){
			
			GameObject wheelcollider = new GameObject(wheel.transform.name); 
			
			wheelcollider.transform.position = wheel.transform.position;
			wheelcollider.transform.rotation = transform.rotation;
			wheelcollider.transform.name = wheel.transform.name;
			wheelcollider.transform.SetParent(WheelColliders.transform);
			wheelcollider.transform.localScale = Vector3.one;
			wheelcollider.AddComponent<WheelCollider>();

			Bounds biggestBound = new Bounds();
			Renderer[] renderers = wheel.GetComponentsInChildren<Renderer>();

			foreach (Renderer render in renderers) {
				if (render != GetComponent<Renderer>()){
					if(render.bounds.size.z > biggestBound.size.z)
						biggestBound = render.bounds;
				}
			}

			wheelcollider.GetComponent<WheelCollider>().radius = (biggestBound.extents.y) / transform.localScale.y;
			wheelcollider.AddComponent<RCC_WheelCollider>();
			JointSpring spring = wheelcollider.GetComponent<WheelCollider>().suspensionSpring;

			spring.spring = 40000f;
			spring.damper = 2000f;
			spring.targetPosition = .4f;

			wheelcollider.GetComponent<WheelCollider>().suspensionSpring = spring;
			wheelcollider.GetComponent<WheelCollider>().suspensionDistance = .2f;
			wheelcollider.GetComponent<WheelCollider>().forceAppPointDistance = .1f;
			wheelcollider.GetComponent<WheelCollider>().mass = 40f;
			wheelcollider.GetComponent<WheelCollider>().wheelDampingRate = 1f;

			WheelFrictionCurve sidewaysFriction;
			WheelFrictionCurve forwardFriction;
			
			sidewaysFriction = wheelcollider.GetComponent<WheelCollider>().sidewaysFriction;
			forwardFriction = wheelcollider.GetComponent<WheelCollider>().forwardFriction;

			wheelcollider.transform.localPosition = new Vector3(wheelcollider.transform.localPosition.x, wheelcollider.transform.localPosition.y + wheelcollider.GetComponent<WheelCollider>().suspensionDistance, wheelcollider.transform.localPosition.z);

			forwardFriction.extremumSlip = .2f;
			forwardFriction.extremumValue = 1;
			forwardFriction.asymptoteSlip = .8f;
			forwardFriction.asymptoteValue = .75f;
			forwardFriction.stiffness = 1.5f;

			sidewaysFriction.extremumSlip = .25f;
			sidewaysFriction.extremumValue = 1;
			sidewaysFriction.asymptoteSlip = .5f;
			sidewaysFriction.asymptoteValue = .75f;
			sidewaysFriction.stiffness = 1.5f;

			wheelcollider.GetComponent<WheelCollider>().sidewaysFriction = sidewaysFriction;
			wheelcollider.GetComponent<WheelCollider>().forwardFriction = forwardFriction;

		}
		
		RCC_WheelCollider[] allWheelColliders = new RCC_WheelCollider[allWheelModels.Count];
		allWheelColliders = GetComponentsInChildren<RCC_WheelCollider>();

        AudioSource audioSource = RCC_CreateAudioSource.NewAudioSource(gameObject, "Skid Sound AudioSource", 5, 50, 0, null, true, true, false);
        for (int l = 0; l < allWheelColliders.Length; l++)
        {
            for (int i = 0; i < RCC_GroundMaterials.Instance.frictions.Length; i++)
            {
                ParticleSystem.EmissionModule emission;
                GameObject ps = (GameObject)Instantiate(RCC_GroundMaterials.Instance.frictions[i].groundParticles,
                    transform.position, transform.rotation, allWheelColliders[l].transform) as GameObject;
                emission = ps.GetComponent<ParticleSystem>().emission;
                emission.enabled = false;
                ps.transform.localPosition = Vector3.zero;
                ps.transform.localRotation = Quaternion.identity;
                allWheelColliders[l].allWheelParticles.Add(ps.GetComponent<ParticleSystem>());
            }
            allWheelColliders[l].audioSource = audioSource;

            allWheelColliders[l].carController = this;
            allWheelColliders[l].carRigid = GetComponent<Rigidbody>();
            allWheelColliders[l].wheelCollider = GetComponent<WheelCollider>();
            allWheelColliders[l].allWheelColliders.Add(allWheelColliders[0]);
            allWheelColliders[l].allWheelColliders.Add(allWheelColliders[1]);
            allWheelColliders[l].allWheelColliders.Add(allWheelColliders[2]);
            allWheelColliders[l].allWheelColliders.Add(allWheelColliders[3]);
            allWheelColliders[l].allWheelColliders.Remove(allWheelColliders[l]);
        }

        FrontLeftWheelCollider = allWheelColliders[0];
        FrontRightWheelCollider = allWheelColliders[1];
        RearLeftWheelCollider = allWheelColliders[2];
        RearRightWheelCollider = allWheelColliders[3];

    }
	
	void SoundsInitialize (){

		engineSoundOn = RCC_CreateAudioSource.NewAudioSource(gameObject, "Engine Sound On AudioSource", 5, 100, 0, engineClipOn, true, true, false);
		engineSoundOff = RCC_CreateAudioSource.NewAudioSource(gameObject, "Engine Sound Off AudioSource", 5, 100, 0, engineClipOff, true, true, false);
		engineSoundIdle = RCC_CreateAudioSource.NewAudioSource(gameObject, "Engine Sound Idle AudioSource", 5, 100, 0, engineClipIdle, true, true, false);

		reversingSound = RCC_CreateAudioSource.NewAudioSource(gameObject, "Reverse Sound AudioSource", 5, 10, 0, reversingClip, true, false, false);
		windSound = RCC_CreateAudioSource.NewAudioSource(gameObject, "Wind Sound AudioSource", 5, 10, 0, windClip, true, true, false);
		brakeSound = RCC_CreateAudioSource.NewAudioSource(gameObject, "Brake Sound AudioSource", 5, 10, 0, brakeClip, true, true, false);
		if(useTurbo)
			blowSound = RCC_CreateAudioSource.NewAudioSource(gameObject, "NOS Blow", 3f, 10f, 1f, null, false, false, false);
		if(useTurbo){
			turboSound = RCC_CreateAudioSource.NewAudioSource(gameObject, "Turbo Sound AudioSource", .1f, .5f, 0f, turboClip, true, true, false);
			RCC_CreateAudioSource.NewHighPassFilter(turboSound, 10000f, 10);
		}
		
	}
	
	public void KillOrStartEngine (){
		
		if(engineRunning && !engineStarting){
			engineRunning = false;
			fuelInput = 0f;
		}else if(!engineStarting){
			StartCoroutine("StartEngine");
		}
		
	}
	
	public IEnumerator StartEngine (){

		engineRunning = false;
		engineStarting = true;
		engineStartSound = RCC_CreateAudioSource.NewAudioSource(gameObject, "Engine Start AudioSource", 5, 10, 1, engineStartClip, false, true, true);
		if(engineStartSound.isPlaying)
			engineStartSound.Play();
		yield return new WaitForSeconds(1f);
		engineRunning = true;
		fuelInput = 1f;
		yield return new WaitForSeconds(1f);
		engineStarting = false;

	}

	void DamageInit (){

		if (deformableMeshFilters.Length == 0){

			MeshFilter[] allMeshFilters = GetComponentsInChildren<MeshFilter>();
			List <MeshFilter> properMeshFilters = new List<MeshFilter>();

			foreach(MeshFilter mf in allMeshFilters){
				if(!mf.transform.IsChildOf(FrontLeftWheelTransform) && !mf.transform.IsChildOf(FrontRightWheelTransform) && !mf.transform.IsChildOf(RearLeftWheelTransform) && !mf.transform.IsChildOf(RearRightWheelTransform))
					properMeshFilters.Add(mf);
			}

			deformableMeshFilters = properMeshFilters.ToArray();

		}
		
		LoadOriginalMeshData();
		
		if(contactSparkle){
			
			for(int i = 0; i < maximumContactSparkle; i++){
				GameObject sparks = (GameObject)Instantiate(contactSparkle, transform.position, Quaternion.identity) as GameObject;
				sparks.transform.SetParent(allContactParticles.transform);
				contactSparkeList.Add(sparks.GetComponent<ParticleSystem>());
				ParticleSystem.EmissionModule em = sparks.GetComponent<ParticleSystem>().emission;
				em.enabled = false;
			}
			
		}

	}

	void LoadOriginalMeshData(){

		originalMeshData = new originalMeshVerts[deformableMeshFilters.Length];

		for (int i = 0; i < deformableMeshFilters.Length; i++){
			originalMeshData[i].meshVerts = deformableMeshFilters[i].mesh.vertices;
		}

	}

	void Damage(){

		if (!sleep && repairNow){
			
			int k;
			sleep = true;

			for(k = 0; k < deformableMeshFilters.Length; k++){

				Vector3[] vertices = deformableMeshFilters[k].mesh.vertices;

				if(originalMeshData==null)
					LoadOriginalMeshData();

				for (int i = 0; i < vertices.Length; i++){

					vertices[i] += (originalMeshData[k].meshVerts[i] - vertices[i]) * (Time.deltaTime * 2f);
					if((originalMeshData[k].meshVerts[i] - vertices[i]).magnitude >= minimumVertDistanceForDamagedMesh)
						sleep = false;

				}

				deformableMeshFilters[k].mesh.vertices=vertices;
				deformableMeshFilters[k].mesh.RecalculateNormals();
				deformableMeshFilters[k].mesh.RecalculateBounds();

			}
			
			if(sleep)
				repairNow = false;
			
		}

	}

	void DeformMesh(Mesh mesh, Vector3[] originalMesh, Collision collision, float cos, Transform meshTransform, Quaternion rot){
		
		Vector3[] vertices = mesh.vertices;
		
		foreach (ContactPoint contact in collision.contacts){
			
			Vector3 point = meshTransform.InverseTransformPoint(contact.point);
			 
			for (int i = 0; i < vertices.Length; i++){

				if ((point - vertices[i]).magnitude < damageRadius){
					vertices[i] += rot * ((localVector * (damageRadius - (point - vertices[i]).magnitude) / damageRadius) * cos + (UnityEngine.Random.onUnitSphere * (randomizeVertices / 500f)));
					if (maximumDamage > 0 && ((vertices[i] - originalMesh[i]).magnitude) > maximumDamage){
						vertices[i] = originalMesh[i] + (vertices[i] - originalMesh[i]).normalized * (maximumDamage);
					}
				}
					
			}
			
		}
		
		mesh.vertices = vertices;
		//mesh.RecalculateNormals();
		mesh.RecalculateBounds();
		mesh.Optimize();
		
	}

	void CollisionParticles(Vector3 contactPoint){
		
		for(int i = 0; i < contactSparkeList.Count; i++){
			if(contactSparkeList[i].isPlaying)
				return;
			contactSparkeList[i].transform.position = contactPoint;
			ParticleSystem.EmissionModule em = contactSparkeList[i].emission;
			em.enabled = true;
			contactSparkeList[i].Play();
		}
		
	}

    public float BotGas = 0;
    public float BotSteer = 0;
    public bool BotHandbrake = false;

    void Update (){
		if(canControl){
            RCCSettings.behaviorType = RCC_Settings.BehaviorType.SemiArcade;
            if (!AIController)
				Inputs();
            GearBox();
		}
        else if(!AIController){
//			_gasInput = 0f;
//			brakeInput = 0f;
//			boostInput = 1f;
//			handbrakeInput = 1f;
		}

        if(!canControl)
        {
            RCCSettings.behaviorType = RCC_Settings.BehaviorType.Simulator;
            gasInput = BotGas/2;
            brakeInput = Mathf.Clamp01(-BotGas);
            handbrakeInput = BotHandbrake ? 1f : 0f;
            steerInput = BotSteer;
            GearBox();
        }


		Turbo();
		Sounds();

        if (useDamage && !BotCar.enabled)
        {
            if (!allContactParticles.activeSelf) allContactParticles.SetActive(true);
            Damage();
        }
        else
        {
            if (allContactParticles.activeSelf) allContactParticles.SetActive(false);
        }

		indicatorTimer += Time.deltaTime;
		
	}

	void Inputs(){
		
		switch(RCCSettings.controllerType)
        {
		case RCC_Settings.ControllerType.Keyboard:
			
			gasInput = Input.GetAxis(RCCSettings.verticalInput);
			brakeInput = Mathf.Clamp01(-Input.GetAxis(RCCSettings.verticalInput));
			handbrakeInput = Input.GetKey(RCCSettings.handbrakeKB) ? 1f : 0f;
			steerInput = Input.GetAxis(RCCSettings.horizontalInput);
			//boostInput = Input.GetKey(RCCSettings.boostKB) ? 2.5f : 1f;

			//if(Input.GetKeyDown(RCCSettings.lowBeamHeadlightsKB)){
			//	lowBeamHeadLightsOn = !lowBeamHeadLightsOn;
			//}

			//if(Input.GetKeyDown(RCCSettings.highBeamHeadlightsKB)){
			//	highBeamHeadLightsOn = true;
			//}else if(Input.GetKeyUp(RCCSettings.highBeamHeadlightsKB)){
			//	highBeamHeadLightsOn = false;
			//}

			if(Input.GetKeyDown(RCCSettings.startEngineKB))
				KillOrStartEngine();
			break;
		}
	}
	
	void FixedUpdate (){
		
		Engine();
		Braking();
		RevLimiter();
		ApplySteering(FrontLeftWheelCollider);
		ApplySteering(FrontRightWheelCollider);

		if(RCCSettings.behaviorType == RCC_Settings.BehaviorType.Drift){

			if(RearLeftWheelCollider.isGrounded){
				rigid.angularVelocity = new Vector3(rigid.angularVelocity.x, rigid.angularVelocity.y + (direction * steerInput / 30f), rigid.angularVelocity.z);
			}

		}

		if(RCCSettings.behaviorType == RCC_Settings.BehaviorType.SemiArcade || RCCSettings.behaviorType == RCC_Settings.BehaviorType.Fun){

			if(RearLeftWheelCollider.isGrounded){
				rigid.angularVelocity = new Vector3(rigid.angularVelocity.x, ((direction * (steerInput * Mathf.Lerp(0f, 2f, speed / 20f)))), rigid.angularVelocity.z);
			}

		}
			
		//rigid.angularVelocity = new Vector3(rigid.angularVelocity.x, Mathf.Lerp(rigid.angularVelocity.y, ((direction * (steerInput * 2f))), Time.fixedDeltaTime * 10f), rigid.angularVelocity.z);

	}
	
	void Engine (){
        //Speed.
        speed = rigid.velocity.magnitude * 3.6f;

		//Steer Limit.
		steerAngle = Mathf.Lerp(orgSteerAngle, highspeedsteerAngle, (speed / highspeedsteerAngleAtspeed));

		//Driver SteeringWheel Transform.
		if(SteeringWheel)
			SteeringWheel.transform.rotation = transform.rotation * Quaternion.Euler(20, 0, (FrontLeftWheelCollider.steerAngle) * -6);

		if(rigid.velocity.magnitude < .01f && Mathf.Abs(steerInput) < .01f && Mathf.Abs(_gasInput) < .01f && Mathf.Abs(rigid.angularVelocity.magnitude) < .01f)
			sleepingRigid = true;
		else
			sleepingRigid = false;
		
		rawEngineRPM = Mathf.Clamp(Mathf.MoveTowards(rawEngineRPM, 
		                                             (maxEngineRPM * 1.1f) * 
			(Mathf.Clamp01(Mathf.Lerp(0f, 1f, (1f - clutchInput) * ((((RearLeftWheelCollider.wheelRPMToSpeed + RearRightWheelCollider.wheelRPMToSpeed) * direction) / 2f) / gearSpeed[currentGear])) + (((_gasInput) * clutchInput) + idleInput) * fuelInput))
		                                             , engineInertia * 100f), 0f, maxEngineRPM * 1.1f);

		engineRPM = Mathf.Lerp(engineRPM, rawEngineRPM, Mathf.Lerp(Time.fixedDeltaTime * 5f, Time.fixedDeltaTime * 50f, rawEngineRPM / maxEngineRPM));
		
		//Auto Reverse Bool.
		if(autoReverse)
        {
			canGoReverseNow = true;
		}
        else
        {
			if(_brakeInput < .1f && speed < 5)
				canGoReverseNow = true;
			else if(_brakeInput > 0 && transform.InverseTransformDirection(rigid.velocity).z > 1f)
				canGoReverseNow = false;
		}

        #region Wheel Type Motor Torque.

        //Applying WheelCollider Motor Torques Depends On Wheel Type Choice.
        switch (_wheelTypeChoise){
			
		case WheelType.FWD:
			ApplyMotorTorque(FrontLeftWheelCollider, engineTorque);
			ApplyMotorTorque(FrontRightWheelCollider, engineTorque);
			break;
		case WheelType.RWD:
			ApplyMotorTorque(RearLeftWheelCollider, engineTorque);
			ApplyMotorTorque(RearRightWheelCollider, engineTorque);
			break;
		case WheelType.AWD:
			ApplyMotorTorque(FrontLeftWheelCollider, engineTorque / 2f);
			ApplyMotorTorque(FrontRightWheelCollider, engineTorque / 2f);
			ApplyMotorTorque(RearLeftWheelCollider, engineTorque / 2f);
			ApplyMotorTorque(RearRightWheelCollider, engineTorque / 2f);
			break;
		}

		if(ExtraRearWheelsCollider.Length > 0 && applyEngineTorqueToExtraRearWheelColliders){

			for(int i = 0; i < ExtraRearWheelsCollider.Length; i++){
				ApplyMotorTorque(ExtraRearWheelsCollider[i], engineTorque);
			}

		}
		
		#endregion Wheel Type
		
	}

	void Sounds(){

		windSound.volume = Mathf.Lerp (0f, RCCSettings.maxWindSoundVolume, speed / 300f);
		windSound.pitch = UnityEngine.Random.Range(.9f, 1f);
		
		if(direction == 1)
			brakeSound.volume = Mathf.Lerp (0f, RCCSettings.maxBrakeSoundVolume, Mathf.Clamp01((FrontLeftWheelCollider.wheelCollider.brakeTorque + FrontRightWheelCollider.wheelCollider.brakeTorque) / (brake * 2f)) * Mathf.Lerp(0f, 1f, FrontLeftWheelCollider.rpm / 50f));
		else
			brakeSound.volume = 0f;

	}

	void ApplyMotorTorque(RCC_WheelCollider wc, float torque){

		if(TCS){

			WheelHit hit;
			wc.wheelCollider.GetGroundHit(out hit);

			if(Mathf.Abs(wc.rpm) >= 100){
				if(hit.forwardSlip > .25f){
					TCSAct = true;
					torque -= Mathf.Clamp(torque * (hit.forwardSlip) * TCSStrength, 0f, engineTorque);
				}else{
					TCSAct = false;
					torque += Mathf.Clamp(torque * (hit.forwardSlip) * TCSStrength, -engineTorque, 0f);
				}
			}else{
				TCSAct = false;
			}
			
		}

		if(OverTorque())
			torque = 0;

		wc.wheelCollider.motorTorque = ((torque * (1 - clutchInput) * _boostInput) * _gasInput) * (engineTorqueCurve[currentGear].Evaluate(wc.wheelRPMToSpeed * direction) * direction);

		ApplyEngineSound(wc.wheelCollider.motorTorque);
		
	}

	void ApplyBrakeTorque(RCC_WheelCollider wc, float brake){

		if(ABS && handbrakeInput <= .1f){

			WheelHit hit;
			wc.wheelCollider.GetGroundHit(out hit);

			if((Mathf.Abs(hit.forwardSlip) * Mathf.Clamp01(brake)) >= ABSThreshold){
				ABSAct = true;
				brake = 0;
			}else{
				ABSAct = false;
			}

		}
		wc.wheelCollider.brakeTorque = brake;
    }

	void ApplySteering(RCC_WheelCollider wc){

		if(applyCounterSteering)
			wc.wheelCollider.steerAngle = Mathf.Clamp((steerAngle * (steerInput + driftAngle)), -steerAngle, steerAngle);
		else
			wc.wheelCollider.steerAngle = Mathf.Clamp((steerAngle * steerInput), -steerAngle, steerAngle);

	}

	void ApplyEngineSound(float input){

		if(!engineRunning){

			engineSoundOn.pitch = Mathf.Lerp ( engineSoundOn.pitch, 0, Time.deltaTime * 50f);
			engineSoundOff.pitch = Mathf.Lerp ( engineSoundOff.pitch, 0, Time.deltaTime * 50f);
			engineSoundIdle.pitch = Mathf.Lerp ( engineSoundOff.pitch, 0, Time.deltaTime * 50f);

			if(engineSoundOn.pitch <= .1f && engineSoundOff.pitch <= .1f && engineSoundIdle.pitch <= .1f){
				engineSoundOn.Stop();
				engineSoundOff.Stop();
				engineSoundIdle.Stop();
				return;
			}

		}else{
				
			if(!engineSoundOn.isPlaying)
				engineSoundOn.Play();
			if(!engineSoundOff.isPlaying)
				engineSoundOff.Play();
			if(!engineSoundIdle.isPlaying)
				engineSoundIdle.Play();

		}

		if(engineSoundOn){

			engineSoundOn.volume = _gasInput;
			engineSoundOn.pitch = Mathf.Lerp ( engineSoundOn.pitch, Mathf.Lerp (minEngineSoundPitch, maxEngineSoundPitch, engineRPM / 7000f), Time.deltaTime * 50f);
					
		}
		
		if(engineSoundOff){

			engineSoundOff.volume = (1 - _gasInput) - engineSoundIdle.volume;
			engineSoundOff.pitch = Mathf.Lerp ( engineSoundOff.pitch, Mathf.Lerp (minEngineSoundPitch, maxEngineSoundPitch, (engineRPM) / (7000f)), Time.deltaTime * 50f);

		}

		if(engineSoundIdle){

			engineSoundIdle.volume = Mathf.Lerp(1f, 0f, engineRPM / (maxEngineRPM / 2f));
			engineSoundIdle.pitch = Mathf.Lerp ( engineSoundIdle.pitch, Mathf.Lerp (minEngineSoundPitch, maxEngineSoundPitch, (engineRPM) / (7000f)), Time.deltaTime * 50f);

		}

	}
	
	void Braking (){

		//Handbrake
		if(handbrakeInput > .1f){
			
			ApplyBrakeTorque(RearLeftWheelCollider, (brake * 1.5f) * handbrakeInput);
			ApplyBrakeTorque(RearRightWheelCollider, (brake * 1.5f) * handbrakeInput);
			
		}else{
			
			// Braking.
			ApplyBrakeTorque(FrontLeftWheelCollider, brake * (Mathf.Clamp(_brakeInput, 0, 1)));
			ApplyBrakeTorque(FrontRightWheelCollider, brake * (Mathf.Clamp(_brakeInput, 0, 1)));
			ApplyBrakeTorque(RearLeftWheelCollider, brake * Mathf.Clamp(_brakeInput, 0, 1) / 2f);
			ApplyBrakeTorque(RearRightWheelCollider, brake * Mathf.Clamp(_brakeInput, 0, 1) / 2f);
			
		}
		
	}

	void GearBox (){

		if(engineRunning)
			idleInput = Mathf.Lerp(1f, 0f, engineRPM / minEngineRPM);
		else
			idleInput = 0f;

        //Reversing Bool.
        if (!AIController)
        {
            if (brakeInput > .9f && transform.InverseTransformDirection(rigid.velocity).z < 1f && canGoReverseNow && !changingGear && direction != -1)
                StartCoroutine("ChangingGear", -1);
            else if (brakeInput < .1f && transform.InverseTransformDirection(rigid.velocity).z > -1f && direction == -1 && !changingGear)
                StartCoroutine("ChangingGear", 0);
        }

        if (currentGear < totalGears - 1 && !changingGear){
				if(speed >= (gearSpeed[currentGear] * .7f) && FrontLeftWheelCollider.rpm > 0){
					StartCoroutine("ChangingGear", currentGear + 1);
				}
			}
			
			if(currentGear > 0){

				if(!changingGear){

					if(speed < (gearSpeed[currentGear - 1] * .5f) && direction != -1){
						StartCoroutine("ChangingGear", currentGear - 1);
					}

				}

			}

		if(direction == -1){
			if(!reversingSound.isPlaying)
				reversingSound.Play();
			reversingSound.volume = Mathf.Lerp(0f, 1f, speed / 60f);
			reversingSound.pitch = reversingSound.volume;
		}else{
			if(reversingSound.isPlaying)
				reversingSound.Stop();
			reversingSound.volume = 0f;
			reversingSound.pitch = 0f;
		}
		
	}
	
	internal IEnumerator ChangingGear(int gear){
		changingGear = true;

		if(RCCSettings.useTelemetry)
			print ("Shifted to: " + (gear).ToString()); 

		if(gearShiftingClips.Length > 0){
			gearShiftingSound = RCC_CreateAudioSource.NewAudioSource(gameObject, "Gear Shifting AudioSource", 5, 5, RCCSettings.maxGearShiftingSoundVolume, gearShiftingClips[UnityEngine.Random.Range(0, gearShiftingClips.Length)], false, true, true);
			if(!gearShiftingSound.isPlaying)
				gearShiftingSound.Play();
		}
		
		yield return new WaitForSeconds(gearShiftingDelay);

		if(gear == -1){
			currentGear = 0;
			direction = -1;
		}else{
			currentGear = gear;
			direction = 1;
		}

		changingGear = false;

	}

	void RevLimiter(){

		if((useRevLimiter && engineRPM >= maxEngineRPM * 1.05f))
			cutGas = true;
		else if(engineRPM < maxEngineRPM)
			cutGas = false;
		
	}

	void Turbo(){

		if(!useTurbo)
			return;

		turboBoost = Mathf.Lerp(turboBoost, Mathf.Clamp(Mathf.Pow(_gasInput, 10) * 30f + Mathf.Pow(engineRPM / maxEngineRPM, 10) * 30f, 0f, 30f), Time.deltaTime * 10f);

		if(turboBoost >= 25f){
			if(turboBoost < (turboSound.volume * 30f)){
				if(!blowSound.isPlaying && !BotCar.enabled){
					blowSound.clip = RCCSettings.blowoutClip[UnityEngine.Random.Range(0, RCCSettings.blowoutClip.Length)];
					blowSound.Play();
				}
			}
		}

		turboSound.volume = Mathf.Lerp(turboSound.volume, turboBoost / 30f, Time.deltaTime * 5f);
		turboSound.pitch = Mathf.Lerp(Mathf.Clamp(turboSound.pitch, 2f, 3f), (turboBoost / 30f) * 2f, Time.deltaTime * 5f);
	}
	
	void OnCollisionEnter (Collision collision)
    {
        if (!collision.transform.root.GetComponent<Man>())
        {
            if (collision.contacts.Length < 1 || collision.relativeVelocity.magnitude < minimumCollisionForce)
                return;

            if (crashClips.Length > 0)
            {
                if (collision.contacts[0].thisCollider.gameObject.transform != transform.parent)
                {
                    crashSound = RCC_CreateAudioSource.NewAudioSource(gameObject, "Crash Sound AudioSource", 5, 20, RCCSettings.maxCrashSoundVolume, crashClips[UnityEngine.Random.Range(0, crashClips.Length)], false, true, true);
                    if (!crashSound.isPlaying)
                        crashSound.Play();
                }
            }

            if (useDamage)
            {

                CollisionParticles(collision.contacts[0].point);

                Vector3 colRelVel = collision.relativeVelocity;
                colRelVel *= 1f - Mathf.Abs(Vector3.Dot(transform.up, collision.contacts[0].normal));

                float cos = Mathf.Abs(Vector3.Dot(collision.contacts[0].normal, colRelVel.normalized));

                if (colRelVel.magnitude * cos >= minimumCollisionForce)
                {

                    sleep = false;

                    localVector = transform.InverseTransformDirection(colRelVel) * (damageMultiplier / 50f);

                    if (originalMeshData == null)
                        LoadOriginalMeshData();

                    for (int i = 0; i < deformableMeshFilters.Length; i++)
                    {
                        DeformMesh(deformableMeshFilters[i].mesh, originalMeshData[i].meshVerts, collision, cos, deformableMeshFilters[i].transform, rot);
                    }
                }
            }
        }
	}

	bool OverTorque(){
		if(speed > maxspeed || !engineRunning)
			return true;
		return false;
	}
    
    public void DestroyWheels()
    {
        allAudioSources.SetActive(false);
        allContactParticles.SetActive(false);

        FrontLeftWheelTransform.gameObject.SetActive(false);
        FrontRightWheelTransform.gameObject.SetActive(false);
        RearLeftWheelTransform.gameObject.SetActive(false);
        RearRightWheelTransform.gameObject.SetActive(false);
        FrontLeftWheelCollider.gameObject.SetActive(false);
        FrontRightWheelCollider.gameObject.SetActive(false);
        RearLeftWheelCollider.gameObject.SetActive(false);
        RearRightWheelCollider.gameObject.SetActive(false);
    }
} 
