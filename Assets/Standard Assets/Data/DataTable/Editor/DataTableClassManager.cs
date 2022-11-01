#if UNITY_EDITOR
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using UnityEditor;
using UnityEngine;

namespace KBN.DataTable.Editor
{
    public class DataTableClassManager : EditorWindow
    {
        #region Fields

        private static List<DataTableClassInfo> _DataTableClassInfoList;

		private const string AssemblyDllPath = "Library/ScriptAssemblies/Assembly-CSharp-firstpass.dll";

        private static readonly List<DataTableFieldInfo> RemoveDataTableFieldInfoList = new List<DataTableFieldInfo>();

        private static readonly List<DataTableClassInfo> RemoveDataTableClassInfoList = new List<DataTableClassInfo>();

        private Vector2 _ScrollPos;

        #endregion

        #region Methods

        #region Public

        [MenuItem("KBN/DataTable/Open DataTable Editor")]
        public static void OpenClassManager()
        {
            GetWindow<DataTableClassManager>(false, "DataTable", true);
        }

        #endregion

        #region Protected

        protected void OnGUI()
        {
            if (_DataTableClassInfoList == null)
            {
                UpdateDataTableClasses();
            }
            if (_DataTableClassInfoList == null)
            {
                return;
            }
            GUILayout.Space(10);

            EditorGUILayout.BeginHorizontal();
            DrawNewClass();
            DrawImportClass();
            DrawExportAllClasses();
            EditorGUILayout.EndHorizontal();
            GUILayout.Space(20);
            GUILayout.Label("Data Table List:");
            _ScrollPos = EditorGUILayout.BeginScrollView(_ScrollPos, GUILayout.Width(position.width), GUILayout.Height(position.height - 100f));
            DrawDataTableClassInfoList();
            EditorGUILayout.EndScrollView();
        }

        #endregion

        #region Private

        private static void UpdateDataTableClasses()
        {
            _DataTableClassInfoList = new List<DataTableClassInfo>();
            var assembly = Assembly.LoadFile(AssemblyDllPath);
            var types = assembly.GetTypes();
            foreach (var type in types.Where(type => type.GetInterface(DataTableEditorUtility.DataItemInterfaceName) != null && !type.IsAbstract))
            {
                var dataTableClassInfo = new DataTableClassInfo();
                _DataTableClassInfoList.Add(dataTableClassInfo);
                dataTableClassInfo.ClassName = type.ToString();
                foreach (var field in type.GetFields())
                {
                    dataTableClassInfo.DataTableFieldInfoList.Add(new DataTableFieldInfo
                        {
                            Name = field.Name,
                            Type = TypeNameToDataTableFieldType(field.FieldType.ToString())
                        });
                }
            }
        }

        private static DataTableFieldType TypeNameToDataTableFieldType(string typeName)
        {
            switch (typeName)
            {
                case "System.Int32":
                    return DataTableFieldType.Int;
                case "System.Single":
                    return DataTableFieldType.Float;
                case "System.String":
                    return DataTableFieldType.String;
				case "System.DateTime":
					return DataTableFieldType.DateTime;
            }

            return DataTableFieldType.String;
        }

        private static void DrawDataTableClassInfoList()
        {
            RemoveDataTableClassInfoList.Clear();
            foreach (var dataTableClassInfo in _DataTableClassInfoList)
            {
                EditorGUILayout.Space();
                EditorGUILayout.BeginHorizontal();
                if (dataTableClassInfo.Collapse)
                {
                    if (GUILayout.Button("▶", GUILayout.Width(22)))
                    {
                        dataTableClassInfo.Collapse = false;
                    }
                }
                else
                {
                    if (GUILayout.Button("-", GUILayout.Width(22)))
                    {
                        dataTableClassInfo.Collapse = true;
                    }
                }

                dataTableClassInfo.ClassName = EditorGUILayout.TextField(dataTableClassInfo.ClassName.Replace("KBN.DataTable.", ""));

                var dataTableFieldInfoList = dataTableClassInfo.DataTableFieldInfoList;
                if (GUILayout.Button("Add DataFiled", GUILayout.Width(120)))
                {
                    dataTableFieldInfoList.Add(new DataTableFieldInfo() { Name = "Untitled" });
                }

                var assembly = Assembly.LoadFile(AssemblyDllPath);
                var type = assembly.GetType("KBN.DataTable." + dataTableClassInfo.ClassName);
                if (type != null && GUILayout.Button("List Header", GUILayout.Width(120)))
                {
                    Debug.Log(DataTableEditorUtility.GetDataHeader(type));
                }

                Color bc = GUI.backgroundColor;

                GUI.backgroundColor = Color.green;
                if (GUILayout.Button("Export DataTable", GUILayout.Width(120)))
                {
                    File.WriteAllText(Path.Combine(DataTableEditorUtility.CSharpFilePath, dataTableClassInfo.ClassName + ".cs"), DataTableEditorUtility.GetCSharpFile(dataTableClassInfo));
                    AssetDatabase.Refresh();
                }

                GUI.backgroundColor = Color.red;
                if (GUILayout.Button("Delete DataTable", GUILayout.Width(120)))
                {
                    RemoveDataTableClassInfoList.Add(dataTableClassInfo);
                }
                GUI.backgroundColor = bc;

                EditorGUILayout.EndHorizontal();
                if (dataTableClassInfo.Collapse)
                {
                    continue;
                }
                RemoveDataTableFieldInfoList.Clear();
                int index = 0;
                foreach (var filedInfo in dataTableFieldInfoList)
                {
                    EditorGUILayout.BeginHorizontal();
                    EditorGUILayout.LabelField(string.Format("\t{0})", (index++).ToString()), GUILayout.Width(40));
                    filedInfo.Name = EditorGUILayout.TextField(filedInfo.Name, GUILayout.Width(200));
                    GUILayout.Space(10);
                    filedInfo.Type = (DataTableFieldType)EditorGUILayout.EnumPopup(filedInfo.Type, GUILayout.Width(80));

                    GUI.backgroundColor = Color.red;
                    if (GUILayout.Button("x", GUILayout.Width(22)))
                    {
                        RemoveDataTableFieldInfoList.Add(filedInfo);
                    }
                    GUI.backgroundColor = bc;

                    EditorGUILayout.EndHorizontal();
                }
                foreach (var filedInfo in RemoveDataTableFieldInfoList)
                {
                    dataTableFieldInfoList.Remove(filedInfo);
                }
            }
            foreach (var dataTableClassInfo in RemoveDataTableClassInfoList)
            {
                _DataTableClassInfoList.Remove(dataTableClassInfo);
                File.Delete(Path.Combine(DataTableEditorUtility.CSharpFilePath, dataTableClassInfo.ClassName + ".cs"));
                AssetDatabase.Refresh();
            }
        }

        private static void DrawNewClass()
        {
            if (GUILayout.Button("New DataTable Class", GUILayout.Height(30)))
            {
                _DataTableClassInfoList.Add(new DataTableClassInfo() { ClassName = "Untitled" });
            }
        }

        private static void DrawImportClass()
        {
            if (GUILayout.Button("Import DataTable Class", GUILayout.Height(30)))
            {
                string path = EditorUtility.OpenFilePanel("Import DataTable Class", "", "txt");
                if (string.IsNullOrEmpty(path))
                {
                    return;
                }

                path = path.Replace('\\', '/');
                int classNamePos = path.LastIndexOf('/');
                string className = classNamePos < 0 ? path : path.Substring(classNamePos + 1);
                int classNameLength = className.IndexOf('.');
                if (classNameLength > 0)
                {
                    className = className.Substring(0, classNameLength);
					className = className.Substring(0,1).ToUpper() + className.Substring(1);
                }

                File.WriteAllText(Path.Combine(DataTableEditorUtility.CSharpFilePath, className + ".cs"), DataTableEditorUtility.GetCSharpFile(className, File.ReadAllText(path)));
                AssetDatabase.Refresh();
            }
        }

        private static void DrawExportAllClasses()
        {
            if (GUILayout.Button("Export All DataTable Classes", GUILayout.Height(30)))
            {
                foreach (var dataTableClassInfo in _DataTableClassInfoList)
                {
                    File.WriteAllText(Path.Combine(DataTableEditorUtility.CSharpFilePath, dataTableClassInfo.ClassName + ".cs"), DataTableEditorUtility.GetCSharpFile(dataTableClassInfo));
                }
                AssetDatabase.Refresh();
            }
        }

        #endregion

        #endregion
    }
}
#endif