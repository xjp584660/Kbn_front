
namespace UILayout
{
	public class ModifyPropertysContains
	{
		private System.Collections.Generic.Dictionary<string, _ModifyPropertyBase> m_dicVal;
		private ModifyPropertysContains m_pnt;
		public void RegistProperty(string name, _ModifyPropertyBase prop)
		{
			if (m_dicVal == null)
				m_dicVal = new System.Collections.Generic.Dictionary<string, _ModifyPropertyBase>();
			m_dicVal.Add(name, prop);
		}

		public ModifyPropertysContains Parent { get { return m_pnt; } set { m_pnt = value; } }

		public void SetValue(string name, object val)
		{
			_ModifyPropertyBase modifyProperty = this.FindProperty(name);
			ISourceProperty srcProp = val as ISourceProperty;
			if (srcProp != null)
				modifyProperty.LinkSource(srcProp);
			else
				modifyProperty.SetValue(val);
		}

		public object GetValue(string name)
		{
			_ModifyPropertyBase modifyProperty = this.GetProperty(name);
			return modifyProperty.GetValue();
		}

		public _ModifyPropertyBase GetProperty(string name)
		{
			var prop = this.FindProperty(name);
			if ( prop == null )
				throw new System.MissingMemberException("Found Depend property: " + name + " Lost");
			return prop;
		}

		public _ModifyPropertyBase FindProperty(string name)
		{
			var modify = this;
			do
			{
				if (modify.m_dicVal != null && modify.m_dicVal.ContainsKey(name))
					break;
				modify = modify.m_pnt;
			} while (modify != null);
			if (modify == null)
				return null;
			return modify.m_dicVal[name];
		}
	}
}
