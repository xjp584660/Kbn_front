using UnityEditor;
using UnityEngine;
using System.IO;
using System.Text.RegularExpressions;

namespace KBNEditor {
    // TODO: Use configuration files for more complicated rules
    public class KBNAssetPostprocessor : AssetPostprocessor {
        private const string GameLogoPathPattern = @"Assets/Resources/Textures/UI/LOAD/gamelogo_\w+.png";
        private const string OriginTexturePathPattern = @"Assets/OriginTexture/.*/\w+.png";
        private const string ExportTexturePathPattern = @"Assets/ExportTextures/.*/\w+.png";
        private const string UIDecorationPattern = @"Assets/Resources/Textures/UI/decoration/\w+.png";
        private const string UIDecorationExcludeFileNamePattern = @"DailyLoginUIAnim";
        private const int GameLogoMaxTextureSize = 1024;
        private const int OriginExportMaxTextureSize = 1024;

        #region AssetPostprocessor messages
        private void OnPreprocessTexture() {
            TextureImporter importer = assetImporter as TextureImporter;
            if (IsGameLogo()) {
                ApplyGameLogoSettings(importer);
                return;
            }
            if (IsOriginOrExportTexture()) {
                ApplyOriginOrExportTextureSettings(importer);
                return;
            }
            if (IsUIDecorationTexture()) {
                ApplyUIDecorationTextureSettings(importer);
                return;
            }
        }

        private void OnPreprocessAudio() {
            AudioImporter importer = assetImporter as AudioImporter;
            ApplyAudioSettings(importer);
        }
        #endregion

        private bool IsGameLogo() {
            return Regex.IsMatch(assetPath, GameLogoPathPattern);
        }

        private bool IsOriginOrExportTexture() {
            return Regex.IsMatch(assetPath, OriginTexturePathPattern) || Regex.IsMatch(assetPath, ExportTexturePathPattern);
        }

        private bool IsUIDecorationTexture() {
            return Regex.IsMatch(assetPath, UIDecorationPattern) 
                && !Regex.IsMatch(Path.GetFileNameWithoutExtension(assetPath), UIDecorationExcludeFileNamePattern);
        }

        private static void ApplyGameLogoSettings(TextureImporter importer) {
            ApplyUIBasicSettings(importer);
            importer.maxTextureSize = GameLogoMaxTextureSize;
        }

        private static void ApplyOriginOrExportTextureSettings(TextureImporter importer) {
            importer.textureType = TextureImporterType.Default;
            importer.isReadable = true;
            importer.maxTextureSize = OriginExportMaxTextureSize;
            importer.npotScale = TextureImporterNPOTScale.None;
            importer.mipmapEnabled = false;
            importer.wrapMode = TextureWrapMode.Clamp;
            importer.filterMode = FilterMode.Point;
            importer.textureFormat = TextureImporterFormat.AutomaticTruecolor;
        }

        private static void ApplyUIDecorationTextureSettings(TextureImporter importer) {
            ApplyUIBasicSettings(importer);
        }

        private static void ApplyUIBasicSettings(TextureImporter importer) {
            //importer.textureType = TextureImporterType.GUI;
            //importer.filterMode = FilterMode.Bilinear;
            //importer.textureFormat = TextureImporterFormat.AutomaticCompressed;
        }

        private static void ApplyAudioSettings(AudioImporter importer) {
            importer.threeD = false;
        }
    }
}
