using UnityEngine;
using UnityEditor;
using System.Collections;
using System.IO;
using System.Text.RegularExpressions;

public static class JS2CS {
    [MenuItem("Assets/Convert to C#")]
    public static void Convert() {
        // TODO: Is 'TextAsset' too generic?
        Object[] selection = Selection.GetFiltered(typeof(TextAsset), SelectionMode.DeepAssets);
        foreach (Object o in selection) {
            TextAsset textAsset = o as TextAsset;
            string assetPath = AssetDatabase.GetAssetPath(textAsset);
            if (!assetPath.EndsWith(".js") && !assetPath.EndsWith(".cs")) {
                continue;
            }
            string[] lines = File.ReadAllLines(assetPath);
            for (int i = 0; i < lines.Length; ++i) {
                lines[i] = ConvertLine(lines[i]);
            }
            File.WriteAllLines(assetPath, lines);
            AssetDatabase.ImportAsset(assetPath);
        }
    }

    private static string ConvertLine(string line) {
        // Types
        line = Regex.Replace(line, @"\bString\b", @"string");
        line = Regex.Replace(line, @"\bboolean\b", @"bool");

        // Functions and variables
        line = Regex.Replace(line, @"function\s+(\w+)(\([^)]*\))\s*:\s*([\w\.]+)", @"$3 $1$2");
        line = Regex.Replace(line, @"function\s+(\w+)\s*(\([^)]*\))", @"void $1$2");
        line = Regex.Replace(line, @"var\s+(\w+)\s*:\s*([\w\.]+)\s*\[\s*\]", @"$2[] $1");
        line = Regex.Replace(line, @"var\s+(\w+)\s*:\s*([\w\.]+)", @"$2 $1");
        if (!Regex.IsMatch(line, @"\?") && !Regex.IsMatch(line, @"case\s*:")) {
            line = Regex.Replace(line, @"(\w+)\s*:\s*([\w\.]+)\s*\[\s*\]", @"$2[] $1");
            line = Regex.Replace(line, @"(\w+)\s*:\s*([\w\.]+)", @"$2 $1");
        }
        line = Regex.Replace(line, "@([\\w.\\(\\)\\\"]+)", @"[$1]");

        // Class inheritance
        line = Regex.Replace(line, @"\bclass\s*(\w+)\s*extends\s*(\w+)", @"class $1 : $2");
        line = Regex.Replace(line, @"\bsuper\b", @"base");
        return line;
    }
}
