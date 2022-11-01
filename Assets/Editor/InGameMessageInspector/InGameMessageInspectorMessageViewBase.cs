using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using Mono.Data.Sqlite;
using System.Linq;
using System;
using KBNEditor.Foundation;

namespace InGameMessageInspector
{
    public class InGameMessageInspectorMessageViewBase : EditorWindowView<InGameMessageInspectorMainWindow>
    {
        private DataTable dataTable;
        private List<int> colWidths;
        private Vector2 scrollPosition;
        private bool firstDraw = true;
        private string tableName;

        private const int ColSpace = 20;
        private const int MarginUnderTableHeader = 10;
        private const int ViewButtonWidth = 80;

        public InGameMessageInspectorMessageViewBase(InGameMessageInspectorMainWindow window) : base(window) {}

        public InGameMessageInspectorMessageViewBase Init(string fileFullPath, string tableName)
        {
            this.tableName = tableName;
            InitData(fileFullPath);
            return this;
        }

        private void InitData(string fileFullPath)
        {
            var dbConn = new SqliteConnection("Data Source=" + fileFullPath);
            dbConn.Open();
            
            var selectStr = string.Format("SELECT * FROM {0} ORDER BY id", tableName);
            var cmd = dbConn.CreateCommand();
            cmd.Connection = dbConn;
            cmd.CommandType = CommandType.Text;
            cmd.CommandText = selectStr;
            
            dataTable = new DataTable();
            using (var reader = cmd.ExecuteReader())
            {
                for (int i = 0; i < reader.FieldCount; ++i)
                {
                    var colName = reader.GetName(i);
                    var fieldType = reader.GetFieldType(i);
                    dataTable.Columns.Add(colName, fieldType);
                }
                
                while (reader.Read())
                {
                    var row = dataTable.Rows.Add();
                    for (int i = 0; i < reader.FieldCount; ++i)
                    {
                        row[i] = reader[i];
                    }
                }
            }
            dbConn.Close();
        }

        private void InitColWidths()
        {
            colWidths = new List<int>();

            foreach (DataColumn col in dataTable.Columns)
            {
                int maxWidth = Mathf.CeilToInt(GUI.skin.label.CalcSize(new GUIContent(col.ColumnName)).x);

                if (col.DataType == typeof(byte[]))
                {
                    colWidths.Add(Mathf.Max(maxWidth, 80) + 5);
                    continue;
                }

                foreach (DataRow row in dataTable.Rows)
                {
                    int newWidth = Mathf.CeilToInt(GUI.skin.label.CalcSize(new GUIContent(row[col.ColumnName].ToString())).x);
                    maxWidth = Mathf.Max(maxWidth, newWidth);
                }

                colWidths.Add(maxWidth + 5);
            }
        }

        public override void Draw()
        {
            if (firstDraw)
            {
                firstDraw = false;
                InitColWidths();
            }

            GUILayout.BeginVertical();
            {
                DrawBackButtonLayout();
                DrawSubtitleLayout();
                DrawTable();
            }
            GUILayout.EndVertical();
        }

        private void DrawBackButtonLayout()
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
        }

        private void DrawSubtitleLayout()
        {
            GUILayout.BeginHorizontal();
            {
                GUILayout.FlexibleSpace();
                GUILayout.Label(string.Format("Table Name: {0}", tableName));
                GUILayout.FlexibleSpace();
            }
            GUILayout.EndHorizontal();
        }

        private void DrawTable()
        {
            scrollPosition = GUILayout.BeginScrollView(scrollPosition);
            {
                DrawTableHeader();
                GUILayout.Space(MarginUnderTableHeader);
                foreach (DataRow row in dataTable.Rows)
                {
                    DrawTableRow(row);
                }
            }
            GUILayout.EndScrollView();
        }

        private void DrawTableHeader()
        {
            GUILayout.BeginHorizontal();
            for (int i = 0; i < colWidths.Count; ++i)
            {
                if (i > 0)
                {
                    GUILayout.Space(ColSpace);
                }
                GUILayout.Label(dataTable.Columns[i].ColumnName, GUILayout.Width(colWidths[i]));
            }
            GUILayout.EndHorizontal();
        }

        private void DrawTableRow(DataRow row)
        {
            GUILayout.BeginHorizontal();
            for (int i = 0; i < colWidths.Count; ++i)
            {
                if (i > 0)
                {
                    GUILayout.Space(ColSpace);
                }

                DataColumn col = dataTable.Columns[i];
                int colWidth = colWidths[i];

                if (col.DataType == typeof(byte[]))
                {
                    if (GUILayout.Button("View", GUILayout.Width(ViewButtonWidth)))
                    {
                        InGameMessageInspectorMessageDetailWindow.ShowWindow(tableName, Convert.ToInt32(row["id"]), row[col.ColumnName] as byte[]);
                    }
                    GUILayout.Space(colWidth - ViewButtonWidth);
                    continue;
                }
                GUILayout.Label(row[col.ColumnName].ToString(), GUILayout.Width(colWidth));
            }
            GUILayout.EndHorizontal();
        }
    }
}
