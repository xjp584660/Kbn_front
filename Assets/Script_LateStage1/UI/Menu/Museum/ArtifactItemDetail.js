class ArtifactItemDetail extends UIObject
{
	public var lblBg:Label;
	public var lbl_x:Label;
	public var lbl_icon:ItemPic;
	public var btnClaim:Button;
	public var lblDes:Label;
	
	public var piece1:PieceItemDetail;
	public var piece2:PieceItemDetail;
	public var piece3:PieceItemDetail;
	public var piece4:PieceItemDetail;
	public var piece5:PieceItemDetail;
	
	private var pieces:PieceItemDetail[];
	private var data:KBN.Artifact;
	
	public var requireLabel:Label;
	public var piecesBg:Label;
	
	private var topPiece:int;
	private var itemHeight:int = 100;
	
	public function Init()
	{
		super.Init();
		lblBg.Init();
		lbl_x.Init();
		
		requireLabel.Init();
		requireLabel.mystyle.normal.background = TextureMgr.instance().LoadTexture("Brown_Gradients",TextureType.DECORATION);
//		piecesBg.Init();
		
		pieces = [piece1,piece2,piece3,piece4,piece5];
		
		lblBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_blackorg",TextureType.DECORATION);
		lblBg.mystyle.border.left = 16;
		lblBg.mystyle.border.top = 16;
		lblBg.mystyle.border.right =16; 
		lblBg.mystyle.border.bottom = 16;
		
		lbl_icon.rect = new Rect(15,25,110,110);
		lbl_x.rect.y = 100;
		lbl_x.rect.x = 90;
		
		requireLabel.rect = new Rect(0, lbl_icon.rect.y + lbl_icon.rect.height + 10, 580, 30);
		requireLabel.txt = Datas.getArString("Common.Requirement") + "";
		
		topPiece = requireLabel.rect.y + requireLabel.rect.height ;
		
		btnClaim.txt = Datas.getArString("fortuna_gamble.win_claimButton");
		btnClaim.SetFont(FontSize.Font_22, FontType.GEORGIAB);
		btnClaim.SetNormalTxtColor(FontColor.Button_White);
		btnClaim.SetOnNormalTxtColor(FontColor.Button_White);
		
		requireLabel.SetFont(FontSize.Font_20);
		requireLabel.SetNormalTxtColor(FontColor.Button_White);
		
		lblBg.SetFont(FontSize.Font_20);
		lblBg.SetNormalTxtColor(FontColor.Title);
		
		lblDes.SetFont(FontSize.Font_18);
		lblDes.SetNormalTxtColor(FontColor.Description_Dark);		
	}
	
	public function Draw()
	{	
		GUI.BeginGroup(rect);
		lbl_icon.Draw();
		
		lblBg.Draw();
		lbl_x.Draw();
		
//		piecesBg.Draw();
		requireLabel.Draw();;
		if(data != null && data.pieces != null)
		{
			for(var i=0;i<data.pieces.Count;i++)
			{
				pieces[i].Draw();
			}
		}
		lblDes.Draw();
		btnClaim.Draw();
		GUI.EndGroup();	
	}
	
	public function SetData(param:Object)
	{
		data = param as KBN.Artifact;
		Reset();
	}
	
	public function resetArtifactItem():void
	{
		data.resetPieces();
		
		Reset();
	}
	
	public function Reset():void
	{
		for(var i=0;i<pieces.length && i< data.pieces.Count;i++)
		{
			pieces[i].Init();
			pieces[i].rect.y = topPiece + i * itemHeight;
			pieces[i].SetVisible(true);
			pieces[i].SetData(data.pieces[i]);
		}
		
		for(i = pieces.length; i < pieces.length; i++)
		{
			pieces[i].SetVisible(false);
		}
		
		btnClaim.rect.y = topPiece + itemHeight * data.pieces.Count + 15;
		
		lblBg.rect = new Rect(0, 0, 580, btnClaim.rect.y + btnClaim.rect.height + 15);

		this.rect.height = lblBg.rect.height;		
		
		lblBg.txt = Datas.getArString("itemName.i" + data.category);
		lblDes.txt = Datas.getArString("itemDesc.i" + data.category);
		//lbl_icon.tile.name = data.icon;
		//lbl_icon.tile.spt = data.sprite;
		lbl_icon.SetId(data.category);
		if(data && data.CanClaim())
		{
			lbl_x.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_satisfactory",TextureType.ICON);
			btnClaim.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			btnClaim.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
			btnClaim.OnClick = Claim;
			btnClaim.SetDisabled(false);
		}
		else
		{
			lbl_x.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_unsatisfactory",TextureType.ICON);
			btnClaim.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			btnClaim.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			btnClaim.SetDisabled(true);
			
			btnClaim.OnClick = function(){
				/*
				var ok:System.Action = function(){
					data.pieces[0].own +=1;
					pieces[0].SetData(data.pieces[0]);
				};
				Shop.instance.swiftBuy(data.pieces[0].id, ok);
				*/
			};
		}
	}
	public function Update()
	{
	
	}
	public function Claim()
	{
	
		var ok = function(result:HashObject){
			if(result["ok"].Value)
			{
				var itemIdlist:Array =_Global.GetObjectKeys(result["reward"]);
				for(var i=0;i<itemIdlist.length;i++)
				{
					var itemId:int = _Global.INT32(itemIdlist[i]);
					var count:int = _Global.INT32(result["reward"][itemIdlist[i]].Value);
					MyItems.instance().AddItem(itemId,count);
				}
				for(var j=0;j<data.pieces.Count;j++)
				{
					var piece:KBN.Piece = data.pieces[j] as KBN.Piece;
					//piece.own = piece.own - piece.need; 
					MyItems.instance().AddItem(piece.id,(0 - piece.need));
				}
				
				//Reset();
				var museumBuilding:MuseumBuilding = MenuMgr.getInstance().getMenu("MuseumBuilding") as MuseumBuilding;
				if( museumBuilding ){
					museumBuilding.resetArtifacts();
				}
				
				MenuMgr.getInstance().PushMessage(Datas.getArString("Common.actionSucess"));
			}
		};
		
		UnityNet.ClaimArtifact(data.artifactId,ok,null);
		
	}
}
