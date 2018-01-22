#pragma strict

	
	var  sound : boolean = true;
	var sound_engine : AudioSource;
	var sound_engine_start : AudioClip;
	var sound_engine_stop : AudioClip;
	var sound_gear : AudioClip;
	var  engineSpume : Transform;
	var  engineSpume1 : Transform;
	var  mass : float= 3000.0f;
	var  motorForce : float = 10000.0f;
	var  rudderSensivity : int = 45;
	var  angularDrag : float = 0.8f;
	var  cogY : float= -0.5f;
	var  volume : int= 9000;
	var  size : Vector3= new Vector3(3,3,6);
	private var drag : Vector3 = new Vector3(6.0f,4.0f,0.2f);
	private var rpmPitch : float = 0.0f;
	public var waterSurface : sc_water_surface;
	
	
	private var body : Transform;
	private var controller : Transform ;
	private var vehicle_sc : sc_vehicle;
    private var game_sc : sc_game;
    public var engine_start : boolean;
var mesh_collider : MeshCollider[];
	function Start () {

		if(!GetComponent.<Rigidbody>()){
			gameObject.AddComponent(Rigidbody);
		}
		GetComponent.<Rigidbody>().mass = mass;
		GetComponent.<Rigidbody>().drag = 0.1f;
		GetComponent.<Rigidbody>().angularDrag = angularDrag;
		GetComponent.<Rigidbody>().centerOfMass = new Vector3(0, cogY, 0);
		GetComponent.<Rigidbody>().interpolation = RigidbodyInterpolation.Interpolate;
		
		//start engine noise

		
		
vehicle_sc=GetComponent(sc_vehicle);
game_sc=vehicle_sc.game_sc;
if(!game_sc)game_sc=GameObject.Find("Game").GetComponent(sc_game);
body=transform.FindChild("body");
controller=transform.FindChild("controller");
if(sound)sound_engine=gameObject.AddComponent(AudioSource);

if(mesh_collider.Length==1)
	mesh_collider[0].isTrigger=false;
	else{
	for(var i = 0; i < mesh_collider.Length; i++) {mesh_collider[i].isTrigger=false;}
	}//else
	}
	
function  FixedUpdate (){
if(engine_start){
if(sound_engine&&!sound_engine.isPlaying){
sound_engine.clip = sound_gear;
sound_engine.loop = true;
sound_engine.Play();
vehicle_sc.engine_work=true;
engine_start=false;}
else if(!sound){
vehicle_sc.engine_work=true;
engine_start=false;}
}//engine_start
	
		if(waterSurface==null)
			return;
	
		var motor : float = 0.0f;
		var steer : float= 0.0f;
		
		if(vehicle_sc.engine_work){
		 vehicle_sc.throttle=Mathf.Clamp(vehicle_sc.throttle,-1.0f,1.0f);
         vehicle_sc.steer=Mathf.Clamp(vehicle_sc.steer,-1.0f,1.0f);
         steer = vehicle_sc.steer;
         motor = vehicle_sc.throttle;
		}
	
		//Get water level and percent under water
		var waterLevel : float= waterSurface.GetComponent.<Collider>().bounds.max.y;
		var distanceFromWaterLevel : float= transform.position.y-waterLevel;
		var percentUnderWater : float= Mathf.Clamp01((-distanceFromWaterLevel + 0.5f*size.y)/size.y);
	
	
		//BUOYANCY (the force which keeps the boat floating above water)
		//_______________________________________________________________________________________________________
		
		//the point the buoyancy force is applied onto is calculated based 
		//on the boat's picth and roll, so it will always tilt upwards:
		var buoyancyPos : Vector3  = new Vector3();
		buoyancyPos = transform.TransformPoint(-new Vector3(transform.right.y*size.x*0.5f,0,transform.forward.y*size.z*0.5f));
		
		//then it is shifted arcording to the current waves
		buoyancyPos.x += waterSurface.waveXMotion1 * Mathf.Sin(waterSurface.waveFreq1 * Time.time)
					+waterSurface.waveXMotion2 * Mathf.Sin(waterSurface.waveFreq2 * Time.time)
					+waterSurface.waveXMotion3 * Mathf.Sin(waterSurface.waveFreq3 * Time.time);
		buoyancyPos.z += waterSurface.waveYMotion1 * Mathf.Sin(waterSurface.waveFreq1 * Time.time)
					+waterSurface.waveYMotion2 * Mathf.Sin(waterSurface.waveFreq2 * Time.time)
					+waterSurface.waveYMotion3 * Mathf.Sin(waterSurface.waveFreq3 * Time.time);
		
		//apply the force
		GetComponent.<Rigidbody>().AddForceAtPosition(- volume * percentUnderWater * Physics.gravity, buoyancyPos);
		
		//ENGINE
		//_______________________________________________________________________________________________________
		
		//calculate propeller position
		var propellerPos : Vector3  = new Vector3(0,-size.y*0.5f,-size.z*0.5f);
		var propellerPosGlobal : Vector3  = transform.TransformPoint(propellerPos);
		
		//apply force only if propeller is under water
		if(propellerPosGlobal.y<waterLevel)
		{
			//direction propeller force is pointing to.
			//mostly forward, rotated a bit according to steering angle
			var steeringAngle : float  = steer * rudderSensivity/100 * Mathf.Deg2Rad;
			var propellerDir : Vector3  = transform.forward*Mathf.Cos(steeringAngle) - transform.right*Mathf.Sin(steeringAngle);
			
			//apply propeller force
			GetComponent.<Rigidbody>().AddForceAtPosition(propellerDir * motorForce * motor , propellerPosGlobal);//
			
			//create particles for propeller
			if(engineSpume!=null)
			{
				engineSpume.GetComponent.<ParticleEmitter>().minEmission = Mathf.Abs(motor);
				engineSpume.GetComponent.<ParticleEmitter>().maxEmission = Mathf.Abs(motor);
				engineSpume.GetComponent.<ParticleEmitter>().Emit();				
			}
			if(engineSpume1!=null){
				engineSpume1.GetComponent.<ParticleEmitter>().minEmission = Mathf.Abs(motor);
				engineSpume1.GetComponent.<ParticleEmitter>().maxEmission = Mathf.Abs(motor);
				engineSpume1.GetComponent.<ParticleEmitter>().Emit();	}
		}
		
		//DRAG
		//_______________________________________________________________________________________________________
		
		//calculate drag force
		var dragDirection : Vector3  = transform.InverseTransformDirection(GetComponent.<Rigidbody>().velocity);
		var dragForces : Vector3  = - Vector3.Scale(dragDirection,drag);
		
		//depth of the boat under water (used to find attack point for drag force)
		var depth : float  = Mathf.Abs(transform.forward.y)*size.z*0.5f+Mathf.Abs(transform.up.y)*size.y*0.5f;
		
		//apply force
		var dragAttackPosition : Vector3  = new Vector3(transform.position.x,waterLevel-depth,transform.position.z);
		GetComponent.<Rigidbody>().AddForceAtPosition(transform.TransformDirection(dragForces)*GetComponent.<Rigidbody>().velocity.magnitude*(1+percentUnderWater*(waterSurface.waterDragFactor-1)),dragAttackPosition);
		
		//linear drag (linear to velocity, for low speed movement)
		GetComponent.<Rigidbody>().AddForce(transform.TransformDirection(dragForces)*500);
		
		//rudder torque for steering (square to velocity)
		var forwardVelo : float  = Vector3.Dot(GetComponent.<Rigidbody>().velocity,transform.forward);
		if(motor<0)steer*=-1;
		GetComponent.<Rigidbody>().AddTorque(transform.up*forwardVelo*forwardVelo*rudderSensivity*steer);	
		
		//SOUND
		//_______________________________________________________________________________________________________
		if(sound_engine&&vehicle_sc.engine_work){
		sound_engine.volume = 0.3f + Mathf.Abs(motor);
		rpmPitch=Mathf.Lerp(rpmPitch,Mathf.Abs(motor),Time.deltaTime*0.4f);
		sound_engine.pitch = 0.3f + 0.7f * rpmPitch;}
	
		//reset water surface, so we have to stay in contact for boat physics.
		waterSurface = null; 
	}
	
	//Check if we inside water area
	function OnTriggerStay(col : Collider ){
		if(col.GetComponent(sc_water_surface)!=null)
			waterSurface=col.GetComponent(sc_water_surface);
	}
	
function OnCollisionEnter (collision : Collision) {
if(collision&&collision.contacts.Length > 0){
var temp_magnitude : float=collision.relativeVelocity.magnitude;
if(temp_magnitude > 5){
if(vehicle_sc.health_bar)vehicle_sc.Damage(temp_magnitude*5,null);
AudioSource.PlayClipAtPoint(game_sc.sound_car_crush[Random.Range(0,game_sc.sound_car_crush.Length)],collision.contacts[0].point,temp_magnitude*0.02);
//rigidbody.AddForce(Vector3.down*temp_magnitude*10000);
}//magnitude
}//colision
}//OnCollisionEnter
	
	function StopVehicle(index : float){
vehicle_sc.throttle=0;

}//StopVehicle
	
	function EngineStart(){
engine_start=true;
if(sound_engine){
sound_engine.clip = sound_engine_start;
sound_engine.loop = false;
sound_engine.volume=1;
sound_engine.Play();}
}//EngineStart

function EngineWork(){
if(sound_engine){
sound_engine.clip = sound_gear;
sound_engine.loop = true;
sound_engine.Play();}
vehicle_sc.engine_work=true;
engine_start=false;
vehicle_sc.throttle=1;
GetComponent.<Rigidbody>().velocity=transform.TransformDirection(Vector3.forward*vehicle_sc.limit_speed/4);
}//EngineWork

function EngineStop(){
engine_start=false;
vehicle_sc.engine_work=false;
if(sound_engine){
sound_engine.loop = false;
sound_engine.pitch=1;
sound_engine.clip = sound_engine_stop;
sound_engine.Play();}
}//EngineStart


