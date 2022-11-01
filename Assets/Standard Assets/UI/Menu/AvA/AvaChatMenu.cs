using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace KBN {

	public abstract class AvaChatMenu : KBNMenu {

		protected bool g_isNeedUpdateMes = false;

		public bool isNeedUpdateMes{
			get {
				return g_isNeedUpdateMes;
			}
		}

		public abstract List<Hashtable> generateMesForMainChrom();

		public abstract bool whetherGetChat(bool inChatMenu);
		public abstract void getChat(bool isOut);

        public abstract void Clear();

        public virtual void Init()
        {
            Game.Event.RegisterHandler(EventId.AvaStatus, OnAvaStatusChanged);
        }

        private void OnAvaStatusChanged(object Sender, GameFramework.GameEventArgs e)
        {
            AvaStatusEventArgs args = e as AvaStatusEventArgs;
            if (args.Status == AvaEvent.AvaStatus.Frozen)
            {
                Clear();
            }
        }

        protected int wordsLength = 480;
        protected GUIStyle wordsStyle;

        public int MainChromChatTextWidth
        {
            set
            {
                wordsLength = value;
            }
        }


        public GUIStyle MainChromChatTextGUIStyle
        {
            set
            {
                wordsStyle = value;
            }
        }
	}

}