using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ChatBoxMain : MonoBehaviour
{
    ContentSizeFitter csf;
    public Text msgText;



	// Use this for initialization
	void Start ()
    {
        csf = gameObject.GetComponent<ContentSizeFitter>();
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    public void showMessage(string msg)
    {
        msgText.text = msg;
    }

    //destroys gameobject after set amount of time
    public void msgFader()
    {

    }





}
