using UnityEngine;

using GameMain = KBN.GameMain;
using Datas = KBN.Datas;
using _Global = KBN._Global;

public class SaleComponent : UIObject
{
	public Label gemIcon;
	public Label cutPriceLabel;
	public Label salePriceLabel;
	public Label timeIcon;
	public Label timeLeftLabel;
	public Label lineLabel;
	
	private long startTime;
	private long endTime;
	private int salePrice;
	private int cutPrice;
	
	private long curTime;
	private long oldTime; 
	private bool hasCutSale; 
	private bool hasStartCutSale;
	private bool isDisplaySale;
	private FontColor salePriceColor;
	
	private int limitedDays = 21600;
	private int oneHour = 3600;
    
    public Rect cutPriceLabelRectVertical = new Rect(120, 8, 100, 30);
    public Rect timeIconRectVertical = new Rect(5, 30, 30, 30);
    public Rect timeLeftLabelRectVertical = new Rect(37, 33, 300, 30);
    public float rectWidthVertical = 350;
    
    public Rect cutPriceLabelRect = new Rect(100, 8, 100, 30);
    public Rect timeIconRect = new Rect(150, 8, 30, 30);
    public Rect timeLeftLabelRect = new Rect(185, 8, 300, 30);
    public float rectWidth = 500;
    
	public bool gethasCutSale()
	{
		return hasCutSale;
	}
	
	public override void Init()
	{
		base.Init();

		gemIcon.Init();
		cutPriceLabel.Init();
		salePriceLabel.Init();
		timeIcon.Init();
		timeLeftLabel.Init();
		lineLabel.Init();
		
		salePriceColor = salePriceLabel.normalTxtColor;		
	}
	
	public void setData(int _salePrice, int _cutPrice, long _startTime, long _endTime, int _isDisplaySale)
	{
		setData(_salePrice, _cutPrice, _startTime, _endTime, _isDisplaySale, true);
	} 
	
	public void setData(int _salePrice, int _cutPrice, long _startTime, long _endTime, int _isDisplaySale, bool _isVertical)
	{
		salePrice = _salePrice;
		cutPrice = _cutPrice;
		endTime = _endTime - 30;
		startTime = _startTime;
		isDisplaySale = _isDisplaySale > 0 ? true : false;
		
		gemIcon.rect.height = 30;
		
		if(_isVertical)
		{
			cutPriceLabel.rect = cutPriceLabelRectVertical;
			timeIcon.rect = timeIconRectVertical;
			timeLeftLabel.rect = timeLeftLabelRectVertical;
			rect.width = rectWidthVertical;
		}
		else
		{
			cutPriceLabel.rect = cutPriceLabelRect;
			timeIcon.rect = timeIconRect;
			timeLeftLabel.rect = timeLeftLabelRect;
			rect.width = rectWidth;			
		}

		resetDisplay();	
	}

	public bool isCutSale {
		get
		{
			return hasStartCutSale;
		}
	}

	public bool isShowSale {
		get
		{
			return hasStartCutSale && isDisplaySale;
		}
	}
	
	private void resetDisplay()
	{
		curTime = GameMain.unixtime(); 
	
		cutPriceLabel.SetVisible(false);
		timeIcon.SetVisible(false);
		timeLeftLabel.SetVisible(false);
		lineLabel.SetVisible(false);
		
		gemIcon.SetVisible(true);
		salePriceLabel.SetVisible(true);
		
		salePriceLabel.txt = "" + salePrice;
		cutPriceLabel.txt = "" + cutPrice;
		
		salePriceLabel.SetNormalTxtColor(salePriceColor);									
//		salePriceLabel.SetNormalTxtColor(FontColor.Button_White);//mystyle.normal.textColor = Color(1.0, 1.0, 1.0, 1.0);
//		cutPriceLabel.SetNormalTxtColor(FontColor.Button_White);
		if(salePrice != cutPrice)
		{
			if(curTime >= startTime && curTime <= endTime)
			{
				hasCutSale = true;
				hasStartCutSale = true;			
			
				if(isDisplaySale)
				{
					cutPriceLabel.SetVisible(true);
					timeIcon.SetVisible(true);
					timeLeftLabel.SetVisible(true);
					lineLabel.SetVisible(true);
					
					salePriceLabel.SetNormalTxtColor(FontColor.Sale_Gray);//mystyle.normal.textColor = Color(196.0/255, 196.0/255,196.0/255 , 1.0);
					
					if(endTime - curTime >= limitedDays)
					{
						timeLeftLabel.txt = Datas.getArString("Common.LimitedTime");
					}				
				}
				else
				{					
					salePriceLabel.txt = "" + cutPrice;									
				}
			}
			else if(curTime < startTime)
			{
				hasCutSale = true;
				hasStartCutSale = false;				
			} 
			else if(curTime > endTime)
			{ 
				hasCutSale = false;
				hasStartCutSale = false;
			}
		}
		else
		{	
			hasCutSale = false;
			hasStartCutSale = false;							
		}
		
		if(lineLabel.isVisible())
		{
			if(salePrice < 10) 
			{
				lineLabel.rect.width = Constant.SalePrice.DeLine_Wid1;
			}			
			else if(salePrice < 100) 
			{
				lineLabel.rect.width = Constant.SalePrice.DeLine_Wid2;	
			}			
			else
			{
				lineLabel.rect.width = Constant.SalePrice.DeLine_Wid3;				 
			}	
		}										
	}
	
	public override void SetVisible(bool _enable)
	{
		base.SetVisible(_enable);

		gemIcon.SetVisible(_enable);
		cutPriceLabel.SetVisible(_enable);
		salePriceLabel.SetVisible(_enable);
		timeIcon.SetVisible(_enable);
		timeLeftLabel.SetVisible(_enable);
		lineLabel.SetVisible(_enable);	
		
		if(_enable)
		{
			resetDisplay();
		}
	}
	
	public override void Update()
	{
		base.Update();

		if(!hasCutSale)
		{
			return;
		}

		curTime = GameMain.unixtime();
		 
		if(curTime > startTime)
		{
			if(!hasStartCutSale)
			{
				resetDisplay();
			}
				
			if(curTime < endTime)
			{
				if(endTime - curTime < limitedDays)
				{
					if(endTime - curTime < oneHour)
					{
						timeLeftLabel.txt = _Global.timeFormatShortStr(endTime - curTime, true);
					}
					else
					{
						timeLeftLabel.txt = _Global.timeFormatShortStr(endTime - curTime, false);
					}
				}
			}
			else			
			{
				resetDisplay();
			}						
		}
	}
	
	public override int Draw()
	{
		base.Draw();
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);
		gemIcon.Draw();
		cutPriceLabel.Draw();
		salePriceLabel.Draw();
		timeIcon.Draw();
		timeLeftLabel.Draw();
		lineLabel.Draw();	
		GUI.EndGroup();

		return -1;
	}
	
	public void cutTimeLeftLabel()
	{
		string tmp = timeLeftLabel.txt;
		if(tmp.IndexOf(" ") != -1)
			timeLeftLabel.txt = tmp.Substring(0,tmp.IndexOf(" "));
	}
}
