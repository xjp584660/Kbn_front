using UnityEngine;

using System;
using System.Collections;
using System.Reflection;
using System.Linq;
using System.Text.RegularExpressions;
using System.Text;

public class UtilityTools
{
	public static HashObject Find(HashObject hash,params object[] ps)
	{
		if(ps == null) return null;
		
		for(int i = 0;i<ps.Length;i++)
		{ 
			if(hash == null) return null;
			hash = hash[ps[i].ToString()];
		}
		
		return hash;
	}
	
	// Like:"MenuMgr/xxx/xxx"
	private static Assembly smUnityScriptAsm = null;
	private static System.Reflection.MethodInfo smMenuMgrMethodGetInstance = null;
	private static Assembly GetUnityScriptAssembly()
	{
		if (null != smUnityScriptAsm)
			return smUnityScriptAsm;

		Assembly[] allAsms = System.AppDomain.CurrentDomain.GetAssemblies();
		for (int i = 0; i < allAsms.Length; i++)
		{
			string asmName = allAsms[i].GetName().Name;
			//string asmFullName = allAsms[i].FullName;
			if (asmName.Equals("Assembly-UnityScript"))
			{
				return smUnityScriptAsm = allAsms[i];
			}
		}

		return null;
	}
	
	public static object GetMenuMgrObject()
	{
		if (null == smMenuMgrMethodGetInstance)
		{
			System.Type memuMgrType = GetUnityScriptAssembly().GetType("MenuMgr");
			smMenuMgrMethodGetInstance = memuMgrType.GetMethod("getInstance", BindingFlags.Static | BindingFlags.Public);
		}
		
		if (null == smMenuMgrMethodGetInstance)
			return null;
		
		object menuMgrInst = smMenuMgrMethodGetInstance.Invoke(null, null);
		return menuMgrInst;
	}
	
	public static object GetMenuObject(string menuClassName)
	{
		object menuMgrInst = GetMenuMgrObject();
		if (null == menuMgrInst)
		{
			throw new System.NullReferenceException("Not a appropriate call time at UtilityTools.GetMenuMgrObject()");
		}
		
		MethodInfo getMenuMethodInfo = null;
		MethodInfo[] menuMethodInfos = menuMgrInst.GetType().GetMethods();
		for (int i = 0; i < menuMethodInfos.Length; i++)
		{
			if (menuMethodInfos[i].Name.Equals("getMenu") && menuMethodInfos[i].GetParameters().Length == 1)
			{
				getMenuMethodInfo = menuMethodInfos[i];
				break;
			}
		}
		
		ParameterInfo[] paramInfos = getMenuMethodInfo.GetParameters();
		if (paramInfos.Length == 0)
		{
			throw new System.ArgumentNullException("GetMenuMgrMethod");
		}
		
		object menuInst = getMenuMethodInfo.Invoke(menuMgrInst, new object[]{menuClassName});
		return menuInst;
	}
	
	public static object GetMenuMemberObject(string hierarchyMemberName)
	{
		string splitChar = ".";
		string[] hierarchyNames = hierarchyMemberName.Split(splitChar.ToCharArray());
		if (hierarchyNames.Length == 0)
		{
			throw new System.ArgumentNullException("hierarchyNames:" + hierarchyMemberName);
		}
		
		return GetMenuMemberObject(hierarchyNames);
	}
	
	public static object GetMenuMemberObject(string[] hierarchyNames)
	{
		object menuMgrInst = GetMenuMgrObject();
		if (null == menuMgrInst)
		{
			throw new System.NullReferenceException("Not a appropriate call time at UtilityTools.GetMenuMgrObject()");
		}
		
		MethodInfo getMenuMethodInfo = menuMgrInst.GetType().GetMethod("getMenu");
		ParameterInfo[] paramInfos = getMenuMethodInfo.GetParameters();
		if (paramInfos.Length == 0)
		{
			throw new System.ArgumentNullException("GetMenuMgrMethod");
		}
		
		string menuClassName = hierarchyNames[0];
		object menuInst = getMenuMethodInfo.Invoke(menuMgrInst, new object[]{menuClassName});
		
		object current = menuInst;
		object parent = current;
		
		System.Reflection.FieldInfo fieldInfo = null;
		for (int i = 1; i < hierarchyNames.Length; i++)
		{
			fieldInfo = parent.GetType().GetField(hierarchyNames[i], BindingFlags.Static | BindingFlags.Instance 
													| BindingFlags.Public | BindingFlags.NonPublic);
			if (null != fieldInfo)
			{
				current = fieldInfo.GetValue(parent);
				parent = current;
			}
		}
		
		return current;
	}
	
	public static object GetClassMemberObject(object parent, string name)
	{
		var pntType = parent.GetType();
		var flg = BindingFlags.Static | BindingFlags.Instance 
			| BindingFlags.Public | BindingFlags.NonPublic
				;
		var fieldInfo = pntType.GetField(name, flg);
		if (null != fieldInfo)
		{
			return fieldInfo.GetValue(parent);
		}

		var prop = pntType.GetProperty(name, flg);
		if ( prop != null )
			return prop.GetValue(parent, null);
		return null;
	}

	public static int GetNumberInt(string str) 
	{ 
		int result = -1; 
		if (str != null && str != string.Empty) 
		{ 
			str = Regex.Replace(str, @"[^\d.\d]", ""); 
			if (Regex.IsMatch(str, @"^[+-]?\d*[.]?\d*$")) 
			{ 
				result = int.Parse(str); 
			} 
		} 
		
		return result; 
	}

	public static string ComputeSHA1HexStringFromString(string src, Encoding encoding=null) {
		if (encoding == null) {
			encoding = Encoding.Default;
		}
		using (var sha1 = System.Security.Cryptography.SHA1.Create()) {
			if (sha1 == null) {
				return src;
			}
			byte[] hashedBytes = sha1.ComputeHash(encoding.GetBytes(src));
			var sb = new StringBuilder();
			foreach (byte b in hashedBytes) {
				sb.Append(b.ToString("x2"));
			}
			return sb.ToString();
		}
	}

    public static Rect AmplifyRectByRatio(Rect rect, float ratio) {
        float newWidth = rect.width * ratio;
        float newHeight = rect.height * ratio;
        return new Rect(rect.x - (newWidth - rect.width) * .5f, rect.y - (newHeight - rect.height) * .5f,
                        newWidth, newHeight);
    }
}
