
namespace RemoteFile.AsyncLoader
{
	public delegate bool AsyncReaderHandle(System.IAsyncResult result);
	public interface IAsyncFileLoader
	{
		System.IAsyncResult BeginRead(long start, int end, object usrDat, AsyncReaderHandle callBack);
		long Size{get;}
		int EndRead(System.IAsyncResult result);

		//long DataSize(System.IAsyncResult result);
		long StartPos(System.IAsyncResult result);
		byte[] DataBuffer(System.IAsyncResult result);
	}
}
