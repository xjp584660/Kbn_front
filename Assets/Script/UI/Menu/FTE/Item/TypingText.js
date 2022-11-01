public class TypingText extends SimpleLabel
{
	public var wholeText:String;	
	protected var dtime:double;
	
	protected var txtLen:int;
	protected var curIdx:int;
	
	public var numPerSec:int = 0;
	public var totalTime:float = 0;
	
	protected var flag:int = 0;	//0:common  1:typing 2:typed end.
	
	public var typeEndFunc:Function;
	
	protected var delayTime:float = 0.2;
	public function Init():void
	{
		this.font = FontSize.Font_22;
		Init(null);				
		numPerSec = 100;
	}
	public function Init(data:Object)
	{
		super.Init();
		
//		this.mystyle.active.textColor = _Global.ARGB("FF");
	}
	public function startTyping():void
	{
		dtime = -delayTime;
		curIdx = 0;
		
		if(wholeText)
			txtLen = wholeText.length;
		else
			txtLen = 0;
		flag = 1;
	}
	
	public function Update():void
	{
		if(flag == 1)
		{
			dtime += Time.deltaTime;			
			updateTxt();	
//			//_Global.Log("TypingText: StrIndex:" + curIdx + " typingTime:" + dtime + " deltaTime:" + Time.fixedDeltaTime);
		}
	}
	
	protected function updateTxt():void
	{
		if(totalTime == 0 && numPerSec == 0 )
		{
			curIdx = txtLen;		
		}
		else
		if(totalTime == 0) // autoComplete.
		{
			curIdx = dtime * numPerSec;

		}
		else
		{
			curIdx = (dtime / totalTime) * txtLen;
		}		
		curIdx = curIdx > txtLen ? txtLen : curIdx;		
		
		if(curIdx < 0)
			return;
			
		if(wholeText)
		{
			this.txt = wholeText.Substring(0,curIdx);
		}		
		if(curIdx == txtLen)
		{
			endTyping();
		}
	}
	
	public function get canEndType():boolean
	{
		return flag == 1;
	}
	
	public function endTyping():void
	{
		if(flag == 1)
		{
			flag = 2;
			this.txt = wholeText;
			
			if(typeEndFunc!=null)
				typeEndFunc(this);
		}
	}
}