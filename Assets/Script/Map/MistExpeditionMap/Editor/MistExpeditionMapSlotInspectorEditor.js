/*
* @FileName:		MistExpeditionMapSlotInspectorEditor.js
* @Author:			lisong
* @Date:			2022-04-21 10:32:10
* @UnityVersion:	2017.4.40c1
*/

import UnityEngine;
import UnityEditor;

@CustomEditor(typeof (MistExpeditionMapSlot))
public class MistExpeditionMapSlotInspectorEditor extends Editor {

    //获取脚本对象
    private var script: MistExpeditionMapSlot;


    private function Awake() {
        script = target as MistExpeditionMapSlot;
    }




    public override function OnInspectorGUI()
    {
        super.OnInspectorGUI();
        GUILayout.Space(10);

        EditorGUI.BeginDisabledGroup(!Application.isPlaying);
        GUILayout.Space(20);
        if (GUILayout.Button("Refresh Slot", GUILayout.Height(50))) {
            DoFunc();
        }
        GUILayout.Space(10);

        EditorGUI.EndDisabledGroup();
    }


    private function DoFunc() {
        script.CreateSlotByInspectorEditor();
    }

}
