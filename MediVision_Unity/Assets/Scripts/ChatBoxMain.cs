﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using SocketIO;

public class ChatBoxMain : MonoBehaviour
{
    public string serverURL = "ws://34.198.160.73/api/socket/"; //UPDATE WITH SERVER URL
    public string urlSuffix = "socket.io/?EIO=4&transport=websocket";
    public float checkConnectionDelay = 5; //seconds
    public GameObject msgPrefab;
    public Transform msgParentPanel;
    public Text titleText;

    GameObject socket_io;
    SocketIOComponent socket;
    float timeOfLastCheck = 0;
    


    // Use this for initialization
    void Start ()
    {
        socket_io = GameObject.Find("SocketIO");
        socket = socket_io.GetComponent<SocketIOComponent>();
        //socket.url = getURL();
        //socket.Connect();

        chatListen();
    }
	
	// Update is called once per frame
	void Update ()
    {
        //chatListen();
        //chatConnected();
    }

    public void setMessage(string msg)
    {
        if (msg == "") return;
        GameObject msgClone = Instantiate(msgPrefab);
        msgClone.transform.SetParent(msgParentPanel);
        msgClone.transform.SetSiblingIndex(msgParentPanel.transform.childCount - 2);
        msgClone.GetComponent<Message>().showMessage(msg);
    }

    public string getURL()
    {
        return serverURL;//(serverURL + requestStreamIdentifier() + urlSuffix);
    }

    string requestStreamIdentifier()
    {
        //TODO once API is done?

        return "";
    }

    //listen for and display incoming messages
    public void chatListen()
    {
        socket.On("00000000-0000-0000-0000-000000000000__doctor-chat", readmessage);
        if (socket.IsConnected) //DELETE ME...........................................
        {
            print("CONNECTED.");
        }
    }

    //called when a new message is received
    public void readmessage(SocketIOEvent e)
    {
        print("MESSAGE RECEIVED");
        Debug.Log(string.Format("[name: {0}, data: {1}]", e.name, e.data));
        string msg = e.data.ToDictionary()["message"];
        setMessage(msg);
    }

    bool chatConnected()
    {
        if (Time.time - timeOfLastCheck > checkConnectionDelay)
        {
            timeOfLastCheck = Time.time;
            if (socket.IsConnected)
            {
                titleText.text = "Viewer Chat";
                return true;
            }
            else
            {
                titleText.text = "Chat Disconnected";
                return false;
            }
        }
        return true;        
    }



}
