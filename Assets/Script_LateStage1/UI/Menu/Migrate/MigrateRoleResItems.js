public class MigrateRoleResItems extends ListItem
{
    public var type2:Label;
    public var bring2:Label;
    public var own2:Label;
  	public var line2:Label;
  	public var mframeBotom:Label;
  	public var scroll2:ScrollList;
  	public var resListItem : MigrateResItem;
  	private var resList:Array;
  	public var l_pageLeft:Button;
 	public var l_pageRight:Button;
 	public var cityName:Label;
 	public var houseLv:Label;
 	public var topBack:Label;
 	public var fenge1:Label;
 	public var fenge2:Label;
      
	public function Init()
	{
		super.Init();
		
		l_pageLeft.OnClick = OnPageLeft;
		l_pageRight.OnClick = OnPageRight;
		
		type2.txt=Datas.getArString("Migrate.Role_Type");
        bring2.txt=Datas.getArString("Migrate.Role_Bring");
        own2.txt=Datas.getArString("Migrate.Role_You_Own");
		scroll2.Init(resListItem);
		
		resList = new Array();
	}
	
	function OnPageLeft()
	{
		MenuMgr.getInstance().sendNotification(Constant.Notice.MigrateLeftPage,null); 
	}
	
	function OnPageRight()
	{
		MenuMgr.getInstance().sendNotification(Constant.Notice.MigrateRightPage,null); 
	}
	
    function Update()
    {
        scroll2.Update();
    }
	
	function DrawItem()
	{	
		mframeBotom.Draw();
		line2.Draw();
		topBack.Draw();
		l_pageLeft.Draw();
		l_pageRight.Draw();
		cityName.Draw();
		houseLv.Draw();
		scroll2.Draw();	
		fenge1.Draw();
		fenge2.Draw();
		type2.Draw();
		bring2.Draw();
		own2.Draw();		
	}
	
	public function SetRowData(data:Object)
	{
		resList.Clear();
		var city : HashObject = data as HashObject;
		cityName.txt = city["cityName"].Value.ToString();
		houseLv.txt = Datas.getArString("buildingName.b9") + "(Lv." + city["houseLv"].Value.ToString() + ")";
		
        for(var i:int=0;i<8;i++){
            if(i>4 && i<7) 
                continue;   
                    
            var goldRes:MigrateRoleInfo.BringResData = new MigrateRoleInfo.BringResData();

            goldRes.isResource = true;
            goldRes.resourceType = i;
            goldRes.typeName = Datas.getArString("ResourceName.a"+i);//"res"+i;

            var curCityId:int =_Global.INT32(city["cityId"]);
                
            goldRes.own = Resource.instance().getCountForTypeInSeed(i, curCityId);
            if(i==0){//ResourceName.a
                goldRes.bring = _Global.INT64(city["gold"]);
            }else{
                goldRes.bring = _Global.INT64(city[String.Format("resource{0}x3600Migrate",i)])/3600;
            }

            resList.push(goldRes);
        }
        
        scroll2.Clear();
        scroll2.SetData(resList);
        scroll2.ResetPos();
	}	
}