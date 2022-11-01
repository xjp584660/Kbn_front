class UIBIMgr extends KBN.UIBIMgr
{

    private	static var	gm_framesInSecond:int =0;
	private	static var	gm_timeLeft:float = 1.0;
	static var gm_framelimit:int = 17;
    private var gm_isOpen:Boolean = false;
    
    private var array:Array = new Array();

    private var curMenuName:String;

    private var dateStr:String = "";

    private var totalNum:int = 0;

    public static function getInstance():UIBIMgr
    {
        { 
			if (Instance == null) {
				
                    var go:GameObject = new GameObject ("UIBIMgr");
                    Instance = go.AddComponent(UIBIMgr);
                    GameMain.instance().resgisterRestartFunc(function(){
                        UIBIMgr.getInstance().OnGameOver();
                        Instance = null;
                        Destroy(go);
                    });
			}
			return Instance;
		}

    }

    function Start()
    {
        if(Application.platform == RuntimePlatform.Android ){
            gm_framelimit = 14;
            applicationTxtDir = Application.temporaryCachePath ;
        }else if(Application.platform == RuntimePlatform.IPhonePlayer){
            gm_framelimit = 17;
            applicationTxtDir = Application.temporaryCachePath ;
        }else{
            gm_framelimit = 17;
            applicationTxtDir = KBN._Global.ApplicationPersistentDataPath + "/txt";
            //_Global.LogWarning("gm_frmaelimit = :"+gm_framelimit);
        }
        var str:String = ReadFile();
        if(str!=null){
            UnityNet.sendFPSDate(str,null,null);
        }
    }
	function Update () {
        if(!gm_isOpen){
             return;
		}
		gm_timeLeft -= Time.deltaTime;
		++gm_framesInSecond;

        if( gm_timeLeft > 0.0 ) return;
        //_Global.LogWarning("gm_framesInSecond: "+gm_framesInSecond);
		if (gm_framesInSecond < gm_framelimit)
		{
           dateStr += curMenuName + "," + gm_framesInSecond + "," +GameMain.unixtime()+";";
           totalNum ++ ;
         //  _Global.LogWarning("totalNum:"+totalNum);
		}
        if(totalNum > 19)
        {
            UnityNet.sendFPSDate(dateStr,null,null);
            totalNum = 0;
            dateStr="";
        }
		gm_timeLeft = 1;
        gm_framesInSecond = 0;
    }
    
    public function OnMenuPush(menuName:String)
    {
        //_Global.LogWarning("Pushmenu:"+menuName);
        curMenuName = menuName;
        gm_isOpen = true;
        gm_timeLeft = 1;
        gm_framesInSecond = 0;
    }
    public function OnMenuPop(menuName:String)
    {
       // _Global.LogWarning("Popmenu:"+menuName);
        if(curMenuName!=menuName) return;
        gm_isOpen = false;
        gm_timeLeft = 1;
        gm_framesInSecond = 0;
    }
    public function OnGameOver()
    {
        var fullPath:String = applicationTxtDir + FILE_SUFFIX;
        var fileInfo:FileInfo = new FileInfo(fullPath);
        if(fileInfo!=null)
            fileInfo.Delete();
        if(totalNum>0)
        {
            //UnityNet.sendFPSDate(dateStr,null,null);
            WriteToFile(dateStr);
            totalNum = 0;
        }
    }
    function OnDestroy(){
        //_Global.LogWarning("OnDestroy");
        OnGameOver();
        Instance = null;
    }
    private var applicationTxtDir:String;

    private var FILE_SUFFIX:String = "/clientFPS.txt";

    function WriteToFile(content:String):void
    {
        var fullPath:String = applicationTxtDir + FILE_SUFFIX;
        // var fileInfo:FileInfo = new FileInfo(fullPath);
        // if(fileInfo!=null)
        //     fileInfo.Delete();
        var fs:FileStream = null;
        //write new file
        try
        {
            var sw:StreamWriter = new StreamWriter(fullPath,false);
            sw.Write(content);
            sw.Close();
            //_Global.LogWarning("write over");
        }
        catch(ex:Exception)
        {
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
            //_Global.LogWarning(ex.ToString());
        }
    }

    function ReadFile():String
    {
        var	ret:String;
		var fullPath:String = applicationTxtDir + FILE_SUFFIX;
		
        try
        {
            var sr:StreamReader = new StreamReader(fullPath);
            ret = sr.ReadToEnd();
            sr.Close();
            //_Global.LogWarning("read over"+ret);
        }
        catch(ex:Exception)
        {
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
            //_Global.LogWarning(ex.ToString());
            return null;
        }

		return ret;
    }
}
