using UnityEngine;
using System.Collections;

namespace KBN {
    public abstract class PopupMgr {
        public static PopupMgr instance { get; protected set; }

        protected bool _isLockScreen;
        public bool isLockScreen {
            get {
                return _isLockScreen;
            }
        }

        public abstract bool checkPointOfSeed(string url, HashObject seed);
    }
}