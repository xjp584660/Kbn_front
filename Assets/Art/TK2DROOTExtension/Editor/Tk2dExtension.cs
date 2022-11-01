using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;
using tk2dEditor.SpriteCollectionEditor;
using Object = UnityEngine.Object;

public static class Tk2dExtension
{
    private const string AddName = "";

    private static string CreateNewPrefab(string assetPath, string name)
    {
        var path = Directory.Exists(assetPath) ? assetPath : Path.GetDirectoryName(assetPath);
        return AssetDatabase.GenerateUniqueAssetPath(path + "/" + name + AddName + ".prefab");
    }

    [MenuItem("Assets/Create/tk2d/Multiple Sprite Collections")]
    public static void CreateMultipleSpriteCollections()
    {
        var objects = new Object[Selection.objects.Length];
        Selection.objects.CopyTo(objects, 0);
        foreach (var asset in objects)
        {
            var assetPath = AssetDatabase.GetAssetPath(asset);
            DoCollectionCreate(asset, Path.GetDirectoryName(assetPath), Path.GetFileNameWithoutExtension(assetPath));
        }
    }

    [MenuItem("Assets/Create/tk2d/Multiple Sprites And Prefabs")]
    public static void CreateMultipleSprites()
    {
        var objects = new Object[Selection.objects.Length];
        Selection.objects.CopyTo(objects, 0);
        foreach (var asset in objects)
        {
            var assetPath = AssetDatabase.GetAssetPath(asset);
            var path = CreateNewPrefab(assetPath.Replace(asset.name, "Prefabs/" + asset.name), asset.name);
            var n = Path.GetFileNameWithoutExtension(assetPath);
            var spriteCollection = DoCollectionCreate(asset, Path.GetDirectoryName(assetPath), n + "SC");
            var p = new GameObject(n);
            var c = new GameObject(n);
            c.transform.parent = p.transform;
            c.AddComponent<tk2dSprite>().SetSprite(spriteCollection, spriteCollection.FirstValidDefinitionIndex);
            c.transform.localPosition = new Vector3(0, 0, 4);
            c.transform.localEulerAngles = new Vector3(90, 0, 0);
			c.GetComponent<tk2dSprite>().scale = new Vector3(1, 1, 1);
            c.AddComponent<BoxCollider>();
			Debug.Log(path);
            var prefab = PrefabUtility.CreateEmptyPrefab(path);
            PrefabUtility.ReplacePrefab(p, prefab, ReplacePrefabOptions.ConnectToPrefab);
        }
    }

    public static int Index = 0;

    public static string SpriteCollectionName = "SpriteCollectionInAAtalas";

    [MenuItem("Assets/Create/tk2d/Multiple Sprites In a Atalas")]
    public static void CreateMultipleSpritesInAAtalas()
    {
        var objects = new Object[Selection.objects.Length];
        Selection.objects.CopyTo(objects, 0);
        var assetPath = AssetDatabase.GetAssetPath(objects[0]);
        var spriteCollection = DoCollectionCreateForTextures(objects, Path.GetDirectoryName(assetPath),
                                                             SpriteCollectionName + Index++);
        foreach (var asset in objects)
        {
            var path = CreateNewPrefab(assetPath, asset.name);
            if (path.Length == 0)
            {
                return;
            }
            var n = Path.GetFileNameWithoutExtension(AssetDatabase.GetAssetPath(asset));
            var p = new GameObject(n);
            var c = new GameObject(n);
            c.transform.parent = p.transform;
            c.AddComponent<tk2dSprite>().SetSprite(spriteCollection, n);
            c.AddComponent<BoxCollider>();
            c.transform.localPosition = new Vector3(0, 0, 4);
            c.transform.localEulerAngles = new Vector3(90, 0, 0);
            var prefab = PrefabUtility.CreateEmptyPrefab(path);
            PrefabUtility.ReplacePrefab(p, prefab, ReplacePrefabOptions.ConnectToPrefab);
        }
    }

    private static tk2dSpriteCollectionData DoCollectionCreate(Object texture, string assetPath, string name)
    {
        var path = CreateNewPrefab(assetPath, name);
        if (path.Length == 0)
        {
            return null;
        }
        var go = new GameObject();
        var spriteCollection = go.AddComponent<tk2dSpriteCollection>();
        spriteCollection.version = tk2dSpriteCollection.CURRENT_VERSION;
        SetGameObjectActive(go, false);
        var p = PrefabUtility.CreateEmptyPrefab(path);
        PrefabUtility.ReplacePrefab(go, p, ReplacePrefabOptions.ConnectToPrefab);
        Object.DestroyImmediate(go);
        Selection.activeObject = AssetDatabase.LoadAssetAtPath(path, typeof(Object));
        CommitSpriteCollection(((GameObject)Selection.activeObject).GetComponent<tk2dSpriteCollection>(), new[] { texture });
        return ((GameObject)Selection.activeObject).GetComponent<tk2dSpriteCollection>().spriteCollection;
    }

    private static tk2dSpriteCollectionData DoCollectionCreateForTextures(IEnumerable<Object> textures, string assetPath, string name)
    {
        var path = CreateNewPrefab(assetPath, name);
        if (path.Length == 0)
        {
            return null;
        }
        var go = new GameObject();
        var spriteCollection = go.AddComponent<tk2dSpriteCollection>();
        spriteCollection.version = tk2dSpriteCollection.CURRENT_VERSION;
        SetGameObjectActive(go, false);
        var p = PrefabUtility.CreateEmptyPrefab(path);
        PrefabUtility.ReplacePrefab(go, p, ReplacePrefabOptions.ConnectToPrefab);
        Object.DestroyImmediate(go);
        Selection.activeObject = AssetDatabase.LoadAssetAtPath(path, typeof(Object));
        CommitSpriteCollection(((GameObject)Selection.activeObject).GetComponent<tk2dSpriteCollection>(), textures);
        return ((GameObject)Selection.activeObject).GetComponent<tk2dSpriteCollection>().spriteCollection;
    }

    public static void SetGameObjectActive(GameObject go, bool active)
    {
        go.SetActive(active);
    }

    private static void CommitSpriteCollection(tk2dSpriteCollection spriteCollection, IEnumerable<Object> objects)
    {
        var spriteCollectionProxy = new SpriteCollectionProxy(spriteCollection);
        foreach (var obj in objects)
        {
            var tex = obj as Texture2D;
            if (tex == null)
            {
                continue;
            }
            var name = spriteCollectionProxy.FindUniqueTextureName(tex.name);
            var slot = spriteCollectionProxy.FindOrCreateEmptySpriteSlot();
            spriteCollectionProxy.textureParams[slot].name = name;
            spriteCollectionProxy.textureParams[slot].colliderType = tk2dSpriteCollectionDefinition.ColliderType.UserDefined;
            spriteCollectionProxy.textureParams[slot].texture = (Texture2D)obj;
        }
        spriteCollectionProxy.DeleteUnusedData();
        spriteCollectionProxy.CopyToTarget();
        tk2dSpriteCollectionBuilder.ResetCurrentBuild();
        if (!tk2dSpriteCollectionBuilder.Rebuild(spriteCollection))
        {
            EditorUtility.DisplayDialog("Failed to commit sprite collection",
                "Please check the console for more details.", "Ok");
        }
        spriteCollectionProxy.CopyFromSource();
    }
}
