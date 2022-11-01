// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Custom/FodOfWar" {
	Properties {
        _MainTex ("Base (RGB)", 2D) = "white" {}//目标图片，即需要被遮罩的图片
        _MaskLayer("Culling Mask",2D) = "white"{}//混合的图片，设置为白色的图片，任何颜色与白色混合，其颜色不变
         _Color ("Color", Color) = (1,1,1,1)
        _Radius ("Radius", Range(0,0.01)) = 0.005
        _Threshold ("Threshold", Range(0, 0.5)) = 0.01
    }
    SubShader {
        Tags { 
            "Queue"="Transparent" 
        }//渲染队列设置为  以从后往前的顺序渲染透明物体
        Lighting off //关闭光照
        ZWrite off //关闭深度缓存
        Blend off //关闭混合

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            // make fog work
            #pragma multi_compile_fog
            
            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                // UNITY_FOG_COORDS(1)
                float4 vertex : SV_POSITION;
            };
            
            fixed4 _Color;
            sampler2D _MainTex;
            sampler2D _MaskLayer;
            float _Radius;
            float _Threshold;

            float4 _MaskLayer_ST;
            
            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, _MaskLayer);
                // UNITY_TRANSFER_FOG(o, o.vertex);
                return o;
            }
            
            fixed4 frag (v2f i) : SV_Target
            {
                float2 uv = i.uv;
                float4 c = tex2D(_MaskLayer, i.uv);
                bool colored = false;
                
                // 透明格子
                if(c.a < _Threshold)
                {
                    half2 pos;
                    fixed4 neighborCol;
                    float sqrtR = _Radius * cos(3.14159 / 4);
                    //上
                    pos = uv + half2(0, _Radius);
                    neighborCol = tex2D(_MaskLayer, pos);
                    if(neighborCol.a >= _Threshold)
                    {
                        colored = true;
                    }
                    //下
                    pos = uv - half2(0, _Radius);
                    neighborCol = tex2D(_MaskLayer, pos);
                    if(neighborCol.a >= _Threshold)
                    {
                        colored = true;
                    }
                    //左
                    pos = uv - half2(_Radius, 0);
                    neighborCol = tex2D(_MaskLayer, pos);
                    if(neighborCol.a >= _Threshold)
                    {
                        colored = true;
                    }
                    //右
                    pos = uv + half2(_Radius, 0);
                    neighborCol = tex2D(_MaskLayer, pos);
                    if(neighborCol.a >= _Threshold)
                    {
                        colored = true;
                    }

                    //左上
                    pos = uv + half2(-sqrtR, sqrtR);
                    neighborCol = tex2D(_MaskLayer, pos);
                    if(neighborCol.a >= _Threshold)
                    {
                        colored = true;
                    }
                    //右上
                    pos = uv + half2(sqrtR, sqrtR);
                    neighborCol = tex2D(_MaskLayer, pos);
                    if(neighborCol.a >= _Threshold)
                    {
                        colored = true;
                    }
                    //左下
                    pos = uv + half2(-sqrtR, -sqrtR);
                    neighborCol = tex2D(_MaskLayer, pos);
                    if(neighborCol.a >= _Threshold)
                    {
                        colored = true;
                    }
                    //右下
                    pos = uv + half2(sqrtR, -sqrtR);
                    neighborCol = tex2D(_MaskLayer, pos);
                    if(neighborCol.a >= _Threshold)
                    {
                        colored = true;
                    }
                }
                if (c.a < _Threshold)
                {
                    if(colored)
                        c = _Color;
                    else
                    {
                        float2 offset = _MaskLayer_ST.zw;
                        c = tex2D(_MainTex, i.uv - offset);
                    }
                }
                else
                {
                   c = float4(0,0,0,0);  
                }
                clip (c.a - _Threshold);
                return c;
            }
            ENDCG
        }
    }
}
