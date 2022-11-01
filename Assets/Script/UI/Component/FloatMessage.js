class FloatMessage extends SimpleUIObj
{
	private	var	showing:boolean;
	private	var	showImage:boolean;
	private var remainTime:float;
	private var startPos:Rect;
	private var endPos:Rect;
	private var speed:int = 15;
	private var minHeight:int = 160;
	private var margin:int = 10;
	@SerializeField private var image:Label;
	@SerializeField private var questCompleteImage:Label;
	private var showQuestCompleteImage:boolean = false;
	private var txtRect:Rect;

	public var OnStartShow:Function;
	public var OnFinishShow:Function;
		
	
	function FixedUpdate()
	{
		if( !showing ){
			return;
		}
		
		if( remainTime > 0 )
		{
			if( rect.y > endPos.y ){
				rect.y -= speed;
				if(rect.y < endPos.y){
					rect.y = endPos.y;
				}
			}else if( rect.y < endPos.y ){
				rect.y += speed;
				if(rect.y > endPos.y){
					rect.y = endPos.y;
				}
			}
		}
		else if(remainTime <= 0)
		{
			if( rect.y > startPos.y ){
				rect.y -= speed;
				if(rect.y < startPos.y){
					rect.y = startPos.y;
					showing = false;
				}
			}else if( rect.y < startPos.y ){
				rect.y += speed;
				if(rect.y > startPos.y){
					rect.y = startPos.y;
					showing = false;
				}
			}else{
				showing = false;
			}
			if(OnFinishShow != null)
				OnFinishShow();			
		}
	}
	
	function Update()
	{
		if(remainTime <= 0)
			return;
		
		if( rect.y == endPos.y ){
			remainTime -= Time.deltaTime;
		}
	}
	
	function Draw()
	{
		if( !showing ){
			showQuestCompleteImage = false;
			return;
		}
//		 FontMgr.SetStyleFont(mystyle, font,FontType.TREBUC);
		// SetFont();
		// SetNormalTxtColor();		
		var oldColor:Color = GUI.color;
		GUI.color = new Color(1, 1, 1, 0.6);	
		GUI.DrawTexture(rect, background);
		GUI.color = oldColor;
		GUI.BeginGroup(rect);
		GUI.Label(txtRect, txt, mystyle);	
		if(showImage && null != image)
			image.Draw();
		if(showQuestCompleteImage && null != questCompleteImage)
			questCompleteImage.Draw();
		GUI.EndGroup();	
	}
	
	function StartShow( msg:String, position:Rect, showTime:float)
	{
//		var startPosition:Rect = Rect(position.x,MenuMgr.SCREEN_HEIGHT, position.width, position.height);
//		StartShow( msg, startPosition, position, showTime, true );
		StartShow( msg, position, showTime, true);
		
	}
	
	function StartShow( msg:String, position:Rect, showTime:float, showImage:boolean)
	{
		var startPosition:Rect = Rect(position.x,MenuMgr.SCREEN_HEIGHT, position.width, position.height);
		StartShow( msg, startPosition, position, showTime, showImage, true );
		
	}
	
	function StartShow( msg:String, startPosition:Rect, endPosition:Rect, showTime:float, showImage:boolean, withSound:boolean)
	{
		image.useTile = true;
		var tile:Tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_toaster");
		image.rect.width = tile.rect.width;
		image.rect.height = tile.rect.height;
		image.rect.x = margin;
		image.tile = tile;
		
		var txtMargin:int = 15;
		var txtWidth:int;
		if(showImage)
		{
			txtWidth = startPosition.width - 2 * txtMargin - image.rect.width;
		}
		else
		{
			txtWidth = startPosition.width - 2 * txtMargin;
		}
		
		SetFont(FontSize.Font_22, FontType.TREBUC); 
		SetNormalTxtColor(FontColor.Milk_White);	
		
		var txtHeight:int = mystyle.CalcHeight( GUIContent(msg, null, null) ,txtWidth); 
		if (txtHeight > (mystyle.lineHeight + 0.01f))
		{
			mystyle.alignment = TextAnchor.MiddleLeft;
		}
		else
		{
			mystyle.alignment = TextAnchor.MiddleCenter;
		}
		
		var moveDown:boolean = startPosition.y < endPosition.y;
		if(txtHeight > 160 - 2*margin)
		{
			var newHeight:int = txtHeight + 2*margin;
			if(moveDown)
			{
				endPosition.y += newHeight - startPosition.height;
				startPosition.height = newHeight;
				endPosition.height = startPosition.height;
			}
			else
			{
				endPosition.y -= newHeight - endPosition.height;
				startPosition.y -= newHeight - startPosition.height;
				startPosition.height = newHeight;
				endPosition.height += newHeight - endPosition.height;
			}
		}
		
		rect = startPosition;
		txtRect = new Rect(rect.width - txtWidth - txtMargin, 0, txtWidth, rect.height);
		
		remainTime = showTime;
//		rect = startPosition;
		startPos = startPosition;
		endPos = endPosition;
		txt = msg;
		this.showImage = showImage;

		image.rect.y = (rect.height - image.rect.height)/2;
		showing = true;
		if( withSound ){
			SoundMgr.instance().PlayEffect( "toast", /*TextureType.AUDIO*/"Audio/" );
		}
		if(OnStartShow != null)
			OnStartShow();		
		
	}
	
	private function priv_startShow(msg:String, startPosition:Rect, endPosition:Rect, showTime : float, withSound:boolean)
	{
		SetFont(FontSize.Font_22, FontType.TREBUC); 
		SetNormalTxtColor(FontColor.Milk_White);	
		
		mystyle.alignment = TextAnchor.MiddleLeft;
        var guiContent : GUIContent = new GUIContent(msg, null, null);
		var txtSize:Vector2 = mystyle.CalcSize(guiContent);
		var txtWidth:float = Mathf.Min(txtSize.x, rect.xMax - image.rect.width - image.rect.x - 2 * margin);
		var txtHeight:float = txtWidth < txtSize.y ? mystyle.CalcHeight(guiContent, txtWidth) : txtSize.y;
		var txtPosX:float = image.rect.width + (rect.width - image.rect.width) / 2 - txtWidth / 2 + 16;
		
		var moveDown:boolean = startPosition.y < endPosition.y;
		if(txtHeight > 160 - 2*margin)
		{
			var newHeight:int = txtHeight + 2*margin;
			if(moveDown)
			{
				endPosition.y += newHeight - startPosition.height;
				startPosition.height = newHeight;
				endPosition.height = startPosition.height;
			}
			else
			{
				endPosition.y -= newHeight - endPosition.height;
				startPosition.y -= newHeight - startPosition.height;
				startPosition.height = newHeight;
				endPosition.height += newHeight - endPosition.height;
			}
		}
		
		rect = startPosition;
		txtRect = new Rect(txtPosX, 0, txtWidth, rect.height);
		
		remainTime = showTime;
		startPos = startPosition;
		endPos = endPosition;
		txt = msg;
		this.showImage = true;
		
		image.rect.y = (rect.height - image.rect.height)/2;
		showing = true;
        if (withSound)
        {
		    SoundMgr.instance().PlayEffect( "toast", /*TextureType.AUDIO*/"Audio/" );
        }
		if(OnStartShow != null)
			OnStartShow();
	}
	
    public function StartShowForDailyQuestReward(msg : String, endPosition : Rect, quest : DailyQuestDataAbstract)
    {
        quest.PopulateImageInfo(image);
        priv_startShowForGenericQuestReward(msg, endPosition);
    }
    
	public function StartShowForQuestReward(msg:String, endPosition:Rect, questId:int)
	{
        Quests.instance().SetQuestTexture(image, questId, true);
        priv_startShowForGenericQuestReward(msg, endPosition);
    }
    
    private function priv_startShowForGenericQuestReward(msg : String, endPosition : Rect)
    {
		var startPosition:Rect = Rect(endPosition.x,MenuMgr.SCREEN_HEIGHT, endPosition.width, endPosition.height);

		image.rect.x = margin + 20;
		
		priv_startShow(msg, startPosition, endPosition, 3.0f, true);
		
		if (null != questCompleteImage) {
			questCompleteImage.mystyle.normal.background = 
				TextureMgr.instance().LoadTexture("Quest_Completed", TextureType.DECORATION);
			questCompleteImage.rect.x = image.rect.x - 20;
			questCompleteImage.rect.width = image.rect.width + 40;
			questCompleteImage.rect.height = 36;
			questCompleteImage.rect.y = image.rect.y + image.rect.height - questCompleteImage.rect.height;
			showQuestCompleteImage = true;
		}
	}
	
    public function StartShowWithImage(msg:String, endPosition:Rect, tile:Tile)
    {
        StartShowWithImage(msg, endPosition, tile, 2f, true);
    }
    
	public function StartShowWithImage(msg:String, endPosition:Rect, tile:Tile, showTime:float, withSound:boolean)
	{
		var startPosition:Rect = Rect(endPosition.x,MenuMgr.SCREEN_HEIGHT, endPosition.width, endPosition.height);
        StartShowWithImage(msg, startPosition, endPosition, tile, showTime, withSound);
    }

    public function StartShowWithImage(msg:String, startPosition:Rect, endPosition:Rect,
        tile:Tile, showTime:float, withSound:boolean)
    {
		image.mystyle.normal.background = null;
		image.useTile = true;
		image.tile = tile;
		image.rect.width = tile.rect.width;
		image.rect.height = tile.rect.height;
		image.rect.x = margin + 20;
		
		priv_startShow(msg, startPosition, endPosition, showTime, withSound);
	}
	
	public	function	forceFinish(){
//		showing = false;
		remainTime = 0;
	}
	
	public	function	setMessage(msg:String){
		txt = msg;
	}

}
