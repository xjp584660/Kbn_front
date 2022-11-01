import System.Reflection;
public class CarmotIntroDialog extends PopMenu
{
	public var l_bg:Label;
	public var l_back:Label;
	public var l_msg:Label;
	public var headImage : Label;
	public var bgMenu : BGMenu;//black back
	public var fullClickBtn:Button;//handle the next click event
	public var nextButton:SimpleButton;
	public var typingText:TypingText;
	private var dialogType:int;//0:carmotDialog ,  1:migrateDialog
	var stepIndex=0;

	public function Init():void
	{
		super.Init();
		bgMenu.Init();
		bgMenu.m_color = new Color(1, 1, 1, 0.6);
		
		InitFullClickBtn();
	//	 headImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_Morgause", TextureType.FTE);
		 
		 if(nextButton){
			nextButton =  new FTENPCNextButton();
			nextButton.Init();
		}
		nextButton.SetVisible(false);
		typingText.typeEndFunc = onEndTyping;
		typingText.numPerSec = 90;
		typingText.txt ="";
		bgStartY=50;//bg top position
	}
	
	function InitFullClickBtn():void{	
		fullClickBtn.rect = new Rect(0, 0, rect.width, rect.height );
		fullClickBtn.OnClick = nextStep;
	}

	public function Update()
	{
		super.Update();
		if(nextButton)
			nextButton.Update();	
		if(typingText)
			typingText.Update();
	}
	
	
	function OnPush(param:Object)
	{
		setDefautlFrame=false;
		var img : Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_wood");
		setLayout();
		if(param!=null){
			var mData:Hashtable = param as Hashtable;
			dialogType = mData["type"];
		}
		stepIndex=1;
		ShowMsg();
//		if(dialogType == 2)
//		{
//			rect.y += 150;
//		}
	}
	
	protected function setLayout():void
	{
		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width) /2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height) /2;
		btnClose.rect.x = rect.width - btnClose.rect.width - 5;
		nextButton.rect.x =  200;
		nextButton.rect.y =  0;
		//typingText.rect=l_msg.rect;
		
	}
	
	public function Draw()
	{
		bgMenu.Draw();
		super.Draw();
		
	}
	
	public function DrawItem()
	{
		super.DrawItem ();
		l_bg.Draw();
		l_back.Draw();
		headImage.Draw();
		l_msg.Draw();
		
		if(typingText)
			typingText.Draw();
		fullClickBtn.Draw();
		
		nextButton.Draw();
	}
	
	public function DrawBackground()
	{
	
	}
	

	
	
	function ShowMsg():void{
		var messageText:String="";
		if(dialogType==0){//carmot
			if(stepIndex < 5)
				 messageText=Datas.getArString(getMessageKey(dialogType,stepIndex));
			else {
					PlayerPrefs.SetInt(GameMain.instance().getUserId()+"carmotGuid", 1 );
					MenuMgr.instance.PopMenu("");
					typingText.wholeText ="";
					
					var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
					mainChrom.priv_initLayout();
				}
			
		}else if(dialogType==1){//migrate
			if(stepIndex < 4)
				 messageText=Datas.getArString(getMessageKey(dialogType,stepIndex));
				 
			else 
				{
					PlayerPrefs.SetInt(GameMain.instance().getUserId()+"migrateGuid", 1 );
					MenuMgr.instance.PopMenu("");
					typingText.wholeText ="";
				}
		}
		else if(dialogType==2) //technologyTree
		{ 
			if(stepIndex < 4)
				 messageText=Datas.getArString(getMessageKey(dialogType,stepIndex));
				 
			else 
				{
					//PlayerPrefs.SetInt(GameMain.instance().getUserId()+"technologyGuid", 1 );
					MenuMgr.instance.PopMenu("");
					typingText.wholeText ="";
					Technology.instance().checkTechPopUp();
				}
		}
		typingText.wholeText = messageText;//
		nextButton.SetVisible(false);
		typingText.startTyping();
	}
	
	function getMessageKey(type:int,step:int):String
	{
		if(type==0)
		{	//carmot
			return "FTE.Castle22_"+step;
		}else if(type==1)
		{	//migrate
		 	return "Migrate.FirstDialogue_String"+step;
		}
		else if(type==2)
		{  	//technology
			return "DivinationLab.FirstDialogue_String"+step;
		}
	}
	
	private function onEndTyping():void
	{
		nextButton.SetVisible(true);
	}
	
	
	public function nextStep():void{
	var flag:boolean=nextButton.isVisible();
		if(flag){
			stepIndex++;
			ShowMsg();
		}
		
	
	}

	
	


}