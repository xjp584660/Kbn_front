
public class StarLevel : UIObject
{
	private int level;
	public Label back;
	public Label num;
	
	public int Level
	{
		get
		{
			return level;
		}
		set
		{
			level = value;
			LoadLevel(level);
		}
	}

	private void LoadLevel(int l)
	{
		if(l < 0 ) return;
		if(l == 0) 
		{
			//back.mystyle.normal.background = TextureMgr.instance().LoadTexture("Star_Medalno",TextureType.GEAR);	
			back = GearManager.Instance().SetImage(back,"Star_Medalno");
			num = GearManager.Instance().SetImageNull(num);	
		//	num.mystyle.normal.background = null;
		}
		else if(l >= 1 && l <= 4)
		{
		//	back.mystyle.normal.background = TextureMgr.instance().LoadTexture("Star_Medal",TextureType.GEAR);
			back = GearManager.Instance().SetImage(back,"Star_Medal");	
		//	num.mystyle.normal.background = TextureMgr.instance().LoadTexture("Star_Medalno"+l,TextureType.GEAR);	
			num = GearManager.Instance().SetImage(num,"Star_Medalno"+l);	
		}
	}
	
	
	public override void OnPopOver()
	{
		back.OnPopOver();
		num.OnPopOver();
		UIObject.TryDestroy(this);
	}
	public override int Draw()
	{
		if(!visible) return -1;
		UnityEngine.GUI.BeginGroup(rect);
		back.Draw();
		num.Draw();
		UnityEngine.GUI.EndGroup();
		return 0;
	}
	


}
