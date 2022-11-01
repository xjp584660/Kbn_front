// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "PostEffect" 
{
	Properties  
	{
	   _MyFloat ("Color", Range(0, 0.99)) = 0.5	
	   _AlphaPower ("Alpha", Range(0, 1)) = 1 
	   
	}
	
	Category 
	{
		Blend SrcAlpha One
	
		SubShader 
		{
			//Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
			//LOD 200
			Pass
			{
	        	Fog { Mode Off }
				CGPROGRAM
				#pragma vertex vert
				#pragma fragment frag
				
				sampler2D _MainTex;
				float _MyFloat;
				float _AlphaPower;
				
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
					float4 texColor = tex2D(_MainTex, i.uv);
					float tempA = 2 - 4 * _MyFloat;
					float tempB = 4 * _MyFloat - 1;
					
					texColor.rgb =  tempA * texColor.rgb * texColor.rgb + tempB * texColor.rgb;
					//texColor.a = _AlphaPower * (texColor.r * 0.30 + texColor.g * 0.59 + texColor.b * 0.11);
					
				    return texColor;
				}
				ENDCG		
			}
		}
	}
}