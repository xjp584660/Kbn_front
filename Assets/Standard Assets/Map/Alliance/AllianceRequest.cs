using UnityEngine;
using System.Collections;

using Datas = KBN.Datas;
using _Global = KBN._Global;

public class AllianceRequest {
    public CityInfo city;
    public int Id;
    public int Type; //1 resource 0 reinforce
    public long[] Res;
    
    public override string ToString() {
        string cityStr = string.Format("({0},{1})", city.X, city.Y);
        if (Type == Constant.AllianceRequestType.RESOURCE) {
            
            return string.Format(Datas.getArString("Alliance.iNeed"), ResString(Res), cityStr);
        } else {
            return string.Format("{0} {1}", Datas.getArString("Alliance.NeedReinforcement"), cityStr);
        }
    }
    
    public static string ResString(long[] resources) {
        if (resources != null && resources.Length == 5) {
            string result = "";
            for (int i = 0; i < resources.Length; i++) {
                if (resources[i] > 0) {
                    result += string.Format("{0} {1},", _Global.NumSimlify(resources[i]), Datas.getArString("ResourceName.a" + i));
                }
            }
            
            return result.TrimEnd(","[0]);
        }
        return string.Empty;
    }
    
    public string ResValues() {
        //[1,2,3,4,5]  to  "1,2,3,4,5"
        string result = "";
        for (int i = 0; i < Res.Length; i++) {
            result += Res[i] + ",";
        }
        result = result.Substring(0, result.Length - 1);
        return result;
    }
    
    public long Sum() {
        long result = 0;
        for (int i = 0; i < Res.Length; i++) {
            result += Res[i];
        }
        return result;
    }
}
