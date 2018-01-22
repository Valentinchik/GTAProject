using UnityEngine;
using System.Collections;

public class OIAB_window : MonoBehaviour {
[SerializeField]private Transform input;
[SerializeField]private gui_button2 button_close;
[SerializeField]private gui_button2[] button;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
if(button_close.down_pressed) { gameObject.SetActive(false);input.gameObject.SetActive(true); }
	for(int i = 0; i < button.Length; i++){
if(button[i].down_pressed)transform.parent.GetComponent<Billing>().buy_button(i);
        }//for
	}
}
