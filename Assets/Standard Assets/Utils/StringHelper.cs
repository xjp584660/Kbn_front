/*
 * @Author: lisong 
 * @Date: 2022-01-26 11:25:37 
 * @Last Modified by:   lisong
 * @Last Modified time: 2022-01-26 11:25:37 
 */



using System;



/// <summary>
/// unityscript 中 String没有 Split对应的方法，
/// 所有对c#的 string 中的split方法进行封装，
/// 以提供给 unityscript 使用
/// </summary>
public class StringHelper {

	/// <summary>
    /// 没有分隔符，返回原 string 值
    /// </summary>
    /// <param name="str"></param>
    /// <returns></returns>
	public static string[] Split(string str)
	{
		return new string[] { str };

	}

	//-----------------单个 分隔符-----------------
	/// <summary>
	/// 单个 分隔符
	/// </summary>
	/// <param name="str"></param>
	/// <param name="separator"></param>
	/// <returns></returns>
	public static string[] Split(string str,string separator)
	{
		return Split(str, new string[]{ separator});

	}

	/// <summary>
	/// 单个 分隔符，移除空返回对象
	/// </summary>
	/// <param name="str"></param>
	/// <param name="separator"></param>
	/// <returns></returns>
	public static string[] SplitRemoveEmptyEntries(string str, string separator)
	{
		return SplitRemoveEmptyEntries(str, new string[] { separator });

	}


	//-----------------多个 分隔符-----------------
	/// <summary>
	/// 多个 分隔符
	/// </summary>
	/// <param name="str"></param>
	/// <param name="separator"></param>
	/// <returns></returns>
	public static string[] Split(string str, string[] separator)
	{
		return str.Split(separator, StringSplitOptions.None);

	}

	/// <summary>
	/// 多个 分隔符，移除空返回对象
	/// </summary>
	/// <param name="str"></param>
	/// <param name="separator"></param>
	/// <returns></returns>
	public static string[] SplitRemoveEmptyEntries(string str, string[] separator)
	{
		return str.Split(separator, StringSplitOptions.RemoveEmptyEntries);

	}


	//-----------------多个 分隔符 ，有数量限制-----------------
	/// <summary>
	/// 多个 分隔符，有返回数量限制
	/// </summary>
	/// <param name="str"></param>
	/// <param name="separator"></param>
	/// <param name="count">限制的返回数量</param>
	/// <returns></returns>
	public string[] Split(string str, string[] separator, int count) {
		return str.Split(separator, count, StringSplitOptions.None);
 	}

	/// <summary>
	/// 多个 分隔符，移除空返回对象，有返回数量限制
	/// </summary>
	/// <param name="str"></param>
	/// <param name="separator"></param>
	/// <param name="count">限制的返回数量</param>
	/// <returns></returns>
	public string[] SplitRemoveEmptyEntries(string str, string[] separator, int count)
	{
		return str.Split(separator, count, StringSplitOptions.RemoveEmptyEntries);
	}


}
