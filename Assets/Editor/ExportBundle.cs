using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.IO.Compression;

public class ExportBundle : EditorWindow
{
	[@MenuItem ("Assets/Build AssetBundle Selection")]
	public static void BuildAssetBundle()
	{
		Dictionary<BuildTarget,string> platformList = new Dictionary<BuildTarget,string>();
		platformList.Add(BuildTarget.iOS,"ios");
		platformList.Add(BuildTarget.Android,"android");
		platformList.Add(BuildTarget.StandaloneOSX, "osx_intel");
		platformList.Add(BuildTarget.StandaloneWindows,"win");
		
		if ( !platformList.ContainsKey(EditorUserBuildSettings.activeBuildTarget) )
		{
			Debug.LogError("unsupport target:" + EditorUserBuildSettings.activeBuildTarget.ToString());
			return;
		}
        //bundle文件路径
        string str = EditorUtility.SaveFilePanel("Save Bundle ...", Application.dataPath, Selection.activeObject.name, "assetbundle");
		str += "." + EditorUserBuildSettings.activeBuildTarget.ToString().ToLower();

		if (str.Length != 0)
		{
            Object[] selection = Selection.GetFiltered(typeof(Object), SelectionMode.DeepAssets);
            AssetBundleBuild[] buildMap = new AssetBundleBuild[1];
            string[] resourceAssets = new string[selection.Length];
            for (int i = 0; i < selection.Length; i++)
            {
                Object obj = selection[i] as Object;
                string path = AssetDatabase.GetAssetPath(obj);
                resourceAssets[i] = path;//需要用文件路径
            }
			int nameLength = str.IndexOf(".assetbundle") - str.LastIndexOf("/") - 1;
			string bundleName = str.Substring(str.LastIndexOf("/") + 1, nameLength);
            buildMap[0].assetBundleName = bundleName;//所在文件夹名
            buildMap[0].assetBundleVariant = "assetbundle" + "." + EditorUserBuildSettings.activeBuildTarget.ToString().ToLower();//后缀
            buildMap[0].assetNames = resourceAssets;
            //Bundle输出路径
            string strOutput = str.Substring(0, str.LastIndexOf("/"));
            bool bSuccess = BuildPipeline.BuildAssetBundles(strOutput, buildMap,
                                           BuildAssetBundleOptions.UncompressedAssetBundle |
                                           BuildAssetBundleOptions.DeterministicAssetBundle, EditorUserBuildSettings.activeBuildTarget);
			if (bSuccess) {
                FileInfo finfo = new FileInfo(str);
                if (finfo.Exists)
                {
                    using (FileStream fs = File.Open(str, FileMode.Open))
                    {
                        byte[] unzipFile = new byte[fs.Length];
                        fs.Read(unzipFile, 0, (int)fs.Length);
                        byte[] zipFile = FileZip.ZipFile(unzipFile);
                        string md5 = KBN._Global.GetMD5Hash(unzipFile);
                        fs.Close();
                        fs.Dispose();

                        int index = str.IndexOf(".assetbundle");
                        string fullPathWithMd5 = str.Insert(index, Constant.AssetBundleManager.JointBundleNameAndMd5 + md5);
                        FileStream zipFs = new FileStream(fullPathWithMd5, FileMode.Create);
                        zipFs.Write(zipFile, 0, zipFile.Length);
                        zipFs.Close();
                        zipFs.Dispose();
                        File.Delete(str);

                        string directoryName = Path.Combine(Path.GetDirectoryName(fullPathWithMd5), platformList[EditorUserBuildSettings.activeBuildTarget]);

						if (!Directory.Exists(directoryName)) {
							Directory.CreateDirectory(directoryName);
						}

                        string fileName = Path.GetFileName(fullPathWithMd5);
                        OutputResourceList(directoryName, selection, fileName);
                        OutputResourceListMd5(directoryName);
                    }
                }
                else
                {
                    Debug.LogError("BundleFile Save Error: " + str);
                }
                //删除依赖信息文件，项目中不存在依赖关系
                string strBundleDependencePath = str + ".manifest";
				if (File.Exists(strBundleDependencePath))
				{
					File.Delete(strBundleDependencePath);
				}
				string strParentBundlePath = strOutput + "/" + Path.GetFileName(strOutput);
				if (File.Exists(strParentBundlePath))
                {
					File.Delete(strParentBundlePath);
					File.Delete(strParentBundlePath + ".manifest");
				}
			}
		}
		AssetDatabase.Refresh ();
	}

	private static void OutputResourceList(string path,Object[] resources,string bundleName)
	{
		string fullPath = System.IO.Path.Combine(path,"ResourceList.txt");
		FileInfo finfo = new FileInfo(fullPath);
		FileStream fs = null;
		try
		{
			if( finfo.Exists )
			{
				fs = new FileStream(fullPath, FileMode.Append,FileAccess.Write, FileShare.Write);
				fs.Seek(0,SeekOrigin.End);
			}
			else
			{
				fs = new FileStream(fullPath, FileMode.Create,FileAccess.Write, FileShare.Write);
			}


			Object obj;
			StringBuilder s = new StringBuilder();
			for (int i=0;i<resources.Length;i++)
			{
				obj = resources[i] as Object;
				s.Append(obj.name);
				if(i != resources.Length-1)
				{
					s.Append(",");
				}
			}
			s.Append(":");
			s.Append(bundleName);
			s.Append("\n");
			byte[] byTotalText = System.Text.Encoding.UTF8.GetBytes(s.ToString());
			fs.Write(byTotalText,0,byTotalText.Length);
		}
		catch(System.Exception e)
		{
			Debug.LogException(e);
		}
		finally
		{
			fs.Close();
			fs.Dispose();
		}
	}

	private static void OutputResourceListMd5(string path)
	{
		string resourceListPath = System.IO.Path.Combine(path,"ResourceList.txt");
		string resourceListMd5Path = System.IO.Path.Combine(path,"ResourceListMd5.txt");
		if(File.Exists(resourceListPath))
		{
			using(FileStream fs = File.Open(resourceListPath, FileMode.Open))
			{
				fs.Position = 0;
				string md5 = KBN._Global.GetMD5Hash(fs);
				FileStream md5Fs = new FileStream(resourceListMd5Path, FileMode.Create,FileAccess.Write, FileShare.Write);
				byte[] bs = System.Text.Encoding.UTF8.GetBytes(md5);
				md5Fs.Write(bs,0,bs.Length);
				md5Fs.Close();
				md5Fs.Dispose();
				fs.Close();
				fs.Dispose();
			}
		}
	}

}
