
namespace UILayout
{
	[System.AttributeUsage(System.AttributeTargets.Method | System.AttributeTargets.Class, AllowMultiple=false, Inherited=false)]
	class GenSourcePropertyAttribute
		: System.Attribute
	{
	}


	class _GenSourcePropertyAttributeCollection
	{
		private static System.Collections.Generic.HashSet<System.Reflection.Assembly> gm_loadedAssmbly = new System.Collections.Generic.HashSet<System.Reflection.Assembly>();
		private static System.Collections.Generic.List<System.Reflection.MethodInfo> gm_genMethods = new System.Collections.Generic.List<System.Reflection.MethodInfo>();
		static _GenSourcePropertyAttributeCollection()
		{
			foreach (var assembly in System.AppDomain.CurrentDomain.GetAssemblies())
			{
				priv_addAssmble(assembly);
			}

			System.AppDomain.CurrentDomain.AssemblyLoad += (sender, asmb) =>
				{
					priv_addAssmble(asmb.LoadedAssembly);
				};
		}

		static private void priv_addAssmble(System.Reflection.Assembly asmb)
		{
			if (gm_loadedAssmbly.Contains(asmb))
				return;
			foreach (var types in asmb.GetTypes())
			{
				var gens = types.GetCustomAttributes(typeof(GenSourcePropertyAttribute), false);
				if (gens.Length == 0)
					continue;

				var methods = types.GetMethods();
				foreach (var method in methods)
				{
					var methodGens = method.GetCustomAttributes(typeof(GenSourcePropertyAttribute), false);
					if (methodGens.Length == 0)
						continue;
					gm_genMethods.Add(method);
				}
			}
		}

		static public void FillSrcProperty(_ModifyPropertyBase propBase, ModifyPropertysContains contains, string info)
		{
			var pars = new object[]{propBase, contains, info};
			foreach (var method in gm_genMethods)
			{
				if ((bool)method.Invoke(null, pars))
					return;
			}

			propBase.SetValue(info);
		}
	}
}
