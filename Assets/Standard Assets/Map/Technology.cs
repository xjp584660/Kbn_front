using UnityEngine;
using System.Collections;
using System;

namespace KBN
{
    public abstract class Technology
    {
		public static Technology singleton { get; protected set; }
    }
}