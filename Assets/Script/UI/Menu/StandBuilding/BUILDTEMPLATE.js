//public class BUILDTEMPLATE extends Menu
//{
//	//AllTab
//	public var menuHead  	:MenuHead;	
//	
//	//Tab1
//	public var detailContent : StandardBuildingContent;
//	//Tab2
//	
//	//Data.
//	protected var viewIndex:int = 0;
//	
//	public function Awake()
//	{
//		super.Awake();
//	}
//	
//	public function Update()
//	{
//		menuHead.Update();
//	}
//	
//	public function DrawItem()
//	{
//		menuHead.Draw();
//		switch(viewIndex)
//		{
//			case 0:
//				detailContent.Draw();
//				break;
//			case 1:
//				
//				break;
//		}
//	}
//	
//	public function OnPush(param:Object)
//	{
//		super.OnPush(param);
//		viewIndex = 0;
//		updateData(param);
//	}
//	
//	protected function updateData(buildingInfo:Object):void
//	{
////		var mTitle:String = buildingInfo.buildName + "(LV" + buildingInfo.curLevel + ")";
//		menuHead.setTitle((buildingInfo as Building.BuildingInfo).buildName, (buildingInfo as Building.BuildingInfo).curLevel);
//		
//		detailContent.UpdateData(buildingInfo);
//		
//	}
//	
//	public function DrawBackground()
//	{
//		if(this.background)
//		DrawTextureClipped(background, new Rect( 0, 0, background.width, background.height), Rect( 0, 0, background.width, background.height), rotation);
//
//		//content.DrawBackground();
//	}
//	
//
//}