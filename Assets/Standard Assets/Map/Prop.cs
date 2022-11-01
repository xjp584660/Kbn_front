using UnityEngine;
using System.Collections;

namespace KBN
{
    public abstract class Prop
    {
        protected static Prop _instance;

        public static Prop Instance
        {
            get
            {
                return _instance;
            }
        }

        public abstract PropVO getBoostCombatProp(int pid);
    }
}