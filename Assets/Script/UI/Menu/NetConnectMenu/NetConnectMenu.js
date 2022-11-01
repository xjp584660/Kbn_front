
class NetConnectMenu extends KBNMenu{


	@Space(30) @Header("---------- NetConnectMenu ----------")

	public	var		bgLabel:SimpleLabel;
	public	var		aniLabel:SimpleLabel;
	public	var		loadTextLabel:SimpleLabel;
	
	public	var		aniFramCnt:int = 8;
	private	var		aniIdx:int = 0;
	private	var		imgs:Array;
	
	private	var		frameTimeCtrl:float;
    
    private final static var LoadingTextKey = "MainChrome.Loadingddd";


	/*
	 * 是否显示 loading 文本信息，默认显示
	 * 每次结束后，该状态需要被重置回默认显示状态
	 */
	public static var IsShowLoadingText: boolean = true;

	/*
	 * 是否显示动画 ,默认显示动画。
	 * 每次结束后，该状态需要被重置回默认显示状态
	 * */
	public static var IsShowAnime: boolean = true;

	/*
	 * 背景是否是透明（仍然可遮挡），默认使用 alpha 值
	 * 每次结束后，该状态需要被重置回默认显示状态
	*/
	public static var IsBGTransparency: boolean = false;

	private var bgLabelAlpha = 0f;










	public function Init(){
		
		imgs = new Array(aniFramCnt);
		for( var i = 0; i < aniFramCnt; i ++ ){
			imgs[i] = TextureMgr.instance().LoadTexture("load_" + (i + 1),TextureType.LOADING);
		}
		
		bgLabel.alpha = 0.5f;
		aniLabel.image = imgs[0];
		aniLabel.rect = Rect( (MenuMgr.SCREEN_WIDTH - aniLabel.image.width)/2, 
							(MenuMgr.SCREEN_HEIGHT - aniLabel.image.height)/2,
							aniLabel.image.width, aniLabel.image.height);
		
		loadTextLabel.txt = String.Empty;
		loadTextLabel.rect = Rect(0, aniLabel.rect.y + aniLabel.rect.height, MenuMgr.SCREEN_WIDTH, 30);

		bgLabelAlpha = bgLabel.alpha;
	}
	
	public function OnPush(param: Object) {
	
	}

	public function OnPop() {
		ResetState();

	}




	public function Update() {

		if (!IsShowAnime) return;



		frameTimeCtrl -= Time.deltaTime;
		
		if( frameTimeCtrl < 0 ){
			aniIdx ++;
			if( aniIdx >= aniFramCnt ){
				aniIdx = 0;
			}
			
			aniLabel.image = imgs[aniIdx];
			
			frameTimeCtrl += 0.1; //0.1 means 10f/s
		}
	}
	
	public function DrawItem(){
		var oldColor: Color = GUI.color;

		if (IsBGTransparency)
			bgLabel.alpha = 0f;
		else
			bgLabel.alpha = bgLabelAlpha;

		GUI.color = new Color(0, 0, 0,bgLabel.alpha);	
		bgLabel.Draw();
		GUI.color = oldColor;

		if (IsShowAnime)
			aniLabel.Draw();

		CheckLoadingText();

		if (IsShowLoadingText)
			loadTextLabel.Draw();
	}




	public function DrawBackground() {

	}


	/*
	 * 只显示遮罩（透明）
	 * 不显示 loading文本、动画、背景颜色等
	 */
	public static function ShowPure() {
		IsShowLoadingText = false;
		IsShowAnime = false;
		IsBGTransparency = true;
	}

	/*
	 * 重置 显示状态
	*/
	public static function ResetState() {
		IsShowLoadingText = true;
		IsShowAnime = true;
		IsBGTransparency = false;
	}




    private function CheckLoadingText() : void
    {
        if (!String.IsNullOrEmpty(loadTextLabel.txt))
        {
            return;
        }
        
        if (!Datas.IsStringReady())
        {
            return;
        }
        
        loadTextLabel.txt = Datas.getArString(LoadingTextKey);
    }




	
}