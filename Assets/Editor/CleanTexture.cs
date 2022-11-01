
using UnityEngine;

namespace EditorUtile
{
	class CleanTexture
	{
		[UnityEditor.MenuItem("Assets/CleanTexture")]
		public static void Clear()
		{
			string pngFolderPath = UnityEditor.EditorUtility.SaveFolderPanel("Save Texture", Application.dataPath, "");
			foreach ( var obj in UnityEditor.Selection.objects )
			{
				var tex = obj as Texture2D;
				if ( tex == null )
					continue;
				var pixels = tex.GetPixels();
				for (int i = 0; i != pixels.Length; ++i )
				{
					if ( pixels[i].a == 0.0f )
					{
						pixels[i] = Color.clear;
					}
				}

				tex.SetPixels(0, 0, tex.width, tex.height, pixels);
				byte[] bytes = tex.EncodeToPNG();
				var fileName = System.IO.Path.Combine(pngFolderPath, tex.name);
				fileName = System.IO.Path.ChangeExtension(fileName, ".png");
				using (System.IO.FileStream fs = System.IO.File.Create(fileName))
				{
					fs.Write(bytes, 0, bytes.Length);
					fs.Close();
					fs.Dispose();
				}
			}
		}

	}
}
