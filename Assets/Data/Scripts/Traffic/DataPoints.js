#pragma strict
import System.Collections.Generic;

public var Patches : Patches;
public var ManPoints :  List.<ManPoint> = new List.<ManPoint>();

public var CarData : boolean = false;
public var CarPoints : List.<CarPoint> = new List.<CarPoint>();

@ContextMenu("StoringData")
function StoringData () 
{
    if(!CarData)
    {
        for(var t=0; t<ManPoints.Count; t++)
        {
            ManPoints[t].index = t;
            ManPoints[t].gameObject.name = "ManPoint_" + t;
        }
        Patches.point_man.Clear();
        for(var i=0; i<ManPoints.Count; i++)
        {
            var point : ClassPointMan = new ClassPointMan();
            point.index = ManPoints[i].index;
            point._position = ManPoints[i].transform.position;
            point.rotation = ManPoints[i].transform.eulerAngles;
            point.distance = ManPoints[i].Distance;
            point.create = ManPoints[i].Create;
            for(var j=0; j<ManPoints[i].NextPoints.Count; j++)
            {
                point.near_point.Add(ManPoints[i].NextPoints[j].index);
            }
            Patches.point_man.Add(point);
        }
    }
    else
    {
        for(var k=0; k<CarPoints.Count; k++)
        {
            CarPoints[k].index = k;
            CarPoints[k].gameObject.name = "CarPoint_" + k;
        }
        Patches.point_car.Clear();
        for(var l=0; l<CarPoints.Count; l++)
        {
            var point1 : ClassPointCar = new ClassPointCar();
            point1.index = CarPoints[l].index;
            point1._position = CarPoints[l].transform.position;
            point1._rotation = CarPoints[l].transform.eulerAngles;
            point1.stop = CarPoints[l].Stop;
            for(var m=0; m<CarPoints[l].NextPoints.Count; m++)
            {
                point1.near_point.Add(CarPoints[l].NextPoints[m].index);
            }
            Patches.point_car.Add(point1);
        }
    }
}