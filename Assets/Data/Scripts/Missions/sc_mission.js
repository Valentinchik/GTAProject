#pragma strict
import UnityEngine;
import System.Collections;
import System.Collections.Generic;
var money : int;

public var event : List.<ClassMission> = new List.<ClassMission> ();
private var misssion_objects : List.<ClassMissionObject> = new List.<ClassMissionObject> ();
private var current_event : ClassMission;
public var editor_event : ClassMission;
public var mission_complete : ClassNextEvent;
public var mission_failed : ClassNextEvent;

private var num_event : int;

var script_mission : sc_missions;
private var timer : float;
private var timer_sound : int=1;

private var game_ob : Transform;
private var game_sc : sc_game;
private var player_sc : sc_player;
function Start () {
    game_ob=GameObject.Find("Game").transform;
    game_sc=game_ob.GetComponent(sc_game);
    player_sc=game_ob.GetComponent(sc_player);
    if(!script_mission)script_mission=transform.parent.GetComponent(sc_missions);
}//Start

function Update () {
    if(current_event!=null&&num_event<event.Count){

        if(current_event&&current_event.next_event.activate)UpdateNextEvent(current_event,current_event.next_event,0);
        if(current_event&&current_event.mission_complete.activate)UpdateNextEvent(current_event,current_event.mission_complete,1);
        if(current_event&&current_event.mission_failed.activate)UpdateNextEvent(current_event,current_event.mission_failed,2);

        if(current_event&&mission_complete.activate)UpdateNextEvent(current_event,mission_complete,1);
        if(current_event&&mission_failed.activate)UpdateNextEvent(current_event,mission_failed,2);
    }//current_event
}//Update

function NextEvent(_type : int){
    if(_type==1){MissionComplate(true,money);return false;}
    else if(_type==2){MissionComplate(false,0);return false;}
    else {num_event++;
        SetEvent(num_event);}
}//NextEvent

    function SetEvent(_index : int){
        var temp_mission_object : ClassMissionObject=new ClassMissionObject();
        var temp_event : ClassMission=event[_index];

        if(temp_event.draw_text)script_mission.DrawHelp(temp_event.text);

        //CREATE CAR
        if(temp_event.create.create_car.Count>0){
            var temp_car : Transform;
            var temp_class : ClassCarCreate;
            for (var i=0;i<temp_event.create.create_car.Count;i++)	{
                temp_class=temp_event.create.create_car[i];
                temp_car=script_mission.CreateObject(temp_class.car,temp_class.point.position,temp_class.point.eulerAngles,temp_class.minimap_icon);
                temp_mission_object.car.Add(temp_car);
                temp_car.GetComponent(sc_vehicle).dellete=false;
                if(temp_class.health_bar)temp_car.GetComponent(sc_vehicle).health_bar=temp_class.health_bar;
                if(temp_class.racer){temp_car.gameObject.AddComponent(sc_racer);temp_car.GetComponent(sc_racer).script_mission=this;}
            }//for
        }//car


        //CREATE MAN
        if(temp_event.create.create_man.Count>0){
            var temp_man : Transform;
            var temp_class1 : ClassManCreate;
            for (var i1=0;i1<temp_event.create.create_man.Count;i1++)	{
                temp_class1=temp_event.create.create_man[i1];
                temp_man=script_mission.CreateObject(temp_class1.man,temp_class1.point.position,temp_class1.point.eulerAngles,temp_class1.minimap_icon);
                temp_mission_object.man.Add(temp_man);
                temp_man.GetComponent(sc_man).dellete=false;
                temp_man.GetComponent(sc_bot).enabled=false;
                //weapon
                if(temp_class1.weapon>0){
                    temp_man.GetComponent(sc_weapon).WeaponGive(script_mission.weapon_type[temp_class1.weapon],false,0,0);
                    temp_man.GetComponent(sc_weapon).WeaponSelectType(script_mission.weapon_type[temp_class1.weapon]);
                    if(!temp_man.GetComponent(sc_band)&&!temp_man.GetComponent(sc_man).cop){
                        temp_man.GetComponent(sc_man).team=4;
                        temp_man.gameObject.AddComponent(sc_band);}}
                //health
                if(temp_class1.health>0)temp_man.GetComponent(sc_man).health=temp_class1.health;
            }//for
        }//man

        //CREATE OBJECT
        if(temp_event.create.create_object.Count>0){
            var temp_object : Transform;
            var temp_class2 : ClassObjectCreate;
            for (var i2=0;i2<temp_event.create.create_object.Count;i2++)	{
                temp_class2=temp_event.create.create_object[i2];
                if(temp_class2.object){
                    temp_object=script_mission.CreateObject(temp_class2.object,temp_class2.point.position,temp_class2.point.eulerAngles,temp_class2.minimap_icon);
                    temp_mission_object.object.Add(temp_object);
                }//objetc
                else if(temp_class2.point&&temp_class2.minimap_icon>0){
                    game_sc.DeleteMinimapObject(temp_class2.point,null);
                    game_sc.CreateMinimapObject(temp_class2.minimap_icon,temp_class2.point,temp_class2.point.position);
                }//else
            }//for
        }//object

        current_event=event[num_event];
        current_event.objects=temp_mission_object;


        //EDIT CAR
        if(temp_event.edit.car.Count>0){
            var temp_car1 : Transform;
            var temp_class_ce : ClassCarEdit;
            var temp_event1 : ClassMission;
            for (var j=0;j<temp_event.edit.car.Count;j++)	{
                temp_class_ce=temp_event.edit.car[j];
                temp_event1=temp_event;
                if(temp_class_ce.other_event)temp_event1=event[temp_class_ce.event];

                if(temp_event1.objects.car.Count>temp_class_ce.car){
                    if(temp_event1.objects.car[temp_class_ce.car]){
                        temp_car1=temp_event1.objects.car[temp_class_ce.car];
                        //damage
                        if(temp_class_ce.damage>0){
                            temp_car1.GetComponent(sc_vehicle).invoke_damage=temp_class_ce.damage;
                            temp_car1.GetComponent(sc_vehicle).Invoke("InvokeDamage",0.1f);}//damage
                        //health
                        if(temp_class_ce.health>0)temp_car1.GetComponent(sc_vehicle).health=temp_class_ce.health;
                        //set_position
                        if(temp_class_ce.set_position)temp_car1.position=temp_class_ce.set_position.position;
                        //minimap icon
                        if(temp_class_ce.delete_minimap_icon)game_sc.DeleteMinimapObject(temp_car1,null);
                        if(temp_class_ce.minimap_icon>0){
                            game_sc.DeleteMinimapObject(temp_car1,null);
                            game_sc.CreateMinimapObject(temp_class_ce.minimap_icon,temp_car1,temp_car1.position);}
                        //engine start
                        if(temp_class_ce.engine_start){
                            temp_car1.GetComponent(sc_vehicle_bot).enabled=true;
                            temp_car1.GetComponent(sc_vehicle).Invoke("EngineStart",0.1);}
                        //go to target
                        if(temp_class_ce.go_to_target&&temp_class_ce.target_point){
                            if(temp_car1.GetComponent(sc_vehicle).sirena){temp_car1.GetComponent(sc_vehicle).sirena.gameObject.SetActive(true);}
                            temp_car1.GetComponent.<Rigidbody>().velocity=temp_car1.transform.TransformDirection(Vector3.forward*20);
                            temp_car1.GetComponent(sc_vehicle).throttle=1;
                            temp_car1.GetComponent(sc_vehicle_bot).go_to_target=true;
                            temp_car1.GetComponent(sc_vehicle_bot).stop_on_target=temp_class_ce.stop_on_target;
                            temp_car1.GetComponent(sc_vehicle_bot).target_pos=temp_class_ce.target_point.position;}
                        //health_bar
                        if(temp_class_ce.health_bar)temp_car1.GetComponent(sc_vehicle).health_bar=temp_class_ce.health_bar;
                    }//car
                }//Count
            }//for
        }//EDIT CAR

        //EDIT MAN
        if(temp_event.edit.man.Count>0){
            var temp_man1 : Transform;
            var temp_class_me : ClassManEdit;
            var temp_event2 : ClassMission;
            for (var j1=0;j1<temp_event.edit.man.Count;j1++)	{
                temp_class_me=temp_event.edit.man[j1];
                temp_event2=temp_event;
                if(temp_class_me.other_event)temp_event2=event[temp_class_me.event];

                if(temp_event2.objects.man.Count>temp_class_me.man){
                    if(temp_event2.objects.man[temp_class_me.man]){
                        temp_man1=temp_event2.objects.man[temp_class_me.man];
                        //DAMAGE
                        if(temp_class_me.damage>0){
                            temp_man1.GetComponent(sc_man).invoke_damage=temp_class_me.damage;
                            temp_man1.GetComponent(sc_man).Invoke("InvokeDamage",0.1f);
                        }//damage
                        //HEALTH
                        if(temp_class_me.health>0)temp_man1.GetComponent(sc_man).health=temp_class_me.health;
                        //TEAM
                        if(temp_class_me.team>-1)temp_man1.GetComponent(sc_man).team=temp_class_me.team;
                        //SET POSITION
                        if(temp_class_me.set_position)temp_man1.position=temp_class_me.set_position.position;
                        //MINI MAP
                        if(temp_class_me.delete_minimap_icon)game_sc.DeleteMinimapObject(temp_man1,null);
                        if(temp_class_me.minimap_icon>0){
                            game_sc.DeleteMinimapObject(temp_man1,null);
                            game_sc.CreateMinimapObject(temp_class_me.minimap_icon,temp_man1,temp_man1.position);}
                        //WEAPON
                        if(temp_class_me.weapon>0){
                            temp_man1.GetComponent(sc_weapon).WeaponGive(script_mission.weapon_type[temp_class_me.weapon],false,0,0);
                            temp_man1.GetComponent(sc_weapon).WeaponSelectType(script_mission.weapon_type[temp_class_me.weapon]);
                            if(!temp_man1.GetComponent(sc_band)&&!temp_man1.GetComponent(sc_man).cop)temp_man1.gameObject.AddComponent(sc_band);}

                        //AI
                        //temp_man1.GetComponent(sc_bot).enabled=temp_class_me.AI;
                        //PLAYER BOSS
                        if(temp_class_me.player_boss && !temp_class_me.player_is_enemy){
                            temp_man1.GetComponent(sc_bot).enabled=true;
                            if(!temp_man1.GetComponent(sc_band))temp_man1.gameObject.AddComponent(sc_band);
                            temp_man1.GetComponent(sc_band).boss=script_mission.player;}
                        else if(temp_class_me.player_boss && temp_class_me.player_is_enemy)
                        {
                            temp_man1.GetComponent(sc_man).enemy=script_mission.player;
                            temp_man1.GetComponent(sc_man).runing=true;
                            temp_man1.GetComponent(sc_bot).enabled=true;
                            temp_man1.GetComponent(sc_bot).target_pos=script_mission.player.position;
                            temp_man1.GetComponent(sc_bot).have_point=false;
                            temp_man1.GetComponent(sc_bot).doing="run";
                        }
                        //GO TO TARGET
                        if(temp_class_me.go_to_target&&temp_class_me.target_point){
                            if(temp_class_me.run)temp_man1.GetComponent(sc_man).runing=true;
                            temp_man1.GetComponent(sc_bot).enabled=true;
                            temp_man1.GetComponent(sc_bot).target_pos=temp_class_me.target_point.position;
                            temp_man1.GetComponent(sc_bot).have_point=false;
                            temp_man1.GetComponent(sc_bot).doing="run";}
                        //PLAYER ENEMY
                        if(temp_class_me.player_is_enemy)temp_man1.GetComponent(sc_man).enemy=script_mission.player;

                        //GET OUT CAR
                        if(temp_class_me.get_out_car)temp_man1.GetComponent(sc_man).GoOutVehicle();
                            //SIT CAR
                        else if(temp_class_me.sit_car.sit_car){
                            var temp_sit_car : Transform;
                            var temp_event_car : ClassMission=temp_event;
                            if(temp_class_me.sit_car.other_event)temp_event_car=event[temp_class_me.sit_car.event];
                            if(temp_event_car.objects.car.Count>temp_class_me.sit_car.car){
                                temp_sit_car=temp_event_car.objects.car[temp_class_me.sit_car.car];
                                if(temp_sit_car){
                                    temp_man1.GetComponent(sc_man).SitVehicle(temp_sit_car,temp_sit_car.GetComponent(sc_vehicle).place[temp_class_me.sit_car.place],false);

                                    if(temp_class_me.sit_car.engine_start){
                                        temp_sit_car.GetComponent(sc_vehicle_bot).enabled=true;
                                        temp_sit_car.GetComponent(sc_vehicle).Invoke("EngineStart",0.1);}
                                    if(temp_class_me.sit_car.racer)temp_sit_car.GetComponent(sc_vehicle_bot).Invoke("SimpleRacer",0.1);
                                }//car

                            }//count
                        }//sit_car

                            //GO TO CAR
                        else if(temp_class_me.go_to_car.sit_car){
                            var temp_sit_car1 : Transform;
                            var temp_event_car1 : ClassMission=temp_event;
                            if(temp_class_me.go_to_car.other_event)temp_event_car1=event[temp_class_me.go_to_car.event];
                            if(temp_event_car1.objects.car.Count>temp_class_me.go_to_car.car){
                                temp_sit_car1=temp_event_car1.objects.car[temp_class_me.go_to_car.car];
                                if(temp_sit_car1){
                                    temp_man1.GetComponent(sc_man).SitTheVehicle(temp_sit_car1,temp_class_me.go_to_car.set_place,temp_class_me.go_to_car.place,temp_class_me.go_to_car.engine_start);

                                    if(temp_class_me.go_to_car.racer)temp_sit_car1.GetComponent(sc_vehicle_bot).Invoke("SimpleRacer",0.1);
                                }//car

                            }//count
                        }//go_to_car



                    }//man
                }//Count
            }//for
        }//EDIT MAN

        //EDIT OBJECT
        if(temp_event.edit.object.Count>0){
            var temp_object1 : Transform;
            var temp_class_oe : ClassObjectEdit;
            var temp_event_o : ClassMission;
            for (var j2=0;j2<temp_event.edit.object.Count;j2++)	{
                temp_class_oe=temp_event.edit.object[j2];
                temp_event_o=temp_event;
                if(temp_class_oe.other_event)temp_event_o=event[temp_class_oe.event];

                if(temp_event_o.objects.object.Count>temp_class_oe.object){
                    if(temp_event_o.objects.object[temp_class_oe.object]){
                        temp_object1=temp_event_o.objects.object[temp_class_oe.object];

                        //set_position
                        if(temp_class_oe.set_position)temp_object1.position=temp_class_oe.set_position.position;
                        //minimap icon
                        if(temp_class_oe.delete_minimap_icon)game_sc.DeleteMinimapObject(temp_object1,null);
                        if(temp_class_oe.minimap_icon>0){
                            game_sc.DeleteMinimapObject(temp_object1,null);
                            game_sc.CreateMinimapObject(temp_class_oe.minimap_icon,temp_object1,temp_object1.position);}
                        //destroy
                        if(temp_class_oe.destroy)temp_object1.gameObject.SetActive(false);

                    }//object
                }//Count
            }//for
        }//EDIT OBJECT

        //EDIT PLAYER
        if(temp_event.edit.player.team>-1)script_mission.player.GetComponent(sc_man).team=temp_event.edit.player.team;
        if(temp_event.edit.player.set_position){
            script_mission._camera.eulerAngles.y=temp_event.edit.player.set_position.eulerAngles.y;
            script_mission.player.eulerAngles.y=temp_event.edit.player.set_position.eulerAngles.y;
            script_mission.player.position=temp_event.edit.player.set_position.position;}
        if(temp_event.edit.player.police)script_mission.player.GetComponent(sc_man).Danger();
        if(temp_event.edit.player.add_star>0)script_mission.player.GetComponent(sc_man).AddWantedScore(temp_event.edit.player.add_star*100);
        if(temp_event.edit.player.damage>0){
            script_mission.player.GetComponent(sc_man).invoke_damage=temp_event.edit.player.damage;
            script_mission.player.GetComponent(sc_man).Invoke("InvokeDamage",0.1f);
        }//damage

        //EDIT POINT
        if(temp_event.edit.point.point){
            if(temp_event.edit.point.set_position)temp_event.edit.point.point.position=temp_event.edit.point.set_position.position;
            if(temp_event.edit.point.delete_minimap_icon)game_sc.DeleteMinimapObject(temp_event.edit.point.point,null);
            if(temp_event.edit.point.minimap_icon>0){
                game_sc.DeleteMinimapObject(temp_event.edit.point.point,null);
                game_sc.CreateMinimapObject(temp_event.edit.point.minimap_icon,temp_event.edit.point.point,temp_event.edit.point.point.position);}
        }//point
    }//NextEvent

        function UpdateEvent(_event : ClassMission){


        }//UpdateEvent

    function UpdateNextEvent(_event : ClassMission,_next_event : ClassNextEvent,_type : int){
        if(_next_event.next_event){NextEvent(_type);return false;}
        if (_next_event.other_event.activate)_event=event[_next_event.other_event.event];

        //MAN DEATH
        if(_next_event.man_death.Count>0){
            var next_event : boolean=true;
            var next_event_1 : boolean;
            var temp_event1 : ClassMission=_event;
            var temp_mandeath : ClassEventDeath;
            for (var i=0;i<_next_event.man_death.Count;i++)	{
                temp_mandeath=_next_event.man_death[i];
                if(temp_mandeath.other_event)temp_event1=event[temp_mandeath.event];
                if(temp_event1.objects.man.Count>temp_mandeath.object){
                    if(temp_event1.objects.man[temp_mandeath.object].GetComponent(sc_man).health<=0)next_event_1=true;
                    else next_event=false;
                }//Count
                else next_event=false;
            }//for
            if(next_event&&!_next_event.only_one_man_condition)NextEvent(_type);
            else if(next_event_1&&_next_event.only_one_man_condition)NextEvent(_type);
        }//car_death

        //CAR DEATH
        if(_next_event.car_death.Count>0){
            var next_event1 : boolean=true;
            var next_event1_1 : boolean;
            var temp_event : ClassMission=_event;
            var temp_cardeath : ClassEventDeath;
            for (var i1=0;i1<_next_event.car_death.Count;i1++)	{
                temp_cardeath=_next_event.car_death[i1];
                if(temp_cardeath.other_event)temp_event=event[temp_cardeath.event];
                if(temp_event.objects.car.Count>temp_cardeath.object){
                    if(temp_event.objects.car[temp_cardeath.object].GetComponent(sc_vehicle).health<=0)next_event1_1=true;
                    else next_event1=false;
                }//Count
                else next_event1=false;
            }//for
            if(next_event1&&!_next_event.only_one_car_condition)NextEvent(_type);
            else if(next_event1_1&&_next_event.only_one_car_condition)NextEvent(_type);
        }//car_death

        //DISTANCE
        if(_next_event.distance.Count>0){
            var temp_distance_class : ClassMisDistance;
            var temp_pos1 : Vector3;
            var temp_pos2 : Vector3;
            var temp_transform_from : Transform;
            var temp_transform_to : Transform;
            var temp_event_dis1 : ClassMission=_event;
            var temp_event_dis2 : ClassMission=_event;
            var next_event_true1 : boolean=true;
            var next_event_false1 : boolean;
            for (var i3=0;i3<_next_event.distance.Count;i3++)	{
                if(_next_event.add_to_cars){
                    var temp_cars_event : ClassMission=event[_next_event.cars_event];
                    var temp_car : Transform;
                    for (var c=0;c<temp_cars_event.objects.car.Count;c++)	{
                        temp_car=temp_cars_event.objects.car[c];
                        if(temp_car.GetComponent(sc_racer))temp_car.GetComponent(sc_racer).points.Add(_next_event.distance[i3].point_to);
                    }//for
                }//add_to_cars

                if(_next_event.type_distance!=2 || (_next_event.type_distance==2&&i3==_next_event.step)){
                    temp_distance_class=_next_event.distance[i3];
                    if(temp_distance_class.other_event_from)temp_event_dis1=event[temp_distance_class.event_from];
                    if(temp_distance_class.other_event_to)temp_event_dis2=event[temp_distance_class.event_to];
                    //from
                    if(temp_distance_class.from==0)temp_transform_from=script_mission.player;
                    else if(temp_distance_class.from==1)temp_transform_from=temp_distance_class.point_from;
                    else if(temp_distance_class.from==2&&temp_event_dis1.objects.man.Count>temp_distance_class.from_index)
                        temp_transform_from=temp_event_dis1.objects.man[temp_distance_class.from_index];
                    else if(temp_distance_class.from==3&&temp_event_dis1.objects.car.Count>temp_distance_class.from_index)
                        temp_transform_from=temp_event_dis1.objects.car[temp_distance_class.from_index];
                    else if(temp_distance_class.from==4&&temp_event_dis1.objects.object.Count>temp_distance_class.from_index)
                        temp_transform_from=temp_event_dis1.objects.object[temp_distance_class.from_index];
                    //to
                    if(temp_distance_class.to==0)temp_transform_to=script_mission.player;
                    else if(temp_distance_class.to==1)temp_transform_to=temp_distance_class.point_to;
                    else if(temp_distance_class.to==2&&temp_event_dis2.objects.man.Count>temp_distance_class.to_index)
                        temp_transform_to=temp_event_dis2.objects.man[temp_distance_class.to_index];
                    else if(temp_distance_class.to==3&&temp_event_dis2.objects.car.Count>temp_distance_class.to_index)
                        temp_transform_to=temp_event_dis2.objects.car[temp_distance_class.to_index];
                    else if(temp_distance_class.to==4&&temp_event_dis2.objects.object.Count>temp_distance_class.to_index)
                        temp_transform_to=temp_event_dis2.objects.object[temp_distance_class.to_index];

                    if(temp_transform_from)temp_pos1=temp_transform_from.position;
                    if(temp_transform_to)temp_pos2=temp_transform_to.position;
                    if(_next_event.type_distance==2&&temp_transform_to){
                        if(_next_event.step_minimap_icon>0&&!temp_distance_class.step_icon){
                            var temp_icon : int=_next_event.step_minimap_icon;
                            if(i3>=_next_event.distance.Count-1)temp_icon=MisMiniMapIcon.green_big;
                            game_sc.CreateMinimapObject(temp_icon,temp_transform_to,Vector3.zero);
                            if(_next_event.distance.Count>i3+1)
                                temp_distance_class.point_to.eulerAngles=Quaternion.LookRotation(_next_event.distance[i3+1].point_to.position-temp_distance_class.point_to.position).eulerAngles;
                            temp_distance_class.step_icon=true;}}


                    var temp_distance : float=Vector3.Distance(temp_pos1,temp_pos2);
                    if(temp_distance_class.greater){
                        if(temp_distance>temp_distance_class.distance || temp_distance_class.collect)next_event_false1=true;
                        else next_event_true1=false;}
                    else{
                        if(temp_distance<temp_distance_class.distance|| temp_distance_class.collect){
                            if((_next_event.type_distance==1 || _next_event.type_distance==2)&&!temp_distance_class.collect){
                                if(_next_event.collect_delete_minimap){
                                    //game_sc.DeleteMinimapObject(temp_transform_from,null);
                                    game_sc.DeleteMinimapObject(temp_transform_to,null);
                                }//collect_delete_minimap

                                if(_next_event.collect_destroy_object){
                                    if(temp_distance_class.from==4&&temp_transform_from)temp_transform_from.gameObject.SetActive(false);
                                    if(temp_distance_class.to==4&&temp_transform_to)temp_transform_to.gameObject.SetActive(false);
                                }//destroy

                                if(_next_event.collect_audio)AudioSource.PlayClipAtPoint(_next_event.collect_audio, temp_transform_to.position,1);
                                temp_distance_class.collect=true;
                                if(_next_event.type_distance==2){
                                    game_sc.DeleteMinimapObject(temp_transform_to,null);
                                    _next_event.step++;}
                            }//collect

                            next_event_false1=true;
                            if(temp_distance_class.player_not_car&&(temp_distance_class.from==0 || temp_distance_class.to==0)&&
                            (script_mission.player.GetComponent(sc_man).doing=="sit_vehicle" || script_mission.player.GetComponent(sc_man).doing=="go_to_vehicle" || 
                            script_mission.player.GetComponent(sc_man).doing=="go_out_vehicle"))next_event_true1=false;}
                        else next_event_true1=false;}

                }//step
            }//for

            _next_event.add_to_cars=false;

            if(!_next_event.only_one_condition_distance&&next_event_true1)NextEvent(_type);
            else if(_next_event.only_one_condition_distance&&next_event_false1)NextEvent(_type);
        }//Count


        //SIT CAR
        var next_event_true : boolean=true;
        var next_event_false : boolean;
        var temp_player_event : ClassMission=_event;
        if(_next_event.sit_car.player_activate){
            if(_next_event.sit_car.other_event)temp_player_event=event[_next_event.sit_car.event];
            if(script_mission.player.GetComponent(sc_man).doing=="sit_vehicle"&&
            script_mission.player.GetComponent(sc_man).vehicle==temp_player_event.objects.car[_next_event.sit_car.car]){
                if(_next_event.sit_car.player_sit_car)next_event_false=true;
                if(_next_event.sit_car.player_out_car)next_event_true=false;}
            else {
                if(_next_event.sit_car.player_sit_car)next_event_true=false;
                if(_next_event.sit_car.player_out_car)next_event_false=true;}
        }//sit_car
        else if(_next_event.sit_car.man_sit_car.Count==0)next_event_true=false;

        var temp_man_event : ClassMission=_event;
        var temp_car_event : ClassMission=_event;
        if(_next_event.sit_car.man_sit_car.Count>0){
            var temp_sit_car : ClassMSC;

            for (var i2=0;i2<_next_event.sit_car.man_sit_car.Count;i2++)	{
                temp_sit_car=_next_event.sit_car.man_sit_car[i2];
                //if(temp_sit_car.activate){
                if(temp_sit_car.other_event)temp_man_event=event[temp_sit_car.event];
                if(temp_sit_car.car_other_event)temp_car_event=event[temp_sit_car.car_event];
                if(temp_man_event.objects.man[temp_sit_car.man].GetComponent(sc_man).doing=="sit_vehicle"&&
                temp_man_event.objects.man[temp_sit_car.man].GetComponent(sc_man).vehicle==temp_car_event.objects.car[temp_sit_car.car])next_event_false=true;
                else next_event_true=false;
                //}//activate
                //else next_event_true=false;
            }//for
        }//Count
        if(!_next_event.sit_car.only_one_condition&&next_event_true)NextEvent(_type);
        else if(_next_event.sit_car.only_one_condition&&next_event_false)NextEvent(_type);

        if(_next_event.timer>0){
            _next_event.temp_timer+=Time.deltaTime;
            if(_next_event.draw_timer){
                if(!script_mission.label_timer.enabled)script_mission.label_timer.enabled=true;
                if(script_mission.sound_timer&&timer_sound==Mathf.Ceil(_next_event.temp_timer)){
                    AudioSource.PlayClipAtPoint(script_mission.sound_timer,transform.position,1);
                    timer_sound++;}
                var temp_time : int=Mathf.Ceil(_next_event.timer-_next_event.temp_timer);
                var temp_time_text : String=Mathf.Ceil(temp_time/60)+" : "+(temp_time-(Mathf.Ceil(temp_time/60)*60)).ToString();
                script_mission.label_timer.text=temp_time_text;}
            if(_next_event.temp_timer>=_next_event.timer){
                if(script_mission.label_timer.enabled)script_mission.label_timer.enabled=false;
                NextEvent(_type);
                _next_event.temp_timer=0;
                timer_sound=1;
            }//timer
        }//timer

        if(_next_event.drugs){
            var temp_drugs_event : boolean=true;

            if(script_mission.drugs[0].health<=0&&script_mission.drug_points[0].gameObject.active){
                script_mission.drug_points[0].gameObject.SetActive(false);
                game_sc.DeleteMinimapObject(script_mission.drug_points[0],null);}
            if(script_mission.drugs[0].health>0) temp_drugs_event=false;

            if(script_mission.drugs[1].health<=0&&script_mission.drug_points[1].gameObject.active){
                script_mission.drug_points[1].gameObject.SetActive(false);
                game_sc.DeleteMinimapObject(script_mission.drug_points[1],null);}
            if(script_mission.drugs[1].health>0) temp_drugs_event=false;

            if(script_mission.drugs[2].health<=0&&script_mission.drug_points[2].gameObject.active){
                script_mission.drug_points[2].gameObject.SetActive(false);
                game_sc.DeleteMinimapObject(script_mission.drug_points[2],null);}
            if(script_mission.drugs[2].health>0) temp_drugs_event=false;

            if(temp_drugs_event)NextEvent(_type);
        }//drugs

    }//UpdateNextEvent



function MissionComplate(_index : boolean,_money : int){
current_event=null;
num_event=0;
script_mission.MissionComplate(_index,_money,false,false);
misssion_objects.Clear();
script_mission.label_timer.enabled=false;
timer=0;
num_event=0;
timer_sound=1;
}//MissionComplate

    function ClearEvents(){
        ClearEvent(mission_complete);
        ClearEvent(mission_failed);

        var temp_event : ClassMission;
        for (var j=0;j<event.Count;j++)	{
            temp_event=event[j];
            temp_event.objects=new ClassMissionObject();
            ClearEvent(temp_event.next_event);
            ClearEvent(temp_event.mission_complete);
            ClearEvent(temp_event.mission_failed);
        }//event

    }//ClearEvents

function ClearEvent(_event : ClassNextEvent){
_event.step=0;
_event.temp_timer=0;
for (var i=0;i<_event.distance.Count;i++)	{
_event.distance[i].collect=false;
_event.distance[i].step_icon=false;
}//distance
}//ClearEvent

function AddEvent(){
var temp_event : ClassMission=new ClassMission();
event.Add(temp_event);
}//AddEvent

function RemoveEvent(){
if(event.Count>0){
event.RemoveAt(event.Count-1);
}//event.Count
}//AddEvent

function AddCar(_create : ClassCreate){
var temp_car : ClassCarCreate=new ClassCarCreate();
_create.create_car.Add(temp_car);
}//AddCar

function RemoveCar(_create : ClassCreate){
if(_create.create_car.Count>0){
_create.create_car.RemoveAt(_create.create_car.Count-1);
}//event.Count
}//AddCar

function AddMan(_create : ClassCreate){
var temp_man : ClassManCreate=new ClassManCreate();
_create.create_man.Add(temp_man);
}//AddCar

function RemoveMan(_create : ClassCreate){
if(_create.create_man.Count>0){
_create.create_man.RemoveAt(_create.create_man.Count-1);
}//event.Count
}//AddCar

function AddObject(_create : ClassCreate){
var temp_object : ClassObjectCreate=new ClassObjectCreate();
_create.create_object.Add(temp_object);
}//AddCar

function RemoveObject(_create : ClassCreate){
if(_create.create_object.Count>0){
_create.create_object.RemoveAt(_create.create_object.Count-1);
}//event.Count
}//AddCar



function AddEditCar(_edit : ClassEdit){
var temp_car : ClassCarEdit=new ClassCarEdit();
_edit.car.Add(temp_car);
}//AddCar

function RemoveEditCar(_edit : ClassEdit){
if(_edit.car.Count>0){
_edit.car.RemoveAt(_edit.car.Count-1);
}//event.Count
}//AddCar

function AddEditMan(_edit : ClassEdit){
var temp_man : ClassManEdit=new ClassManEdit();
_edit.man.Add(temp_man);
}//AddCar

function RemoveEditMan(_edit : ClassEdit){
if(_edit.man.Count>0){
_edit.man.RemoveAt(_edit.man.Count-1);
}//event.Count
}//AddCar

function AddEditObject(_edit : ClassEdit){
var temp_object : ClassObjectEdit=new ClassObjectEdit();
_edit.object.Add(temp_object);
}//AddCar

function RemoveEditObject(_edit : ClassEdit){
if(_edit.object.Count>0){
_edit.object.RemoveAt(_edit.object.Count-1);
}//event.Count
}//AddCar

function AddDeathObject(_death : List.<ClassEventDeath>){
var temp_object : ClassEventDeath=new ClassEventDeath();
_death.Add(temp_object);
}//AddCar


function RemoveDeathObject(_death : List.<ClassEventDeath>){
if(_death.Count>0){
_death.RemoveAt(_death.Count-1);
}//event.Count
}//AddCar

function AddSitCar(_sit_car : List.<ClassMSC>){
var temp_sit_car : ClassMSC=new ClassMSC();
_sit_car.Add(temp_sit_car);
}//AddSitCar

function RemoveSitCar(_sit_car : List.<ClassMSC>){
if(_sit_car.Count>0){
_sit_car.RemoveAt(_sit_car.Count-1);
}//event.Count
}//RemoveSitCar

function AddDistance(_distance : List.<ClassMisDistance>){
var temp_distance : ClassMisDistance=new ClassMisDistance();
_distance.Add(temp_distance);
}//AddSitCar

function RemoveDistance(_distance : List.<ClassMisDistance>){
if(_distance.Count>0){
_distance.RemoveAt(_distance.Count-1);
}//event.Count
}//RemoveSitCar

