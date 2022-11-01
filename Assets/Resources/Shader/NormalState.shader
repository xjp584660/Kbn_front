Shader "Mobile/NormalState" 
{	
	SubShader 
	{
		Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
		LOD 200
		
		CGPROGRAM
		#pragma surface surf Lambert alpha

		sampler2D _MainTex;
		float _Shininess;

		float specularFactor;

		struct Input 
		{
			float2 uv_MainTex;
		};

		void surf (Input IN, inout SurfaceOutput o) 
		{
			half4 c = tex2D (_MainTex, IN.uv_MainTex) * _Shininess;
			o.Albedo = c.rgb;
			o.Alpha =  c.a;
		}
		
		ENDCG		
	} 
	//FallBack "Transparent/VertexLit"
}