using UnityEngine;
using System.Collections;
using System.Collections.Generic;


[ExecuteInEditMode]
public class gui_inventory : MonoBehaviour {

	[SerializeField]private int index;
	[SerializeField]private float slot_size=1;
	[SerializeField]private float slot_step;
	[SerializeField]private float font_size=1;
	[SerializeField]private float shadow_size=0.3f;
	public Vector2 scale; 
	[SerializeField]private Vector2 scroll_size=new Vector2(0.1f,0.1f);
	[SerializeField]private Vector2 back_round_size=new Vector2(0.01f,0.01f);
	[SerializeField]private Vector2 scrollPosition; 

	[SerializeField]private bool shadow;
    [SerializeField]private bool select=true;
	[SerializeField]private Texture2D texture;
	[SerializeField]private Texture2D texture_select;
	[SerializeField]private AudioClip sound;
	[SerializeField]private GUISkin skin_0; 
	[SerializeField]private GUIStyle gui_style_text;
    [SerializeField]private GUIStyle gui_style_text1;
    
    public string text;
	public List<Texture2D> objects = new List<Texture2D>();
    public List<string> price = new List<string>();
    public List<string> name = new List<string>();
	public int select_num;
    public bool down_pressed;

	public void Reset(){
		objects= new List<Texture2D>();
        price= new List<string>();
        name= new List<string>();
		select_num = 0;
		scrollPosition = Vector2.zero;
	}//Reset



	void OnGUI() {
        down_pressed=false;
		float temp_size_shadow=((Screen.width+Screen.height)*0.0005f)*shadow_size;
		float temp_slot_step=((Screen.width+Screen.height)*0.0005f)*slot_step;
		
		Vector2 temp_position=new Vector2(Screen.width*transform.localPosition.x,Screen.height*transform.localPosition.y);
		Vector2 temp_slot_size=new Vector2(Screen.width*slot_size,Screen.height*slot_size);
		Vector2 temp_scroll_size=new Vector2(Screen.width*scroll_size.x,Screen.height*scroll_size.y);
		Vector2 temp_back_round_size=new Vector2(Screen.width*back_round_size.x,Screen.height*back_round_size.y);
		Vector2 temp_size=new Vector2(Screen.width*transform.localScale.x,Screen.height*transform.localScale.y);
		Vector2 temp_size1=new Vector2(scale.x*temp_slot_size.x,scale.y*temp_slot_size.x);
		if(texture){GUI.DrawTexture(new Rect (temp_position.x-temp_back_round_size.x,temp_position.y-temp_back_round_size.y,
			                                      temp_size.x+temp_scroll_size.x+temp_back_round_size.x*2,temp_size.y+temp_scroll_size.y+temp_back_round_size.y*2),texture);}
		
		if(skin_0){
			GUI.skin = skin_0;
			skin_0.verticalScrollbar.fixedWidth=temp_scroll_size.x;
			skin_0.verticalScrollbarThumb.fixedWidth=temp_scroll_size.x;
			skin_0.horizontalScrollbar.fixedHeight=temp_scroll_size.y;
			skin_0.horizontalScrollbarThumb.fixedHeight=temp_scroll_size.y;
		}//skin_0
		
		scrollPosition = GUI.BeginScrollView (new Rect (temp_position.x,temp_position.y,temp_size.x+temp_scroll_size.x,temp_size.y+temp_scroll_size.y),
		                                      scrollPosition,new Rect (0,0, temp_size1.x,temp_size1.y));
		int num=0;
		for (int j=0; j<scale.y; j++) {
			for (int i=0; i<scale.x; i++) {
				
				bool temp_button=GUI.Button (new Rect (temp_slot_size.x*i, temp_slot_size.x*j,temp_slot_size.x,temp_slot_size.x),"");
				
				

				if(objects.Count>0&&num<objects.Count){
					if(select_num>=objects.Count)select_num=objects.Count-1;
					GUI.DrawTexture(new Rect (temp_slot_size.x*i+temp_slot_step, temp_slot_size.x*j+temp_slot_step,temp_slot_size.x-temp_slot_step*2,temp_slot_size.x-temp_slot_step*2),objects[num]);
					if(gui_style_text!=null&&gui_style_text1!=null){
						gui_style_text.fontSize=(int)(((Screen.width + Screen.height)/3)/100*(1+font_size));
                        gui_style_text1.fontSize=(int)(((Screen.width + Screen.height)/3)/100*(1+font_size));
					if(shadow){
						GUI.color=Color.black;
						GUI.Label (new Rect (temp_slot_size.x*i+temp_size_shadow, temp_slot_size.x*j+temp_size_shadow,temp_slot_size.x,temp_slot_size.x), price[num]+text, gui_style_text);
                        GUI.Label (new Rect (temp_slot_size.x*i+temp_size_shadow, temp_slot_size.x*j+temp_size_shadow,temp_slot_size.x,temp_slot_size.x), name[num], gui_style_text1);}
						GUI.color=Color.white;
						GUI.Label (new Rect (temp_slot_size.x*i, temp_slot_size.x*j,temp_slot_size.x,temp_slot_size.x), price[num]+text, gui_style_text);
                        GUI.Label (new Rect (temp_slot_size.x*i, temp_slot_size.x*j,temp_slot_size.x,temp_slot_size.x), name[num], gui_style_text1);
					}//	gui_style_text
                        if(select) { 
						if(num==select_num&&texture_select){
						GUI.DrawTexture(new Rect (temp_slot_size.x*i, temp_slot_size.x*j,temp_slot_size.x,temp_slot_size.x),texture_select);
						}//select_num
						if(temp_button){
                            down_pressed=true;
						if(transform.GetComponent<AudioSource>())transform.GetComponent<AudioSource>().Play();
						else if(sound)AudioSource.PlayClipAtPoint(sound,transform.position,1);
							select_num=num;
						}//temp_button
                        }//select
					}//Count

				num++;
			}//for
		}//for
		GUI.EndScrollView ();
		
	}//OnGUI
}
