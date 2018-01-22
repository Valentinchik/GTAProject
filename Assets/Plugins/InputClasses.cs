using UnityEngine;
using System.Collections.Generic;
using System;
using UnityEngine.UI;
using CnControls;

[Serializable]
public class MainElementsClass
{
    public GameObject MoneyPanel;
    public Text MoneyText;
    public Text MoneyAddText;
    public Color MoneyAdd;
    public Color MoneyDec;
    public GameObject MiniMap;
    public GameObject MainObjectsPanel;
    public Image HealthBar;
    public Image ArmorBar;
    public GameObject WantedBar;
    public GameObject ActionButton;
    public Image BlackFone;
}

[Serializable]
public class ManControllerClass
{
    public int MaxHealthPlayer = 500;
    public int MaxArmorPlayer = 100;
    public GameObject ManControllerPanel;
    public SimpleJoystick SimpJoyst;
    public SimpleButton AimButton;
    public SimpleButton FireButton;
    public GameObject JumpButton;
    public GameObject ParachuteButton;
}
