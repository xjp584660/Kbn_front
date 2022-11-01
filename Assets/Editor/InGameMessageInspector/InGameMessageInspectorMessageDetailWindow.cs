using UnityEngine;
using UnityEditor;
using System.Collections;
using KBN;

namespace InGameMessageInspector
{
    public class InGameMessageInspectorMessageDetailWindow : EditorWindow
    {
        private Vector2 scrollPosition;
        
        private string textToDisplay;

        public static void ShowWindow(string tableName, int id, byte[] rawData)
        {
            if (rawData == null)
            {
                return;
            }

            var window = EditorWindow.CreateInstance<InGameMessageInspectorMessageDetailWindow>();
            window.title = string.Format("In Game Message Detail - {0} - id: {1}", tableName, id);
            window.minSize = new Vector2(480, 640);
            window.Init(rawData);
            window.ShowUtility();
        }

        private void Init(byte[] rawData)
        {
            try
            {
                HashObject ho = new HashObject(SerializationUtils.getInstance().BytesToHashtable(rawData));
                textToDisplay = ho.ToString();
            }
            catch (System.Exception e)
            {
                textToDisplay = "Illegal data!!\n" + e.StackTrace;
            }
        }

        private void OnGUI()
        {
            GUILayout.BeginArea(new Rect(0, 0, position.width, position.height));
            scrollPosition = GUILayout.BeginScrollView(scrollPosition);
            GUILayout.TextField(textToDisplay);
            GUILayout.EndScrollView();
            GUILayout.EndArea();
        }
    }
}