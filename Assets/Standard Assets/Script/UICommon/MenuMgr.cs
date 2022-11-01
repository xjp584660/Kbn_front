using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public abstract class MenuMgr : MonoBehaviour
	{
		public const int SCREEN_WIDTH = 640;
		public const int SCREEN_HEIGHT = 960;

        public static MenuMgr instance { get; protected set; }

        protected bool bNetBlock;
		public SimpleLabelImple iphoneXTop;
		public SimpleLabelImple iphoneXBottom;
		[SerializeField] protected ConfirmDialog confirmDialog;
		[HideInInspector] protected ConfirmDialog catch_confirmDialog;
		protected KBNMenu curMenu = null;
		protected bool androidBackEnable=true;


		public void InitIphonexFrame(){
			iphoneXTop = UILayout.ObjectFactory.CreateObject("Label") as SimpleLabelImple;
			iphoneXTop.NormalBackground = TextureMgr.instance().LoadTexture("iphoneX_Top", TextureType.LOAD);
			iphoneXTop.rect=new Rect (0,0,KBN._Global.ScreenWidth,_Global.IphoneXTopFrameHeight2());

			iphoneXBottom = UILayout.ObjectFactory.CreateObject("Label") as SimpleLabelImple;
			iphoneXBottom.NormalBackground = TextureMgr.instance().LoadTexture("iphoneX_Bottom", TextureType.LOAD);
			iphoneXBottom.rect=new Rect (0,0,KBN._Global.ScreenWidth,(_Global.IphoneXBottomFrameHeight2()));
		}
		
		public bool AndroidBackEnable {
			get {
				return androidBackEnable;
			}
			set {
				androidBackEnable = value;
			}
		}
        public bool netBlock {
            set {
				if(value)
					RecorderWaitingTime.startLoading();
				else 
					RecorderWaitingTime.finishLoading();
                bNetBlock = value;
            }

            get {
                return bNetBlock;
            }
        }

		public abstract void PushMenu(string menuName, object param);
        public abstract void PushMenu(string menuName, object param, string transition);
		public abstract void sendNotification(string type, object body);
		public abstract void sendNotification(object note);
        public abstract void ClearAllianceChatInfo();
        public abstract bool hasMenuByName(string name);
        public abstract void pop2Menu(string name);
		public abstract bool CanTouchMap();
		public abstract bool isHitUI(Vector2 pos);

		// temporary for MapController migration, TODO remove these if possible
		public abstract void setCoordinateBar(string x, string y);
		public abstract float getCoordinateBarHeight();
		public abstract void showSceneMessage(string msg, Rect startPosition, Rect endPosition, float showTime, bool showImage, bool withSound);
		public abstract void setSceneMessage(string msg);
		public abstract void forceFinishSceneMessage();
		public abstract void setWaitingLabelVisiable(bool v);
		public abstract void mainChromHideAllList();
		public abstract void SetWorldBossInfoVis(bool show,object bossInfo);

		public abstract void PopMenu(string menuName);
		public abstract void PopMenu(string menuName, string transition);
        public void SendNotification(string type, object body = null)
        {
            sendNotification(type, body);
        }
		public abstract void SwitchMenu(string menuName, object param);

		protected bool curActive=true;
		public abstract void SetCurVisible(bool active);

        // Toast
		public abstract void PushMessage(string msg);
        public abstract void PushMessage(string msg, Rect position);
        public abstract void PushMessage(string msg, float showTime, bool showImage);
        public abstract void PushMessage(string msg, Rect startPosition, Rect endPosition);
        public abstract void PushMessage(string msg, Rect startPosition, Rect endPosition,
                                         float showTime, bool withImage, bool withSound);
        public abstract void PushMessageWithImage(string msg, Tile tile);
        public abstract void PushMessageWithImage(string msg, Rect startPosition, Rect endPosition, Tile tile,
                                                  float showTime, bool withSound);

        private const int AvaToastHeight = 200;
        private const int AvaToastDisplacement = 100;
        private static readonly Rect AvaToastBegRect = new Rect(0, SCREEN_HEIGHT / 2 - AvaToastHeight - AvaToastDisplacement, SCREEN_WIDTH, AvaToastHeight);
        private static readonly Rect AvaToastEndRect = new Rect(0, SCREEN_HEIGHT / 2 - AvaToastHeight, SCREEN_WIDTH, AvaToastHeight);

        public void PushAvaToast(string msg)
        {
            float showTime = 3f;
            PushMessage(msg, AvaToastBegRect, AvaToastEndRect, showTime, false, true);
        }

		public abstract string GetCurMenuName();
		public abstract KBNMenu Top();

		public ConfirmDialog getConfirmDialog()
		{
			if ( catch_confirmDialog == null )
				catch_confirmDialog = confirmDialog.GetNewDialog();
			return catch_confirmDialog;
		}
		public abstract void PushConfirmDialog(string strContent, string titleContent, System.Action<object> okFunc, System.Action<object> cancelFunc, bool autoClose);
		public void PushConfirmDialog(string strContent, string titleContent, System.Action<object> okFunc, System.Action<object> cancelFunc)
		{
			PushConfirmDialog(strContent, titleContent, okFunc, cancelFunc, false);
		}

		public abstract void PushPaymentMenu();
		public abstract void PushPaymentMenu(int biType);

		public virtual KBNMenu GetCurMenu()
		{
			return curMenu;
		}

		public abstract KBNMenu getMenu(string menuClassName);
		public abstract KBNMenu getMenu(string menuClassName, bool bOrig);
        public abstract KBNMenu GetMenuToCallFunc(string menuClassName,System.Action<KBNMenu> Func);
		public abstract KBNMenu GetMainChromeMenu();
		public abstract int GetTopOfferTypeOfMainChrome();
        public abstract void PushDailyQuestRewardMessage(string msg, DailyQuestDataAbstract quest);

		public abstract KBN.AvaChatMenu getAvaChatMenu();
		public abstract void PushQuitGameConfirmDailog();
        protected abstract bool MenuStackIsEmpty();

		public abstract Rect GetCoordinateBarRect();
		public abstract Rect GetCoordinateBarShowMarchLineBtnRect();

        protected bool CheckMainChromeInMenuStack(string menuName)
        {
            if (menuName == "MainChrom")
            {
                return true;
            }

            return !MenuStackIsEmpty();
        }

		protected bool isAvaWaitingLabelVisible = false;
		public void setAvaWaitingLabelVisiable(bool v) 
		{
			AvaMainChrome avaMainChrome = getMenu ("AvaMainChrome") as AvaMainChrome;
			if(avaMainChrome != null)
			{
				avaMainChrome.waitingLabel.SetVisible(v);
				isAvaWaitingLabelVisible = v;
			}
		}


		/// <summary>
        /// 从 resources 中获得界面 menu 资源的配置数据
        /// </summary>
        /// <returns></returns>
		protected Dictionary<string, string> GetMenuResConfig() {
			var configText = Resources.Load<TextAsset>("MenuResConfig");
			return LitJson.JsonMapper.ToObject<Dictionary<string, string>>(configText.text);
		}
	}
}
