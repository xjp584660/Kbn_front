// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Custom/Diffuse+Selfluminous2tex" {
Properties {
	_Color ("Main Color", Color) = (1,1,1,1)
	_Alphapow ("Alphapow", Range(-4,0) ) = 0
	_Selflu ("Self-luminous", Color) = (0,0,0,0)
	_ID01Tex ("FaceID_01 (RGB) SelfiuGloss (A)", 2D) = "Black" {}
	_ID02Tex ("FaceID_02 (RGB) SelfiuGloss (A)", 2D) = "Black" {}
	_RimColor ("Rim Color", Color) = (0.000,0.000,0.000,1.000)
    _RimPower ("Rim Range", Range(0.5,15.0)) = 3.0
    _Rimstrong ("Rim Strength", Float ) = 1
//	_EFTex ("EFTex", 2D) = "Black" {}
//	_EFCol ("EFCol", Color) = (0,0,0,0)
//	_EFu ("EFu", Float ) = 1
//	_EFv ("EFv", Float ) = 1
//    _RimEF ("RimEF", Range(1,10)) = 1
//	_sz ("sz", Range (0,1)) = 0.001
//  _sr ("sr", Range (0,1)) = 0.001
//  _scrH ("scrH", float ) = 4000
}
///////////////Subshader1:开启glsl和Target3.0 支持较复杂的效果和更多的纹理差值. 
///////////////Subshader2:关闭glsl和Target3.0.
///////////////Subshader3:使用Unlit渲染基本支持所有低端设备.
//SubShader {
//	Tags { "RenderType"="Opaque" }
//	LOD 1000

//Tags { "Queue"="Transparent"  "RenderType"="Transparent" }
//	Blend SrcAlpha OneMinusSrcAlpha
//	//AlphaTest Greater .01
//	
//CGPROGRAM
//#pragma surface surf Lambert vertex:vert
//#pragma glsl
//#pragma target 3.0
//
//		sampler2D _ID01Tex;
//		sampler2D _ID02Tex;
//		sampler2D _EFTex;
//		fixed4 _Color;
//		float4 _Selflu;
//		float4 _RimColor;
//		float4 _EFCol;
//		float _RimPower;
//		float _Rimstrong;
//		float _RimEF;
//		float _EFu;
//		float _EFv;
//		float _Alphapow;
////		int _scrH;
////		float _sz;
////		float _sr;
//
//
//struct Input {
//	
//		float4 vertex : POSITION;
//		float2 _ID01TexUV : TEXCOORD0;
//		float2 _ID02TexUV2 : TEXCOORD1;
//		float3 viewDir;
//		float4 screenPos;
////		float4 screenPos;
//};
//
//void vert (inout appdata_full v, out Input c )
//			{
//			
//				c.vertex = mul(UNITY_MATRIX_MVP, v.vertex);
//				c._ID01TexUV = v.texcoord;
//				c._ID02TexUV2 = v.texcoord1;
//				c.screenPos = c.vertex;
//				//c.screenPos.z = c.vertex.w;
//			}
//
//void surf (Input IN, inout SurfaceOutput o) {
////	clip (frac((IN.screenPos.x*_sr + IN.screenPos.y)/IN.screenPos.w * (_scrH*0.3)) - _sz);	
//	fixed4 c1 = tex2D(_ID01Tex, IN._ID01TexUV) * _Color;
//	fixed4 c2 = tex2D(_ID02Tex, IN._ID02TexUV2) * _Color;
//	half rim = 1.0 - saturate(dot (normalize(IN.viewDir), o.Normal));
//	half EFr = saturate(dot (normalize(IN.viewDir), o.Normal));
//	float2 screenUV = IN.screenPos;//.xy / IN.screenPos.z;
//           screenUV *= float2(_EFu,_EFv);
//    fixed3 c3 = tex2D (_EFTex, screenUV );
//    fixed3 c4 =  c3.rgb * pow (EFr, _RimEF)*_EFCol;
//    fixed  a1 = c1.a + c2.a;
//	o.Albedo = (c1.rgb ) + (c2.rgb );
//	o.Alpha =_Color.a + ((c1.rgb + c2.rgb)+_Alphapow) ;// c1.a + c2.a;
//	o.Emission = ((a1 * 2 * _Selflu) + ((_RimColor.rgb * pow (rim, _RimPower)) * _RimColor.a * _Rimstrong))+c4.rgb;
//}
//ENDCG
//}
SubShader {
Tags { "Queue"="Transparent"  "RenderType"="Transparent" }
	Blend SrcAlpha OneMinusSrcAlpha

CGPROGRAM
#pragma surface surf Lambert 
//vertex:vert

		sampler2D _ID01Tex;
		sampler2D _ID02Tex;
		fixed4 _Color;
		float4 _Selflu;
		float4 _RimColor;
		float _RimPower;
		float _Rimstrong;
		float _Alphapow;


struct Input {
	
		float4 vertex : POSITION;
//		float2 _ID01TexUV : TEXCOORD0;
//		float2 _ID02TexUV2 : TEXCOORD1;
        float2 uv_ID01Tex;
        float2 uv2_ID02Tex;
		float3 viewDir;
		float4 screenPos;
};

//void vert (inout appdata_full v, out Input c )
//			{
//			
//				c.vertex = mul(UNITY_MATRIX_MVP, v.vertex);
//				c._ID01TexUV = v.texcoord;
//				c._ID02TexUV2 = v.texcoord1;
//			}

void surf (Input IN, inout SurfaceOutput o) {
	fixed4 c1 = tex2D(_ID01Tex, IN.uv_ID01Tex) * _Color;
	fixed4 c2 = tex2D(_ID02Tex, IN.uv2_ID02Tex) * _Color;
	half rim = 1.0 - saturate(dot (normalize(IN.viewDir), o.Normal));
    fixed  a1 = c1.a + c2.a;
	o.Albedo = c1.rgb  + c2.rgb ;
	o.Alpha =1+ ((c1.r+c1.g+c1.b + c2.r+c2.g+c2.b)+_Alphapow) ;
	o.Emission = ((a1 * 2 * _Selflu) + ((_RimColor.rgb * pow (rim, _RimPower)) * _RimColor.a * _Rimstrong));
}
ENDCG
}

SubShader {
	Tags { "RenderType"="Opaque" }
	LOD 100
	
	Pass {  
		CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			
			#include "UnityCG.cginc"


			struct v2f {
				float4 vertex : SV_POSITION;
				float2 _ID01TexUV : TEXCOORD0;
				float2 _ID02TexUV2 : TEXCOORD1;
			};

			sampler2D _ID01Tex;
			sampler2D _ID02Tex;
			
			v2f vert (appdata_full v)
			{
				v2f c;
				c.vertex = UnityObjectToClipPos(v.vertex);
				c._ID01TexUV = v.texcoord;
				c._ID02TexUV2 = v.texcoord1;
				return c;
			}
			
			fixed4 frag (v2f i) : COLOR
			{
				fixed4 col = tex2D(_ID01Tex, i._ID01TexUV)+tex2D(_ID02Tex, i._ID02TexUV2);
				return col;
			}
		ENDCG
	}
}


Fallback "VertexLit"
}
