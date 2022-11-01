Shader "_KBNShaders_/kbnTile" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Color ("Color (RBBA)", Color) = (1, 1, 1, 1)
//		_CutOff ("Alpha CutOff", Range(0, 1)) = 0.6
	}
	SubShader {
//		Tags { "Queue"="Geometry" "RenderType"="Opaque" }
////		LOD 200
//		Lighting Off
//		ZWrite On
//		AlphaTest Greater [_CutOff]
//		
//		Pass {
//			SetTexture [_MainTex] { combine texture }
//		}
		Tags { "Queue"="Transparent" "RenderType"="Transparent" }
//		LOD 200
		Lighting Off
		ZWrite Off
		ZTest Always
		Blend SrcAlpha OneMinusSrcAlpha
		
		Pass {
			SetTexture [_MainTex] { 
				constantColor [_Color]
				combine texture * constant
			}
		}
	} 
	FallBack "Diffuse"
}
