using UnityEngine;
using System.Collections;
using System;

namespace KBN {
    public abstract class NewFteMgr {
        public static NewFteMgr instance { get; protected set; }
        public static bool IsEnterGame { get; set; }

        protected bool isAllFteCompleted = false;
        public bool IsAllFteCompleted {
            get {
                return isAllFteCompleted;
            }
        }

        public abstract bool CheckNeedFteLocalServer(string url, WWWForm from, MulticastDelegate okFunc, MulticastDelegate errorFunc);
		public abstract bool IsDoingFte
		{
			get;
		}
		public abstract void OnTabChangedIndex(ToolBar toolbar, int index);
	}
}
