using UnityEngine;

public class LoadLevelOnClick : MonoBehaviour
{
    private void Start()
    {
 
            gameObject.SendMessage("LoadNextLevel");
     }
    
}