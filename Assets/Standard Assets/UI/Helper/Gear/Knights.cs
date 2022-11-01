
using System.Collections.Generic;
using KBN;

public class Knights : IParser
{ 
	
	private Dictionary<int,Knight> mKnights;
	
	
	public Knights()
	{
		mKnights = new Dictionary<int,Knight>();
	}
	public void Clear()
	{	
		if(mKnights != null)
			mKnights.Clear();
	}
	
	public Knight GetKnight(int knightID)
	{
		if(mKnights.ContainsKey(knightID))
			return mKnights[knightID];
		else return null;
	}
	
	
	
	
	public override bool Parse()
	{
		if(mSeed == null) return false;
		if(mSeed["knights"] == null) return false;
		
		var cities = mSeed["knights"].Table;
		if(cities == null) return false;
				
		foreach(System.Collections.DictionaryEntry city in cities)
		{
			if(city.Value == null) continue;
			HashObject cityValue = city.Value as HashObject;
			if(cityValue == null) continue;
			var cityKnights = cityValue.Table;
			
			foreach(System.Collections.DictionaryEntry cityKnight in cityKnights)
			{
				int cityKnightId = _Global.INT32(cityKnight.Key.ToString().Substring(3));
				if( cityKnightId < 0 ) continue;

				Knight knight = null;
				if(!mKnights.TryGetValue(cityKnightId, out knight))
				{
					knight = new Knight();
					mKnights[cityKnightId] = knight;
				}

				knight.Parse((HashObject)cityKnight.Value);
			}
		}
		return true;			
	}

	//just read, not write to seed. if u want to do that, write it yourself at 'SynSeed' method, Good Luck!	
	public override bool SynSeed()
	{
		if(!IsParseValid()) return false;
				
		return true;
	}
	public override bool IsChanged()
	{ 
		if(!IsParseValid()) return false;
		

		return false;
	}
	
	
}
