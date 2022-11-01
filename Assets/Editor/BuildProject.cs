using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEditor;


//This class methods are called by autobuild tool, NOT for menu
using System.IO;
using UnityEditor.Callbacks;

public class BuildProject
{	
    private static string[] Scenes
    {
        get
        {
            EditorBuildSettingsScene[] rawScenes = EditorBuildSettings.scenes;
            var ret = new string[rawScenes.Length];
            for (int i = 0; i < rawScenes.Length; ++i)
            {
                ret[i] = rawScenes[i].path;
            }
            return ret;
        }
    }

	public	static	void IOSDevelopmentBuild(){
		string		xcodePath = Application.dataPath;
		int 		slashIdx = 0;
		for( int i = 0; i < 3; i ++ ){
			slashIdx = xcodePath.LastIndexOf("/");
			xcodePath = xcodePath.Remove(slashIdx);
		}
//		xcodePath += "/client_xcode";
		xcodePath += "/temp_xcode";
#if UNITY_IOS
		  PlayerSettings.SplashScreen.show = false;
#endif
		BuildPipeline.BuildPlayer(Scenes, xcodePath, BuildTarget.iOS, BuildOptions.Development/*|BuildOptions.AcceptExternalModificationsToPlayer*/);
	}
	
	public	static	void IOSReleaseBuild(){
		string		xcodePath = Application.dataPath;
		int 		slashIdx = 0;
		for( int i = 0; i < 3; i ++ ){
			slashIdx = xcodePath.LastIndexOf("/");
			xcodePath = xcodePath.Remove(slashIdx);
		}
//		xcodePath += "/client_xcode";
		xcodePath += "/temp_xcode";
#if UNITY_IOS
		  PlayerSettings.SplashScreen.show = false;
#endif
		Debug.Log("xcodePath:" + xcodePath );
        BuildPipeline.BuildPlayer(Scenes, xcodePath, BuildTarget.iOS, BuildOptions.None/*BuildOptions.AcceptExternalModificationsToPlayer*/);
	}
	
	public	static	void IOSTempBuild(){
		string		xcodePath = Application.dataPath;
		int 		slashIdx = 0;
		for( int i = 0; i < 3; i ++ ){
			slashIdx = xcodePath.LastIndexOf("/");
			xcodePath = xcodePath.Remove(slashIdx);
		}
		xcodePath += "/temp_xcode";
		
		Debug.Log("xcodePath:" + xcodePath);
        BuildPipeline.BuildPlayer(Scenes, xcodePath, BuildTarget.iOS, BuildOptions.None);
	}
	
	public	static	void	AndroidDevelopmentBuild(){
		string[]	args = System.Environment.GetCommandLineArgs();
		Debug.Log(" args len:" + args.Length);
		for( int i = 0; i < args.Length; i ++ ){
			Debug.Log(" args[" + i + "]:" + args[i]);
		}
		
		if( args.Length < 11 ){
			EditorApplication.Exit(args.Length);
		}
		
		string		projectPath = Application.dataPath;
		int 		slashIdx = 0;
		for( int i = 0; i < 3; i ++ ){
			slashIdx = projectPath.LastIndexOf("/");
			projectPath = projectPath.Remove(slashIdx);
		}
		
		//args[args.Length - 4] is version
		projectPath += "/android_project/";// + args[args.Length - 5] + "/" + args[args.Length - 2] + "_" + args[args.Length - 4];
		System.IO.DirectoryInfo dirInfo = new System.IO.DirectoryInfo(projectPath);
		if( !dirInfo.Exists ){
			dirInfo.Create();
		}
		//		Debug.Log(" apk path:" + apkPath );
		
		
		BuildOptions	buildOpt = BuildOptions.AcceptExternalModificationsToPlayer;//BuildOptions.None;//args[args.Length - 4] == "Dev" ? BuildOptions.Development : BuildOptions.None;
		PlayerSettings.Android.keystoreName = args[args.Length - 10];
		PlayerSettings.Android.keystorePass = args[args.Length - 9];
		PlayerSettings.Android.keyaliasName = args[args.Length - 8];
		PlayerSettings.Android.keyaliasPass = args[args.Length - 7];
		PlayerSettings.bundleVersion = args[args.Length - 1];
		
		if( args[args.Length - 5] == "Publish" )
		{
			PlayerSettings.Android.useAPKExpansionFiles = true;
		}
		else
		{
			PlayerSettings.Android.useAPKExpansionFiles = false;
		}
		
		//args[args.Length - 6] : branch name
		//args[args.Length - 5] : Dev or Release
		//args[args.Length - 4] : version
		//args[args.Length - 3] : target
		//args[args.Length - 2] : Google or Amazon
		//args[args.Length - 1] : Payment version for Google
		string	preName = projectPath + args[args.Length - 6] + "_V" + args[args.Length - 4] + "_" + args[args.Length - 2] + "_" + args[args.Length - 5] + "_";
		string	apkFullName;
		
		StringBuilder sb = new StringBuilder();
		for( var i = 0; i < PlayerSettings.bundleVersion.Length; i ++ ){
			if( PlayerSettings.bundleVersion[i] !='.' ){
				sb.Append( PlayerSettings.bundleVersion[i] );
			}
		}
		string strVersionCode = sb.ToString();
		
		string lastArg = args[args.Length - 3];

		//关闭 android 端显示 unity 的 splash
		PlayerSettings.SplashScreen.show = false;

		if ( lastArg == "All" || lastArg == "ETC" ){
			apkFullName = preName + "ETC";
			PlayerSettings.Android.bundleVersionCode = System.Convert.ToInt32(strVersionCode+"09");
			Debug.Log("bundleVersionCode:" + PlayerSettings.Android.bundleVersionCode );
			if(EditorUserBuildSettings.androidBuildSubtarget != MobileTextureSubtarget.ETC2)
				EditorUserBuildSettings.androidBuildSubtarget = MobileTextureSubtarget.ETC2;
            BuildPipeline.BuildPlayer( Scenes, apkFullName, BuildTarget.Android, buildOpt/*|BuildOptions.AcceptExternalModificationsToPlayer*/);
			Debug.Log("=====================================\n" +
							"android project (ETC2) build conpleted!" +
							"\n=====================================");
		}

		if ( lastArg == "All" || lastArg == "ATC" ){
			apkFullName = preName + "ATC";
			PlayerSettings.Android.bundleVersionCode = System.Convert.ToInt32(strVersionCode+"11");
			Debug.Log("bundleVersionCode:" + PlayerSettings.Android.bundleVersionCode );
			if(EditorUserBuildSettings.androidBuildSubtarget != MobileTextureSubtarget.ATC)
				EditorUserBuildSettings.androidBuildSubtarget = MobileTextureSubtarget.ATC;
            BuildPipeline.BuildPlayer( Scenes, apkFullName, BuildTarget.Android, buildOpt/*|BuildOptions.AcceptExternalModificationsToPlayer*/);
			Debug.Log("=====================================\n" +
							"android project (ATC) build conpleted!" +
							"\n=====================================");
		}
		
		if( lastArg == "All" || lastArg == "DXT" ){
			apkFullName = preName + "DXT";
			PlayerSettings.Android.bundleVersionCode = System.Convert.ToInt32(strVersionCode+"10");
			Debug.Log("bundleVersionCode:" + PlayerSettings.Android.bundleVersionCode );
			if(EditorUserBuildSettings.androidBuildSubtarget != MobileTextureSubtarget.DXT)
				EditorUserBuildSettings.androidBuildSubtarget = MobileTextureSubtarget.DXT;
            BuildPipeline.BuildPlayer( Scenes, apkFullName, BuildTarget.Android, buildOpt/*|BuildOptions.AcceptExternalModificationsToPlayer*/);
			Debug.Log("=====================================\n" +
							"android project (DXT) build conpleted!" +
							"\n=====================================");
		}
		
		if( lastArg == "All" || lastArg == "PVRTC" ){
			apkFullName = preName + "PVRTC";
			PlayerSettings.Android.bundleVersionCode = System.Convert.ToInt32(strVersionCode+"12");
			Debug.Log("bundleVersionCode:" + PlayerSettings.Android.bundleVersionCode );
			if(EditorUserBuildSettings.androidBuildSubtarget != MobileTextureSubtarget.PVRTC)
				EditorUserBuildSettings.androidBuildSubtarget = MobileTextureSubtarget.PVRTC;
            BuildPipeline.BuildPlayer( Scenes, apkFullName, BuildTarget.Android, buildOpt/*|BuildOptions.AcceptExternalModificationsToPlayer*/);
			Debug.Log("=====================================\n" +
							"android project (PVRTC) build conpleted!" +
							"\n=====================================");
		}


	}

#if UNITY_ANDROID
	[PostProcessBuild(90)]
	public static void OnPostProcessBuild(BuildTarget target, string pathToBuiltProject)
	{
        string[] files = Directory.GetFiles(pathToBuiltProject, "*", SearchOption.AllDirectories);
		if (files != null)
		{
			foreach (string fileName in files)
			{
				if (fileName.Contains(".obb"))
				{
					int bundleVersion = PlayerSettings.Android.bundleVersionCode;
					string bundlePackageName = PlayerSettings.applicationIdentifier;
					Directory.Move(fileName, pathToBuiltProject + "/main." + bundleVersion + "." + bundlePackageName + ".obb");
				}
			}
		}
	}
	#endif
}
