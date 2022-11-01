class GambleMenu extends ComposedMenu
{
	public var btnPlay:Button;
	public var btnNinePlay:Button;
	public var btnBuyAndPlay:Button;
	public var btnNineBuyAndPlay:Button;
	public var btnOK:Button;
	public var btnFreeToken:Button;
	
	public var picGems1:Label;
	public var picGems2:Label;
	
	public var useGems1:Label;
	public var useGems2:Label;
	
	public var activityName:Label;
	public var activityDes:Label;
	public var clickIconDesc:Label;
	public var activityPic1:ItemPic;
	public var activityPic2:ItemPic;
	public var activityPic3:ItemPic;
	public var picButton1:Button;
	public var picButton2:Button;
	public var picButton3:Button;
	public var previewTips:ItemPreviewTips;
	
	private var activityPicsArr:ItemPic[];
	private var picButtonArr:Button[];
	
	public var activityCompose:ComposedUIObj;
	
	public var btnBox1:Button;
	public var btnBox2:Button;
	public var btnBox3:Button;
	public var btnBox4:Button;
	public var btnBox5:Button;
	public var btnBox6:Button;
	public var btnBox7:Button;
	public var btnBox8:Button;
	public var btnBox9:Button;
		
	public var chaIcon:Label;
	
	public var ball:Label;
			
	public var merlin:MerlinEffect;
	public var chatFrame:Label;
	public var chatBg:Label;

	public var lockLabel:Label;
	public var toolBar:ToolBar;
	public var lockDescription:Label;

	public var picGift1:ItemPic;
	public var picGift2:ItemPic;
	public var picGift3:ItemPic;
	public var picGift4:ItemPic;
	public var picGift5:ItemPic;
	public var picGift6:ItemPic;
	public var picGift7:ItemPic;
	public var picGift8:ItemPic;
	public var picGift9:ItemPic;
	
	public var explanationForGift:Label;
	public var giftName:Label;	

	private var picOpen:Texture2D;
	private var picUnopen:Texture2D;
	private var picNineBoxes:Texture2D;
	
	public var labelMask:Label;
	public var labelMask1:Label;
	public var labelMaskFrame:Label;
	public var labelBackFrame:Label;
	public var labelBoxlight:Label;
	public var labelDescription:Label;
	
	public var giftsComposeObj:ComposedUIObj;	
	public var boxesComposeObj:ComposedUIObj;
	public var wonComposeObj:ComposedUIObj;		
	
	public var costStatus:Label;
	public var tipWin:Label;
	
	private var g_prize:int;
	private var g_rewardBoxId:int;
	private var g_tokenCount:int;
	private var g_itemPrize:int;
	
	private var seed:HashObject;
//	private var arStrings:Object;
//	private static var g_instance:GambleMenu;
	private static var POSITION_X = [50, 225, 400];
	private static var POSITION_Y = [50, 210, 370];
	
	private static var POSITION_GIFT_X = [70, 245, 420];
	private static var POSITION_GIFT_Y = [100, 260, 420];
	
	public var magnifyTimes:int = 10;
	
	private var g_account:int = 0;
	private var g_btnBoxes:Button[];
	private var g_labelPics:ItemPic[];
	
	public var chatTileStartY:int = 155;
	public var chatTileRepeatTimes:int = 2;
	
	private var g_curMenuState:int;
	private static var MENU_START:int = 1;
	private static var MENU_PLAY:int = 2;
	private static var MENU_GIFT:int = 4;
	private static var MENU_NINEPLAY:int = 6;
	
	private static var DURATION:int = 10;
	private static var PAUSE:int = 10;
	private static var IID:int = 599;
    private static final var ITEM_DEFAULT_COST : int = 5;
    
    private static var isNine:System.Boolean;
    
	private var standardNum:int;
	
    private function get ItemCost() : int
    {
        var data : Hashtable = null;

        try
        {
            data = Shop.instance().getItem(Shop.GENERAL, IID);
        }
        catch (e : System.Exception)
        {
            // Do nothing
        }

        if (data == null)
        {
            return ITEM_DEFAULT_COST;
        }

        var salePrice : int = data["salePrice"];
        if (salePrice > 0)
        {
            var startTime : long = data["startTime"];
            var endTime : long = data["endTime"];
            var curTime : long = GameMain.instance().unixtime();
            if (startTime <= curTime && curTime <= endTime)
            {
                return salePrice;
            }
        }

        return data["price"];
    }
	
	private var g_rewardBox:Button;
	private var g_rewardGift:ItemPic;
	
	private var g_hasTakenFreeGamble:boolean;
	private var g_hasChooseBox:boolean;
	private var g_hasCalculateSpeed:boolean;
	private var g_boxOldPosX:int;
	private var g_boxOldPosY:int;
	private var g_giftOldPosX:int;
	private var g_giftOldPosY:int;
	
	private var g_originalBox:Vector2 = new Vector2(128, 147);
	private var g_originalLight:Vector2 = new Vector2(223, 222);
	private var g_originalGift:Vector2 = new Vector2(80, 80);
	
	private var g_movePosBox:Vector2 = new Vector2(230, 500);
	private var g_movePosGift:Vector2 = new Vector2(285, 580);
	
	private var g_speedBox:Vector2 = new Vector2();
	private var g_speedGift:Vector2 = new Vector2();
	
	private var g_loadingLabel : LoadingLabelImpl = null;
	
	private function boxTransition():void
	{
		MenuMgr.getInstance().PushMenu("InventoryMenu", null);
	}
	
	private function calculateSpeed():void
	{	
		var tempSpeedX:float;
		var tempSpeedY:float;
		
		tempSpeedX = (g_movePosBox.x - g_rewardBox.rect.x) / DURATION;
		tempSpeedY = (g_movePosBox.y - g_rewardBox.rect.y) / DURATION;
		
		g_speedBox = new Vector2(tempSpeedX, tempSpeedY);
		
		tempSpeedX = (g_movePosGift.x - g_rewardGift.rect.x) / DURATION;
		tempSpeedY = (g_movePosGift.y - g_rewardGift.rect.y) / DURATION;

		g_speedGift = new Vector2(tempSpeedX, tempSpeedY);		
	}

	function Init()
	{
		super.Init();
		picOpen = TextureMgr.instance().LoadTexture("gamble_box_open" , TextureType.BUTTON);
		picUnopen = TextureMgr.instance().LoadTexture("gamble_box" , TextureType.BUTTON);
		picNineBoxes = TextureMgr.instance().LoadTexture("gamble_box1",TextureType.BUTTON);
		
		btnBox1.Init();
		btnBox2.Init();
		btnBox3.Init();
		btnBox4.Init();
		btnBox5.Init();
		btnBox6.Init();
		btnBox7.Init();
		btnBox8.Init();
		btnBox9.Init();
		
		picGift1.Init();
		picGift2.Init();
		picGift3.Init();
		picGift4.Init();
		picGift5.Init();
		picGift6.Init();
		picGift7.Init();
		picGift8.Init();
		picGift9.Init();
		
		btnFreeToken.Init();
		btnPlay.Init();
		btnNinePlay.Init();
		btnBuyAndPlay.Init();
		btnNineBuyAndPlay.Init();
		btnOK.Init();
		chaIcon.Init();
		
		chaIcon.setBackground("character_morgause_images", TextureType.DECORATION);
		labelMaskFrame.setBackground("frame_metal_square", TextureType.DECORATION);
		
		picGems1.Init();
		picGems2.Init();
		picGems1.image = TextureMgr.instance().LoadTexture("resource_icon_gemsorg" , TextureType.ICON);
		picGems2.image = TextureMgr.instance().LoadTexture("resource_icon_gemsorg" , TextureType.ICON);
		
		useGems1.Init();
		useGems2.Init();
		
		chatFrame.Init();
		
		labelMask.Init();
		labelMask1.Init();
		labelMask1.alpha = 0.6;
		labelMask1.alphaEnable = true;
		
		labelBackFrame.Init();
		labelMaskFrame.Init();
		labelBoxlight.Init();
		labelDescription.Init();

		costStatus.Init();
		tipWin.Init();
		
		//menuHead.Init();
		
		explanationForGift.Init();
		giftName.Init();
		
		lockLabel.Init();
		ball.Init();
		lockDescription.Init();
		toolBar.Init();		
		toolBar.setColorChangedValue(new Color(20.0/255, 20.0/255, 0, 0), 5, 2, new Color(155.0/255, 110.0/255, 60.0/255, 1));
		
		toolBar.toolbarStrings = [Datas.getArString("fortuna_gamble.BasicGame"), Datas.getArString("fortuna_gamble.AdvancedGame")];
		toolBar.indexChangedFunc = indexChangeFunction;
		clickIconDesc.txt = Datas.getArString("MerlinMadness.Tip_TapIcon");
		
		lockLabel.useTile = true;
		lockLabel.tile = TextureMgr.instance().ElseIconSpt().GetTile("Multi_city_Lock");
		
		activityPicsArr = [activityPic1, activityPic2, activityPic3];
		picButtonArr = [picButton1,picButton2,picButton3];
		g_loadingLabel = null;
		merlin.Init();
		previewTips.Sys_Constructor();
		picButton1.OnClick = OnClickPicButton1;
		picButton2.OnClick = OnClickPicButton2;
		picButton3.OnClick = OnClickPicButton3;
	}
	
	private var isUnlock:boolean;
	private var hasPlayAdvanceGame:boolean;
	private var toolbarIndex:int;
	private var isDrawComponent:boolean;

	private function hasPlayedAdvanceGame():boolean
	{
		if(seed["hasAdvanced"])
		{
			return seed["hasAdvanced"].Value == 2 ? false : true; 
		}
		
		return false;
	}
	
	private function indexChangeFunction(_value:int):void
	{
		toolbarIndex = _value;
		isOpenAdVGame = isOpenAdvancedGame();
		isUnlock = isUnlockAdvancedGame();
		hasPlayAdvanceGame = hasPlayedAdvanceGame();
		
		if(_value)
		{
			toolBar.clearColorOperation();
		}
		else
		{
			if(isUnlock && !hasPlayAdvanceGame)
			{
				toolBar.changeColorByIndex(1);
			}
            else
            {
                toolBar.styles[1].normal.textColor = new Color(235.0/255, 190.0/255, 60.0/255, 1);
            }
		}
				
		if(g_curMenuState != MENU_START)
		{
			resetBoxesPositionToNormal();
			addAllBoxAndGift();	
				
			g_rewardBox = null;
			g_rewardGift = null;
			g_hasChooseBox = false;
			g_hasCalculateSpeed = false;
			
			g_boxOldPosX = 0;
			g_boxOldPosY = 0;
	
			initiateMenu();
			changeBoxPic(false);
			setBoxesDisabled(true);				
			
		}
		
		if(_value)
		{
			Gamble.getInstance().getSeniorGambleSetting(callback, errorBack);
		}
		else
		{
			previewTips.SetVisible(false);
            PrepareToGoToStartState();
		}
	}
    
    private function PrepareToGoToStartState()
    {
        Shop.instance().getShopData(GoToStartState);
    }
    
    // Used for callback
    private function GoToStartState()
    {
        changeState(MENU_START);
    }
	
	private function errorBack(message:String, code:String):void
	{
		var confirmDialog : ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		confirmDialog.setButtonText(Datas.getArString("FTE.Retry"), Datas.getArString("PremiumChance.Exit"));
		confirmDialog.SetCloseAble(false);
		MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Error.err_3001"), "", retryFunc, closeFunc, true);
	}

	private function retryFunc():void
	{		
		//MenuMgr.getInstance().confirmDialog.close();
		g_hasChooseBox = false;	
		resetBoxesPositionToNormal();
		addAllBoxAndGift();
		changeBoxPic(false);	
		g_account = 0;				
		Gamble.getInstance().getSeniorGambleSetting(callback, errorBack);			
	}
	
	private function closeFunc():void
	{
		//MenuMgr.getInstance().confirmDialog.close();
		close();
	}

	private var seniorGambleInfor:SeniorGambleInfor;
	private function callback(data:SeniorGambleInfor):void
	{
		seniorGambleInfor = data;
//		if(seniorGambleInfor.hasActivity)
//		{
			curSeniorGambleNum = seniorGambleInfor.needToken;
//		}
		
		changeBallPicAndString(toolbarIndex);
		PrepareToGoToStartState();
	}
	
	private function resetActivityPics(arr:Array):void
	{
		activityPic1.SetVisible(false);
		activityPic2.SetVisible(false);
		activityPic3.SetVisible(false);				
		
		var gap:float = 15;
		var startX = (activityCompose.rect.width - activityPicsArr[0].rect.width * arr.length - gap * (arr.length - 1)) * 0.5;
		var temp:ItemPic;
		
		for(var a:int =0; a < arr.length; a++)
		{
			if(a >= activityPicsArr.length)
			{
				break;
			}
		
			temp = activityPicsArr[a];
			
			//temp.useTile = true;
			//temp.tile.spt = TextureMgr.instance().ElseIconSpt();
			temp.SetId((arr[a] as GambleReward).id);
			
			temp.SetVisible(true);
						
			temp.rect.x = startX + (activityPicsArr[0].rect.width + gap) * a;
			picButtonArr[a].clickParam = (arr[a] as GambleReward).id;
		}
		
	}
	
	private var strMerLinWords:String;
	private var strDescription:String;
	
	private var normalPositionY:int = 700;

	
	private function changeBallPicAndString(index:int):void
	{
		var token:int = MyItems.instance().countForItem(599);
		activityCompose.SetVisible(false);
		
		btnPlay.rect.y = 670;
		btnNinePlay.rect.y = 790;
		btnBuyAndPlay.rect.y = 670;
		btnNineBuyAndPlay.rect.y = 790;
		btnFreeToken.rect.y = 700;	
		labelDescription.rect.y = 540;
		
		picGems1.rect.y = 643;
		picGems2.rect.y = 764;
		
		useGems1.rect.y = 650;
		useGems2.rect.y = 769;
		
		if(index)
		{
			//advanced game --- normal, discount, activity
		
			ball.useTile = false;
			ball.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_morgause_images2",TextureType.ICON_ELSE);			
			
			if(seniorGambleInfor.hasActivity && hasPlayAdvanceGame)
			{
				activityCompose.SetVisible(true);
				
				activityName.txt = seniorGambleInfor.title + "";
				activityDes.txt = seniorGambleInfor.description + "";	
		
				btnPlay.rect.y = 725;
				btnNinePlay.rect.y = 830;
				btnBuyAndPlay.rect.y = 730;
				btnNineBuyAndPlay.rect.y = 835;
				btnFreeToken.rect.y = 800;	
				labelDescription.rect.y = 630;	
				
				picGems1.rect.y = 702;
				picGems2.rect.y = 808;								

				useGems1.rect.y = 710;
				useGems2.rect.y = 812;
				
				resetActivityPics(seniorGambleInfor.rewardsArr);
				
				standardNum = seniorGambleInfor.needToken;
				strMerLinWords = Datas.getArString("fortuna_gamble.PlayTitle_Adv");
				if(token >= seniorGambleInfor.needToken)
				{
					strDescription = Datas.getArString("fortuna_gamble.UseToken_Adv_var", [standardNum]) + "\n" + Datas.getArString("Common.youOwn") + ": " + generateTokenNum(token);			
					btnBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNum - token);
					btnNineBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNum*9 - token);
						
					useGems1.txt = "" + (standardNum - token) * ItemCost;
					useGems2.txt = "" + (standardNum * 9 - token) * ItemCost;	
					
				}
				else
				{
					strDescription = Datas.getArString("fortuna_gamble.UseToken_Adv_var", [standardNum]) + "\n" + Datas.getArString("Common.youOwn") + ": " + generateTokenNum(token); 
					btnBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNum - token);	
					btnNineBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNum*9 - token);
					
					useGems1.txt = " " + (standardNum - token) * ItemCost;
					useGems2.txt = " " + ( standardNum*9 - token) * ItemCost;					
				}
			}
			else
			{
				standardNum = hasPlayAdvanceGame? seniorGambleInfor.needToken : 1;
				var standardNineNum = seniorGambleInfor.needToken;
//				ball.tile.spt = TextureMgr.instance().ElseIconSpt();
//				ball.tile.name = "character_morgause_images2";
				strMerLinWords = Datas.getArString("fortuna_gamble.PlayTitle_Adv");
				
				if(token >= standardNum)
				{
					if(standardNum != 1)
					{
						//normal
						strDescription = Datas.getArString("fortuna_gamble.UseToken_Adv_var", [standardNum]) + "\n" + Datas.getArString("Common.youOwn") + ": " + generateTokenNum(token);
						btnBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNum - token);
						btnNineBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNineNum*9 - token);
						
						useGems1.txt = "" + (standardNum - token) * ItemCost;
						useGems2.txt = "" + (standardNineNum * 9 - token) * ItemCost;
					}
					else
					{
						//discount
						strDescription = Datas.getArString("fortuna_gamble.UseToken_AdvDisc") + "\n" + Datas.getArString("Common.youOwn") + ": " + generateTokenNum(token); 
						btnBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNum - token);
						btnNineBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNineNum*9 - token);
						
						useGems1.txt = "" + (standardNum - token) * ItemCost;
						useGems2.txt = "" + (standardNineNum * 9 - token) * ItemCost;
					}
					
				}
				else
				{
					if(standardNum)
					{
						//normal
						strDescription = Datas.getArString("fortuna_gamble.UseToken_Adv_var", [standardNum]) + "\n" + Datas.getArString("Common.youOwn") + ": " + generateTokenNum(token);
						btnBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNum - token);
						btnNineBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNineNum*9 - token);
						
						useGems1.txt = "" + (standardNum - token) * ItemCost;
						useGems2.txt = "" + (standardNineNum * 9 - token) * ItemCost;		 							 				
					}
					else
					{
						//discount
						strDescription = Datas.getArString("fortuna_gamble.UseToken_AdvDisc") + Datas.getArString("Common.youOwn") + ": " + generateTokenNum(token); 
						btnBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(1);
						btnNineBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNineNum*9 - token);
						
						useGems1.txt = "" + (standardNum - token) * ItemCost;
						useGems2.txt = "" + (standardNineNum * 9 - token) * ItemCost;		 					
					}
				}				
			}
		}
		else
		{	
			//basic game
			standardNum = 1;
			ball.useTile = false;
			ball.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_morgause_images1",TextureType.ICON_ELSE);
//			ball.tile.spt = TextureMgr.instance().ElseIconSpt();
//			ball.tile.name = "character_morgause_images1";
			strMerLinWords = Datas.getArString("fortuna_gamble.PlayTitle");
			
			var freeCount:int = _Global.INT32(seed["hasFreePlay"]);
			if(freeCount > 0)
			{
				strDescription = Datas.getArString("fortuna_gamble.UseToken") + "\n"  + Datas.getArString("Common.youOwn") + ": " + generateTokenNum(token + freeCount);
				
			}
			else
			{
				if(token >= standardNum)
				{
					strDescription = Datas.getArString("fortuna_gamble.UseToken") + "\n" + Datas.getArString("Common.youOwn") + ": " + generateTokenNum(token);
					btnBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(1);
					btnNineBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNum*9 - token);
					
					useGems1.txt = " " + (standardNum - token) * ItemCost;
					useGems2.txt = " " + (standardNum * 9 - token) * ItemCost;
				}
				else
				{
					strDescription = Datas.getArString("fortuna_gamble.UseToken") + "\n" + Datas.getArString("Common.youOwn") + ": " + generateTokenNum(token); 
					
					btnBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(1);
					btnNineBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNum*9 - token);
					
					useGems1.txt = " " + (standardNum - token) * ItemCost;
					useGems2.txt = " " + (standardNum * 9 - token) * ItemCost;	 
				}
			}
		}
	}
		
	private function isUnlockAdvancedGame():boolean
	{
		var level:int = _Global.INT32(seed["player"]["title"]);
		return ((level >= 10) && isOpenAdVGame) ? true : false;
	}
	
	private function handleInventory():void
	{
		var obj:Object = {"selectedTab":1};
		MenuMgr.getInstance().PushMenu("InventoryMenu", obj);
	}		
	
	private function setBoxAndGiftByID(Id:int):void
	{
		g_rewardBox = g_btnBoxes[Id - 1];
		g_rewardGift = g_labelPics[Id - 1];
		
		g_boxOldPosX = g_rewardBox.rect.x;
		g_boxOldPosY = g_rewardBox.rect.y;
		
		g_giftOldPosX = g_rewardGift.rect.x;
		g_giftOldPosY = g_rewardGift.rect.y;
	}
	
	private function handleBoxByID(id:int):void
	{
		if(g_hasChooseBox)
		{
			return;
		}
		setBoxesDisabled(true);
		var isAdvanced:int = toolbarIndex ? 1: 0;
		var isNinePlay:int = isNine ? 1: 0; 
		if(isNine == true)
		{
			chooseNineMmbCard(isAdvanced,isNinePlay);
		}	
		else
		{
			chooseMmbCard(isAdvanced,isNinePlay);
		}
		g_rewardBoxId = id;
		setBoxAndGiftByID(g_rewardBoxId);
		addBoxesAndGiftsExceptID(g_rewardBoxId);
		g_hasChooseBox = true;
		g_hasCalculateSpeed = false;
	}
	
	private function addAllBoxAndGift():void
	{
		boxesComposeObj.clearUIObject();
		giftsComposeObj.clearUIObject();
		
		var btnTemp:Button;
		var labelTemp:ItemPic;
		for(var a:int = 0; a < g_btnBoxes.length; a++)
		{
			btnTemp = g_btnBoxes[a];
			labelTemp = g_labelPics[a];
			boxesComposeObj.addUIObject(btnTemp);
			giftsComposeObj.addUIObject(labelTemp);
		}
	}

	private function changeBoxPic(isOpen:boolean):void
	{
		var btnTemp:Button;
		for(var a:int = 0; a < g_btnBoxes.length; a++)
		{
			btnTemp = g_btnBoxes[a];
			
			if(isOpen)
			{
				btnTemp.mystyle.normal.background = picOpen;
			}
			else
			{
				if(isNine == true)
				{
					btnTemp.mystyle.normal.background = picNineBoxes;
				}
				else
				{
					btnTemp.mystyle.normal.background = picUnopen;
				}
			}
		}		
	}	
	
	private function addBoxesAndGiftsExceptID(Id:int):void
	{
		boxesComposeObj.clearUIObject();
		giftsComposeObj.clearUIObject();

		var btnTemp:Button;
		var labelTemp:ItemPic;
		for(var a:int = 0; a < g_btnBoxes.length; a++)
		{	
			if(Id != a + 1)
			{
				btnTemp = g_btnBoxes[a];
				labelTemp = g_labelPics[a];
				boxesComposeObj.addUIObject(btnTemp);	
				giftsComposeObj.addUIObject(labelTemp);
			}
		}
	}

	function DrawTitle()
	{

	}

	function DrawItem()
	{
		if ( !this.IsPaint() && g_loadingLabel != null )
			return;

		toolBar.Draw();

		if(!isUnlock)
		{
			lockLabel.Draw();
		}
		
		if(toolbarIndex && !isUnlock)
		{
			lockDescription.Draw();			
		}
		else
		{
			chatBg.Draw();
			
			chatFrame.Draw();
						
			if(seniorGambleInfor != null && toolbarIndex == 1 && seniorGambleInfor.hasActivity)
			{
				merlin.Draw();
			}
			else
			{
				chaIcon.Draw();
				ball.Draw();

			}
			costStatus.Draw();
			
		
			switch(g_curMenuState)
			{
				case MENU_START: // check the status
					menuStart();
					break;
				case MENU_PLAY:  // show the boxes
					menuPlay();
					break;
				case MENU_NINEPLAY:  // show the boxes
					menuNinePlay();
					break;	
				case MENU_GIFT:  // show the prize
					menuGift();
					break;
			}			
		}
		
		if ( g_loadingLabel != null )
			g_loadingLabel.Draw();
	}
	
	private function changeState(state:int):void
	{
		g_curMenuState = state;
		
		switch(state)
		{
			case MENU_START: // check the status
				stateStart();
				break;
			case MENU_PLAY:  // show the boxes
				statePlay();
				break;
			case MENU_NINEPLAY:
				stateNinePlay();
				break;
			case MENU_GIFT:  // show the prize
				stateGift();
		}
	}
	
	function DrawBackground()
	{
		menuHead.Draw();
		DrawMiddleBg();
		frameTop.Draw();			
	}
	
	private function isOpenAdvancedGame():boolean
	{
		if(seed["hasAdvanced"])
		{
			return seed["hasAdvanced"].Value == 0 ? false : true;	
		}
		
		return false;
	}

	private var isOpenAdVGame:boolean;
	function OnPush(param:Object)
	{
		super.OnPush(param);
		var data:Hashtable = param as Hashtable;
		var gotoPremium:boolean = (null != data && _Global.INT32(data["premium"]) == 1);
		
		MenuMgr.getInstance().MainChrom.StopGambleAnimation();

		seed = GameMain.instance().getSeed();
//		arStrings = Datas.instance().arStrings();		
		
		bgStartY = 130;
		
		toolbarIndex = 0;
		standardNum = 0;
		toolBar.selectedIndex = toolbarIndex;
		
		//changeBallPicAndString(toolbarIndex);
		frameTop.rect = Rect( 0, bgStartY, rect.width, 46);
		
		isOpenAdVGame = isOpenAdvancedGame();
		isUnlock = isUnlockAdvancedGame();
		hasPlayAdvanceGame = hasPlayedAdvanceGame();
		
		if(isOpenAdVGame)
		{
			lockDescription.txt = Datas.getArString("fortuna_gamble.LockedAdv");
		}
		else
		{
			lockDescription.txt = Datas.getArString("fortuna_gamble.ClosedAdv");
		}

		if(isOpenAdVGame && isUnlock && !hasPlayAdvanceGame)
		{
			toolBar.changeColorByIndex(1);
		}
		else
		{
			toolBar.clearColorOperation();
		}
		
		g_btnBoxes = [btnBox1,btnBox2,btnBox3,btnBox4,btnBox5,btnBox6,btnBox7,btnBox8,btnBox9];
		g_labelPics = [picGift1,picGift2,picGift3,picGift4,picGift5,picGift6,picGift7,picGift8,picGift9];
		
		menuHead.setTitle(Datas.getArString("fortuna_gamble.MerlinGift"));		
	
		if (!gotoPremium) 
			indexChangeFunction(0);

		Gamble.getInstance().getSeniorGambleSetting(callback, errorBack);

		var token:int = MyItems.instance().countForItem(599);
		standardNum = toolbarIndex? seniorGambleInfor.needToken : 1;
		
		btnOK.txt = (Datas.getArString("Common.OK_Button") as String).ToUpper();
		btnBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(1);
		btnNineBuyAndPlay.txt = Datas.getArString("Common.Buy") + " " + generateTokenNum(standardNum*9 - token);
		btnPlay.txt = Datas.getArString("fortuna_gamble.OneTimeButton");
		btnNinePlay.txt = Datas.getArString("fortuna_gamble.NineTimeButton");
		btnFreeToken.txt = Datas.getArString("fortuna_gamble.play_DailyFree");

		g_movePosBox = new Vector2(240, 465);
		g_movePosGift = new Vector2(270, 530);		
		
		btnBuyAndPlay.OnClick = handlePlayAndBuy;
		btnNineBuyAndPlay.OnClick = handleNineBuyAndPlay;
		btnPlay.OnClick = handlePlay;
		btnNinePlay.OnClick = handleNinePlay;
		btnFreeToken.OnClick = handlePlay;
		btnOK.OnClick = handleOK;
		
		resetBoxesPositionToNormal();
		addAllBoxAndGift();	
			
		g_rewardBox = null;
		g_rewardGift = null;
		g_hasChooseBox = false;
		g_hasCalculateSpeed = false;
		
		g_boxOldPosX = 0;
		g_boxOldPosY = 0;

		initiateMenu();
		changeBoxPic(false);
		setBoxesDisabled(true);
		
		if (gotoPremium)
		{
			toolBar.selectedIndex = 1;
		}
	}
	public function initiateMenu()
	{
		var btnTemp:Button;
	
		for(var a:int = 0; a < g_btnBoxes.length; a++)
		{
			btnTemp = g_btnBoxes[a];
			btnTemp.clickParam = a + 1;
			btnTemp.OnClick = handleBoxClick;
			btnTemp.SetDisabled(false);
		}
	}
	
	private function setBoxesDisabled(_enable:boolean)
	{
		var btnTemp:Button;
		for(var a:int = 0; a < g_btnBoxes.length; a++)
		{
			btnTemp = g_btnBoxes[a];
			btnTemp.SetDisabled(_enable);
		}		
	}
	
	private function resetBoxesPositionToNormal()
	{
		var btnTemp:Button;
		var labelTemp:Label;
		var itemPicTtemp:ItemPic;
		for(var a:int = 0; a < g_btnBoxes.length; a++)
		{
			btnTemp = g_btnBoxes[a];
			itemPicTtemp = g_labelPics[a];
			
			btnTemp.rect = Rect(POSITION_X[a % 3], POSITION_Y[(a - a % 3) / 3], g_originalBox.x, g_originalBox.y);			
			itemPicTtemp.SetSize(Rect(POSITION_GIFT_X[a % 3], POSITION_GIFT_Y[(a - a % 3) / 3], g_originalGift.x, g_originalGift.y));			
		}
		
		labelBoxlight.rect.width = g_originalLight.x;		
		labelBoxlight.rect.height = g_originalLight.y;
	}
	
	private function resetGiftsPositionToNormal()
	{
		var labelTemp:ItemPic;
		for(var a:int = 0; a < g_labelPics.length; a++)
		{
			labelTemp = g_labelPics[a];
			
			labelTemp.rect.x = POSITION_GIFT_X[a % 3];
			labelTemp.rect.y = POSITION_GIFT_Y[(a - a % 3) / 3];
		}	
	}
	public function stateStart():void
	{
		changeBallPicAndString(toolbarIndex);
		g_tokenCount = MyItems.instance().countForItem(599);
		
		btnFreeToken.SetVisible(false);
		btnPlay.SetVisible(false);
		btnNinePlay.SetVisible(false);
		btnBuyAndPlay.SetVisible(false);
		btnNineBuyAndPlay.SetVisible(false);
		picGems1.SetVisible(false);
		picGems2.SetVisible(false);
		useGems1.SetVisible(false);
		useGems2.SetVisible(false);
		
		var freeCount:int = _Global.INT32(seed["hasFreePlay"]);
		if(freeCount > 0 && toolbarIndex == 0)
		{
			costStatus.txt = strMerLinWords;
			labelDescription.txt = strDescription;
			btnFreeToken.SetVisible(true);
		}
		else if(hasPlayedAdvanceGame() == false && toolbarIndex)
		{
			costStatus.txt = strMerLinWords;
			labelDescription.txt = strDescription;
			if(g_tokenCount >= standardNum)
			{
				btnPlay.SetVisible(true);
				btnNinePlay.SetVisible(false);
				btnNineBuyAndPlay.SetVisible(true);
				picGems2.SetVisible(true);
				useGems2.SetVisible(true);
				if(g_tokenCount >= seniorGambleInfor.needToken * 9)
				{
					btnNineBuyAndPlay.SetVisible(false);
					btnNinePlay.SetVisible(true);
					picGems2.SetVisible(false);
					useGems2.SetVisible(false);
				}
			}
			else
			{
				picGems1.SetVisible(true);
				picGems2.SetVisible(true);
				useGems1.SetVisible(true);
				useGems2.SetVisible(true);
				btnBuyAndPlay.SetVisible(true);
				btnNineBuyAndPlay.SetVisible(true);
			}
		}
		else
		{
			costStatus.txt = strMerLinWords;
			labelDescription.txt = strDescription;
			if(g_tokenCount >= standardNum)
			{
				btnPlay.SetVisible(true);
				btnNinePlay.SetVisible(false);
				btnNineBuyAndPlay.SetVisible(true);
				picGems2.SetVisible(true);
				useGems2.SetVisible(true);
				if(g_tokenCount >= 9*standardNum)
				{
					btnNineBuyAndPlay.SetVisible(false);
					btnNinePlay.SetVisible(true);
					picGems2.SetVisible(false);
					useGems2.SetVisible(false);
				}
			}
			else
			{
				picGems1.SetVisible(true);
				picGems2.SetVisible(true);
				useGems1.SetVisible(true);
				useGems2.SetVisible(true);
				btnBuyAndPlay.SetVisible(true);
				btnNineBuyAndPlay.SetVisible(true);
			}
		}		
	}	
	
	private function menuStart()
	{
		boxesComposeObj.Draw();
		
		labelBackFrame.Draw();
		labelMask.Draw();
		labelMask1.Draw();
		labelMaskFrame.Draw();
		labelDescription.Draw();
		
		activityCompose.Draw();
		previewTips.Draw();
		
		btnFreeToken.Draw();
		btnPlay.Draw();
		btnNinePlay.Draw();
		btnBuyAndPlay.Draw();
		btnNineBuyAndPlay.Draw();
		picGems1.Draw();
		picGems2.Draw();	
		useGems1.Draw();
		useGems2.Draw();		
	}
	
	private function generateTokenNum(num:int):String
	{
		var returnStr:String;
		
		if(num > 1)
		{
			returnStr = num + " " + Datas.getArString("fortuna_gamble.Tokens");
		}
		else
		{
			returnStr = num + " " + Datas.getArString("fortuna_gamble.Token");
		}
		
		return returnStr;
	}
	
	private function handlePlayAndBuy()
	{
		if(toolbarIndex)
		{
		
			var num:int = standardNum - MyItems.instance().countForItem(599);
			if(Payment.instance().CheckGems(ItemCost * num))
			{
				getToken(num);
			}
					
			/*
			if(hasPlayAdvanceGame)
			{
				var num:int = standardNum - MyItems.instance().countForItem(599);
				if(Payment.instance().CheckGems(ItemCost * num))
				{
					getToken(num);
				}
				else
				{
					//gems not enough
				}		
			}
			else
			{
				if(Payment.instance().CheckGems(ItemCost))
				{
					getToken(1);
				}
				else
				{
					//gems not enough
				}			
			}*/
		}
		else
		{
			if(Payment.instance().CheckGems(ItemCost))
			{
				getToken(1);
			}				
		}
		var btnTemp:Button;
		for(var a:int = 0; a < g_btnBoxes.length; a++)
		{
			btnTemp = g_btnBoxes[a];
			btnTemp.mystyle.normal.background = picUnopen;
		}
	}
	private function handleNineBuyAndPlay()
	{
		var num:int;
		var isAdvanced:boolean = toolbarIndex ? true: false;
		
		if(isAdvanced)
		{
			num = seniorGambleInfor.needToken * 9 - MyItems.instance().countForItem(599);
		}
		else
		{
			num = standardNum * 9 - MyItems.instance().countForItem(599);
		}	
		
		if(Payment.instance().CheckGems(ItemCost * num))
		{
			getNineToken(num);
		}
		isNine = true;
		var btnTemp:Button;
		for(var a:int = 0; a < g_btnBoxes.length; a++)
		{
			btnTemp = g_btnBoxes[a];
			btnTemp.mystyle.normal.background = picNineBoxes;
		}
	}
	
	private function handlePlay()
	{
//		var currArmsCnt:int = GearManager.Instance().GearWeaponry.GetArms().Count;
//		var storageCnt:int = GearManager.Instance().GetStorageCount();
//		if (currArmsCnt >= storageCnt)
//		{
//			GearSysHelpUtils.PopupDefaultDialog("", "Max items", false);
//			return;
//		}
		
		g_hasChooseBox = false;
		changeState(MENU_PLAY);
		setBoxesDisabled(false);
		isNine = false;
		var btnTemp:Button;
		for(var a:int = 0; a < g_btnBoxes.length; a++)
		{
			btnTemp = g_btnBoxes[a];
			btnTemp.mystyle.normal.background = picUnopen;
		}
	}
	private function handleNinePlay()
	{
		g_hasChooseBox = false;
		changeState(MENU_NINEPLAY);
		setBoxesDisabled(false);
		isNine = true;
		var btnTemp:Button;
		for(var a:int = 0; a < g_btnBoxes.length; a++)
		{
			btnTemp = g_btnBoxes[a];
			btnTemp.mystyle.normal.background = picNineBoxes;
		}
	}
	private function statePlay():void
	{
		costStatus.txt = Datas.getArString("fortuna_gamble.PlayDescription");
	}		
	private function stateNinePlay():void
	{
		//todo
	}
				
	private function menuPlay()
	{
		if(!g_hasChooseBox)
		{
			labelBackFrame.Draw();
			labelMaskFrame.Draw();
		}

		boxesComposeObj.Draw();
		
		if(g_hasChooseBox)
		{
			labelBackFrame.Draw();
			labelMask.Draw();
			labelMaskFrame.Draw();
			
			
			g_rewardBox.rect.x = g_boxOldPosX + boxesComposeObj.rect.x;
			g_rewardBox.rect.y = g_boxOldPosY + boxesComposeObj.rect.y;
			
			labelBoxlight.rect.x = g_boxOldPosX + boxesComposeObj.rect.x - 47;
			labelBoxlight.rect.y = g_boxOldPosY + boxesComposeObj.rect.y - 21;
			labelBoxlight.Draw();
			g_rewardBox.Draw();
		}
	}
	private function menuNinePlay()
	{
		if(!g_hasChooseBox)
		{
			labelBackFrame.Draw();
			labelMaskFrame.Draw();
		}
		boxesComposeObj.Draw();
		if(g_hasChooseBox)
		{
			g_hasChooseBox = false;
		}
	}
	private function handleBoxClick(param:Object)
	{		
		var id:int = _Global.INT32(param);
		resetBoxesPositionToNormal();
		handleBoxByID(id);
	}
	
	public function handleOK()
	{
		changeState(MENU_START);
		g_hasChooseBox = false;	
		resetBoxesPositionToNormal();
		addAllBoxAndGift();
		changeBoxPic(false);	
		g_account = 0;	
		setBoxesDisabled(true);
	}

	private function stateGift():void
	{
		costStatus.txt = Datas.getArString("fortuna_gamble.win_youWon");
		
		giftName.txt = Datas.getArString("itemName.i" + g_itemPrize);
		explanationForGift.txt = Datas.getArString("itemDesc.i" + g_itemPrize);			
	}	
	
	private function menuGift()
	{
		if(g_rewardBox == null || g_rewardGift == null)
		{
			return;
		}

		g_account++;

		boxesComposeObj.Draw();	
		giftsComposeObj.Draw();
		labelBackFrame.Draw();
		
		if(g_account < PAUSE)
		{
			labelBoxlight.Draw();
		}
		else
		{	
			labelMask.Draw();
			labelMask1.Draw();
		}
		
		labelMaskFrame.Draw();
		
		g_rewardBox.Draw();

		if(!g_hasCalculateSpeed)
		{
			g_rewardGift.rect.x = giftsComposeObj.rect.x + g_giftOldPosX;						
			g_rewardGift.rect.y = giftsComposeObj.rect.y + g_giftOldPosY;		
			
			
			
			calculateSpeed();
			g_hasCalculateSpeed = true;
		}
		
		g_rewardGift.Draw();						

		if(g_account < DURATION + PAUSE && g_account >= PAUSE)
		{
			g_rewardBox.rect.width += 6;
			g_rewardBox.rect.height += 6;
			g_rewardBox.rect.x += g_speedBox.x;
			g_rewardBox.rect.y += g_speedBox.y;
			
			/*
			g_rewardGift.rect.height += 3;
			g_rewardGift.rect.width += 3;
			g_rewardGift.rect.x += g_speedGift.x;
			g_rewardGift.rect.y += g_speedGift.y;
			*/
			
			g_rewardGift.SetSize(Rect(g_rewardGift.rect.x + g_speedGift.x,
										  g_rewardGift.rect.y + g_speedGift.y,
										  g_rewardGift.rect.width + 3,
										  g_rewardGift.rect.height + 3));
										  
			g_rewardGift.elements[2].rect = new Rect(44, 44, 24, 24);
		}
		else if(g_account >= DURATION + PAUSE)
		{
			btnOK.Draw();
			costStatus.txt = Datas.getArString("fortuna_gamble.WonDesc");
			wonComposeObj.Draw();
		}	
	}
	
	private function changeGiftPic(_result:HashObject, isAdvanced:int)
	{
		var prizeId:int = _Global.INT32(_result["prize"]);
		var _boxes:Array = _Global.GetObjectValues(_result["boxes"]);
		var giftExceptPrize:Array = new Array();
		var tempLabel:ItemPic;
		var a:int;
		
		
		for(a = 0; a < _boxes.length; a++)
		{
			if(prizeId != (_boxes[a] as HashObject).Value)
			{
				giftExceptPrize.push(_boxes[a]);
			}
		}
		
		var giftIndex:int = 0;
		var spt:TileSprite = TextureMgr.instance().ItemSpt();
		for(a = 0; a < g_labelPics.length; a++)
		{			
			tempLabel = g_labelPics[a];
			if(a + 1 == g_rewardBoxId)
			{
				tempLabel.SetId(prizeId);
			}
			else
			{	
				if(giftIndex < giftExceptPrize.length)
				{
					tempLabel.SetId((giftExceptPrize[giftIndex] as HashObject).Value);
					giftIndex++;
				}
			}
		}
	}

	private var curSeniorGambleNum:int = 0;
	
	//----------------------------------------------net------------------------------//
	public function chooseMmbCard(isAdvanced:int,isNinePlay:int)
	{
 		var params:Array = new Array();
 		params.Push(isAdvanced);
 		params.Push(isNinePlay);
 		params.Push(curSeniorGambleNum);
		
		var canChooseMmbCard:Function = function(result:HashObject)
		{
	  		if(result["ok"].Value == null)
	  		{
	  			_Global.Log("chooseMmbCard is error");
	  			return;
	  		}

            DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.Gamble, null);
			g_loadingLabel = new LoadingLabelImpl(true);
			var freeCnt:int=_Global.INT32(result["hasFreePlay"]);
			var menuMgr : MenuMgr = MenuMgr.instance;
			if ( menuMgr != null && menuMgr.MainChrom != null )
					menuMgr.MainChrom.UpdateGambleInfo(freeCnt);

		
			MystryChest.instance().AddLoadMystryChestCallback(function()
			{
				g_loadingLabel = null;
				var itemPrize : int = _Global.INT32(result["prize"]);
				MyItems.instance().AddItem(itemPrize);
				
				var gambleMenu : GambleMenu = menuMgr.getMenu("GambleMenu", false);
				if ( gambleMenu != null )
					gambleMenu.priv_chooseMmbCardReturnOKWithoutAddItem(result, isAdvanced);
			});
		};
		UnityNet.reqChooseMmbCard(params, canChooseMmbCard, errorBack);  	
	}
	public function chooseNineMmbCard(isAdvanced:int,isNinePlay:int)
	{
 		var params:Array = new Array();
 		params.Push(isAdvanced);
 		params.Push(isNinePlay);
 		params.Push(curSeniorGambleNum);
		
		var canChooseMmbCard:Function = function(result:HashObject)
		{
	  		if(result["ok"].Value == null)
	  		{
	  			_Global.Log("chooseMmbCard is error");
	  			return;
	  		}

            DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.Gamble, null);
			g_loadingLabel = new LoadingLabelImpl(true);
			var freeCnt:int=_Global.INT32(result["hasFreePlay"]);
			var menuMgr : MenuMgr = MenuMgr.instance;
			if ( menuMgr != null && menuMgr.MainChrom != null )
			menuMgr.MainChrom.UpdateGambleInfo(freeCnt);
			
			MystryChest.instance().AddLoadMystryChestCallback(function()
			{
				g_loadingLabel = null;
				
				var prizeTable:HashObject = result["prizes"];
				var keys:Array = _Global.GetObjectKeys(prizeTable);
				var param : GambleChestPopMenu.GambleParam = new GambleChestPopMenu.GambleParam();
				param.from.x = g_boxOldPosX + boxesComposeObj.rect.x;
				param.from.y = g_boxOldPosY + boxesComposeObj.rect.y;
				param.from.width = 100;
				param.from.height = 100;
				param.gameType = 1;
				param.callBack = function()
	            {
	                handleOK();
	            };
				param.ids = new Array();
				param.standard = standardNum;
				for(var i:int = 0;i < keys.length;i++)
				{
					MyItems.instance().AddItem(_Global.INT32(prizeTable[keys[i]].Value));
					
					param.ids.Add(_Global.INT32(prizeTable[keys[i]].Value));
				}
				if(g_curMenuState == MENU_START)
					return;
				MenuMgr.getInstance().PushMenu("GambleChestPopMenu", param,"trans_immediate");
				var gambleMenu : GambleMenu = menuMgr.getMenu("GambleMenu", false);
				if ( gambleMenu != null )
					gambleMenu.priv_chooseNineMmbCardReturnOKWithoutAddItem(result, isAdvanced);
			});
		};
		UnityNet.reqChooseMmbCard(params, canChooseMmbCard, errorBack);  	
	}
	private function priv_chooseMmbCardReturnOKWithoutAddItem(result:HashObject, isAdvanced:int)
	{
		var itemPrize : int = _Global.INT32(result["prize"]);
		g_itemPrize = itemPrize;

		//must be delete when can add unit in the inventory
		//MyItems.instance().AddItem(itemPrize);

		resetGiftsPositionToNormal();
		changeBoxPic(true);
		changeGiftPic(result, isAdvanced);
		g_account = 0;
		
		var freeCount:int = _Global.INT32(seed["hasFreePlay"]);
		if(freeCount > 0  && !isAdvanced)
		{
			seed["hasFreePlay"] = result["hasFreePlay"];
			MenuMgr.getInstance().MainChrom.chromBtnGamble.SetCnt(_Global.INT32(seed["hasFreePlay"]));
		}
		else
		{
			if(!isAdvanced)
			{
				if(MyItems.instance().countForItem(599) > 0)
				{
					MyItems.instance().subtractItem(599);
				}					
			}
			else
			{
				if(hasPlayedAdvanceGame())
				{
					MyItems.instance().subtractItem(599, seniorGambleInfor.needToken);
				}
				else
				{
					if(MyItems.instance().countForItem(599) > 0)
					{
						MyItems.instance().subtractItem(599);
					}
					
					//set hasAdvanced true	
					seed["hasAdvanced"].Value = 1;
					hasPlayAdvanceGame = hasPlayedAdvanceGame();
				}
			}
		}

		g_prize = _Global.INT32(result["prize"]);
		changeState(MENU_GIFT);	
		SoundMgr.instance().PlayEffect( "rare_drop", /*TextureType.AUDIO*/"Audio/" );																						
	};
	private function priv_chooseNineMmbCardReturnOKWithoutAddItem(result:HashObject, isAdvanced:int)
	{
		var _giftsArr:Array = _Global.GetObjectValues(result["prizes"]);
		resetGiftsPositionToNormal();
		g_account = 0;
		
		var freeCount:int = _Global.INT32(seed["hasFreePlay"]);
		if(freeCount > 0  && !isAdvanced)
		{
			seed["hasFreePlay"] = result["hasFreePlay"];
			MenuMgr.getInstance().MainChrom.chromBtnGamble.SetCnt(_Global.INT32(seed["hasFreePlay"]));
		}
		else
		{
			if(!isAdvanced)
			{
				if(MyItems.instance().countForItem(599) > 0)
				{
					MyItems.instance().subtractItem(599,9);
				}					
			}
			else
			{
				MyItems.instance().subtractItem(599, seniorGambleInfor.needToken*9);
				hasPlayAdvanceGame = hasPlayedAdvanceGame();
			}
		}

		g_prize = _Global.INT32(result["prize"]);
		SoundMgr.instance().PlayEffect( "rare_drop", /*TextureType.AUDIO*/"Audio/" );																						
	};
	
	function Update()
	{
		super.Update();
		
		toolBar.Update();
		merlin.Update();
		if ( g_loadingLabel != null )
			g_loadingLabel.Update();
	}
	
	public function getToken(num:int)
	{
		isNine = false;
		var canGetToken:Function = function(result:HashObject)
		{
			var isReal:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
			Payment.instance().SubtractGems(ItemCost * num,isReal);	
			MyItems.instance().AddItem(IID, num);
					
			changeState(MENU_PLAY);
			setBoxesDisabled(false);
			g_hasChooseBox = false;									
		};

		//--------------------------------------------------------------//
		UnityNet.BuyInventory(IID, num, canGetToken, null);	
		//--------------------------------------------------------------// 			
	}
	public function getNineToken(num:int)
	{
		isNine = true;
		var canGetNineToken:Function = function(result:HashObject)
		{
			var isReal:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
			Payment.instance().SubtractGems(ItemCost * num,isReal);	
			MyItems.instance().AddItem(IID, num);
					
			changeState(MENU_NINEPLAY);
			initiateMenu();
			setBoxesDisabled(false);
			g_hasChooseBox = false;									
		};

		//--------------------------------------------------------------//
		UnityNet.BuyInventory(IID, num, canGetNineToken, null);	
		//--------------------------------------------------------------// 			
	}
	public function OnPopOver()
	{
		g_loadingLabel = null;
	}
	
	private function OnClickPicButton1(param:Object)
	{
		ShowTips(activityPic1,_Global.INT32(param));
	}
	
	private function OnClickPicButton2(param:Object)
	{
		ShowTips(activityPic2,_Global.INT32(param));
	}
	
	private function OnClickPicButton3(param:Object)
	{
		ShowTips(activityPic3,_Global.INT32(param));
	}
	
	private function ShowTips(itemObj:ItemPic,itemId:int) 
	{
		if (0 == itemId) return;
		previewTips.SetItemData(itemId);
		 var r:Rect = itemObj.Region;
//		r.x += list.rect.x - list.getScrollViewVector().x;
//		r.y += list.rect.y;
//		r.x = Mathf.Clamp(r.x, list.rect.x - r.width * 0.4f, list.rect.xMax - r.width * 0.6f);
//
//		previewTips.SetItemData(itemId);
//
		previewTips.rect.y = activityCompose.rect.y + r.y - previewTips.rect.height - 30;
		previewTips.arrowRect.y = activityCompose.rect.y + r.y - 16;
//
		previewTips.rect.x = (640 - previewTips.rect.width) * 0.5f;
//		if (r.center.x > previewTips.rect.xMax - 40)
//			previewTips.rect.x = r.center.x + 40 - previewTips.rect.width;
//		if (r.center.x < previewTips.rect.x + 40)
//			previewTips.rect.x = r.center.x - 40;
		previewTips.arrowRect.x = activityCompose.rect.x + r.x + 16;
		previewTips.SetVisible(true);
	}
}
