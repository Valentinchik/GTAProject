using UnityEngine;
using System.Collections;

[ExecuteInEditMode]
public class Button : MonoBehaviour {


	public bool draw_text;
	public string text;
	public float alpha=0.5f;
	public GUIStyle gui_style_0;

	[SerializeField] private Texture image;
	private bool pressed = false;
	private bool downPressed = false;
	private Vector2 pointPressed;
	

	void OnDisable () {
		downPressed = false;
		pressed = false;
	}

	void OnEnable () {
		downPressed = false;
		pressed = false;
	}

	void Awake () {
		downPressed = false;
		pressed = false;
	}

	// Update is called once per frame
	void Update () {
		downPressed = false;
		pressed = false;
		
		Rect rect = GetPixelInset();
		
		foreach(Touch touch in Input.touches) {
			Vector2 touchPosition = touch.position;
			touchPosition.y = Screen.height - touchPosition.y;
			if( rect.Contains(touchPosition) ) {
				if( touch.phase == TouchPhase.Began ) downPressed = true;
				pressed = true;
				pointPressed = touch.position;
				break;
			}
		}
		#if UNITY_EDITOR
		if(Input.GetMouseButton(0)) {
			Vector2 mouse = Input.mousePosition;
			mouse.y = Screen.height - mouse.y;
			if( rect.Contains(mouse) ) {
				if( Input.GetMouseButtonDown(0) ) downPressed = true;
				pressed = true;
				pointPressed = mouse;
			}
		}
		#endif
	}
	
	void OnGUI() {
		Color color = Color.white;
		if( !pressed ) color.a = alpha;
		GUI.color = color;
		if(image) GUI.DrawTexture( GetPixelInset(), image );
		if (draw_text) {
			gui_style_0.fontSize=(int)Mathf.Ceil(Mathf.Sqrt(GetSize().x*GetSize().y)*0.2f);
			GUI.color = Color.black;
			GUI.Label(new Rect(GetCenter().x-2,GetCenter().y-2-gui_style_0.fontSize*0.4f,0,0),text,gui_style_0);
			GUI.color = color;
			GUI.Label(new Rect(GetCenter().x,GetCenter().y-gui_style_0.fontSize*0.4f,0,0),text,gui_style_0);

		}//draw_text
	}
	
	private Rect GetPixelInset() {
		Vector2 position = GetCenter();
		Vector2 size = GetSize();
		return new Rect( position.x-size.x/2.0f, position.y-size.y/2.0f, size.x, size.y );
	}
	
	private Vector2 GetCenter() {
		Vector3 position = transform.position;
		return new Vector2( position.x*Screen.width, position.y*Screen.height );
	}
	
	private Vector2 GetSize() {
		Vector3 scale = transform.localScale;
		float displaySize = (Screen.width + Screen.height)/2.0f;
		return new Vector2(displaySize*scale.x, displaySize*scale.y);
	}
	
	public bool IsDownPressed() {
		return downPressed;
	}
	
	public bool IsPressed() {
		return pressed;
	}
	
	public Vector2 GetPointPressed() {
		return pointPressed;
	}
}