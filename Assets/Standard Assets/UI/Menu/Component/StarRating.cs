using UnityEngine;

public enum RateImgPos{
	IMAGE_RIGHT,
	IMAGE_DOWN
};

public class StarRating : SimpleUIObj
{	
	public Texture image;
	public Rect sourceRect;
	public UIRotation rotation;
	public bool useTile = false;
	public bool drawTileByGraphics = false;
	public Tile tile;
	public int starWidth;
	public int starHeight;
	public int starY;
	public Label title;
	public RateImgPos imgPos = RateImgPos.IMAGE_RIGHT;
	private int m_rate;
	private int starX;

	public override int Draw()
	{	
		if( !visible || !IsPaint()){
			return -1;
		}
		
		Rect starRegion;
		GUI.BeginGroup(rect);
		title.Draw();
		GUI.EndGroup();
		if(useTile && tile.IsValid)
		{
			tile.rect = rect;
			starWidth = 20;
			for(int i = 0; i<m_rate ; i++)
			{
	//			starRegion = ;
				tile.Draw(rect, drawTileByGraphics);
			}	
		}
		else
		{	
			for( int i = 0; i<m_rate ; i++)
			{
				starRegion = new Rect(rect.x + starX + i*starWidth-i,rect.y + starY,starWidth,starHeight);
				GUI.Label(starRegion, image);	
			}
		}	
		return -1;
	}
	
	public int Rate
	{
		set
		{
			m_rate = value;
			if( imgPos == RateImgPos.IMAGE_DOWN ){
				starX = (int)((rect.width - starWidth * m_rate)/2);
			}
		}
	}
	
	public string Text
	{
		set
		{
			title.txt = value;
			
			if( imgPos == RateImgPos.IMAGE_RIGHT ){
				starX = title.GetWidth()+ 5;
			}
			
		}
		get
		{
			return title.txt;
		}
	}

	public override void OnPopOver() 
	{
		title.OnPopOver();
		UIObject.TryDestroy(this);
	}
	

}
