using UnityEngine;
using System;
using KBN;

public class DonateResItem : ListItem
{
	public class DataStruct
	{
		public int type;
		public long limit;
		public long countPerDonate;
		public Action<int, long> valueChangedFunc;
		public Action<bool> onMouseStateChangeFunc;

		public DataStruct(int _type, long _limit, long _countPerDonate, Action<int, long> _valueChangedFunc,Action<bool> _onMouseStateChangeFunc)
		{
			type = _type;
			limit = _limit;
			countPerDonate = _countPerDonate;
			valueChangedFunc = _valueChangedFunc;
			onMouseStateChangeFunc = _onMouseStateChangeFunc;
		}
	}

	[SerializeField] private Label l_Line;
	[SerializeField] private Label l_img;
	[SerializeField] private Label l_name;
	[SerializeField] private Label input_number;
	[SerializeField] private SliderEx slider;

	[SerializeField] private Label remain;
	[SerializeField] private Label limit;
	[SerializeField] private Label donating;

	private DataStruct itemData;

	public override int Draw()
	{
		GUI.BeginGroup (rect);

		l_Line.Draw();
		l_img.Draw();
		l_name.Draw();
		input_number.Draw();
		slider.Draw();
		
		remain.Draw();
		limit.Draw();
		donating.Draw();

		GUI.EndGroup();
		return -1;
	}

	public override void Init()
	{
		base.Init();
		slider.Init(100);
		slider.valueChangedFuncEx = valueChangedFunc;
		donating.txt = Datas.getArString ("Alliance.info_dummy_alliancedonation_donating");
		input_number.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("type_box", TextureType.DECORATION);
	}

	public override void OnPopOver()
	{
		base.OnPopOver();
	}

	public override void SetRowData(object data)
	{
		itemData = data as DataStruct;
		l_img.useTile = true;
		l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_rec" + itemData.type);
		l_name.txt = Datas.getArString("ResourceName.a"+itemData.type);
		input_number.txt = 0 + "";
		int curCityId = GameMain.singleton.getCurCityId();
		long curCount = (long)Resource.singleton.getCountForTypeInSeed (itemData.type, curCityId);
		long maxVale = curCount;
		if (curCount > itemData.limit)
			maxVale = itemData.limit;
		slider.Init (maxVale/itemData.countPerDonate);
		slider.SetCurValue(0);
		string redColor = "<color=red>{0}</color>";
		if(itemData.countPerDonate<=curCount)
			redColor = "{0}";
		remain.txt = Datas.getArString("Alliance.info_dummy_alliancedonation_remaining")+"\n"+string.Format(redColor, _Global.NumSimlify(curCount));
		redColor = "<color=red>{0}</color>";
		if(itemData.limit>0)
			redColor = "{0}";
		limit.txt = Datas.getArString("Alliance.info_dummy_alliancedonation_donationlimit") + string.Format(redColor, _Global.NumSimlify(itemData.limit));
		slider.onMouseFunc = itemData.onMouseStateChangeFunc;
		slider.SetActRect (new Rect(slider.rect.x, slider.rect.y-100, slider.rect.width, slider.rect.height+200));
	}

	public string handlerFilterInputFunc(string oldStr, string newStr)
	{

		string input = _Global.FilterStringToNumberStr(newStr);
		long count = 0;
		if(input == "")
		{
			count = 0;
		}
		else
		{
			count = _Global.INT64(input);
		}
		count = count < 0 ? 0:count;
		count = count >= itemData.limit ? itemData.limit : count;
		slider.SetCurValue(count/itemData.countPerDonate);
		valueChangedFunc(count/itemData.countPerDonate);
		return count == 0 ? "":"" +count;
	}

	public string handlerInputDoneFunc(string input)
	{
		if(_Global.FilterStringToNumberStr(input) == "")
		{
			slider.SetCurValue(0);
			valueChangedFunc(0);
			return "0";
		}
		else
		{
			slider.SetCurValue(_Global.INT64(input)/itemData.countPerDonate);
			valueChangedFunc(_Global.INT64(input)/itemData.countPerDonate);
			return input;
		}
	}

	protected void valueChangedFunc(long v)
	{
		input_number.txt = "" + v*itemData.countPerDonate;
		itemData.valueChangedFunc(itemData.type, v*itemData.countPerDonate);
	}
}
