using UnityEngine;
using System.Collections;
[ExecuteInEditMode]
public class gui_label : MonoBehaviour {
	public Texture2D texture;
	[SerializeField]private bool proporce;
	[SerializeField]private bool center;
	[SerializeField]private bool Shadow;
	
	[SerializeField]private float shadow_size=0.3f;
	[SerializeField]private float font_size;
	[SerializeField]private int depth;
    public float alpha=1;
	public string text;
	[SerializeField]private Vector2 font_position;
	[SerializeField]private Vector2 text_max_size;
	public GUIStyle gui_style;
	
	private Vector2 position;
	private Vector2 size;
	private Vector2 center_pos;
	private Vector2 font_pos;
	private float scale;
	private Rect rect;
	
	
	void Update () {
		scale=(Screen.width + Screen.height)/3;
		position = new Vector2 (Screen.width * transform.localPosition.x, Screen.height * transform.localPosition.y);
		if(proporce)size=new Vector2 (scale*transform.localScale.x,scale*transform.localScale.y);
		else size=new Vector2 (Screen.width*transform.localScale.x,Screen.height*transform.localScale.y);
		if(center) center_pos=-size/2;
		else{center_pos=Vector2.zero;}
		rect = new Rect (position.x+center_pos.x,position.y+center_pos.y,size.x,size.y);
		font_pos=new Vector2 (size.x*font_position.x,size.y*font_position.y);
		if (gui_style!=null&&gui_style.wordWrap) {
			gui_style.fixedWidth = size.x * text_max_size.x;
			gui_style.fixedHeight = size.y * text_max_size.y;
		}//wordWrap
	}//Update
	
	void OnGUI() {
		Color temp_color=Color.white;
		GUI.depth = depth;
		temp_color.a = alpha;
		GUI.color=temp_color;
		if(texture)GUI.DrawTexture (rect, texture);
		
		
		if (gui_style != null) {
			gui_style.fontSize=(int)(scale/100*(1+font_size));
			
			if(Shadow){
				GUI.color=Color.black;
				GUI.Label ( new Rect (rect.position.x+font_pos.x+(shadow_size*scale)/1000,rect.position.y+font_pos.y+(shadow_size*scale)/1000,rect.width,rect.height), text, gui_style);	
			}//Shadow
			GUI.color=Color.white;
			GUI.Label (new Rect (rect.position.x+font_pos.x,rect.position.y+font_pos.y,rect.width,rect.height), text, gui_style);		
		}//gui_style_text
	}//OnGUI
}
