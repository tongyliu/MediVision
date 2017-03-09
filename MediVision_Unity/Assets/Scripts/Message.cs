using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Message : MonoBehaviour
{
    public float fadeDelay = 20; //seconds
    public float fadeSpeed = .01f;
    public Text msgText;

    float displayTime;
    


    // Use this for initialization
    void Start ()
    {
        displayTime = Time.time;	
	}
	
	// Update is called once per frame
	void Update ()
    {


        msgFader();
    }

    public void showMessage(string msg)
    {
        msgText.text = msg;
    }

    //destroys gameobject after set amount of time
    public void msgFader()
    {
        if (Time.time - displayTime > fadeDelay && msgText.color.a > 0)
        {
            Color c = msgText.color;
            c.a -= fadeSpeed;
            msgText.color = c;
            if (msgText.color.a < 0)
            {
                c.a = 0;
                msgText.color = c;
            }
            if (msgText.color.a == 0)
            {
                Destroy(gameObject);
            }
        }
    }

    int calcMsgLen(string msg)
    {
        int len = 0;

        Font myFont = msgText.font;
        CharacterInfo characterInfo = new CharacterInfo();

        char[] arr = msg.ToCharArray();
        foreach (char c in arr)
        {
            myFont.GetCharacterInfo(c, out characterInfo, msgText.fontSize);

            len += characterInfo.advance;
        }
        return len;
    }

    int calcLines(string msg)
    {



        calcMsgLen(msg);






        return 0;
    }



}
