Shader "UIDraw/DrawMultiUI"
{
	Properties
	{
		_MainTex ("Base (RGB)", 2D) = "white" {}
	}

	SubShader
	{
		Tags { "RenderType"="Transparent" }
		//LOD 200
		Pass
		{
			Blend SrcAlpha OneMinusSrcAlpha
			CGPROGRAM
			#pragma vertex vertEnter
			//#pragma fragment surf Lambert
			#pragma fragment fragEnter
			#include "UnityCG.cginc"
			uniform sampler2D _MainTex;
			uniform float4x4 _Mat;
			uniform float4 _Color;// = float4(1.0, 1.0, 1.0, 1.0);

			struct VInput
			{
				float4 pos : POSITION;
				float2 uv : TEXCOORD0;
				float4 color : COLOR;
			};
			
			struct v2f
			{
				float4 pos: SV_POSITION;
				float2 uv : TEXCOORD0;
				float4 color : COLOR;
			};
			
			//v2f vertEnter (appdata_base v)
			v2f vertEnter (VInput v)
			{
				v2f i;
				i.pos = mul(_Mat, v.pos);
				i.uv = v.uv;
				i.color = v.color;
				//i.pos = mul(_Mat, v.vertex);
				//i.uv = v.texcoord.xy;
				//i.color = v.color;
				return i;
			}

			float4 fragEnter (v2f i) : COLOR
			{
				float4 c = tex2D (_MainTex, i.uv);
				return c * _Color * i.color;
			}
			ENDCG
		}
	} 
	//FallBack "Diffuse"
}
