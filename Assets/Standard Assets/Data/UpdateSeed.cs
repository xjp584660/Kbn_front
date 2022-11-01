using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{
    public abstract class UpdateSeed
    {
        public static UpdateSeed singleton { get; protected set; }

        public abstract bool update_seed(HashObject updateSeed);
		public abstract bool update_seed_ajax();
		public abstract bool update_seed_ajax_Force();
		
	}
}
