using UnityEngine;
using System.Collections;

namespace KBN
{
    public abstract class General
    {
        public static General singleton { get; protected set; }

		protected HashObject seed;

        public abstract void init(HashObject sd);

        public abstract void ParseKnights(Knights knights);

        public abstract void setGeneralStatus(int cityId, int knightId, int status);

        public abstract int getGeneralStatus(int cityId, int knightId);

        public abstract int[] calcExpLvl(string kid);

        protected const int MAX_GENERAL_CNT_PER_CITY = 16;

        public static string getGeneralTextureName(string generalName, int cityOrder)
        {    
            int generalNameId = _Global.INT32(generalName);
            if (generalNameId == 47000)
            {
                return "halloween_general";
            }
			else if (generalNameId == 47001)
			{
				return "christmas_general";
			}
			else if (generalNameId == 47002)
			{
				return "custom1_general";
			}
			else if(generalNameId>=47003  && generalNameId<=47009){
				return "general_"+generalNameId;
			}
            if (generalNameId >= 1000)
            {
                return  "gi" + "_" + generalNameId;
            }
            
            int halfCnt = MAX_GENERAL_CNT_PER_CITY / 2;
            if (cityOrder > 1)
            {
                if (cityOrder == 4)
                {
                    cityOrder = 1;
                    if (generalNameId < halfCnt)
                    {
                        generalNameId += 9;     
                    }
                    else if (generalNameId == halfCnt)
                        {
                            generalNameId += 1;
                        }
                        else
                        {
                            generalNameId -= 8;
                            cityOrder = 2;
                        }
                }
                else
                {
                    if (generalNameId > halfCnt)
                    {
                        generalNameId -= ((cityOrder + 1) % 2) * halfCnt;
                        cityOrder = 1;
                    }
                    else
                    {
                        cityOrder = 2;
                    }
                }
            }
            
            return  "gi" + cityOrder + "_" + generalNameId;
        }

		public string getKnightShowName(string name, int cityOrder)
		{
			if( name == null || name.Length <= 0 ){
				return "";
			}

			int curCityId = GameMain.singleton.getCityIdByCityOrder(cityOrder);
			var generals = _Global.GetObjectValues(seed["knights"]["city"+curCityId]);

			foreach(object general in generals )
			{
				if( (general as HashObject)["knightName"].Value.ToString() == name )
				{
					if((general as HashObject)["knightRemark"] != null && (general as HashObject)["knightRemark"].Value != "")
	    			{
						return (general as HashObject)["knightRemark"].Value.ToString();
	    			}
	    			else
	    			{
						return getKnightNameByCityOrderAndName(name, cityOrder);
	    			}
				}
			}

			return "";
		}

		public static string getKnightNameByCityOrderAndName(string knightName, int cityOrder)
		{
			if( knightName == null || knightName.Length <= 0 ){
				return "";
			}

			return Datas.getArString("Generals.city" + cityOrder + "_GenName" + knightName);
		}

		public string getKnightTexNameById(int knightId)
		{
			if( knightId == 0 )
				return string.Empty;

			if(seed == null || seed["cities"] == null)
			{
				return string.Empty;
			}
			HashObject cities = seed["cities"];

			for(int i = 0; i < GameMain.singleton.getCitiesNumber(); i++)
			{
				HashObject cityInfo = cities[_Global.ap+i];
				int currentcityid = _Global.INT32(cityInfo[_Global.ap+0]);	
				int cityOrder = _Global.INT32(cityInfo[_Global.ap+6]);	
				var generals = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
				foreach(object general in generals ){
					if( _Global.INT32((general as HashObject)["knightId"]) == knightId ){
						return getGeneralTextureName((general as HashObject)["knightName"].Value as string, cityOrder);
					}
				}
			}
			
			return string.Empty;
		}

		public string getKnightShowNameById(int knightId)
		{
			if( knightId == 0 )
				return string.Empty;
			
			HashObject cities = seed["cities"];
			
			for(int i = 0; i < GameMain.singleton.getCitiesNumber(); i++)
			{
				HashObject cityInfo = cities[_Global.ap+i];
				int currentcityid = _Global.INT32(cityInfo[_Global.ap+0]);	
				int cityOrder = _Global.INT32(cityInfo[_Global.ap+6]);	
				var generals = _Global.GetObjectValues(seed["knights"]["city"+currentcityid]);
				foreach(object general in generals ){
					if( _Global.INT32((general as HashObject)["knightId"]) == knightId ){
						return getKnightNameByCityOrderAndName((general as HashObject)["knightName"].Value as string, cityOrder);
					}
				}
			}
			
			return string.Empty;
		}
    }
}
