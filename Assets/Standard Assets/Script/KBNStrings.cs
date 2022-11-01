using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;

public class KBNString
{
	//private static KBNString g_instance;
	private IDictionary m_Strings;
	private bool m_bReady = false;
	
	/*
	public static KBNString getInstance()
	{
		if(g_instance == null)
		{
			g_instance = new KBNString();	
		}
		return g_instance;
	}
	
	public static void SetInstance(KBNString instance)
	{
		g_instance = instance;
	}
	*/
	
	public void Init (byte[] bytes)
	{
		if (m_Strings == null)
		{
			m_Strings = new Dictionary<string,string> ();
		}
		parseBytes (bytes);
		m_bReady = true;
	}
	
	public void Init (FileInfo file)
	{
		if (m_Strings == null)
		{
			m_Strings = new Dictionary<string,string> ();
		}
		using (Stream stream = new FileStream(file.FullName,FileMode.Open)) {
//			parseStream (stream);
			parseStream2(stream);
		}
		m_bReady = true;
	}
	
	public bool IsStringReady()
	{
		return m_bReady;
	}
	
	public void parseBytes (byte[] bytes)
	{
		using (Stream InStream = new MemoryStream(bytes)) {
			parseStream (InStream);
		}
	}
	
	public void parseStream (Stream stream)
	{
		using (StreamReader reader = new StreamReader(stream)) {
			StringBuilder builder = new StringBuilder ();
			bool readKey = true;
			
			string Key = string.Empty;
			int ch;
			bool escape = false;
			while ((ch = reader.Read()) != -1) {
				if (escape == false && ch == '\\') {
					escape = true;
					continue;
				}
				if (readKey && ch == ':') {
					
					Key = builder.ToString ();
					
					builder.Remove (0, builder.Length);
					readKey = false;
					continue;
				}

				if (escape == true) {
					switch (ch) {
						case 'n':
							ch = '\n';
							break;
								
						case 'r':
							ch = '\r';
							break;
						case 'f':
							ch = '\f';
							break;
								
						case '\\':
							ch = '\\';
							break;
							
						case 't':
							ch = '\t';
							break;
								
						case 'b':
							ch = '\b';
							break;
							
						case '/':
							ch = '/';
							break;
							
						case '"':
							ch = '"';
							break;
								
						case 'u':
							int uffff = 0;
							for (int i=0; i<4; i++) {
								char chr = (char)reader.Read ();
								int hex = HexToInt (chr);
								if (hex < 0) {
									uffff = (int)chr;
									break;
								}
								uffff = uffff * 16 + hex;
							}
							ch = (char)uffff;
							break;
						default:
							escape = false;
							break;
						
					}
				}
				if (escape == false) {
					if ((ch == '\r' || ch == '\n')) {
						if (!readKey) {
//							string internkey = System.String.Intern(Key);
//							if (internkey == "Organization.Title")
//							{
//								Debug.Log("~~~~~");
//							}
							m_Strings [System.String.Intern (Key)] = builder.ToString ();	
						}
						builder.Remove (0, builder.Length);
						readKey = true;	
						continue;
					}
				} else {
					escape = false;
				}
				builder.Append ((char)ch);
			}
		}
	}
	public void parseStream2 (Stream stream)
	{
		string item=string.Empty;
		System.DateTime startTime=System.DateTime.Now;
		KBN._Global.Log("$$$$$  After parseStream2---1 : " + (System.DateTime.Now - startTime).TotalMilliseconds);
		using (StreamReader reader = new StreamReader(stream)) {
			StringBuilder builder = new StringBuilder ();
			item=reader.ReadLine();
			while (item!=null) {
				saveToDic(item);
				item=reader.ReadLine();
			}

		}
		KBN._Global.Log("$$$$$  After parseStream2---2 : " + (System.DateTime.Now - startTime).TotalMilliseconds);

	}

	private void saveToDic(string data){
		if(string.IsNullOrEmpty(data)) return;
		int index=data.IndexOf(":");
		try {
			string key=data.Substring(0,index);
			string value=UnicodeToString( data.Substring(index+1));
			value = System.Text.RegularExpressions.Regex.Unescape(value);
			if(m_Strings.Contains(key)){
				m_Strings[key]=value;
			}else{
				m_Strings.Add(key,value);
			}
		} catch (System.Exception ex) {
			KBN._Global.Log(string.Format("parse local string data error:{0}",data));
		}


	}

	public static string UnicodeToString(string srcText)  
	{  
		
		StringBuilder U2SstringRes = new StringBuilder(); 
		byte[] bytes = new byte[2];  
		string[] U2Sseparator = { "\\u"};
		string[] arr = srcText.Split(U2Sseparator,System.StringSplitOptions.None);
		for (int i = 0; i < arr.Length; i++) {
			if (i == 0 && !string.IsNullOrEmpty(arr[i])) {
				U2SstringRes.Append (arr [i]);
				continue;
			}
			//			Debug.Log (arr [i]);
			try {
				bytes[1] = byte.Parse(int.Parse(arr[i].Substring(0, 2), System.Globalization.NumberStyles.HexNumber).ToString());  
				bytes[0] = byte.Parse(int.Parse(arr[i].Substring(2, 2), System.Globalization.NumberStyles.HexNumber).ToString());
				
				U2SstringRes.Append(  Encoding.Unicode.GetString(bytes)).Append(arr[i].Substring(4)); 
				if(arr[i].Length>4){
					
				}
			} catch (System.Exception ex) {
				U2SstringRes.Append( arr[i]); 
			}
			
		}
		return U2SstringRes.ToString().Replace(@"\/","/");  
	}

	public int HexToInt (char h)
	{
		if ((h >= '0') && (h <= '9')) {
			return (h - '0');
		}
		if ((h >= 'a') && (h <= 'f')) {
			return ((h - 'a') + 10);
		}
		if ((h >= 'A') && (h <= 'F')) {
			return ((h - 'A') + 10);
		}
		return -1;
	}

	public string LoadStr (string key)
	{
		if (string.IsNullOrEmpty (key)) {
			return string.Empty;
		}
		if (m_Strings != null && m_Strings.Contains (key)) {
			return m_Strings [key].ToString ();
		}
		return key;
	}

	public bool Contains (string key)
	{
		return (m_Strings != null && m_Strings.Contains (key) && m_Strings [key] != null);
	}
	/// <summary>
	/// Gets or sets the <see cref="Strings"/> at the specified index.
	/// </summary>
	/// <param name='index'>
	/// Index.
	/// </param>
	public string this [string index] {
		get {
			return LoadStr (index);
		}
	}
}
