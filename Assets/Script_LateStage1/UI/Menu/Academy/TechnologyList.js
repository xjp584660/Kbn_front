public class TechnologyList extends UIObject
{
	public var insItem:TechnologyItem; // for Instantiate	
	public var scroll : ScrollList;	
	
	
	
//	protected var itemList:Array = [];
	
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
	public function updateData(tchList:Array):void
	{
////		scroll.Clear();
//		var item:TechnologyItem;
//		var i:int;
//		var n:int;
//		var idata:Object;
//		n = tchList.length;
//		
//		for(i=0; i<n; i++)
//		{
////			item = Instantiate(insItem);
//			idata = tchList[i];
////			idata.ast_callBack = f_click_callBack;
//			
////			item.updateData(idata as TechVO);
////			item.f_click_callBack = this.f_click_callBack;
////			scroll.AddItem(item);
//		}				
////		scroll.Refresh();		
////		scroll.ResetPos();
		scroll.SetData(tchList);
	}
	
	public	function	clear():void{
		scroll.Clear();
	}
	

}
