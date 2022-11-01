using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;

using Debug = UnityEngine.Debug;

public class MUSCompileJobEditorController
{
    private const string CompileJobJsonPath = "compile_job.json";

    private MUSCompileJob dataRoot;
    public MUSCompileJob DataRoot
    {
        get
        {
            return dataRoot;
        }
    }

    public MUSCompileJobEditorController()
    {
        // Empty
    }

    public void LoadData()
    {
        JObject json;
        if (!File.Exists(CompileJobJsonPath))
        {
            json = JObject.Parse("{}");
        }
        else
        {
            json = JObject.Parse(File.ReadAllText(CompileJobJsonPath));
        }
        
        try
        {
            dataRoot = MUSCompileJob.FromJson(json);
        }
        catch (Exception e)
        {
            Debug.LogWarning(e.Message + "\n" + e.StackTrace);
            json = JObject.Parse("{}");
            dataRoot = MUSCompileJob.FromJson(json);
        }
    }

    public void SaveData()
    {
        JObject json = dataRoot.ToJson();
        File.WriteAllText(CompileJobJsonPath, json.ToString());
    }

    public void AddCompilePhase(int index)
    {
        dataRoot.AddCompilePhase(index);
    }

    public void RemoveCompilePhase(int index)
    {
        dataRoot.RemoveCompilePhase(index);
    }

    public void AddCompileUnit(int phaseIndex)
    {
        dataRoot[phaseIndex].AddCompileUnit();
    }

    public void RemoveCompileUnit(int phaseIndex, int unitIndex)
    {
        dataRoot[phaseIndex].RemoveCompileUnit(unitIndex);
    }

    public void AddCompileModule(int phaseIndex, int unitIndex)
    {
        dataRoot[phaseIndex][unitIndex].AddCompileModule();
    }

    public void RemoveCompileModule(int phaseIndex, int unitIndex, int moduleIndex)
    {
        dataRoot[phaseIndex][unitIndex].RemoveCompileModule(moduleIndex);
    }

    public void SetCompileModule(int phaseIndex, int unitIndex, int moduleIndex, string val)
    {
        dataRoot[phaseIndex][unitIndex][moduleIndex] = val;
    }
}
