#pragma strict

import UnityEngine;
import System.Collections;

    // every wheel has a wheeldata struct, contains useful wheel specific info
    class WheelData1{
        var transform : Transform ;
        var go : GameObject;
       var  col : WheelCollider ;
        var startPos : Vector3 ;
       var  rotation : float  = 0.0f;
       var  maxSteer : float ;
       var  motor : boolean ;
       var  curY : float  = 0.0f;
    };

var wheelFR : Transform ; // connect to Front Right Wheel transform
var wheelFL : Transform ; // connect to Front Left Wheel transform
var wheelBR : Transform ; // connect to Back Right Wheel transform
var wheelBL : Transform ; // connect to Back Left Wheel transform
var carSteer : Transform ;

var sound_engine : AudioSource;
var audio_skid : AudioSource;
var sound_engine_start : AudioClip;
var sound_engine_stop : AudioClip;
var sound_gear : AudioClip;
var color_detal : Transform[] ;

    private var body : Transform;
	private var controller : Transform ;
	private var vehicle_sc : sc_vehicle;
    private var game_sc : sc_game;
    public var engine_start : boolean;
    public var real_torque : float;

	var suspensionDistance : float  = 0.5f; // amount of movement in suspension
    var springs : float  = 7000.0f; // suspension springs
    var dampers : float  = 10f; // how much damping the suspension has
    var AutomaticWheelRadius : boolean  = true;
    var wheelRadius : float  = 0.25f; // the radius of the wheels
    var torque : float  = 100f; // the base power of the engine (per wheel, and before gears)
    var brakeTorque : float  = 1000f; // the power of the braks (per wheel)
    var wheelWeight : float  = 3f; // the weight of a wheel
    var shiftCentre : Vector3  = new Vector3(0.0f, -0.8f, 0.0f); // offset of centre of mass

    var maxSteerAngle : float  = 25.0f; // max angle of steering wheels
    var wheelDrive : JWheelDrive  = JWheelDrive.Front; // which wheels are powered

    var shiftDownRPM : float  = 1500.0f; // rpm script will shift gear down
    var shiftUpRPM : float  = 4000.0f; // rpm script will shift gear up
    var idleRPM : float  = 700.0f; // idle rpm

    var stiffness : float  = 0.1f; // for wheels, determines slip

    // gear ratios (index 0 is reverse)
     var gears : float[];

    // automatic, if true car shifts automatically up/down
    var automatic :  boolean  = true;

    // table of efficiency at certain RPM, in tableStep RPM increases, 1.0f is 100% efficient
    // at the given RPM, current table has 100% at around 2000RPM
     var efficiencyTable : float[];

    // the scale of the indices in table, so with 250f, 750RPM translates to efficiencyTable[3].
    var efficiencyTableStep :float  = 250.0f;




    private var shiftDelay : float  = 0.0f;

     var  currentGear : int  = 1; // duh.
     var  motorRPM : float  = 0.0f;
     var  speed : float ;


    private var wantedRPM : float  = 0.0f; // rpm the engine tries to reach
    private var curRotation : float ;
    private var brackF : float  = 0.0f;
private var temp_steer : float;



    var wheels :WheelData1[] ; // array with the wheel data



    // Use this for initialization
    function Start(){
    		//rigidbody.sleepVelocity=1;
		GetComponent.<Rigidbody>().maxAngularVelocity = 2f;
		GetComponent.<Rigidbody>().useConeFriction = false;

vehicle_sc=GetComponent(sc_vehicle);
game_sc=vehicle_sc.game_sc;
if(!game_sc)game_sc=GameObject.Find("Game").GetComponent(sc_game);
body=transform.FindChild("body");
controller=transform.FindChild("controller");

if(color_detal.Length>0&&game_sc.car_colorran==1){
var temp_color : Color=game_sc.car_color[Random.Range(0,game_sc.car_color.Length)];
for(_detal in color_detal){_detal.GetComponent.<Renderer>().material.color=temp_color;}}
if(game_sc.car_damage==1&&GetComponent(CarDamage))GetComponent(CarDamage).enabled=true;

sound_engine=gameObject.AddComponent(AudioSource);
audio_skid=controller.gameObject.AddComponent(AudioSource);
audio_skid.clip = game_sc.sound_skid;
audio_skid.loop = true;
audio_skid.volume=0.3f;

/*
    gears=new float[6];
    gears[0]=-10f;
    gears[1]=9f;
    gears[2]=6f;
    gears[3]=4.5f;
    gears[4]= 3f;
    gears[5]= 2.5f;
    //max_gear=gears.Length;
    
    efficiencyTable=new float[22];
    efficiencyTable[0]=0.6f;
    efficiencyTable[1]=0.65f;
    efficiencyTable[2]=0.7f;
    efficiencyTable[3]=0.75f;
    efficiencyTable[4]=0.8f ;
    efficiencyTable[5]=0.85f ;
    efficiencyTable[6]=0.9f;
    efficiencyTable[7]=1.0f;
    efficiencyTable[8]=1.0f;
    efficiencyTable[9]=0.95f;
    efficiencyTable[10]=0.80f;
    efficiencyTable[11]=0.70f;
    efficiencyTable[12]=0.60f;
    efficiencyTable[13]=0.5f;
    efficiencyTable[14]=0.45f;
    efficiencyTable[15]=0.40f;
    efficiencyTable[16]=0.36f ;
    efficiencyTable[17]=0.33f;
    efficiencyTable[18]=0.30f;
    efficiencyTable[19]=0.20f;
    efficiencyTable[20]= 0.10f ;
    efficiencyTable[21]=0.05f;
    */
    	audio_skid.loop = true;
		wheels = new WheelData1[4];


        // setup wheels
        var frontDrive : boolean  = (wheelDrive == JWheelDrive.Front) || (wheelDrive == JWheelDrive.All);
        var backDrive : boolean= (wheelDrive == JWheelDrive.Back) || (wheelDrive == JWheelDrive.All);

        wheels[0] = SetWheelParams(wheelFR, maxSteerAngle, frontDrive, wheelFR.localPosition.y);
        wheels[1] = SetWheelParams(wheelFL, maxSteerAngle, frontDrive, wheelFL.localPosition.y);
        wheels[2] = SetWheelParams(wheelBR, 0.0f, backDrive, wheelBR.localPosition.y);
        wheels[3] = SetWheelParams(wheelBL, 0.0f, backDrive, wheelBL.localPosition.y);

Invoke("LoadFriction",0.2f);

    }//start


function Update(){
if(engine_start){
if(!sound_engine.isPlaying){
sound_engine.clip = sound_gear;
sound_engine.loop = true;
sound_engine.Play();
vehicle_sc.engine_work=true;
engine_start=false;}
}//engine_start
		SkidAudio(wheels[0].col);

        speed = GetComponent.<Rigidbody>().velocity.magnitude * 3.6f;


    }//Update
    
function OnCollisionEnter (collision : Collision) {
if(collision.relativeVelocity.sqrMagnitude>100&&
GetComponent(sc_car_cop)&&vehicle_sc.place[0].man&&vehicle_sc.place[0].man.GetComponent(sc_man).cop&&
collision.transform.root.GetComponent(sc_vehicle)&&collision.transform.root.GetComponent(sc_vehicle).place[0].man&&
collision.transform.root.GetComponent(sc_vehicle).place[0].man.GetComponent(sc_man).player&&
!collision.transform.root.GetComponent(sc_vehicle).place[0].man.GetComponent(sc_man).danger){
collision.transform.root.GetComponent(sc_vehicle).place[0].man.GetComponent(sc_man).Danger();
}//sc_car_cop
Hit(collision);
}//OnCollisionEnter
function OnCollisionStay (collision : Collision) {
if (collision.contacts.Length > 0 && collision.transform.tag!="man"&& collision.transform.root.tag!="man"){	
if (typeof(collision.contacts[0].thisCollider) != WheelCollider){
var temp_magnitude : float=collision.relativeVelocity.magnitude;
if(collision.rigidbody&&temp_magnitude>1){GetComponent.<Rigidbody>().AddForceAtPosition(Vector3.down*(1000+temp_magnitude*1000),collision.contacts[0].point);
GetComponent.<Rigidbody>().maxAngularVelocity = 0.5f;}
}//WheelCollider
else GetComponent.<Rigidbody>().maxAngularVelocity = 2f;
}//Length
else GetComponent.<Rigidbody>().maxAngularVelocity = 2f;
}//OnCollisionEnter

    function SetWheelParams(wheel : Transform , maxSteer : float , motor : boolean , curY : float ) {
        
        
        var result : WheelData1  = new WheelData1(); // the container of wheel specific data
        var go : GameObject  = new GameObject("WheelCollider");
        go.transform.parent = body.FindChild("wheels"); // the car, not the wheel is parent
        go.transform.position = wheel.position; // match wheel pos
        go.transform.eulerAngles = transform.eulerAngles;
        curY = wheel.transform.localPosition.y;
        // create the actual wheel collider in the collider game object
        var col : WheelCollider  = go.AddComponent(typeof(WheelCollider));

        col.motorTorque = 0.0f;

        // store some useful references in the wheeldata object
        result.transform = wheel; // access to wheel transform 
        result.curY = curY;
        result.go = go; // store the collider game object
        result.col = col; // store the collider self
		result.startPos = wheel.localPosition; // store the current local pos of wheel
        result.maxSteer = maxSteer; // store the max steering angle allowed for wheel
        result.motor = motor; // store if wheel is connected to engine
		if (AutomaticWheelRadius)wheelRadius=wheel.GetComponent.<Renderer>().bounds.size.y / 2;
		col.radius = wheelRadius;

        return result; // return the WheelData1
    }

function StopVehicle(index : float){
vehicle_sc.throttle=0;

}//StopVehicle

function EngineStart(){
engine_start=true;
sound_engine.clip = sound_engine_start;
sound_engine.loop = false;
sound_engine.volume=1;
sound_engine.Play();
}//EngineStart

function EngineWork(){
sound_engine.clip = sound_gear;
sound_engine.loop = true;
sound_engine.Play();
vehicle_sc.engine_work=true;
engine_start=false;
vehicle_sc.throttle=1;
GetComponent.<Rigidbody>().velocity=transform.TransformDirection(Vector3.forward*vehicle_sc.limit_speed/4);
}//EngineWork

function EngineStop(){
engine_start=false;
vehicle_sc.engine_work=false;
sound_engine.loop = false;
sound_engine.pitch=1;
sound_engine.clip = sound_engine_stop;
sound_engine.Play();
}//EngineStart






    // handle shifting a gear up
    function ShiftUp(){
        var now : float  = Time.timeSinceLevelLoad;

        // check if we have waited long enough to shift
        if (now < shiftDelay) return;

        // check if we can shift up
        if (currentGear < gears.Length - 1)
        {


            currentGear++;

            // we delay the next shift with 1s. (sorry, hardcoded)
            shiftDelay = now + 1.0f;
        }
    }


    // handle shifting a gear down
    function ShiftDown() {
        var now : float  = Time.timeSinceLevelLoad;

        // check if we have waited long enough to shift
        if (now < shiftDelay) return;

        // check if we can shift down (note gear 0 is reverse)
        if (currentGear > 0)
        {


            currentGear--;

            // we delay the next shift with 1/10s. (sorry, hardcoded)
            shiftDelay = now + 0.1f;
        }
    }




    function FixedUpdate(){



        var delta : float  = Time.fixedDeltaTime;
        GetComponent.<Rigidbody>().centerOfMass = shiftCentre;

        var steer : float  = 0; // steering -1.0 .. 1.0
        var accel : float  = 0.0f; // accelerating -1.0 .. 1.0
        var brake : boolean  = false; // braking (true is brake)
        
if (vehicle_sc.engine_work) {
if(wheels[1].col.rpm<-10)vehicle_sc.back_speed=true;
else vehicle_sc.back_speed=false;
         vehicle_sc.throttle=Mathf.Clamp(vehicle_sc.throttle,-1.0f,1.0f);
         vehicle_sc.steer=Mathf.Clamp(vehicle_sc.steer,-1.0f,1.0f);
         steer = vehicle_sc.steer;
         accel = vehicle_sc.throttle;
         if(vehicle_sc.throttle==0)brake=true;
         }//engine_work
         
		if(Mathf.Abs(steer)>=0.9f&&speed>80)brake=true;
						
temp_steer=Mathf.Lerp(temp_steer,steer,10*delta);
if (carSteer) carSteer.localEulerAngles.y = temp_steer * 40;
if((accel>0.9f||accel<-0.9f)&&speed<10)PlaySound();
if(vehicle_sc.place[0].man)vehicle_sc.place[0].man.GetComponent(Animator).SetFloat("bike_side",temp_steer);       

        // handle automatic shifting
        if (automatic && (currentGear == 1) && (accel < 0.0f))
        {if (speed < 5.0f)ShiftDown();}
        else if (automatic && (currentGear == 0) && (accel > 0.0f)){
            if (speed < 5.0f) ShiftUp(); }
        else if (automatic && (motorRPM > shiftUpRPM) && (accel > 0.0f) && !brake)  ShiftUp(); // shift up
        else if (automatic && (motorRPM < shiftDownRPM) && (currentGear > 1))ShiftDown(); // shift down
        




        if ((currentGear == 0)){
            shiftCentre.z = -accel / 3;
            if (speed < gears[0] * -10)
                accel = -accel; // in automatic mode we need to hold arrow down for reverse
        }
        else shiftCentre.z = -(accel / currentGear) / 2;
        
        shiftCentre.x = -Mathf.Clamp(steer * (speed / 100), -0.1f, 0.1f);

        // the RPM we try to achieve.
        wantedRPM = (5500.0f * accel) * 0.1f + wantedRPM * 0.9f;

        var rpm : float  = 0.0f;
        var motorizedWheels : int  = 0;
        var floorContact : boolean  = false;
        var currentWheel : int  = 0;
        // calc rpm from current wheel speed and do some updating


        // rigidbody.AddForce(-Vector3.up * 5000);

        for ( w in wheels){
            var hit : WheelHit ;
            var col : WheelCollider  = w.col;

            // only calculate rpm on wheels that are connected to engine
            if (w.motor){
                if (brake && currentGear < 2) {
                    rpm += accel * idleRPM;
                    if (rpm > 1)shiftCentre.z = Mathf.PingPong(Time.fixedTime * (accel * 10), 1.0f) - 0.5f;//
                    
                    else shiftCentre.z = 0.0f;}
                else rpm += col.rpm;
                motorizedWheels++;
            }




            if (brake || accel < 0.0f)
            {
                if ((accel < 0.0f) || (brake && (w == wheels[2] || w == wheels[3])))
                {

                    if (brake && (accel > 0.0f))
                    {

                        brackF = Mathf.Lerp(brackF, 10, accel * Time.fixedDeltaTime);//

                    }
                    else
                    {
                        brackF = Mathf.Lerp(brackF, 5, 0.2f * Time.fixedDeltaTime);//
                    }

                    wantedRPM = 0.0f;
                    col.brakeTorque = brakeTorque;
                    w.rotation = curRotation;

                }
            }
            else
            {

                if(accel == 0)col.brakeTorque = 200; 
                else col.brakeTorque = 1;

                if(speed > 1){

                    if(speed > 20 )brackF = Mathf.Lerp(brackF, 1, 0.01f);
                    else brackF = Mathf.Lerp(brackF, 3.0f, 0.01f);}//speed

                   else brackF = Mathf.Lerp(brackF, 0.0f, 0.01f);

                curRotation = w.rotation;
                
            }



            // like i would but just try out a fiddle with it.
            var fc : WheelFrictionCurve  = col.forwardFriction;


            fc.asymptoteValue = 5000.0f;
            fc.extremumSlip = 2.0f;
            fc.asymptoteSlip = 20.0f;
            fc.stiffness = (stiffness / brackF);
            col.forwardFriction = fc;
            fc = col.sidewaysFriction;
            fc.stiffness = stiffness / brackF;
            col.sidewaysFriction = fc;


            // calculate the local rotation of the wheels from the delta time and rpm
            // then set the local rotation accordingly (also adjust for steering)

            w.rotation = Mathf.Repeat(w.rotation + delta * col.rpm * 360.0f / 60.0f, 360.0f);
            w.transform.localRotation = Quaternion.Euler(w.rotation, col.steerAngle, 0.0f);




            // let the wheels contact the ground, if no groundhit extend max suspension distance
            var lp : Vector3  = w.transform.localPosition;

            if (col.GetGroundHit( hit))
            {
                
                lp.y -= Vector3.Dot(w.transform.position - hit.point, Vector3.up / transform.lossyScale.x) - (col.radius);
                lp.y = Mathf.Clamp(lp.y, -10.0f, w.curY);
                floorContact = floorContact || (w.motor);
               // if(w.transform.localPosition.y-lp.y<0.1)rigidbody.AddForceAtPosition(Vector3.down*20000,w.transform.position);
            }
            else
            {

                
				lp.y = w.startPos.y - suspensionDistance;
            }

            currentWheel++;
            w.transform.localPosition = lp;

        }
        // calculate the actual motor rpm from the wheels connected to the engine
        // note we haven't corrected for gear yet.
        if (motorizedWheels > 1)
        {
            rpm = rpm / motorizedWheels;
        }

        // we do some delay of the change (should take delta instead of just 95% of
        // previous rpm, and also adjust or gears.
        motorRPM = 0.95f * motorRPM + 0.05f * Mathf.Abs(rpm * gears[currentGear]);
        if (motorRPM > 5500.0f) motorRPM = 5200.0f;

        // calculate the 'efficiency' (low or high rpm have lower efficiency then the
        // ideal efficiency, say 2000RPM, see table
        var index : int  = (motorRPM / efficiencyTableStep);
        if (index >= efficiencyTable.Length) index = efficiencyTable.Length - 1;
        if (index < 0) index = 0;

        // calculate torque using gears and efficiency table
        var newTorque : float  = torque * gears[currentGear] * efficiencyTable[index];

        // go set torque to the wheels
        for ( w in wheels){
            var col1 : WheelCollider  = w.col;

            // of course, only the wheels connected to the engine can get engine torque
            if (w.motor)
            {
                // only set torque if wheel goes slower than the expected speed
                if (Mathf.Abs(col1.rpm) > Mathf.Abs(wantedRPM))
                {
                    // wheel goes too fast, set torque to 0
                    col1.motorTorque = 0;
                }
                else
                {
                    // 
                    var curTorque : float  = col1.motorTorque;
//real_torque=curTorque * 0.9f + newTorque * 0.1f;
real_torque=speed;
                    if (!brake&&speed<vehicle_sc.limit_speed)
                        col1.motorTorque = curTorque * 0.9f + newTorque * 0.1f;
                      else col1.motorTorque =0;

                }
            }
            // check if we have to brake


            // set steering angle
            if (brake)
            {
                col1.steerAngle = Mathf.Lerp(col1.steerAngle, steer * w.maxSteer, 0.02f);
            }
            else
            {

                var SteerAngle : float  = Mathf.Clamp((speed / transform.lossyScale.x) / maxSteerAngle, 1.0f, maxSteerAngle);
                col1.steerAngle = steer * (w.maxSteer / SteerAngle);
            }



        }



        // if we have an audiosource (motorsound) adjust pitch using rpm        
        if (sound_engine != null)
        {
            // calculate pitch (keep it within reasonable bounds)
            var pitch : float  = Mathf.Clamp(1.0f + ((motorRPM - idleRPM) / (shiftUpRPM - idleRPM) * 0.5f), 1.0f, 10.0f);
            sound_engine.pitch = pitch;
            sound_engine.volume = Mathf.MoveTowards(sound_engine.volume, 1.0f, 0.02f);
        }

    }







function Hit(_collision : Collision){
if (_collision.contacts.Length > 0 && _collision.transform.tag!="man"&& _collision.transform.root.tag!="man"&& _collision.transform.tag!="nothit"){	
if (typeof(_collision.contacts[0].thisCollider) != WheelCollider){
var temp_magnitude : float=_collision.relativeVelocity.magnitude;
if(_collision.rigidbody&&_collision.rigidbody.mass>100)GetComponent.<Rigidbody>().AddForceAtPosition(Vector3.down*(GetComponent.<Rigidbody>().mass*5.0f+temp_magnitude*5000),_collision.contacts[0].point);

if(temp_magnitude > 5&&_collision.transform.GetComponent.<Rigidbody>()){
if(vehicle_sc.health_bar)vehicle_sc.Damage(temp_magnitude*5,null);
AudioSource.PlayClipAtPoint(game_sc.sound_car_crush[Random.Range(0,game_sc.sound_car_crush.Length)],_collision.contacts[0].point,temp_magnitude*0.02);
//rigidbody.AddForce(Vector3.down*temp_magnitude*10000);
}//magnitude
}//WheelCollider
}//Length
}//Hit	


function SkidAudio(_wheel : WheelCollider){
var temp_graund_hut : WheelHit;
_wheel.GetGroundHit(temp_graund_hut);

if(Mathf.Abs(temp_graund_hut.sidewaysSlip) > 5 || Mathf.Abs(temp_graund_hut.forwardSlip) > 7){
if(!audio_skid.isPlaying){audio_skid.Play();}
audio_skid.GetComponent.<AudioSource>().volume = Mathf.Abs(temp_graund_hut.sidewaysSlip)/20 + Mathf.Abs(temp_graund_hut.forwardSlip)/20;}
else{audio_skid.GetComponent.<AudioSource>().volume -= Time.deltaTime;if(audio_skid.GetComponent.<AudioSource>().volume<0.1){audio_skid.Stop();}}
		
}//SkidAudio

function PlaySound(){
if(!audio_skid.isPlaying){audio_skid.Play();}
audio_skid.GetComponent.<AudioSource>().volume = 1;

}//PlaySound

function Death(){
Destroy(GetComponent(CarDamage));
//Destroy(body.FindChild("wheels").gameObject);//temp commit
Destroy(controller.GetComponent(AudioSource));
Destroy(this);
}//Death

function LoadFriction(){
        for ( w in wheels){
            var col : WheelCollider  = w.col;
            col.suspensionDistance = suspensionDistance;
            var js : JointSpring  = col.suspensionSpring;
            js.spring = springs;
            js.damper = dampers;
            col.suspensionSpring = js;

            col.mass = wheelWeight;
            var fc : WheelFrictionCurve  = col.forwardFriction;
            fc.asymptoteValue = 5000.0f;
            fc.extremumSlip = 2.0f;
            fc.asymptoteSlip = 20.0f;
            fc.stiffness = stiffness;
            col.forwardFriction = fc;
            fc = col.sidewaysFriction;
            fc.asymptoteValue = 7500.0f;
            fc.asymptoteSlip = 2.0f;
            fc.stiffness = stiffness;
            col.sidewaysFriction = fc;
        }
        }//LoadFriction
