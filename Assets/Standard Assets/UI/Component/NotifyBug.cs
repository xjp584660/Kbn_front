
public class NotifyBug : Label
{
	private int notifyCnt;

	public override int Draw()
	{	
		if(notifyCnt <= 0)
			return -1;		
//		GUI.Label( rect, txt, mystyle);	
		base.Draw();
		return -1;
	}
	
	public void SetCnt(int cnt)
	{
		notifyCnt = cnt;
		txt = notifyCnt.ToString();
	}
	
	public int GetCnt()
	{
		return notifyCnt;
	}
}

