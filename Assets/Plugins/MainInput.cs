using UnityEngine;
using System.Collections;
using CnControls;
using UnityEngine.UI;

public class MainInput : MonoBehaviour
{
    public int AddMoneyCheet = 0;
    public Player PlayerScript;
    public int MoneyPlayer
    {
        get
        {
            return PlayerPrefs.GetInt("moneyPlayer");
        }
        set
        {
            PlayerPrefs.SetInt("moneyPlayer", PlayerPrefs.GetInt("moneyPlayer") + value);
            StartCoroutine(MoneyPlayerAdd(value));
        }
    }

    private int playerHealth;
    public int PlayerHealth
    {
        get
        {
            return playerHealth;
        }
        set
        {
            playerHealth = value;
            MainElements.HealthBar.fillAmount = (float)playerHealth / ManController.MaxHealthPlayer;
        }
    }

    public int PlayerArmor
    {
        get
        {
            return PlayerPrefs.GetInt("armorCount");
        }
        set
        {
            PlayerPrefs.SetInt("armorCount", value);
            MainElements.ArmorBar.fillAmount = (float)value / ManController.MaxArmorPlayer;
        }
    }


    public MainElementsClass MainElements;
    public ManControllerClass ManController;

    [ContextMenu("AddMoney")]
    public void AddMoneyPlayer()
    {
        MoneyPlayer = AddMoneyCheet;
    }

    IEnumerator MoneyPlayerAdd(int count)
    {
        MainElements.MoneyText.text = MoneyPlayer + " $";
        if(count > 0)
        {
            MainElements.MoneyAddText.color = MainElements.MoneyAdd;
            MainElements.MoneyAddText.text = "+" + count + " $";
            MainElements.MoneyAddText.gameObject.SetActive(true);
        }
        else if(count < 0)
        {
            MainElements.MoneyAddText.color = MainElements.MoneyDec;
            MainElements.MoneyAddText.text = count + " $";
            MainElements.MoneyAddText.gameObject.SetActive(true);
        }
        MainElements.MoneyPanel.gameObject.SetActive(true);
        yield return new WaitForSeconds(3);
        MainElements.MoneyPanel.gameObject.SetActive(false);
        MainElements.MoneyAddText.gameObject.SetActive(false);
    }

    void Start()
    {
        PlayerHealth = ManController.MaxHealthPlayer;
        PlayerArmor = PlayerArmor;
    }

    void Update()
    {
        UpdateFunctions();
    }

    void UpdateFunctions()
    {
        if(PlayerScript.man_script.doing == "sit_vehicle")
        {
            if(!MainElements.ActionButton.activeSelf)
                MainElements.ActionButton.SetActive(true);
        }
        else if(!MainElements.ActionButton.activeSelf && PlayerScript.man_script.TrigPlayer.collision && PlayerScript.man_script.doing != "go_out_vehicle" && PlayerScript.man_script.doing != "go_to_vehicle")
        {
            MainElements.ActionButton.SetActive(true);
        }
        else if(MainElements.ActionButton.activeSelf && !PlayerScript.man_script.TrigPlayer.collision)
        {
            MainElements.ActionButton.SetActive(false);
        }
    }
}
