using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using UnityEngine.UI;

public class HUD : MonoBehaviour
{
    //inspector variables
    public Text IP_box;
    public float IP_Fade_Delay = 3f;
    public float IP_Fade_Speed = .01f;
    public bool debug_capture_on = false;

    public bool ___________________________;
    //internal variables    
    float timeConnected = 0f;
    bool fadeReset = false;
    Color original_IP_text_color;

    private void Awake()
    {
        
    }

    // Use this for initialization
    void Start ()
    {
        IP_box.text = "IP:" + GetIP();
        original_IP_text_color = Color.white;
        original_IP_text_color.a = 1;
    }
	
	// Update is called once per frame
	void Update ()
    {
        ip_fade();
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

    void ip_fade()
    {
        if (captureOn() && Time.time - timeConnected > IP_Fade_Delay && IP_box.color.a > 0)
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
        if (!fadeReset && IP_box.color.a == 0)
        {
            IP_box.color = original_IP_text_color;
            fadeReset = true;
            IP_box.enabled = false;
        }
    }

    bool captureOn()
    {
        #if NETFX_CORE
            Windows.Media.Capture.AppCapture current = Windows.Media.Capture.AppCapture.GetForCurrentView();
            return current.IsCapturingVideo;
        #endif
        return debug_capture_on;
    }

}
