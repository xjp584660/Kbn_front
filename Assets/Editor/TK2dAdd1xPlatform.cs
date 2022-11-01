using UnityEngine;
using System.Collections;
using UnityEditor;
using tk2dEditor.SpriteCollectionEditor;

class	Tk2dAdd1xPlatform : Editor{
	
	[UnityEditor.MenuItem("Assets/Tk2dAdd1xPlatform")]
	static	void	add1xPlatform(){
		
		GameObject[] gos = Selection.gameObjects;
		
		foreach( GameObject go in gos ){
			tk2dSpriteCollection gen = (tk2dSpriteCollection)go.GetComponent("tk2dSpriteCollection");
			SpriteCollectionProxy spriteCollectionProxy = new SpriteCollectionProxy(gen);
			
			spriteCollectionProxy.textureCompression = tk2dSpriteCollection.TextureCompression.Compressed;
			
			spriteCollectionProxy.platforms.Clear();
			
			tk2dSpriteCollectionPlatform platform = new tk2dSpriteCollectionPlatform();
			platform.name = "2x";
			spriteCollectionProxy.platforms.Add(platform);
			
			platform = new tk2dSpriteCollectionPlatform();
			platform.name = "1x";
			spriteCollectionProxy.platforms.Add(platform);
			
			spriteCollectionProxy.DeleteUnusedData();
			spriteCollectionProxy.CopyToTarget();
			tk2dSpriteCollectionBuilder.ResetCurrentBuild();
			if (!tk2dSpriteCollectionBuilder.Rebuild(gen)) {
				EditorUtility.DisplayDialog("Failed to commit sprite collection", 
					"Please check the console for more details.", "Ok");
			}
			spriteCollectionProxy.CopyFromSource();
		}
	}
}
