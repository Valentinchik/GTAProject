using UnityEngine;
using System.Collections;

public class optionsScript : MonoBehaviour {
	
	public GUITexture mainTexture;
	public GUIStyle fast;
	public GUIStyle good;
	public GUIStyle fantastik;
	public GUIStyle buttons;
	public GUIStyle gyro;
	public GUIStyle back;

	public GUITexture mainTextureEng;
	public GUIStyle fastEng;
	public GUIStyle goodEng;
	public GUIStyle fantastikEng;
	public GUIStyle buttonsEng;
	public GUIStyle gyroEng;
	public GUIStyle backEng;

	public int isEnglish=1;

	// Use this for initialization
	void Start () {
		
		Vector3 mainTexturePos = mainTexture.transform.position;
		mainTexturePos.z=-8;
		mainTexture.transform.position = mainTexturePos;
		mainTexture.pixelInset = new Rect(-Screen.width/2, -Screen.height/2, Screen.width, Screen.height);

		mainTexturePos.z=-8;
		mainTextureEng.transform.position = mainTexturePos;
		mainTextureEng.pixelInset = new Rect(-Screen.width/2, -Screen.height/2, Screen.width, Screen.height);
		if (!PlayerPrefs.HasKey("isButtons"))
		{
			PlayerPrefs.SetInt("isButtons", 1);
		}
		if (PlayerPrefs.HasKey("isEnglish"))
		{
			isEnglish = PlayerPrefs.GetInt("isEnglish");
		}
		if (isEnglish==1)
		{
			mainTexture.gameObject.SetActive(false);
		}
		else 
		{
			mainTextureEng.gameObject.SetActive(false);
		}
	}
	
	// Update is called once per frame
	void Update () {
		
	}
	
	void OnGUI()
	{
		AutoResize(480, 320);
		AudioListener.volume = GUI.HorizontalSlider(new Rect(120, 210, 240, 40),  AudioListener.volume, 0, 1);
		if (isEnglish==1)
		{
			if (GUI.Toggle(new Rect(195, 60, 90, 35), QualitySettings.currentLevel == QualityLevel.Fastest, "",fastEng))
			{
				QualitySettings.currentLevel = QualityLevel.Fastest;
			}
			if (GUI.Toggle(new Rect(195, 90, 90, 35), QualitySettings.currentLevel == QualityLevel.Good, "",goodEng))
			{
				QualitySettings.currentLevel = QualityLevel.Good;
			}
			if (GUI.Toggle(new Rect(195, 120, 90, 35), QualitySettings.currentLevel == QualityLevel.Beautiful, "",fantastikEng))
			{
				QualitySettings.currentLevel = QualityLevel.Beautiful;
			}
			/*		if (GUI.Toggle(new Rect(195, 170, 90, 35), PlayerPrefs.GetInt("isButtons")==1,  "Buttons", buttons))
			{
				PlayerPrefs.SetInt("isButtons", 1);
			}
			if (GUI.Toggle(new Rect(195, 200, 90, 35), PlayerPrefs.GetInt("isButtons")==1, "Gyro",gyro))
			{
				PlayerPrefs.SetInt("isButtons", 0);
			}*/
			
			if (GUI.Button (new Rect (5, 275, 80, 40), "",backEng))
			{
				Application.LoadLevel("mainMenu"); 
			} 
		}
		if (isEnglish==0)
		{
			if (GUI.Toggle(new Rect(195, 60, 90, 35), QualitySettings.currentLevel == QualityLevel.Fastest, "",fast))
			{
				QualitySettings.currentLevel = QualityLevel.Fastest;
			}
			if (GUI.Toggle(new Rect(195, 90, 90, 35), QualitySettings.currentLevel == QualityLevel.Good, "",good))
			{
				QualitySettings.currentLevel = QualityLevel.Good;
			}
			if (GUI.Toggle(new Rect(195, 120, 90, 35), QualitySettings.currentLevel == QualityLevel.Beautiful, "",fantastik))
			{
				QualitySettings.currentLevel = QualityLevel.Beautiful;
			}
			/*		if (GUI.Toggle(new Rect(195, 170, 90, 35), PlayerPrefs.GetInt("isButtons")==1,  "Buttons", buttons))
			{
				PlayerPrefs.SetInt("isButtons", 1);
			}
			if (GUI.Toggle(new Rect(195, 200, 90, 35), PlayerPrefs.GetInt("isButtons")==1, "Gyro",gyro))
			{
				PlayerPrefs.SetInt("isButtons", 0);
			}*/
			
			if (GUI.Button (new Rect (5, 275, 80, 40), "",back))
			{
				Application.LoadLevel("mainMenu"); 
			} 
		}
	}
	
	void AutoResize(float screenWidth, float screenHeight)
	{
		Vector3 resizeRatio = new Vector3(Screen.width / screenWidth, Screen.height / screenHeight, 1);
		GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, resizeRatio);
	}
	
}
