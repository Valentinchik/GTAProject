#pragma strict


class ClassWheel {
var _transform : Transform;
var transform_child : Transform;
var collider : WheelCollider;
var radius : float;
var front : boolean;
var motor : boolean;
var _rotation : Vector3;
var wheel_pos_start : float;
}//ClassWheel

class ClassWheelFriction {
var forward_friction_extrem : float=10000;
var forward_friction_asymp : float=5000;
var front_sideways_friction_extrem : float=500;
var front_sideways_friction_asymp : float=250;
var back_sideways_friction_extrem : float=1000;
var back_sideways_friction_asymp : float=150;
}//ClassWheel

class ClassWheelInfo {
var front : boolean;
var motor : boolean;
var _static : boolean;
}// ClassWheelInfo

class ClassVehicleWeapon {
var turret : Transform;
var dulo : Transform;
var shoot_point : Transform;
var turret_point : Transform;
var muzzle_flash : Transform;
var _light : Transform;
var bullet : Transform;
var sound_shoot : AudioClip;
var fire_angle : int=5;
var force : float;
var fire_rate : float;
var fire_wait : float;
var power : float;
var exp_radius : float;
var bullet_speed : float=500;
var target_type : Vector2=Vector2(0,2);
var _return : int;
var image : Texture2D;
var other_weapon : ClassOtherWeapon;
var bullets : int;
var bullet_count : int=1;
var angle : Vector2;
var rocket : boolean;
var auto_target : boolean;
}//ClassVehicleWeapon


public class ClassWeapon{
var index : int;
var prefab : Transform;
var _transform : Transform;
var _name : String;
var bullet : Transform;
var cross : int;
var image : Texture2D;
var _camera : int=1;
var bullet_speed : float=500;
var shoot_num : int;
var sound_shoot : AudioClip;
var type : int;
var bullet_count : int=1;
var target_type : Vector2=Vector2(0,2);
var auto_target : boolean;

var range : float;
var bot_rate : float;
var _return : float;
var max_return : float;
var min_return : float;
var recovery_return : float;

var bullets : int;
var clips : int;
var max_bullets : int;
var max_clips : int;
var fire_rate : float;
var fire_wait : float;

var force : int;
var power : float;
var exp_radius : float;
}//ClassWeapon

public class ClassOtherWeapon{
var active : boolean;
var bullet_width : int;
var bullet_height : int;
var bullet_dis : float;
var point_pos : Vector2;
var centr_point : Transform;

}//ClassOtherWeapon

public class ClassSound{
var sound : List.<AudioClip> = new List.<AudioClip> ();
}//ClassSound

public class ClassVoice{
var voice : List.<ClassSound> = new List.<ClassSound> ();
}//ClassSound

public class ClassTeam{
var unit : List.<Transform> = new List.<Transform> ();
}//ClassSound

public class ClassCamera{
var num : int;
var target : Transform;
}//ClassCameraType

public class ClassVehiclePlace{
var place_point : Transform;
var door_point : Transform;
var door : Transform;
var man : Transform;
var door_setting : int;
var anim : int;
var direction : int;
var use : boolean;
var can_use : boolean=true;
var empty : boolean=false;
}//ClassCameraType

public class ClassVehicleArea{
var _position : Vector3;
var point : List.<ClassPointCar> = new List.<ClassPointCar> ();
var point_man : List.<ClassPointMan> = new List.<ClassPointMan> ();
var man : List.<int> = new List.<int> ();
var man_procent : List.<int> = new List.<int> ();
var width : int;
var height : int;
var procent : int;
var limit_speed : int;
}//ClassCameraType

public class ClassMan{
var type : int;
var man : List.<int> = new List.<int> ();
var car : List.<int> = new List.<int> ();
var boat : List.<int> = new List.<int> ();
}//ClassCameraType

public class ClassVehicleDoor{
var collider_size : Vector3;
var axis : Vector3;
var limit : Vector2;
var break_force : float;
var break_torque : float;
var sound_open : AudioClip;
var sound_close : AudioClip;
}//ClassCameraType

public class ClassGlass{
var destroy_object : Transform;
var sound : AudioClip;
}//ClassGlass

public class ClassDecal{
var decal : List.<Transform> = new List.<Transform> ();
var sound : List.<AudioClip> = new List.<AudioClip> ();
var particle : Transform;
}//ClassGlass

public class ClassLightObject{
var object1 : List.<Transform> = new List.<Transform> ();
var object2 : List.<Transform> = new List.<Transform> ();
}//ClassGlass

public class ClassManArea{
var man : int;
var procent : int;
}//ClassGlass

public class ClassLanguage{
var language : List.<String> = new List.<String> ();

}//ClassGlass


public class Functions{

public static function Angle180(_rot : Vector3){
var temp_angle : Vector3=_rot;
			
     if (temp_angle.x> 180){temp_angle.x-=360;}
else if (temp_angle.x<-180){temp_angle.x+=360;}
     if (temp_angle.y> 180){temp_angle.y-=360;}	
else if (temp_angle.y<-180){temp_angle.y+=360;}		
     if (temp_angle.z> 180){temp_angle.z-=360;}
else if (temp_angle.z<-180){temp_angle.z+=360;}
		
return temp_angle;
}//Angle_180

public static function Angle180Abs(_rot : Vector3){
var temp_angle : Vector3=_rot;
			
     if (temp_angle.x> 180){temp_angle.x-=360;}
else if (temp_angle.x<-180){temp_angle.x+=360;}
     if (temp_angle.y> 180){temp_angle.y-=360;}	
else if (temp_angle.y<-180){temp_angle.y+=360;}		
     if (temp_angle.z> 180){temp_angle.z-=360;}
else if (temp_angle.z<-180){temp_angle.z+=360;}
		
temp_angle.x=Mathf.Abs(temp_angle.x);
temp_angle.y=Mathf.Abs(temp_angle.y);
temp_angle.z=Mathf.Abs(temp_angle.z);
return temp_angle;
}//Angle_180

public static function AngleSingle180(_rot : float){
var angle : float=_rot;		
     if (angle> 180){angle-=360;}
else if (angle<-180){angle+=360;}
return angle;
}//Angle_180

public static function AngleSingle180Abs(_rot : float){
var angle : float=_rot;		
     if (angle> 180){angle-=360;}
else if (angle<-180){angle+=360;}	
return Mathf.Abs(angle);
}//Angle_180

public static function HitArea(_pos1 : Vector3,_pos2 : Vector3,_area_x : float,_area_z : float){
if(_pos1.x>_pos2.x-_area_x&&_pos1.x<_pos2.x+_area_x&&
   _pos1.z>_pos2.z-_area_z&&_pos1.z<_pos2.z+_area_z)
   {return true;}else{return false;}
}//HitArea

public static function HitAreaOut(_pos1 : Vector3,_pos2 : Vector3,_area_x : float,_area_z : float){
if(_pos1.x<_pos2.x-_area_x || _pos1.x>_pos2.x+_area_x || 
   _pos1.z<_pos2.z-_area_z || _pos1.z>_pos2.z+_area_z)
   {return true;}else{return false;}
}//HitAreaOut

public static function Direction(_rot : Vector3){
var _rotQ : Quaternion=Quaternion.Euler(_rot);
var _dir : Vector3;
_dir.x=2*(_rotQ.x*_rotQ.z-_rotQ.y*_rotQ.w);
_dir.z=2*(_rotQ.z*_rotQ.z+_rotQ.w*_rotQ.w)-1;
_dir.y=2*(_rotQ.y*_rotQ.z+_rotQ.x*_rotQ.w);

return _dir;
}//Direction




}///Functions