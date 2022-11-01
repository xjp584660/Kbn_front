using UnityEngine;
using System.Collections;
using System;

namespace KBN
{
	public abstract class GestureManager
	{
		private bool enable;
		public static GestureManager singleton { get; protected set; }
		public abstract void RegistTouchable(ITouchable touch);
		public abstract void RemoveTouchable(ITouchable touch);
		public abstract void RegistReceiver(GestureReceiver receiver);
		public abstract void RemoveReceiver(GestureReceiver receiver);


		//public abstract void Draw();
		public bool Enable
		{
			get
			{
				return enable;
			}
			set
			{
				enable = value;
			}
		}
		public enum GestureEventType 
		{
			LongPress,
			LongRelease,
			LongMove,
			Clicked, 
			DoubleClicked,
			LargeAreaClicked, 	
			LargeAreaDoubleClicked,
			SlidePress,
			SlideMove,
			SlideOver
		}

	}
	

}
