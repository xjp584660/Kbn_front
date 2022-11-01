/*
 * @FileName:		MistExpeditionMenuExpeditionHorn.js
 * @Author:			lisong
 * @Date:			2022-09-02 17:13:50
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 详情信息 - 远征号角购买
*/


public class MistExpeditionMenuExpeditionHorn extends PopMenu {
	@Space(30) @Header("---------- MistExpedition Menu Expedition Horn ----------")

    @SerializeField private var seperateLine:Label;
	@SerializeField private var scrollList:ScrollList;
	@SerializeField private var expeditionHornItem: MistExpeditionMenuExpeditionHornItem;
	@SerializeField private var isUpdateScrollView = false;

	private var hornid = 4700;

	function Init()
	{
		super.Init();
		
		title.txt = MystryChest.instance().GetChestName(hornid);
		scrollList.Init(expeditionHornItem);
		
		seperateLine.setBackground("between line", TextureType.DECORATION);
		
		seperateLine.Init();
		
	}
	
	function OnPush(param:Object)
	{
		super.OnPush(param);
        
		SetItems(param);
	}
	
	public function OnPopOver()
	{
		scrollList.Clear();
	}
	
	function Update()
	{
		scrollList.Update();	
	}
	
	function DrawItem()
	{
		seperateLine.Draw();
		scrollList.Draw();
	}
	
	private function SetItems(param: Object) {
		
		var arr:Array = new Array();
		var data = { "ID": hornid, "callback": param};/* 远征号角（远征的入场券） */
        arr.Push(data);
		scrollList.SetData(arr);
		scrollList.updateable = isUpdateScrollView;
	}

}

