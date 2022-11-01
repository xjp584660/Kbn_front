using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

public class MUSCompilePhase
{
    private List<MUSCompileUnit> Units { get; set; }
    
    public MUSCompilePhase()
    {
        Units = new List<MUSCompileUnit>();
    }
    
    public static MUSCompilePhase FromJson(JObject json)
    {
        var ret = new MUSCompilePhase();
        
        JObject compileUnitsJson = json["compileUnits"] as JObject;
        if (compileUnitsJson == null)
        {
            return ret;
        }
        
        foreach (var pair in compileUnitsJson)
        {
            ret.Units.Add(MUSCompileUnit.FromJson(pair.Value as JObject));
        }
        
        return ret;
    }
    
    public JObject ToJson()
    {
        JObject compileUnitsJson = new JObject();
        foreach (var unit in Units)
        {
            compileUnitsJson[unit.Name] = unit.ToJson();
        }
        
        JObject ret = new JObject();
        ret["compileUnits"] = compileUnitsJson;
        return ret;
    }

    public void AddCompileUnit()
    {
        Units.Add(new MUSCompileUnit());
    }

    public void RemoveCompileUnit(int index)
    {
        Units.RemoveAt(index);
    }

    public MUSCompileUnit this[int index]
    {
        get
        {
            return Units[index];
        }
    }

    public int Count
    {
        get
        {
            return Units.Count;
        }
    }

    public bool IsUnfolded { get; set; }

    public void FoldOrUnfoldRecursive()
    {
        foreach (var unit in Units)
        {
            unit.IsUnfolded = IsUnfolded;
            unit.FoldOrUnfoldRecursive();
        }
    }
}
