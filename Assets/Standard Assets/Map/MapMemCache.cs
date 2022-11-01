using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using GameMain = KBN.GameMain;
using _Global = KBN._Global;
using UnityNet = KBN.UnityNet;

public class TournamentMarchData {
	//
	public string marchId;
	public long startTime;
	public long endTime;
	public int startX;
	public int startY;
	public int endX;
	public int endY;
	//
	public string startTileName;
	public string endTileName;
	//
	public bool isDone;
	public float doneTime;
	//
	public TournamentMarchData(HashObject data) {
		marchId = _Global.GetString(data["marchId"]);
		
		startTime = _Global.INT64(data["marchUnixTime"]);
		endTime = _Global.INT64(data["destinationUnixTime"]);
		
		startX = _Global.INT32(data["fromXCoord"]);
		startY = _Global.INT32(data["fromYCoord"]);
		startTileName = "l_" + startX + "_t_" + startY;
		endX = _Global.INT32(data["toXCoord"]);
		endY = _Global.INT32(data["toYCoord"]);
		endTileName = "l_" + endX + "_t_" + endY;
		
		isDone = (GameMain.unixtime() >= endTime);
		doneTime = 0.0f;
	}
};

public class MapMemCache {

	public class BlockData{
		public long lastUpdateTime;
		public string name;
		public int startX;
		public int startY;
		
		public HashObject[,] data= new HashObject[Constant.Map.BLOCK_TILE_CNT, Constant.Map.BLOCK_TILE_CNT];

		public Dictionary<string, Dictionary<string, TournamentMarchData>> relatedTournamentMarches = new Dictionary<string, Dictionary<string, TournamentMarchData>>();
		
		public int visitCnt;
	}
	
	public class AdditionInfoData{
		public long lastUpdateTime;
		public string name;
		
		public HashObject data= new HashObject();
		
	}
	
	public	static	int UPDATE_DUARATION = 60*3;
	private	static	int CACHE_BLOCK_MAX_SIZE = 64;
	private	static	MapMemCache singleton;

	public class DataSet {
		public	List<BlockData> cacheBlocks = new List<BlockData>();
		public	List<AdditionInfoData> cacheUserInfos = new List<AdditionInfoData>();
		public	List<AdditionInfoData> cacheAllianceInfos = new List<AdditionInfoData>();
		public List<AdditionInfoData> cacheActivityTiles = new List<AdditionInfoData>(); // "tournament" => ""
		public Dictionary<string, BlockData> cacheBlockTable = new Dictionary<string, BlockData>();
	}

	private DataSet m_set1 = new DataSet(); // For the original world map
	private DataSet m_set2 = new DataSet(); // For the AVA minimap
	private DataSet m_set;
	private bool m_enableBlockCacheSizeLimit = true;

	

	public bool EnableBlockCacheSizeLimit {
		set { m_enableBlockCacheSizeLimit = value; }
	}

	public	static	MapMemCache instance(){
		if( null == singleton ){
			singleton = new MapMemCache();
			GameMain.singleton.resgisterRestartFunc(new Action(delegate (){
				singleton = null;
			}));
		}
		return singleton;
	}

	private bool isLoad=false;
	public bool IsLoad{
		get{
			if(!isLoad){
				isLoad=PlayerPrefs.GetString("BaseTileData_"+KBN.Datas.singleton.worldid(),"")!="";
			}
			return isLoad;
		}
	}

	private string baseTileDataString;
	private byte[] baseTileDataBytes;
	
	private byte[] BaseTileDataBytes{
		get{
			if(baseTileDataBytes==null){
				baseTileDataString=PlayerPrefs.GetString("BaseTileData_"+KBN.Datas.singleton.worldid(),"");
				if(baseTileDataString!=""){
					baseTileDataBytes=Convert.FromBase64String(baseTileDataString);
				}
			}
			return baseTileDataBytes;
		}
	}

	private string[] mapType;
	private string[] MapType{
		get{
			if(mapType==null){
				baseTileDataString=PlayerPrefs.GetString("mapTypeString"+KBN.Datas.singleton.worldid(),"");
				if(baseTileDataString!=""){
					 mapType=baseTileDataString.Split(';');
				}
			}
			return mapType;
		}
	}


	public void SetBaseTileDatas(HashObject result){
		if(result!=null&&_Global.GetBoolean(result["ok"])){
			PlayerPrefs.SetString("BaseTileData_"+KBN.Datas.singleton.worldid(),result["data"].Value.ToString());			
			Hashtable mapType=result["typeMap"].Table;
			int count=mapType.Count;
			string mapTypeString="";
			for(int i=0;i<count;i++){
				mapTypeString+=_Global.INT32(mapType[_Global.ap + i]);
				if(i!=count-1){
					mapTypeString+=";";
				}
			}
			PlayerPrefs.SetString("mapTypeString"+KBN.Datas.singleton.worldid(),mapTypeString);
			if(result["md5"] != null && result["md5"].Value.ToString() != "")
			{
				PlayerPrefs.SetString("mapMD5"+KBN.Datas.singleton.worldid(),result["md5"].Value.ToString());
			}
		}

		// dataString=PlayerPrefs.GetString("BaseTileData_"+KBN.Datas.singleton.worldid(),"");
		// baseTileDataString=dataString;
		// baseTileDataBytes=Convert.FromBase64String(baseTileDataString);
	}
	//获取单个tile基础数据
	public void GetBaseTile(int x,int y,ref byte typeData){
		int index=(x-1)*800+(y-1);
		if (index<0||index>640000)
		{ 
			return;
		}
		// Debug.LogWarning("index="+index+" x:"+x+" y:"+y);
		if(BaseTileDataBytes!=null&&BaseTileDataBytes.Length>(index+1)){
//ProfilerSample.BeginSample("MapMemCache.GetBaseTile");
			typeData=BaseTileDataBytes[index];
//ProfilerSample.EndSample();	
			// KBN._Global.ByteToValue(tileByte,lv,type);
		}
	}

	public void ByteToValue(byte b,ref int lv,ref int type){
        if(b!=0)
        {
            lv=b>>4;
            type=b-(lv<<4);
            // Debug.LogWarning("type1:"+type);
            if(MapType!=null){
          		 int.TryParse(MapType[type], out type);
            }
            // Debug.LogWarning("type2:"+type);
        }
        // Debug.LogWarning("lv:"+lv+" type:"+type);
    }

	public MapMemCache() {
		CACHE_BLOCK_MAX_SIZE = _Global.IsLowEndProduct() ? 32 : 64;
		m_set = m_set1;
	}
	
	public void switchDataSet( bool originalWorldMap ) {
		m_set = originalWorldMap ? m_set1 : m_set2;
	}

	public	bool hasData(){
		return	m_set.cacheBlocks.Count > 0;
	}
	
	public	void clear(){
		m_set.cacheBlocks.Clear();
		m_set.cacheUserInfos.Clear();
		m_set.cacheAllianceInfos.Clear();

		m_set.cacheBlockTable.Clear();
	}

	public void updateTime()
	{
		var protect = protectionDatas.GetEnumerator();
		while(protect.MoveNext())
		{
			TileProtectionData temp = protect.Current.Value as TileProtectionData;
			updateAVAProtectionTime(temp.protectionTileId, temp.protectionTime);
		}

		for(int i = 0; i < remoteProtectionDatas.Count; ++i)
		{
			protectionDatas.Remove(remoteProtectionDatas[i].protectionTileId);
		}
	}
	
	public class TileProtectionData
	{
		public int protectionTileId = 0;
		public long protectionTime = 0;
	}
	
	public Dictionary<int, TileProtectionData> protectionDatas = new Dictionary<int, TileProtectionData>();
	public List<TileProtectionData> remoteProtectionDatas = new List<TileProtectionData>();
	public void updateAVAProtectionTime( int tileId, long time ) {
		if( m_set == m_set2 ) {
			int x = ( ( tileId - 1 ) % Constant.Map.AVA_MINIMAP_WIDTH ) + 1;
			int y = ( tileId - 1 ) / Constant.Map.AVA_MINIMAP_WIDTH + 1;
			HashObject b = getTileInfoData( x, y );
			if( b != null ) {
				b["protectTime"] = new HashObject();
				b["protectTime"].Value = ""+time;

				MapController mc = GameMain.singleton.getMapController2();
				if( mc != null ) {
					if( b["tileType"] != null ) {
						int tileType = _Global.INT32( b["tileType"] );
						mc.updateTileProtectionCover( tileId, tileType, 0, time );

						if(protectionDatas.ContainsKey(tileId))
						{
							// At this point a protection cover should be generated
							// on the tile in which case the info of this tile should
							// be updated so that the player can see the right buttons
							// on the tile info pop-up.
							KBN.GameMain.singleton.forceRepaintWorldMap2();
							remoteProtectionDatas.Add(protectionDatas[tileId]);
						}
						//_Global.LogWarning("Yes tile 726  6  10  !!!!!!!!!!!!!");
					}
				}
			}
			else
			{
				//_Global.LogWarning("No tile 726  6  10  !!!!!!!!!!!!!");
				if(!protectionDatas.ContainsKey(tileId))
				{
					TileProtectionData proData = new TileProtectionData();
					proData.protectionTime = time;
					proData.protectionTileId = tileId;

					protectionDatas.Add(tileId, proData);
				}
			}
		}
	}
	
	public	void onUserNameChanged(uint uid, string newUserName){
		HashObject userData = getUserInfoData("u" + uid);
		if( null == userData ){
			return;
		}
		
		userData["n"].Value = newUserName;
	}
	
	public	void onCityNameChanged(int x, int y, string newCityName){
		HashObject tileData = getTileInfoData(x,y);
		if( null == tileData || null == tileData["cityName"]){
			return;
		}
		
		tileData["cityName"].Value = newCityName;
	}
	
	public	HashObject getTileInfoData(int x, int y){
		int blockX = ((x-1)/Constant.Map.BLOCK_TILE_CNT) * Constant.Map.BLOCK_TILE_CNT;
		int blockY = ((y-1)/Constant.Map.BLOCK_TILE_CNT) * Constant.Map.BLOCK_TILE_CNT;
		/*
		StringBuilder sb = new StringBuilder();
		sb.Capacity = 32;
		sb.Append( "bl_" );
		sb.Append( blockX );
		sb.Append( "_bt_" );
		sb.Append( blockY );
*/
		BlockData blockData = findBlock("bl_" + blockX + "_bt_" + blockY);
		if( blockData == null ) {
			return null;
		}
		int _x = x - 1 - blockX;
		int _y = y - 1 - blockY;
		if( _x < 0 || _x >= Constant.Map.BLOCK_TILE_CNT )
			return null;
		if( _y < 0 || _y >= Constant.Map.BLOCK_TILE_CNT )
			return null;
		return blockData.data[_x, _y];
	}

	public bool IsCityTile(int x, int y)
	{
		HashObject tileInfoData = getTileInfoData(x, y);
		if(tileInfoData == null)
		{
			return false;
		}

		int cityType = _Global.INT32(tileInfoData["cityType"]);
		int tileCityId = _Global.INT32(tileInfoData["tileCityId"]);
		int tileType = _Global.INT32(tileInfoData["tileType"]);

		if(tileCityId != 0 && tileType == 51)
		{	
			return true;
		}

		return false;
	}

	//更新单个info
	public	void setTileInfoData(int x, int y,HashObject info){
		int blockX = ((x-1)/Constant.Map.BLOCK_TILE_CNT) * Constant.Map.BLOCK_TILE_CNT;
		int blockY = ((y-1)/Constant.Map.BLOCK_TILE_CNT) * Constant.Map.BLOCK_TILE_CNT;
		/*
		StringBuilder sb = new StringBuilder();
		sb.Capacity = 32;
		sb.Append( "bl_" );
		sb.Append( blockX );
		sb.Append( "_bt_" );
		sb.Append( blockY );
*/
		BlockData blockData = findBlock("bl_" + blockX + "_bt_" + blockY);
		if( blockData == null ) {
			return ;
		}
		int _x = x - 1 - blockX;
		int _y = y - 1 - blockY;
		if( _x < 0 || _x >= Constant.Map.BLOCK_TILE_CNT )
			return ;
		if( _y < 0 || _y >= Constant.Map.BLOCK_TILE_CNT )
			return ;
	    blockData.data[_x, _y]=info;
	}

	public string getTileInfoSting(int x,int y){
		int blockX = ((x-1)/Constant.Map.BLOCK_TILE_CNT) * Constant.Map.BLOCK_TILE_CNT;
		int blockY = ((y-1)/Constant.Map.BLOCK_TILE_CNT) * Constant.Map.BLOCK_TILE_CNT;

		BlockData blockData = findBlock("bl_" + blockX + "_bt_" + blockY);
		if( blockData == null ) {
			return null;
		}
		int _x = x - 1 - blockX;
		int _y = y - 1 - blockY;
		if( _x < 0 || _x >= Constant.Map.BLOCK_TILE_CNT )
			return null;
		if( _y < 0 || _y >= Constant.Map.BLOCK_TILE_CNT )
			return null;
		return "bl_" + blockX + "_bt_" + blockY;
	}
	
	public	HashObject getTileInfoData(string tileName){
		
		string[] nameSplits = tileName.Split('_');
		int x = _Global.INT32( nameSplits[1] );
		int y = _Global.INT32( nameSplits[3] );
		
		return getTileInfoData(x,y);
	}
	
	public	HashObject getUserInfoData(string uName){
		AdditionInfoData userInfo = findAdditionInfo( uName, m_set.cacheUserInfos );
		HashObject ret = null;
		if( userInfo != null ){
			ret = userInfo.data;
		}
		return ret;
	}
	
	public	HashObject getAllianceInfoData(string aName){
		AdditionInfoData allianceInfo = findAdditionInfo( aName, m_set.cacheAllianceInfos );
		HashObject ret = null;
		if( allianceInfo != null ){
			ret = allianceInfo.data;
		}
		return ret;
	}
	
	public	bool valideBlock( BlockData cacheBlock ){
		return	GameMain.unixtime() - cacheBlock.lastUpdateTime < UPDATE_DUARATION;
	}
	
	private	AdditionInfoData findAdditionInfo( string additionName, List<AdditionInfoData> additionArray ){
		AdditionInfoData ret = null;
		
		for ( int i = 0; i < additionArray.Count; i ++ ){
			
			if( additionArray[i].name == additionName ){
				ret = additionArray[i];
				break;
			}
		}
		
		return	ret;
	}

	public	BlockData findBlock( string blockName ){
		// _Global.LogWarning("m_set.cacheBlockTable ：" + m_set.cacheBlockTable.Count);
		if (m_set.cacheBlockTable.ContainsKey(blockName))
			return m_set.cacheBlockTable[blockName];
		return null;
	}
	
	public	void updateAdditionInfo(HashObject allianceNames, HashObject allianceMights, HashObject allianceLeagues, HashObject userInfo,
	                               HashObject activityTiles, HashObject marchInfo ){
		
		//find the oldest block, if additionInfo updatetime < oldest block time, then del the additionInfo
		long oldestBlockTime = 0;
		if( m_set.cacheBlocks.Count > 0 ){
			oldestBlockTime = m_set.cacheBlocks[m_set.cacheBlocks.Count - 1].lastUpdateTime;
		}
		
		
		updateUserInfo( userInfo, oldestBlockTime );
		updateAllianceInfo(allianceNames, allianceMights, allianceLeagues, oldestBlockTime );
		if( activityTiles != null ) {
			updateActivityTiles( activityTiles, oldestBlockTime );
		}
		if( marchInfo != null ) {
			updateTournamentMarchInfo( marchInfo, oldestBlockTime );
		}
	}

	private void updateAdditionInfoDataList( List<AdditionInfoData> cacheData, HashObject inputData, long oldestBlockTime ) {
		if( inputData == null ) {
			return;
		}
		List<AdditionInfoData> newestArray = new List<AdditionInfoData>();
		int i;
		int k;
		List<string> keys = new List<string>(_Global.GetObjectKeys( inputData ));

		// Find the updated ones in the original list
		for( k = 0; k < keys.Count; k++ ) {
			for( i = 0; i < cacheData.Count; i++ ) {
				if( cacheData[i].name == keys[k] ) {
					cacheData[i].lastUpdateTime = GameMain.unixtime();
					cacheData[i].data = inputData[keys[k]];
					newestArray.Add( cacheData[i] );
					cacheData.RemoveAt(i);
					keys.RemoveAt(k);
					--k;
					break;
				}
			}
		}
		AdditionInfoData tempInfo;
		for( k = 0; k < keys.Count; k ++ ) { // Left keys that don't exist in the original list
			tempInfo = new AdditionInfoData();
			tempInfo.lastUpdateTime = GameMain.unixtime();
			tempInfo.name = keys[k];
			tempInfo.data = inputData[keys[k]];
			newestArray.Add(tempInfo);
		}
		// Remove all the data that eariler than the oldest block time
		for( i = cacheData.Count - 1; i >= 0; i -- ){
			if( cacheData[i].lastUpdateTime >= oldestBlockTime ){
				break;
			}
			
			cacheData.RemoveAt(cacheData.Count - 1);//delete the oldest one
		}
		// Insert the new data
		for( i = 0; i < newestArray.Count; i ++ ) {
			cacheData.Insert( 0, newestArray[i] );
		}
	}

	private void updateActivityTiles( HashObject tiles, long oldestBlockTime ) {
		updateAdditionInfoDataList( m_set.cacheActivityTiles, tiles, oldestBlockTime );

		// Update the activity tiles in the socket context
		KBN.TournamentManager.getInstance().updateActivityTilesBegin();
		for( int i = 0; i < m_set.cacheActivityTiles.Count; ++i ) {
			KBN.TournamentManager.getInstance().updateActivityTile( m_set.cacheActivityTiles[i].data );
		}
		KBN.TournamentManager.getInstance().updateActivityTilesEnd();

	}

	private BlockData getBlockForTile(int x, int y) {
		int blockX = ((x-1)/Constant.Map.BLOCK_TILE_CNT) * Constant.Map.BLOCK_TILE_CNT;
		int blockY = ((y-1)/Constant.Map.BLOCK_TILE_CNT) * Constant.Map.BLOCK_TILE_CNT;
		return findBlock("bl_" + blockX + "_bt_" + blockY);
	}

	private BlockData getBlockForTile(string tileName) {
		string[] nameSplits = tileName.Split('_');
		int x = _Global.INT32( nameSplits[1] );
		int y = _Global.INT32( nameSplits[3] );
		return getBlockForTile(x, y);
	}

	// TODO
	public void debugAddTournamentMarchInfo( HashObject march ) {
		TournamentMarchData marchInfo = new TournamentMarchData(march);
		
		BlockData block = getBlockForTile(marchInfo.startX, marchInfo.startY);
		if (null != block) {
			if (!block.relatedTournamentMarches.ContainsKey(marchInfo.startTileName))
				block.relatedTournamentMarches[marchInfo.startTileName] = new Dictionary<string, TournamentMarchData>();
			block.relatedTournamentMarches[marchInfo.startTileName][marchInfo.marchId] = marchInfo;
		}
		
		block = getBlockForTile(marchInfo.endX, marchInfo.endY);
		if (null != block) {
			if (!block.relatedTournamentMarches.ContainsKey(marchInfo.endTileName))
				block.relatedTournamentMarches[marchInfo.endTileName] = new Dictionary<string, TournamentMarchData>();
			block.relatedTournamentMarches[marchInfo.endTileName][marchInfo.marchId] = marchInfo;
		}
	}

	private void updateTournamentMarchInfo( HashObject march, long oldestBlockTime ) {
//		HashObject rearrangedData = new HashObject();
		object[] arrays = _Global.GetObjectValues(march);
		for (int i = 0; i < arrays.Length; i++) {
			object[] array = _Global.GetObjectValues(arrays[i] as HashObject);
			for (int j = 0; j < array.Length; j++) {
				TournamentMarchData marchInfo = new TournamentMarchData(array[j] as HashObject);

				BlockData block = getBlockForTile(marchInfo.startX, marchInfo.startY);
				if (null != block) {
					if (!block.relatedTournamentMarches.ContainsKey(marchInfo.startTileName))
						block.relatedTournamentMarches[marchInfo.startTileName] = new Dictionary<string, TournamentMarchData>();
					block.relatedTournamentMarches[marchInfo.startTileName][marchInfo.marchId] = marchInfo;
				}

				block = getBlockForTile(marchInfo.endX, marchInfo.endY);
				if (null != block) {
					if (!block.relatedTournamentMarches.ContainsKey(marchInfo.endTileName))
						block.relatedTournamentMarches[marchInfo.endTileName] = new Dictionary<string, TournamentMarchData>();
					block.relatedTournamentMarches[marchInfo.endTileName][marchInfo.marchId] = marchInfo;
				}
			}
		}
	}

	public List<TournamentMarchData> getTournamentMarchInfo ( string tileName ) {
		BlockData block = getBlockForTile(tileName);
		if (null == block || !block.relatedTournamentMarches.ContainsKey(tileName)) 
			return null;
		return new List<TournamentMarchData>(block.relatedTournamentMarches[tileName].Values);
	}
	
	private	void updateUserInfo( HashObject userInfo, long oldestBlockTime){
		if( userInfo == null ){
			return;
		}
		
		List<AdditionInfoData> newestArray = new List<AdditionInfoData>();
		int i;
		int k;
		//remove new userinfo from cacheUserInfos and add them to newestArray
		List<string> keys = new List<string>(_Global.GetObjectKeys( userInfo ));
		for( k = 0; k < keys.Count; k ++ ){
			for( i = 0; i < m_set.cacheUserInfos.Count; i ++ ){
				if( m_set.cacheUserInfos[i].name == keys[k] ){
					//					_Global.Log("update name:" + keys[k]);
					m_set.cacheUserInfos[i].lastUpdateTime = GameMain.unixtime();
					m_set.cacheUserInfos[i].data = userInfo[keys[k]];
					
					newestArray.Add(m_set.cacheUserInfos[i]);
					m_set.cacheUserInfos.RemoveAt(i);
					keys.RemoveAt(k);
					k --;
					
					
					break;
				}
			}
		}
		
		AdditionInfoData tempInfo;
		for( k = 0; k < keys.Count; k ++ ){
			tempInfo = new AdditionInfoData();
			tempInfo.lastUpdateTime = GameMain.unixtime();
			tempInfo.name = keys[k];
			tempInfo.data = userInfo[keys[k]];
			//			_Global.Log("add name:" + keys[k]);
			
			newestArray.Add(tempInfo);
		}
		
		//del the userInfo that older than the oldest block
		for( i = m_set.cacheUserInfos.Count - 1; i >= 0; i -- ){
			if( m_set.cacheUserInfos[i] .lastUpdateTime >= oldestBlockTime ){
				break;
			}
			
			m_set.cacheUserInfos.RemoveAt(m_set.cacheUserInfos.Count - 1);//delete the oldest one
		}
		
		//add newUserInfos to cacheUserInfos
		for( i = 0; i < newestArray.Count; i ++ ){
			m_set.cacheUserInfos.Insert( 0, newestArray[i] );
		}
		
	}
	
	private	void updateAllianceInfo( HashObject allianceNames, HashObject allianceMights,HashObject allianceLeagues, long oldestBlockTime ){
		if( allianceMights == null || allianceNames == null || allianceLeagues == null)
		{
			return;
		}
		
		List<AdditionInfoData> newestArray = new List<AdditionInfoData>();
		int i;
		int k;
		List<string> keys = new List<string>(_Global.GetObjectKeys( allianceNames ));
		for( k = 0; k < keys.Count; k ++ ){
			for( i = 0; i < m_set.cacheAllianceInfos.Count; i ++ ){
				AdditionInfoData allianceInfo = m_set.cacheAllianceInfos[i];
				if( allianceInfo.name == keys[k] ){
					allianceInfo.lastUpdateTime = GameMain.unixtime();
					allianceInfo.data["allianceName"] = allianceNames[keys[k]];
					allianceInfo.data["allianceMight"] = allianceMights[keys[k]];
					allianceInfo.data["allianceLeague"] = allianceLeagues[keys[k]];
					newestArray.Add(allianceInfo);
					m_set.cacheAllianceInfos.RemoveAt(i);
					keys.RemoveAt(k);
					k --;
					break;
				}
			}
		}
		
		AdditionInfoData tempInfo;
		for( k = 0; k < keys.Count; k ++ ){
			tempInfo = new AdditionInfoData();
			tempInfo.lastUpdateTime = GameMain.unixtime();
			tempInfo.name = keys[k];
			tempInfo.data["allianceName"] = allianceNames[keys[k]];
			tempInfo.data["allianceMight"] = allianceMights[keys[k]];
			tempInfo.data["allianceLeague"] = allianceLeagues[keys[k]];
			newestArray.Add(tempInfo);
		}
		
		for( i = m_set.cacheAllianceInfos.Count - 1; i >= 0; i -- ){
			if( (m_set.cacheAllianceInfos[i] as AdditionInfoData).lastUpdateTime >= oldestBlockTime ){
				break;
			}
			
			m_set.cacheAllianceInfos.RemoveAt(m_set.cacheAllianceInfos.Count - 1);//delete the oldest one
		}
		
		for( i = 0; i < newestArray.Count; i ++ ){
			m_set.cacheAllianceInfos.Insert(0, newestArray[i] );
		}
	}

	public	void updateBlock( string blockName, HashObject data ){
		BlockData newest = null;
		int i;
		int j;
		for( i = 0; i < m_set.cacheBlocks.Count; i ++ ){
			if( m_set.cacheBlocks[i].name == blockName ){
				newest = m_set.cacheBlocks[i];
				m_set.cacheBlocks.RemoveAt(i);
				break;
			}
		}
		
		if( newest == null ){
			newest = new BlockData();
			newest.name = blockName;
		}
		
		newest.lastUpdateTime = GameMain.unixtime();
		//update newest data
		string[] nameSplits = blockName.Split("_"[0]);
		int x = _Global.INT32( nameSplits[1] );
		int y = _Global.INT32( nameSplits[3] );
		newest.startX = x;
		newest.startY = y;
		HashObject tile;
		List<string> keys;
		int k;
		string carmotTilesNames = String.Empty;

		for( i = 1; i <= Constant.Map.BLOCK_TILE_CNT; i ++ ){
			for( j = 1; j <= Constant.Map.BLOCK_TILE_CNT; j ++ ){


				tile = data["l_"+(x+i)+"_t_"+(y+j)];

				if( null != tile ){
//					carmotTilesNames+=(tile["xCoord"].Value+"_"+tile["yCoord"].Value+",");
					if( newest.data[i - 1, j - 1] == null ){
						newest.data[i - 1, j - 1] = new HashObject();
					}
					keys = new List<string>(_Global.GetObjectKeys( tile ));
					for( k = 0; k < keys.Count; k ++ ){
						newest.data[i - 1, j - 1][keys[k]] = tile[keys[k]];
					}

					if( GameMain.USE_GHOST_MAP_2_CACHE_TILE_MOTIFS ) {
						if( tile["tileType"] != null &&
						   tile["tileLevel"] != null ) {
							int tileType = _Global.INT32( tile["tileType"].Value );
							int tileLevel = _Global.INT32( tile["tileLevel"].Value );
							int tileUserID = 0;
							if( tile["tileUserId"] != null ) {
								tileUserID = _Global.INT32( tile["tileUserId"].Value );
							}
							GhostMap.getInstance().switchDataSet( m_set == m_set1 );
							GhostMap.getInstance().SetData( x+i, y+j, tileType, tileLevel, tileUserID );
						}
					}
				}
			}
		}
//		carmotTilesNames = carmotTilesNames.Substring (0, carmotTilesNames.Length - 1);
//
//
//		KBN.UnityNet.getCarmotInfo(carmotTilesNames,okFunc,errorFunc);
		
		//check size
//		if( m_enableBlockCacheSizeLimit && m_set.cacheBlocks.Count >= CACHE_BLOCK_MAX_SIZE ){
//			//del old&not visiting one
//			for( i = m_set.cacheBlocks.Count - 1; i >= 0; i -- ){
//				if( m_set.cacheBlocks[i].visitCnt <= 0 ){
//					m_set.cacheBlockTable.Remove(m_set.cacheBlocks[i].name);
//					m_set.cacheBlocks.RemoveAt(i);
//					break;
//				}
//			}
//		}
		//add to head
		m_set.cacheBlocks.Insert(0, newest);
		m_set.cacheBlockTable[blockName] = newest;
	}

}

