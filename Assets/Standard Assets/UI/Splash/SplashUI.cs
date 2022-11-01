using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SplashUI : MonoBehaviour
{
    public Image Splash_protective;
    public int Speed = 1;
    public float timer;
    private float a = 255f;

    private void Start()
    {
        Invoke("SetSpeed", 1.65f);
        InvokeRepeating("SetColor", 0.65f, 0.032f);
        StartCoroutine(LoadScene(timer));
    }
    private void SetSpeed()
    {
        Speed = 3;
    }

    private void SetColor()
    {
        a -= Speed;
        Splash_protective.color = new Color(0, 0, 0, a / 255f);
    }

    private IEnumerator LoadScene(float timer)
    {
        yield return new WaitForSeconds(timer);
        Application.LoadLevel("Loading");
    }
}
