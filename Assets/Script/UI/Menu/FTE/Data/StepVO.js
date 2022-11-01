
public class StepVO extends FTEBaseVO
{
	public var type:	String;
	public var curStep:int;
	public var nextStep:int;
	public var nextSteps:Array;
	public var rollStep:int;
	public var time2Next:float;
	public var fadeInTime:float;
	public var fadeOutTime:float;
	public var touchNext:boolean = false;
	public var fadeInEffect:Effect;
	public var fadeOutEffect:Effect;
	public var showMask:boolean = true;
//	public var maskFadeIn:boolean = true;	
	public var maskAlpha:float;	
	public var uiElements:Array;
	public var data:Object;
	public var focusCamera:boolean = false;
	public var focusSlotId:int ;
	public var showNext:boolean = true;
	
	public var biVO:BIVO;
	
	public function mergeDataFrom(src:Object):void
	{
		super.mergeDataFrom(src);
		this.type = this.getString("type");
		this.curStep = this.getInt("step");
		this.nextStep = this.getInt("nextStep");	
		this.nextSteps = _Global.GetObjectValues(rawData["nextSteps"]);
				
		this.time2Next = this.getFloat("time2Next");
		if((src as Hashtable)["mask"] != null)
			this.maskAlpha = this.getFloat("mask");
		else
			this.maskAlpha = 0.5;
		
		this.touchNext = (src as Hashtable)["touchNext"] != null && (src as Hashtable)["touchNext"] != false;
		
		
		this.fadeInTime = this.getFloat("inEffect.time");
		this.fadeOutTime = this.getFloat("outEffect.time");
				
		this.fadeInEffect = Effect.createEffect(this.getValue("inEffect"));
		this.fadeOutEffect = Effect.createEffect(this.getValue("outEffect"));
						
				
		this.rollStep = this.getInt("rollStep");
		this.showMask =  this.getValue("showMask") != false;	
		this.focusCamera  = this.getValue("focusCamera") == true;	//defalut false.		
		this.focusSlotId = this.getInt("focusSlotId");
		this.showNext = this.getValue("showNext") != false; 	//default true.
		this.uiElements	= this.getList("uiElements");			
		this.data = rawData["data"];
		
		if((src as Hashtable)["BI"])
		{
			biVO = new BIVO();
			biVO.Init((src as Hashtable)["BI"]);
		}
	}
	
	public function setStep(curStep:int):void
	{
		this.curStep = curStep;
		if(nextStep == 0)
			nextStep = curStep + 1;
		
		if(rollStep == 0)
			rollStep = curStep;	
	}
	
	public function itemVOCreater(key:String):FTEBaseVO
	{
		var vo:FTEBaseVO;
		switch(key)
		{
			case "uiElements":
				vo = new ElementVO();
				break;
		}
		return vo;
	}
}

class ElementVO extends FTEBaseVO
{

	public var type		:String;
	public var rect		:Rect;
	public var genRect	: function() : Rect;
	public var action	:String;
	public var group:String;

	public var visible 	:boolean=true;
	public var text		:String;	//
	public var textAlignment:TextAnchor = TextAnchor.UpperLeft;
	public var font :FontSize;
	public var belowMask :boolean = false;
	public function mergeDataFrom(src:Object):void
	{
		super.mergeDataFrom(src);

		this.type = this.getString("type");
		var rectObj = new HashObject(rawData["rect"]);
		var rectGenArray : Array = FTERectLoader.GetRectInfo(rectObj);
		if ( rectGenArray[0] != null )
			this.rect = rectGenArray[0];
		if ( rectGenArray[1] != null )
			this.genRect = rectGenArray[1];
		//this.rect = new Rect();
		//rect.x = this.getInt("rect.x");
		//rect.y = this.getInt("rect.y");
		//rect.width = this.getInt("rect.width");
		//rect.height = this.getInt("rect.height");

		this.action = this.getString("action");
		this.group = this.getString("group");

		resetTextAlign();
		
		this.text = Datas.getArString(rawData["textPath"]);
		this.belowMask = this.getValue("belowMask") == true;	//																																									
	}
	
	public function resetTextAlign():void
	{
		var ta:String = this.getString("textAligh");
		if(ta)
			ta = ta.ToLower();
		switch(ta)
		{
			case "middlecenter":
				textAlignment = TextAnchor.MiddleCenter;
				break;
			case "middleright":
				textAlignment = TextAnchor.MiddleRight;
				break;
			case "middleleft":
				textAlignment = TextAnchor.MiddleLeft;
				break;
			case "upperleft":
				textAlignment = TextAnchor.UpperLeft;
				break;
			case "uppercenter":
				textAlignment = TextAnchor.UpperCenter;
				break;
			
		}
	}
	
	public function initDefaultGroup(defv:String):void
	{
		if(group == null)
			group = defv;		
	}
}

class ElementFactory
{
	private static var _instance:ElementFactory;
	public static function getInstance():ElementFactory
	{
		if(!_instance)
			_instance = new ElementFactory();
		return _instance;
	}
	
	public function creatElement(elvo:ElementVO):UIElement
	{
		var rt:UIElement;
		
		var obj:SimpleUIElement;		
		
		switch(elvo.type)
		{
			case FTEConstant.ElementType.ET_Label:
				obj = new SimpleLabel();
				obj.Sys_Constructor();
				obj.txt = elvo.text;
				
				obj.SetNormalTxtColor();
				fillGUIStyle(obj.mystyle,elvo);
				rt = obj;
				obj.rect = elvo.rect;
				if(elvo.rawData["fontType"])
					obj.font = FontMgr.GetFontSize(elvo.rawData["fontType"]);
				
				break;
				
			case FTEConstant.ElementType.ET_Texture:
				var st:SimpleTexture2D;
				st = new SimpleTexture2D();
				st.texturePath = elvo.getString("texturePath");
				st.rect.x = elvo.getInt("x");
				st.rect.y = elvo.getInt("y");
				st.setWH(elvo.getInt("w"),elvo.getInt("h"));
				rt = st;
				break;
				
			case FTEConstant.ElementType.ET_Button:
				var b:FTEActionButton;
				obj = new FTEActionButton();
				obj.Sys_Constructor();
				obj.txt = elvo.text;
				b = obj as FTEActionButton;
				b.clickParam = elvo.getString("action");
				elvo.textAlignment = TextAnchor.MiddleCenter;
				elvo.resetTextAlign();
				fillGUIStyle(obj.mystyle,elvo);
				
				if(elvo.rawData["fontType"])
					b.SetFont(FontMgr.GetFontSize(elvo.rawData["fontType"]), FontType.GEORGIAB);
				else
					b.SetFont(FontSize.Font_22, FontType.GEORGIAB);
				b.SetNormalTxtColor(FontColor.Button_White);
				b.SetOnNormalTxtColor(FontColor.Button_White);

				rt = obj;
				obj.rect = elvo.rect;
				b.RectGen = elvo.genRect;
				elvo.initDefaultGroup("next");
				break;
			case FTEConstant.ElementType.ET_FloatText:	
				var ft:FloatText = new FloatText();
				ft.Sys_Constructor();
				ft.wholeText = elvo.text;
				if(elvo.rawData["fontType"])
					ft.font = FontMgr.GetFontSize(elvo.rawData["fontType"]);
				ft.SetNormalTxtColor();
				fillGUIStyle(ft.mystyle,elvo);
				ft.rect = elvo.rect;
				ft.Init(elvo);
				rt =ft;
				break;
			case FTEConstant.ElementType.ET_StoreText:	
				var fet:FTEStoryText = new FTEStoryText();
				fet.Sys_Constructor();
				fet.txt = elvo.text;
				if(elvo.rawData["fontType"])				
					fet.font = FontMgr.GetFontSize(elvo.rawData["fontType"]);
				fet.SetNormalTxtColor();
				fillGUIStyle(fet.mystyle,elvo);
				fet.rect = elvo.rect;
				fet.Init(elvo);
				rt =fet;
				break;
			case FTEConstant.ElementType.ET_TypingText:
				var tt:TypingText = new TypingText();
				tt.Sys_Constructor();
				tt.wholeText = elvo.text;
				
				if(elvo.rawData["fontType"])				
					tt.font = FontMgr.GetFontSize(elvo.rawData["fontType"]);
				
				tt.SetNormalTxtColor();
				fillGUIStyle(tt.mystyle,elvo);				
				tt.rect = elvo.rect;				
				rt = tt;
				break;
				
			case FTEConstant.ElementType.ET_NpcView:
				var nv:NPCView = new NPCView();
				nv.Sys_Constructor();
				nv.Init(elvo);
				rt = nv;
				break;	
				
			case FTEConstant.ElementType.ET_Hand:
				var h:HandView = new HandView();
				h.Sys_Constructor();
				h.Init(elvo);
				rt = h;
				elvo.initDefaultGroup("next");
				break;
				
			case FTEConstant.ElementType.ET_Light:
				var l:FTELight = new FTELight();
				l.Sys_Constructor();
				l.Init(elvo);
				elvo.initDefaultGroup("next");
				rt = l;			
				l.RectGen = elvo.genRect;
				break;
			case FTEConstant.ElementType.ET_BlueNext:
				var bn:FTEBlueNextButton = new FTEBlueNextButton();
				bn.Sys_Constructor();
				bn.Init(elvo);	
				if(elvo.text)
					bn.txt = elvo.text;
				else				 
					bn.txt = Datas.getArString("Common.Next_Button");			
					
				elvo.initDefaultGroup("next");
//				rt = bn;
				break;
			case FTEConstant.ElementType.ET_END:
				var fe:FTEEndView = new FTEEndView();
				fe.Sys_Constructor();
				fe.Init(elvo);
				rt = fe;
				break;
			case FTEConstant.ElementType.ET_EffectTexture:
				var et:EffectTexture2D = new EffectTexture2D();
				et.Sys_Constructor();
				et.Init(elvo);
				rt = et;
				break;
				
		}
		
		return rt;
	}	
		
	protected function fillGUIStyle(gs:GUIStyle,evo:ElementVO):void
	{
		if(evo.rawData["border"])
		{
			gs.border.left 	= evo.getInt("border.left");
			gs.border.right = evo.getInt("border.right");
			gs.border.top 	= evo.getInt("border.top");
			gs.border.bottom = evo.getInt("border.bottom");			
		}
		
		if(evo.rawData["padding"])
		{
			gs.padding.left 	= evo.getInt("padding.left");
			gs.padding.right 	= evo.getInt("padding.right");
			gs.padding.top 		= evo.getInt("padding.top");
			gs.padding.bottom 	= evo.getInt("padding.bottom");			
		}
		if ( evo.rawData["overflow"] )
		{
			gs.overflow.left 	= evo.getInt("overflow.left");
			gs.overflow.right 	= evo.getInt("overflow.right");
			gs.overflow.top 		= evo.getInt("overflow.top");
			gs.overflow.bottom 	= evo.getInt("overflow.bottom");			
		}
		gs.alignment = evo.textAlignment;
		
		if(evo.rawData["active"])
		{
			gs.active.background = TextureMgr.instance().LoadTexture(evo.getString("active.background"),TextureType.ABSPATH);
			gs.active.textColor = _Global.ARGB(evo.getString("active.textColor"));
		}
		if(evo.rawData["normal"])
		{
			gs.normal.background = TextureMgr.instance().LoadTexture(evo.getString("normal.background"),TextureType.ABSPATH);
			gs.normal.textColor = _Global.ARGB(evo.getString("normal.textColor"));
		}
		gs.wordWrap = true;
	
	}
	
	
}


class StepViewFactory
{
	private static var _instance:StepViewFactory;
	public static function getInstance():StepViewFactory
	{
		if(!_instance)
			_instance = new StepViewFactory();
		return _instance;
	}
	
	public function creatStepView(stepVO:StepVO):FTEStepView
	{
		var view:FTEStepView;
		switch(stepVO.type)
		{			
			case FTEConstant.StepType.ST_StoryCard:
				view = new FTEStoryCardStepView();
				break;
			default:
				view = new FTEStepView();
				break;
				
		}
		return view;
	}
}
