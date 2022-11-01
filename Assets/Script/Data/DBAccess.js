/*  Javascript class for accessing SQLite objects.  
     To use it, you need to make sure you COPY Mono.Data.SQLiteClient.dll from wherever it lives in your Unity directory
     to your project's Assets folder
     Originally created by dklompmaker in 2009
     http://forum.unity3d.com/threads/28500-SQLite-Class-Easier-Database-Stuff    
     Modified 2011 by Alan Chatham           */
import          System.Data;  // we import our  data class
import          Mono.Data.Sqlite; // we import sqliteimport          System.IO;
class DBAccess {
	// variables for basic query access
	private var _dbcon : IDbConnection;

	public function getDbCon(){
		return _dbcon;
	}

    function OpenDB(p : String)
    {
    	var connection : String ="Data Source="+p;
    	var dbCon : IDbConnection = null;
	    try
	    {
	    	dbCon = new SqliteConnection(connection);
	    	dbCon.Open();
	    }
	    catch(e:System.Exception)
	    {
	    	dbCon.Dispose();
	    	throw;
	    }
	    
	    if ( _dbcon != null )
	    	_dbcon.Dispose();
	    _dbcon = dbCon;
    }
    function ExecuteNonQuery(cmdText:String,params:SqliteParameter[]):int
 	{
 		ExecuteNonQuery(null,cmdText,params);
 	}

    function ExecuteNonQuery(trans:IDbTransaction,cmdText:String,params:SqliteParameter[]):int
 	{
		var cmd:IDbCommand = getDbCon().CreateCommand();
		PrepareCommand(trans,cmd,cmdText,params);
		var result:int = cmd.ExecuteNonQuery();
		cmd.Dispose();
		return result;
	}
 
 	private static var gm_emptySqliteParameter = new SqliteParameter[0];
	private function __initParamNameArray(cmd:IDbCommand, paramsName : String[]) : System.Collections.IEnumerable
	{
		if ( !paramsName )
			return gm_emptySqliteParameter;

		var params : SqliteParameter[] = new SqliteParameter[paramsName.Length];
		for ( var i : int = 0; i != paramsName.Length; ++i )
		{
			params[i] = new SqliteParameter();
			params[i].ParameterName = paramsName[i];
			cmd.Parameters.Add(params[i]);
		}
		return params;
	}

 	public function ExecuteNonQueryV(trans : IDbTransaction, cmdText : String, dats : System.Collections.IEnumerable, paramsName : String[], getData : System.Func.<System.Object, int, String, System.Object>)
 	{
 		var cmd:IDbCommand = getDbCon().CreateCommand();
 		try
 		{
	    	cmd.Connection = _dbcon;
	    	cmd.CommandText = cmdText;
	    	cmd.CommandType = CommandType.Text;
	    	cmd.Transaction = trans;

	    	var params : SqliteParameter[] = __initParamNameArray(cmd, paramsName);
	 		for ( var dat : System.Object in dats )
	 		{
	 			var i : int = 0;
	 			for ( var param in params)
	 			{
	 				param.Value = getData(dat, i, param.ParameterName);
	 				++i;
	 			}
	 			cmd.ExecuteNonQuery();
	 		}
		 }
		 catch(e:System.Exception)
		 {
			KBN.UnityNet.reportErrorToServer("ExecuteNonQueryV.Exception",null,null,e.ToString(),false);
		 }
 		finally
 		{
 			cmd.Dispose();
 		}
 	}

	function ExcuteReader(cmdText:String,params:SqliteParameter[]):IDataReader
    {
    	return ExcuteReader(null,cmdText,params);
    }

    function ExcuteReader(trans:IDbTransaction,cmdText:String,params:SqliteParameter[]):IDataReader
    {
    	var cmd:IDbCommand = null;
    	try
    	{
    		cmd = getDbCon().CreateCommand();
	    	PrepareCommand(trans,cmd,cmdText,params);
	    	//var reader:IDataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
	    	var reader:IDataReader = cmd.ExecuteReader();
	    	return reader;
    	}
    	finally
    	{
    		if ( cmd != null )
    			cmd.Dispose();
    	}
    }
    
    function ExecuteScalar(cmdText:String,params:SqliteParameter[]):int
    {
    	ExecuteScalar(null,cmdText,params);
    }
    
    function ExecuteScalar(trans:IDbTransaction,cmdText:String,params:SqliteParameter[]):int
    {
    	var cmd:IDbCommand = null;
    	try{
    		cmd = getDbCon().CreateCommand();
	    	PrepareCommand(trans,cmd,cmdText,params);
	    	var result:Object = cmd.ExecuteScalar();
	    	return Convert.ToInt32(result);
    	}
    	finally
    	{
    		if ( cmd != null )
	    		cmd.Dispose();
    	}
    }

    private function PrepareCommand(cmd:IDbCommand,cmdText:String,params:SqliteParameter[])
    {
    	PrepareCommand(null,cmd,cmdText,params);
    }
    
    private function PrepareCommand(trans:IDbTransaction,cmd:IDbCommand,cmdText:String,params:SqliteParameter[])
    {
    	if(_dbcon.State != ConnectionState.Open)
    	{
    		_dbcon.Open();
    	}
    	cmd.Connection = _dbcon;
    	cmd.CommandText = cmdText;
    	cmd.CommandType = CommandType.Text;
    	cmd.Transaction = trans;
    	if(params != null)
    	{
    		for(var i:int = 0;i<params.length;i++)
    		{
    			cmd.Parameters.Add(params[i]);	
    		}
    	}
    }

    /***********************************no use all the follows***********************************************/
  	function CreateTable(name : String, col : Array, colType : Array,isPrimary:boolean){
  		CreateTable(null,col,colType,isPrimary);
  	}
    
    function CreateTable(trans:IDbTransaction,name : String, col : Array, colType : Array,isPrimary:boolean){ 
    	var cmdText:String = "CREATE TABLE " + name + "(" + col[0] + " " + colType[0] + (isPrimary==true? " PRIMARY KEY":"");
        for(var i=1; i<col.length; i++){
            cmdText += ", " + col[i] + " " + colType[i];
        }
        cmdText += ")";
        var cmd:IDbCommand = getDbCon().CreateCommand();

        PrepareCommand(trans,cmd,cmdText,null);
        cmd.ExecuteNonQuery();
       	cmd.Dispose();
	}
    
    function CloseDB(){
        if(_dbcon != null){
	        _dbcon.Dispose();
	        _dbcon = null;
        }
        GC.Collect();
    }
}
