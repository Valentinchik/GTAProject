using UnityEngine;
using UnityEditor;
using System.Collections;

[CustomEditor(typeof(CarPoint))]
[CanEditMultipleObjects]
public class CarPointEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();
        CarPoint targetMissionRoot = (CarPoint)target;
    }

    void OnSceneGUI()
    {
        CarPoint targetMissionRoot = (CarPoint)target;
        if (Event.current.type != EventType.keyDown) return;
        if (Event.current.keyCode == KeyCode.P)
        {
            Ray worldRay = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition);
            RaycastHit hit;
            if (Physics.Raycast(worldRay, out hit))
            {
                GUIUtility.GUIToScreenPoint(Event.current.mousePosition);
                GameObject nextPoint = Instantiate(Resources.Load<GameObject>("CarPoint"), hit.point, Quaternion.identity, targetMissionRoot.transform.parent) as GameObject;
                CarPoint point = nextPoint.GetComponent<CarPoint>();
                targetMissionRoot.transform.LookAt(nextPoint.transform);
                targetMissionRoot.NextPoints.Add(point);
                Selection.activeObject = nextPoint;
                Selection.activeGameObject = nextPoint;
            }
        }
    }
}
