
using System.IO;
using System.Text;
using System.Runtime.Serialization.Formatters.Binary;
using System.Runtime.Serialization;
using System.Collections;
using UnityEngine;

public class SerializationUtils
{
    public static string FILEPATH = GetiPhoneDocumentsPath();
    public static int MAXLINE = 1000;
    public static int DISPLAY_LINE = 10;
    public static int READ_MORE_LINE = 20;
	public void CreateFolder(string dirName)
	{
    	var dir = new DirectoryInfo(FILEPATH + "/" +dirName + "/");
		if(!dir.Exists){
		   dir.Create();
		}
    }
    
	public Hashtable HashObjectToHashtable(HashObject obj){
		var hash = new Hashtable();
		if ( obj == null || obj.Table == null )
			return hash;
		foreach (DictionaryEntry dic in obj.Table){
			var temp = dic.Value as HashObject;
			if(temp.Table.Count > 0){
				hash[dic.Key] = HashObjectToHashtable(temp);
			}
			else{
				hash[dic.Key] = temp.Value;
			}
		}
		return hash;
	}
	public int getFileNumBySuffix(DirectoryInfo dir, string suffix){
		int total = 0;
		if(dir.Exists){
			var num = dir.GetFiles().Length;
			for(var i = 0;i<num;i++){
				var file = dir.GetFiles()[i];
				if(file.Name.EndsWith(suffix)){
				 	total++;
				}
			}
		}
		return total;
	}
	
	public Hashtable BytesToHashtable(byte[] bytes)
	{
		var formater = new BinaryFormatter();
		var stream = new MemoryStream(bytes);
		var hash = formater.Deserialize(stream) as Hashtable;
		stream.Close();
		return hash;
	}
	
	public byte[] HashtableToBytes(Hashtable hash)
	{
    	var formater = new BinaryFormatter();
    	var stream = new MemoryStream();
    	formater.Serialize(stream,hash);
    	stream.Flush();
    	
    	stream.Position = 0;
    	var bytes = new byte[stream.Length];
    	stream.Read(bytes,0,System.Convert.ToInt32(stream.Length));
    	stream.Close();
    	return bytes;
	}
	
	public static string GetiPhoneDocumentsPath ()
	{
		if(RuntimePlatform.Android == Application.platform)
    	{
    		return KBN._Global.ApplicationPersistentDataPath + Application.dataPath.Substring (0, Application.dataPath.Length - 6);
    	}
		else
		{
			return KBN._Global.ApplicationPersistentDataPath;
	        // Your game has read+write access to /var/mobile/Applications/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/Documents 
	        // Application.dataPath returns              
	        // /var/mobile/Applications/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/myappname.app/Data 
	        // Strip "/Data" from path 
#if false
	        var path = Application.dataPath.Substring (0, Application.dataPath.Length - 5); 
	        // Strip application name 
	        path = path.Substring(0, path.LastIndexOf('/'));  
	        return path + "/Documents";
#endif
	 	}
	        //return Application.temporaryCachePath;
        
        
        
    }
    
	private static SerializationUtils _instance;
	public static SerializationUtils getInstance()
	{
	    if(_instance == null){
	     	_instance = new SerializationUtils();
	    }  
	    return _instance;
	}
	private SerializationUtils(){}
}
