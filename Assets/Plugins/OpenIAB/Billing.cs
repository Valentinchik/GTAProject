using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;
using OnePF;


public class Billing : MonoBehaviour {
    [SerializeField]private gui_button2 button; 
	[SerializeField]private Transform window;
    [SerializeField]private Transform input;
    private InputManager input_script; 
	public const string SKU_money_10k = "money_10k";
    public const string SKU_money_25k = "money_25k";
    public const string SKU_money_50k = "money_50k";
    public const string SKU_money_100k = "money_100k";
    public const string SKU_money_1mln = "money_1mln";

	public const string googleKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2oD/ezqp863F4g4N/eFuGWaAFpwwlaJEPxQ5pMVzh1tJWpTWaC7afHfNjZM0FFb03jZ4ArsO7y1UrpDXgmk8BBvXF1dGLKai5vuCfnK8TMZ4UZac6rKndePoobSO7t7s2xOvnvkxblYMhtuPNH17TvwFHZMjQ6+GRIRj8KfIrzFUnAJRpfzfv295DUeDbyYNhDTGCyv/9qt8m6fDLH91GMUL09X97ADCyuaY+EDqKwyVmgQFaCl7Xke0ELmP5YMapQrAJCTrWkNXH5EdK6ymJoqgVkrX3nXhF8uh6NFg88seW1wQ5rfWSFR2q1X3K5uuog4SXpysTw/5pPegct2pTwIDAQAB";

	private void Awake()
	{
		// Подписаться на все биллинговых событий
		OpenIABEventManager.billingSupportedEvent += OnBillingSupported;
		OpenIABEventManager.billingNotSupportedEvent += OnBillingNotSupported;
		OpenIABEventManager.purchaseSucceededEvent += OnPurchaseSucceded;
		OpenIABEventManager.purchaseFailedEvent += OnPurchaseFailed;
		OpenIABEventManager.consumePurchaseSucceededEvent += OnConsumePurchaseSucceeded;
		OpenIABEventManager.consumePurchaseFailedEvent += OnConsumePurchaseFailed;
		OpenIABEventManager.transactionRestoredEvent += OnTransactionRestored;
		OpenIABEventManager.restoreSucceededEvent += OnRestoreSucceeded;
		OpenIABEventManager.restoreFailedEvent += OnRestoreFailed;

		OpenIABEventManager.queryInventorySucceededEvent += ProductDataReceived;
	}


	private void OnDestroy()
	{
		// Отказаться, чтобы избежать неприятных утечки
		OpenIABEventManager.billingSupportedEvent -= OnBillingSupported;
		OpenIABEventManager.billingNotSupportedEvent -= OnBillingNotSupported;
		OpenIABEventManager.purchaseSucceededEvent -= OnPurchaseSucceded;
		OpenIABEventManager.purchaseFailedEvent -= OnPurchaseFailed;
		OpenIABEventManager.consumePurchaseSucceededEvent -= OnConsumePurchaseSucceeded;
		OpenIABEventManager.consumePurchaseFailedEvent -= OnConsumePurchaseFailed;
		OpenIABEventManager.transactionRestoredEvent -= OnTransactionRestored;
		OpenIABEventManager.restoreSucceededEvent -= OnRestoreSucceeded;
		OpenIABEventManager.restoreFailedEvent -= OnRestoreFailed;

		OpenIABEventManager.queryInventorySucceededEvent -= ProductDataReceived;
	}

	void Start() {


		OpenIAB.mapSku(SKU_money_10k, OpenIAB_Android.STORE_GOOGLE, "money_10k");
	    OpenIAB.mapSku(SKU_money_25k, OpenIAB_Android.STORE_GOOGLE, "money_25k");
        OpenIAB.mapSku(SKU_money_50k, OpenIAB_Android.STORE_GOOGLE, "money_50k");
        OpenIAB.mapSku(SKU_money_100k, OpenIAB_Android.STORE_GOOGLE, "money_100k");
        OpenIAB.mapSku(SKU_money_1mln, OpenIAB_Android.STORE_GOOGLE, "money_1mln");

		var options = new OnePF.Options ();
		options.storeKeys.Add (OpenIAB_Android.STORE_GOOGLE, googleKey);
		OpenIAB.init (options);

		//OpenIAB.consumeProduct();
        input_script=GameObject.Find("MobileInput").GetComponent<InputManager>();
	}

	void Update () {
        if(button.down_pressed) {
            //Time.timeScale = 0;
			//input_script.pause=true;
            input.gameObject.SetActive(false);
            window.gameObject.SetActive(true); }
	}

	public void buy_button(int id_button)
	{
		if (id_button == 0) OpenIAB.purchaseProduct (SKU_money_10k);
		else if (id_button == 1) OpenIAB.purchaseProduct (SKU_money_25k);
        else if (id_button == 2) OpenIAB.purchaseProduct (SKU_money_50k);
        else if (id_button == 3) OpenIAB.purchaseProduct (SKU_money_100k);
        else if (id_button == 4) OpenIAB.purchaseProduct (SKU_money_1mln);

	}

	private void OnBillingSupported()
	{
		//Debug.Log("Billing is supported");
		OpenIAB.queryInventory(new string[] { SKU_money_10k });
        OpenIAB.queryInventory(new string[] { SKU_money_25k });
        OpenIAB.queryInventory(new string[] { SKU_money_50k });
        OpenIAB.queryInventory(new string[] { SKU_money_100k });
        OpenIAB.queryInventory(new string[] { SKU_money_1mln });
	}
	
	private void OnBillingNotSupported(string error)
	{
		Debug.Log("Billing not supported: " + error);
	}
	
	
	private void OnQueryInventoryFailed(string error)
	{
		Debug.Log("Query inventory failed: " + error);
	}
	
	//возвращает купление продукты для того что бы можно было их повторно купить
	private void ProductDataReceived(Inventory inv)
	{
		List<Purchase> prods = inv.GetAllPurchases();
		for(int i = 0; i < prods.Count; i++){
			OpenIAB.consumeProduct(prods[i]);
		}
	}
	
	private void OnPurchaseSucceded(Purchase purchase)
	{
        if(input_script) {
            if (purchase.Sku == SKU_money_10k)input_script.money_bonus=10000;
            if (purchase.Sku == SKU_money_25k)input_script.money_bonus=25000;
            if (purchase.Sku == SKU_money_50k)input_script.money_bonus=50000;
            if (purchase.Sku == SKU_money_100k)input_script.money_bonus=100000;
            if (purchase.Sku == SKU_money_1mln)input_script.money_bonus=1000000;
        }//input_script

        else { 
		if (purchase.Sku == SKU_money_10k)PlayerPrefs.SetInt("money",PlayerPrefs.GetInt("money")+10000);
		else if (purchase.Sku == SKU_money_25k)PlayerPrefs.SetInt("money",PlayerPrefs.GetInt("money")+25000);
        else if (purchase.Sku == SKU_money_50k)PlayerPrefs.SetInt("money",PlayerPrefs.GetInt("money")+50000);
        else if (purchase.Sku == SKU_money_100k)PlayerPrefs.SetInt("money",PlayerPrefs.GetInt("money")+100000);    
        else if (purchase.Sku == SKU_money_1mln)PlayerPrefs.SetInt("money",PlayerPrefs.GetInt("money")+1000000);  

        }//else
	}
	
	private void OnPurchaseFailed(int errorCode, string error)
	{
		Debug.Log("Purchase failed: " + error);

	}
	
	private void OnConsumePurchaseSucceeded(Purchase purchase)
	{
		Debug.Log("Consume purchase succeded: " + purchase.ToString());
	}
	
	private void OnConsumePurchaseFailed(string error)
	{
		Debug.Log("Consume purchase failed: " + error);
	}
	
	private void OnTransactionRestored(string sku)
	{
		Debug.Log("Transaction restored: " + sku);
	}
	
	private void OnRestoreSucceeded()
	{
		Debug.Log("Transactions restored successfully");
	}
	
	private void OnRestoreFailed(string error)
	{
		Debug.Log("Transaction restore failed: " + error);
	}








}