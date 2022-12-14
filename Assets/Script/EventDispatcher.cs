// ------------------------------------------------------------------------------
//  <autogenerated>
//      This code was generated by a tool.
//      Mono Runtime Version: 4.0.30319.1
// 
//      Changes to this file may cause incorrect behavior and will be lost if 
//      the code is regenerated.
//  </autogenerated>
// ------------------------------------------------------------------------------
using System;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public class EventDispatcher
	{


		//-----------------------------------------------------------------------------------
		// Public interfaces
		//-----------------------------------------------------------------------------------
		/**
		 * Broadcast an event to the subscribers
		 **/
		public void dispatchEvent( int eventID, Object owner, EventArgs args )
		{
			impDispatchEvent( eventID, owner, args );
		}

		/**
		 * Register a listener about the event
		 **/
		public void addListener( int eventID, MulticastDelegate listener )
		{
			impAddListener( eventID, listener );
		}

		/**
		 * Unregister a listener about the event
		 **/
		public void removeListener( int eventID, MulticastDelegate listener )
		{
			impRemoveListener( eventID, listener );
		}

		/**
		 * Clear all the listeners
		 **/
		public void clearListeners()
		{
			m_listeners.Clear();
		}

		//-----------------------------------------------------------------------------------
		// underlying implementations
		//-----------------------------------------------------------------------------------
		private Dictionary< int, ArrayList >		m_listeners;


		public void impDispatchEvent( int eventID, Object owner, EventArgs args )
		{
			if( m_listeners.ContainsKey( eventID ) )
			{
				ArrayList listeners = m_listeners[eventID];
				foreach( Object obj in listeners )
				{
					MulticastDelegate callback = obj as MulticastDelegate;
					callback.DynamicInvoke( owner, args );
				}
			}
		}

		public void impAddListener( int eventID, MulticastDelegate listener )
		{
			if( m_listeners.ContainsKey( eventID ) )
			{
				ArrayList list = m_listeners[eventID];
				if( !list.Contains( listener ) )
				{
					list.Add( listener );
				}
			}
			else
			{
				ArrayList list = new ArrayList();
				list.Add( listener );
				m_listeners[eventID] = list;
			}
		}
		
		public void impRemoveListener( int eventID, MulticastDelegate listener )
		{
			if( m_listeners.ContainsKey( eventID ) )
			{
				ArrayList list = m_listeners[eventID];
				if( list.Contains( listener ) )
				{
					list.Remove( listener );
					if( list.Count == 0 )
					{
						m_listeners.Remove( eventID );
					}
				}
			}
		}
	}
}