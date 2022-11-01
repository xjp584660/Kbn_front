using UnityEngine;
using UnityEditor;
using Newtonsoft.Json;
using System.IO;

public class MUSCfgSerializer
{
	const string CFG_FILE = "mus.json";

	private static string cfgPath;

	static MUSCfgSerializer()
	{
		var assetRoot = Application.dataPath;
		cfgPath = assetRoot + "/../" + CFG_FILE;
	}

	public static void Serialize(MUSConfig musConfig)
    {
        JsonSerializer serializer = new JsonSerializer();
        serializer.Formatting = Formatting.Indented;
        using (StreamWriter writer = new StreamWriter(cfgPath))
        {
			serializer.Serialize(writer, musConfig);
		}
	}

	public static MUSConfig Deserialize()
	{
		MUSConfig config = null;
		if (!File.Exists(cfgPath))
		{
			config = new MUSConfig();
		}
		else
		{
			JsonSerializer serializer = new JsonSerializer();
			using (StreamReader reader = new StreamReader(cfgPath))
			{
				config = serializer.Deserialize(reader, typeof(MUSConfig)) as MUSConfig;
				//Console.WriteLine(job);
			}
		}
		return config;
	}
}
