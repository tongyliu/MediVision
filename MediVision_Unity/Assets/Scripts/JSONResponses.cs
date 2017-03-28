using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class JSONResponses : MonoBehaviour {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}

public class StreamID {

    public string stream_id;
    public bool success;
}


[System.Serializable]
public class ChatResponse {

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