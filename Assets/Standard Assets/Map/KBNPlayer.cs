using UnityEngine;
using System.Collections;

namespace KBN 
{
    public abstract class KBNPlayer
	{
        protected static KBNPlayer mInstance;
        public static KBNPlayer instance 
		{
            get 
			{
                return mInstance;
            }
        }

        public abstract long getMight();
		public abstract void setMight(int might);
        public abstract int getTitle();
    }
}
