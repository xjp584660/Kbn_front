#pragma strict

class NewFteDialog extends UIObject
{
	public enum Layout
	{
		Top,
		TopCenter,
		Center,
		BottomCenter,
		Bottom,
	}
	
	public var backgroundLabel:Label;
	public var frameLabel:Label;
	
	public var guiderAvatar:Label;
	
	public var guiderTitleBG:Label;
	public var guiderTitle:Label;
	
	public var guiderContent:Label;
	
	public var nextTextPageBtn:Button;
	public var prevTextPageBtn:Button;
	public var bgEventBtn:Button;
	
	public var layout:Layout = Layout.Top;
	public var posScale:float = 0.1f;
	
	private var layoutHeights:float[];
	
	//-----------------------------------------------------
	public var OnDoneDelegate:Function;
	
	//-----------------------------------------------------\
	private final var showCountPerSecond:int = 20;
	private var isTextAnimPlaying:boolean = false;
	
	private var textPageIndex:int = 0;
	private var allContentText:String = String.Empty;
	private var showContentText:String = String.Empty;
	
	private var currTextIndex:int = 0;
	private var textTiming:float = 0;
	
	//-----------------------------------------------------	
	public override function Init()
	{
		super.Init();
		
		RegisterGUIEvents();
		InitVariables();
		
		prevTextPageBtn.SetVisible(false);
	}
	
	private function InitVariables()
	{
		textPageIndex = 0;
		
		allContentText = String.Empty;
		showContentText = String.Empty;
		
		if (null == layoutHeights || layoutHeights.Length != 5)
		{
			layoutHeights = new float[5];
			layoutHeights[0] = 0.1f;
			layoutHeights[1] = 0.2f;
			layoutHeights[2] = 0.4f;
			layoutHeights[3] = 0.5f;
			layoutHeights[4] = 0.7f;
		}
	} 
	
	private function RegisterGUIEvents()
	{
		nextTextPageBtn.OnClick = OnClickNextPageBtn;
		prevTextPageBtn.OnClick = OnClickPrevPageBtn;
		
		bgEventBtn.OnClick = OnClickBGEventBtn;
	}
	
	public override function Draw()
	{
		if (!super.visible)
			return;
			
		GUI.BeginGroup(super.rect);
		
		backgroundLabel.Draw();
		frameLabel.Draw();
		
		guiderAvatar.Draw();
		// guiderTitleBG.Draw();
		// guiderTitle.Draw();
		
		guiderContent.Draw();
		nextTextPageBtn.Draw();
		prevTextPageBtn.Draw();
		
		bgEventBtn.Draw();
		
		GUI.EndGroup();
	}
	
	public override function Update()
	{
		if (!super.visible) 
			return;
		
		if (Application.isEditor)
		{
			switch (layout)
			{
				case Layout.Top:
					layoutHeights[0] = posScale;
				break;
				case Layout.TopCenter:
					layoutHeights[1] = posScale;
				break;
				case Layout.Center:
					layoutHeights[2] = posScale;
				break;
				case Layout.BottomCenter:
					layoutHeights[3] = posScale;
				break;
				case Layout.Bottom:
					layoutHeights[4] = posScale;
				break;
			}
			
			super.rect.y = posScale * MenuMgr.SCREEN_HEIGHT;
		}
	
		if (NewFteDisplayMgr.IsTouched() && !String.IsNullOrEmpty(allContentText))
		{
			if (currTextIndex < allContentText.Length)
				SkipTextAdvancedAnim();
			else
			{
				// Do the end event
				OnClickBGEventBtn();
			}
		}
		
		// Text advanced animation
		if (isTextAnimPlaying)
		{
			if (!String.IsNullOrEmpty(allContentText) 
				&& currTextIndex < allContentText.Length)
			{
				textTiming += Time.deltaTime;
				currTextIndex = textTiming * showCountPerSecond;
				if (currTextIndex >= allContentText.Length)
				{
					currTextIndex = allContentText.Length;
					TextAdvancedAnimEnd();
				}
				
				showContentText = allContentText.Substring(0, currTextIndex);
				guiderContent.txt = showContentText;
			}
		}
	}
	
	public function set Data(value:Object)
	{
		if (null == value) return;
		
		nextTextPageBtn.SetVisible(false);
		
		guiderTitle.txt = "";
		guiderContent.txt = "";
		
		var data:NewFteDisplayData = value as NewFteDisplayData;
		
		SetLayout(data.dialogLayout);
		SetNpcAvatar(data.dialogAvatar);
		SetDialogueContent(data.dialogContent);
		
		StartTextAdvancedAnim();
	}
	
	private function SetLayout(layoutString:String)
	{
		switch (layoutString)
		{
			case NewFteConstants.GUILayout.Top:
				super.rect.y = layoutHeights[0] * MenuMgr.SCREEN_HEIGHT;
			break;
			
			case NewFteConstants.GUILayout.TopCenter:
				super.rect.y = layoutHeights[1] * MenuMgr.SCREEN_HEIGHT;
			break;
			
			case NewFteConstants.GUILayout.Center:
				super.rect.y = layoutHeights[2] * MenuMgr.SCREEN_HEIGHT;
			break;
			
			case NewFteConstants.GUILayout.BottomCenter:
				super.rect.y = layoutHeights[3] * MenuMgr.SCREEN_HEIGHT;
			break;
			
			case NewFteConstants.GUILayout.Bottom:
				super.rect.y = layoutHeights[4] * MenuMgr.SCREEN_HEIGHT;
			break;
		}
	}
	
	private function SetNpcAvatar(layoutString:String)
	{
		guiderAvatar.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_Morgause", TextureType.FTE);
		// switch(evo.getString("npcPath"))
		// {
		// 	case "character_Morgause":
		// 			npcw = 425;
		// 			npch = 328;
		// 		break;
		// 	case "character_Arthur2":
		// 			npcw = 425;
		// 			npch = 628;
		// 		break;
		// }
	}
	
	private function SetDialogueContent(content:String)
	{
		allContentText = content;
	}
	
	private function OnClickNextPageBtn()
	{
		guiderTitle.txt = "";
		guiderContent.txt = "";
		
		if (null != OnDoneDelegate)
		{
			OnDoneDelegate();
		}
	}
	
	private function OnClickPrevPageBtn()
	{}
	
	private function OnClickBGEventBtn()
	{
		if (null != OnDoneDelegate)
		{
			OnDoneDelegate();
		}
	}
	
	private function CalculateTextPage()
	{
	
	}
	
	public function StartTextAdvancedAnim()
	{
		currTextIndex = 0;
		textPageIndex = 0;
		textTiming = 0;
		
		isTextAnimPlaying = true;
	}
	
	public function SkipTextAdvancedAnim()
	{
		currTextIndex = allContentText.Length;
		showContentText = allContentText.Substring(0, currTextIndex);
		guiderContent.txt = showContentText;
				
		TextAdvancedAnimEnd();
	}
	
	private function TextAdvancedAnimEnd()
	{
		isTextAnimPlaying = false;
		nextTextPageBtn.SetVisible(true);
	}
}