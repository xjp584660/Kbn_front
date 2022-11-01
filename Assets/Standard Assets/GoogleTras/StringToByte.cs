using UnityEngine;
using System.Collections;
using System.Text;
using System;

namespace KBN
{
	public class StringToByte : MonoBehaviour {

		private static StringToByte singleton=null;

		public static StringToByte instance(){
			if( singleton == null )
			{
				GameObject obj=new GameObject("StringToByte");
				obj.AddComponent<StringToByte>();
				singleton = obj.GetComponent<StringToByte>();
			}
			return singleton as StringToByte;
		}

		public static string ChineseToBinary(string c)
	    {
	    	string s=c.ToString();
//	        byte[] data = Encoding.Unicode.GetBytes(s);
			byte[] data =Encoding.Default.GetBytes(c);
	        StringBuilder result = new StringBuilder(data.Length * 8);
	        foreach (byte b in data)
	        {
	            result.Append(Convert.ToString(b, 2).PadLeft(8, '0'));
	        }
	        return result.ToString();


	    }

	    public static void ByteToValue(byte b,ref int lv,ref int type){
	    	lv=b>>4;
	    	type=b-(lv<<4);
	    	Debug.LogWarning("lv:"+lv+" type:"+type);
	    }
	}

}
