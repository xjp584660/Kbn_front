public class Effect extends FTEBaseVO
{
	public static var WIPEX:String = "wipex";	
	public static var WIPEY:String = "wipey";
	public static var FADEOUT:String = "fadeout";
	public static var DEALY:String = "delay";
	
	public static function createEffect(data:Object):Effect
	{
		var e:Effect;
		if(!data)
			return null;
			
		switch((data as Hashtable)["type"])
		{
			case WIPEX:
				e = new WipeX();
				break;
			case WIPEY:
				e = new WipeY();
				break;
			case FADEOUT:
				e = new FadeOutEffect();
				break;
			case DEALY:
				e = new DelayEffect();
				break;
			default:
				e = null;
				break;
		}
		
		if(e)
			e.Init(data);
			
		return e;
	}
	/**********************/
	protected var _target:UIElement;
		
	public function Init(data:Object):void
	{
		this.mergeDataFrom(data);	
	}	
	public function set target(value:UIElement)
	{
		_target = value;	
	}	
	public function get target():UIElement
	{
		return _target;
	}
	public function doEffect(cur:float,total:float)
	{	
		var p:float = 1;
		if(total != 0)
		{
			p = cur / total;
		}
		p = p < 1 ? p : 1;
		p = p > 0 ? p : 0;
		
		doEffect(p);
	}
	public function doEffect(percent:float):void
	{
	
	}
	// Math Function..
	protected function func_linear(fx:float,tx:float,percent:float):float
	{
		return fx * (1 - percent) + tx * percent;		
	}
}
/**** template..
class __ extends Effect
{
	public function Init(data:Object):void
	{
		super.Init(data);
	}
	
	public function doEffect(percent:float):void
	{
		
	}
}
***/
class WipeX extends Effect
{
	protected var fromX:int;
	protected var toX:int;
	public function Init(data:Object):void
	{
		super.Init(data);
		this.fromX = this.getInt("fromX");
		this.toX = this.getInt("toX");
	}	
	
	public function doEffect(percent:float):void
	{
		target.rect.x = func_linear(fromX,toX,percent);	
	}
}
class WipeY extends Effect
{
	protected var fromY:int;
	protected var toY:int;
	public function Init(data:Object):void
	{
		super.Init(data);
		this.fromY = this.getInt("fromY");
		this.toY = this.getInt("toY");
	}	
	
	public function doEffect(percent:float):void
	{
		target.rect.y = func_linear(fromY,toY,percent);	
	}
}

class FadeOutEffect extends Effect
{
	protected var fa:float = 1.0;
	protected var ta:float = 0.0;
	protected var time:float = 1.0;
	
	public function Init(data:Object):void
	{
		super.Init(data);
		this.fa = this.getFloat("fa");
		this.ta = this.getFloat("ta");
		this.time = this.getFloat("time");
	}
	public function doEffect(percent:float):void
	{
		target.alpha = func_linear(fa,ta,percent);	
	}

}

class DelayEffect extends Effect
{
	public function Init(data:Object):void
	{
		super.Init(data);
	}
	public function doEffect(percent:float):void
	{
		if(percent < 0.99)
			target.SetVisible(false);
		else
			target.SetVisible(true);
	}
}