
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
public interface IEventHandler
{
	void handleItemAction(string action, object param);
}

public class ListItem : UIObject
{ 	
	[Space(30),Header("-----------ListItem-----------")]



	public Label title;
	public Label icon;
	public Button btnSelect;
	public Label description;
	protected int ID = 0;
	public string category;
	//
	public IEventHandler handlerDelegate;
	public List<UIObject> componetList=new List<UIObject>(); 
	protected int indexInList = -1;
	protected int itemAllCount = -1;
	protected bool useGroupDraw=true;
	public bool useDrawrect=false;
	protected Rect Drawrect = new Rect(0, 0,0, 0);
	public Vector2 DistNormal=Vector2.one;//item width,height

	protected List<UIObject> items = new List<UIObject>();
	public int colPerPage = 1;
	public int colDist = 0;

	public void AddItem( UIObject item)
	{
		if( items.Count%colPerPage == 0)
		{
			item.rect.y = rect.height; 
			//item.rect.x = 0;
			rect.height += item.rect.height;
			DistNormal.y = rect.height;
		}
		else
		{
			if(items.Count > 0)
			{
				item.rect.x = (items[items.Count-1]).rect.xMax + colDist; 
				item.rect.y = (items[items.Count-1]).rect.y;
			}	
			else
			{	
				item.rect.x = 0;
			}
		}
				
		items.Add(item);
	}

	public override void Init ()
	{
		base.Init ();
//		if(inScreenAspect){
//			lockWidthInAspect = true;
//				KBN._Global.IsTallerThanLogicScreen();
//			lockHeightInAspect = KBN._Global.IsShorterThanLogicScreen();
//		}
	}
	public override int Draw()
	{
	//	DrawBackGround();
		if(!visible)
			return -1;

//		Matrix4x4 matrix = GUI.matrix; 
//		Matrix4x4 scaleMatrix = Matrix4x4.Scale  ( new Vector3 (scaleX, scaleY, 1.0f));
//		GUI.matrix = scaleMatrix*matrix ;
		Matrix4x4 oldMatrix = GUI.matrix;
		bool matrixChanged = CheckScal();
		if(useDrawrect){
			Drawrect =new Rect(rect.x,rect.y,DistNormal.x,DistNormal.y);
			GUI.BeginGroup(Drawrect);
		}else
			GUI.BeginGroup(rect);
		if(useGroupDraw) prot_drawSelfWithoutGroup();
		DrawItem();
		GUI.EndGroup();
		if(matrixChanged)
			GUI.matrix = oldMatrix;
	   	return -1;
	}


	protected  bool CheckScal()
	{
		if(!inScreenAspect){
			return false;
		}else if(lockWidthInAspect == lockHeightInAspect ){
			return false;
		}
		return applyRotationAndScaling();
	}


	public virtual void DrawItem()
	{
//		for(var i=0; i<items.Count; i++)
//		{
//			items[i].Draw();
//		}		
	}

	protected void prot_drawSelfWithoutGroup()
	{
		//	DrawTitle();
		if(title != null)
		{
			title.Draw();
		}

		if(icon != null)
		{
			icon.Draw();
		}

		if ( description != null )	
			description.Draw();
		if(btnSelect)
			btnSelect.Draw();
	}
	
	public virtual void SetID(int newID)
	{
		if(newID != ID)
		{
			ID = newID;
			InitContent();
		}
	}
	
	public int GetID()
	{
		return ID;
	}
	
	public virtual bool isUseOutListItem()
	{
		return false;
	}
	
	public virtual void InitContent()
	{
	}

	public virtual void UpdateData()
	{
	}
	
	public virtual void SetRowData(object data)
	{
//		_Global.Log("SetRowData does not be implemented ");
	}
	
	public virtual void SetIndexInList(int index)
	{
		indexInList = index;
	}

	public virtual void SetListCount(int count)
	{
		itemAllCount = count;
	}

	public virtual void SetScrollPos(int pos, int listHeight)
	{
		if(icon)
		{
			if(GUI.color.a != 1)
			{
				icon.drawTileByGraphics = false;
			}
			else
			{
				if(rect.y - pos < 0 || rect.y+rect.height - pos > listHeight)
				{
					icon.drawTileByGraphics = false;
				}
				else
				{
					icon.drawTileByGraphics = true;
				}
			}
		}
	}
	
	public virtual bool willBeRemoved()
	{
		return false;
	}


}

