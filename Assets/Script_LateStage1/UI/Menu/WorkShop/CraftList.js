public class CraftList extends UIObject
{
	public var insItem:CraftItem;
	public var scroll : ScrollList;	
	
	
	
	protected var itemList:Array = [];
	
	public function Awake()
	{
		super.Awake();
		Init();
	}
	
	public function Init()
	{
		insItem.Init();
		scroll.Init(insItem);		
	}
	
	public function Start()
	{
	}
	public function Draw()
	{
		GUI.BeginGroup(rect);
		scroll.Draw();
		GUI.EndGroup();
	}
	
	public function Update()
	{
		scroll.Update();
	}
	public function updateData(data:Array):void
	{
		if(data != null && data.length > 0)
			scroll.SetData(data);
	}
	
	public function Clear()
	{
		scroll.Clear();
	}

}
