Shader "Mobile/Decaration/Margin" 
{ 
    Properties 
    {
        _MainTex ("Base (RGB)", 2D) = "white" {}
    }

    SubShader {
    	Tags {"Queue"="Transparent"}
       
        Pass {

        	Blend SrcAlpha OneMinusSrcAlpha
        
            SetTexture [_MainTex] 
            {
                Combine texture
            }
        }
    }
}