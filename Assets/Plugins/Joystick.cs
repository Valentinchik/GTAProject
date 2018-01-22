using UnityEngine;
using System.Collections;

[ExecuteInEditMode]
public class Joystick : MonoBehaviour {
	
	[SerializeField] private float 
		minRadius = 1.0f,
		maxRadius = 3.0f;
	
	[SerializeField] private Texture 
		image = null, 
		background = null;

	[SerializeField] private Color
		normalColor = Color.white,
		pressedColor = Color.gray;

	private bool
		pressed = false;

	private Vector2 
		offset = Vector2.zero;
	
	public void Update () {
		Vector2? tmpPoint = null;
		Vector2 size = GetSize(image);
		float radius = (size.x + size.y)/4.0f;
		tmpPoint = IsPressed( GetCenter(), radius*maxRadius );

		pressed = tmpPoint.HasValue;
		if( pressed ) {
			offset = Vector2.ClampMagnitude( tmpPoint.Value, radius*minRadius );
		} else {
			offset = Vector2.zero;
		}
	}
	
	private static Vector2? IsPressed( Vector2 position, float radius ) {
		foreach(Touch touch in Input.touches) {
			Vector2 touchPosition = touch.position;
			touchPosition.y = Screen.height - touchPosition.y;
			Vector2 delta = touchPosition - position;
			if( delta.sqrMagnitude <= radius*radius ) {
				return delta;
			}
		}
		#if (UNITY_EDITOR || UNITY_STANDALONE_OSX || UNITY_STANDALONE_WIN || UNITY_STANDALONE_LINUX || UNITY_STANDALONE || UNITY_WEBPLAYER)
		if(Input.GetMouseButton(0)) {
			Vector2 mouse = Input.mousePosition;
			mouse.y = Screen.height - mouse.y;
			Vector2 delta = mouse - position;
			if( delta.sqrMagnitude <= radius*radius ) {
				return delta;
			}
		}
		#endif
		return null;
	}
	
	public void OnGUI() {
		if (pressed) {
			GUI.color = pressedColor;	
		}

		else {
			GUI.color = normalColor;
		}

		Rect rect = GetPixelInset( background );
		if(background) GUI.DrawTexture( rect, background );
		
		rect = GetPixelInset(image);
		if( pressed ) {
			rect.x += offset.x;
			rect.y += offset.y;
		}
		if(image) GUI.DrawTexture( rect, image );
	}
	
	private Rect GetPixelInset(Texture texture) {
		Vector2 position = GetCenter();
		Vector2 size = GetSize(texture);
		return new Rect( position.x-size.x/2.0f, position.y-size.y/2.0f, size.x, size.y );
	}
	
	private Vector2 GetCenter() {
		Vector3 position = transform.position;
		return new Vector2( position.x*Screen.width, position.y*Screen.height );
	}
	
	private Vector2 GetSize(Texture texture) {
		Vector3 scale = transform.localScale;
		float displaySize = (Screen.width + Screen.height)/2.0f;
		return new Vector2(displaySize*scale.x, displaySize*scale.y);
	}
	
	public bool IsPressed() {
		return pressed;
	}
	
	public Vector2 GetOffset() {
		return offset.normalized;
	}
}