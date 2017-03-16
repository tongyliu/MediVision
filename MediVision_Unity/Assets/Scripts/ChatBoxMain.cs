using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using SocketIO;

public class ChatBoxMain : MonoBehaviour
{
    public string serverBaseURL = ""; //UPDATE WITH SERVER URL
    public GameObject msgPrefab;
    public Transform msgParentPanel;

    GameObject socket_io;
    SocketIOComponent socket;


    // Use this for initialization
    void Start ()
    {
        socket_io = GameObject.Find("SocketIO");
        socket = socket_io.GetComponent<SocketIOComponent>();
        socket.url = getURL();
        socket.Connect();
    }
	
	// Update is called once per frame
	void Update ()
    {
        chatListen();
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
        return serverBaseURL + requestStreamIdentifier();
    }

    string requestStreamIdentifier()
    {
        //TODO once API is done

        return "";
    }

    //listen for and display incoming messages
    void chatListen()
    {
        //TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        socket.On("message", readmessage);

    }

    //called when a new message is received
    void readmessage(SocketIOEvent e)
    {
        //TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        Debug.Log(string.Format("[name: {0}, data: {1}]", e.name, e.data));
        string msg = e.data.ToDictionary()["message"];

    }

    void createMessageText(string s)
    {
        GameObject msg = Instantiate(msgPrefab);
        msg.transform.SetParent(msgParentPanel.transform);


    }



}
