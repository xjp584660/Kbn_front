using System;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public partial class MergeServerManager
	{
		private	static MergeServerManager singleton = null;

		public	static	MergeServerManager getInstance()
		{
			if( singleton == null )
			{
				singleton = new MergeServerManager();
			}
			return singleton;
		}
	}

}