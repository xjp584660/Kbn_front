public class DialogItem extends FullClickItem
{
	public enum UpdateState
	{
		normal = 0,
		inImmediate = 1,
		outImmediate = 2,
		fadeOut = 3,
		fadeIn = 4,
		inToLeft = 5,
		inToRight = 6,
		wait = 7
	}
	
	private var noButton:boolean = false;
	private var showbg:boolean = false;
	private var showNextBtn:boolean = false;
	private var dtime:float;
	
	private var curState:UpdateState;
	private var endPos:Vector2 = Vector2.zero;
	private var m_CurPos:Vector2 = Vector2.zero;
	private var m_DesirePos:Vector2 = Vector2.zero;
	
	//private var m_data:ConversationNode;
	private var m_alphaPer:float;
	
	private var oldMatrix:Matrix4x4;
	private var bgMatrix:Matrix4x4;
	private var rotateY:float;
	private var rotateZ:float;
	private var tex:Texture2D;
	private var avatarType:int;//0boss 1hero 2book 3none
	
	////divide line
	@SerializeField private var BG:SimpleLabel;
	@SerializeField private var BGFrame:SimpleLabel;
	@SerializeField private var NameLable:Label;
	@SerializeField private var LightBox:Label;
	@SerializeField private var avatar:Label;
	@SerializeField private var Conversation:TypingText;
	
	@SerializeField private var nextButton:SimpleButton;
	
	@SerializeField private var nextBtnRect:Rect;
	
	private var storyData:KBN.DataTable.PveStory;
	
	@SerializeField private var avatarBossRect:Rect;
	@SerializeField private var avatarHeroRect:Rect;
	@SerializeField private var avatarBookRect:Rect;
	
	@SerializeField private var conversationBossRect:Rect;
	@SerializeField private var conversationHeroRect:Rect;
	@SerializeField private var conversationBookRect:Rect;
	
	
	public function Init():void
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		nextButton =  new FTENPCNextButton();
		nextButton.Sys_Constructor();		
//		nextButton.rect = new Rect(151,69,320,320);

		NameLable.setBackground("bossname-bg",TextureType.DECORATION);
		
		if(BG.mystyle.normal.background == null)
		{
			BG.mystyle.normal.background = texMgr.LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		}
		
		BGFrame.useTile = true;
		BGFrame.tile = iconSpt.GetTile("popup1_transparent");
		
		avatarType = 0;
	}
	
	
/*	
	public function Draw()
	{
		BG.Draw();
		//LightBox.Draw();
		BGFrame.Draw();
		avatar.Draw();
		Conversation.Draw();
		nextButton.Draw();
		
		NameLable.Draw();
		
	}
*/
	
	public function SetData(param:Object)
	{
		storyData = param as KBN.DataTable.PveStory;	

//		Conversation.wholeText = Datas.getArString(storyData.CONTENT);
		//Conversation.numPerSec = 90;
		
//		NameLable.txt = Datas.getArString(storyData.NAME);
		
		rotateY = 0.0f;
		rotateZ = 0.0f;
		super.Init(); 
		line.mystyle.normal.background = null;
		showbg = false;
		showNextBtn = false;
		
		btnDefault.OnClick = endTyping;
		
		avatarType = 0;
		if(storyData.ICON == "potrait_Book")
		{
			avatarType = 2;
			avatar.useTile = false;
			tex = TextureMgr.instance().LoadTexture("potrait_Book",TextureType.PVEBOSS);
			if(tex != null)
				tex.wrapMode = TextureWrapMode.Clamp;
		}
		else
		{
			avatar.useTile = false;
			tex = TextureMgr.instance().LoadTexture(storyData.ICON,TextureType.PVEBOSS);
			if(tex == null)
			{
				tex = TextureMgr.instance().LoadTexture("potrait_NoPic",TextureType.PVEBOSS);
				var heroTile:Tile = TextureMgr.instance().GetHeroSpt().GetTile(storyData.ICON);
				if(heroTile.prop != null)
				{
					avatar.setBackground("None",TextureType.DECORATION);
					avatar.useTile = true;
					avatar.tile = heroTile;
					avatarType = 1;
				}
			}
			if(tex != null)
				tex.wrapMode = TextureWrapMode.Clamp;
		}
		
		switch(avatarType)
		{
		case 0:
			Conversation.rect = conversationBossRect;
			avatar.rect = avatarBossRect;
			break;
		case 1:
			Conversation.rect = conversationHeroRect;
			avatar.rect = avatarHeroRect;
			break;
		case 2:
			Conversation.rect = conversationBookRect;
			avatar.rect = avatarBookRect;
			break;
		}
		
		
		NameLable.txt = Datas.getArString(storyData.NAME);
		nextButton =  new FTENPCNextButton();
		//this must set the position of nextButton 
		nextButton.Sys_Constructor();		
		nextButton.clickParam = FTEConstant.Action.ShowNext;
		this.setNextButton(nextButton);

		Conversation.wholeText = Datas.getArString(storyData.CONTENT);
		Conversation.typeEndFunc = onEndTyping;
		Conversation.numPerSec = 90;
		curState = UpdateState.normal;
		m_alphaPer = 0;
		
		if(storyData.NAME =="0")
		{
			NameLable.SetVisible(false);
		}
		else{
			NameLable.SetVisible(true);
		}
		
		if(storyData.ICON =="0")
		{
			avatar.SetVisible(false);
		}
		else{
			avatar.SetVisible(true);
		}
	}

	/*	
	public function Update():void
	{
		if(nextButton)
			nextButton.Update();
		if(Conversation)
			Conversation.Update();
	}
	*/
	
	public function Clear():void
	{
		NameLable.txt = "";
	}
	
	
	
	/////////////divde line
	
	public function gotoNext():void
	{
		showNextBtn = false;
		btnDefault.SetVisible(false);
		MenuMgr.instance.sendNotification(Constant.Notice.NEXT_CONVERSATION,null);
	}
	
	public function setUpdateState(param:UpdateState):void
	{
		curState = param;
		if(curState == UpdateState.fadeOut)
		{
			m_alphaPer = 0;
		}
	}
	
	public function getUpdateState():UpdateState
	{
		return curState;
	}
	
	public function setEndPos(param:Vector2):void
	{
		endPos = new Vector2(param.x, param.y);
	}
	
	public function initAnimPos(cur:Vector2, disire:Vector2):void
	{
		m_CurPos = new Vector2(cur.x, cur.y);
		m_DesirePos = new Vector2(disire.x, disire.y);
	}
	
//	private function rotateBG(bgrect:Rect):Matrix4x4
//	{
//
//		return null;			
//	}
	
	public function Draw()
	{
		switch(curState)
		{
			case UpdateState.normal:
				NormalDraw();
				break;
			
			case UpdateState.outImmediate:
				rect.x = 1000;
				showbg = false;
				showNextBtn = false;
				NormalDraw();
				break;
				
			case UpdateState.inImmediate:
				rect.x = endPos.x;
				rect.y = endPos.y;
				showbg = true;
				NormalDraw();
				curState = UpdateState.normal;
				break;
				
			case UpdateState.inToLeft:
				m_DesirePos.x -= Time.deltaTime * Mathf.Abs(2700);
				m_DesirePos.x = Mathf.Clamp(m_DesirePos.x, -1000, 1000);
				m_CurPos.x = Mathf.Lerp(m_CurPos.x, m_DesirePos.x, Time.deltaTime * 2.0f);
				rect.x = m_CurPos.x; 
				if(m_CurPos.x < endPos.x)
					 rect.x = endPos.x; 
				FadeInDraw();
				break;
				
			case UpdateState.inToRight:
				m_DesirePos.x += Time.deltaTime * Mathf.Abs(2700);
				m_DesirePos.x = Mathf.Clamp(m_DesirePos.x, -1000, 1000);
				m_CurPos.x = Mathf.Lerp(m_CurPos.x, m_DesirePos.x, Time.deltaTime * 2.0f);
				rect.x = m_CurPos.x; 
				if(m_CurPos.x > endPos.x)
					 rect.x = endPos.x; 
				FadeInDraw();
				break;
				
			case UpdateState.fadeOut:
				m_alphaPer += 2.4*Time.deltaTime;
				var oldAlpha:float = GUI.color.a;
				GUI.color.a = (1 - m_alphaPer);
				NormalDraw();
				GUI.color.a = oldAlpha;
				if(m_alphaPer >= 1)
				{ 
					curState = UpdateState.wait;
					Invoke("changeStateToOutImm",0.1f);	
				}
				break;
			
			case UpdateState.fadeIn:
				break;
			
			case UpdateState.wait:
				break;
			
			default:
				break;
		}
		
	}
	
	private function changeStateToOutImm():void
	{
		curState = UpdateState.outImmediate;
	}
	
	private function NormalDraw():void
	{
		if(!visible)
			return;
		super.Draw();
		if(showbg)
		{ 
			if(BG.rect.y > 600) //me
			{
				oldMatrix = GUI.matrix;
				var point:Vector2 = new Vector2(BG.rect.x+ BG.rect.width * 0.5, BG.rect.y + BG.rect.height * 0.5);
				var newPoint:Vector2 = GUIUtility.GUIToScreenPoint(point);
		
				var zeroPoint : Vector2 = GUIUtility.GUIToScreenPoint(Vector2.zero);
				newPoint -= zeroPoint;
				zeroPoint = oldMatrix * new Vector4(zeroPoint.x, zeroPoint.y, 0.0, 1.0);
				newPoint += zeroPoint;
		//			var currotation:Quaternion = Quaternion.Euler(0, 0, targetrotation);
				var tempMatrix:Matrix4x4 = 	Matrix4x4.TRS (newPoint, Quaternion.Euler (0f, 180, 0f), Vector3.one) * Matrix4x4.TRS (-newPoint, Quaternion.identity, Vector3.one);
				GUI.matrix = tempMatrix * oldMatrix;
				BG.Draw();
				GUI.matrix = oldMatrix;
			} 
			else
			{
				 BG.Draw();
			}
//			LightBox.Draw();
			BGFrame.Draw();
//			LightBox.Draw();
			Conversation.Draw();
		}
		
		GUI.BeginGroup(rect);
		if(avatarType == 1)
			avatar.Draw();
		else
			DrawTex(avatar, avatar.rect,tex,Rect(2,0,tex.width - 2 ,tex.height -2));
		NameLable.Draw();
		GUI.EndGroup();
		if(showNextBtn)
		{
			nextButton.Draw();
		}
	}
	
	private static function DrawTex(lb : Label, des:Rect,texture:Texture2D,textureRect:Rect):int
	{
		if( !lb.visible || !lb.IsPaint()) return -1;
		if(texture == null) return -1;
		if(textureRect == null || textureRect == "") return -1;
		var oldAlpha : float = GUI.color.a;
		if(lb.alphaEnable)
			GUI.color.a = lb.alpha;
		
		var source:Rect;
		source.width = textureRect.width / texture.width;
		source.height = textureRect.height / texture.height;
		source.x = textureRect.x /texture.width;
		source.y = textureRect.y /texture.height;
		
		Graphics.DrawTexture(des,texture,source,0,0,0,0,null);
		GUI.color.a = oldAlpha;
		return 1;
	}

	private function FadeInDraw():void
	{
		if(!visible)
			return;
		super.Draw();

		var oldAlpha:float = GUI.color.a;
		
		m_alphaPer += 3.6*Time.deltaTime; 
		
		if(m_alphaPer > 2.6)
			GUI.color.a = m_alphaPer - 2.6;
		else
			GUI.color.a = 0;
			
//		if(m_alphaPer > 3.6) 
//		{
//			GUI.color.a = 1; 
//		}
		if(GUI.color.a >= 1) GUI.color.a = 1;
//		Debug.Log("GUI.color.a = "+GUI.color.a);
//		Debug.Log("m_alphaPer = "+m_alphaPer);
		if(BG.rect.y > 600) //me
		{
			oldMatrix = GUI.matrix;
			var point:Vector2 = new Vector2(BG.rect.x+ BG.rect.width * 0.5, BG.rect.y + BG.rect.height * 0.5);
			var newPoint:Vector2 = GUIUtility.GUIToScreenPoint(point);
	
			var zeroPoint : Vector2 = GUIUtility.GUIToScreenPoint(Vector2.zero);
			newPoint -= zeroPoint;
			zeroPoint = oldMatrix * new Vector4(zeroPoint.x, zeroPoint.y, 0.0, 1.0);
			newPoint += zeroPoint;
	//			var currotation:Quaternion = Quaternion.Euler(0, 0, targetrotation);
			var tempMatrix:Matrix4x4 = 	Matrix4x4.TRS (newPoint, Quaternion.Euler (0f, 180, 0f), Vector3.one) * Matrix4x4.TRS (-newPoint, Quaternion.identity, Vector3.one);
			GUI.matrix = tempMatrix * oldMatrix;
			BG.Draw();
			GUI.matrix = oldMatrix;
		} 
		else
		{
			 BG.Draw();
		}
		BGFrame.Draw();
//		LightBox.Draw();
		GUI.color.a = oldAlpha;
		
		GUI.BeginGroup(rect);
			//avatar.Draw();
			if(avatarType == 1)
				avatar.Draw();
			else
				DrawTex(avatar, avatar.rect,tex,Rect(2,0,tex.width - 2 ,tex.height -2));
			NameLable.Draw();
		GUI.EndGroup();
		
		
		if(m_alphaPer > 3.6 && rect.x == endPos.x)
		{
			showbg = true;
			curState = UpdateState.normal;
		}
	}
	
	public function setNextButton(btn:SimpleButton):void
	{
		this.nextButton = btn;
		nextButton.SetVisible(false);
		
		btn.rect.x = NameLable.rect.x + NameLable.rect.width - btn.rect.width + 10;
		btn.rect.y = BG.rect.y + BG.rect.height - btn.rect.height - 20;
		
		if((nextButton as FTENPCNextButton))
			(nextButton as FTENPCNextButton).setshakeTime(0.5);
	}
	
	public function Update():void
	{
		if(nextButton)
			nextButton.Update();
		if(Conversation)
			Conversation.Update();
	}
	
	public function SetDisable(param:boolean):void
	{
		btnDefault.SetVisible(param);
		if(nextButton)
			nextButton.SetVisible(param);
	}
	
	public function Setshowbg(param:boolean):void
	{
		showbg = param;
	}
	
	public function SetshowNextBtn(param:boolean):void
	{
		showNextBtn = param;
	}
	
	public function startTyping():void
	{
		Conversation.startTyping();
	}
	
	public function endTyping():void
	{
		if(!Conversation.canEndType)
			return;
		Conversation.endTyping();
		btnDefault.OnClick = gotoNext;
		SetshowNextBtn(true);
		//nextButton.rect.x = Conversation.rect.x + Conversation.rect.width - nextButton.rect.width+60;
//		nextButton.rect.x = Conversation.rect.x + Conversation.rect.width - nextButton.rect.width-50;
//		nextButton.rect.y = BG.rect.y + BG.rect.height - nextButton.rect.height - 10;
		nextButton.rect = nextBtnRect;
	}
	
	private function onEndTyping():void
	{
		btnDefault.OnClick = gotoNext;
		SetshowNextBtn(true);
		//nextButton.rect.x = Conversation.rect.x + Conversation.rect.width - nextButton.rect.width+60;
//		nextButton.rect.x = Conversation.rect.x + Conversation.rect.width - nextButton.rect.width-50;
//		nextButton.rect.y = BG.rect.y + BG.rect.height - nextButton.rect.height - 10;
		nextButton.rect = nextBtnRect;
	}
		
	protected function func_linear(fx:float,tx:float,percent:float):float
	{
		return fx * (1 - percent) + tx * percent;		
	}
	
	public function getData():KBN.DataTable.PveStory
	{
		return storyData;
	}
}