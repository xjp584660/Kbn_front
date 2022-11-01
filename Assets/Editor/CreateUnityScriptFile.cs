
#if UNITY_EDITOR


using System.IO;
using System.Text;
using UnityEditor;
using UnityEditor.ProjectWindowCallback;
using UnityEngine;

public class CreateUnityScriptFile
{
    [MenuItem("Assets/Create/Unity Script", false, 80)]
    public static void CreatNewLua()
    {
        ProjectWindowUtil.StartNameEditingIfProjectWindowExists(0,
        ScriptableObject.CreateInstance<MyDoCreateScriptAsset>(),
        GetSelectedPathOrFallback() + "/New UnityScript.js",
        null, null);
    }



    public static string GetSelectedPathOrFallback()
    {
        string path = "Assets";
        foreach (UnityEngine.Object obj in Selection.GetFiltered(typeof(UnityEngine.Object), SelectionMode.Assets))
        {
            path = AssetDatabase.GetAssetPath(obj);
            if (!string.IsNullOrEmpty(path) && File.Exists(path))
            {
                path = Path.GetDirectoryName(path);
                break;
            }
        }
        return path;
    }


    class MyDoCreateScriptAsset : EndNameEditAction
    {


        public override void Action(int instanceId, string pathName, string resourceFile)
        {
            UnityEngine.Object o = CreateScriptAssetFromTemplate(pathName, resourceFile);
            ProjectWindowUtil.ShowCreatedAsset(o);
        }

        internal static UnityEngine.Object CreateScriptAssetFromTemplate(string pathName, string resourceFile)
        {
            string fullPath = Path.GetFullPath(pathName);

            string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(pathName);

            StringBuilder strs = new StringBuilder();

            
            strs.Append("/*");
            strs.Append("\n * @FileName:\t\t" + fileNameWithoutExtension+".js");
            strs.Append("\n * @Author:\t\t\t" + System.Environment.UserName);
            strs.Append("\n * @Date:\t\t\t" + System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"));
            strs.Append("\n * @UnityVersion:\t" + Application.unityVersion);
            strs.Append("\n *");
            strs.Append("\n * @Description:\t");
            strs.Append("\n *");
            strs.Append("\n*/\n\n\n");
            
            strs.Append("public class " + fileNameWithoutExtension + " extends MonoBehaviour {\n\n\n}");

            bool encoderShouldEmitUTF8Identifier = true;
            bool throwOnInvalidBytes = false;

            UTF8Encoding encoding = new UTF8Encoding(encoderShouldEmitUTF8Identifier, throwOnInvalidBytes);

            bool append = false;

            StreamWriter streamWriter = new StreamWriter(fullPath, append, encoding);
            streamWriter.Write(strs.ToString());
            streamWriter.Close();
            AssetDatabase.ImportAsset(pathName);
            return AssetDatabase.LoadAssetAtPath(pathName, typeof(UnityEngine.Object));
        }

    }
}

#endif