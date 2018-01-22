#pragma strict
import UnityEngine;
import System.Collections;


public enum JWheelDrive{
    Front = 0,
    Back = 1,
    All = 2
    }
    
private var vehicle_sc : sc_vehicle;
private var game_sc : sc_game;
    
var sound_engine : AudioSource;
var audio_skid : AudioSource;
var sound_engine_start : AudioClip;
var sound_engine_stop : AudioClip;
var sound_gear : AudioClip;
var color_detal : Transform[] ;

private var body : Transform;
private var controller : Transform;

public var engine_start : boolean;
var angle : float;
    public var showNormalGizmos : boolean;
    public var checkForActive: GameObject;

    public var  wheelFront : Transform ; // connect to Front Right Wheel transform
    public var wheelBack: Transform ; // connect to Front Left Wheel transform

    public var  axleFront : Transform ; // connect to Front Right Axle transform
    public var  axlelBack : Transform ; // connect to Front Left Axle transform

    public var  bikeSteer : Transform ;

    public  var brakeLights : Light[] ;
    public  var brakeSound : AudioClip ;
    public var  brakeParticle : GameObject ;
    public  var shiftParticle : ParticleSystem;
    public  var shiftParticle2 : ParticleSystem;

    public  var suspensionDistance : float = 0.1f; // amount of movement in suspension
    public  var springs : float = 7000.0f; // suspension springs
    public var  dampers : float  = 10f; // how much damping the suspension has
    public  var AutomaticWheelRadius : boolean  = true;
	public  var wheelRadius : float  = 0.1f; // the radius of the wheels
	public  var torque : float  = 70f; // the base power of the engine (per wheel, and before gears)
	public  var shiftTorque : float  = 150f;
    @HideInInspector
    public  var curTorque : float  = 100f;
    public  var brakeTorque : float  = 500f; // the power of the braks (per wheel)
    public  var wheelWeight : float  = 3f; // the weight of a wheel
    public var  shiftSpeed : Vector3 = new Vector3(0.0f, -0.5f, -0.8f); // offset of centre of mass
    public  var shiftCentre : Vector3  = new Vector3(0.0f, -0.6f, 0.0f); // offset of centre of mass

    public  var maxSteerAngle : float  = 35.0f; // max angle of steering wheels
    public  var maxTurn : float  = 1.5f;
    public  var wheelDrive : JWheelDrive  = JWheelDrive.Front; // which wheels are powered

    public  var shiftDownRPM : float  = 1500.0f; // rpm script will shift gear down
    public  var shiftUpRPM : float  = 4000.0f; // rpm script will shift gear up
    public  var idleRPM : float  = 700.0f; // idle rpm

    public  var stiffness : float  = 0.1f; // for wheels, determines slip
    public  var swyStiffness : float  = 0.1f; // for wheels, determines slip

    // gear ratios (index 0 is reverse)
    public var  gears : float[];//  = { -5f, 9f, 4f, 3f, 2f};

    // automatic, if true motor shifts automatically up/down
    public var  automatic : boolean  = true;

    // table of efficiency at certain RPM, in tableStep RPM increases, 1.0f is 100% efficient
    // at the given RPM, current table has 100% at around 2000RPM
    private var efficiencyTable : float[];//  = { 0.6f, 0.65f, 0.7f, 0.75f, 0.8f, 0.85f, 0.9f, 1.0f, 1.0f, 0.95f, 0.80f, 0.70f, 0.60f, 0.5f, 0.45f, 0.40f, 0.36f, 0.33f, 0.30f, 0.20f, 0.10f, 0.05f };

    // the scale of the indices in table, so with 250f, 750RPM translates to efficiencyTable[3].
    private var efficiencyTableStep : float    = 250.0f;

    public  var shiftGUI : Texture2D ;

    private var  powerShift : float  = 100;
  

    private var  shiftDelay : float  = 0.0f;
    private var  stand_force : float=1;
    private var  stand_timer : float;
    private var  stand : boolean;

    @HideInInspector public var  currentGear : int  = 1; // duh.
    @HideInInspector public  var motorRPM : float  = 0.0f;
    @HideInInspector public  var speed : float ;
    @HideInInspector public  var steer2 : float ;
    @HideInInspector public  var groundHit : boolean ;



    private  var wantedRPM : float  = 0.0f; // rpm the engine tries to reach
    private  var curRotation : float ;
    private  var brackF : float  = 0.0f;

   // @HideInInspector
    public  var crash : boolean ;
    private var  shifmotor : boolean ;


    // every wheel has a wheeldata struct, contains useful wheel specific info
    class WheelData {
        var transform : Transform ;
        var go : GameObject ;
        var col : WheelCollider ;
        var axle : Transform ;
        var startPos : Vector3 ;
        var rotation : float  = 0.0f;
        var maxSteer : float ;
        var motor : boolean ;
        var curY : float  = 0.0f;
    }//WheelData

   var wheels : WheelData[] ; // array with the wheel data

    function SetWheelParams(wheel : Transform , axle : Transform , maxSteer : float ,motor : boolean ,curY : float ) {
        
       
       var result : WheelData  = new WheelData(); // the container of wheel specific data
       var go : GameObject  = new GameObject("WheelCollider");
        go.transform.parent = transform; // the motor, not the wheel is parent
        go.transform.position = wheel.position; // match wheel pos
        go.transform.eulerAngles = transform.eulerAngles;
        curY = axle.localPosition.y;
        wheel.transform.gameObject.AddComponent(WheelCollider);
       var col : WheelCollider  =go.AddComponent(typeof(WheelCollider));
        col.transform.localScale = wheel.transform.localScale;
        col.radius = wheel.transform.GetComponent(WheelCollider).radius;
        Destroy(wheel.transform.GetComponent(WheelCollider));

        col.motorTorque = 0.0f;
        result.transform = wheel; // access to wheel transform 
        result.axle = axle;
        result.curY = curY;
        result.go = go; // store the collider game object
        result.col = col; // store the collider self
        result.startPos = axle.transform.localPosition; // store the current local pos of wheel
        result.maxSteer = maxSteer; // store the max steering angle allowed for wheel
        result.motor = motor; // store if wheel is connected to engine

        return result; // return the WheelData
    }//SetWheelParams

    // Use this for initialization
    var steerRot : Vector3 ;


function  Start(){
game_sc=GameObject.Find("Game").GetComponent(sc_game);
vehicle_sc=GetComponent(sc_vehicle);

body=transform.FindChild("body");
controller=transform.FindChild("controller");

if(color_detal.Length>0&&game_sc.car_colorran==1){
var temp_color : Color=game_sc.car_color[Random.Range(0,game_sc.car_color.Length)];
for(_detal in color_detal){_detal.GetComponent.<Renderer>().material.color=temp_color;}}

sound_engine=gameObject.AddComponent(AudioSource);
audio_skid=controller.gameObject.AddComponent(AudioSource);
audio_skid.clip = game_sc.sound_skid;
audio_skid.loop = true;
    
    
    gears=new float[5];
    gears[0]=-3f;
    gears[1]=6f;
    gears[2]=4f;
    gears[3]=3f;
    gears[4]= 2f;
    
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


        wheels = new WheelData[2];
        steerRot = bikeSteer.eulerAngles;

        // setup wheels
        var frontDrive : boolean  = (wheelDrive == JWheelDrive.Front) || (wheelDrive == JWheelDrive.All);
       var  backDrive : boolean  = (wheelDrive == JWheelDrive.Back) || (wheelDrive == JWheelDrive.All);

        wheels[0] = SetWheelParams(wheelFront, axleFront, maxSteerAngle, frontDrive, axleFront.localPosition.y);
        wheels[1] = SetWheelParams(wheelBack, axlelBack, 0.0f, backDrive, axlelBack.localPosition.y);

        for (var w in wheels){


         var  col : WheelCollider  = w.col;
            col.suspensionDistance = suspensionDistance;
          var  js : JointSpring  = col.suspensionSpring;
            js.spring = springs;
            js.damper = dampers;
            col.suspensionSpring = js;

            if (!AutomaticWheelRadius) col.radius = wheelRadius;

            col.mass = wheelWeight;

            // see docs, haven't really managed to get this work
            // like i would but just try out a fiddle with it.
        var   fc : WheelFrictionCurve  = col.forwardFriction;
            fc.asymptoteValue = 5000.0f;
            fc.extremumSlip = 2.0f;
            fc.asymptoteSlip = 20.0f;
            fc.stiffness = stiffness;
            col.forwardFriction = fc;
            fc = col.sidewaysFriction;
            fc.asymptoteValue = 7500.0f;
            fc.asymptoteSlip = 2.0f;
            fc.stiffness = swyStiffness;
            col.sidewaysFriction = fc;
        }



    }//Start



function Update() {
if(engine_start){
if(!sound_engine.isPlaying){
sound_engine.clip = sound_gear;
sound_engine.loop = true;
sound_engine.Play();
vehicle_sc.engine_work=true;
engine_start=false;}
}//engine_start

speed = GetComponent.<Rigidbody>().velocity.magnitude * 3.6f;
if (Input.GetKeyDown("page up")) ShiftUp();
if (Input.GetKeyDown("page down")) ShiftDown();
 }//Update
 
 function OnCollisionEnter (collision : Collision) {


Hit(collision);
}//OnCollisionEnter

function Hit(_collision : Collision){

    if (_collision.contacts.Length > 0 && _collision.transform.tag!="man"&& _collision.transform.root.tag!="man"&&_collision.transform.tag!="nothit"){	
var temp_magnitude : float=_collision.relativeVelocity.magnitude;
if(temp_magnitude > 5){
if (_collision.contacts[0].thisCollider.GetType () != typeof(WheelCollider)){
if(vehicle_sc.health_bar)vehicle_sc.Damage(temp_magnitude*5,null);
if(temp_magnitude > 25){
crash=true;
if(vehicle_sc.place[0].man){
vehicle_sc.place[0].man.GetComponent(sc_man).Damage(temp_magnitude,_collision.relativeVelocity.sqrMagnitude*100,
(transform.position-_collision.transform.root.position).normalized,_collision.contacts[0].point,null);
vehicle_sc.place[0].use=false;
vehicle_sc.place[0].man=null;
}//man
}//temp_magnitude
AudioSource.PlayClipAtPoint(game_sc.sound_car_crush[Random.Range(0,game_sc.sound_car_crush.Length)],_collision.contacts[0].point,temp_magnitude*0.02);
}//WheelCollider
}//magnitude
}//Length
}//Hit	


function StopVehicle(index : float){
vehicle_sc.throttle=0;
for (var _wheel in wheels){
_wheel.col.brakeTorque =index;
_wheel.col.motorTorque =0;
}//for
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

function Stand(){
stand_force=2;
stand=true;
crash=false;    
}//Stand

function SkidAudio(_wheel : WheelCollider){
var temp_graund_hut : WheelHit;
_wheel.GetGroundHit(temp_graund_hut);

if(Mathf.Abs(temp_graund_hut.sidewaysSlip) > 5 || Mathf.Abs(temp_graund_hut.forwardSlip) > 7){
if(!audio_skid.isPlaying){audio_skid.Play();}
audio_skid.GetComponent.<AudioSource>().volume = Mathf.Abs(temp_graund_hut.sidewaysSlip)/20 + Mathf.Abs(temp_graund_hut.forwardSlip)/20;}
else{audio_skid.GetComponent.<AudioSource>().volume -= Time.deltaTime;if(audio_skid.GetComponent.<AudioSource>().volume<0.1){audio_skid.Stop();}}
		
}//SkidAudio



    function ShiftUp()  {
       var now : float  = Time.timeSinceLevelLoad;

        // check if we have waited long enough to shift
        if (now < shiftDelay) return;

        // check if we can shift up
        if (currentGear < gears.Length - 1){
            currentGear++;
            shiftDelay = now + 1.0f;
        }
    }//ShiftUp


    // handle shifting a gear down
    function ShiftDown() {
       var now : float  = Time.timeSinceLevelLoad;

        // check if we have waited long enough to shift
        if (now < shiftDelay) return;

        // check if we can shift down (note gear 0 is reverse)
        if (currentGear > 0){
        currentGear--;
		shiftDelay = now + 0.1f;
        }//currentGear
    }//ShiftDown




    
function FixedUpdate(){
 var delta : float  = Time.fixedDeltaTime;
 GetComponent.<Rigidbody>().centerOfMass = shiftCentre;

       var steer : float  = 0; // steering -1.0 .. 1.0
       var accel : float  = 0.0f; // accelerating -1.0 .. 1.0
       var brake : boolean  = false; // braking (true is brake)
if(wheels[0].col.rpm<-5)vehicle_sc.back_speed=true;
else vehicle_sc.back_speed=false;


if(stand){
stand_timer+=Time.deltaTime;
if(stand_timer>3){
stand_timer=0;
stand_force=1;
stand=false;
}//stand_timer
}//stand

        if (vehicle_sc.engine_work&&!crash) {
      vehicle_sc.throttle=Mathf.Clamp(vehicle_sc.throttle,-1.0f,1.0f);
      vehicle_sc.steer=Mathf.Clamp(vehicle_sc.steer,-1.0f,1.0f);
         steer = vehicle_sc.steer;
         accel = vehicle_sc.throttle;
         if(vehicle_sc.throttle==0)brake=true;
         }

 steer2 = Mathf.LerpAngle(steer2, steer * maxSteerAngle, Time.deltaTime * 5);///(1+speed/100)
 if (bikeSteer) bikeSteer.localEulerAngles = new Vector3(steerRot.x, Mathf.LerpAngle(bikeSteer.localEulerAngles.y, wheels[0].col.steerAngle, 0.2f), steerRot.z);
 var MotorRotation : Vector3  = transform.eulerAngles;
 MotorRotation.z = Mathf.LerpAngle(MotorRotation.z, -steer2 * maxTurn * (Mathf.Clamp(speed / 100, 0.0f, 1.0f)), 0.1f*stand_force);
angle= Functions.AngleSingle180(transform.localEulerAngles.z);
if(vehicle_sc.place[0].man){
var temp_magnitude : float=Mathf.Clamp(wheels[0].col.rpm/100,-1,1);
vehicle_sc.place[0].man.GetComponent(Animator).SetFloat("bike_side",angle);
vehicle_sc.place[0].man.GetComponent(Animator).SetFloat("magnitude",temp_magnitude);}
if (!crash)transform.eulerAngles = MotorRotation;

if (automatic && (currentGear == 1) && (accel < 0.0f)){
 if (speed < 1.0f) ShiftDown(); // reverse
 }
        else if (automatic && (currentGear == 0) && (accel > 0.0f))
        {
            if (speed < 5.0f)
                ShiftUp(); // go from reverse to first gear

        }
        else if (automatic && (motorRPM > shiftUpRPM) && (accel > 0.0f) && !brake)
        {
            // if (speed > 20)
            ShiftUp(); // shift up

        }
        else if (automatic && (motorRPM < shiftDownRPM) && (currentGear > 1))
        {
            ShiftDown(); // shift down
        }




        if ((currentGear == 0))
        {
            shiftCentre.z = -accel / 5.0f;
            if (speed < gears[0] * -10)
                accel = -accel; // in automatic mode we need to hold arrow down for reverse
        }
        else
        {

            shiftCentre.z = -(accel / currentGear) / 3.0f;
        }







        // the RPM we try to achieve.
        wantedRPM = (5500.0f * accel) * 0.1f + wantedRPM * 0.9f;

        var rpm : float  = 0.0f;
        var motorizedWheels : int  = 0;
        var floorContact : boolean  = false;
       var currentWheel : int  = 0;
        // calc rpm from current wheel speed and do some updating


        


        for ( w in wheels) {
            var hit : WheelHit ;
            var col : WheelCollider  = w.col;



            // only calculate rpm on wheels that are connected to engine
            if (w.motor){
                if (brake && currentGear == 1)
                {
                    rpm += accel * idleRPM;
                    if (rpm > 1)
                    {
                        shiftCentre.z = Mathf.PingPong(Time.time * (accel * 5), 0.5f) - 0.25f;
                    }
                    else
                    {
                        shiftCentre.z = 0.0f;
                    }
                }
                else
                {
                    rpm += col.rpm;
                }


                motorizedWheels++;
            }




            if (brake || accel < 0.0f)
            {
                if ((accel < 0.0f) || (brake && w == wheels[1]))
                {

                    if (brake && (accel > 0.0f))
                    {

                        brackF = Mathf.Lerp(brackF, 10, accel * Time.deltaTime);

                    }
                    else
                    {
                        brackF = Mathf.Lerp(brackF, 5, 0.2f * Time.deltaTime);
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
if(speed > 20)brackF = Mathf.Lerp(brackF, 1, 0.01f);
else brackF = Mathf.Lerp(brackF, 3.0f, 0.01f);
}//speed
else brackF = Mathf.Lerp(brackF, 0.0f, 0.01f);
curRotation = w.rotation;

 }




















			curTorque = torque;
            shiftCentre.y = -0.6f;
            // calculate the local rotation of the wheels from the delta time and rpm
            // then set the local rotation accordingly (also adjust for steering)

            w.rotation = Mathf.Repeat(w.rotation + delta * col.rpm * 360.0f / 60.0f, 360.0f);
            // w.transform.localRotation = Quaternion.Euler(w.rotation, col.steerAngle, 0.0f);
            w.transform.localRotation = Quaternion.Euler(w.rotation, 0.0f, 0.0f);



            // let the wheels contact the ground, if no groundhit extend max suspension distance
            var lp : Vector3  = w.axle.localPosition;

            if (col.GetGroundHit(hit))
            {




                lp.y -= Vector3.Dot(w.transform.position - hit.point, Vector3.up / transform.lossyScale.x) - (col.radius);
                lp.y = Mathf.Clamp(lp.y, -10.0f, w.curY);

                floorContact = floorContact || (w.motor);

                if (!crash)
                {
                    GetComponent.<Rigidbody>().angularDrag = 10.0f;
                }
                else
                {
                    GetComponent.<Rigidbody>().angularDrag = 0.0f;


                }
                groundHit = true;


            }
            else
            {
                groundHit = false;

                GetComponent.<Rigidbody>().angularDrag = 0.0f;

                GetComponent.<Rigidbody>().AddForce(0, -1000, 0);
               

    

                lp.y = w.startPos.y - suspensionDistance;
            }

            currentWheel++;
            w.axle.localPosition = lp;

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
       var newTorque : float  = curTorque * gears[currentGear] * efficiencyTable[index];

        // go set torque to the wheels
        for ( w in wheels)
        {
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
                    var curTorqueCol : float  = col1.motorTorque;

                    if (!brake&&speed<vehicle_sc.limit_speed)
                        col1.motorTorque = curTorqueCol * 0.9f + newTorque * 0.1f;
                    else col1.motorTorque=0;

                }
            }



            // set steering angle
            if (brake)
            {
                col1.steerAngle = Mathf.Lerp(col1.steerAngle, steer * w.maxSteer, 0.1f);
            }
            else
            {

               // var SteerAngle : float  = Mathf.Clamp(((speed*1.5) / transform.lossyScale.x) / maxSteerAngle, 1.0f, maxSteerAngle);
               var SteerAngle : float  =Mathf.Clamp((speed / transform.lossyScale.x) / maxSteerAngle, 1.0f, maxSteerAngle);
                col1.steerAngle = steer * (w.maxSteer / SteerAngle);
            }




        }



        // if we have an audiosource (motorsound) adjust pitch using rpm        
        if (sound_engine != null)
        {
            // calculate pitch (keep it within reasonable bounds)
           var pitch : float  = Mathf.Clamp(1.0f + ((motorRPM - idleRPM) / (shiftUpRPM - idleRPM)), 1.0f, 10.0f);
            sound_engine.pitch = pitch;
            sound_engine.volume = Mathf.MoveTowards(sound_engine.volume, 1.0f, 0.02f);
        }

        if (crash)
        {
            shiftCentre = Vector3.zero;
        }


    
    
    }//fixeupdate
    
    
function Death(){
Destroy(bikeSteer.gameObject);
Destroy(axlelBack.gameObject);
Destroy(this);
}//Death
