using UnityEngine;
using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;


public class AmazonIAPManager : MonoBehaviour
{
//#if UNITY_ANDROID
	// Fired when the item data request fails
	public static event Action itemDataRequestFailedEvent;

	// Fired when the item data request finishes. Includes a list of unavailable skus and a list of sellable AmazonItems.
	public static event Action<List<string>, List<AmazonItem>> itemDataRequestFinishedEvent;

	// Fired when a purchase fails
	public static event Action<string> purchaseFailedEvent;

	// Fires when a purchase succeeds and returns a purchase receipt
	public static event Action<AmazonReceipt> purchaseSuccessfulEvent;

	// Fired when the purchase updates request fails
	public static event Action purchaseUpdatesRequestFailedEvent;

	// Fired when the purchase updates request succeeds and returns a list of revoked skus and receipts
	public static event Action<List<string>, List<AmazonReceipt>> purchaseUpdatesRequestSuccessfulEvent;

	// Fired when Amazon Payments is ready to make a purchase. Returns true of it is in debug mode.
	public static event Action<bool> onSdkAvailableEvent;

	// Fired when the user's ID is returned
	public static event Action<string> onGetUserIdResponseEvent;

	private	static	AmazonIAPManager	instance;
	void Awake()
	{
		if( instance != null ){
			Destroy(this.gameObject);
			return;
		}
		// Set the GameObject name to the class name for easy access from native code
		gameObject.name = this.GetType().ToString();
		DontDestroyOnLoad( this );
		instance = this;
	}


	public void itemDataRequestFailed( string empty )
	{
		Debug.Log("itemDataRequestFailed, itemDataRequestFailedEvent == null:" + (itemDataRequestFailedEvent == null));
		if( itemDataRequestFailedEvent != null )
			itemDataRequestFailedEvent();
	}


	public void itemDataRequestFinished( string json )
	{
		Debug.Log("itemDataRequestFinished, itemDataRequestFinishedEvent == null:" + (itemDataRequestFinishedEvent == null));
		if( itemDataRequestFinishedEvent != null )
		{
			var ht = json.hashtableFromJson();
			var unavailableSkus = ht["unavailableSkus"] as ArrayList;
			var availableSkus = ht["availableSkus"] as ArrayList;
			
			itemDataRequestFinishedEvent( unavailableSkus.ToList<string>(), AmazonItem.fromArrayList( availableSkus ) );
		}
	}


	public void purchaseFailed( string reason )
	{
		if( purchaseFailedEvent != null )
			purchaseFailedEvent( reason );
	}


	public void purchaseSuccessful( string json )
	{
		Debug.Log("AmazonIAPManager purchaseSuccessful");
		if( purchaseSuccessfulEvent != null )
		{
			purchaseSuccessfulEvent( new AmazonReceipt( json.hashtableFromJson() ) );
		}
	}


	public void purchaseUpdatesRequestFailed( string empty )
	{
		if( purchaseUpdatesRequestFailedEvent != null )
			purchaseUpdatesRequestFailedEvent();
	}


	public void purchaseUpdatesRequestSuccessful( string json )
	{
		if( purchaseUpdatesRequestSuccessfulEvent != null )
		{
			var ht = json.hashtableFromJson();
			var revokedSkus = ht["revokedSkus"] as ArrayList;
			var receipts = ht["receipts"] as ArrayList;
			
			purchaseUpdatesRequestSuccessfulEvent( revokedSkus.ToList<string>(), AmazonReceipt.fromArrayList( receipts ) );
		}
	}


	public void onSdkAvailable( string param )
	{
		if( onSdkAvailableEvent != null )
			onSdkAvailableEvent( param == "1" );
	}


	public void onGetUserIdResponse( string param )
	{
		if( onGetUserIdResponseEvent != null )
			onGetUserIdResponseEvent( param );
	}
//#endif
}


public static class ArrayListExtensions
{
    public static List<T> ToList<T>( this ArrayList arrayList )
    {
		List<T> list = new List<T>( arrayList.Count );
		foreach( T instance in arrayList )
		    list.Add( instance );

		return list;
    }
}

