using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;


public class GLDrawLine : MonoBehaviour 
{
    public static GLDrawLine singleton {get; protected set;}

	public delegate void DrawTextureOK();
	public event DrawTextureOK onDrawTextureOK = null;

    public List<Vector3> m_point3;
    public Color m_lineColor;
    //public Color m_bgColor = new Color(198f/255f, 206f/255f, 211f/255f, 255f/255f);
	public Color m_bgColor = new Color(0f, 0f, 0f, 0f);
    public Texture2D m_texure; //最终渲染得到的带有贝塞尔曲线的纹理

	public int segmentNum = 1000;

    public int width = 460;
    public int height = 174;

    public static GLDrawLine instance()
    {
        return singleton;
    }
		
	public void Awake() 
    {
        if(singleton)
        {
            Destroy(gameObject);
        }

        singleton = this;

        DontDestroyOnLoad(this.transform);

        //InitCanvas(460, 174);
        //GetTexturePixels();
	}
	
	void OnGUI()
	{
//		GUI.DrawTexture(new Rect(0, 0, width, height), m_texure);
//        StartCoroutine(Draw());
	}

	public void InitCanvas(List<Vector3> points, int width, int height) 
    {
		this.m_point3 = points;
		this.width = width;
		this.height = height;
        // 带透明通道的
		m_texure = new Texture2D(width, height, TextureFormat.ARGB32, false);
		
		StartCoroutine(Draw());
    }

    public IEnumerator Draw()
    {
        //清空纹理对象
        for (int i = 0; i < width; i++)
        {
            for (int j = 0; j < height; j++)
            {
                m_texure.SetPixel(i, j, m_bgColor);
            }
        }

        for(int j = 1 ; j <= segmentNum; j++)
        {
            float t = j / (float)segmentNum;

            for(int i = 0; i <= m_point3.Count - 2; i++)
            {
                int p0 = i - 1 <= 0 ? 0 : i - 1;
                int p1 = i;
                int p2 = i + 1;
                int p3 = i + 2 > m_point3.Count - 1 ? m_point3.Count - 1 : i + 2;

                Vector3 pixel = CatmullRomPoint(t, m_point3[p0] ,m_point3[p1], 
                    m_point3[p2], m_point3[p3]);

				int pixelX = Convert.ToInt32(pixel.x);
				int pixelY = Convert.ToInt32(pixel.y);
				m_texure.SetPixel(pixelX, pixelY, m_lineColor);
				m_texure.SetPixel(pixelX, pixelY - 1, m_lineColor);
				//m_texure.SetPixel(pixelX, pixelY - 2, m_lineColor);
            }
        }

        m_texure.Apply();

		if(onDrawTextureOK != null)
		{
			onDrawTextureOK();
		}

        yield return m_texure;
    }

	public void RegisterDrawTextureOKFunc(DrawTextureOK ok)
	{
		onDrawTextureOK = ok;
	}

	private Vector3 CatmullRomPoint(float t, Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3)
	{
		return p1 + (0.5f * (p2 - p0) * t) + 0.5f * (2f * p0 - 5f * p1 + 4f * p2 - p3) * t * t +
			0.5f * (-p0 + 3f * p1 - 3f * p2 + p3) * t * t * t;
	}

    private Vector3 CalculateCubicBezierPoint(float t, Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3)
    {
        float u = 1 - t;
        float tt = t * t;
        float uu = u * u;
        float uuu = uu * u;
        float ttt = tt * t;

        Vector3 p = uuu * p0;
        p += 3 * uu * t * p1;
        p += 3 * u * tt * p2;
        p += ttt * p3;

        return p;
    }

	private Vector3 CalculateCubicBezierPoint(float t, Vector3 p0, Vector3 p1, Vector3 p2)
	{
		float u = 1 - t;
		float tt = t * t;
		float uu = u * u;
		  
		Vector3 p = uu * p0;
		p += 2 * u * t * p1;
		p += tt * p2;
  
		return p;
	}

    private Vector3 CalculateCubicBezierPoint(float t, Vector3 p0, Vector3 p1)
    {
        float u = 1 - t;

        Vector3 p = u * p0 + p1 * t;

        return p;
    }
}