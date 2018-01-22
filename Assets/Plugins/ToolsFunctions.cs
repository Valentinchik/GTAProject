using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;

public class ToolsFunctions : MonoBehaviour
{
    public static void SetParentToObject(GameObject obj, Transform parent)
    {
        obj.transform.parent = parent;
        Transform[] allChilds = obj.gameObject.GetComponentsInChildren<Transform>();

        foreach (Transform child in allChilds)
        {
            child.transform.parent = parent;
        }
    }

    public static void PlaySoundAtPosition(AudioClip sound, Vector3 pos, float volume, Transform parent, float minDistance = 1f)
    {
        if (sound == null)
            return;
        GameObject emptyGO = new GameObject(sound.name + "Sound");
        emptyGO.transform.parent = parent;
        emptyGO.transform.position = pos;
        AudioSource source = emptyGO.AddComponent<AudioSource>();
        source.clip = sound;
        source.volume = volume;
        source.minDistance = minDistance;
        source.Play();
        Destroy(emptyGO, sound.length);
    }

    public static int currentStateInfoTag(Animator anim, int layer)
    {
        int hash = anim.GetCurrentAnimatorStateInfo(layer).tagHash;
        return hash;
    }

    public static float currentAnimationTime(Animator anim, int layer)
    {
        float animTime = anim.GetCurrentAnimatorStateInfo(layer).normalizedTime;
        return animTime;
    }

    public static float Round(float value, int digits)
    {
        float mult = Mathf.Pow(10.0f, (float)digits);
        return Mathf.Round(value * mult) / mult;
    }

    public static float TwoDecimals(float value)
    {
        float ret = 0f;
        ret = Mathf.Round(value * 100) / 100;
        return ret;
    }

    public static void RestartScene()
    {
        string currentSceneName = SceneManager.GetActiveScene().name;
        SceneManager.LoadScene(currentSceneName);
    }

    public static bool LowQuality()
    {
        if (QualitySettings.GetQualityLevel() == 0) return true;
        else return false;
    }

    public static bool BestQuality()
    {
        if (QualitySettings.GetQualityLevel() > 2) return true;
        else return false;
    }

    public static void ActivateRigidbody(Transform transform, bool Activate)
    {
        Component[] Rigidbodys = transform.GetComponentsInChildren(typeof(Rigidbody));
        foreach (Rigidbody rigidbody in Rigidbodys)
        {
            rigidbody.isKinematic = !Activate;
        }
        Component[] Colliders = transform.GetComponentsInChildren(typeof(Collider));
        foreach (Collider collider in Colliders)
        {
            collider.enabled = Activate;
        }
    }
}
