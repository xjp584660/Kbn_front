
public class CreatBuildingItem extends FullClickItem
{
	public var l_img		:Label;
	public var l_title 		:Label;
	public var l_description:Label;
	public var btn_right	:Button;
	
	public var line_texture :Texture2D;
	
//	public var area_Btn:SimpleButton;	
	public var sl_lock :SimpleLabel;

	protected var f_right_callBack:Function;
	protected var buildingInfo:Building.BuildingInfo;
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		DrawDefaultBtn();
		
		l_img.Draw();
		sl_lock.Draw();
		l_title.Draw();
		l_description.Draw();
		
//		area_Btn.Draw();
		btn_right.Draw();		
				
		line.Draw();
//		this.drawTexture(line_texture,0,118);

		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object)
	{
		buildingInfo = data as Building.BuildingInfo;
		l_title.SetFont(FontSize.Font_20,FontType.TREBUC);
		l_title.txt = buildingInfo.buildName;
		l_description.txt = buildingInfo.curLevel_description;
		Init();
		
		f_right_callBack = buildingInfo.callBack as Function;
		btnDefault.OnClick = onClick;
		btn_right.OnClick = onClick;	
		//
	//	var texture:Texture2D = TextureMgr.instance().LoadTexture(data.buildingTexturePath, TextureType.ICON_BUILDING);//Resources.Load(data.buildingTexturePath);
	//	if(texture)
	//		l_img.mystyle.normal.background = texture;
		l_img.useTile = true;
		l_img.tile = TextureMgr.instance().BuildingSpt().GetTile(buildingInfo.buildingTexturePath);
		//l_img.tile.name = buildingInfo.buildingTexturePath;
		
		sl_lock.SetVisible(!(buildingInfo.req_ok || Utility.instance().checkInstantRequire(buildingInfo.requirements)));
		
	}
	
	public function SetScrollPos(pos:int, listHeight:int)
	{
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
	
	protected function  onClick(param:Object):void
	{
		if(f_right_callBack != null)
		{
			f_right_callBack(buildingInfo);
		}		
	}
}
