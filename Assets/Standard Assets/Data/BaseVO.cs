using UnityEngine;
using System.Collections;
using System.Collections.Generic;

using _Global = KBN._Global;
using Datas = KBN.Datas;

public class BaseVO
{
    public HashObject rawData;
    
    public int getInt(string keyPath)
    {
        return _Global.INT32(getValue(keyPath) );
    }
    public long getLong(string keyPath)
    {
        return _Global.INT64(getValue(keyPath) );
    }    
    public float getFloat(string keyPath)
    {
        return _Global.FLOAT(getValue(keyPath) );
    }
    public string getString(string keyPath)
    {
        object t = getValue(keyPath);
        if(t != null)
        {
            if((t as HashObject) != null)
                return (t as HashObject).Value + "";
            else    
                return  t + "";
        }
        return null;
    }
    public object getValue(string keyPath)
    {
        return Datas.getValue(rawData,keyPath);
    }

    public BaseVO itemVOCreater(string key)
    {
        return null;
    }
    
    public virtual void mergeDataFrom(object src)
    {
        this.rawData = src as HashObject;
        //        mergeData(src,this);
    }
    
    public int[] getIntArrayFromString(string str,char split)
    {
        string[] list = str.Split(split);
        int d;
        List<int> rs = new List<int>();
        foreach (string istr in list)
        {
            if(istr == null || istr.Trim().Length == 0)
                continue;
            d = _Global.INT32(istr);
            rs.Add(d);
        }
        return rs.ToArray();
        
    }

	public virtual long GetReturnUnixTime()
	{
		return 0;
	}

	public virtual long GetDestinationUnixTime()
	{
		return 0;
	}
}
