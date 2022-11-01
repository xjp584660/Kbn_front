public class PaymentNewItem extends ListItem
{
	public var l_img	:Label;
	public var l_gem	:Label;
	
	public var toggle_button : ToggleButton;
	public var l_poptxt	:Label;
	public var l_price	:Label;
	public var l_des	:Label;
	public var l_bg		:Label;
	public var l_pop	:Label;
	@SerializeField
	public var btnDefault:Button;
	
	//public var paymentHandlerDelegate : IEventHandler;
	
	protected var _selected:boolean;
	protected var _data:Payment.PaymentElement;
	
	public function Init():void
	{
		btnDefault.mystyle.active.background = TextureMgr.instance().LoadTexture("square_black2",TextureType.DECORATION);
		btnDefault.mystyle.border.left = 16;
		btnDefault.mystyle.border.right = 16;
		btnDefault.mystyle.border.top = 16;
		btnDefault.mystyle.border.bottom = 16;

		btnDefault.mystyle.normal.background =  TextureMgr.instance().LoadTexture("listbackground",TextureType.DECORATION);

		btnDefault.OnClick = selectClick;
		
		_selected = false;
		toggle_button.selected = false;

		l_img.useTile = true;
		l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile(null);
		
		l_pop.useTile = true;
		l_pop.tile = TextureMgr.instance().ElseIconSpt().GetTile(null);
		
		l_gem.useTile = true;
		l_gem.tile =  TextureMgr.instance().ElseIconSpt().GetTile("gems");
		l_gem.SetRectWHFromTile();
	}

	protected function selectClick(clickParam:Object):void
	{
		if(!_selected)
        {
			SetSelected(true);
        }
	}
	
	public function SetSelected(b:boolean):void
	{
		_selected = b;
		toggle_button.selected = b;
		
		if(b)
		{
			btnDefault.mystyle.normal.background = TextureMgr.instance().LoadTexture("paymentSelectBack", TextureType.DECORATION);
			
			l_price.SetNormalTxtColor(FontColor.New_Level_Yellow);
			l_des.SetNormalTxtColor(FontColor.New_Level_Yellow);
		}
		else
		{
			l_price.SetNormalTxtColor(FontColor.New_Common_Red);
			l_des.SetNormalTxtColor(FontColor.New_Common_Red);
			btnDefault.mystyle.normal.background = TextureMgr.instance().LoadTexture("paymentBack", TextureType.DECORATION);
		}
		
		if(b && handlerDelegate != null)
			handlerDelegate.handleItemAction(Constant.Action.PAYMENT_ITEM_SELECT,this);
	}
	
	public function SetRowData(data:System.Object):void
	{
        var dataDict : Hashtable = data as Hashtable;
		this._data = dataDict["PayItem"] as Payment.PaymentElement;
		//btnDefault.rect.height = this.rect.height - 10;
		
		l_img.tile.name = _data.icon;
		l_img.SetRectWHFromTile();
		
		//l_img.rect.y = (this.rect.height - l_img.rect.height) / 2;
		
		l_gem.rect.x = l_img.rect.x + l_img.rect.width + 15 ;
		l_gem.rect.y = l_img.rect.y + l_img.rect.height - l_gem.rect.height;
		
		l_des.txt = _data.bonusDescription;
		l_price.txt = _data.price;
		
		l_pop.SetVisible(true);
		l_poptxt.SetVisible(true);
		
		switch(_data.saleType)
		{
			case Payment.ST_POPULAR:
				l_pop.tile.name = "Most-Popular_old";
				l_poptxt.txt = Datas.getArString("paymentLabel.Most_Popular");
				layoutPop();
				break;
			case Payment.ST_VALUABLE:
				l_pop.tile.name = "Best-Value_old";
				l_poptxt.txt = Datas.getArString("paymentLabel.Best_Value"); 
				layoutPop();
				break;
			case Payment.ST_LIMIT:
				l_pop.tile.name = "Best-Value_old";
				l_poptxt.txt = Datas.getArString("paymentLabel.Limited_Offer"); 
				layoutPop();
				break;
			default:
				l_pop.SetVisible(false);
				l_poptxt.SetVisible(false);
				break;
		}
		
	}
	
	protected function layoutPop():void
	{
		//l_pop.SetRectWHFromTile();
		//l_pop.rect.x = this.rect.width - l_pop.rect.width;
	}
	
	public function getData():Payment.PaymentElement
	{
		return _data;
	}
	
	public function DrawItem()
	{
		//GUI.BeginGroup(rect);
	    DrawInternal();
		//GUI.EndGroup();
	}
    
    protected function DrawInternal()
    {
        btnDefault.Draw();

        toggle_button.Draw();
        l_img.Draw();
        l_gem.Draw();
        
        l_price.Draw();
        l_des.Draw();
        l_pop.Draw();
        
        l_poptxt.Draw();
    }

	public function SetScrollPos(pos:int, listHeight:int)
	{
		if(rect.y - pos < 0 || rect.y+rect.height - pos > listHeight)
		{
			l_pop.drawTileByGraphics = false;
			l_img.drawTileByGraphics = false;
			l_gem.drawTileByGraphics = false;
		}
		else
		{
			l_pop.drawTileByGraphics = true;
			l_img.drawTileByGraphics = true;
			l_gem.drawTileByGraphics = true;
		}
	}
}
