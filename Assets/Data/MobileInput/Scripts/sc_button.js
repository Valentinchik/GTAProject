#pragma strict
import System.Collections.Generic;

@script ExecuteInEditMode()


@SerializeField

var image : Texture;
private var pressed : boolean;
private var downPressed : boolean;
private var pointPressed : Vector2;




function Start () {

}

function Update () {
downPressed = false;
pressed = false;
		
var rect : Rect= GetPixelInset(image);
		
for(var touch : Touch in Input.touches) {
var touchPosition : Vector2 = touch.position;
touchPosition.y = Screen.height - touchPosition.y;
if( rect.Contains(touchPosition) ) {
if( touch.phase == TouchPhase.Began ) downPressed = true;
pressed = true;
pointPressed = touch.position;
break;
}//touchPosition
}//for
		#if UNITY_EDITOR
		if(Input.GetMouseButton(0)) {
			var mouse : Vector2 = Input.mousePosition;
			mouse.y = Screen.height - mouse.y;
			if( rect.Contains(mouse) ) {
				if( Input.GetMouseButtonDown(0) ) downPressed = true;
				pressed = true;
				pointPressed = mouse;
			}
		}
		#endif
}//Update


function OnDisable () {
downPressed = false;
pressed = false;
}//OnDisable


function OnEnable () {
downPressed = false;
pressed = false;
}//OnEnable

function Awake () {
downPressed = false;
pressed = false;
}//Awake

function OnGUI() {
var color : Color  = Color.white;
if( !pressed ) color.a = 0.5f;
GUI.color = color;
if(image) GUI.DrawTexture( GetPixelInset(image), image );
}//OnGUI




	

	
function GetPixelInset(texture : Texture ) {
var position : Vector2  = GetCenter();
var size : Vector2  = GetSize(texture);
return new Rect( position.x-size.x/2.0f, position.y-size.y/2.0f, size.x, size.y );
}//GetPixelInset
	
function GetCenter() {
var position : Vector3  = transform.position;
return new Vector2( position.x*Screen.width, position.y*Screen.height );
}//GetCenter
	
function GetSize(texture : Texture ) {
var scale : Vector3  = transform.localScale;
var displaySize : float  = (Screen.width + Screen.height)/2.0f;
return new Vector2(displaySize*scale.x, displaySize*scale.y);
}//GetSize
	
function IsDownPressed() {
return downPressed;
}//IsDownPressed
	
function IsPressed() {
return pressed;
}//IsPressed
	
function GetPointPressed() {
return pointPressed;
}//GetPointPressed
