#pragma strict

class ArtNums extends UIObject
{
	protected var uiList : System.Collections.Generic.List.<UIObject> = new System.Collections.Generic.List.<UIObject>();
	public var numClone:Label;
//	public var gapWidth:int = 0;
	public function Init():void
	{
		uiList.Clear();
//		numClone.useTile = true;
//		numClone.tile.spt = TextureMgr.instance().ElseIconSpt();
	}
	
	public function SetNums(_num:int)
	{
		clearUIObject();
		var num:int = _num/10;
		var count:int = 0;
		while(num != 0)
		{
			count ++;
			num = num/10;
		}
		count++;
		num = _num;
		for(var i:int=1;i<=count;i++)
		{
			var numItem:Label = Instantiate(numClone);
			var temp:int = num%(Mathf.Pow(10,i))/(Mathf.Pow(10,i-1));
			numItem.setBackground("g"+temp, TextureType.ICON);
			uiList.Add(numItem);
		}
		ResetAllPosition();
		
	}
	
	public function ResetAllPosition()
	{
		var temp:float = 0.0;
		var labelObj:Label;
		var totalWidth:float = 0.0;
		for(var i:int=uiList.Count-1;i>=0;i--)
		{
			labelObj = uiList[i] as Label;
			labelObj.rect.x = temp;
			labelObj.rect.width = labelObj.mystyle.normal.background.width;
			labelObj.rect.height = labelObj.mystyle.normal.background.height;
			temp = temp+ labelObj.rect.width;
			
			totalWidth += labelObj.rect.width;
		}
		
		rect.width = totalWidth;
		
	}
	
	public function Draw()
	{
		if(!visible)
			return;
			
		GUI.BeginGroup(rect);
		for ( var x : int = 0; x < uiList.Count; ++x )
		{
			uiList[x].Draw();
		}
		GUI.EndGroup();
	}
	
	public function Update():void
	{
		for ( var obj : UIObject in uiList )
		{
			obj.Update();
		}
	}
	
	public function addUIObject(item:UIObject)
	{
		uiList.Add(item);
	}
	
	public function clearUIObject():void
	{
		for ( var obj : UIObject in uiList )
		{

			if(obj == null) continue;
			obj.OnClear();
			TryDestroy(obj);
		}
		uiList.Clear();
	}
	
	
}