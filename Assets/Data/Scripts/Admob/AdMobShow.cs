using UnityEngine;
using System.Collections;

public class AdMobShow : MonoBehaviour {
[SerializeField]private int timer;
[SerializeField]private int draw_timer;
[SerializeField]private string text;
[SerializeField]private gui_label label;
private float show_timer;
void Start () {
//AdmobAd.Instance().LoadInterstitialAd(true);
Invoke("ActivateShow",timer);	
}//Start
	

void Update () {
if(show_timer>0) {
show_timer-=Time.deltaTime;
label.text=text+Mathf.Ceil(show_timer);
if(show_timer<=0) {
Show();
label.enabled=false;
show_timer=0; 
}//show_timer             
}//show_timer	
}//Update

void ActivateShow() {
show_timer= draw_timer;
label.enabled=true;
}//ActivateShow

void Show() {
//AdmobAd.Instance().ShowInterstitialAd();
Invoke("ActivateShow",timer);	
}//Show
}
