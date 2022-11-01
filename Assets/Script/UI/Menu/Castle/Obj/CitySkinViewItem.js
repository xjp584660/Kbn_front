



public class CitySkinViewItem extends ListItem
{
	@Space(30) @Header("----------CitySkinViewItem----------") 

		 
	public var itemBGFrame: Label;
	public var itemIcon: Label;
	public var itemIconMask: Label;
	public var itemName: Label;
	public var leftTimeIcon: Label;

	public var itemDescription: Label;
	public var labelLeftTime: Label;
	public var itemBuffsDescription: Label;

	public var selectBtn: Button;
	public var btnGoto: Button;
	/*public var labelGoto: Label;*/


	private var citySkinView: CitySkinView;
	private var isDefault: boolean;
	private var isShowBuffInfoDetail: boolean;
	private var skinEndTimeStamp: long;/*皮肤倒计时剩余时间*/


	private var skinRes: String;/*皮肤的资源名称*/
	private var citySkinId: String;
	private var isInUsing: boolean;/*是否处于正在使用中*/
	private var isInActive: boolean;/*是否处于 激活中*/


	function Init()
	{
		itemBGFrame.Init();
 
		itemBuffsDescription.Init();

		selectBtn.Init();
		itemIcon.Init();
		itemName.Init();
		itemDescription.Init();
		labelLeftTime.Init();
 		leftTimeIcon.Init();
 
		btnGoto.Init();

		/*labelGoto.Init();*/


		btnGoto.OnClick = handleGotoBtnClick;
		selectBtn.OnClick = handleSelectBtnClick;

		selectBtn.Init();
		citySkinId = "";
		isInUsing = false;
		isInActive = false;

		isDefault = false;
		isShowBuffInfoDetail = false;
		skinEndTimeStamp = 0;


		SetSelectBtnCanClickState(false);
	}
	

	public function Update()
	{
		if(skinEndTimeStamp > 0){
			SkinTimeCountdown();
		}
	}
	 
	function Draw()
	{

		if (!visible) return;

		GUI.BeginGroup(rect);
		itemBGFrame.Draw();
		selectBtn.Draw();
		itemIcon.Draw();
		itemName.Draw();

		if (isShowBuffInfoDetail) {
			itemBuffsDescription.Draw();
		}


		if (skinEndTimeStamp > 0) {
			leftTimeIcon.Draw();
			labelLeftTime.Draw();
		} else {
			itemDescription.Draw();
		}

		if(!isDefault) {
			btnGoto.Draw();
			/*labelGoto.Draw();*/
		}

		GUI.EndGroup();	
	}










	public function SetRowData(data: Object): void
	{
		
	/*
		//-------------------------------默认：未使用
		["skinid"]      = "1"
		["skinres"]     = "skinres_0"
		["isdefault"]   = "1"						//当前皮肤是否是默认皮肤
		["itemids"]     = ""
		["buffids"]     = ""


		//-------------------------------其他： 以启用 以使用
		["skinid"]      = "2"
		["skinres"]     = "skinres_1"
		["isdefault"]   = "0"
		["itemids"]     = {					// 道具物品列表
							[33009] = "121" ,table = { buyFrequency , buyitemlimit , quantityNet  , limitbuytime}
							[33010] = "0"
							[33011] = "0"
							[33012] = "0"
							}
		["buffids"]     = "445"

		["cityid"]      = "2561"
		["playerid"]    = "1618"
		["inuse"]       = "1"					//当前使用的是否是该皮肤，当没有该字段或者是 值为 0时，表示不在使用中
		["begintime"]   = "2022-01-05 16:47:58"	//皮肤启用 的 开始时间戳；以启用的会出现该字段
		["endtime"]     = "2022-02-25 16:48:01"	//皮肤启用 的 结束时间戳；以启用的会出现该字段
		["creattime"]	= "2022-01-05 16:47:58"	//皮肤的上架销售时间

		//-------------------------------其他： 未启用
		["skinid"]      = "3"
		["skinres"]     = "skinres_2"
		["isdefault"]   = "0"
		["itemids"]     = {[33006],[33007],[33008]}
		["buffids"]     = "443"
	*/

 
		var m_data: HashObject = data as HashObject;




		citySkinId = m_data["skinid"].Value as String;
		skinRes = m_data["skinres"].Value as String;
		itemIcon.image = TextureMgr.instance().LoadTexture(skinRes, TextureType.CITYSKIN);


		isDefault = (m_data["isdefault"].Value as String) == CitySkinView.DefaultCitySkinId;
		isShowBuffInfoDetail = (m_data["buffids"].Value as String )!= "";
		isInUsing = m_data.Contains("inuse") && _Global.INT32(m_data["inuse"].Value) == 1;


		var nameId: String = skinRes.Split("_"[0])[1];
		var nameKey: String = isDefault ? "CastleSkin.Default" : "CastleSkin.Name00" + nameId;

		itemName.txt = Datas.getArString(nameKey);

		var buffidObj: Object = m_data["buffids"].Value;
		if (_Global.IsNumber(buffidObj as String)) {
			var buffId: int = _Global.INT32(buffidObj);

			var buffGds = GameMain.GdsManager.GetGds.<KBN.GDS_Buff>();
			var buff = buffGds.GetItemById(buffId);

			var des = "";
			if (buff.TARGET == BuffTarget.Attack) {
				des = String.Format(Datas.getArString("CastleSkin.Buff001"), buff.VALUE);

			} else if (buff.TARGET == BuffTarget.Carmot) {
				des = String.Format(Datas.getArString("CastleSkin.Buff002"), buff.VALUE);
			} else if (buff.TARGET == BuffTarget.Limit)  {
				des = String.Format(Datas.getArString("CastleSkin.Buff003"), buff.VALUE);
			}

			itemBuffsDescription.txt = des;

		}
		else {
			itemBuffsDescription.txt = Datas.getArString(buffidObj as String);
		}



 
		skinEndTimeStamp = 0;

		if (isDefault) {
			SetSelectBtnCanClickState(true);
			itemDescription.txt = Datas.getArString("CastleSkin.Permanent");
			itemDescription.SetNormalTxtColor(FontColor.Green);

		} else {
			itemDescription.txt = Datas.getArString("CastleSkin.Inactive");
			itemDescription.SetNormalTxtColor(FontColor.Red);

			/*有 endtime 字段  */
			if (m_data.Contains("endtime")) {
				 
				skinEndTimeStamp = CitySkinView.GetSkinTimeStamp(m_data["endtime"].Value);

				var remainTime: long = skinEndTimeStamp - GameMain.unixtime();

				if (remainTime > 0) {
					SetSelectBtnCanClickState(true); 
				} else {
					SetSelectBtnCanClickState(false); 
				}

			} else { 
				SetSelectBtnCanClickState(false);
			}


		}
 
	}



	public function SetCitySkinView(citySkinViewTemp: CitySkinView): void {
		citySkinView = citySkinViewTemp;
	}




	/*点击详情按钮  */
	private function handleGotoBtnClick(): void {

		if (citySkinView != null) {
			citySkinView.pushCitySkinPropView(citySkinId);
		}
	}

	/*点击选中 按钮 */
	private function handleSelectBtnClick(): void {
		if (citySkinView != null) {
			citySkinView.UseCitySkin(citySkinId);
		}
	}

 


	/*设置select 按钮的状态   */
	public function SetSelectBtnState(isSelect: boolean) {
		if (!isInActive) return;

		if (isSelect) {
			selectBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("check_box_1", TextureType.DECORATION);
 		} else {
			selectBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("check_box_2", TextureType.DECORATION);
		}
		selectBtn.SetDisabled(false);

	}

	/*设置 select ben 的操作状态 */
	private function SetSelectBtnCanClickState(isCanSelect: boolean) {

		isInActive = isCanSelect;
		selectBtn.SetDisabled(!isCanSelect);
		if (isCanSelect) {
			selectBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("check_box_2", TextureType.DECORATION);
		} else {
			selectBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black", TextureType.DECORATION);
		}

	}


	public function GetSkinID(): String {

		return citySkinId;
	}

	public function GetSkinResName(): String {

		return skinRes;
	}




	/*更新 皮肤 的启用 状态 
	public function UpdateState() {
		 

		skinEndTimeStamp = 30 + GameMain.unixtime();
		SetSelectBtnCanClickState(true);
		SkinTimeCountdown();
	}
	*/


	/*皮肤倒计时*/
	private function SkinTimeCountdown() {
		var remainTime: long = skinEndTimeStamp - GameMain.unixtime();
		if (remainTime > 0) {
			labelLeftTime.txt = Datas.getArString("CastleSkin.Time") + _Global.timeFormatStr(remainTime);
			 
 		} else {
			skinEndTimeStamp = 0;
			labelLeftTime.txt = ""; 
			SetSelectBtnCanClickState(false);
			if (isInUsing) {	/*当时间使用完，并且当前的皮肤正在使用时，则需要将皮肤换成 默认的*/
				if (citySkinView != null) {
					citySkinView.UseDefaultCitySkin();
				}
			}
		}
	}


}