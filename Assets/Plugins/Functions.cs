using UnityEngine;
using System.Collections;

public class Functions : MonoBehaviour
{
    public static Vector3 Angle180(Vector3 _rot)
    {
        Vector3 temp_angle = _rot;

        if (temp_angle.x > 180) { temp_angle.x -= 360; }
        else if (temp_angle.x < -180) { temp_angle.x += 360; }
        if (temp_angle.y > 180) { temp_angle.y -= 360; }
        else if (temp_angle.y < -180) { temp_angle.y += 360; }
        if (temp_angle.z > 180) { temp_angle.z -= 360; }
        else if (temp_angle.z < -180) { temp_angle.z += 360; }
        return temp_angle;
    }
    public static Vector3 Angle180Abs(Vector3 _rot)
    {
        Vector3 temp_angle = _rot;

        if (temp_angle.x > 180) { temp_angle.x -= 360; }
        else if (temp_angle.x < -180) { temp_angle.x += 360; }
        if (temp_angle.y > 180) { temp_angle.y -= 360; }
        else if (temp_angle.y < -180) { temp_angle.y += 360; }
        if (temp_angle.z > 180) { temp_angle.z -= 360; }
        else if (temp_angle.z < -180) { temp_angle.z += 360; }

        temp_angle.x = Mathf.Abs(temp_angle.x);
        temp_angle.y = Mathf.Abs(temp_angle.y);
        temp_angle.z = Mathf.Abs(temp_angle.z);
        return temp_angle;
    }
    public static float AngleSingle180(float _rot)
    {
        float angle = _rot;
        if (angle > 180) { angle -= 360; }
        else if (angle < -180) { angle += 360; }
        return angle;
    }
    public static float AngleSingle180Abs(float _rot)
    {
        float angle = _rot;
        if (angle > 180) { angle -= 360; }
        else if (angle < -180) { angle += 360; }
        return Mathf.Abs(angle);
    }
    public static Vector3 Direction(Vector3 _rot)
    {
        Quaternion _rotQ = Quaternion.Euler(_rot);
        Vector3 _dir;
        _dir.x = 2 * (_rotQ.x * _rotQ.z - _rotQ.y * _rotQ.w);
        _dir.z = 2 * (_rotQ.z * _rotQ.z + _rotQ.w * _rotQ.w) - 1;
        _dir.y = 2 * (_rotQ.y * _rotQ.z + _rotQ.x * _rotQ.w);
        return _dir;
    }

    public static bool HitArea(Vector3 _pos1, Vector3 _pos2, float _area_x, float _area_z)
    {
        if (_pos1.x > _pos2.x - _area_x && _pos1.x < _pos2.x + _area_x &&
           _pos1.z > _pos2.z - _area_z && _pos1.z < _pos2.z + _area_z)
        { return true; }
        else { return false; }
    }//HitArea

    public static bool HitAreaOut(Vector3 _pos1, Vector3 _pos2 , float _area_x, float _area_z)
    {
        if (_pos1.x < _pos2.x - _area_x || _pos1.x > _pos2.x + _area_x ||
           _pos1.z < _pos2.z - _area_z || _pos1.z > _pos2.z + _area_z)
        { return true; }
        else { return false; }
    }//HitAreaOut
}