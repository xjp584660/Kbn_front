using System.Linq;

namespace JasonReflection
{
	public class JasonConvertHelper
	{
		private delegate object priv_DelegateCastType(HashObject dat, bool isSearchAll, JasonDataAttribute dataAttr, object inObj);

		private System.Collections.Generic.Dictionary<System.Type, priv_DelegateCastType> m_dicTypeToCastType;
		public JasonConvertHelper()
		{
			m_dicTypeToCastType = new System.Collections.Generic.Dictionary<System.Type, priv_DelegateCastType>();
		}

		public JasonConvertHelper(JasonConvertHelper other)
			: this(other.m_dicTypeToCastType)
		{
		}

		private JasonConvertHelper(System.Collections.Generic.Dictionary<System.Type, priv_DelegateCastType> dic)
		{
			m_dicTypeToCastType = dic;
		}

		private delegate object priv_Construct();
		private class MemberInfo
		{
			public string name;
			public bool isSearchAll;
			public priv_DelegateCastType getValFromHashObj;
			public JasonDataAttribute dataAttr;
		}

		private class PropertyInfo
			: MemberInfo
		{
			public delegate void dele_SetVal(object obj, object val, object[] index);
			public delegate object dele_GetVal(object obj, object[] index);
			public dele_SetVal setVal;
			public dele_GetVal getVal;
		}

		private class FieldInfo
			: MemberInfo
		{
			public delegate void dele_SetVal(object obj, object val);
			public delegate object dele_GetVal(object obj);

			public dele_SetVal setVal;
			public dele_GetVal getVal;
		}

		static public bool ParseToObjectOnce(object data, HashObject param)
		{
			JasonConvertHelper jc = new JasonConvertHelper();
			return jc.ParseToObject(data, param);
		}

		private PropertyInfo priv_getPropertyInfoFromProp(System.Reflection.PropertyInfo propertyInfo, bool isSearchAll)
		{
			var prop = new PropertyInfo();

			var attributeInfo = System.Attribute.GetCustomAttribute(propertyInfo, typeof(JasonDataAttribute)) as JasonDataAttribute;
			if ( attributeInfo != null && attributeInfo.Key != null )
				prop.name = attributeInfo.Key;
			else
				prop.name = propertyInfo.Name;

			prop.getValFromHashObj = priv_GetCastDelegateFromType(propertyInfo.PropertyType);
			prop.setVal = propertyInfo.SetValue;
			prop.getVal = propertyInfo.GetValue;
			prop.isSearchAll = priv_getIsSearchAll(attributeInfo, isSearchAll);
			prop.dataAttr = attributeInfo;
			return prop;
		}

		private FieldInfo priv_getFieldInfoFromField(System.Reflection.FieldInfo fieldInfo, bool isSearchAll)
		{
			var field = new FieldInfo();

			var attributeInfo = System.Attribute.GetCustomAttribute(fieldInfo, typeof(JasonDataAttribute)) as JasonDataAttribute;
			if ( attributeInfo != null && attributeInfo.Key != null )
				field.name = attributeInfo.Key;
			else
				field.name = fieldInfo.Name;

			field.getValFromHashObj = priv_GetCastDelegateFromType(fieldInfo.FieldType);
			field.setVal = fieldInfo.SetValue;
			field.getVal = fieldInfo.GetValue;
			field.isSearchAll = priv_getIsSearchAll(attributeInfo, isSearchAll);
			field.dataAttr = attributeInfo;
			return field;
		}

		private static bool priv_getIsSearchAll(JasonDataAttribute attributeInfo, bool isSearchAll)
		{
			if ( attributeInfo == null )
				return isSearchAll;

			switch ( attributeInfo.SearchInfo )
			{
			case JasonDataAttribute.SearchType.All:
				return true;
			case JasonDataAttribute.SearchType.Stop:
				return false;
			default:
				return isSearchAll;
			}
		}

		public bool ParseToObject(object data, HashObject param)
		{
			return priv_parseToObject(data, param, false);
		}
	
		private bool priv_parseToObject(object data, HashObject param, bool isSearchAll)
		{
			var typeInfo = data.GetType();
			var classJasonDataAttributeInfos = typeInfo.GetCustomAttributes(typeof(JasonDataAttribute), false);

			if ( classJasonDataAttributeInfos.Length != 0 )
			{
				var attributeInfo = classJasonDataAttributeInfos[0] as JasonDataAttribute;
				isSearchAll = priv_getIsSearchAll(attributeInfo, isSearchAll);
				if ( !string.IsNullOrEmpty(attributeInfo.Key) )
					return priv_fillObjectFieldOrProperty(data, param, attributeInfo.Key, isSearchAll, attributeInfo);
			}

			if ( param.Value != null )
			{
				return true;
			}

			var propertyInType = from propInfo in typeInfo.GetProperties()
				where ( propInfo.IsDefined(typeof(JasonDataAttribute), false)
				&& priv_GetCastDelegateFromType(propInfo.PropertyType) != null ) || isSearchAll
					select priv_getPropertyInfoFromProp(propInfo, isSearchAll);

			var fieldInType = from fieldInfo in typeInfo.GetFields()
				where ( fieldInfo.IsDefined(typeof(JasonDataAttribute), false)
				&& priv_GetCastDelegateFromType(fieldInfo.FieldType) != null ) || isSearchAll
					select priv_getFieldInfoFromField(fieldInfo, isSearchAll);

			foreach(string key in param.Table.Keys)
			{
				var val = propertyInType.FirstOrDefault((x)=>(x.name == key));
				if ( val != null )
				{
					val.setVal(data, val.getValFromHashObj(param[key], val.isSearchAll, val.dataAttr, (val.dataAttr == null || val.dataAttr.CreateNew)?null:val.getVal(data, null)), null);
					continue;
				}

				var fieldVal = fieldInType.FirstOrDefault((x)=>(x.name == key));
				if ( fieldVal != null )
				{
					fieldVal.setVal(data, fieldVal.getValFromHashObj(param[key], fieldVal.isSearchAll, fieldVal.dataAttr, (fieldVal.dataAttr == null || fieldVal.dataAttr.CreateNew)?null:fieldVal.getVal(data)));
					continue;
				}
			}

			return true;
		}

		private bool priv_fillObjectFieldOrProperty(object obj, HashObject param, string keyName, bool isSearchAll, JasonDataAttribute dataAttr)
		{
			//	find property or key name
			var objType = obj.GetType();
			var prop = objType.GetProperty(keyName);
			if ( prop != null )
			{
				prop.SetValue(obj, priv_createObjectFrom(prop.PropertyType, param, isSearchAll, dataAttr), null);
				return true;
			}

			var field = objType.GetField(keyName);
			if ( field != null )
			{
				field.SetValue(obj, priv_createObjectFrom(field.FieldType, param, isSearchAll, dataAttr));
				return true;
			}

			return true;
		}

		private object priv_createObjectFrom(System.Type objType, HashObject param, bool isSearchAll, JasonDataAttribute dataAttr)
		{
			var castType = priv_GetCastDelegateFromType(objType);
			return castType(param, isSearchAll, dataAttr, null);
		}

		static private object priv_ReadBool(HashObject dat, bool isSearchAll, JasonDataAttribute dataAttr, object inObj)
		{
			return System.Convert.ToBoolean(dat.Value);
		}

		static private object priv_ReadInt(HashObject dat, bool isSearchAll, JasonDataAttribute dataAttr, object inObj)
		{
			try
			{
				return System.Convert.ToInt32(dat.Value);
			}
			catch(System.Exception)
			{
				return 0;
			}
		}

		static private object priv_ReadUInt(HashObject dat, bool isSearchAll, JasonDataAttribute dataAttr, object inObj)
		{
			return System.Convert.ToUInt32(dat.Value);
		}

		static private object priv_ReadLong(HashObject dat, bool isSearchAll, JasonDataAttribute dataAttr, object inObj)
		{
			return System.Convert.ToInt64(dat.Value);
		}

		static private object priv_GetString(HashObject dat, bool isSearchAll, JasonDataAttribute dataAttr, object inObj)
		{
			return dat.Value.ToString();
		}

		static private object priv_GetFloat(HashObject dat, bool isSearchAll, JasonDataAttribute dataAttr, object inObj)
		{
			return System.Convert.ToSingle(dat.Value);
		}

		static private object priv_GetHashobject(HashObject dat, bool isSearchAll, JasonDataAttribute dataAttr, object inObj)
		{	//	TODO : Need Clone the dat.
			return dat;
		}

		private priv_DelegateCastType priv_GetCastDelegateFromType(System.Type inType)
		{
			if ( this.m_dicTypeToCastType.ContainsKey(inType) )
				return this.m_dicTypeToCastType[inType];
			var newObj = priv_GetCastDelegateFromTypeNew(inType);
			if ( newObj != null )
				this.m_dicTypeToCastType.Add(inType, newObj);
			return newObj;
		}

		private priv_DelegateCastType priv_GetCastDelegateFromTypeNew(System.Type inType)
		{
			if ( inType.IsValueType )
			{
				if ( inType == typeof(int) )
					return priv_ReadInt;
				if ( inType == typeof(float) )
					return priv_GetFloat;
				if ( inType == typeof(bool) )
					return priv_ReadBool;
				if ( inType == typeof(long) )
					return priv_ReadLong;
				if ( inType == typeof(uint) )
					return priv_ReadUInt;
			}

			if ( inType == typeof(string) )
				return priv_GetString;
			
			if ( inType == typeof(HashObject) )
				return priv_GetHashobject;

			if ( inType.IsArray )
				return priv_GetArrayBuilder(inType);

			if ( inType == typeof(System.Collections.Hashtable) )
				return priv_GetHashtable(inType);

			//	Directory
			if ( inType.IsGenericType && inType.GetGenericTypeDefinition() == typeof(System.Collections.Generic.Dictionary<,>) )
				return priv_GetDirectory(inType);

			return (x, isSearchAll, dataAttr, inObj) =>
			{
				object obj = inObj??System.Activator.CreateInstance(inType);
				priv_parseToObject(obj, x, isSearchAll);
				return obj;
			};
		}

		private priv_DelegateCastType priv_GetHashtable(System.Type inType)
		{
			return (x, isSearchAll, dataAttr, inObj) =>
			{
				priv_DelegateCastType getKey = priv_GetCastDelegateFromType(dataAttr.MapKey);
				priv_DelegateCastType getVal = priv_GetCastDelegateFromType(dataAttr.MapValue);

				if ( getKey == null || getVal == null )
					throw new System.InvalidCastException();
				System.Collections.Hashtable obj = (inObj??System.Activator.CreateInstance(inType)) as System.Collections.Hashtable;

				foreach(string key in x.Table.Keys)
				{
					object vKey = getKey(new HashObject(key), isSearchAll, dataAttr, null);
					object vDat = getVal(x[key], isSearchAll, dataAttr, obj.ContainsKey(vKey)?obj[vKey]:null);
					obj[vKey] = vDat;
				}

				return obj;
			};
		}

		private priv_DelegateCastType priv_GetDirectory(System.Type inType)
		{
			System.Type[] argType = inType.GetGenericArguments();
			System.Type keyType = argType[0];
			System.Type valType = argType[1];

			if ( keyType == null || valType == null )
				throw new System.InvalidCastException();

			var addMethod = inType.GetMethod("Add", argType);
			if ( addMethod == null )
				throw new System.InvalidCastException();

			var containsKey = inType.GetMethod("ContainsKey", new System.Type[] { keyType });
			var	idxProp = inType.GetProperties().First(pi=>(pi.GetIndexParameters().Length == 1 && pi.GetIndexParameters()[0].ParameterType == keyType));

			priv_DelegateCastType getKey = priv_GetCastDelegateFromType(keyType);
			priv_DelegateCastType getVal = priv_GetCastDelegateFromType(valType);

			if ( getKey == null || getVal == null )
				throw new System.InvalidCastException();

			return (x, isSearchAll, dataAttr, inObj) =>
			{
				var obj = inObj??System.Activator.CreateInstance(inType);
				foreach(string key in x.Table.Keys)
				{
					object vKey = getKey(new HashObject(key), isSearchAll, dataAttr, null);
					var idxKey = new object[]{vKey};
					object vDat = null;
					if ( (bool)containsKey.Invoke(obj, idxKey) )
						vDat = getVal(x[key], isSearchAll, dataAttr, idxProp.GetValue(obj, idxKey));
					else
						vDat = getVal(x[key], isSearchAll, dataAttr, null);
					idxProp.SetValue(obj, vDat, idxKey);
				}

				return obj;
			};
		}

		private priv_DelegateCastType priv_GetArrayBuilder(System.Type inType)
		{
			var elmType = inType.GetElementType();
			var delegateCastType = priv_GetCastDelegateFromType(elmType);
			if ( delegateCastType == null )
				return null;
			return (x, isSearchAll, dataAttr, inObj) => 
			{
				int maxIndex = -1;
				foreach ( string key in x.Table.Keys )
				{
					if ( key[0] != 'a' )
						throw new System.ArgumentException("invalid type cast");

					maxIndex = System.Math.Max(maxIndex, System.Convert.ToInt32(key.Substring(1)));
				}
				var arr = inObj as System.Array??System.Array.CreateInstance(elmType, maxIndex + 1);
				foreach ( string key in x.Table.Keys )
				{
					var index = System.Convert.ToInt32(key.Substring(1));
					arr.SetValue(delegateCastType(x[key], isSearchAll, dataAttr, arr.GetValue(index)), index);
				}
				return arr;
			};
		}
	}
}


