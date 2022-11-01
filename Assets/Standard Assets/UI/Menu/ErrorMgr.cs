using UnityEngine;
using System;
using System.Collections;

public class Error {
    public string title;
    public string errorMsg;
    public string btnName;
    public MulticastDelegate action;
    public MulticastDelegate clsoeAction;
    public Rect rect;
    public bool closeAble;
}

namespace KBN {
    public abstract class ErrorMgr {
        public static ErrorMgr singleton { get; protected set; }
        public abstract void PushError(string title, string errorMsg);
        public abstract void PushError(string title, string errorMsg, bool closeAble, string btnName, MulticastDelegate action);
        public abstract void PushError(string title, string errorMsg, bool closeAble, string btnName, MulticastDelegate action, MulticastDelegate closeAction);
        public delegate void ClickAction();
		public void PushErrorWithAction(string title, string errorMsg, bool closeAble, string btnName, ClickAction action)
		{
			PushError(title, errorMsg, closeAble, btnName, action);
		}
        public void PushErrorWithAction(string title, string errorMsg, bool closeAble, string btnName, ClickAction action, ClickAction closeAction)
        {
            PushError(title, errorMsg, closeAble, btnName, action, closeAction);
        }
    }
}