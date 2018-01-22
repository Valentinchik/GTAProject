using UnityEngine;
using System.Collections;
[ExecuteInEditMode]
public class in_joystick : MonoBehaviour {
	[SerializeField] private float 
		radius_min = 1.0f,
		radius_max = 3.0f,
		size_diff = 1.0f,
	    min_magnitude=0.6f;
	[SerializeField] private Texture 
		tex_joystick = null, 
		tex_joystick_back = null;
	
	[SerializeField] private Color
		normalColor = Color.white,
		pressedColor = Color.gray;
	
	private Vector2 position1;
	private Vector2 position2;
	private Vector2 touch_position;
	private Vector2 joystick_position;
	private Vector2 direction;
	private float size1;
	private float size2;
	private float scale;
	private bool pressed;
	// Use this for initialization
	void Start () {
		
	}//Start
	
	// Update is called once per frame
	void Update () {
		position1 = new Vector2 (Screen.width * transform.localPosition.x, Screen.height * transform.localPosition.y);
		scale = (Screen.width + Screen.height) / 10;
		size1 = scale * transform.localScale.x;
		size2 = size1 * size_diff;
		position2 = position1+joystick_position;

		touch_position = IsPressed ();
		joystick_position= Vector2.ClampMagnitude( touch_position, radius_min*size1 );
		direction = touch_position/(radius_min*size1);
		direction = new Vector2 (Mathf.Clamp(direction.x,-1,1),Mathf.Clamp(direction.y,-1,1));
		if(direction.magnitude<=min_magnitude)direction=Vector3.zero;
		//direction = new Vector3 (1, 0);

		
	}//Update
	
	void OnGUI() {

		GUI.color=normalColor;
		if(tex_joystick_back)GUI.DrawTexture( new Rect(position1.x-size1/2,position1.y-size1/2,size1,size1),tex_joystick_back );
		if(pressed)GUI.color=pressedColor;
		if(tex_joystick)GUI.DrawTexture( new Rect(position2.x-size2/2,position2.y-size2/2,size2,size2),tex_joystick );
		//GUI.color = Color.black;
		//GUI.Label (new Rect (Screen.width / 1.5f, Screen.height / 2, 200, 100),"Direction"+ direction);
	}//OnGUI
	
	
	
	private Vector2 IsPressed() {
		foreach(Touch touch in Input.touches) {
			Vector2 touchPosition = touch.position;
			touchPosition.y = Screen.height - touchPosition.y;
			Vector2 delta = touchPosition - position1;
			if( delta.magnitude <= radius_max *size1) {
				pressed=true;
				return delta;
			}//sqrMagnitude
		}
		#if (UNITY_EDITOR || UNITY_STANDALONE_OSX || UNITY_STANDALONE_WIN || UNITY_STANDALONE_LINUX || UNITY_STANDALONE || UNITY_WEBPLAYER)
		if(Input.GetMouseButton(0)) {
			Vector2 mouse = Input.mousePosition;
			mouse.y = Screen.height - mouse.y;
			Vector2 delta = mouse - position1;
			if( delta.magnitude <= radius_max*size1) {
				pressed=true;
				return delta;
			}
		}
		#endif
		pressed=false;
		return Vector2.zero;
	}//IsPressed
	
	public Vector2 GetDirection() {
		//direction = direction.normalized.magnitude * direction.normalized;
		//direction = new Vector2 (Mathf.Ceil (direction.x * 10) / 10, Mathf.Ceil (direction.y * 10) / 10);
		return direction;}
}
