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
    public string stream_id = "";
    public float checkConnectionDelay = 3; //seconds
    public GameObject msgPrefab;
    public Transform msgParentPanel;
    public Text titleText;

    public float Fade_Delay = 3f;
    public float Fade_Speed = .01f;
    public float full_transparency = 1f; //alpha = 100%

    public bool debug_mode = false;
    public bool receive_debug_message = false;

    //internal variables
    CanvasGroup chat;
    float timeOfLastCheck = 0;
    bool coroutinesOn = false; //used for coroutine initialization
    int numMessages = 0; //total number of unique chat messages received


    // Use this for initialization
    void Start()
    {
        chat = gameObject.GetComponent<CanvasGroup>();
        //set viewer chat to transparent
        chat.alpha = 0;

        if (debug_mode)
        {
            Debug.Log("Chatbox: MAIN HAS STARTED");
            Debug.Assert(chat);
        }        
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
            if (debug_mode) Debug.Log("Chatbox: CALLED COROUTINE TO GET STREAM ID");
            StartCoroutine(GetText());
            coroutinesOn = true;
        }
        if (!HUD.S.captureOn() && coroutinesOn) //when disconnected
        {
            StopAllCoroutines();
            coroutinesOn = false;
            if (debug_mode) Debug.Log("Chatbox: I just murdered my coroutines");
        }
    }

    IEnumerator GetText()
    {
        if (debug_mode) Debug.Log("Chatbox: IN GET TEXT");
        if (debug_mode) Debug.Log("Chatbox: WAIING FOR 5 SECONDS...");
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
            if (debug_mode) Debug.Log("Chatbox: PARSING JSON...");
            StreamID stream_info = JsonUtility.FromJson<StreamID>(www.downloadHandler.text);

            if (debug_mode) Debug.Log("Chatbox: RAW JSON STRING: ");
            if (debug_mode) Debug.Log(www.downloadHandler.text);

            if (debug_mode) Debug.Log("Chatbox: STREAM ID: ");
            if (debug_mode) Debug.Log(stream_info.stream_id.ToString());

            StartCoroutine(getMessage(stream_info.stream_id));
        }
    }

    //MUST MODIFY TO GET USERNAME
    public IEnumerator getMessage(string id)
    {
        while (true)
        {
            if (debug_mode) Debug.Log("Chatbox: IN GETMESSAGE()");
            yield return new WaitForSeconds(5f);
            string url = "http://34.198.160.73/api/chat/" + id + "?viewer_only=false";
            if (debug_mode) Debug.Log("Chatbox: " + url);
            ChatResponse chat;
            UnityWebRequest www = UnityWebRequest.Get(url);
            yield return www.Send();

            if (www.isError)
            {
                Debug.Log(www.error);
            }
            else
            {
                if (debug_mode) Debug.Log("Chatbox: got a response.");
                chat = JsonUtility.FromJson<ChatResponse>(www.downloadHandler.text);
                //are there new messages?
                if (chat.chat_messages.Length > numMessages)
                {
                    if (debug_mode) Debug.Log("Chatbox: found " + (chat.chat_messages.Length - numMessages) + " new messages");
                    //generate from oldest of the new messages to the newest
                    for (int i = numMessages; i < chat.chat_messages.Length; ++i)
                    {
                        if (debug_mode) Debug.Log("Chatbox: message is:");
                        if (debug_mode) Debug.Log(chat.chat_messages[i].chat_content);
                        //string user = chat.chat_messages[i].user; USER...................................................................
                        string msg = chat.chat_messages[i].chat_content;
                        //setMessage(user, msg);.........................................................................
                        setMessage("", msg); //DELETE ME WHEN USERS ARE WORKING
                        numMessages++;
                    }
                    
                }
            }
        }//end while(true)
    }

    public void setMessage(string user, string msg)
    {

        if (debug_mode) Debug.Log("Chatbox: IN SET MESSAGE");

        if (msg == "") return;
        GameObject msgClone = Instantiate(msgPrefab);
        msgClone.transform.SetParent(msgParentPanel);
        msgClone.transform.SetSiblingIndex(msgParentPanel.transform.childCount - 1);

        //Vector3 currentPos = msgClone.transform.position;
        //msgClone.transform.position = new Vector3(currentPos.x, currentPos.y, 1.75f);

        //Vector3 scale = new Vector3(1, 1, 1);
        //msgClone.transform.localScale = scale;

        msgClone.GetComponent<Message>().showMessage(user, msg); //NEED USERNAME.........
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
        if (chat.alpha > 0)
        {
            chat.alpha = chat.alpha - Fade_Speed;
            if (chat.alpha < 0) chat.alpha = 0;
        }
    }

    //an update function when connected
    void fadeIn()
    {
        if (chat.alpha < full_transparency)
        {
            chat.alpha = chat.alpha + Fade_Speed;
            if (chat.alpha > full_transparency) chat.alpha = full_transparency;
        }
    }

}
