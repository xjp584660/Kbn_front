using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;
using KBNEditor.Foundation;

namespace InGameMessageInspector
{
    public class InGameMessageInspectorMainMenu : EditorWindowView<InGameMessageInspectorMainWindow>
    {
        private class ButtonParam
        {
            public string Title { get; set; }
            public Action OnClick { get; set; }
        }

        private List<ButtonParam> buttonParams = new List<ButtonParam>();

        public InGameMessageInspectorMainMenu(InGameMessageInspectorMainWindow window) : base(window) {}

        public InGameMessageInspectorMainMenu Init()
        {
            InitButtonParams();
            return this;
        }

        private void InitButtonParams()
        {
            AddButtonParam("Header", () => window.GoToUI(InGameMessageInspectorMainWindow.UIStatus.Header));
            AddButtonParam("Home server reports", () => window.GoToUI(InGameMessageInspectorMainWindow.UIStatus.HomeServerReports));
            AddButtonParam("AVA reports", () => window.GoToUI(InGameMessageInspectorMainWindow.UIStatus.AvaReports));
            AddButtonParam("Inbox", () => window.GoToUI(InGameMessageInspectorMainWindow.UIStatus.Inbox));
            AddButtonParam("Outbox", () => window.GoToUI(InGameMessageInspectorMainWindow.UIStatus.Outbox));
            AddButtonParam("Prize", () => window.GoToUI(InGameMessageInspectorMainWindow.UIStatus.Prize));
        }

        private void AddButtonParam(string title, Action onClick)
        {
            buttonParams.Add(new ButtonParam
            {
                Title = title,
                OnClick = onClick,
            });
        }

        public override void Draw()
        {
            GUILayout.BeginVertical();
            foreach (var buttonParam in buttonParams)
            {
                if (GUILayout.Button(buttonParam.Title, GUILayout.MinHeight(35)) && buttonParam.OnClick != null)
                {
                    buttonParam.OnClick();
                }
            }
            GUILayout.EndVertical();
        }
    }
}
