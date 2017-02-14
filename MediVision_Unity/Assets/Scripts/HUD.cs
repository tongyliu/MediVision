using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using UnityEngine.UI;

public class HUD : MonoBehaviour
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

        #if NETFX_CORE

            System.Collections.Generic.IReadOnlyList<Windows.Networking.HostName> hostNames = 
                Windows.Networking.Connectivity.NetworkInformation.GetHostNames();

            return hostNames[hostNames.Count - 1].ToString();

        #endif

        return "THIS DID NOT WORK";

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
