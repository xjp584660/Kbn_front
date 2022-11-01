class PieceItemDetail extends UIObject
{
	public var lblOwn:SimpleLabel;
	public var lblIcon:ItemPic;
	//public var lblProgressBg:SimpleLabel;
	//public var lblProgress:SimpleLabel;
	public var lblDes:SimpleLabel;
	//public var lblTip:SimpleLabel;
	public var lblName:SimpleLabel;
	public var line:Label;
	public var iconState:Label;
	
	public var satisfied:Texture2D;
	public var unsatisfied:Texture2D;
	
	private var data:KBN.Piece;
	
	public function Init()
	{
		super.Init();
		
		line.Init();
		iconState.Init();
		
		lblOwn.Init();
		lblOwn.SetNormalTxtColor(FontColor.Button_White);
		lblIcon.Init();
		//lblProgressBg.Init();
		//lblProgress.Init();
		lblDes.Init();
		//lblTip.Init();
		lblName.Init();
		this.rect = new Rect(0,this.rect.y,580,100);
		lblName.rect.x = 110;
		lblName.rect.y = 13;
		lblName.rect.width = 300;
		lblName.SetFont(FontSize.Font_20, FontType.TREBUC);
		lblName.SetNormalTxtColor(FontColor.Title);
		
		lblDes.rect.x = 110;
		lblDes.rect.y = 40;
		lblDes.rect.width = 400;		
		lblDes.SetNormalTxtColor(FontColor.Description_Dark);
		
		lblIcon.rect.x = 30;
		lblIcon.rect.y = 13;
		
		iconState.rect.x = 70;
		iconState.rect.y = 50;
		
		lblOwn.rect.x = 260;
		lblOwn.rect.y = 13;
		
		line.rect.y = 96;
		line.rect.width = 560;
		line.rect.height = 4;
		
		this.visible = false;
	}
	
	public function Draw()
	{	
		GUI.BeginGroup(rect);
		
		line.Draw();
		
		//lblTip.Draw();
		lblName.Draw();
		lblDes.Draw();
		//lblProgressBg.Draw();
		//lblProgress.Draw();
		lblOwn.Draw();
		lblIcon.Draw();
		
		iconState.Draw();
		GUI.EndGroup();	
	}

	public function SetData(param:Object)
	{
		if(param)
		{
			this.visible = true;
			data = param as KBN.Piece;
		
			//lblIcon.tile.name = data.icon;
			lblIcon.SetId(data.id);
			
			lblOwn.txt = (Datas.getArString("Common.Owned") as String) + ": " + data.own + "/" + data.need;
			if(data.own < data.need)
			{
				lblOwn.txt = (Datas.getArString("Common.Owned") as String) + ": " + "<color=red>" + data.own + "</color>" + "/" + data.need;
			}
			else
			{
				lblOwn.txt = (Datas.getArString("Common.Owned") as String) + ": " + "<color=white>" + data.own + "</color>" + "/" + data.need;
			}
			
			//lblTip.txt = Datas.getArString("Common.Require") + ":";
			lblName.txt = data.name;
			lblDes.txt = Datas.getArString("itemDesc.i" + data.id);
			
			if(data.own >= data.need)
			{
				//lblProgress.rect.width = lblProgressBg.rect.width - 42;
				
				iconState.mystyle.normal.background = satisfied;
				
			}
			else
			{
				//var w:float = (data.own*1.0/data.need)*(lblProgressBg.rect.width - 42);
				//lblProgress.rect.width = w;
				
				iconState.mystyle.normal.background = unsatisfied;
			}
		}
		else
		{
			this.visible = false;
		}
	}
	public function Update()
	{
	
	}
}