
@Serializable
class	AmazonPaymentRecorderItem{
	public	var	transactionId:String = String.Empty;
	public	var	payoutId:String = String.Empty;
	public	var	amazonUserId:String = String.Empty;
	public	var	token:String = String.Empty;
	public	var	cents:String = String.Empty;
	public	var	currency:String = String.Empty;
	public	var	sku:String = String.Empty;
}

class	AmazonPaymentRecorder{
	private	static var recorder:AmazonPaymentRecorder;
	private	var	path:String;
	
	public	static	function getInstance():AmazonPaymentRecorder{
		if( recorder == null ){
			recorder = new AmazonPaymentRecorder();
			recorder.path = KBN._Global.ApplicationPersistentDataPath + "/Amazon/payment/";
			if( !Directory.Exists(recorder.path)){
				Directory.CreateDirectory(recorder.path);
			}
			_Global.Log("recorder.path:" + recorder.path);
		}
		
		return recorder;
	}
	
	public	function	addRecord(item:AmazonPaymentRecorderItem):void{
	
		
		var fileFullName:String = path + item.transactionId;
		if( File.Exists(fileFullName) ){
			return;
		}
	
		var fs:FileStream = new FileStream(fileFullName, FileMode.Create);

        // Construct a BinaryFormatter and use it to serialize the data to the stream.
        var formatter:System.Runtime.Serialization.Formatters.Binary.BinaryFormatter
        	= new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
        try 
        {
            formatter.Serialize(fs, item);
        }
        catch (e:System.Exception) 
        {
            UnityNet.reportErrorToServer( "CLIENT_ERROR", null, null, e.ToString(), false);
        }
        finally 
        {
            fs.Close();
        }
	}
	
	public	function	getRecords():AmazonPaymentRecorderItem[]{
		
		var ret:AmazonPaymentRecorderItem[] = null;
		
		var	dirInfo:DirectoryInfo = new DirectoryInfo(path);
		var finfos:FileInfo[] = dirInfo.GetFiles();
		if( finfos.length > 0 ){
			ret = new AmazonPaymentRecorderItem[finfos.length];
			for( var i:int = 0; i < finfos.length; i ++ ){
				ret[i] = readRecord( finfos[i].Name );
			}
		}
        
		return ret;
	}
	
	private	function	readRecord(transactionId:String):AmazonPaymentRecorderItem{
		var ret:AmazonPaymentRecorderItem;		
		var fileFullName:String = path + transactionId;

        var fs:FileStream = new FileStream(fileFullName, FileMode.Open);
        try 
        {
            var formatter:System.Runtime.Serialization.Formatters.Binary.BinaryFormatter
            	= new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();

            // Deserialize the hashtable from the file and 
            // assign the reference to the local variable.
            ret = formatter.Deserialize(fs);
        }
        catch (e:System.Exception) 
        {
            UnityNet.reportErrorToServer( "CLIENT_ERROR", null, null, e.ToString(), false);
        }
        finally 
        {
            fs.Close();
        }

		return ret;
	}
	
	public	function	delRecord(transactionId:String):void{
		var fileFullName:String = path + transactionId;
		if( File.Exists(fileFullName) ){
			File.Delete(fileFullName);
		}
	}
	
}