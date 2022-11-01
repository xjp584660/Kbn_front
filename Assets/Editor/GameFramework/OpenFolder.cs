//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using System.Diagnostics;
using UnityEditor;
using UnityEngine;

namespace GameFramework.Editor
{
    public class OpenFolder
    {
        [MenuItem("KBN/Game Framework/Open Folder/Data Path")]
        private static void OpenFolderDataPath()
        {
            InternalOpenFolder(Application.dataPath);
        }

        [MenuItem("KBN/Game Framework/Open Folder/Persistent Data Path")]
        private static void OpenFolderPersistentDataPath()
        {
            InternalOpenFolder(Application.persistentDataPath);
        }

        [MenuItem("KBN/Game Framework/Open Folder/Streaming Assets Path")]
        private static void OpenFolderStreamingAssetsPath()
        {
            InternalOpenFolder(Application.streamingAssetsPath);
        }

        [MenuItem("KBN/Game Framework/Open Folder/Temporary Cache Path")]
        private static void OpenFolderTemporaryCachePath()
        {
            InternalOpenFolder(Application.temporaryCachePath);
        }

        private static void InternalOpenFolder(string folder)
        {
            EditorUtility.RevealInFinder(folder);
             
            //switch (Application.platform)
            //{
            //    case RuntimePlatform.WindowsEditor:
            //        Process.Start("Explorer.exe", folder.Replace('/', '\\'));
            //        break;
            //    case RuntimePlatform.OSXEditor:
            //        Process.Start("open", folder);
            //        break;
            //    default:
            //        throw new FrameworkException("Not support open folder in this platform.");
            //}
        }
    }
}
