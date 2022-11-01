using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using KBN;
using KBNEditor.Foundation;

namespace InGameMessageInspector
{
    public class InGameMessageInspectorMainWindow : EditorWindow
    {
        public enum UIStatus
        {
            MainMenu,
            Header,
            HomeServerReports,
            AvaReports,
            Inbox,
            Outbox,
            Prize,
        }

        public UIStatus CurrentUIStatus { get; private set; }
        private Dictionary<UIStatus, EditorWindowView<InGameMessageInspectorMainWindow>> uiCollection;
        private EditorWindowView<InGameMessageInspectorMainWindow> currentUI;

        [MenuItem("KBN/In game message inspector")]
        public static void Open()
        {
            string fileFullPath = EditorUtility.OpenFilePanel("Locate the database file", Application.persistentDataPath, "sqdb");
            if (string.IsNullOrEmpty(fileFullPath))
            {
                return;
            }

            var window = EditorWindow.GetWindow<InGameMessageInspectorMainWindow>();
            window.Init(fileFullPath);
        }

        public void GoToUI(UIStatus newStatus)
        {
            if (currentUI != null)
            {
                currentUI.OnLeave();
            }

            currentUI = uiCollection[newStatus];
            CurrentUIStatus = newStatus;
            currentUI.OnEnter();
        }

        private void Init(string fileFullPath)
        {
            minSize = new Vector2(480, 640);
            title = "Messages";
            uiCollection = new Dictionary<UIStatus, EditorWindowView<InGameMessageInspectorMainWindow>>
            {
                { UIStatus.MainMenu, new InGameMessageInspectorMainMenu(this).Init() },
                { UIStatus.Header, new InGameMessageInspectorHeaderView(this).Init(fileFullPath) },
                { UIStatus.HomeServerReports, new InGameMessageInspectorMessageViewBase(this).Init(fileFullPath, MessageDAO.reportTable) },
                { UIStatus.AvaReports, new InGameMessageInspectorMessageViewBase(this).Init(fileFullPath, MessageDAO.AvaReportTable) },
                { UIStatus.Inbox, new InGameMessageInspectorMessageViewBase(this).Init(fileFullPath, MessageDAO.inboxTable) },
                { UIStatus.Outbox, new InGameMessageInspectorMessageViewBase(this).Init(fileFullPath, MessageDAO.outboxTable) },
                { UIStatus.Prize, new InGameMessageInspectorMessageViewBase(this).Init(fileFullPath, MessageDAO.prizeTable) },
            };
            GoToUI(UIStatus.MainMenu);
        }

        private void OnGUI()
        {
            GUILayout.BeginArea(new Rect(0, 0, position.width, position.height));
            if (currentUI != null)
            {
                currentUI.Draw();
            }
            GUILayout.EndArea();
        }
    }
}
