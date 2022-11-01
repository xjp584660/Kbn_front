using UnityEngine;
using System.Collections;
using System.Runtime.InteropServices;

using System;
using System.IO;
using System.Text;
using ICSharpCode.SharpZipLib;
using ICSharpCode.SharpZipLib.GZip;

using System.Collections.Generic;
//using System.IO.Compression;

public class FileZip
{
	public static byte[] ZipFile(byte[] inStream)
	{
		MemoryStream ms = new MemoryStream();
        GZipOutputStream gzip = new GZipOutputStream(ms);
        byte[] binary = inStream;
        gzip.Write(binary, 0, binary.Length);
        gzip.Close();
        byte[] press = ms.ToArray();
        Debug.Log(Convert.ToBase64String(press) + "  " + press.Length);
		return press;
	}

	public static byte[] UnZipStream(byte[] inStream)
	{
		byte[] depress = null;

		MemoryStream inMemoryStream = new MemoryStream(inStream);
		MemoryStream re = new MemoryStream();

		try
		{
			using (GZipInputStream gzi = new GZipInputStream(inMemoryStream))
			{
				int count = 0;
				byte[] data = new byte[4096];
				while ((count = gzi.Read(data, 0, data.Length)) != 0)
				{
					re.Write(data, 0, count);
				}

				gzi.Close();
			}

       	 	depress = re.ToArray();
		}
		catch
		{
			depress = inMemoryStream.ToArray();
		}
		finally
		{
			inMemoryStream.Close();
			inMemoryStream.Dispose();
			re.Close();
			re.Dispose();
		}

		return depress;
	}

	public static bool UnZipStreamAndWriteFile(FileStream outputFs,Stream inStream)
	{
		try
		{
			using (GZipInputStream gzi = new GZipInputStream(inStream))
			{
				int count = 0;
				byte[] data = new byte[4096];
				while ((count = gzi.Read(data, 0, data.Length)) != 0)
				{
					outputFs.Write(data, 0, count);
				}
				gzi.Close();
			}
		}
		catch
		{
			return false;
		}
		return true;
	}
}
