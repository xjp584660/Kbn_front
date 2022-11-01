class AssetBundleDownloadDialog extends PopMenu
{
	public var progress : Label;
	public var count : HashObject;
	public var progressBar : ProgressBar;
	public var downloadTip : Label;
	
	public function Init()
	{
		super.Init();
		progressBar.Init( null, 0, 100 );
		downloadTip.txt = Datas.getArString( "Loading.Download_Title" );
	}
	
	public function OnPush( param : Object )
	{
		count = param;
		super.OnPush(param);
		progress.Init();
		progress.SetVisible( true );
	}
	
	public function Update()
	{
		var percString = count["progress"].Value as String;
		progress.txt = percString + "%";
		var perc : int = Number.Parse( percString );
		progressBar.SetCurValue( perc );
	}
	
	public function DrawItem()
	{
		downloadTip.Draw();
		progress.Draw();
		progressBar.Draw();
	}
	
	
	public function CloseMenu():void
	{
		MenuMgr.getInstance().PopMenu("");
	}
}

