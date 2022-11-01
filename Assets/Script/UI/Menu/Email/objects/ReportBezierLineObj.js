import System.Collections.Generic;
import System;

class ReportBezierLineObj extends UIObject 
{
	public var lineObj: ComposedUIObj;

	public var y0: Label;
	public var y1: Label;
	public var y2: Label;
	public var y3: Label;
	public var x0: Label;
	public var x1: Label;
	public var hengxian: Label;
	public var shuxian: Label;
	public var line: Label;
	public var hint: Label;
	public var titlelabel : Label;
	public var turns : Label;
	public var oneXOffset : int = 5;

	public function Draw() 
	{
		lineObj.Draw();
	}

	public function refresh(rnds: HashObject) 
	{
		titlelabel.txt = Datas.getArString("BattleReport.BattleLog_GraphTitle");
		turns.txt = Datas.getArString("BattleReport.BattleLog_Abscissa");
		// 竖 / 3; 横 / 数据Count - 1
		// _Global.NumSimlify(_Globale.INT64());		
		var width : int = _Global.INT32(line.rect.width);
		var height : int = _Global.INT32(line.rect.height);
		
		var points : List.<Vector3> = new List.<Vector3>();
		var roundData : Array = _Global.GetObjectValues(rnds);
		
		var sortRoundData : List.<long> = new List.<long>();
		for (var j : int = 0; j <= roundData.length - 1; j++) 
		{	
			var sortData : long = _Global.INT64(roundData[j]);
			
			sortRoundData.Add(sortData);
		}
		
		sortRoundData.Sort(function(a,b){
			var a1 : long = _Global.INT64(a);
			var b1 : long = _Global.INT64(b);
			return b1 - a1;
		});
			
		var maxTroopsCount : long = _Global.INT64(sortRoundData[0]);
		var maxRoundCount : int = sortRoundData.Count - 1;
		var oneY : double = _Global.DOULBE64(height / _Global.DOULBE64(maxTroopsCount));
		var oneX : double = _Global.DOULBE64(width / _Global.DOULBE64(maxRoundCount));
		
		for (var i : int = 0; i <= maxRoundCount; i++) 
		{	
			var x : int = Mathf.Ceil(oneX * i);
			var y : int = Mathf.Ceil(oneY * _Global.INT64(sortRoundData[i]));
			var point : Vector3 = new Vector3(x, y, 0);
			
			points.Add(point);
		}

		if(maxTroopsCount < 3 && maxTroopsCount > 0)
		{
			LabelSetVisible(true);
			y1.SetVisible(false);
			y2.SetVisible(false);
			hint.SetVisible(false);
		}
		else if(maxTroopsCount == 0)
		{
			LabelSetVisible(false);
			// 全隐藏 提示一句话
			hint.SetVisible(true);
			hint.txt = Datas.getArString("BattleReport.BattleLog_NoTroop");
		}
		else
		{
			LabelSetVisible(true);
			hint.SetVisible(false);
			
			if(maxRoundCount > oneXOffset)
			{
				if(maxRoundCount >=0 && maxRoundCount <= 50)
				{
					oneXOffset = 5;
				}
				else if(maxRoundCount >50 && maxRoundCount <= 100)
				{
					oneXOffset = 10;
				}
				else if(maxRoundCount >100 && maxRoundCount <= 150)
				{
					oneXOffset = 15;
				}
				var round : int = maxRoundCount / oneXOffset;
				for(var k : int = 1; k < round ; ++k)
				{
					var temp : Label = Instantiate(x0) as Label;
					temp.Init();
					temp.gameObject.transform.parent = this.gameObject.transform;
					temp.rect.x = -88 + oneX * k * oneXOffset;
					temp.txt = (k * oneXOffset).ToString();
					lineObj.newComponent.Add(temp);
					//labelList.Add(temp);
				}
			}
		}

		if(maxRoundCount == 0)
		{
			var point1 : Vector3 = new Vector3(0, height, 0);
			var point2 : Vector3 = new Vector3(width, height, 0);
			points.Add(point1);
			points.Add(point2);
		}
		
		var oneTxtY : long = _Global.INT64(maxTroopsCount / 3f);
		y1.txt = _Global.NumSimlify(_Global.INT64(oneTxtY));
		y2.txt = _Global.NumSimlify(_Global.INT64(oneTxtY * 2));	
		y3.txt = _Global.NumSimlify(_Global.INT64(maxTroopsCount));
		
		x1.txt = maxRoundCount.ToString();
				
		TextureMgr.instance().RegisterDrawTextureOKFunc(SetLine);
		TextureMgr.instance().InitCanvas(points, width, height);		
	}
	
	private function SetLine()
	{
		line.mystyle.normal.background = TextureMgr.instance().m_texure;
	}
	
	private function LabelSetVisible(flag : boolean)
	{
		hint.SetVisible(flag);
		y0.SetVisible(flag);
		y1.SetVisible(flag);
		y2.SetVisible(flag);
		y3.SetVisible(flag);
		x0.SetVisible(flag);
		x1.SetVisible(flag);
		hengxian.SetVisible(flag);
		shuxian.SetVisible(flag);
		line.SetVisible(flag);
		turns.SetVisible(flag);
		titlelabel.SetVisible(flag);
	}
}