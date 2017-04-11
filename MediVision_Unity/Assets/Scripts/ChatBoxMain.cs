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
        //public string user; //MAKE SURE THIS IS CORRECT........................................................
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
    public float full_transparency = .2f; //alpha = 100%

    Image chatImage;

    float timeOfLastCheck = 0;
    bool coroutinesOn = false; //used for coroutine initialization
    int numMessages = 0; //total number of unique chat messages received


    // Use this for initialization
    void Start()
    {
        chatImage = gameObject.GetComponent<Image>();
        //set viewer chat to transparent
        Color c = chatImage.color;
        c.a = full_transparency;
        chatImage.color = c;

        Debug.Log("Chatbox: MAIN HAS STARTED");
        Debug.Assert(chatImage);
    }

    // Update is called once per frame
    void Update()
    {
        monitorCoroutine();
        fadeControl();
    }

    void monitorCoroutine()
    {
        if (HUD.S.captureOn() && !coroutinesOn)
        {
            Debug.Log("Chatbox: CALLED COROUTINE TO GET STREAM ID");
            StartCoroutine(GetText());
            coroutinesOn = true;
        }
        if (!HUD.S.captureOn() && coroutinesOn) //when disconnected
        {
            StopAllCoroutines();
            coroutinesOn = false;
            Debug.Log("Chatbox: I just murdered my coroutines");
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
    public IEnumerator getMessage(string id)
    {
        while (true)
        {
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
                Debug.Log("Chatbox: got a response.");
                chat = JsonUtility.FromJson<ChatResponse>(www.downloadHandler.text);
                //are there new messages?
                if (chat.chat_messages.Length > numMessages)
                {
                    Debug.Log("Chatbox: found " + (chat.chat_messages.Length - numMessages) + " new messages");
                    //generate from oldest of the new messages to the newest
                    for (int i = numMessages; i < chat.chat_messages.Length; ++i)
                    {
                        Debug.Log("Chatbox: message is:");
                        Debug.Log(chat.chat_messages[i].chat_content);
                        //string user = chat.chat_messages[i].user; USER...................................................................
                        string msg = chat.chat_messages[i].chat_content;
                        //setMessage(user, msg);.........................................................................
                        setMessage("", msg); //DELETE ME WHEN USERS ARE WORKING
                        numMessages++;
                    }
                    
                }
                //if (chat.chat_messages.Length > 0)
                //{
                //string message = chat.chat_messages[chat.chat_messages.Length - 1].chat_content;
                //Debug.Log("Chatbox: CHAT MESSAGE: ");
                //Debug.Log("Chatbox: " + message);
                //setMessage(message);
                //}
            }
        }//end while(true)
    }

    public void setMessage(string user, string msg)
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

        msgClone.GetComponent<Message>().showMessage(user, msg); //NEED USERNAME.........

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
        if (chatImage.color.a < full_transparency)
        {
            Color c = chatImage.color;
            c.a = c.a + Fade_Speed;
            if (c.a > full_transparency) c.a = full_transparency;
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
