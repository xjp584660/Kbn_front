using UnityEngine;
using System.Collections;
#if  UNITY_IOS
public class AndroidJavaObject
{
	public AndroidJavaObject(string s,params object[] p)
	{
		
	}
	public T CallStatic<T>(string s,params object[] p)
	{
		return default(T);
	}
	public void CallStatic(string s,params object[] p)
	{
		
	}
	public void Call(string s,params object[] p)
	{
		
	}
	public T Call<T>(string s,params object[] p)
	{
		return default(T);
	}
}
public class AndroidJavaClass
{
	public AndroidJavaClass(string param)
	{
		
	}
	public T GetStatic<T>(string s)
	{
		return default(T);
	}
	public T CallStatic<T>(string s,params object[] p)
	{
		return default(T);
	}
}
#endif
