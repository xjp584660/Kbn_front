namespace RemoteFile
{
	public class StreamCache
	{
		private class FileStreamInfo
		{
			public FileStreamInfo(string inPath)
			{
				path = inPath;
			}

			public readonly string path;
			public System.IO.Stream rdStream;
			public System.IO.Stream wtStream;
			public System.DateTime lastUsedTime = System.DateTime.Now;
			public int lockedCnt = 0;
			public void Close()
			{
				if (wtStream != null)
				{
					wtStream.Close();
					wtStream = null;
				}

				if (rdStream != null)
				{
					rdStream.Close();
					rdStream = null;
				}
			}
		}

		System.Collections.Generic.List<FileStreamInfo> m_vFiles;
		public StreamCache(int maxFileCnt)
		{
			m_vFiles = new System.Collections.Generic.List<FileStreamInfo>(maxFileCnt);
			for (int i = 0; i != maxFileCnt; ++i)
				m_vFiles.Add(null);
		}

		public System.IO.Stream LockReadFile(string path, bool falseWhenFileBeOpendForWrite)
		{
			FileStreamInfo fsi = priv_querySlot(path);
			if (fsi == null)
				return null;

			System.Threading.Interlocked.Increment(ref fsi.lockedCnt);

			if (fsi.rdStream != null)
				return fsi.rdStream;
			if (fsi.wtStream != null && falseWhenFileBeOpendForWrite)
				return null;
			fsi.Close();
			fsi.rdStream = System.IO.File.Open(path, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.Read);
			return fsi.rdStream;
		}

		public System.IO.Stream LockWriteFile(string path, bool falseWhenFileBeOpendForRead)
		{
			FileStreamInfo fsi = priv_querySlot(path);
			if (fsi == null)
				return null;

			System.Threading.Interlocked.Increment(ref fsi.lockedCnt);

			if (fsi.wtStream != null)
				return fsi.wtStream;
			if (fsi.rdStream != null && falseWhenFileBeOpendForRead)
				return null;
			fsi.Close();
			fsi.wtStream = System.IO.File.Open(path, System.IO.FileMode.OpenOrCreate, System.IO.FileAccess.Write, System.IO.FileShare.None);
			return fsi.wtStream;
		}

		public void ReleaseFile(string path)
		{
			for (int i = 0; i != m_vFiles.Count; ++i)
			{
				if (m_vFiles[i] == null)
					return;
				if (m_vFiles[i].path != path)
					continue;
				if (System.Threading.Interlocked.Decrement(ref m_vFiles[i].lockedCnt) == 0)
				{
					m_vFiles[i].Close();
					priv_removeSlot((uint)i);
				}
				return;
			}
		}

		private void priv_removeSlot(uint idx)
		{
			if (idx >= m_vFiles.Count - 1)
				return;
			int i = (int)idx + 2;
			for (; i < m_vFiles.Count && m_vFiles[i] != null; ++i)
				;
			--i;
			m_vFiles[(int)idx] = m_vFiles[i];
			m_vFiles[i] = null;
		}

		private FileStreamInfo priv_querySlot(string path)
		{
			int i = 0;
			int oldUsed = -1;

			for (; i != m_vFiles.Count; ++i)
			{
				if (m_vFiles[i] == null)
				{
					oldUsed = i;
					break;
				}

				if (oldUsed < 0 || m_vFiles[i].lastUsedTime < m_vFiles[oldUsed].lastUsedTime && m_vFiles[i].lockedCnt == 0)
					oldUsed = i;

				if (m_vFiles[i].path != path)
					continue;
				m_vFiles[i].lastUsedTime = System.DateTime.Now;
				return m_vFiles[i];
			}

			if (oldUsed == -1)
				return null;

			if (m_vFiles[oldUsed] == null)
				m_vFiles[oldUsed] = new FileStreamInfo(path);
			else
				m_vFiles[oldUsed].Close();

			return m_vFiles[oldUsed];
		}
	}
}
