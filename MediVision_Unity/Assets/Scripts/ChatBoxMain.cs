using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class ChatBoxMain : MonoBehaviour
{
    public string serverURL = "http://3.198.160.73/api/stream/query/";
    //UPDATE WITH SERVER URL
    public string stream_id = "";
    public string IP;
    public string urlSuffix = "socket.io/?EIO=4&transport=websocket";
    public float checkConnectionDelay = 5; //seconds
    public GameObject msgPrefab;
    public Transform msgParentPanel;
    public Text titleText;

    float timeOfLastCheck = 0;



    // Use this for initialization
    void Start()
    {
        Debug.Log("I am alive!");
        StartCoroutine(GetText());

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

    // Update is called once per frame
    void Update()
    {  
    }

    IEnumerator GetText()
    {
        StreamID stream_info;
        string url = getURL();
        Debug.Log(url);

        UnityWebRequest www = UnityWebRequest.Get(url);
        yield return www.Send();

        if (www.isError)
        {
            Debug.Log(www.error);
        }
        else
        {
            stream_info = JsonUtility.FromJson<StreamID>(www.downloadHandler.text);
            Debug.Log("STREAM ID: ");
            Debug.Log(stream_info.stream_id);

            StartCoroutine(getMessage(stream_info));
        }
    }

    public IEnumerator getMessage(StreamID stream_info) {


        while (true) {

            Debug.Log("IN GETMESSAGE()");

            yield return new WaitForSeconds(5f);

            string url = "http://34.198.160.73/api/chat/" + stream_info.stream_id + "?viewer_only=false";
            Debug.Log(url);

            ChatResponse chat;

            UnityWebRequest www = UnityWebRequest.Get(url);
            yield return www.Send();

            if (www.isError)
            {
                Debug.Log(www.error);
            }
            else
            {
                chat = JsonUtility.FromJson<ChatResponse>(www.downloadHandler.text);
                string message = chat.chat_messages[0].chat_content;
                Debug.Log(message);
                setMessage(message);
            }
        }
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
        return serverURL + "10.0.0.1"; //GetIP();
    }

    string requestStreamIdentifier()
    {
        return "";
    }

    //listen for and display incoming messages
    public void chatListen()
    {
       
    }

    ////called when a new message is received
    //public void readmessage(SocketIOEvent e)
    //{
    //    print("MESSAGE RECEIVED");
    //    Debug.Log(string.Format("[name: {0}, data: {1}]", e.name, e.data));
    //    string msg = e.data.ToDictionary()["message"];
    //    setMessage(msg);
    //}

    //bool chatConnected()
    //{
    //    if (Time.time - timeOfLastCheck > checkConnectionDelay)
    //    {
    //        timeOfLastCheck = Time.time;
    //        if (socket.IsConnected)
    //        {
    //            titleText.text = "Viewer Chat";
    //            return true;
    //        }
    //        else
    //        {
    //            titleText.text = "Chat Disconnected";
    //            return false;
    //        }
    //    }
    //    return true;
    //}



}
