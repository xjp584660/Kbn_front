public class SubContainer extends UIObject	 //just a controller
{

	protected var _child:Array = [];
	
	public function SubContainer()
	{
		
	}
	
	public function Init():void
	{
		for(var i:int=0; i< _child.length; i++)
		{
			( _child[i] as UIObject).Init();
		}
	}
	
	public function addChild(child:UIObject):void
	{
		_child.push(child);
	}
	
	public function removeChild(child:UIObject):void
	{
		_child.remove(child);	
	}
	
	public function Draw():int	
	{
		GUI.BeginGroup(rect);
		
		for(var i:int=0; i< _child.length; i++)
		{
			( _child[i] as UIObject).Draw();
		}
		
		GUI.EndGroup();
		return 0;
	}
	
	public function DrawItems():int
	{
		return Draw();
	}
		
	public function ClearChild():void
	{
		_child.Clear();
	}

}