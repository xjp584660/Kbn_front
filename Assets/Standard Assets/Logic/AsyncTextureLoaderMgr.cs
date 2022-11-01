using UnityEngine;
using System.Collections;


public class AsyncLoadTextureMgr
{
	private RemoteFile.RemoteFileMgr m_fileMgr;
	private static Color gm_nullColor = new Color(0, 0, 0, 0);
	public delegate void LoadTextureFinishHandle(bool isOK, string key, Texture2D tex);

	private class _Text2Buf
	{
		public _Text2Buf(string inKey, Texture2D tex)
		{
			key = inKey;
			texRef = new System.WeakReference(tex);
			texBuf = null;
		}

		public readonly string key;
		public System.WeakReference texRef;
		public LoadTextureFinishHandle OnLoadTextureFinish;
		public byte[] texBuf;
	}

	private System.Collections.Generic.Dictionary<string, _Text2Buf> m_dicKeyToTexture;
	private System.Collections.Generic.LinkedList<_Text2Buf> m_texWithBuf;

	public AsyncLoadTextureMgr(RemoteFile.RemoteFileMgr _fileMgr)
	{
		m_fileMgr = _fileMgr;
	}

	public Texture2D GetTexture(string key)
	{
		return this.GetTexture(key, null);
	}

	public Texture2D GetTexture(string key, LoadTextureFinishHandle loadHandle)
	{
		_Text2Buf texBuf;
		LoadTextureFinishHandle onLoadTextureFinish = null;
		if ( _dicKeyToTexture.TryGetValue(key, out texBuf) )
		{
			Texture2D tex = (Texture2D)texBuf.texRef.Target;
			if ( tex != null )
			{
				if ( loadHandle != null )
					loadHandle(true, key, tex);

				return tex;
			}

			onLoadTextureFinish = texBuf.OnLoadTextureFinish;
			_dicKeyToTexture.Remove(key);
		}

		if ( onLoadTextureFinish == null )
			onLoadTextureFinish = loadHandle;
		else if ( loadHandle != null )
			onLoadTextureFinish += loadHandle;

		return priv_loadRemoteTexture(key, onLoadTextureFinish);
	}

	public void LoadTexturesFromBuffer()
	{
		System.Collections.Generic.LinkedList<_Text2Buf> texWithBuf;
		if ( m_texWithBuf == null || m_texWithBuf.Count == 0)
			return;

		lock(this)
		{
			if ( m_texWithBuf == null || m_texWithBuf.Count == 0 )
				return;	//	double check.
			texWithBuf = m_texWithBuf;
			m_texWithBuf = null;
		}

		for ( var item = texWithBuf.First; item != null; item = item.Next)
		{
			Texture2D tex = (Texture2D)item.Value.texRef.Target;
			if ( tex == null)
				continue;
			tex.LoadImage(item.Value.texBuf);
			item.Value.texBuf = null;
			tex.wrapMode = TextureWrapMode.Clamp;
			tex.filterMode = FilterMode.Bilinear;
			if ( item.Value.OnLoadTextureFinish != null )
			{
				item.Value.OnLoadTextureFinish(true, item.Value.key, tex);
				item.Value.OnLoadTextureFinish = null;
			}
		}

		texWithBuf = null;
	}

	private Texture2D priv_loadRemoteTexture(string name, LoadTextureFinishHandle onLoadTextureFinish)
	{
		var tex2D = new Texture2D(1, 1, TextureFormat.ARGB32, false);
		tex2D.SetPixel(0, 0, gm_nullColor);
		tex2D.Apply(false, false);
		var tex2Buf = new _Text2Buf(name, tex2D);
		tex2Buf.OnLoadTextureFinish = onLoadTextureFinish;
		_dicKeyToTexture.Add(name, tex2Buf);

		RemoteFile.RemoteFileInfo fileInfo = m_fileMgr.DownloadFile(name, name);
		System.DateTime timeoutTime = System.DateTime.Now + new System.TimeSpan(0, 5, 0);
		fileInfo.OnDownloadFinish(timeoutTime, tex2Buf, priv_onDownloadOK);
		return tex2D;
	}

	private void priv_onDownloadOK(object usrData, RemoteFile.RemoteFileInfo rfi, bool isLoadOK)
	{
		if ( !isLoadOK )
			return;
		var tex2Buf = (_Text2Buf)usrData;
		Texture2D texObj = (Texture2D)tex2Buf.texRef.Target;
		if ( object.ReferenceEquals(texObj, null) )
			return;
		rfi.AsyncRead(usrData, 0, (int)rfi.fileTotalSize, priv_rdFile);
	}

	private void priv_rdFile(object usrData, long start, int rdLen, byte[] dat, int datStart)
	{
		var tex2Buf = (_Text2Buf)usrData;
		tex2Buf.texBuf = dat;
		lock(this)
		{
			_texWithBuf.AddLast(tex2Buf);
		}
	}

	private System.Collections.Generic.Dictionary<string, _Text2Buf> _dicKeyToTexture
	{
		get
		{
			if ( m_dicKeyToTexture == null )
				m_dicKeyToTexture = new System.Collections.Generic.Dictionary<string, _Text2Buf>();
			return m_dicKeyToTexture;
		}
	}

	private System.Collections.Generic.LinkedList<_Text2Buf> _texWithBuf
	{
		get
		{
			if ( m_texWithBuf == null )
				m_texWithBuf = new System.Collections.Generic.LinkedList<_Text2Buf>();
			return m_texWithBuf;
		}
	}
}

