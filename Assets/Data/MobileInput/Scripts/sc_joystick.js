#pragma strict
import System.Collections.Generic;
/*
@script ExecuteInEditMode()


@SerializeField
var minRadius : float = 1.0f;
@SerializeField
var maxRadius : float= 3.0f;
@SerializeField
var image : Texture= null; 
@SerializeField
var background : Texture= null;
@SerializeField
var normalColor : Color= Color.white;
@SerializeField
var pressedColor : Color= Color.gray;

private var pressed : boolean= false;
private var offset : Vector2= Vector2.zero;

function Start () {

}//Start

function Update () {
var tmpPoint : Vector2=Vector2(0.000001,0);
var size : Vector2  = GetSize(image);
var radius : float  = (size.x + size.y)/4.0f;
tmpPoint = IsPressed( GetCenter(), radius*maxRadius );

//pressed = tmpPoint.HasValue;
if( pressed ) {offset = Vector2.Lerp( offset,tmpPoint,10*Time.deltaTime);
} else {offset = Vector2.zero;}
}//Update


	
	

function IsPressed( position : Vector2 , radius : float  ) {
for(var touch : Touch in Input.touches) {
var touchPosition : Vector2  = touch.position;
touchPosition.y = Screen.height - touchPosition.y;
var delta : Vector2  = touchPosition - position;
if( delta.sqrMagnitude <= radius*radius ) {
return delta;}
}//touches
#if (UNITY_EDITOR || UNITY_STANDALONE_OSX || UNITY_STANDALONE_WIN || UNITY_STANDALONE_LINUX || UNITY_STANDALONE || UNITY_WEBPLAYER)
if(Input.GetMouseButton(0)) {
var mouse : Vector2  = Input.mousePosition;
mouse.y = Screen.height - mouse.y;
var delta1 : Vector2  = mouse - position;
if( delta1.sqrMagnitude <= radius*radius ) {
return delta1;}
}//GetMouseButton
#endif
return null;
}//IsPressed
	
	
	
function OnGUI() {
if (pressed) {
GUI.color = pressedColor;}
else {
GUI.color = normalColor;}

var rect : Rect  = GetPixelInset( background );
if(background) GUI.DrawTexture( rect, background );
		
rect = GetPixelInset(image);
if( pressed ) {
rect.x += offset.x;
rect.y += offset.y;
}
if(image) GUI.DrawTexture( rect, image );
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
	
function IsPressed() {return pressed;}
	
function GetOffset() {return offset.normalized;}
*/
