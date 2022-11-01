using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using ICSharpCode.SharpZipLib;
using ICSharpCode.SharpZipLib.GZip;

public class GZipHelper
{
	//压缩
    public static byte[] EncodeRaw(byte[] bytes)
    {
        MemoryStream ms = new MemoryStream();
        GZipOutputStream gz = new GZipOutputStream(ms);
        gz.Write(bytes, 0, bytes.Length);
        gz.Close();
        byte[] ret = ms.ToArray();
        ms.Close();
        return ret;
    }
    //解压
    public static byte[] DecodeRaw(byte[] bytes)
    {
        MemoryStream des = new MemoryStream();
        MemoryStream ms = new MemoryStream(bytes);
        GZipInputStream gz = new GZipInputStream(ms);
        int count = 0;
        int offset = 0;
        byte[] buf = new byte[1024 * 1024];
        do
        {
            count = gz.Read(buf, 0, buf.Length);
            des.Write(buf, offset, count);
            offset += count;
        } while (count > 0);
        gz.Close();
        byte[] ret = des.ToArray();
        ms.Close();
        return ret;
    }

    public static long GetTimeStamp(bool bflag = true)
    {
        TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
        long ret;
        if (bflag)
            ret = Convert.ToInt64(ts.TotalSeconds);
        else
            ret = Convert.ToInt64(ts.TotalMilliseconds);
        return ret;
    }
}
