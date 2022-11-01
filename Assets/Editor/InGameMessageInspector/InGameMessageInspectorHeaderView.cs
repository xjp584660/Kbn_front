using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using Mono.Data.Sqlite;
using KBNEditor.Foundation;
using KBN;

namespace InGameMessageInspector
{       
    public class InGameMessageInspectorHeaderView : EditorWindowView<InGameMessageInspectorMainWindow>
    {
        private List<KeyValuePair<string, string>> data;

        public InGameMessageInspectorHeaderView(InGameMessageInspectorMainWindow window) : base(window) {}
        
        public InGameMessageInspectorHeaderView Init(string fileFullPath)
        {
            data = new List<KeyValuePair<string, string>>();
            var dbConn = new SqliteConnection("Data Source=" + fileFullPath);
            dbConn.Open();

            var selectStr = string.Format("SELECT * FROM {0}", MessageDAO.headerTable);
            var cmd = dbConn.CreateCommand();
            cmd.Connection = dbConn;
            cmd.CommandType = CommandType.Text;
            cmd.CommandText = selectStr;
            using (var reader = cmd.ExecuteReader())
            {
                for (int i = 0; i < reader.FieldCount; ++i)
                {
                    var colName = reader.GetName(i);
                    var colValue = reader[colName].ToString();

                    data.Add(new KeyValuePair<string, string>(colName, colValue));
                }
            }
            return this;
        }

        public override void Draw()
        {
            GUILayout.BeginVertical();
            {
                GUILayout.BeginHorizontal();
                {
                    if (GUILayout.Button("Back", GUILayout.MaxWidth(120)))
                    {
                        window.GoToUI(InGameMessageInspectorMainWindow.UIStatus.MainMenu);
                    }
                    GUILayout.FlexibleSpace();
                }
                GUILayout.EndHorizontal();

                foreach (var dataItem in data)
                {
                    GUILayout.BeginHorizontal();
                    {
                        GUILayout.Space(30);
                        GUILayout.Label(dataItem.Key + ": ", GUILayout.Width(150));
                        GUILayout.Label(dataItem.Value);
                    }
                    GUILayout.EndHorizontal();
                }
            }
            GUILayout.EndVertical();
        }
    }
}