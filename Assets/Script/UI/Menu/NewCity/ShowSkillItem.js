
class ShowSkillItem extends ListItem
{

	public var l_name:Label;
	public var l_des:Label;
	public var l_bg:Label;

	public function Init()
	{
		l_name.Init();
		l_bg.Init();
		l_des.Init();
	}

	public function Draw()
	{
		GUI.BeginGroup(rect);
		l_bg.Draw();
		l_name.Draw();
		l_des.Draw();
		
		GUI.EndGroup();
	}	
	public function SetRowData(data:Object)
	{
		try
	    {
			var d:Array=_Global.GetObjectValues(data);
			var h:HashObject=data as HashObject;
			l_name.txt=d[2].ToString()==""?h["name"].Value.ToString():d[2].ToString();
			l_des.txt=d[1].ToString()==""?h["des"].Value.ToString():d[1].ToString();
			if (l_name.txt==Datas.getArString("BuffDescription.Pease"))
			{
				l_name.txt=Datas.getArString("Showskill.Des1");
			}
			if (l_name.txt==Datas.getArString("BuffDescription.AntiScout"))
			{
				l_name.txt=Datas.getArString("Showskill.Des2");
			}
			var s:String=d[0].ToString()==""?h["index"].Value.ToString():d[0].ToString();
			if (s=="1")
			{
				l_bg.SetVisible(true);
			}else
			{
				l_bg.SetVisible(false);

			}
		}
	    catch(error:System.Exception)
	    {
	    	_Global.LogWarning("ShowSkillItem : " + error.Message);
			//UnityNet.reportErrorToServer("Cities",null,"Client Exception",error.Message,false);
			return;
	    }
		
	}
}