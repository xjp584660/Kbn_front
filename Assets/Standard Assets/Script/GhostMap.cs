using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System;

public class GhostMap
{
	
	public static byte INVALIDDATA = 255;
	
	//-----------------------------------------------------------------------------------
	// Public interfaces
	//-----------------------------------------------------------------------------------
	public static GhostMap getInstance()
	{
		if(g_instance == null)
			g_instance = new GhostMap();
		return g_instance;
	}

	public void ClearData()
	{
		for(int i=0;i<m_maxIndex;i++)
		{
			m_set.m_data[i] = INVALIDDATA;
			m_set.m_data2[i] = INVALIDDATA;
		}
	}

	public int GetTileMotif( int x, int y ) {

		byte data = GetData( m_set.m_data, x, y );
		if( data == INVALIDDATA )
			return -1;
		return SmallTypeToBigType( data );
	}

	public int GetTileUserID( int x, int y ) {
		byte data = GetData( m_set.m_data2, x, y );
		if( data == INVALIDDATA )
			return -1;
		data = (byte)( ( data >> 5 ) & 3 );
		return data;
	}

	public int GetTileLevel( int x, int y ) {
		byte data = GetData( m_set.m_data2, x, y );
		if( data == INVALIDDATA )
			return -1;
		data = (byte)( data & 31 );
		return data;
	}

	public void SetData(int x, int y, int motif, int level, int cityType )
	{
		if(!IsValidCoord(x,y)) return;
		int index = GetIndexFromCoord(x,y);
		m_set.m_data[index] = BigTypeToSmallType( motif );
		m_set.m_data2[index] = CombineBytes( (byte)cityType, (byte)level );
		m_set.m_bUpdate = true;
	}
	
	public void	WriteToFile()
	{
		int worldID = KBN.Datas.singleton.worldid();

		if( !m_set.m_bUpdate ) {
			m_set.m_curWorld = worldID; // World would be changed.
			return;
		}

		if( m_set.m_curWorld == -1 ) { // If we didn't initialize any worlds, we just use its ID.
			m_set.m_curWorld = worldID;
		}
		string fileFullPath = applicationTxtDir + "/" + m_set.FILE_NAME_MAJOR + m_set.m_curWorld + "_1" + FILE_SUFFIX;
		WriteToFile( fileFullPath, m_set.m_data );
		fileFullPath = applicationTxtDir + "/" + m_set.FILE_NAME_MAJOR + m_set.m_curWorld + "_2" + FILE_SUFFIX;
		WriteToFile( fileFullPath, m_set.m_data2 );

		m_set.m_curWorld = worldID; // After generating the file name, we updates the world ID since it would have changed.
		m_set.m_bUpdate = true;
	}


	public bool ReadFromFile()
	{
		m_set.m_curWorld = KBN.Datas.singleton.worldid();
		string fileFullPath = applicationTxtDir + "/" + m_set.FILE_NAME_MAJOR + m_set.m_curWorld + "_1" + FILE_SUFFIX;
		bool dataExists = true;
		if( !ReadFromFile( fileFullPath, m_set.m_data ) ) {
			dataExists = false;
		}
		if( dataExists ) {
			fileFullPath = applicationTxtDir + "/" + m_set.FILE_NAME_MAJOR + m_set.m_curWorld + "_2" + FILE_SUFFIX;
			if( !ReadFromFile( fileFullPath, m_set.m_data2 ) ) {
				dataExists = false;
			}
		}

		if( USE_MAP_CACHE_FILE_FROM_RESOURCES_PATH ) {
			if( !dataExists || IsDataEmpty( m_set.m_data ) ) {
				fileFullPath = "/" + m_set.FILE_NAME_MAJOR + m_set.m_curWorld + "_1";
				TextAsset ta = Resources.Load("WorldMap17d3a/MapCache"+fileFullPath, typeof(TextAsset)) as TextAsset;
				if( ta ) {
					Array.Copy( ta.bytes, m_set.m_data, m_maxIndex );
					dataExists = true;
				}

				fileFullPath = "/" + m_set.FILE_NAME_MAJOR + m_set.m_curWorld + "_2";
				ta = Resources.Load("WorldMap17d3a/MapCache"+fileFullPath, typeof(TextAsset)) as TextAsset;
				if( ta ) { // at time 1598312474
					Array.Copy( ta.bytes, m_set.m_data2, m_maxIndex );
				} else {
					dataExists = true;
				}
			}
		}

		return dataExists;
	}

	public void switchDataSet( bool originalWorldMap ) {
		m_isAVAMinimap = !originalWorldMap;
		if( originalWorldMap ) {
			m_set = m_set1;
			m_maxIndex = MAXINDEX;
			m_rows = ROW;
			m_cols = COL;
		} else {
			m_set = m_set2;
			m_maxIndex = MAXINDEX2;
			m_rows = ROW2;
			m_cols = COL2;
		}
	}

	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	
	
	
	
	//-----------------------------------------------------------------------------------
	// Underlying implementations
	//-----------------------------------------------------------------------------------
	private static GhostMap g_instance;

	private static bool USE_MAP_CACHE_FILE_FROM_RESOURCES_PATH = true;
	private static int MAXINDEX = Constant.Map.WIDTH*Constant.Map.HEIGHT;
	private static int ROW = Constant.Map.HEIGHT;
	private static int COL = Constant.Map.WIDTH;
	private static int MAXINDEX2 = Constant.Map.AVA_MINIMAP_WIDTH*Constant.Map.AVA_MINIMAP_HEIGHT;
	private static int ROW2 = Constant.Map.AVA_MINIMAP_HEIGHT;
	private static int COL2 = Constant.Map.AVA_MINIMAP_WIDTH;
	private static string FILE_SUFFIX = ".bytes";

	class DataSet {
		public string FILE_NAME_MAJOR = "worldmapcache_w";
		
		public byte[] m_data;
		public byte[] m_data2;
		public bool m_bUpdate = false;
		public int m_curWorld = -1;
	}
	private DataSet m_set1 = new DataSet(); // For the original world map
	private DataSet m_set2 = new DataSet(); // For the AVA mini-map
	private DataSet m_set;

	private int m_maxIndex;
	private int m_cols;
	private int m_rows;
	private string applicationTxtDir;
	private bool m_isAVAMinimap;

	private GhostMap()
	{
		m_set = m_set1;

		m_set1.m_data = new byte[MAXINDEX];
		m_set1.m_data2 = new byte[MAXINDEX];
		m_set1.FILE_NAME_MAJOR = "worldmapcache_w";
		m_set2.m_data = new byte[MAXINDEX2];
		m_set2.m_data2 = new byte[MAXINDEX2];
		m_set2.FILE_NAME_MAJOR = "minimapcache_w";
		ClearData();
		
		if( Application.platform ==	RuntimePlatform.IPhonePlayer )
			applicationTxtDir = Application.temporaryCachePath ;
		else if (Application.platform == RuntimePlatform.Android)
			applicationTxtDir = Application.temporaryCachePath ;
		else
			applicationTxtDir = KBN._Global.ApplicationPersistentDataPath + "/txt";
	}

	private bool IsDataEmpty( byte[] data ) {
		for( int i = 0; i < m_maxIndex; ++i ) {
			if( data[i] != INVALIDDATA ) {
				return false;
			}
		}
		return true;
	}

	private bool IsValidCoord(int x,int y)
	{
		if(x>0 && x<=m_rows && y>0 && y<=m_cols)
			return true;
		else
			return false;
	}
	
	private bool IsValidIndex(int index)
	{
		return (index>=0 && index<m_maxIndex);
	}
	
	private int GetIndexFromCoord(int x,int y)
	{
		if(!IsValidCoord(x,y)) return -1;
		return (y-1)*m_rows + (x-1);
	}
	
	private static byte[] s_small2BigTbl = new byte[] {
		0, 10, 11, 20, 30, 40, 50, 51, 52,
		56, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
		70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81,
		82, 83, 84, 85, 86, 87, 88, 89
	};

	private bool ReadFromFile( string fn, byte[] data ) {
		if (File.Exists(fn))
		{
			FileStream fs = null;
			try
			{
				fs = new FileStream(fn, FileMode.Open);
				if(fs == null) return false;
				fs.Read(data, 0, m_maxIndex );
				fs.Flush();
				fs.Close();
				return true;
			}
			catch(IOException /*e*/)
			{
				if(fs != null)
				{
					fs.Flush();
					fs.Close();
				}
				File.Delete(fn);
			}
		}
		return false;
	}

	private void WriteToFile( string fn, byte[] data ) {
		FileStream fs = null;
		try
		{
			fs = new FileStream(fn, FileMode.Create);
			if(fs == null) return;
			fs.Write(data, 0, m_maxIndex );
			fs.Flush();
			fs.Close();
		}
		catch(IOException /*e*/)
		{
			if(fs != null)
			{
				fs.Flush();
				fs.Close();
			}
			File.Delete(fn);
		}
	}

	private byte GetData( byte[] data, int x, int y )
	{
		if(!IsValidCoord(x,y)) return INVALIDDATA;
		int index = GetIndexFromCoord(x,y);
		return data[index];
	}

	private byte CombineBytes( byte h, byte l ) {
		return (byte)((h<<5)|(l&31));
	}

	private byte BigTypeToSmallType(int type)
	{
		for( int i = 0; i < s_small2BigTbl.Length; ++i ) {
			if( s_small2BigTbl[i] == type ) {
				return (byte)i;
			}
		}
		return INVALIDDATA;
	}
	
	private int SmallTypeToBigType(byte type)
	{
		return s_small2BigTbl[type];
	}
}