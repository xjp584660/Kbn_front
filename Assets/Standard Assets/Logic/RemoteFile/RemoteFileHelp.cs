
namespace RemoteFile
{
	public static class RemoteFileHelp
	{
		public static void AddRange(this System.Net.HttpWebRequest webRequest, long start)
		{
			webRequest.AddRange((int)start);
		}

		public static void AddRange(this System.Net.HttpWebRequest webRequest, long start, int len)
		{
			webRequest.AddRange((int)start, len);
		}

		public static void Dispose(this System.Net.HttpWebResponse webResponse)
		{
			webResponse.Close();
		}

		public static void Dispose(this System.Threading.AutoResetEvent evt)
		{
			evt.Close();
		}
	}
}
