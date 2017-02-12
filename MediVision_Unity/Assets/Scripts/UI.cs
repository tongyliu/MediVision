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
        //return Network.player.ipAddress.ToString();
        #if NETFX_CORE
            return Windows.Networking.Connectivity.NetworkInformation.GetHostNames()[0].ToString();
        #endif
        //string strHostName = "";

        //strHostName = Dns.GetHostName();

        //IPHostEntry ipEntry = Dns.GetHostEntry(strHostName);

        //IPAddress[] addr = ipEntry.AddressList;

        //return addr[addr.Length - 1].ToString();
        return "HELLO IP HERE";
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
