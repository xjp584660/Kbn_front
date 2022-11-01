using UnityEngine;
using System.Collections.Generic;
using KBN;

public class LoadingLabel :SimpleUIObj
{
	public  SimpleLabel	aniLabel;
	public	int	aniFramCnt = 8;
	private	int		aniIdx = 0;
	private	System.Collections.Generic.List<Texture2D>	imgs;
	
	private	float		frameTimeCtrl;
	
	
	// Use this for initialization
	public override void Init () 
	{
		imgs = new System.Collections.Generic.List<Texture2D>(aniFramCnt);
		for( var i = 0; i < aniFramCnt; i ++ )
		{
			imgs.Add (TextureMgr.instance().LoadTexture("load_" + (i + 1),TextureType.LOADING));
		}
		aniLabel.image = imgs[0];
	}
	
	// Update is called once per frame
	public override void Update () 
	{
		if( !visible ){
			return;
		}
		
		frameTimeCtrl -= Time.deltaTime;
		if( frameTimeCtrl < 0 ){
			aniIdx ++;
			if( aniIdx >= aniFramCnt ){
				aniIdx = 0;
			}
			
			aniLabel.image = imgs[aniIdx];
			
			frameTimeCtrl += 0.1f; //0.1 means 10f/s
		}
	}
	public override int Draw()
	{					
		if( !visible ){
			return -1;
		}
		aniLabel.rect = this.rect;
		aniLabel.Draw();
		return -1;
	}
}



public class LoadingLabelImpl
{
	private  SimpleLabel	aniLabel = new SimpleLabel();
	private SimpleLabel 	m_backgroundLabel;
	private	int		aniFramCnt = 8;
	private	int		aniIdx = 0;
	private	System.Collections.Generic.List<Texture2D>		imgs;
	
	private	float		frameTimeCtrl;
	
	// Use this for initialization
	public  LoadingLabelImpl ():this(false)
	{
	}
	public LoadingLabelImpl (bool isNeedBackground ):this(isNeedBackground, new Vector2(MenuMgr.SCREEN_WIDTH * 0.5f, MenuMgr.SCREEN_HEIGHT * 0.5f))
	{

	}
	
	public LoadingLabelImpl (bool isNeedBackground, Vector2 centerPos ) {
		if ( isNeedBackground )
		{
			m_backgroundLabel = new SimpleLabel();
			m_backgroundLabel.rect = new Rect(-10, -10, MenuMgr.SCREEN_WIDTH + 20, MenuMgr.SCREEN_HEIGHT + 20);
			m_backgroundLabel.mystyle.normal.background = TextureMgr.instance().LoadTexture("black_Translucent",TextureType.DECORATION);
			m_backgroundLabel.mystyle.border.left = 10;
			m_backgroundLabel.mystyle.border.right = 10;
			m_backgroundLabel.mystyle.border.top = 10;
			m_backgroundLabel.mystyle.border.bottom = 10;
		}
		imgs = new System.Collections.Generic.List<Texture2D>(aniFramCnt);
		for( var i = 0; i < aniFramCnt; i ++ ){
			imgs.Add(TextureMgr.instance().LoadTexture("load_" + (i + 1),TextureType.LOADING));
		}
		aniLabel.image = imgs[0];
		aniLabel.rect.width = imgs[0].width;
		aniLabel.rect.height = imgs[0].height;
		aniLabel.rect.height += 32;
		aniLabel.rect.x = centerPos.x - aniLabel.rect.width * 0.5f;
		aniLabel.rect.y = centerPos.y - aniLabel.rect.height * 0.5f;
		aniLabel.txt = Datas.getArString("Common.Loading");
		aniLabel.mystyle.imagePosition = ImagePosition.ImageAbove;
		aniLabel.SetFont(FontSize.Font_22, FontType.TREBUC);
	}

	public void ConstructData(bool isNeedBackground, Vector2 centerPos)
	{

	}

	static private float m_alphaColor   = 0.7f;
	// Update is called once per frame
	public void Update () {
		frameTimeCtrl -= Time.deltaTime;
		if( frameTimeCtrl < 0 ){
			aniIdx ++;
			if( aniIdx >= aniFramCnt ){
				aniIdx = 0;
			}
			
			aniLabel.image = imgs[aniIdx];
			
			frameTimeCtrl += 0.1f; //0.1 means 10f/s
		}
	}
	
	public void Draw()
	{
		if ( !this.IsPaint() )
			return;
		
		GUI.color = new Color(1.0f, 1.0f, 1.0f, m_alphaColor);
		if ( m_backgroundLabel != null )
			m_backgroundLabel.Draw();
		GUI.color = new Color(1.0f, 1.0f, 1.0f, 1.0f);
		aniLabel.Draw();
	}
	
	public bool IsPaint()
	{
		return Event.current.type == EventType.Repaint;
	}
}
