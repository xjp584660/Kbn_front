public class HashObject : System.Object
{
	private static System.Collections.Generic.Dictionary<char, string> gm_castCharacter
		= new System.Collections.Generic.Dictionary<char, string>
	{
		{'\\', @"\\"},
		{'\n', @"\n"},
		{'\r', @"\r"}
	};

	private System.Collections.Hashtable m_HashTable = null;
	private System.Object m_MainValue = null;

	public HashObject()
	{
		// Marked by Ellan: do not new Hashtable here, create instance when first use.
		//m_HashTable = new Hashtable();
	}

	public HashObject(System.Object obj)
		: this()
	{
		if (obj is System.Collections.Hashtable)
		{
			CreateHash((System.Collections.Hashtable)obj);
		}
		else
		{
			if (obj is HashObject)
			{
			}
			else
			{
				Value = obj;
			}
		}
	}
	
	public override string ToString()
	{
		using (System.IO.MemoryStream ms = new System.IO.MemoryStream(65536))
		{
			using (System.IO.TextWriter sw = new System.IO.StreamWriter(ms))
			{
				this.priv_toStringOnStreamWrite(sw, "a", 0, null);
				sw.Flush();
				ms.Seek(0, System.IO.SeekOrigin.Begin);
				using (System.IO.StreamReader sr = new System.IO.StreamReader(ms))
				{
					return sr.ReadToEnd();
				}
			}
		}
	}

	public void Remove(string key)
	{
		m_HashTable.Remove(key);
	}

	public bool FormatToJson(System.IO.TextWriter sw, string arrayPrefix)
	{
		return priv_toStringOnStreamWrite(sw, arrayPrefix, 0, null);
	}

	private void CheckHashTable()
	{
		if (m_HashTable == null)
		{
			m_HashTable = new System.Collections.Hashtable();
		}
	}

	private void CreateHash(System.Collections.Hashtable hash)
	{
		foreach (System.Collections.DictionaryEntry i in hash)
		{
			CheckHashTable();
			if (i.Value is HashObject)
			{
				m_HashTable[i.Key] = i.Value;
			}
			else if (i.Value is System.Collections.Hashtable)
			{
				// CreateHash
				m_HashTable[i.Key] = new HashObject(i.Value);
			}
			else
			{
				m_HashTable[i.Key] = new HashObject();
				((HashObject)m_HashTable[i.Key]).Value = i.Value;
			}
		}
	}

	public void Add(string key, System.Object keyValue)
	{
		CheckHashTable();
		m_HashTable.Add(key, keyValue);
	}

	public bool Contains(string key)
	{
		CheckHashTable();
		return m_HashTable.Contains(key);
	}

	/// <summary>
	/// check this hash object is contain a array.
	/// </summary>
	/// <returns>zero for not an array, or return the array's count.</returns>
	private int priv_checkIsArray(string arrayPrefix)
	{
		if (this.m_MainValue != null)
		{
			return 0;
		}

		if (this.m_HashTable == null || this.m_HashTable.Count == 0)
		{
			return 0;
		}

		for (int i = 0; i != m_HashTable.Count; ++i)
		{
			if (!m_HashTable.ContainsKey(arrayPrefix + i.ToString()))
			{
				return 0;
			}
		}

		return m_HashTable.Count;
	}

	/// <summary>
	/// the help proc for format this class to string
	/// </summary>
	/// <returns>
	/// return false if write ok, other while return true.
	/// </returns>
	/// <param name="sb">
	/// output buffer here, cann't assign to null.
	/// </param>
	/// <param name="deepth">
	/// the deepth of the recuresive call.
	/// </param>
	/// <param name="name">
	/// the node key name.
	/// </param>
	private bool priv_toStringOnStreamWrite(System.IO.TextWriter sw, string arrayPrefix, int deepth, string name)
	{
		if (m_MainValue != null)
		{	//	out put the key:value format.
			if (string.IsNullOrEmpty(name))
			{
				return false;
			}

			if (m_HashTable != null && m_HashTable.Count != 0)
			{
				return false;
			}

			string mv = null;
			if (m_MainValue.GetType().IsValueType)
			{
				mv = m_MainValue.ToString();
			}
			else
			{
				mv = '"' + priv_castString(m_MainValue.ToString()) + '"';
			}

			sw.Write(mv);
			return true;
		}

		if (m_HashTable == null || m_HashTable.Count == 0)
		{
			return true;
		}

		//	now, let's put the children node.
		System.Text.StringBuilder sb = new System.Text.StringBuilder(1024);
		int arrCnt = priv_checkIsArray(arrayPrefix);
		if (arrCnt != 0)
		{	//	array node here.
			sb.Append('\t', deepth);
			sb.Append("[\n");	//	if name is null(the node is root), maybe you should add with "{["
			for (int i = 0; i != arrCnt; ++i)
			{
				string key = arrayPrefix + i.ToString();
				HashObject obj = m_HashTable[key] as HashObject;
				if (obj == null)
				{
					return false;
				}

                sb.Append('\t', deepth + 1);
				sw.Write(sb);
				sb = new System.Text.StringBuilder();

				if (!obj.priv_toStringOnStreamWrite(sw, arrayPrefix, deepth + 1, key))
				{
					return false;
				}

				sb.Append(",\n");
			}

			sb.Remove(sb.Length - 2, 1);
			sb.Append('\t', deepth);
			sb.Append("]");	//	if name is null(the node is root), maybe you should add with "]}"
		}
		else
		{	//	struct node here.
			sb.Append('\t', deepth);
			sb.Append("{\n");
			foreach (string key in m_HashTable.Keys)
			{
				HashObject obj = m_HashTable[key] as HashObject;
				if (obj == null)
				{
					continue;
				}

				if (obj.m_MainValue == null && (obj.m_HashTable == null || obj.m_HashTable.Count == 0))
				{
					continue;
				}

				sb.Append('\t', deepth + 1);
				sb.AppendFormat("\"{0}\":", key);
				if (obj.m_MainValue == null)
				{
					sb.Append('\n');
				}

				sw.Write(sb);
				sb = new System.Text.StringBuilder();
				if (!obj.priv_toStringOnStreamWrite(sw, arrayPrefix, deepth + 1, key))
				{
					return false;
				}

				sb.Append(",\n");
			}

			sb.Remove(sb.Length - 2, 1);
			sb.Append('\t', deepth);
			sb.Append("}");
		}

		sw.Write(sb.ToString());
		return true;
	}

	/// <summary>
	/// pre operator the string for print
	/// </summary>
	/// <param name="inStr">the input source string</param>
	/// <returns>the output source string</returns>
	private string priv_castString(string inStr)
	{
		int n = -1;
		System.Text.StringBuilder sb = null;
		foreach (char v in inStr)
		{
			++n;
			if (sb == null)
			{
				if (!gm_castCharacter.ContainsKey(v))
				{
					continue;
				}

				sb = new System.Text.StringBuilder(inStr.Length * 2);
				sb.Append(inStr.Substring(0, n));
			}

			if (gm_castCharacter.ContainsKey(v))
			{
				sb.Append(gm_castCharacter[v]);
			}
			else
			{
				sb.Append(v);
			}
		}

		return sb != null ? sb.ToString() : inStr;
	}

	public HashObject this[string key]
	{
		get
		{
			CheckHashTable();
			return m_HashTable[key] as HashObject;
		}

		set
		{
			CheckHashTable();
			m_HashTable[key] = value;
		}
	}

	public System.Collections.IEnumerable Keys
	{
		get
		{
			if (m_HashTable == null)
			{
				yield break;
			}

			foreach (var item in m_HashTable.Keys)
			{
				yield return item;
			}
		}
	}

	public System.Object Value
	{
		get
		{
			return m_MainValue;
		}

		set
		{
			m_MainValue = value;
		}
	}

	public System.Collections.Hashtable Table
	{
		get
		{
			CheckHashTable();
			return m_HashTable;
		}

		set
		{
			m_HashTable = value;
		}
	}
}
