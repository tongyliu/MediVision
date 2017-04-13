using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using UnityEngine.UI;

public class HUD : MonoBehaviour
{
    static public HUD S;

    //inspector variables
    public Text IP_box;
    public float IP_Fade_Delay = 3f;
    public float IP_Fade_Speed = .01f;
    public string disconnectionMessage = "Stream Disconnected";
    public string no_ip_message = "Could not be retrieved";
    public bool debug_capture_on = false;

    //internal variables    
    float timeFirstConnected = -1f;
    float timeDisconnected = -1f;
    Color original_IP_text_color;
    bool streamOn = false;

    private void Awake()
    {
        S = this;
    }

    // Use this for initialization
    void Start ()
    {
        IP_box.text = "IP: " + GetIP();
        original_IP_text_color = Color.white;
        original_IP_text_color.a = 1;
    }
	
	// Update is called once per frame
	void Update ()
    {
        checkConnection();
        ip_fade();        
    }

    public string GetIP()
    {
        #if NETFX_CORE

            System.Collections.Generic.IReadOnlyList<Windows.Networking.HostName> hostNames = 
                Windows.Networking.Connectivity.NetworkInformation.GetHostNames();

            return hostNames[hostNames.Count - 1].ToString();

        #endif
        return no_ip_message;
    }

    void ip_fade()
    {
        if (captureOn() && 
            streamOn && 
            Time.time - timeFirstConnected > IP_Fade_Delay && 
            IP_box.color.a > 0)
        {
            Color c = IP_box.color;
            c.a = c.a - IP_Fade_Speed;
            IP_box.color = c;
            if (IP_box.color.a < 0)
            {
                c.a = 0;
                IP_box.color = c;
            }
        }
        if (IP_box.enabled && IP_box.color.a == 0)
        {
            IP_box.color = original_IP_text_color;
            IP_box.enabled = false;
        }
    }

    public bool captureOn()
    {
        if (debug_capture_on)
        {
            return true;
        }
        #if NETFX_CORE
            Windows.Media.Capture.AppCapture current = Windows.Media.Capture.AppCapture.GetForCurrentView();
            if (current.IsCapturingVideo)
            {
                return true;
            }
        #endif
        return false;
    }

    void checkConnection()
    {
        //on first connection...
        if (captureOn() && !streamOn) 
        {
            timeFirstConnected = Time.time;
            streamOn = true;
        }

        //on connection lost
        if (!captureOn() && streamOn) 
        {
            IP_box.enabled = true;
            IP_box.text = disconnectionMessage;
            original_IP_text_color.a = 1;
            IP_box.color = original_IP_text_color;
            streamOn = false;
            timeDisconnected = Time.time;
        }

        //4 seconds after a disconnection...
        if (timeDisconnected != -1f &&
            Time.time - timeDisconnected > 4)
        {
            IP_box.enabled = true;
            IP_box.text = "IP: " + GetIP();
            original_IP_text_color = Color.white;
            original_IP_text_color.a = 1;
            timeDisconnected = -1;
        }
    }

}
