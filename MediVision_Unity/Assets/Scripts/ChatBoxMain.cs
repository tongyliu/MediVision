using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ChatBoxMain : MonoBehaviour
{
    ContentSizeFitter csf;
    public GameObject msgPrefab;
    public Transform msgParentPanel;


	// Use this for initialization
	void Start ()
    {
        csf = gameObject.GetComponent<ContentSizeFitter>();
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    public void setMessage(string msg)
    {
        if (msg == "") return;
        GameObject msgClone = Instantiate(msgPrefab);
        msgClone.transform.SetParent(msgParentPanel);
        msgClone.transform.SetSiblingIndex(msgParentPanel.transform.childCount - 2);
        msgClone.GetComponent<Message>().showMessage(msg);
    }

    



}
