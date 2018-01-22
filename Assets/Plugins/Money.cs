using UnityEngine;
using System.Collections;

public class Money : MonoBehaviour
{
    public int money = 100;
    private Player player_sc;
    void Start()
    {
        player_sc = GameObject.Find("Game").GetComponent<Player>();
        Destroy(gameObject, 20);
    }//Start

    void Update()
    {
        float distance = Vector3.Distance(player_sc.player.position, transform.position);
        if (distance < 1) { player_sc.MoneyAdd(money + Random.Range(0, money / 3)); Destroy(gameObject); }
    }//Update
}
