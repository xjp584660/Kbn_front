// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Mobile/FadeState" 
{
	Properties {
	    _MainTex ("Base (RGB)", 2D) = "white" {}
	    _Color ("Color (RGBA)", Color) = (1, 1, 1, 1)
	    specularFactor("Specular", Range(0, 1)) = 0.5 
	}


		SubShader 
		{
			Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
			ZWrite Off Lighting Off Cull Off Fog { Mode Off } Blend SrcAlpha OneMinusSrcAlpha		
		
			Pass
			{
				CGPROGRAM
				#pragma vertex vert
				#pragma fragment frag
				
				sampler2D _MainTex;
				float4 _Color;
				float specularFactor;
				
				struct appdata 
				{
				    float4 vertex:POSITION;
				    float4 texcoord:TEXCOORD0;
				}; 
				
				
				struct v2f 
				{
				    float4 pos:SV_POSITION;
				    float2 uv:TEXCOORD0;
				};
				
				v2f vert (appdata v) 
				{
				    v2f o;
				    o.pos = UnityObjectToClipPos(v.vertex);
				    o.uv = v.texcoord.xy;
				    return o;
				}
				
				half4 frag(v2f i):COLOR 
				{
					float4 texColor = tex2D(_MainTex, i.uv) * _Color;
					float tempA = 2 - 4 * specularFactor;
					float tempB = 4 * specularFactor - 1;
					
					texColor.rgb =  tempA * texColor.rgb * texColor.rgb + tempB * texColor.rgb;
	//				texColor.a = 1;//_AlphaPower * (texColor.r * 0.30 + texColor.g * 0.59 + texColor.b * 0.11);
					
				    return texColor;
				}
				ENDCG		
			}				
		}
	
	
	//FallBack "Transparent/VertexLit"
}