using UnityEngine;
using System.Collections;
using System.IO;
public class LogTools  {
	/*
	 * 过滤类型：none 不过滤，
		normal 根据filterstring进行包含匹配过滤，
		start  根据起始字符串进行包含匹配filterstring
		end    根据结尾字符串进行包含匹配filterstring
	 * */
	public enum FilterType{
		None,
		normal,
		Start,
		End
	}
	private static LogTools instance;
	private static object  lockObj=new object();

	public string filterString="";
	public FilterType filterType=FilterType.Start;
	[SerializeField]
	private bool clearOldFile=true;
	private string path;
	private bool isSaveLog=false;

	public bool IsSaveLog {
		get {
			return isSaveLog;
		}
		set {
			isSaveLog = value;
		}
	}

	public static LogTools Instacne{
		get{
			if(instance==null){
				lock(lockObj){
					instance=new LogTools();
				}
			}
			return instance;
		}

	}
	public void Init(){

		path=KBN.GameMain.GetApplicationDataSavePath()+"/log.txt";
		if(PlayerPrefs.HasKey("clearLogFlag")){
			clearOldFile=PlayerPrefs.GetInt("clearLogFlag")>0?true:false;
		}
		if(clearOldFile){
			ClearLog();
		}

	}


	
	public bool ClearOldFile {
		get {
			return clearOldFile;
		}
		set {
			clearOldFile = value;
		}
	}

	public void SaveLog(string message){
//		int index=message.IndexOf(':');
//		if(message.Length<=index+1) return;
//		string log=message.Substring(index+1,message.Length-index-1);
//		if(string.IsNullOrEmpty(message)) return;
//		bool isSave=false;
//		switch (filterType) {
//		case FilterType.None:
//				isSave=true;
//			break;
//		case FilterType.normal:
//			if(log.Contains(filterString))
//				isSave=true;
//			break;
//		case FilterType.Start:
//			if(log.StartsWith(filterString))
//				isSave=true;
//			break;
//		case FilterType.End:
//			if(log.EndsWith(filterString))
//				isSave=true;
//			break;
//		default:
//			break;
//		}
//		if(isSave)
		if(isSaveLog) SaveToFile(message);
	}

	void SaveToFile(string data){
		 
		if(!File.Exists(path)) 
		{
			File.Create(path);
			return;
		}
		using(StreamWriter sw=new StreamWriter(path,true)){
			sw.WriteLine(data);
			sw.Flush();
//			sw.Close();
		}
			
			

	}

	public string getLog(string filter,out int num){
		num = 0;
		if(!File.Exists(path)) 
		{
			return string.Empty;
		}
		System.Text.StringBuilder sb = new System.Text.StringBuilder ();
		
		using(StreamReader sr=new StreamReader(path)){
			string logString = sr.ReadLine ();

			
			
			
			while (logString!=null) {


				bool flag = false;
				if (string.IsNullOrEmpty (logString)) {
					flag = false;
				}else if(string.IsNullOrEmpty (filter)){
					flag = true;
				} else {
					int index=logString.IndexOf(':');
					if(logString.Length<=index+1) break;
					logString=logString.Substring(index+1,logString.Length-index-1);

					switch (filterType) {
					case FilterType.None:
						flag = true;
						break;
					case FilterType.normal:
						if(logString.Contains(filter))
							flag=true;
						break;
					case FilterType.Start:
						if(logString.StartsWith(filter))
							flag=true;
						break;
					case FilterType.End:
						if(logString.EndsWith(filter))
							flag=true;
						break;
					default:
						break;
					}
				}
				
				if (flag) {
					num++;
					sb.Append (logString+"\n");
					Debug.Log (logString);
				}
				
				logString = sr.ReadLine ();
			}
			
		}
		return sb.ToString ();
	}


	public void ClearLog(){
		if(File.Exists(path)){
			using(StreamWriter sw = new StreamWriter(path,false))
			{
				sw.WriteLine("");
			}
		}
	}
	
	
	



}
