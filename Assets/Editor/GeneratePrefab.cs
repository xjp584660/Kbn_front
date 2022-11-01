using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections;
public class GeneratePrefab 
{
    private static string prefabDirectory = "/Prefabs/Model/WorldBoss";
    private static string prefabExtension = ".prefab";
    [MenuItem("Assets/Generate prefab")]
    public static void Generate()
    {
        GameObject selectedGameObject = Selection.activeGameObject;
        string selectedAssetPath = AssetDatabase.GetAssetPath(selectedGameObject);
        if(string.IsNullOrEmpty(selectedAssetPath))
        {
            return;
        }
        string modelAssetPath = string.Concat(Application.dataPath,prefabDirectory);
        string modelParentPath = string.Concat("Assets/Resources", prefabDirectory);
        string modelFullPath = string.Concat(modelParentPath, "/", "model");
        if (!Directory.Exists(modelFullPath))
        {
            AssetDatabase.CreateFolder(modelParentPath , "model");
        }
        GameObject cloneObj = GameObject.Instantiate(selectedGameObject) as GameObject;
        cloneObj.name = cloneObj.name.Replace("(Clone)", string.Empty);
        string genPrefabFullName = string.Concat(modelFullPath, "/", cloneObj.name, prefabExtension);
        Object prefabObj = PrefabUtility.CreateEmptyPrefab(genPrefabFullName);
        GameObject prefab = PrefabUtility.ReplacePrefab(cloneObj, prefabObj);
        GameObject.DestroyImmediate(cloneObj);
    }
}


