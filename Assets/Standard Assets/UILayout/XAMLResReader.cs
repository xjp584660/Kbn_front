
using System.Linq;

namespace UILayout
{
	class NewNodeObj
	{
		public object val;
		public System.Collections.Generic.Dictionary<string, string> dicParams;
	}

	public class XAMLResReader
	{
		public static object ReadFile(System.IO.Stream xmlStream, System.Collections.Generic.Dictionary<string, object> initProperty)
		{
			System.Xml.XmlReader xmlReader = System.Xml.XmlReader.Create(xmlStream);
			System.Xml.XmlDocument xmlDoc = new System.Xml.XmlDocument();
			xmlDoc.Load(xmlReader);

			if ( xmlDoc.ChildNodes.Count == 0 )
				return null;

			NewNodeObj topNodeObj = priv_ReadNode(null, null, xmlDoc.ChildNodes[0], null, initProperty);
			if ( topNodeObj == null )
				return null;
			return topNodeObj.val;
		}

		private static NewNodeObj priv_ReadNode(object pnt, string pntName, System.Xml.XmlNode nd, System.Xml.XmlNode pntNode, System.Collections.Generic.Dictionary<string, object> initProperty)
		{
			if (nd == null)
				return null;

			var fullName = nd.NamespaceURI + nd.Name;
			var obj = ObjectFactory.CreateObject(fullName);
			if ( initProperty != null && obj as ModifyPropertysContains != null )
			{
				ModifyPropertysContains propContain = obj as ModifyPropertysContains;
				foreach(var prp in initProperty)
				{
					propContain.SetValue(prp.Key, prp.Value);
				}
			}
			var frameInfo = ObjectFactory.FindFrameLayoutInfo(fullName);
			var paramKey = new System.Collections.Generic.Dictionary<string, string>();
			var valArray = new System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<FrameLayoutInfo.HandleSetValue, object>>();

			foreach (System.Xml.XmlAttribute attr in nd.Attributes)
			{
				var attrName = attr.Name;
				if (attrName.Contains('.'))
				{	//	params info
					var attrNameNode = attrName.Split('.');
					if (attrNameNode.Length != 2 || attrNameNode[0] != pntNode.Name)
						throw new System.ArgumentException("Invalid Argument format:" + attrName.ToString());
					paramKey.Add(attrNameNode[1], attr.Value);
					continue;
				}

				var setValue = frameInfo.AccessSetValueHandle(attrName);
				//setValue(obj, attr.Value);
				valArray.Add(new System.Collections.Generic.KeyValuePair<FrameLayoutInfo.HandleSetValue,object>(setValue, attr.Value));
			}
			if ( pnt != null )
				priv_putValToTarget(pnt, obj, paramKey);//paramKey);

			foreach(var dat in valArray)
			{
				dat.Key(obj, dat.Value);
			}
			foreach (System.Xml.XmlNode elm in nd.ChildNodes)
			{
				if ( (elm as System.Xml.XmlComment) != null )
					continue;
				if (elm.Name.Contains('.'))
				{
					priv_readToMemberValue(obj, nd.Name, elm);
					continue;
				}
				priv_ReadNode(obj, fullName, elm, nd, null);
				//priv_putValToTarget(obj, newObj.val, newObj.dicParams);//paramKey);
			}

			return new NewNodeObj(){val = obj, dicParams = paramKey};
		}

		private static void priv_readToMemberValue(object pnt, string localName, System.Xml.XmlNode nd)
		{
			var propInfos = nd.Name.Split('.');
			if (propInfos[0] != localName)
				throw new System.Exception("Invalid Type:" + localName);

			var objVal = pnt;
			var objType = objVal.GetType();
			for ( var i = 1; i != propInfos.Length; ++i )
			{
				var propName = propInfos[i];
				var p = objType.GetProperty(propName);
				if (p != null)
				{
					objVal = p.GetValue(objVal, null);
					objType = objVal.GetType();
					continue;
				}
				var f = objType.GetField(propName);
				if (f != null)
				{
					objVal = f.GetValue(objVal);
					objType = objVal.GetType();
					continue;
				}
			}
			FrameLayoutInfo frameInfo = null;
			foreach (System.Xml.XmlAttribute attr in nd.Attributes)
			{
				var attrName = attr.Name;
				frameInfo = ObjectFactory.FindInfoFromType(objType);
				if ( frameInfo == null )
				{
					throw new System.MissingMemberException("Found Depend property:" + attrName);
				}

				var setValue = frameInfo.AccessSetValueHandle(attrName);
				setValue(objVal, attr.Value);
			}

			foreach (System.Xml.XmlNode elm in nd.ChildNodes)
			{
				if ( (elm as System.Xml.XmlComment) != null )
					continue;
				priv_ReadNode(objVal, null, elm, nd, null);
				//priv_putValToTarget(objVal, newObj.val, newObj.dicParams);
			}
		}



		private static void priv_putValToTarget(object tgt, object val, System.Collections.Generic.Dictionary<string, string> paramList)
		{
			//tgt.GetType().InvokeMember("AddItem", System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.ExactBinding | System.Reflection.BindingFlags.InvokeMethod
			//    , new _MethodInvokeBinder(), tgt, new object[] { "AddItem", val, paramList });
			object[] args = null;
			var method = BindToMethodStatic(tgt.GetType().GetMethods(), "AddItem", val, paramList, out args);
			if (method == null)
				throw new System.MissingMethodException("Search Method: AddItem Lost");
			method.Invoke(tgt, args);
		}

		public static System.Reflection.MethodBase BindToMethodStatic(System.Reflection.MethodBase[] match, string methodName, object noNameArgument, System.Collections.Generic.Dictionary<string, string> parsDic, out object[] args)
		{
			args = null;
			var nameMatched = from m in match
							  where m.Name == methodName && (m.GetParameters().Length == parsDic.Count || m.GetParameters().Length == parsDic.Count + 1)
							  select m;

			//bool haveNonameParameters = parsDic.ContainsKey("");
			foreach (var m in nameMatched)
			{
				var pars = m.GetParameters();
				var tmpParams = new object[pars.Length];
				try
				{
					string nullNameParamKey = null;
					foreach (var p in pars)
					{
						if (!parsDic.ContainsKey(p.Name))
						{
							if (nullNameParamKey != null || pars.Length != parsDic.Count + 1)
							{
								tmpParams = null;
								break;
							}
							tmpParams[p.Position] = ObjectFactory.CastObject(p.ParameterType, noNameArgument, null);
							nullNameParamKey = p.Name;
							continue;
						}
						tmpParams[p.Position] = ObjectFactory.CastObject(p.ParameterType, parsDic[p.Name], null);
					}

					if ( tmpParams != null )
					{
						args = tmpParams;
						return m;
					}
				}
				catch (System.InvalidCastException /*e*/)
				{
					continue;
				}
			}

			return null;
			//throw new System.NotImplementedException();
		}

	}
}
