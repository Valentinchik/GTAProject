#pragma strict
public var collision : Transform;

function OnTriggerEnter (_collision : Collider) 
    {
        if(_collision && !_collision.GetComponent(sc_trigger) && !_collision.GetComponent(sc_collider_creator))
        {
            collision=_collision.transform;
        }

    }//OnTriggerEnter

function OnTriggerExit (_collision : Collider) 
{
collision=null;
}