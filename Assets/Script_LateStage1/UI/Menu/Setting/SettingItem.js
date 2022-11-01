
class SettingItem extends FullClickItem
{
//	var line:SimpleLabel;
	@HideInInspector public var ManualSized:boolean = false;
	
	function Awake () 
	{
		super.Awake();
		ManualSized = false;
	}
	
	function Init():void
	{
		if (!ManualSized)
		{
			line.rect = new Rect(-3, 66, 500, 4);
			title.SetNormalTxtColor(FontColor.Milk_White);
			title.rect = new Rect(35, 0, 400, 70);
			btnSelect.rect = new Rect(455, 13, 43, 43);
			rect.x = 0;
			rect.width = 540;
			rect.height = 70;
			btnDefault.rect = new Rect(4, 0, 505, 70);
		}
	}

	function Draw()
	{
		if( !isVisible() ){
			return;
		}
		
		GUI.BeginGroup(rect);
		if(description)
		{
			description.Draw();
		}
		DrawDefaultBtn();
		title.Draw();
		btnSelect.Draw();
		line.Draw();
		GUI.EndGroup();
	}
	
	function SetClickFunc(clickFunc:Function)
	{
		btnSelect.OnClick = function(obj:Object)
		{
			clickFunc(obj);
		};

		btnDefault.OnClick = function(obj:Object)
		{
			clickFunc(obj);
		};
	}
}

