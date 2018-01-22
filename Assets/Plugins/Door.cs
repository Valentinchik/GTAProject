using UnityEngine;
using System.Collections;

public class Door : MonoBehaviour
{
    private Rigidbody _rigidbody;
    private BoxCollider _collider;
    private HingeJoint _join;
    private JointSpring spring;
    private JointLimits limits;
    private float timer;
    private Info info_sc;
    private Vector3 angle;
    private Vector3 _position;
    private ClassVehiclePlace place;
    private ClassVehicleDoor type;
    private int direction;

    public int open;
    public bool activate;
    public bool _open;
    public float velo;

    private Vector3 tempVector;
    public Vector3 Vector(float x, float y, float z)
    {
        tempVector.x = x;
        tempVector.y = y;
        tempVector.z = z;
        return tempVector;
    }

    void Start()
    {
        angle = transform.localEulerAngles;
        _position = transform.localPosition;
        spring = _join.spring;
        limits = _join.limits;
    }//Start

    void Update()
    {
        if (activate && !_join)
        {
            Destroy(GetComponent<Door>());
            place.door = null;
        }
        if (activate && _join)
        {
            if (Mathf.Abs(_join.angle - 0) < 25) { _open = false; } else { _open = true; }
            if (open == 1 && Mathf.Abs(_join.angle - _join.limits.max) < 5) { timer += Time.deltaTime; if (timer >= 3) { OpenFalse(); } }
            if (open != 1 && _join.velocity > 10 * direction * -1 && _join.angle * direction < 2) { CloseFalse(); }
            velo = _join.angle;
        }//activate
    }//Update

    public void Open()
    {
        if (!activate)
        {
            Activate();
            AudioSource.PlayClipAtPoint(type.sound_open, transform.position, 0.5f);
        }
        _join.useSpring = true;
        spring.spring = 300;
        spring.targetPosition = _join.limits.max;
        timer = 0;
        open = 1;
    }//function

    public void OpenFalse()
    {
        _join.useSpring = false;
        timer = 0;
        open = 0;
    }//function

    public void CloseFalse()
    {
        AudioSource.PlayClipAtPoint(type.sound_close, transform.position, 0.5f);
        Destroy(_join);
        Destroy(_collider);
        Destroy(_rigidbody);
        Destroy(GetComponent<Door>());
        transform.localEulerAngles = angle;
        transform.localPosition = _position;
    }//function


    public void Close()
    {
        _join.useSpring = true;
        spring.spring = 1000;
        spring.targetPosition = 0;
        timer = 0;
        open = 2;
    }//function


    public void Activate()
    {
        activate = true;
        _rigidbody = gameObject.AddComponent(typeof(Rigidbody)) as Rigidbody;
        _collider = gameObject.AddComponent(typeof(BoxCollider)) as BoxCollider;
        _join = gameObject.AddComponent(typeof(HingeJoint)) as HingeJoint;
        //_collider.material=
        _rigidbody.mass = 80;
        _rigidbody.angularDrag = 20;
        _collider.size = Vector(0.15f, 0.6f, 1.1f);
        _collider.center = Vector(direction * (_collider.size.x / 2), _collider.center.y, -_collider.size.z / 2);
        _join.connectedBody = transform.root.GetComponent<Rigidbody>();
        _join.axis = new Vector3(0, 1, 0);
        _join.useLimits = true;
        limits.min = 0;
        limits.max = 60 * direction;
        Invoke("Break", 0.1f);
    }//Activate

    public void Break()
    {
        _join.breakForce = 2000;
        _join.breakTorque = 2000;
    }//Break

    public void Setting(int _type, ClassVehiclePlace _place, int _direction)
    {
        info_sc = GameObject.Find("Game").GetComponent<Info>();
        type = info_sc.vehicle_door[_type];
        place = _place;
        direction = _direction;
    }//function
}
