using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using UnityEngine.UI;

public class UI : MonoBehaviour
{
    //inspector variables
    public Text IP_box;
    public Image recordIndicator;

    bool ___________________________;
    //internal variables
    public Color originalColor;

    private void Awake()
    {
        originalColor = recordIndicator.color;
    }

    // Use this for initialization
    void Start ()
    {
        IP_box.text = "IP:" + GetIP();
    }
	
	// Update is called once per frame
	void Update ()
    {
        colorRecordIndicator();
	}

    string GetIP()
    {
        string strHostName = "";
        strHostName = System.Net.Dns.GetHostName();

        IPHostEntry ipEntry = System.Net.Dns.GetHostEntry(strHostName);

        IPAddress[] addr = ipEntry.AddressList;

        return addr[addr.Length - 1].ToString();
    }

    void colorRecordIndicator()
    {
        //if connected, color red. Else, color grey.
        if (false) //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        {
            recordIndicator.color = originalColor;
        }
        else
        {
            recordIndicator.color = Color.grey;
        }



    }

}
