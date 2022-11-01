import System.Collections.Generic;

public class OutpostTroopsDeployment extends KBN.OutpostTroopsDeployment {

	protected function GetDeploymentMarches() : List.<MarchData> 
	{
		var marchlist : Array = March.instance().getMarchListByFilter( function(obj : Object) : boolean {
			var march : MarchVO = obj as MarchVO;
			if (null != march && march.marchType == Constant.MarchType.AVA_SENDTROOP && 
				_Global.INT32(march.rawData["marchStatus"]) == Constant.MarchStatus.DEFENDING) 
            {
				return true;
            }
			return false;
		});
		
		var listdata : List.<MarchData> = new List.<MarchData>();
		
		for (var i : int = 0; i < marchlist.length; i++) {
			var mvo : MarchVO = marchlist[i] as MarchVO;
			if (null == mvo)
				continue;
				
			var data : MarchData = new MarchData();
			data.marchId = mvo.marchId;
			data.marchType = mvo.marchType;
			data.cityId = mvo.cityId;
			data.knightShowName = mvo.knightShowName;
			data.knightTexName = mvo.knightTexName;
			data.rawData = mvo.rawData;
            data.heroData = null;
			listdata.Add(data);
		}
		
		return listdata;
	}
	
    protected function RequestDataAndPushMarchDetail(data : MarchData) : void
    {
        RallyPoint.instance().viewMarch(data.marchId, function(result : HashObject) {
            if (_Global.GetBoolean(result["ok"]))
            {
                data.heroData = result["march"];
                if (null != OnPushMarchDetail)
                    OnPushMarchDetail(data);
            }    
        });
    }
    
	protected function RecallMarch(data : MarchData) : void
	{
		RallyPoint.instance().recall(data.marchId, data.marchType, data.cityId, function(result:HashObject) {
			UpdateData();
		});
	}
}