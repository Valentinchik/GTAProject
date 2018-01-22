using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[System.Serializable]
public class ClassMenuLanguage : System.Object
{
	public Texture2D[] image;
	public string[] language;
}//ClassMenuLanguage

public class Menu : MonoBehaviour {
	//public List<Transform> mans;
	public int language_num;
	public int quality_num;
	public gui_button2[] button;
	public gui_button2[] button_lan;
	public gui_button2[] button_opt;
	public gui_button2[] button_graphics_opt;
	public gui_button2[] button_game_opt;
	public gui_button2[] button_new_game;
	public gui_label label_new_game;
	public Transform menu;
	public Transform language;
	public Transform options;
	public Transform graphics_options;
	public Transform game_options;
	public Transform new_game;
	public GUIStyle gui_style_0;
	public GUISkin style;

	public  ClassMenuLanguage[] button_name;
	public  ClassMenuLanguage[] lan_button_name;
	public  ClassMenuLanguage[] opt_button_name;
	public  ClassMenuLanguage[] opt_video_name;
	public  ClassMenuLanguage[] opt_game_name;
	public  ClassMenuLanguage[] new_game_name;
	private int car_count;
	private int man_count;
	private int traffic_timer;
	private int camera_distance;
	private int touch_speed;
	// Use this for initialization
	void Start () {
		if (PlayerPrefs.GetInt ("select_language") == 1){language_num = PlayerPrefs.GetInt ("language");} 
		else {PlayerPrefs.SetInt ("language",language_num);}
		if(!PlayerPrefs.HasKey("car_count"))PlayerPrefs.SetInt ("car_count",10);
		if(!PlayerPrefs.HasKey("man_count"))PlayerPrefs.SetInt ("man_count",10);
		if(!PlayerPrefs.HasKey("camera_distance"))PlayerPrefs.SetInt ("camera_distance",200);
		if(!PlayerPrefs.HasKey("touch_speed"))PlayerPrefs.SetInt ("touch_speed",50);
		car_count=PlayerPrefs.GetInt ("car_count");
		man_count=PlayerPrefs.GetInt ("man_count");
		traffic_timer=PlayerPrefs.GetInt ("traffic_timer");
		camera_distance=PlayerPrefs.GetInt ("camera_distance");
		touch_speed=PlayerPrefs.GetInt ("touch_speed");
        if(!PlayerPrefs.HasKey ("quality"))PlayerPrefs.SetInt ("quality",3);
		QualitySettings.currentLevel = (QualityLevel)PlayerPrefs.GetInt ("quality");
	}//Start
	
	// Update is called once per frame
	void Update () {
		if(Input.GetKeyDown(KeyCode.E)) {
			Application.LoadLevel ("Loading");}
		if (menu.gameObject.active) {
						for (int i=0; i<button.Length; i++) {
						button [i].texture = button_name [language_num].image [i];
								if (button [i].down_pressed) {
										ButtonPressed (i);
								}
						}//for
		}//active
		else if (language.gameObject.active) {
			for (int i=0; i<button_lan.Length; i++) {
				button_lan [i].text = lan_button_name [language_num].language [i];
				if (button_lan [i].down_pressed) {
					if(i==2){
						options.gameObject.SetActive(true);
						language.gameObject.SetActive(false);
					}//i
					else {PlayerPrefs.SetInt("select_language",1);language_num=i;PlayerPrefs.SetInt("language",i);}
				}
			}//for
		}//active
		else if (options.gameObject.active) {
			for (int i=0; i<button_opt.Length; i++) {
				button_opt [i].text = opt_button_name [language_num].language [i];
				if (button_opt [i].down_pressed) {
					if(i==0){
						graphics_options.gameObject.SetActive(true);
						options.gameObject.SetActive(false);
					}//i
					else if(i==1){
						game_options.gameObject.SetActive(true);
						options.gameObject.SetActive(false);
					}//i
					else if(i==2){
						language.gameObject.SetActive(true);
						options.gameObject.SetActive(false);
					}//i
					else if(i==3){
						menu.gameObject.SetActive(true);
						options.gameObject.SetActive(false);
					}//i

				}
			}//for
		}//active
		else if (graphics_options.gameObject.active) {
			for (int i=0; i<button_graphics_opt.Length; i++) {
				button_graphics_opt [i].text = opt_video_name [language_num].language [i];
				if(PlayerPrefs.GetInt ("quality")==i)button_graphics_opt [i].normalColor=Color.yellow;
				else button_graphics_opt [i].normalColor=Color.white;
				if (button_graphics_opt [i].IsDownPressed ()) {
					if(i<6){
						PlayerPrefs.SetInt ("quality", i);
						QualitySettings.currentLevel =(QualityLevel)PlayerPrefs.GetInt ("quality");

					}//2

					else if(i==6){
						options.gameObject.SetActive(true);
						graphics_options.gameObject.SetActive(false);
					}//3

				}
			}//for

		}//active
		else if (game_options.gameObject.active) {
			string temp_text="";
			if(PlayerPrefs.GetInt ("car_damage")==0)temp_text=opt_game_name [language_num].language [5];
			else if(PlayerPrefs.GetInt ("car_damage")==1)temp_text=opt_game_name [language_num].language [4];
			string temp_text1="";
			if(PlayerPrefs.GetInt ("right_joystick")==0)temp_text1=opt_game_name [language_num].language [5];
			else if(PlayerPrefs.GetInt ("right_joystick")==1)temp_text1=opt_game_name [language_num].language [4];


			button_game_opt [0].text = opt_game_name [language_num].language [2]+": "+temp_text;
			button_game_opt [2].text = opt_game_name [language_num].language [7]+": "+temp_text1;
			button_game_opt [1].text = opt_game_name [language_num].language [3];
			for (int i=0; i<button_game_opt.Length; i++) {


				//button_game_opt [0].text =PlayerPrefs.GetInt ("car_damage").ToString();
				//button_game_opt [1].text =PlayerPrefs.GetInt ("car_color").ToString();
				//button_game_opt [2].text =PlayerPrefs.GetInt ("create_man").ToString();
				if (button_game_opt [i].down_pressed) {
					/*
					if(i==0){
						if(PlayerPrefs.GetInt ("car_damage")==0)PlayerPrefs.SetInt ("car_damage",1);
						else PlayerPrefs.SetInt ("car_damage",0);
					}//0
					if(i==1){
						if(PlayerPrefs.GetInt ("car_color")==0)PlayerPrefs.SetInt ("car_color",1);
						else PlayerPrefs.SetInt ("car_color",0);
					}//1
					if(i==2){
						if(PlayerPrefs.GetInt ("create_man")==0)PlayerPrefs.SetInt ("create_man",1);
						else PlayerPrefs.SetInt ("create_man",0);
					}//2
					else if(i==3){
						options.gameObject.SetActive(true);
						game_options.gameObject.SetActive(false);
						PlayerPrefs.SetInt ("car_count",car_count);
						PlayerPrefs.SetInt ("man_count",man_count);
						PlayerPrefs.SetInt ("traffic_timer",traffic_timer);
					}//3
					*/
					if(i==0){
						if(PlayerPrefs.GetInt ("car_damage")==0)PlayerPrefs.SetInt ("car_damage",1);
						else PlayerPrefs.SetInt ("car_damage",0);
					}//
					else if(i==1){
						options.gameObject.SetActive(true);
						game_options.gameObject.SetActive(false);
						PlayerPrefs.SetInt ("car_count",car_count);
						PlayerPrefs.SetInt ("man_count",man_count);
						PlayerPrefs.SetInt ("traffic_timer",traffic_timer);
						PlayerPrefs.SetInt ("camera_distance",camera_distance);
						PlayerPrefs.SetInt ("touch_speed",touch_speed);
					}//3
					else if(i==2){
						if(PlayerPrefs.GetInt ("right_joystick")==0)PlayerPrefs.SetInt ("right_joystick",1);
						else PlayerPrefs.SetInt ("right_joystick",0);
					}//
				}
			}//for
			
		}//active

		else if (new_game.gameObject.active) {
			button_new_game [0].text = new_game_name [language_num].language [0];
			button_new_game [1].text = new_game_name [language_num].language [1];
			label_new_game.text = new_game_name [language_num].language [2];
			if(button_new_game [0].down_pressed){
				PlayerPrefs.SetInt ("mission", 0);
				PlayerPrefs.SetInt ("money", 1000);
				
				for (var i=0;i<100;i++)	{PlayerPrefs.SetInt("weapon_"+i,0);}//for
				for (var j=0;j<10;j++)	{PlayerPrefs.SetInt("car_"+j,0);}//for
				for (var f=0;f<20;f++)	{
					PlayerPrefs.SetInt("factory"+f,0);
					PlayerPrefs.SetInt("factory_money_"+f,0);
					PlayerPrefs.SetInt("house"+f,0);}//for
				PlayerPrefs.SetInt("start_house",0);
				PlayerPrefs.SetInt("house0",1);
				PlayerPrefs.SetInt("armor",0);
				Time.timeScale = 1;
				Application.LoadLevel ("Loading");
			}
			if(button_new_game [1].down_pressed){
				menu.gameObject.SetActive(true);
				new_game.gameObject.SetActive(false);}
		}
	}//Update

	void ButtonPressed (int _num) {
		if (_num == 0) {
			menu.gameObject.SetActive(false);
			new_game.gameObject.SetActive(true);

				}//0
		else if (_num == 1 ) {
			            Time.timeScale = 1;
						Application.LoadLevel ("Loading");
				}//1

		//else if (_num == 2) {
		//				menu.gameObject.SetActive (false);
		//				language.gameObject.SetActive (true);
		//		}//2
		else if (_num == 2) {
						menu.gameObject.SetActive (false);
						options.gameObject.SetActive (true);
				}//3
		else if (_num == 3) {
			Application.OpenURL("https://play.google.com/store/apps/details?id=com.EG.MadCityCrime");
				}//4
		else if (_num == 4) {
			Application.OpenURL("https://play.google.com/store/apps/developer?id=Extereme+Games");
		}//5
		else if (_num == 5) {
			Application.Quit ();
		}//6
		else if (_num == 6) {
			menu.gameObject.SetActive (false);
			game_options.gameObject.SetActive (true);
		}//3

	}//ButtonPressed

	void OnGUI(){
		if(game_options.gameObject.active){
			gui_style_0.fontSize=(int)((Screen.width+Screen.height)*0.03f);
			float temp_size=Screen.width/4;
			Vector2 temp_pos=new Vector2(Screen.width/8,0);

			GUI.skin = style;
			GUI.color=Color.black;
			GUI.Label (new Rect(temp_pos.x+temp_size/2+4, Screen.height/30+4, Screen.width/3, Screen.height/3),opt_game_name [language_num].language [0]+": "+car_count,gui_style_0);
			GUI.color=Color.white;
			GUI.Label (new Rect(temp_pos.x+temp_size/2, Screen.height/30, Screen.width/3, Screen.height/3),opt_game_name [language_num].language [0]+": "+car_count,gui_style_0);
			car_count= (int)GUI.HorizontalSlider(new Rect(temp_pos.x-temp_size/2, Screen.height/30, temp_size, 50), car_count, 0, 50);
		
			GUI.color=Color.black;
			GUI.Label (new Rect(temp_pos.x+temp_size/2+4, Screen.height/5+4, Screen.width/3, Screen.height/3),opt_game_name [language_num].language [1]+": "+man_count,gui_style_0);
			GUI.color=Color.white;
			GUI.Label (new Rect(temp_pos.x+temp_size/2, Screen.height/5, Screen.width/3, Screen.height/3),opt_game_name [language_num].language [1]+": "+man_count,gui_style_0);
			man_count= (int)GUI.HorizontalSlider(new Rect(temp_pos.x-temp_size/2, Screen.height/5, temp_size, 50), man_count, 0, 50);

			GUI.color=Color.black;
			GUI.Label (new Rect(temp_pos.x+temp_size/2+4, Screen.height/2.8f+4, Screen.width/3, Screen.height/3),opt_game_name [language_num].language [6]+": "+camera_distance,gui_style_0);
			GUI.color=Color.white;
			GUI.Label (new Rect(temp_pos.x+temp_size/2, Screen.height/2.8f, Screen.width/3, Screen.height/3),opt_game_name [language_num].language [6]+": "+camera_distance,gui_style_0);
			camera_distance= (int)GUI.HorizontalSlider(new Rect(temp_pos.x-temp_size/2, Screen.height/2.8f, temp_size, 50), camera_distance, 0, 300);

			
			GUI.color=Color.black;
			GUI.Label (new Rect(temp_pos.x+temp_size/2+4, Screen.height/1.95f+4, Screen.width/3, Screen.height/3),opt_game_name [language_num].language [8]+": "+touch_speed,gui_style_0);
			GUI.color=Color.white;
			GUI.Label (new Rect(temp_pos.x+temp_size/2, Screen.height/1.95f, Screen.width/3, Screen.height/3),opt_game_name [language_num].language [8]+": "+touch_speed,gui_style_0);
			touch_speed= (int)GUI.HorizontalSlider(new Rect(temp_pos.x-temp_size/2, Screen.height/1.95f, temp_size, 50), touch_speed, 1, 100);

			//GUI.Label (new Rect(Screen.width/2+temp_size/2, Screen.height/2.5f, Screen.width/3, Screen.height/3),"TIMER: "+traffic_timer,gui_style_0);
			//traffic_timer= (int)GUI.HorizontalSlider(new Rect(Screen.width/2-temp_size/2, Screen.height/2.5f, temp_size, 50), traffic_timer, 0, 10);

		}//game_options
		/*
		if (options.gameObject.active) {
						gui_style_0.fontSize = (int)((Screen.width + Screen.height) * 0.02f);
			GUI.color = Color.black;
						GUI.Label (new Rect (Screen.width / 2.2f, Screen.height / 100, 100, 100), opt_video_name [language_num].language [0], gui_style_0);
			GUI.color = Color.white;
			            GUI.Label (new Rect (Screen.width / 2.2f+2, Screen.height / 100+2, 100, 100), opt_video_name [language_num].language [0], gui_style_0);
		}//options*/
	}
}
