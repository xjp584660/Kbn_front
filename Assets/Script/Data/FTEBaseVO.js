
class FTEBaseVO
{
	public var rawData:Hashtable;
	
	public function getInt(keyPath:String):int
	{
		return _Global.INT32(getValue(keyPath) );
	}
	public function getLong(keyPath:String):long
	{
		return _Global.INT64(getValue(keyPath) );
	}	
	public function getFloat(keyPath:String):float
	{
		return _Global.FLOAT(getValue(keyPath) );
	}
	public function getString(keyPath:String):String
	{
		var t:Object = getValue(keyPath);
		if(t)
		{
			if(t as HashObject)
				return (t as HashObject).Value + "";
			else	
				return  t + "";
		}		
		return null;
	}
	public function getValue(keyPath:String):Object
	{
		return getValue(rawData,keyPath);
	}
	
	protected function getValue(data:Hashtable,keyPath:String):Object
	{
		var list:Array = keyPath.Split("."[0]);
		var tbj:Object = data;
		
		var n:int = list.length;
		var i:int = 0;
		var key:String;
		for(i=0; i<n; i++)
		{
			key = list[i];
			
			if( (tbj as Hashtable) != null )
			{
				tbj = (tbj as Hashtable)[key];
			}
			else
			{
				
				///error ....
			}
			
			if(tbj == null)			
				break;			
				
		}		
		return tbj;	
	}
	
	public function getList(key:String):Array
	{
		var srcList: Array = _Global.GetObjectValues(rawData[key]);
		var destList: Array = null;
		if (srcList != null)
		{
			var itemVO:FTEBaseVO;
			destList = [];
			for(var i:int = 0; i<srcList.length; i++)
			{
				itemVO = itemVOCreater(key);
				if (itemVO == null)
					continue;
				itemVO.mergeDataFrom(srcList[i]);
				destList.push(itemVO);
			}
		}
		return destList;
	}
	
	public function itemVOCreater(key:String):FTEBaseVO
	{
		return null;
	}
	
	public function mergeDataFrom(src:Object):void
	{
		this.rawData = src as Hashtable;
//		mergeData(src,this);
	}
	
	public function getIntArrayFromString(str:String,split:char):Array
	{
		var list :Array = str.Split(split);
		var d:int;
		var rs:Array = [];
		for(var istr:String in list)
		{
			if(istr == null || istr.Trim().Length == 0)
				continue;
			d = _Global.INT32(istr);
			rs.push(d);
		}
		return rs;
	
	}
}

