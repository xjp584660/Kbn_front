using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.IO;


public class Build : EditorWindow
{
	static void  BuildProject(){
	Debug.Log("start building");
	string currentDir = Application.dataPath;
	int index = currentDir.LastIndexOf("/");
	currentDir = currentDir.Remove( index );
	index = currentDir.LastIndexOf("/");
	currentDir = currentDir.Remove( index);
	
	string[] levels = {
			"Assets/Scence/Loading.unity",
			"Assets/Scence/Game.unity",
			"Assets/Scence/CityMapView.unity",
			"Assets/Scence/FieldMapView.unity",
			"Assets/Scence/WorldMapView.unity",
			"Assets/Scence/HeroExplore.unity"
		};
	BuildPipeline.BuildPlayer( levels, currentDir + "/client_xcode",EditorUserBuildSettings.activeBuildTarget,  BuildOptions.AcceptExternalModificationsToPlayer);
	}
	
	
	[UnityEditor.MenuItem("KBN/Build/Build KOC")]
	static void BuildKOC()
	{
		BuildProject();
	}
	static string defaultPath = Application.dataPath + "/../../../assetbundles";
//	[UnityEditor.MenuItem("KBN/Build/Build Assetbundle/icon_item")]
//	static void BuildIconBundle()
//	{
//		Object[] objects = { AssetDatabase.LoadAssetAtPath ("Assets/ExportTextures/Icons.png", typeof(Texture2D)), AssetDatabase.LoadAssetAtPath("Assets/ExportTextures/Icons.txt", typeof(TextAsset))};
//		string str  = EditorUtility.SaveFilePanel("Save Bundle...", defaultPath, "icon_item", "assetbundle");
//		if (str.Length != 0){
//             BuildPipeline.BuildAssetBundle(objects[0], objects, str, BuildAssetBundleOptions.CompleteAssets| BuildAssetBundleOptions.CompleteAssets, EditorUserBuildSettings.activeBuildTarget);
//        }
//	}
	
	[UnityEditor.MenuItem("KBN/Build/Build Assetbundle/background")]
	static void BuildBackgroundBundle()
	{
		Object[] objects = { AssetDatabase.LoadAssetAtPath ("Assets/ExportTextures/background.png", typeof(Texture2D)), AssetDatabase.LoadAssetAtPath("Assets/ExportTextures/background.txt", typeof(TextAsset))};
		string str  = EditorUtility.SaveFilePanel("Save Bundle...", defaultPath, "background", "assetbundle");
		if (str.Length != 0){
             BuildPipeline.BuildAssetBundle(objects[0], objects, str, BuildAssetBundleOptions.CompleteAssets| BuildAssetBundleOptions.CompleteAssets, EditorUserBuildSettings.activeBuildTarget);
        }
	}
	
	[UnityEditor.MenuItem("KBN/Build/Build Assetbundle/building")]
	static void BuildBuildingBundle()
	{
		string[] folders = {"ExportTextures/building"};	
		Object[] objects = ScanProjectFolder(folders);
		
		string str  = EditorUtility.SaveFilePanel("Save Bundle...", defaultPath, "building", "assetbundle");
		if (str.Length != 0){
             BuildPipeline.BuildAssetBundle(objects[0], objects, str, BuildAssetBundleOptions.CompleteAssets| BuildAssetBundleOptions.CompleteAssets, EditorUserBuildSettings.activeBuildTarget);
        }
	}
	
	[UnityEditor.MenuItem("KBN/Build/Build Assetbundle/map")]
	static void BuildMapBundle()
	{
		string[] folders = {"ExportTextures/map"};	
		Object[] objects = ScanProjectFolder(folders);
		string str  = EditorUtility.SaveFilePanel("Save Bundle...", defaultPath, "map", "assetbundle");
		if (str.Length != 0){
             BuildPipeline.BuildAssetBundle(objects[0], objects, str, BuildAssetBundleOptions.CompleteAssets| BuildAssetBundleOptions.CompleteAssets, EditorUserBuildSettings.activeBuildTarget);
        }
	}
	
	[UnityEditor.MenuItem("KBN/Build/Build Assetbundle/report")]
	static void BuildReportBundle()
	{
		string[] folders = {"ExportTextures/report"};	
		Object[] objects = ScanProjectFolder(folders);
		string str  = EditorUtility.SaveFilePanel("Save Bundle...", defaultPath, "report", "assetbundle");
		if (str.Length != 0){
             BuildPipeline.BuildAssetBundle(objects[0], objects, str, BuildAssetBundleOptions.CompleteAssets| BuildAssetBundleOptions.CompleteAssets, EditorUserBuildSettings.activeBuildTarget);
        }
	}
	
		[UnityEditor.MenuItem("KBN/Build/Build Assetbundle/font")]
	static void BuildFontBundle()
	{
		string[] folders = {"ExportTextures/font"};	
		Object[] objects = ScanProjectFolder(folders);
		string str  = EditorUtility.SaveFilePanel("Save Bundle...", defaultPath, "font", "assetbundle");
		if (str.Length != 0){
             BuildPipeline.BuildAssetBundle(objects[0], objects, str, BuildAssetBundleOptions.CompleteAssets| BuildAssetBundleOptions.CompleteAssets, EditorUserBuildSettings.activeBuildTarget);
        }
	}
	
	[UnityEditor.MenuItem("KBN/Build/Build Assetbundle/fte")]
	static void BuildFteBundle()
	{
		string[] folders = {"ExportTextures/FTE"};	
		Object[] objects = ScanProjectFolder(folders);
		string str  = EditorUtility.SaveFilePanel("Save Bundle...", defaultPath, "fte", "assetbundle");
		if (str.Length != 0){
             BuildPipeline.BuildAssetBundle(objects[0], objects, str, BuildAssetBundleOptions.CompleteAssets| BuildAssetBundleOptions.CompleteAssets, EditorUserBuildSettings.activeBuildTarget);
        }
	}
	
	[UnityEditor.MenuItem("KBN/Build/Build Assetbundle/animation")]
	static void BuildAnimBundle()
	{
		string[] folders = {"ExportTextures/Animation"};	
		Object[] objects = ScanProjectFolder(folders);
		string str  = EditorUtility.SaveFilePanel("Save Bundle...", defaultPath, "animation", "assetbundle");
		if (str.Length != 0){
             BuildPipeline.BuildAssetBundle(objects[0], objects, str, BuildAssetBundleOptions.CompleteAssets| BuildAssetBundleOptions.CompleteAssets, EditorUserBuildSettings.activeBuildTarget);
        }
	}
	static Object[] ScanProjectFolder(string[] folders)
	{
		string[] files;
		Object obj;
	
		ArrayList objects = new ArrayList();
		// Stack of folders:
		Stack stack = new Stack();

		// Add root directory:
		for(int i =0; i < folders.Length; i++)
		{
			stack.Push(Application.dataPath + "/" + folders[i]);
		}
		

		// Continue while there are folders to process
		while (stack.Count > 0)
		{
			// Get top folder:
			string dir = (string)stack.Pop();

			try
			{

				files = Directory.GetFiles(dir, "*");

				for (int i = 0; i < files.Length; ++i)
				{
					files[i] = files[i].Substring(Application.dataPath.Length - 6);

					obj = AssetDatabase.LoadAssetAtPath(files[i], typeof(Object));

					if (obj != null)
					{
						objects.Add(obj);
					}
				}

				// Add all subfolders in this folder:
				foreach (string dn in Directory.GetDirectories(dir))
				{
					stack.Push(dn);
				}
			}
			catch( System.Exception /*e*/)
			{
				// Error
				Debug.LogError("Could not access folder: \"" + dir + "\"");
			}
		}
		return (Object[])objects.ToArray(typeof(Object));
	}
}

