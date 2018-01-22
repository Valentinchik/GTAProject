using UnityEngine;
using System.Collections;

public class Object_death : MonoBehaviour
{

    public int health = 1000;
    Transform object1;
    Transform object_death;
    AudioClip sound_death;

    public void Damage(int _power)
    {
        health -= _power;
        if (health <= 0)
        {
            if (sound_death) AudioSource.PlayClipAtPoint(sound_death, transform.position, 1);
            if (object1) object1.gameObject.SetActive(false);
            if (object_death) object_death.gameObject.SetActive(true);
        }//health
    }//
}