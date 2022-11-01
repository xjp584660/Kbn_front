using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public static class AnimationCurveGeneratorFactory
{
    public static IAnimationCurveGenerator GetGenerator(string param)
    {
        string[] segments = param.Split('?');
        string key = segments[0];

        string query = segments.Length > 1 ? segments[1] : null;

        switch (key)
        {
        case "FromPrefab":
            return GetFromPrefabACGenerator(query);
        default:
            return null;
        }
    }
        

    public static Dictionary<string, string> ParseQuery(string query)
    {
        var ret = new Dictionary<string, string>();
        if (query == null)
        {
            return ret;
        }

        string[] pairs = query.Split('&');

        foreach (string pair in pairs)
        {
            string[] segments = pair.Split('=');
            ret.Add(segments[0], segments[1]);
        }

        return ret;
    }

    private static IAnimationCurveGenerator GetFromPrefabACGenerator(string queryStr)
    {
        Dictionary<string, string> paramDict = ParseQuery(queryStr);
        if (!paramDict.ContainsKey("path"))
        {
            return null;
        }

        string path = paramDict["path"];
        GameObject prefab = Resources.Load(path) as GameObject;
        if (prefab == null)
        {
            return null;
        }

        return prefab.GetComponent<FromPrefabACGenerator>();
    }
}
