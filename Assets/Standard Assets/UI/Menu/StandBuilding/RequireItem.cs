using UnityEngine;

using Resource = KBN.Resource;

public class RequireItem : ListItem
{
	public Label l_need;
	public ComposedUIObj il_require;
	public ComposedUIObj il_have;
	public Label l_star1;
	public Label l_star2;
	public Label l_star3;
	public Label l_ownstar1;
	public Label l_ownstar2;
	public Label l_ownstar3;
	public Label l_ownstar4;
	public Label l_line;
	public string framebackGround;
	
    public FontColor defaultColor = FontColor.Description_Dark;

	public Label l_frame;

	public int NEED_X = 245;
	private static int OWN_X = 70;
	private static int ICON_X = 30;
	private static int STAR_WIDTH = 25;
	private static int STAR_OFFSET = 14;
	private static Color NEED_COLOR_NORMAL = new Color(0.882f, 0.769f, 0.58f, 1.0f);
	private static Color NEED_COLOR_SALE = new Color(0.0f, 1.0f, 0.0f, 1.0f);
	public bool isTech = false;

	public void Start()
	{
		//l_need.show = true;
		il_require.show = true;
		il_have.show = true;
	}
	
	public override void Init()
	{
		il_require.show = true;
		il_have.show = true;

		if (l_line != null) 
		{
			l_line.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("between line_list_small", TextureType.DECORATION);
		}
		l_star1.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star2.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star3.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_ownstar1.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_ownstar2.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_ownstar3.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_star1.SetVisible(false);
		l_star2.SetVisible(false);
		l_star3.SetVisible(false);
		l_ownstar1.SetVisible(false);
		l_ownstar2.SetVisible(false);
		l_ownstar3.SetVisible(false);
	}
	
	public override int Draw()
	{
		//if(!visible)
			//return;
		GUI.BeginGroup(rect);		
		
		il_require.show = true;
		il_have.show = true;

		if(l_frame != null)
		{
			l_frame.Draw ();		
		}
		if (l_line != null) 
		{
			l_line.Draw();
		}
		l_need.Draw();
		il_require.Draw();
		il_have.Draw();		
		l_star1.Draw();
		l_star2.Draw();
		l_star3.Draw();

		GUI.EndGroup();

		return -1;
	}
	public override void SetIndexInList(int index)
	{
		if(l_frame==null) return;
		if(index % 2 == 0)
		{
			if(string.IsNullOrEmpty(framebackGround)||framebackGround == " ")
			{
				framebackGround = "rank_single_background";
				l_frame.setBackground(framebackGround, TextureType.FTE);
				l_frame.SetVisible(true);
			}
			else
			{
				l_frame.setBackground(framebackGround, TextureType.DECORATION);
				l_frame.SetVisible(true);
			}
		}
		else
		{
			l_frame.SetVisible(false);
			//lblBackGround.setBackground("rank_double_background", TextureType.FTE);
		}
	}
	public override void SetRowData(object obj)
	{		
		if(null == obj)
			return;

		Label l_own = il_have.getChildByID("l_description") as Label;
		Label l_type = il_require.getChildByID("l_description") as Label;
		if (isTech) {
			l_need.SetNormalTxtColor(FontColor.New_Level_Yellow);
			l_own.SetNormalTxtColor(FontColor.New_Level_Yellow);
			l_type.SetNormalTxtColor(FontColor.New_Level_Yellow);
		} else {
			l_need.SetNormalTxtColor(defaultColor);
			l_own.SetNormalTxtColor(defaultColor);
			l_type.SetNormalTxtColor(defaultColor);
		}

		Requirement requirement = obj as Requirement ;
		if(requirement.type == "11111")
		{
			Label l_txt = il_require.getChildByID("l_description") as Label;			
			l_txt.txt = requirement.required;
			l_txt.SetNormalTxtColor(FontColor._RedOrange2_);

			l_own.SetVisible(false);
			l_need.SetVisible(false);
			Label l_own_icon = il_have.getChildByID("l_icon") as Label;
			l_own_icon.SetVisible(false);
			Label l_type_icon = il_require.getChildByID("l_icon") as Label;
			l_type_icon.SetVisible(false);
			l_txt.rect.x = 35;
			return;
		}
		else
		{
			l_own.SetVisible(true);
			l_need.SetVisible(true);
			Label l_own_icon = il_have.getChildByID("l_icon") as Label;
			l_own_icon.SetVisible(true);
			Label l_type_icon = il_require.getChildByID("l_icon") as Label;
			l_type_icon.SetVisible(true);
		}
		Texture2D texture;
		
	  	if(requirement.ok )
	  		texture = TextureMgr.instance().LoadTexture("icon_satisfactory",TextureType.ICON);
	  	else
	  		texture = TextureMgr.instance().LoadTexture("icon_unsatisfactory",TextureType.ICON);	
	  			  				  				  		
		this.setIconAndLabel(il_have,requirement.own,texture);		
		l_need.txt = requirement.required;
		
		if(requirement.bSale)
		{
			l_need.mystyle.normal.textColor = NEED_COLOR_SALE;
		}
		
		texture = Resource.getResourceTexure(requirement.typeId);
		
		this.setIconAndLabel(il_require,requirement.type,texture);
		
		
		SetPrestigeComponent(requirement.reqPrestige,requirement.ownPrestige);
		
		if(! requirement.ok )
		{
			if (isTech) {
				l_need.SetNormalTxtColor(FontColor._RedOrange2_);
				l_own.SetNormalTxtColor(FontColor._RedOrange2_);
				l_type.SetNormalTxtColor(FontColor._RedOrange2_);
			} else {
				l_need.SetNormalTxtColor(FontColor.Red);
				l_own.SetNormalTxtColor(FontColor.Red);
				l_type.SetNormalTxtColor(FontColor.Red);
			}
		}
		
	}

	protected void setIconAndLabel(ComposedUIObj ui,string txt,Texture2D texture)
	{
		Label l_txt = ui.getChildByID("l_description") as Label;
		Label l_icon =  ui.getChildByID("l_icon") as Label;
		
		l_txt.txt = txt;
		if(texture == null)
		{
			l_txt.rect.x = 10;
			l_icon.mystyle.normal.background = texture;
		}
		else
		{
			l_txt.rect.x = l_icon.rect.width + l_icon.rect.x + 5;	//30 + 2* 5;
			l_icon.mystyle.normal.background = texture;
		}
		l_txt.rect.width = ui.rect.width - l_txt.rect.x;
		
//		l_icon.sourceRect = new Rect(0,0,50,50);
	}

	protected void SetPrestigeComponent(int reqPLevel,int ownPLevel)
	{
		l_star1.SetVisible(reqPLevel >= 1);
		l_star2.SetVisible(reqPLevel >= 2);
		l_star3.SetVisible(reqPLevel >= 3);
		l_ownstar1.SetVisible(ownPLevel >= 1);
		l_ownstar2.SetVisible(ownPLevel >= 2);
		l_ownstar3.SetVisible(ownPLevel >= 3);
		if(reqPLevel >=1 )
		{
			l_need.rect.x = NEED_X + (STAR_WIDTH + (reqPLevel-1)*STAR_OFFSET + 5)/2;
			l_star1.rect.x =l_need.rect.x - l_star1.rect.width - 5;
			l_star2.rect.x = l_star1.rect.x - STAR_OFFSET;
			l_star3.rect.x = l_star2.rect.x - STAR_OFFSET;
		}
		else
		{
			l_need.rect.x = NEED_X;
		}
		
		Label l_txt = il_have.getChildByID("l_description") as Label;
		Label l_icon =  il_have.getChildByID("l_icon") as Label;
		l_icon.rect.x = ICON_X;
		if(ownPLevel >= 1)
		{
			l_txt.rect.x = OWN_X + (STAR_WIDTH + (ownPLevel-1)*STAR_OFFSET + 5);
			l_ownstar1.rect.x = l_txt.rect.x - l_star1.rect.width - 5;
			l_ownstar2.rect.x = l_ownstar1.rect.x - STAR_OFFSET;
			l_ownstar3.rect.x = l_ownstar2.rect.x - STAR_OFFSET;
		}
		else
		{
			l_txt.rect.x = OWN_X;
		}
		
	}
	
}