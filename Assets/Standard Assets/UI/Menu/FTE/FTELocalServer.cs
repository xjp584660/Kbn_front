using UnityEngine;
using System.Collections;

namespace KBN {
    public abstract class FTELocalServer {
        protected static FTELocalServer _instance { get; set; }
        public static FTELocalServer getInstance() {
            return _instance;
        }

        public abstract object doRequest(string url, WWWForm form);
    }
}