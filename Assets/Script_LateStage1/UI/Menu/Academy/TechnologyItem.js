public class TechnologyItem extends FullClickItem
{

	
	public var l_title : Label;
	public var l_description : Label;
	public var l_img  :Label;
	public var btn_right : Button;
	public var sl_lock :SimpleLabel;
	
//	public var line_texture:Texture2D;
	private var requirements:Array;
	
//	public var f_click_callBack:Function;
	
	public var area_Btn:SimpleButton;
	public var sepLine: Label;
	
	private var tvo:TechVO;
	
	public function Init():void
	{
		super.Init();
		sl_lock.setBackground("icon_lock", TextureType.ICON);	
		if(sepLine.mystyle.normal.background == null)
		{
			sepLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line_list_small",TextureType.DECORATION);
		}
	}
	
	public function Draw()
	{
		super.Draw();
		GUI.BeginGroup(rect);
		
	//	DrawTextureClipped(line_texture, Rect( 0, 0, line_texture.width, line_texture.height ), Rect( 0, 119, line_texture.width, line_texture.height), UIRotation.None);

						
		l_title.Draw();
		l_description.Draw();
		l_img.Draw();
		sl_lock.Draw();
	//	area_Btn.Draw();
		btn_right.Draw();
		sepLine.Draw();		
		
		GUI.EndGroup();
	}
	public function SetRowData(data:Object)
	{	
		this.tvo = data as TechVO;
		this.requirements = Research.instance().getTechnologyRequirements(this.tvo);	
		var currentBuildingLevel:int;
		currentBuildingLevel = Building.instance().getMaxLevelForType(11, GameMain.instance().getCurCityId());	
//		f_click_callBack = tvo.ast_callBack;
		if(tvo.name != Datas.getArString("techName.t6"))
		{
			sl_lock.SetVisible(!(tvo.req_ok || Utility.instance().checkInstantRequire(this.requirements.ToBuiltin(typeof(Requirement)))) && (tvo.level != 10));
		}
		else
		{
			sl_lock.SetVisible(!(tvo.req_ok || Utility.instance().checkInstantRequire(this.requirements.ToBuiltin(typeof(Requirement)))) && (tvo.level != 11));
		}
		if(tvo.name == Datas.getArString("techName.t6")&&tvo.level==10)
		{
			sl_lock.SetVisible(!(currentBuildingLevel == 11));
		}
		btnDefault.OnClick = onClick;
		btn_right.OnClick = onClick;
	//	area_Btn.rect.width = btn_right.rect.x;
	//	area_Btn.rect.height = this.rect.height;
		
		l_title.SetFont(FontSize.Font_20,FontType.TREBUC);
		l_title.txt = tvo.name + " (" + Datas.getArString("Common.Lv") + tvo.level + ")";
		l_description.txt = tvo.description;		
		
		l_img.useTile = true;
		l_img.tile = TextureMgr.instance().ResearchSpt().GetTile(tvo.texturePath);
		//l_img.tile.name = tvo.texturePath;
	//	l_img.mystyle.normal.background = TextureMgr.instance().LoadTexture(tvo.texturePath, TextureType.ICON_RESEARCH);//Resources.Load(tvo.texturePath);
		
	}
	
	protected function onClick(param:Object)
	{
		if(handlerDelegate != null)
		{
			handlerDelegate.handleItemAction(Constant.Action.ACADEMY_TECH_ITEM_NEXT,tvo);
		}
	}
	
	public function SetScrollPos(pos:int, listHeight:int)
	{
//		scrollPos = pos;
		if(l_img)
		{
			if(rect.y - pos < 0 || rect.y+rect.height - pos > listHeight)
			{
				l_img.drawTileByGraphics = false;
			}
			else
				l_img.drawTileByGraphics = true;
			
		}
	}
	
}