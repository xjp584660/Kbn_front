using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using NewGDS = KBN.NewGDS;

/// <summary>
/// Gds manager. Basic gds management container.
/// </summary>
public sealed class GdsManager : IEnumerable<KeyValuePair<string, NewGDS>>
{
    private Dictionary<string, NewGDS> gdsCollection;
    private Dictionary<GdsCategory, List<NewGDS>> categorized;

    public GdsManager()
    {
        gdsCollection = new Dictionary<string, NewGDS>();
        categorized = new Dictionary<GdsCategory, List<NewGDS>>();
    }

    public void Register(params NewGDS[] gdsInstances)
    {
        foreach (var gds in gdsInstances)
        {
            Register(gds);
        }
    }

    private void Register(NewGDS gds)
    {
        gdsCollection.Add(gds.GetType().FullName, gds);
        if (!categorized.ContainsKey(gds.Category))
        {
            categorized[gds.Category] = new List<NewGDS>();
        }
        categorized[gds.Category].Add(gds);
    }

    public T GetGds<T>() where T : NewGDS
    {
        string key = typeof(T).FullName;
        NewGDS ret;
        gdsCollection.TryGetValue(key, out ret);
        return ret as T;
    }

    public NewGDS[] GetGdsesOfCategory(GdsCategory category)
    {
        List<NewGDS> gdsesInCategory;
        if (!categorized.TryGetValue(category, out gdsesInCategory))
        {
            return null;
        }

        return gdsesInCategory.ToArray();
    }

    public IEnumerator<KeyValuePair<string, NewGDS>> GetEnumerator()
    {
        return gdsCollection.GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}
