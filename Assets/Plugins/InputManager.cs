using UnityEngine;
using System.Collections;

public class InputManager : MonoBehaviour {

	public Transform man_control;
	public Transform car_control;
	public Transform car_shop;
	public Transform weapon_shop;
	public Transform menu;

	public  ClassMenuLanguage[] button_menu_name;

	public int language_num;

	public  Vector2
		movement,
		view;
	public int money_bonus;

[HideInInspector]public  bool
jump,
run,
use,
sit_car,
fire,
fire_down,
fire_end,
aim,
weapon_next,
weapon_previous,
pause,
inventory,
camera,
car_forward,
car_back,
car_left,
car_right,	
car_next,
car_previous,	
car_buy,
factory_buy,
weapon_buy;

	public gui_button2
		resumeButton,
		menuButton,
		exitButton,
		houseSaveButton;

	public Button
jumpButton,
runButton,
useButton,
sitCarButton,
fireButton,
aimButton,
weaponNextButton,
weaponPreviousButton,
pauseButton,
inventoryButton,
cameraButton,

carForwardButton,
carBackButton,
carLeftButton,
carRightButton,
carNextButton,
carPreviousButton,
carBuyButton,
weaponBuyButton,
factoryBuyButton,
		houseBuyButton,
		backCameraButton;




	public gui_label
		money,
		money_add,
	label_0,
	label_1,
	label_2,
	label_3,
	label_4;

	public Joystick movementJoystick;
	public in_joystick movementJoystick1,movementJoystick2;

	private Vector3 rotation;


void Start () {
		//AdmobAd.Instance().LoadInterstitialAd(true);
		if(PlayerPrefs.GetInt("right_joystick")==1)movementJoystick2.enabled=true;
		language_num=PlayerPrefs.GetInt("language");

		resumeButton.text = button_menu_name [language_num].language [0];
		menuButton.text = button_menu_name [language_num].language [1];
		exitButton.text = button_menu_name [language_num].language [2];

	}//Start

void Update () {
		if (!pause) {

			// movement = new Vector2 (movementJoystick.GetOffset ().x, -movementJoystick.GetOffset ().y) * 1.50f;
			movement = movementJoystick1.GetDirection();
			if(movementJoystick2.GetDirection ().magnitude>0){
				Vector2 temp_view=movementJoystick2.GetDirection ();
				view.x = temp_view.x*0.7f;
				if(Mathf.Abs(temp_view.y)>0.7f)view.y = -temp_view.y*0.2f;
			}//movementJoystick2
			else view=GetRotation();

			jump = jumpButton.IsDownPressed ();
						run = runButton.IsDownPressed ();
						use = useButton.IsDownPressed ();
						sit_car = sitCarButton.IsDownPressed ();
						fire = fireButton.IsPressed ();
                        fire_down = fireButton.IsDownPressed ();
						aim = aimButton.IsDownPressed ();
						weapon_next = weaponNextButton.IsDownPressed ();
						weapon_previous = weaponPreviousButton.IsDownPressed ();
						inventory = inventoryButton.IsDownPressed ();
						camera = cameraButton.IsDownPressed ();

						car_forward = carForwardButton.IsPressed ();
						car_back = carBackButton.IsPressed ();
						car_left = carLeftButton.IsPressed ();
						car_right = carRightButton.IsPressed ();
						car_next = carNextButton.IsDownPressed ();
						car_previous = carPreviousButton.IsDownPressed ();
						car_buy = carBuyButton.IsDownPressed ();
						weapon_buy = weaponBuyButton.IsDownPressed ();

			//factory_buy = factoryBuyButton.IsDownPressed ();

				}//pause
		else {
			movement = new Vector2(0,0);

			fire = false;
			car_forward = false;
			car_back = false;
			car_left = false;
			car_right = false;
				}





		if(pauseButton.IsDownPressed ()&&!menu.gameObject.active){
			//AdmobAd.Instance().ShowInterstitialAd();
			Time.timeScale = 0;
			pause=true;
			menu.gameObject.SetActive(true);}

		if (resumeButton.down_pressed) {
			resumeButton.down_pressed=false;
			Time.timeScale = 1;
			pause=false;
			menu.gameObject.SetActive(false);}
		else if (menuButton.down_pressed) {
			Time.timeScale = 1;
			Application.LoadLevel ("Menu");}
		else if (exitButton.down_pressed) { //AdmobAd.Instance().ShowInterstitialAd();
			Time.timeScale = 1;
			Application.Quit ();}
				
}//Update



	Vector2 GetRotation () {
		#if (UNITY_ANDROID || UNITY_IOS) && !UNITY_EDITOR
		Vector2 delta = rotation;
		delta.x = delta.x * 400 / Screen.width;
		delta.y = delta.y * 100 / Screen.height;
		delta.x = Mathf.Clamp( delta.x, -2, 2 );
		delta.y = Mathf.Clamp( delta.y, -2, 2 );
		return delta;
		#else
		if( !Input.GetMouseButton(1) ) return Vector2.zero; 
		float dx = Input.GetAxis( "Mouse X" )*4;
		float dy = Input.GetAxis( "Mouse Y" )*4;
		return new Vector2(dx, dy);
		#endif
	}

	void LateUpdate() {
		rotation = Vector3.zero;
		foreach(Touch touch in Input.touches) {


			if (touch.position.x > Screen.width/3.5f&&touch.position.x < Screen.width-Screen.width/7 ) {
				rotation = touch.deltaPosition;
				break;
			}
		}
	}
}