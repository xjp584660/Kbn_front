using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

using Object = UnityEngine.Object;

public class MUSCompileJobEditorWindow : EditorWindow
{
    private Vector2 scrollPosition;

    private MUSCompileJob dataRoot;

    private MUSCompileJobEditorController controller;

    private Vector2 scrollVector;

    private string indexToAddPhase = "0";

    [MenuItem("Window/MUS compile job editor")]
    public static void Open()
    {
        MUSCompileJobEditorWindow window = EditorWindow.GetWindow<MUSCompileJobEditorWindow>(
            true, "MUS compile job editor", true);
        window.Init();
    }

    private void Init()
    {
        minSize = new Vector2(640, 960);
        controller = new MUSCompileJobEditorController();
        controller.LoadData();
        isAltPressed = false;
    }

    private void OnGUI()
    {
        CheckAltButton();
        GUIBegin();
        DrawTopView();
        DrawDataRoot();
        GUIEnd();
    }

    private bool isAltPressed = false;
    private void CheckAltButton()
    {
        Event e = Event.current;
        isAltPressed = e.alt;
    }

    private void GUIBegin()
    {
        GUILayout.BeginArea(new Rect(0, 0, position.width, position.height));
        GUILayout.BeginVertical();
    }

    private void GUIEnd()
    {
        GUILayout.EndVertical();
        GUILayout.EndArea();
    }

    private void DrawTopView()
    {
        GUILayout.BeginHorizontal();
        {
            GUILayout.Space(100);
            if (GUILayout.Button("Save"))
            {
                controller.SaveData();
            }
            GUILayout.Space(100);
        }
        GUILayout.EndHorizontal();
    }

    private void DrawDataRoot()
    {
        GUILayout.BeginVertical();
        {
            scrollVector = GUILayout.BeginScrollView(scrollVector);
            {
                GUILayout.BeginHorizontal();
                {
                    indexToAddPhase = GUILayout.TextField(indexToAddPhase, GUILayout.MaxWidth(100));
                    
                    int index = -1;
                    bool addPhaseButtonEnabled = int.TryParse(indexToAddPhase, out index)
                        && index >= 0 && index <= controller.DataRoot.Count;
                    
                    GUILayout.FlexibleSpace();
                    
                    var cachedGUIEnabled = GUI.enabled;
                    GUI.enabled &= addPhaseButtonEnabled;
                    if (GUILayout.Button("Add compile phase", GUILayout.MaxWidth(200)))
                    {
                        controller.AddCompilePhase(index);
                    }
                    GUI.enabled = cachedGUIEnabled;
                }
                GUILayout.EndHorizontal();
                
                int toRemoveIndex = -1;
                for (int i = 0; i < controller.DataRoot.Count; ++i)
                {
                    if (DrawCompilePhase(0, i))
                    {
                        toRemoveIndex = i;
                    }
                }
                
                if (toRemoveIndex >= 0)
                {
                    controller.RemoveCompilePhase(toRemoveIndex);
                }
            }
            GUILayout.EndScrollView();
        }
        GUILayout.EndVertical();
    }

    private bool DrawCompilePhase(int indent, int index)
    {
        var ret = false;
        var phase = controller.DataRoot[index];
        GUILayout.BeginHorizontal();
        {
            GUILayout.Space(indent);
            var oldUnfolded = phase.IsUnfolded;
            phase.IsUnfolded = EditorGUILayout.Foldout(oldUnfolded, string.Format("Phase: {0}", index));
            if (oldUnfolded != phase.IsUnfolded && isAltPressed)
            {
                phase.FoldOrUnfoldRecursive();
            }
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("Add compile unit", GUILayout.MaxWidth(200)))
            {
                controller.AddCompileUnit(index);
                phase.IsUnfolded = true;
            }
            
            if (GUILayout.Button("-", GUILayout.MaxWidth(30)))
            {
                ret = true;
            }
        }
        GUILayout.EndHorizontal();

        if (!phase.IsUnfolded)
        {
            return ret;
        }

        int toRemoveIndex = -1;
        for (int i = 0; i < phase.Count; ++i)
        {
            if (DrawCompileUnit(indent + 30, i, index))
            {
                toRemoveIndex = i;
            }
        }
        
        if (toRemoveIndex >= 0)
        {
            controller.RemoveCompileUnit(index, toRemoveIndex);
        }
        
        return ret;
    }

    private bool DrawCompileUnit(int indent, int unitIndex, int phaseIndex)
    {
        var ret = false;
        var unit = controller.DataRoot[phaseIndex][unitIndex];
        GUILayout.BeginHorizontal();
        {
            GUILayout.Space(indent);
            var oldUnfolded = unit.IsUnfolded;
            unit.IsUnfolded = EditorGUILayout.Foldout(oldUnfolded, "Unit: ");
            if (oldUnfolded != unit.IsUnfolded && isAltPressed)
            {
                unit.FoldOrUnfoldRecursive();
            }
            unit.Name = GUILayout.TextField(unit.Name, GUILayout.MaxWidth(200));
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("Add module", GUILayout.MaxWidth(200)))
            {
                controller.AddCompileModule(phaseIndex, unitIndex);
                unit.IsUnfolded = true;
            }
            
            if (GUILayout.Button("-", GUILayout.MaxWidth(30)))
            {
                ret = true;
            }
        }
        GUILayout.EndHorizontal();

        if (!unit.IsUnfolded)
        {
            return ret;
        }

        int toRemoveIndex = -1;
        for (int i = 0; i < unit.Count; ++i)
        {
            GUILayout.BeginHorizontal();
            {
                GUILayout.Space(indent + 30);
                
                string path = Regex.Replace(unit[i], @"/$", @"");
                Object o = AssetDatabase.LoadAssetAtPath(path, typeof(Object));
                o = EditorGUILayout.ObjectField(o, typeof(Object), false);
                path = AssetDatabase.GetAssetPath(o);
                if (!string.IsNullOrEmpty(path) || Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), path)))
                {
                    path += "/";
                }
                controller.SetCompileModule(phaseIndex, unitIndex, i, path);

                if (GUILayout.Button("-", GUILayout.MaxWidth(30)))
                {
                    toRemoveIndex = i;
                }
            }
            GUILayout.EndHorizontal();
        }
        
        if (toRemoveIndex >= 0)
        {
            controller.RemoveCompileModule(phaseIndex, unitIndex, toRemoveIndex);
        }
        
        return ret;
    }
}
