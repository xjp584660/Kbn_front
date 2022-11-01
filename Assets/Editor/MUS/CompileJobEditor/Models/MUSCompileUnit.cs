using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

public class MUSCompileUnit
{
    public string Name { get; set; }
    private List<string> Modules { get; set; }
    
    public MUSCompileUnit()
    {
        Name = "";
        Modules = new List<string>();
    }
    
    public static MUSCompileUnit FromJson(JObject json)
    {
        var ret = new MUSCompileUnit();
        ret.Name = (string)json["name"];
        
        foreach (var unit in (json["compileModules"] as JArray))
        {
            ret.Modules.Add((string)unit);
        }
        return ret;
    }
    
    public JObject ToJson()
    {
        JObject ret = new JObject();
        ret["name"] = Name;
        ret["compileModules"] = new JArray();
        foreach (var module in Modules)
        {
            (ret["compileModules"] as JArray).Add(JToken.FromObject(module));
        }
        return ret;
    }

    public void AddCompileModule()
    {
        Modules.Add("");
    }

    public void RemoveCompileModule(int index)
    {
        Modules.RemoveAt(index);
    }

    public string this[int index]
    {
        get
        {
            return Modules[index];
        }

        set
        {
            Modules[index] = value;
        }
    }

    public int Count
    {
        get
        {
            return Modules.Count;
        }
    }

    public bool IsUnfolded { get; set; }

    public void FoldOrUnfoldRecursive()
    {
        // Empty
    }
}
