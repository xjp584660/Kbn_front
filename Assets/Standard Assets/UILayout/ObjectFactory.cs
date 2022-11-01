
namespace UILayout
{
	class FrameLayoutInfo
	{
		public delegate object HandleGetValue(object obj);
		public delegate void HandleSetValue(object obj, object val);
		public class AccessMethod
		{
			public HandleGetValue GetValue { get; set; }
			public HandleSetValue SetValue { get; set; }
		}

		public string Name { get; set; }
		public System.Type ObjType { get; set; }
		public System.Reflection.ConstructorInfo defConstruct { get; set; }
		public HandleGetValue AccessGetValueHandle(string name)
		{
			var access = priv_getAccessValue(name);
			if (access == null || access.GetValue == null)
				throw new System.InvalidOperationException("Cann't Read Value: " + Name + "." + name);
			return access.GetValue;
		}
		public HandleSetValue AccessSetValueHandle(string name)
		{
			var access = priv_getAccessValue(name);
			if (access == null || access.SetValue == null)
				throw new System.InvalidOperationException("Cann't Write Value: " + Name + "." + name);
			return access.SetValue;
		}

		private AccessMethod priv_getAccessValue(string name)
		{
			if (m_handleAccessMethod != null && m_handleAccessMethod.ContainsKey(name))
				return m_handleAccessMethod[name];

			HandleGetValue hgv = null;
			HandleSetValue hsv = null;

			do
			{

				var field = ObjType.GetField(name);
				if (field != null)
				{
					hsv = (x, v)=>
					{
						var val = ObjectFactory.CastObject(field.FieldType, v, x);
						field.SetValue(x, val);
						return;
					};

					hgv = field.GetValue;
					break;
				}

				var prop = ObjType.GetProperty(name);

				if (prop != null)
				{
					if (prop.CanRead)
						hgv = (x) => { return prop.GetValue(x, null); };
					if (prop.CanWrite)
					{
						hsv = (x, v) =>
						{
							var val = ObjectFactory.CastObject(prop.PropertyType, v, x);
							prop.SetValue(x, val, null);
							return;
						};
					}
					else if (prop.CanRead && prop.PropertyType.IsSubclassOf(typeof(_ModifyPropertyBase)) )
					{
						hsv = (x, v) =>
						{
							var mprop = hgv(x) as _ModifyPropertyBase;
							this.priv_setModifProperty(mprop, null, v as string);
							return;
						};
					}
					break;
				}

				if (ObjType.IsSubclassOf(typeof(ModifyPropertysContains)))
				{
					hsv = (x, v) =>
					{
						var mdfPropContain = x as ModifyPropertysContains;
						var mdfProp = mdfPropContain.GetProperty(name);
						this.priv_setModifProperty(mdfProp, mdfPropContain, v as string);
					};

					hgv = (x) =>
					{
						var mdfPropContain = x as ModifyPropertysContains;
						var mdfProp = mdfPropContain.GetProperty(name);
						return mdfProp.GetValue();
					};

					break;
				}

				return null;
			} while (false);

			return priv_setAccessValue(name, hgv, hsv);
		}

		private AccessMethod priv_setAccessValue(string name, HandleGetValue hgv, HandleSetValue hsv)
		{
			if (m_handleAccessMethod == null)
				m_handleAccessMethod = new System.Collections.Generic.Dictionary<string, AccessMethod>();
			if (!m_handleAccessMethod.ContainsKey(name))
			{
				var accessMethod = new AccessMethod() { GetValue = hgv, SetValue = hsv};
				m_handleAccessMethod.Add(name, accessMethod);
				return accessMethod;
			}

			var accessRef = m_handleAccessMethod[name];
			accessRef.GetValue = hgv;
			accessRef.SetValue = hsv;
			return accessRef;
		}
		private System.Collections.Generic.Dictionary<string, AccessMethod> m_handleAccessMethod;
		private void priv_setModifProperty(_ModifyPropertyBase prop, ModifyPropertysContains contain, string strValue)
		{
			_GenSourcePropertyAttributeCollection.FillSrcProperty(prop, contain, strValue);
		}
	}

	static public class ObjectFactory
	{
		private static System.Collections.Generic.HashSet<System.Reflection.Assembly> m_asmbs = new System.Collections.Generic.HashSet<System.Reflection.Assembly>();
		private static System.Collections.Generic.Dictionary<string, FrameLayoutInfo> m_frameLayouts = new System.Collections.Generic.Dictionary<string, FrameLayoutInfo>();
		private static System.Collections.Generic.Dictionary<System.Type, FrameLayoutInfo> m_dicTypeFrameLayouts = new System.Collections.Generic.Dictionary<System.Type, FrameLayoutInfo>();
		//private static System.Collections.Generic.Dictionary<CastObjectPair, System.Reflection.MethodInfo> m_dicCastObject = new System.Collections.Generic.Dictionary<CastObjectPair, System.Reflection.MethodInfo>();
		private static System.Collections.Generic.Dictionary<CastObjectPair, MethodInfos> m_dicCastObject = new System.Collections.Generic.Dictionary<CastObjectPair, MethodInfos>();
		private static System.Type[] gm_nullParams = new System.Type[] { };
		class MethodInfos
		{			
			public delegate bool CastFunc(object src, object inPnt, ref object ioDst);
			public class CastMethodInfo
			{
				//public CastMethodInfo(int inOrder, System.Reflection.MethodInfo inMethodInfo)
				public CastMethodInfo(int inOrder, CastFunc inMethodInfo)
				{
					order = inOrder;
					methodInfo = inMethodInfo;
				}
				public readonly int order;	//	from large to less
				public readonly CastFunc methodInfo;
				//public readonly System.Reflection.MethodInfo methodInfo;
			}

			public System.Collections.Generic.List<CastMethodInfo> methodInfos = new System.Collections.Generic.List<CastMethodInfo>();
		}

		class CastObjectPair
		{
			private readonly System.Type m_dstType;
			private readonly System.Type m_srcType;

			public System.Type DstType { get { return m_dstType; } }
			public System.Type SrcType { get { return m_srcType; } }
			public CastObjectPair(System.Type dst, System.Type src)
			{
				m_dstType = dst;
				m_srcType = src;
			}

			public override int GetHashCode()
			{
				return m_dstType.GetHashCode() + m_srcType.GetHashCode();
			}

			public override string ToString()
			{
				return m_srcType.Name + " -> " + m_dstType.Name;
			}

			public override bool Equals(object obj)
			{
				CastObjectPair other = obj as CastObjectPair;
				if (other == null)
					return false;
				return other.m_dstType == this.m_dstType && other.m_srcType == this.m_srcType;
			}
		}

		static ObjectFactory()
		{
			foreach (var assmble in System.AppDomain.CurrentDomain.GetAssemblies())
			{
				AddAssemble(assmble);
			}

			System.AppDomain.CurrentDomain.AssemblyLoad += (sender, asmb) =>
				{
					AddAssemble(asmb.LoadedAssembly);
				};
		}

		public static void AddAssemble(System.Reflection.Assembly asmb)
		{
			if (m_asmbs.Contains(asmb))
				return;
			m_asmbs.Add(asmb);
			var types = asmb.GetTypes();
			foreach (var tp in types)
			{
				var attrs = tp.GetCustomAttributes(typeof(UILayout.UIFrameLayoutAttribute), false);
				if (attrs.Length != 0)
					priv_addInfoFromType(tp, attrs[0] as UIFrameLayoutAttribute);
				attrs = tp.GetCustomAttributes(typeof(UILayout.HaveValueCastAttribute), false);
				if (attrs.Length != 0)
					priv_addCastInfoFromType(tp);
			}
		}
		private static MethodInfos.CastFunc priv_castToFunc(System.Reflection.MethodInfo method, int parsCnt)
		{
			switch ( parsCnt )
			{
			case 1:
				return delegate(object s, object h, ref object o)
				{
					object r = method.Invoke(null, new object[]{s});
					if ( r == null )
						return false;
					o = r;
					return true;
				};
			case 2:
				return delegate(object s, object h, ref object o)
				{
					object r = method.Invoke(null, new object[]{s, h});
					if ( r == null )
						return false;
					o = r;
					return true;
				};
			case 3:
				return delegate(object s, object h, ref object o)
				{
					var objs = new object[]{s, h, o};
					if ( !(bool)method.Invoke(null, objs) )
						return false;
					o = objs[2];
					return true;
				};
			default:
				return null;
			}
		}

		private static void priv_addCastInfoFromType(System.Type tp)
		{
			foreach (var method in tp.GetMethods())
			{
				if (!method.IsStatic)
					continue;
				var attrInMethod = method.GetCustomAttributes(typeof(UILayout.ValueCastAttribute), false) as UILayout.ValueCastAttribute[];
				if (attrInMethod.Length == 0)
					continue;
				var paramsInfo = method.GetParameters();
				if (paramsInfo.Length > 3)
					continue;
				var retInfo = method.ReturnType;
				if ( retInfo == typeof(void) )
					continue;
				foreach (var methodAttr in attrInMethod)
				{
					System.Type dstType = methodAttr.DstType;
					if (dstType == null)
					{
						if ( paramsInfo.Length < 3 )
							dstType = retInfo;
						else
							dstType = paramsInfo[2].ParameterType.GetElementType();
					}

					System.Type srcType = methodAttr.SrcType;
					if (srcType == null)
						srcType = paramsInfo[0].ParameterType;

					var m = priv_castToFunc(method, paramsInfo.Length);
					if ( m == null )
						continue;
					var castObjPair = new CastObjectPair(dstType, srcType);
					if (!m_dicCastObject.ContainsKey(castObjPair))
					{	//	重复啦
						m_dicCastObject[castObjPair] = new MethodInfos();
					}

					MethodInfos.CastMethodInfo castMethodInfo = new MethodInfos.CastMethodInfo(methodAttr.Order, m);
					m_dicCastObject[castObjPair].methodInfos.Add(castMethodInfo);
				}
			}

			foreach ( var item in m_dicCastObject )
			{
				item.Value.methodInfos.Sort((l,r)=>
				{
					if ( l.order > r.order )
						return 1;
					if ( l.order < r.order )
						return -1;
					return string.Compare(l.methodInfo.ToString(), r.methodInfo.ToString());
				});
			}
		}



		static internal FrameLayoutInfo FindInfoFromType(System.Type tp)
		{
			var trueName = "@" + tp.Name;
			if ( m_frameLayouts.ContainsKey(trueName) )
				return m_frameLayouts[trueName];
			return priv_addInfoFromType(tp, null);
		}
		/// <summary>
		/// add this type in the search map
		/// </summary>
		/// <param name="tp">the type need to add</param>
		/// <param name="attr">the attribute belong the type.</param>
		private static FrameLayoutInfo priv_addInfoFromType(System.Type tp, UIFrameLayoutAttribute attr)
		{
			string typeName = "@" + tp.Name;
			if ( attr != null && attr.TypeName != null)
				typeName = attr.TypeName;
			if (m_frameLayouts.ContainsKey(typeName))
				throw new System.InvalidOperationException("Same TypeName: " + typeName.ToString());

			var cons = tp.GetConstructor(gm_nullParams);
			if (attr != null && cons == null)
				throw new System.InvalidOperationException("Type Must have public defConstruct: " + typeName.ToString());
			var fli = new FrameLayoutInfo();
			fli.Name = typeName;
			fli.ObjType = tp;
			fli.defConstruct = cons;
			m_frameLayouts.Add(fli.Name, fli);
			m_dicTypeFrameLayouts.Add(tp, fli);
			return fli;
		}

		public static object CreateObject(string name)
		{
			var frameTypeInfo = FindFrameLayoutInfo(name);
			return frameTypeInfo.defConstruct.Invoke(null);
		}

		internal static FrameLayoutInfo FindFrameLayoutInfo(string name)
		{
			if (!m_frameLayouts.ContainsKey(name))
				throw new System.NotImplementedException("Not found data type: " + name.ToString());
			return m_frameLayouts[name];
		}

		public static object CastObject(System.Type dstType, object val, object owner)
		{
			var castObjPair = new CastObjectPair(dstType, val.GetType());
			if (m_dicCastObject.ContainsKey(castObjPair))
			{
				foreach ( var item in m_dicCastObject[castObjPair].methodInfos )
				{
					try
					{
						object rt = null;
						if ( item.methodInfo(val, owner, ref rt) )
							return rt;
					}
					catch(System.Exception /*e*/)
					{
					}
				}
			}
			if ( dstType == val.GetType() )
				return val;
			System.Type valType = val.GetType();
			if ( val.GetType().IsSubclassOf(dstType) )
				return val;
			if ( dstType.IsInterface && valType.GetInterface(dstType.Name) != null )
				return val;
			throw new System.InvalidCastException("cann't cast type:" + val.ToString());
		}
	}
	
	[HaveValueCastAttribute]
	static class DefConver
	{
		[ValueCastAttribute(Order=-1)]
		static public System.UInt32 ConvertToUInt32(string val)
		{
			return System.Convert.ToUInt32(val);
		}
		[ValueCastAttribute(Order=-1)]
		static public System.Int32 ConvertToInt32(string val)
		{
			return System.Convert.ToInt32(val);
		}
		[ValueCastAttribute(Order=-1)]
		static public bool ConvertToBoolean(string val)
		{
			return System.Convert.ToBoolean(val);
		}
		[ValueCastAttribute(Order=-1)]
		static public float ConvertToFloat(string val)
		{
			return System.Convert.ToSingle(val);
		}
	}
}

