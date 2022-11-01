public class MyCombatStatsItem
{
	
	public var mValue:String;
	
}
public class CombatStatsItem extends ListItem
{
	
	public var mValue : SimpleLabel;
	
	public var mKey : SimpleLabel;
	
	public var mLine : SimpleLabel;
	
		
	var _data :Hashtable = new Hashtable();
	public function SetRowData(obj:Object):void
	{
	
		_data = obj as Hashtable;
			
		if(PlayerProfile.GetInstance().bNum)
		{
		if(null!=_data["lossedMight"])
		{
			mKey.txt =Datas.getArString("MainChrome.lossedMight") + ": ";
			mValue.txt =_Global.NumFormat(_Global.INT64(_data["lossedMight"].ToString()));
		}
		if(null!=_data["kills"])
		{
			mKey.txt =Datas.getArString("MainChrome.Kills_Title") + ": ";
			mValue.txt =_data["kills"].ToString();//_Global.NumFormat(Convert.ToInt64(_data["kills"].ToString()));
		}
		if(null!=_data["combatVicitries"])
		{
			mKey.txt =Datas.getArString("MainChrome.combatVicitries") + ": ";
			mValue.txt = _Global.NumFormat(_Global.INT64(_data["combatVicitries"].ToString()));
		}
		
		if(null!=_data["combatLossers"])
		{
			mKey.txt =Datas.getArString("MainChrome.combatLossers") + ": ";
			mValue.txt =_Global.NumFormat(_Global.INT64(_data["combatLossers"].ToString()));
		}
		
		if(null!=_data["victoryRate"])
		{
			mKey.txt =Datas.getArString("MainChrome.victoryRate") + ": ";
			mValue.txt =_data["victoryRate"]+"%";
		}
		
		if(null!=_data["attackVictories"])
		{
			mKey.txt =Datas.getArString("MainChrome.attackVictories") + ": ";
		mValue.txt =_Global.NumFormat(_Global.INT64(_data["attackVictories"].ToString()));
		}
		
		if(null!=_data["attackVictoriesRate"])
		{
			mKey.txt =Datas.getArString("MainChrome.attackVictoriesRate") + ": ";
		mValue.txt =_data["attackVictoriesRate"]+"%";
		}
		
		
		if(null!=_data["defenseVictories"])
		{
			mKey.txt =Datas.getArString("MainChrome.defenseVictories") + ": ";
		mValue.txt =_Global.NumFormat(_Global.INT64(_data["defenseVictories"].ToString()));
		}
		
		if(null!=_data["defenseVictoriesRate"])
		{
		mKey.txt =Datas.getArString("MainChrome.defenseVictoriesRate") + ": ";
		mValue.txt =_data["defenseVictoriesRate"]+"%";
		}
		
		if(null!=_data["lossedMight"])
		{
		mKey.txt =Datas.getArString("MainChrome.lossedMight") + ": ";
		mValue.txt =_Global.NumFormat(_Global.INT64(_data["lossedMight"].ToString()));
		}
		
		
		if(null!=_data["scoutCount"])
		{
		mKey.txt =Datas.getArString("MainChrome.scoutCount") + ": ";
		mValue.txt =_Global.NumFormat(_Global.INT64(_data["scoutCount"].ToString()));
		}
			
		}
		else
		{
		if(null!=_data["lossedMight"])
		{
			mKey.txt =Datas.getArString("MainChrome.lossedMight") + ": ";
			mValue.txt ="--";
		}
		if(null!=_data["kills"])
		{
			mKey.txt =Datas.getArString("MainChrome.Kills_Title") + ": ";
			mValue.txt = "--";
		}
		if(null!=_data["combatVicitries"])
		{
			mKey.txt =Datas.getArString("MainChrome.combatVicitries") + ": ";
			mValue.txt = "--";
		}
		
		if(null!=_data["combatLossers"])
		{
			mKey.txt =Datas.getArString("MainChrome.combatLossers") + ": ";
			mValue.txt ="--";
		}
		
		if(null!=_data["victoryRate"])
		{
			mKey.txt =Datas.getArString("MainChrome.victoryRate") + ": ";
			mValue.txt ="--";
		}
		
		if(null!=_data["attackVictories"])
		{
			mKey.txt =Datas.getArString("MainChrome.attackVictories") + ": ";
		mValue.txt ="--";
		}
		
		if(null!=_data["attackVictoriesRate"])
		{
			mKey.txt =Datas.getArString("MainChrome.attackVictoriesRate") + ": ";
		mValue.txt ="--";
		}
		
		
		if(null!=_data["defenseVictories"])
		{
			mKey.txt =Datas.getArString("MainChrome.defenseVictories") + ": ";
		mValue.txt ="--";
		}
		
		if(null!=_data["defenseVictoriesRate"])
		{
		mKey.txt =Datas.getArString("MainChrome.defenseVictoriesRate") + ": ";
		mValue.txt ="--";
		}
		
		if(null!=_data["lossedMight"])
		{
		mKey.txt =Datas.getArString("MainChrome.lossedMight") + ": ";
		mValue.txt ="--";
		}
		
		
		if(null!=_data["scoutCount"])
		{
		mKey.txt =Datas.getArString("MainChrome.scoutCount") + ": ";
		mValue.txt ="--";
		}
		}
		
		
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
			mLine.Draw();
		mKey.Draw();
			mValue.Draw();
		GUI.EndGroup();	
	
	}
	
	public function Init()
	{
		mKey.Init();
		mValue.Init();
		mLine.setBackground("between line_list_small", TextureType.DECORATION);
		
		
	}
}