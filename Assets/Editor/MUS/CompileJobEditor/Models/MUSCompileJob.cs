using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

public class MUSCompileJob
{
    private List<MUSCompilePhase> Phases { get; set; }
    
    public MUSCompileJob()
    {
        Phases = new List<MUSCompilePhase>();
    }
    
    public static MUSCompileJob FromJson(JObject json)
    {
        var ret = new MUSCompileJob();
        
        JObject compilePhasesJson = json["compilePhases"] as JObject;
        if (compilePhasesJson == null)
        {
            return ret;
        }
        
        for (int i = 0; i < compilePhasesJson.Count; ++i)
        {
            ret.Phases.Add(MUSCompilePhase.FromJson(compilePhasesJson[i.ToString()] as JObject));
        }
        
        return ret;
    }
    
    public JObject ToJson()
    {
        JObject compilePhasesJson = new JObject();
        for (int i = 0; i < Phases.Count; ++i)
        {
            compilePhasesJson[i.ToString()] = Phases[i].ToJson();
        }
        
        JObject ret = new JObject();
        ret["compilePhases"] = compilePhasesJson;
        return ret;
    }

    public void AddCompilePhase(int index)
    {
        if (Phases.Count != 0)
        {
            Phases.Insert(index, new MUSCompilePhase());
        }
        else
        {
            Phases.Add(new MUSCompilePhase());
        }
    }

    public void RemoveCompilePhase(int index)
    {
        Phases.RemoveAt(index);
    }

    public MUSCompilePhase this[int index]
    {
        get
        {
            return Phases[index];
        }
    }

    public int Count
    {
        get
        {
            return Phases.Count;
        }
    }
}
