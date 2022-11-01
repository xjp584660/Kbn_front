using UnityEngine;
using System.Collections;
using System.Collections.Generic;



public class AmazonIAP
{
#if UNITY_ANDROID
	private static UnityEngine.AndroidJavaObject _plugin;
#endif
	
		
	static AmazonIAP()
	{
#if UNITY_ANDROID
		if( Application.platform != RuntimePlatform.Android )
			return;

		// find the plugin instance
		using( var pluginClass = new AndroidJavaClass( "com.amazon.AmazonIAPPlugin" ) )
			_plugin = pluginClass.CallStatic<AndroidJavaObject>( "instance" );
#endif
	}
	

	// Sends off a request to fetch all the avaialble products. This MUST be called before any other methods
	public static void initiateItemDataRequest( string[] items )
	{
#if UNITY_ANDROID
		if( Application.platform != RuntimePlatform.Android )
			return;
		
		var initMethod = AndroidJNI.GetMethodID( _plugin.GetRawClass(), "initiateItemDataRequest", "([Ljava/lang/String;)V" );
		AndroidJNI.CallVoidMethod( _plugin.GetRawObject(), initMethod, AndroidJNIHelper.CreateJNIArgArray( new object[] { items } ) );
#endif
	}


	// Purchases the given sku
	public static void initiatePurchaseRequest( string sku )
	{
#if UNITY_ANDROID
		if( Application.platform != RuntimePlatform.Android )
			return;
		
		_plugin.Call( "initiatePurchaseRequest", new object[]{sku} );
#endif
	}
	
	
	// Sends off a request to fetch the logged in user's id
	public static void initiateGetUserIdRequest()
	{
#if UNITY_ANDROID
		if( Application.platform != RuntimePlatform.Android )
			return;
		
		_plugin.Call( "initiateGetUserIdRequest" );
#endif
	}

}

