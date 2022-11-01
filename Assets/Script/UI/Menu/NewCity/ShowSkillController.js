import System.Collections.Generic;
import UnityEngine;
public class ShowSkiiController extends KBN.UnityNet{

	private static var _instance : ShowSkiiController = null;
	
	public static function instance() : ShowSkiiController {
		if (null == _instance) {
			_instance = new ShowSkiiController();
			GameMain.instance().resgisterRestartFunc(function(){
				_instance = null;
			});
		}
		return _instance;
	}

	public function GetShowSkills()
	{
		var url:String="showSkill.php";
		var form:WWWForm=new WWWForm();
		form.AddField("cityId",GameMain.instance().getCurCityId());

		var okFunc:Function=function(result:HashObject){

		};
		var errorFunc:Function=function(result:HashObject){
			ErrorMgr.instance().PushError("",result.ToString());
		};

		shortRequest(url,form,okFunc,errorFunc,false);
	}
}