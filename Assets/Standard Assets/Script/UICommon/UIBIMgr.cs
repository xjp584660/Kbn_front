using UnityEngine;
using System.Collections;
using System.IO;
namespace KBN
{
	public class UIBIMgr : MonoBehaviour 
	{

       //private static UIBIMgr instance;
	   public static UIBIMgr Instance{
		   get ;set;
	   }
     	public virtual void OnMenuPush(string menuName){}
	    public virtual void OnMenuPop(string menuName){}

	}
}
