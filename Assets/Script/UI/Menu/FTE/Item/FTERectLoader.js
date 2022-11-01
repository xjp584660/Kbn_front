#pragma strict

public class FTERectLoader
{
	@JasonReflection.JasonDataAttribute
	class rectInfo
	{
		public var x : float;
		public var y : float;
		public var width : float;
		public var height : float;

		public var refMenuItem : RefMenu;
		public var refGameItem : RefGameObj;
		public var track : boolean;
	}
	
	//class DockRectType
	//{
		//@JasonReflection.JasonDataAttribute
	//}

	@JasonReflection.JasonDataAttribute
	class RefMenu //extends DockRectType
	{
		public var isPhyPos : boolean;
		public var menuName : String;
		public var uiName : String;
		public var dockType : uint;//	0. fill, 1: top, 2: right, 3: bottom 4: left.
	}

	@JasonReflection.JasonDataAttribute
	class RefGameObj // extends DockRectType
	{
		public var objNodeName : String;
		public var dockType : uint;//	0. fill, 1: top, 2: right, 3: bottom 4: left.
	}

	private static var gm_jasonHelper : JasonReflection.JasonConvertHelper = new JasonReflection.JasonConvertHelper();
	public static function GetRectInfo(hashObj : HashObject) : Array
	{
		var rInfo : rectInfo = new rectInfo();
		gm_jasonHelper.ParseToObject(rInfo, hashObj);
		if ( rInfo.track )
		{
			return [null, function() : Rect
			{
				return priv_genRectFromRectInfo(rInfo);
			}];
		}
		else
		{
			var rtRect : Rect = priv_genRectFromRectInfo(rInfo);
			return [rtRect, null];
		}

	}

	private static function priv_genRectFromRectInfo(rInfo : rectInfo) : Rect
	{
		var rtRect : Rect;
		var dockType : uint = 0;
		do
		{
			var rtRectInfo : Array = this.priv_getRectFromMenu(rInfo);
			if ( rtRectInfo[0] == true )
			{
				rtRect = rtRectInfo[1];
				dockType = rInfo.refMenuItem.dockType;
				break;
			}
			rtRectInfo = this.priv_getRectFromGameObj(rInfo);
			if ( rtRectInfo[0] == true )
			{
				rtRect = rtRectInfo[1];
				dockType = rInfo.refGameItem.dockType;
				break;
			}
			
			rtRect = new Rect(rInfo.x, rInfo.y, rInfo.width, rInfo.height);
			break;
		}while(0);

		switch ( dockType )
		{
		//case 0:
		//	break;
		case 1:	//	Top
			rtRect.y = rtRect.y - rInfo.height;
			rtRect.x -= (rInfo.width - rtRect.width)*0.5;
			break;
		case 2:	//	Right
			rtRect.x = rtRect.x + rtRect.width;
			rtRect.y -= (rInfo.height - rtRect.height)*0.5;
			break;
		case 3:	//	Bottom
			rtRect.y = rtRect.y + rtRect.height;
			rtRect.x -= (rInfo.width - rtRect.width)*0.5;
			break;
		case 4:	//	Left
			rtRect.x = rtRect.x - rInfo.width;
			rtRect.y -= (rInfo.height - rtRect.height)*0.5;
			break;
		}
		if ( dockType != 0 )
		{
			rtRect.height = rInfo.height;
			rtRect.width = rInfo.width;
		}
		return rtRect;
	}

	private static var gm_transValueVec : Vector3[] =
		[ new Vector3(1.0f, 1.0f, 1.0f), new Vector3(1.0f, 1.0f, -1.0f), new Vector3(1.0f, -1.0f, 1.0f), new Vector3(1.0f, -1.0f, -1.0f)
		, new Vector3(-1.0f, 1.0f, 1.0f), new Vector3(-1.0f, 1.0f, -1.0f), new Vector3(-1.0f, -1.0f, 1.0f), new Vector3(-1.0f, -1.0f, -1.0f)
		];
	private static function priv_getRectFromGameObj(rInfo : rectInfo) : Array
	{
		if ( rInfo.refGameItem == null )
			return [false, null];
		var gameObj : GameObject = GameObject.Find(rInfo.refGameItem.objNodeName);
		if ( gameObj == null )
			return [false, null];

		var gameMain : GameMain = GameMain.instance();
		if ( gameObj.GetComponent.<Renderer>() == null )
			return [false, null];
		var camera : Camera = gameMain.CurrentCamera;
		if ( camera == null )
			return [false, null];
		var bounds : Bounds = gameObj.GetComponent.<Renderer>().bounds;
		var center : Vector3 = bounds.center;
		var posMin : Vector3 = camera.WorldToScreenPoint(center);
		var posMax : Vector3 = new Vector3(posMin.x, posMin.y, posMin.z);
		for ( var idx : int = 0; idx != 8; ++idx )
		{
			var pos : Vector3 = center + Vector3.Scale(bounds.extents, gm_transValueVec[idx]);
			var tmpPos : Vector3 = camera.WorldToScreenPoint(pos);
			posMin.x = System.Math.Min(posMin.x, tmpPos.x);
			posMin.y = System.Math.Min(posMin.y, tmpPos.y);
			posMax.x = System.Math.Max(posMax.x, tmpPos.x);
			posMax.y = System.Math.Max(posMax.y, tmpPos.y);
		}
		
		var boundRect : Rect = new Rect(posMin.x, Screen.height - posMax.y, posMax.x - posMin.x, posMax.y - posMin.y);
		//	Phy Pos -> 640x960 Pos
		return [true, priv_getRectFromPhyToLogic(boundRect)];
	}

	private static function priv_getRectFromMenu(rInfo : rectInfo) : Array
	{
		if ( rInfo.refMenuItem == null )
			return [false, null];
		var menuMgr : MenuMgr = MenuMgr.getInstance();
		var menu : KBNMenu = menuMgr.getMenu(rInfo.refMenuItem.menuName);
		if ( menu == null )
			return [false, null];

		var tp : System.Type = menu.GetType();
		var uiObj : System.Object = menu;

		var uiNameArray : String[] = rInfo.refMenuItem.uiName.Split("."[0]);
		for ( var uiName : String in uiNameArray )
		{
			if ( uiName.IndexOf("("[0]) >= 0 )
			{
				uiObj = priv_invokeFunction(uiObj, uiName);
			}
			else if ( uiName.IndexOf("["[0]) >= 0 )
			{
				uiObj = null;
			}
			else
			{
				do
				{
					var uiField : System.Reflection.FieldInfo = tp.GetField(uiName);
					if ( uiField != null )
					{
						uiObj = uiField.GetValue(uiObj);
						break;
					}
					
					var uiProp : System.Reflection.PropertyInfo = tp.GetProperty(uiName);
					if ( uiProp != null )
					{
						uiObj = uiProp.GetValue(uiObj, null);
						break;
					}
					
					uiObj = null;
				}while(0);
			}

			if ( uiObj == null )
				return [false, null];
			tp = uiObj.GetType();
		}

		var uiType : System.Type = uiObj.GetType();
		if ( rInfo.track )
		{
			var markForTrack : System.Reflection.MethodInfo = uiType.GetMethod("MakeNeedScreenRectOnce");
			if ( markForTrack != null )
			{
				markForTrack.Invoke(uiObj, null);
			}
		}

		var rtRect : Rect;
		try
		{
			if ( rInfo.track )
			{
				var propField : System.Reflection.PropertyInfo = uiType.GetProperty("ScreenRect");
				if ( propField == null )
					return [false, null];
				var propRect : Rect = propField.GetValue(uiObj, null);
				if ( propRect == null )
					return [false, null];
				rtRect = new Rect(propRect);
			}
			else
			{
				var rectField : System.Reflection.FieldInfo = uiType.GetField("rect");
				if ( rectField == null )
					return [false, null];
				var rect : Rect = rectField.GetValue(uiObj);
				if ( rect == null )
					return [false, null];
				rtRect = new Rect(rect);
			}
		}
		catch(e : System.InvalidCastException)
		{
			return [false, null];
		}

		if ( rInfo.refMenuItem.isPhyPos )
			rtRect = priv_getRectFromPhyToLogic(rtRect);

		return [true, rtRect];
	}

	private static function priv_getRectFromPhyToLogic(rect : Rect) : Rect
	{
		var rtRect : Rect = new Rect(rect);
		rtRect.x /= GameMain.horizRatio;
		rtRect.width /= GameMain.horizRatio;
		rtRect.y /= GameMain.vertRatio;
		rtRect.height /= GameMain.vertRatio;
		return rtRect;
	}

	private static function priv_invokeFunction(uiObj : Object, func : String) : Object
	{
		var oldString : String = func;
		var paramStart : int = func.IndexOf("("[0]);
		var funName : String = func.Substring(0, paramStart);
		var paramEnd = func.IndexOf(")"[0]);
		if ( paramEnd <= paramStart )
			return null;
		func = func.Substring(paramStart+1, paramEnd - paramStart - 1);
		var param : String[] = func.Split(","[0]);
		//var paramObj : Array = new Array(param.Length);
		var paramObj : Object[] = new Object[param.Length];
		var uiType : System.Type = uiObj.GetType();
		for ( var method : System.Reflection.MethodInfo in uiType.GetMethods() )
		{
			var methodTmp : System.Reflection.MethodInfo = method;
			if ( method.Name != funName )
				continue;
			var paramInfo : System.Reflection.ParameterInfo[] = method.GetParameters();
			if ( paramInfo == null || paramInfo.Length != param.Length )
				continue;

			try
			{
				for ( var idx : int = 0; idx != paramInfo.Length; ++idx )
				{
					paramObj[idx] = System.Convert.ChangeType(param[idx], paramInfo[idx].ParameterType);
				}
				return method.Invoke(method.IsStatic?null:uiObj, paramObj);
			}
			catch(e)
			{
				continue;
			}
		}

		return null;
	}
}
