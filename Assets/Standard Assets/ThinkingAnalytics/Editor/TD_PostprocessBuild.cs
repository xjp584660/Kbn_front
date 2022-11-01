#if UNITY_IPHONE

using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

namespace ThinkingAnalytics.Editors
{
    public class TD_PostProcessBuild
    {
        [PostProcessBuild]
        public static void OnPostProcessBuild(BuildTarget buildTarget, string path)
        {
            if (buildTarget != BuildTarget.iOS)
            {
                return;
            }

            string projPath = PBXProject.GetPBXProjectPath(path);

            PBXProject proj = new PBXProject();
            proj.ReadFromString(File.ReadAllText(projPath));

            string mainTargetGuid;
            string unityFrameworkTargetGuid;
                    
            var unityMainTargetGuidMethod = proj.GetType().GetMethod("GetUnityMainTargetGuid");
            var unityFrameworkTargetGuidMethod = proj.GetType().GetMethod("GetUnityFrameworkTargetGuid");
                            
            if (unityMainTargetGuidMethod != null && unityFrameworkTargetGuidMethod != null)
            {
                mainTargetGuid = (string)unityMainTargetGuidMethod.Invoke(proj, null);
                unityFrameworkTargetGuid = (string)unityFrameworkTargetGuidMethod.Invoke(proj, null);
            }
            else
            {
                mainTargetGuid = proj.TargetGuidByName ("Unity-iPhone");
                unityFrameworkTargetGuid = mainTargetGuid;
            }

            proj.AddBuildProperty(unityFrameworkTargetGuid, "OTHER_LDFLAGS", "-ObjC");

            File.WriteAllText(projPath, proj.WriteToString());
        }


        //配置Xcode选项
#if UNITY_EDITOR && UNITY_IOS
        //[PostProcessBuild]
        [PostProcessBuildAttribute(88)]
        public static void onPostProcessBuild(BuildTarget target, string targetPath)
        {
            if (target != BuildTarget.iOS)
            {
                //Debug.LogWarning("Target is not iPhone. XCodePostProcess will not run");
                return;
            }

            string projPath = Path.GetFullPath(targetPath) + "/Unity-iPhone.xcodeproj/project.pbxproj";

            UnityEditor.iOS.Xcode.PBXProject proj = new UnityEditor.iOS.Xcode.PBXProject();
            proj.ReadFromFile(projPath);
#if UNITY_2019_3_OR_NEWER
            string targetGuid = proj.GetUnityFrameworkTargetGuid();
#else
            string targetGuid = proj.TargetGuidByName(PBXProject.GetUnityTargetName());
#endif

            //Build Property
            proj.SetBuildProperty(targetGuid, "ENABLE_BITCODE", "NO");//BitCode  NO
            proj.SetBuildProperty(targetGuid, "GCC_ENABLE_OBJC_EXCEPTIONS", "YES");//Enable Objective-C Exceptions

            string[] headerSearchPathsToAdd = { "$(SRCROOT)/Libraries/Plugins/iOS/ThinkingSDK/Source/main", "$(SRCROOT)/Libraries/Plugins/iOS/ThinkingSDK/Source/common" };
            proj.UpdateBuildProperty(targetGuid, "HEADER_SEARCH_PATHS", headerSearchPathsToAdd, null);// Header Search Paths

            //Add Frameworks
            proj.AddFrameworkToProject(targetGuid, "WebKit.framework", true);
            proj.AddFrameworkToProject(targetGuid, "CoreTelephony.framework", true);
            proj.AddFrameworkToProject(targetGuid, "SystemConfiguration.framework", true);
            proj.AddFrameworkToProject(targetGuid, "Security.framework", true);
            proj.AddFrameworkToProject(targetGuid, "UserNotifications.framework", true);

            //Add Lib
            proj.AddFileToBuild(targetGuid, proj.AddFile("usr/lib/libsqlite3.tbd", "libsqlite3.tbd", PBXSourceTree.Sdk));
            proj.AddFileToBuild(targetGuid, proj.AddFile("usr/lib/libz.tbd", "libz.tbd", PBXSourceTree.Sdk));

            proj.WriteToFile(projPath);

            //Info.plist
            //禁用预置属性
            string plistPath = Path.Combine(targetPath, "Info.plist");
            PlistDocument plist = new PlistDocument();
            plist.ReadFromFile(plistPath);
            plist.root.CreateArray("TDDisPresetProperties");
            //foreach (string item in TD_PublicConfig.DisPresetProperties)
            //{
            //    plist.root["TDDisPresetProperties"].AsArray().AddString(item);
            //}
            plist.WriteToFile(plistPath);
        }
#endif


    }
}

 #endif

//#if UNITY_EDITOR && UNITY_ANDROID

//using System.IO;
//using UnityEditor;
//using UnityEditor.Android;
//using UnityEngine;

//using System.Xml;
//using System.Collections.Generic;

//class TD_PostProcessBuild : IPostGenerateGradleAndroidProject
//{
//    // 拷贝个性化配置文件 ta_public_config.xml
//    public int callbackOrder { get { return 0; } }
//    public void OnPostGenerateGradleAndroidProject(string path)
//    {
//        // 拷贝个性化配置文件 ta_public_config.xml
//        string desPath = path + "/../launcher/src/main/res/values/ta_public_config.xml";        
//        if (File.Exists(desPath))
//        {
//            File.Delete(desPath);
//        }
//        TextAsset textAsset = Resources.Load<TextAsset>("ta_public_config"); 
//        if (textAsset != null && textAsset.bytes != null)
//        {
//            File.WriteAllBytes(desPath, textAsset.bytes);
//        }
//    }
//}

//#endif
