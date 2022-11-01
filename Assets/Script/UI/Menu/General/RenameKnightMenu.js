class RenameKnightMenu extends PopMenu
{
	public var btnSubmit:Button;
	public var btnCancel:Button;
	public var line:Label;
	public var description:Label;
	public var limit:Label;
	public var hint:Label;
	public var txtField:TextField;
	
	public var kid:int;
	public var offset:float;
	public var type:String;       
	public var action:Function;                              
	
	public function Init():void
	{
		super.Init();
		
		btnSubmit.Init();
		btnCancel.Init();
		line.Init();
		description.Init();
		title.Init();
		limit.Init();
		hint.Init();
		
		btnSubmit.txt = Datas.getArString("Common.Submit");
		btnCancel.txt = Datas.getArString("Common.Cancel");
		
		limit.txt = String.Format(Datas.getArString("RenameKnight.CharactorLimit"), GameMain.instance().MaxPlayerNameCharactor.ToString());

		
		btnSubmit.OnClick = OnSubmit;
		btnCancel.OnClick = OnCancel;
		
		txtField.maxChar = GameMain.instance().MaxPlayerNameCharactor;
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		txtField.ClearField();
		
		var hash : Hashtable = param as Hashtable;
		kid = _Global.INT32(hash["kid"]);
		
		type = hash["type"]!=null? hash["type"].ToString():null;
		if (type!="equip"){
			title.txt = Datas.getArString("RenameKnight.Title");
			hint.txt = Datas.getArString("RenameKnight.Changename");
			description.txt = Datas.getArString("RenameKnight.Description");
			
			var renameName : String = General.instance().getKnightName(kid);
			var formerName : String = General.singleton.getKnightShowNameById(kid);
			if(renameName != formerName)
			{
				txtField.txt = General.instance().getKnightName(kid);
				
			}
		}else{
			title.txt = Datas.getArString("Gear.rename_title");
			hint.txt = Datas.getArString("Gear.rename_desc1");
			description.txt = Datas.getArString("Gear.rename_desc2");
		    var name:String = hash["name"]!=null?hash["name"].ToString():null;
		    action = hash["act"];
		    txtField.txt = name;
		}
	}
	
	public function OnPop()
	{
		super.OnPop();
	}
	
//	function Update() 
//	{
//		
//	}
	
	public function DrawItem()
	{
		btnSubmit.Draw();
		btnCancel.Draw();
		line.Draw();
		description.Draw();
		limit.Draw();	
		hint.Draw();
		txtField.Draw();
	}
	
	private function OnSubmit():void
	{
		if (txtField.txt.length > GameMain.instance().MaxPlayerNameCharactor) {
			ErrorMgr.instance().PushError("", Datas.instance().getArString("Error.NameNotAllowed"));
			return;
		}
		var okFunc:Function;
	   	if (type!="equip"){
			okFunc = function(result:HashObject)
			{
				if (result["ok"].Value) 
				{
					var newKnightRemark : String = result["newKnightRemark"].Value.ToString();
					var knightId : int = _Global.INT32(result["knightId"].Value);
					if(newKnightRemark == "")
					{
						newKnightRemark = General.singleton.getKnightShowNameById(knightId);
					}
					General.instance().setKnightName(knightId, newKnightRemark);
					
					var menuMgr:MenuMgr = MenuMgr.getInstance();			
					var generalMenu:GeneralMenu = menuMgr.getMenu("GeneralMenu") as GeneralMenu;
					if( generalMenu ){
						offset = generalMenu.generalTab.generalList.m_nOffSet;
					
						generalMenu.generalTab.setListData(General.instance().getGenerals());
						generalMenu.generalTab.generalList.Update();
						
						generalMenu.generalTab.generalList.m_nOffSet = offset;
					}
					
					menuMgr.PopMenu("");
				}
			};
		}else{
		        okFunc = function(result:HashObject){
		        if (result["ok"].Value) {
			        var remarkName:String = result["newRemark"].Value.ToString();
			        var equipSys:Weaponry = GearManager.Instance().GearWeaponry;
					var arm:Arm = equipSys.GetArm(kid);
					var isChange:Boolean = true;
			        if (remarkName == "" && arm != null)
			        {
						remarkName = Datas.getArString("gearName.g" + arm.GDSID);
						isChange = false;
			        }
			        if (!String.IsNullOrEmpty(remarkName)){
			         
                       if (arm!=null)
                       {
						   if (isChange)
						   {
							arm.RemarkName = remarkName;
						   }
						   else
						   {
							arm.RemarkName = null;
						   }
                        if(action!=null)
                        {
                          action(remarkName,isChange);
                        }
                       }
			        }
		        }
		         txtField.startInput = OnClickTextField;
		         MenuMgr.getInstance().PopMenu("");
		  };
		
		}
					
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
		{
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
		};
		 if (type!="equip"){
		    UnityNet.renameKnightName(txtField.txt, kid , okFunc, errorFunc);
		}else{
		    UnityNet.renameEquip(kid,txtField.txt,okFunc,errorFunc);
		}
	}
	
	private function OnCancel():void
	{
		//txtField.ClearField();
		MenuMgr.getInstance().PopMenu("RenameKnightMenu");
		
	}	
	private function OnClickTextField():void 
	{
	   txtField.ClearField();
	   txtField.clearKeyboardTxt();
	}

}