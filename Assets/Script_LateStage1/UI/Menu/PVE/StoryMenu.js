public class StoryMenu extends KBNMenu
{
	public enum AnimState
	{
		NPCIn = 0,
		NPCOut = 1,
		CharacterIn = 2,
		CharacterOut = 3,
		UpdateText = 4, 
		FadeOut = 5,
		Normal = 6
	};
	
	private var CurDialog:DialogItem;				//UI
	private var OtherSideDialog:DialogItem;
	private var OutDialog:DialogItem;
	private var NextDialog:DialogItem;
	
	private var _CurStoryData:KBN.DataTable.PveStory;		//data
	private var _NextStoryData:KBN.DataTable.PveStory;
	
	private var m_state:AnimState;
	private var m_CurPos:Vector2 = Vector2.zero;
	private var m_DesirePos:Vector2 = Vector2.zero;
	private var m_EndPos:Vector2 = Vector2.zero;
	private var mutexOnNextStep:boolean;
	private var unlockHeroID:int;
	private var chapterID:int;
	
	//divde line
	@SerializeField private var skipBtn:Button;
	
	@SerializeField private var BG:SimpleLabel;
	
	@SerializeField private var NPCDialog:DialogItem;				//prefab
	@SerializeField private var CharactorDialog:DialogItem;			//prefab
	
	private var storyID:int;
	private var flg:boolean;
	private var levelID:int;
	
	function Init():void
	{
		NPCDialog.Init();
		CharactorDialog.Init();
		if(BG.mystyle.normal.background == null)
		{
			BG.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		}

		skipBtn.OnClick = skipCurChapter;
		
		_CurStoryData = new KBN.DataTable.PveStory();		//data
		_NextStoryData = new KBN.DataTable.PveStory();
		
		mutexOnNextStep = false;
	}
/*	
	function OnPush(param:Object):void
	{
		super.OnPush(param);
		var data:HashObject = getTestDate();
		NPCDialog.SetData(data["npc"]);
		CharactorDialog.SetData(data["me"]);
		
		//init storyID
		//temporarily
		storyID = 10000100;
	}

	function DrawItem():void
	{
		
		DrawMask(); 
		
		NPCDialog.Draw();
		CharactorDialog.Draw();
		//skipBtn.Draw();
	}
	
	function DrawMask()
	{
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.5);	
		BG.Draw();
		GUI.color = oldColor;
	}
	
	public function Update()
	{
		NPCDialog.Update();
		CharactorDialog.Update();
		
		if(Input.GetMouseButtonDown(0))
		{
			handleClick();
		}
	}
	
	public function OnPopOver()
	{
		storyID = -1;
		NPCDialog.Clear();
		CharactorDialog.Clear();
	}
	
	public function handleBack()
	{
		MenuMgr.getInstance().PopMenu("StoryMenu");
		
		var hash:HashObject = new HashObject({"typeid":PveResultMenu.Menu_Type.MENU_TYPE_WIN});
		MenuMgr.getInstance().PushMenu("PveResultMenu", hash, "trans_zoomComp");  
	}
	
	function getTestDate():HashObject
	{
		var testData :HashObject = new HashObject(
		{
			"npc":{
				"head":"halfboss",
				"dialog":"Farms and other Resource buildings are located here in the Filde View.Tap to select a Farm",
				"name":"Queen Morguase"
			},
			"me":{
				"head":"halfboss",
				"dialog":"",
				"name":"Queen Morguase"
			}
		});
		return testData;
	}
	
	private function handleClick()
	{
		var storyData:KBN.DataTable.PveStory = KBN.PveController.instance().GetStoryInfo(storyID);
		if(storyData==null)
			handleBack();
			
		if(storyID%100>=99)
			storyID = -1;
		else
			storyID++;
			
		if(storyData.POSITION == 0)
		{
			NPCDialog.SetData(storyData);
		}
		else
		{
			CharactorDialog.SetData(storyData);
		}
	}
*/	
	//divde line
	
	function OnPush(param:Object):void
	{
		//temporarily
		//storyID = 10000100;
		var hash:HashObject = param as HashObject;
		if(hash == null)return;
		
		storyID = KBN.PveController.instance().GetFirstStoryID(_Global.INT32(hash["storyID"]));
		unlockHeroID = _Global.INT32(hash["heroID"]);
		chapterID = _Global.INT32(hash["chapterID"]);
		//if(hash["isWin"]!=null)
		flg= hash["isWin"]!=null?_Global.GetBoolean(hash["isWin"]):false;	
		levelID = _Global.INT32(hash["levelID"]);
		
		super.OnPush(param);
		
		_CurStoryData = KBN.PveController.instance().GetStoryInfo(storyID) as KBN.DataTable.PveStory;
		_NextStoryData = _CurStoryData; 
		getNextNode();
		if(_NextStoryData==null)return;
		createNewDialog();
		
		m_state = AnimState.CharacterIn; 
		NextDialog.SetDisable(false);
		resetEndPos();
	}

	function DrawItem():void
	{
		if(OtherSideDialog != null)
		{
			OtherSideDialog.Draw();
			
		}
		
		DrawMask(); 
		
		if(OutDialog != null)
			OutDialog.Draw();
		if(CurDialog)
			CurDialog.Draw(); 
		if(NextDialog)
			NextDialog.Draw();	
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.NEXT_CONVERSATION:
				handleNextStep();
				break;
		}
	}

	private function handleNextStep():void
	{
		if(!mutexOnNextStep)
			return;
		if(_CurStoryData == null)
		{
			TheEnd();
			return;
		}
		
		if(IsHaveNext(_CurStoryData.ID))//Have next
		{
			var nextName:String = Datas.getArString(_NextStoryData.NAME);
			var curName:String = Datas.getArString(_CurStoryData.NAME);
			if(nextName == curName) // same pos and same name
			{
				m_state = AnimState.UpdateText;
				OutDialog = CurDialog; 
				resetEndPos();
				if(NextDialog == null)
				{
					TheEnd();
				}
					
				NextDialog.setUpdateState(DialogItem.UpdateState.inImmediate);
			}
			else
			{
				if(_NextStoryData.POSITION == _CurStoryData.POSITION) // same pos but different name
				{
					 OutDialog = CurDialog;
					 m_state = AnimState.FadeOut; 
					 if(OutDialog == null)
					 {
					 	TheEnd();
					 }
					 OutDialog.setUpdateState(DialogItem.UpdateState.fadeOut);
				}
				else															 // different pos
				{	
					if(OtherSideDialog != null)
						OutDialog = OtherSideDialog; 
					
//					var otherName:String = Datas.getArString((OtherSideDialog.getData() as KBN.DataTable.PveStory).NAME);
//					var nextName2:String = Datas.getArString((NextDialog.getData() as KBN.DataTable.PveStory).NAME);
			
					if(OtherSideDialog != null && 
						Datas.getArString((OtherSideDialog.getData() as KBN.DataTable.PveStory).NAME) ==
						Datas.getArString((NextDialog.getData() as KBN.DataTable.PveStory).NAME)) //same pos with lastdia
					{
						m_state = AnimState.UpdateText;
						resetEndPos();
						if(NextDialog == null)
						{
							TheEnd();
						}	
						NextDialog.setUpdateState(DialogItem.UpdateState.inImmediate);
					}
					else														//need ainmIn
					{ 
						if(OutDialog)
						{
							m_state = AnimState.FadeOut;
							OutDialog.setUpdateState(DialogItem.UpdateState.fadeOut);
						}
						else
						{
							resetINOutState(_NextStoryData.POSITION);
							resetEndPos();
						}
					} 
					OtherSideDialog = CurDialog; 
					if(OtherSideDialog != null) 
						OtherSideDialog.SetDisable(false);
				} 
				
			}

		}
		else								//The end
		{
			TheEnd();
			return;
		}
		CurDialog = null;
		mutexOnNextStep = false;
	}
	
	private function TheEnd():void
	{
		skipCurChapter();
	}
	
	private function resetINOutState(type:int):void //KBN.DataTable.PveStory.POSITION
	{
		if(type == 0)
		{
			m_state = AnimState.CharacterIn;
		}
		else
		{
			m_state = AnimState.NPCIn;
		}
	}
	
	private function resetEndPos():void
	{
		if(_NextStoryData.POSITION == 0)
		{
			m_EndPos = new Vector2(0,0);
			NextDialog.setUpdateState(DialogItem.UpdateState.inToLeft);
		}
		else
		{
			m_EndPos = new Vector2(0,0);
			NextDialog.setUpdateState(DialogItem.UpdateState.inToRight); 
		}

//		if( m_state == AnimState.CharacterIn)
//			NextDialog.setUpdateState(DialogItem.UpdateState.inToLeft);
//		else if( m_state == AnimState.NPCIn)
//			NextDialog.setUpdateState(DialogItem.UpdateState.inToRight); 
			
			
		NextDialog.setEndPos(m_EndPos); 
	}
	
	function DrawMask()
	{
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.5);	
		BG.Draw();
		GUI.color = oldColor;
	}
	
	public function Update()
	{
		if(CurDialog)
			CurDialog.Update();
		if(m_state != AnimState.Normal)	//need update in/out dialog
		{	
			if(m_state == AnimState.UpdateText)	//same character and just need update text and set dialog state to inImmediate
			{
				if(NextDialog.getUpdateState() == DialogItem.UpdateState.normal )
				{
					updateOutDialog(); 
					updateDialogs();
				}
			
			} 
			else if(m_state == AnimState.FadeOut) 
			{
				if(OutDialog.getUpdateState() == DialogItem.UpdateState.outImmediate)	//old dialog fadeout done
				{
					resetINOutState(_NextStoryData.POSITION);
					resetEndPos();
				}
			}
			else
			{
//				NextDialog.SetDisable(false);
//				NextDialog.Setshowbg(false);
//				NextDialog.SetshowNextBtn(false); 
				if(NextDialog.getUpdateState() != DialogItem.UpdateState.normal )
				{
					return;
				}

				updateOutDialog();

				updateDialogs();				

//				else if(NextDialog.rect.x - m_EndPos.x < 0 && _NextStoryNode.characterType == StoryNode.CharacterType.NPC)
//				{
//					updateDialogs();				
//				}
			} 
		}

	}
	
	//update out dialog
	private function updateOutDialog():void
	{
		if(OutDialog != null)
		{
			OutDialog.setUpdateState(DialogItem.UpdateState.outImmediate); 					//for test 
			GameObject.Destroy(OutDialog.gameObject);
			OutDialog = null; 
		}

		
	}
	
	// update to Next UI when curdialog'showanim done
	private function updateDialogs():void
	{
		NextDialog.setUpdateState(DialogItem.UpdateState.normal);
//		NextDialog.rect.x = m_EndPos.x; //sync to pos
		_CurStoryData = _NextStoryData;
		
		NextDialog.SetDisable(true);
		NextDialog.Setshowbg(true);
		
		getNextNode();  

		CurDialog = NextDialog;
		if(CurDialog)
		{
			CurDialog.startTyping();
		}

		if(_NextStoryData != null)
		{
			createNewDialog();
		}	
		
		if(OutDialog != null)
			GameObject.Destroy(OutDialog.gameObject);
		OutDialog = null;
		m_state = AnimState.Normal;
				
		mutexOnNextStep = true;
	}
	
	
	// update data
	private function createNewDialog():void
	{
		if(_NextStoryData==null)return;
		var dialogObj:GameObject;
		if(_NextStoryData.POSITION == 0)
		{
			dialogObj = GameObject.Instantiate(NPCDialog.gameObject) as GameObject; 
		}
		else
		{
			dialogObj = GameObject.Instantiate(CharactorDialog.gameObject) as GameObject;			
		}
		NextDialog = dialogObj.GetComponent("DialogItem");
		NextDialog.Init(); 
		NextDialog.SetData(_NextStoryData); 
		NextDialog.initAnimPos(new Vector2(NextDialog.rect.x, NextDialog.rect.y),new Vector2(NextDialog.rect.x, NextDialog.rect.y));
	}
	
	private function getNextNode():void
	{
		_NextStoryData = KBN.PveController.instance().GetStoryInfo(storyID) as KBN.DataTable.PveStory;
		if(_NextStoryData==null)
			return;
			
		if(storyID%100>=99)
			storyID = -1;
		else
			storyID++;
	}
	
	// start typing
	private function startTyping():void
	{
		
	}
	
	
	//for test : close menu
	public function skipCurChapter():void		//for test
	{
		
		if(CurDialog)
		{
			GameObject.Destroy(CurDialog.gameObject);
			CurDialog = null; 
		}
		if(OtherSideDialog)
		{
			GameObject.Destroy(OtherSideDialog.gameObject);
			OtherSideDialog = null; 
		}
		if(OutDialog)
		{
			GameObject.Destroy(OutDialog.gameObject);
			OutDialog = null; 
		}
		if(NextDialog)
		{
			GameObject.Destroy(NextDialog.gameObject);
			NextDialog = null; 
		}
		MenuMgr.getInstance().PopMenu("","trans_immediate");
		
	}
	
	public function OnPop()
	{
		super.OnPop();
		
		//unlockHeroID
		if(levelID>0)
		{
			var param:HashObject = new HashObject({"levelID":levelID, "isHIdeBossInfo":0});
			MenuMgr.getInstance().PushMenu("BossMenu", param,"transition_BlowUp");
			flg=false;
		}
		else if(unlockHeroID > 0)
		{
			var hash:HashObject = new HashObject({"heroID":unlockHeroID,"chapterID":chapterID,"isWin":flg});
			MenuMgr.getInstance().PushMenu("UnlockHeroMenu", hash, "trans_zoomComp");
			flg=false;
		}
		else if(chapterID > 0)
		{
			var hash1:HashObject = new HashObject({"chapterID":chapterID,"isWin":flg});
			MenuMgr.getInstance().PushMenu("LevelupMenu", hash1, "trans_zoomComp");
			KBN.PveController.instance().PushUnlockEliteChapterMsg(chapterID);
			flg=false;
		}
		if(flg)
		{
			KBN.PveController.instance().CheckUnlockNext();
			GameMain.instance().onPveResultMenuPopUp();
		}
	}
	
	private function IsHaveNext(stroyID:int):boolean
	{
		if(stroyID%100>=99)
			return false;
		_NextStoryData = KBN.PveController.instance().GetStoryInfo(stroyID+1) as KBN.DataTable.PveStory;
		if(_NextStoryData==null)
			return false;
			
		return true;
	}
}