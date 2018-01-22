using UnityEngine;
using UnityEditor;
using System.Collections;

[CustomEditor(typeof(ManPoint))]
[CanEditMultipleObjects]
public class ManPointEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();
        ManPoint targetMissionRoot = (ManPoint)target;
    }

    void OnSceneGUI()
    {
        ManPoint targetMissionRoot = (ManPoint)target;
        if (Event.current.type != EventType.keyDown) return;
        if (Event.current.keyCode == KeyCode.P)
        {
            Ray worldRay = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition);
            RaycastHit hit;
            if (Physics.Raycast(worldRay, out hit))
            {
                GUIUtility.GUIToScreenPoint(Event.current.mousePosition);
                GameObject nextPoint = Instantiate(Resources.Load<GameObject>("ManPoint"), hit.point, Quaternion.identity, targetMissionRoot.transform.parent) as GameObject;
                ManPoint point = nextPoint.GetComponent<ManPoint>();
                targetMissionRoot.transform.LookAt(nextPoint.transform);
                targetMissionRoot.NextPoints.Add(point);
                Selection.activeObject = nextPoint;
                Selection.activeGameObject = nextPoint;
            }
        }
    }
}
