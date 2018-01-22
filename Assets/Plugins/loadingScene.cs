using UnityEngine;
using System.Collections;

public class loadingScene : MonoBehaviour {
	
	private AsyncOperation percent;
	private int locationIndex=0;
	
	public GUITexture mainTexture;
	public int careerMode=0;
	public int careerProgress=0;
	//	public GUITexture footerUp;
	//	public GUITexture footerBottom;
	//	public GUITexture loadingBar;
	// Use this for initialization
	private IEnumerator Start () {
		
		Vector3 mainTexturePos = mainTexture.transform.position;
		mainTexturePos.z=-1;
		mainTexture.transform.position = mainTexturePos;
		mainTexture.pixelInset = new Rect(-Screen.width/2, -Screen.height/2, Screen.width, Screen.height);
		//		footerUp.pixelInset = new Rect(Screen.width/2 - Screen.width*0.7f, Screen.height/2-Screen.width*0.7f*0.268f, Screen.width*0.7f, Screen.width*0.7f*0.268f);
		//		footerBottom.pixelInset = new Rect(-Screen.width/2, -Screen.height/2, Screen.width, Screen.width*0.19f);
		//		loadingBar.pixelInset = new Rect(-Screen.width/2, -Screen.height/2, Screen.width, Screen.height);
		
		careerMode = PlayerPrefs.GetInt("careerMode");
		careerProgress = PlayerPrefs.GetInt("careerProgress");
		
		if (careerMode != 1)
		{
			if (PlayerPrefs.GetInt("locationIndex")==10)
			{
				percent = Application.LoadLevelAsync ("derbytrack4");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==11)
			{
				percent = Application.LoadLevelAsync ("derbytrack2");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==12)
			{
				percent = Application.LoadLevelAsync ("round1-2");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==20)
			{
				percent = Application.LoadLevelAsync ("derbytrack3");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==21)
			{
				percent = Application.LoadLevelAsync ("derbytrack4");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==22)
			{
				percent = Application.LoadLevelAsync ("round2-2");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==30)
			{
				percent = Application.LoadLevelAsync ("derbytrack5");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==31)
			{
				percent = Application.LoadLevelAsync ("derbytrack6");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==32)
			{
				percent = Application.LoadLevelAsync ("round3-2");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==40)
			{
				percent = Application.LoadLevelAsync ("round4");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==41)
			{
				percent = Application.LoadLevelAsync ("round4-1");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==42)
			{
				percent = Application.LoadLevelAsync ("round4-2");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==50)
			{
				percent = Application.LoadLevelAsync ("round5");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==51)
			{
				percent = Application.LoadLevelAsync ("round5-1");
				yield return percent;
			}
			if (PlayerPrefs.GetInt("locationIndex")==52)
			{
				percent = Application.LoadLevelAsync ("round5-2");
				yield return percent;
			}
		}
		if (careerMode==1)
		{
			int temp = Random.Range(0, 2);
			if (careerProgress<20)
			{
				if (temp==0)
				{
					percent = Application.LoadLevelAsync ("derbytrack");
					yield return percent;
				}
				if (temp==1)
				{
					percent = Application.LoadLevelAsync ("derbytrack2");
					yield return percent;
				}
				if (temp==2)
				{
					percent = Application.LoadLevelAsync ("round1-2");
					yield return percent;
				}
			}
			if (careerProgress>19 && careerProgress<30)
			{
				if (temp==0)
				{
					percent = Application.LoadLevelAsync ("derbytrack3");
					yield return percent;
				}
				if (temp==1)
				{
					percent = Application.LoadLevelAsync ("derbytrack4");
					yield return percent;
				}
				if (temp==2)
				{
					percent = Application.LoadLevelAsync ("round2-2");
					yield return percent;
				}
			}
			if (careerProgress>29 && careerProgress<40)
			{
				if (temp==0)
				{
					percent = Application.LoadLevelAsync ("derbytrack5");
					yield return percent;
				}
				if (temp==1)
				{
					percent = Application.LoadLevelAsync ("derbytrack6");
					yield return percent;
				}
				if (temp==2)
				{
					percent = Application.LoadLevelAsync ("round3-2");
					yield return percent;
				}
			}
			if (careerProgress>39 && careerProgress<50)
			{
				if (temp==0)
				{
					percent = Application.LoadLevelAsync ("round4");
					yield return percent;
				}
				if (temp==1)
				{
					percent = Application.LoadLevelAsync ("round4-1");
					yield return percent;
				}
				if (temp==2)
				{
					percent = Application.LoadLevelAsync ("round4-2");
					yield return percent;
				}
			}
			if (careerProgress>49)
			{
				if (temp==0)
				{
					percent = Application.LoadLevelAsync ("round5");
					yield return percent;
				}
				if (temp==1)
				{
					percent = Application.LoadLevelAsync ("round5-1");
					yield return percent;
				}
				if (temp==2)
				{
					percent = Application.LoadLevelAsync ("round5-2");
					yield return percent;
				}
			}
		}

		// Application.LoadLevel ("Scene_0");
	}
	
	// Update is called once per frame
	void Update () {
		
			if (percent != null)
		{	
			GetComponent<GUIText>().text = Mathf.Round(percent.progress*100).ToString();
			//			Debug.Log(percent.progress);
		}	
	}
	void OnGUI()
	{
		if (percent != null)
		{
			GUI.Box(new Rect(0, Screen.height-150, Mathf.Round(Screen.width*percent.progress), 150), "Loading... " + (percent.progress*100).ToString()+"%");

		}
	}
}
