using UnityEngine;
using System.Collections;

namespace KBN {
    public abstract class FTEMgr {
        protected static FTEMgr _instance { get; set; }

        public const int ST_INIT = 0;
        public const int ST_CHECKING = 1;
        public const int ST_INITED = 2;
        public const int ST_STARTED = 3;
        public const int ST_COMPLETED = 4; //FTE completed.
        public const int ST_LASTEND = 5;   //between FTE & start Game.
        
        public const int ST_INVALID = 999;

        protected int _status = 0;
        protected int _curStep = 0;

        protected static bool debugStep = false; //debug switch.
        protected static int FTE_INIT_STEP = 101; //for debug. only valid while debugStep=true
        
        protected static bool cache_debugStep;
        protected static int cache_FTE_INIT_STEP;

        public static bool isPAD = false;

        #region Static public methods
        public static FTEMgr getInstance()
        {
            return _instance;
        }

        public static bool isFTERuning()
        {
            return _instance != null && _instance._status >= ST_STARTED && _instance._status < ST_LASTEND;
        }

        public static bool isCurrentCompleteFTE()
        {
            var seed = GameMain.singleton.getSeed();
            if ( seed == null || seed["fte"] == null || seed["fte"]["completed"] == null )
                return false;
            
            var isFinish = _Global.GetBoolean(seed["fte"]["completed"]);
            return isFinish;
        }

        public static bool isUserStartFTE(int uid, int wid)
        {
            var key = "FTE_" + wid + "_" + uid;
            return PlayerPrefs.HasKey(key);
        }

        public static void restartSetFTE()
        {
            debugStep = cache_debugStep;
            FTE_INIT_STEP = FTE_INIT_STEP;
        }

        public static void skipFTE()
        {
            cache_debugStep = debugStep;
            cache_FTE_INIT_STEP = FTE_INIT_STEP;
            debugStep = true;
            FTE_INIT_STEP = 1303;
        }

        public static bool isUserDidSecondFTE()
        {
            int uid = Datas.singleton.tvuid();
            return priv_isUserDidSecondFTE(uid);
        }
        #endregion

        #region Non-static public methods
        public bool isFinished
        {
            get
            {
                return _status >= ST_COMPLETED;
            }
        }

        public bool isForbiddenMenuMgrEvent
        {
            get
            {
                return _status >= ST_STARTED && _status < ST_LASTEND;
            }
        }

        public bool isAllowContentTouch
        {
            get
            {
                return _status >= ST_LASTEND;
            }
        }

        public int curStep
        {
            get
            {
                return _curStep;
            }
        }

        public abstract void Update();
        public abstract void FixedUpdate();
        public abstract void Draw();

        public abstract void checkNextFTE(int[] steps);
        public abstract void checkNextFTE(int curStep, int step);
        public abstract bool checkNextFTE(int step);

        public abstract int getNextStepBy(int step);
    
        public abstract void PreInit();
        public abstract void Init();
        public abstract void firstInitStep();
        public abstract void startFTE();

        public abstract void showFTENext(int step);
        public abstract void showFTENext(int[] steps);

        public abstract void Debug_SkipTo(int step);

        public abstract void hideFTE(int step);
        #endregion

        #region non-public
        private static bool priv_isUserDidSecondFTE(int uid)
        {
            var key = "FTE_DONE_" + uid;
            return PlayerPrefs.HasKey(key);
        }
        #endregion
    }
}