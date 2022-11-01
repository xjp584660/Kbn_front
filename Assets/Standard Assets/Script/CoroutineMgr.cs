using UnityEngine;
using System.Collections;

public class CoroutineMgr : MonoBehaviour 
{
    private static CoroutineMgr _instance = null;
    private static CoroutineMgr Instance
    {
        get
        {
            if (_instance == null)
            {
                GameObject _go = new GameObject("_CoroutineMgr");
                GameObject.DontDestroyOnLoad(_go);
                _instance = _go.AddComponent<CoroutineMgr>();
            }
            return _instance;
        }
    }

    public static void Run(IEnumerator routine)
    {
        CoroutineMgr.Instance.StartCoroutine(routine);
    }

    public static void Stop(IEnumerator routine)
    {
        CoroutineMgr.Instance.StopCoroutine(routine);
    }
}
