using UnityEngine;
using System.Collections;
using System;
[ExecuteInEditMode]
public class ButtonMoney : MonoBehaviour {
	[SerializeField]private int money=500;

	private bool proporce=false;
	private bool center=false;
	[SerializeField]private bool Shadow;
	[SerializeField]private bool shadow_button;
	
	[SerializeField]private float shadow_size=0.3f;
	[SerializeField]private float font_size;
	[SerializeField]private float alpha=1;
	[SerializeField]private Vector2 font_position;
	public Texture2D texture;
	[SerializeField]private AudioClip sound;
	[SerializeField]private GUIStyle gui_style_text;
	[SerializeField] private Color
		normalColor = Color.white,
		pressedColor = Color.gray;
	
	public string text;
	private string temp_text;

	[SerializeField] private InputManager input_script;

	[HideInInspector]public bool pressed;
	[HideInInspector]public bool down_pressed;
	[HideInInspector]public bool button_pressed;
	
	private Vector2 position;
	private Vector2 size;
	private Vector2 center_pos;
	private Vector2 font_pos;
	private float scale;
	private Rect rect;
	private bool  intrnetAn;
	void Start () {
		//AdmobAd.Instance().LoadInterstitialAd(true);
		StartCoroutine(wwwGETUrl());
		temp_text = text;
	}
	
	void LateUpdate () {
		pressed = false;
		down_pressed = false;
		
		scale=(Screen.width + Screen.height)/3;
		position = new Vector2 (Screen.width * transform.localPosition.x, Screen.height * transform.localPosition.y);
		if(proporce)size=new Vector2 (scale*transform.localScale.x,scale*transform.localScale.y);
		else size=new Vector2 (Screen.width*transform.localScale.x,Screen.height*transform.localScale.y);
		if(center) center_pos=-size/2;
		else{center_pos=Vector2.zero;}
		rect = new Rect (position.x+center_pos.x,position.y+center_pos.y,size.x,size.y);
		font_pos=new Vector2 (size.x*font_position.x,size.y*font_position.y);
		#if (UNITY_EDITOR || UNITY_STANDALONE_OSX || UNITY_STANDALONE_WIN || UNITY_STANDALONE_LINUX || UNITY_STANDALONE || UNITY_WEBPLAYER)
		if(Input.GetMouseButton(0)) {
			Vector2 mouse = Input.mousePosition;
			mouse.y = Screen.height - mouse.y;
			if( rect.Contains(mouse) ) {
				if( Input.GetMouseButtonDown(0) ) down_pressed = true;
				pressed = true;
			}
		}
		#endif
		
		foreach(Touch touch in Input.touches) {
			Vector2 touchPosition = touch.position;
			touchPosition.y = Screen.height - touchPosition.y;
			if( rect.Contains(touchPosition) ) {
				if( touch.phase == TouchPhase.Began ) down_pressed = true;
				pressed = true;
				break;
			}//Contains
		}//foreach
		if(down_pressed){
			if(transform.GetComponent<AudioSource>())transform.GetComponent<AudioSource>().Play();
			else if(sound)AudioSource.PlayClipAtPoint(sound,transform.position);}

		if(down_pressed)Show();
	}//Update
	
	public void EnabledFalse(){
		pressed = false;
		down_pressed = false;
		enabled = false;
	}//Enabled
	
	public bool IsDownPressed() {return down_pressed;}
	
	void OnGUI() {
		if (texture != null && shadow_button) {
			Color temp_color_shadow = Color.black;
			temp_color_shadow.a=0.5f;
			GUI.color = temp_color_shadow;
			GUI.DrawTexture(new Rect (rect.position.x+shadow_size,rect.position.y+shadow_size,rect.width,rect.height),texture);
			
		}//shadow_button
		
		Color temp_color = normalColor;
		if(pressed)temp_color=pressedColor;
		temp_color.a = alpha;
		GUI.color = temp_color;
		
		
		if(texture!=null)GUI.DrawTexture(rect,texture);
		GUI.color=Color.white;
		if (gui_style_text != null) {
			gui_style_text.fontSize=(int)(scale/100*(1+font_size));
			
			if(Shadow){
				GUI.color=Color.black;
				GUI.Label ( new Rect (rect.position.x+font_pos.x+(shadow_size*scale)/1000,rect.position.y+font_pos.y+(shadow_size*scale)/1000,rect.width,rect.height), text, gui_style_text);	
			}//Shadow
			GUI.color=Color.white;
			GUI.Label (new Rect (rect.position.x+font_pos.x,rect.position.y+font_pos.y,rect.width,rect.height), text, gui_style_text);		
		}//gui_style_text
	}//OnGUI

	void Show(){
		if(!intrnetAn)return;
		if(input_script)input_script.money_bonus=money;
		else 
		PlayerPrefs.SetInt("money",PlayerPrefs.GetInt("money")+money);
		//AdmobAd.Instance().ShowInterstitialAd();
		this.enabled = false;
		Invoke ("ButtonTrue", 60);
	}//Show




	IEnumerator wwwGETUrl() {
		
		WWW www = new WWW("http://www.google.com");
		yield return www;
		
		if (!String.IsNullOrEmpty(www.error))
		{
			this.enabled=false;
			intrnetAn = false;
		}else{
			intrnetAn = true;
			this.enabled=true;
		}
	}

	void ButtonTrue(){
		this.enabled = true;
	}//
}


