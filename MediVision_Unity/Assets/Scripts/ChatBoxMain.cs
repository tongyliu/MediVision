using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

[System.Serializable]
public class StreamID
{
    public string stream_id;
    public bool success;
}

[System.Serializable]
public class ChatResponse
{
    [System.Serializable]
    public class ChatMessage
    {
        public string chat_id;
        public string chat_content;
        public string chat_created_at;
    }
    public bool success = false;
    public ChatMessage[] chat_messages;
}

public class ChatBoxMain : MonoBehaviour
{
    public string serverURL = "http://3.198.160.73/api/stream/query/";
    //UPDATE WITH SERVER URL
    public string stream_id = "";
    //public string IP;
    //public string urlSuffix = "socket.io/?EIO=4&transport=websocket";
    public float checkConnectionDelay = 3; //seconds
    public GameObject msgPrefab;
    //public Text currentMesage;
    public Transform msgParentPanel;
    public Text titleText;

    public float Fade_Delay = 3f;
    public float Fade_Speed = .01f;

    Image chatImage;

    float timeOfLastCheck = 0;
    bool alreadyCalled = false; //used for coroutine initialization


    // Use this for initialization
    void Start()
    {
        Debug.Log("Chatbox: MAIN HAS STARTED");
        chatImage = gameObject.GetComponent<Image>();
        Debug.Assert(chatImage);
    }

    // Update is called once per frame
    void Update()
    {
        beginCoroutine();
        fadeControl();
    }

    void beginCoroutine()
    {
        if (HUD.S.captureOn() && !alreadyCalled)
        {
            Debug.Log("Chatbox: CALLED COROUTINE TO GET STREAM ID");
            StartCoroutine(GetText());
            alreadyCalled = true;
        }
    }

    IEnumerator GetText()
    {
        Debug.Log("Chatbox: IN GET TEXT");


        Debug.Log("Chatbox: WAIING FOR 5 SECONDS...");
        yield return new WaitForSeconds(5f);


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
            Debug.Log("Chatbox: PARSING JSON...");
            StreamID stream_info = JsonUtility.FromJson<StreamID>(www.downloadHandler.text);

            Debug.Log("Chatbox: RAW JSON STRING: ");
            Debug.Log(www.downloadHandler.text);

            Debug.Log("Chatbox: STREAM ID: ");
            Debug.Log(stream_info.stream_id.ToString());

            StartCoroutine(getMessage(stream_info.stream_id));
        }
    }

    //MUST MODIFY TO GET USERNAME
    public IEnumerator getMessage(string id) {

        while (true) {

            Debug.Log("Chatbox: IN GETMESSAGE()");


            yield return new WaitForSeconds(5f);

            string url = "http://34.198.160.73/api/chat/" + id + "?viewer_only=false";
            Debug.Log("Chatbox: " + url);

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

                if (chat.chat_messages.Length > 0)
                {
                    string message = chat.chat_messages[chat.chat_messages.Length - 1].chat_content;

                    Debug.Log("Chatbox: CHAT MESSAGE: ");
                    Debug.Log("Chatbox: " + message);

                    setMessage(message);
                }

            }
        }
    }

    public void setMessage(string msg)
    {

        Debug.Log("Chatbox: IN SET MESSAGE");

        if (msg == "") return;
        GameObject msgClone = Instantiate(msgPrefab);
        msgClone.transform.SetParent(msgParentPanel);
        msgClone.transform.SetSiblingIndex(msgParentPanel.transform.childCount - 1);

        Vector3 currentPos = msgClone.transform.position;
        msgClone.transform.position = new Vector3(currentPos.x, currentPos.y, 1.75f);

        Vector3 scale = new Vector3(1, 1, 1);
        msgClone.transform.localScale = scale;

        msgClone.GetComponent<Message>().showMessage(msg); //NEED USERNAME.........

        //currentMesage.text = msg; //Deprecated Workaround, do not use

    }

    public string getURL()
    {
        return serverURL + HUD.S.GetIP();
    }

    //an update function
    void fadeControl()
    {
        if (HUD.S.captureOn())
        {
            fadeIn();
        }
        else
        {
            fadeOut();
        }
    }

    //an update function when disconnected
    void fadeOut()
    {
        if (chatImage.color.a > 0)
        {
            Color c = chatImage.color;
            c.a = c.a - Fade_Speed;
            if (c.a < 0) c.a = 0;
            chatImage.color = c;
        }
    }

    //an update function when connected
    void fadeIn()
    {
        if (chatImage.color.a < 1)
        {
            Color c = chatImage.color;
            c.a = c.a + Fade_Speed;
            if (c.a > 1) c.a = 1;
            chatImage.color = c;
        }
    }

    //string requestStreamIdentifier()
    //{
    //    return "";
    //}

    /*DEPRECATED SOCKET STUFF. DO NOT ENABLE.
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
    */


}
