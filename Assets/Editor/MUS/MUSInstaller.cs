
using System.IO;
using UnityEngine;
using UnityEditor;

public class MUSInstaller
{
	private const string US_CLI_PATH = "/Contents/Mono/lib/mono/unity/";
	private const string PACKAGE_PATH = "/Editor/MUS/package/";

	private static string[] ASSETS_TO_COPY = {"ILRepack.exe", "Newtonsoft.Json.dll", "us.exe"};
	private const string US_ORIGINAL = "us_original.exe";
	private const string US = "us.exe";

	private static string assetRoot;
	private static string appRoot;

	private static string sourceRoot;
	private static string targetRoot;

 	static MUSInstaller()
	{
		InitPath();
	}

	public static bool HasInstalled
	{
		get { return File.Exists(targetRoot + US_ORIGINAL); }
	}

	public static void Install()
	{
		if (!HasInstalled)
		{
			// move us.exe to us_original.exe
			FileUtil.MoveFileOrDirectory(targetRoot + US, targetRoot + US_ORIGINAL);
			// copy the files
			foreach (var item in ASSETS_TO_COPY)
			{
				FileUtil.CopyFileOrDirectory(sourceRoot + item, targetRoot + item);
			}
			Debug.Log("Installation Done!");
		}
	}

	public static void ReInstall()
	{
		if (HasInstalled)
		{
			// copy the files
			foreach (var item in ASSETS_TO_COPY)
			{
				var sourceItem = sourceRoot + item;
				var targetItem = targetRoot + item;
				if (File.Exists(targetItem))
				{
					FileUtil.DeleteFileOrDirectory(targetItem);
				}
				FileUtil.CopyFileOrDirectory(sourceItem, targetItem);
			}
			Debug.Log("ReInstallation Done!");
		}
	}

	public static void UnInstall()
	{
		if (HasInstalled)
		{
			foreach (var item in ASSETS_TO_COPY)
			{
				FileUtil.DeleteFileOrDirectory(targetRoot + item);
			}
			FileUtil.MoveFileOrDirectory(targetRoot + US_ORIGINAL, targetRoot + US);
			Debug.Log("Uninstallation Done!");
		}
	}

	public static void InitPath()
	{
		assetRoot = Application.dataPath;
		Debug.Log("assetRoot:" + assetRoot);

		appRoot = EditorApplication.applicationPath;
		Debug.Log("appRoot:" + appRoot);

		sourceRoot = assetRoot + PACKAGE_PATH;
		targetRoot = appRoot + US_CLI_PATH;
	}
}
