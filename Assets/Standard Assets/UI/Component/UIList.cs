using UnityEngine;
using System.Collections.Generic;

public class UIList : UIObject
{
	protected List<UIObject> items = new List<UIObject>();

	public bool growDown;
	
	public int colPerPage = 1;
	public int colDist = 0;
	
	protected Rect rectFixed;

	public override void Init()
	{
		base.Init();

		rectFixed = rect;
		Clear();
	}
	
	public void AddItem( UIObject item)
	{
		if(growDown)
		{	
			if( items.Count%colPerPage == 0)
			{
				item.rect.y = rect.height; 
				item.rect.x = 0;
				rect.height += item.rect.height;
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
		}
		else 
		{
			if( items.Count%colPerPage == 0)
			{
				item.rect.y = rect.height; 
				rect.y -= item.rect.height;
				rect.height += item.rect.height;
			}
			else
			{
				if(items.Count > 0)
					item.rect.x = (items[items.Count-1]).rect.xMax + colDist; 
				else	
					item.rect.x = rect.x;
			}
		}

		items.Add(item);
	}
	
	public void RemoveIem()
	{
	}
	
//	public void Refresh()
//	{
//		for(var i=0; i<items.length; i++)
//		{		
//		 //   items[i].rect.x = (i%colPerPage)*colDist;
//		 //   items[i].rect.y = (i/colPerPage)*rowDist;		    
//		}	
//
//	}

	public void Clear()
	{
		Clear(false);
	}

	public void Clear(bool destroy)
	{
		if( this.items != null)
		{
			if (destroy) {
				for (int i = 0; i < items.Count; i++) {
					TryDestroy(items[i]);
					items[i] = null;
				}
			}
			items.Clear();
		}
		else		
			items = new List<UIObject>();		
		rect = rectFixed;
		rect.height = 0;
	}

	public UIObject getItem(int index)
	{
		return items[index];
	}
	
	public bool setItem(int index, UIObject obj)
	{
		if (index >= items.Count)
			return false;
		items[index] = obj;
		return true;
	}

	public void onNavigatorUp()
	{
	//	this.goToPrevious();
	}

	public void onNavigatorDown()
	{
	//	this.goToNext();	
	}


	public override int Draw()
	{
		if (!visible)
			return -1;

		if ( Event.current.type == EventType.Repaint )
			this.prot_calcScreenRect();

		var selectedItem = -1;
		GUI.BeginGroup (rect);
		for(var i=0; i<items.Count; i++)
		{
		    if( items[i].Draw() == 1 )
		    	selectedItem = i;
		}		
		GUI.EndGroup();
		return selectedItem;
	}
	
	public virtual void UpdateData()
	{
		for(var i=0; i<items.Count; i++)
		{
			if(items[i] is ListItem)
		   	  (items[i] as ListItem).UpdateData();
		}
	}
	
	public int GetItemsCnt()
	{
		return items.Count;
	}
	
	protected void RefreshPos()
	{
		rect = rectFixed;
		for (var i = 0; i<items.Count; i++)
		{		
			UIObject item =  items[i];
			if(item != null)
			{
				if(growDown)
				{	
					if(i%colPerPage == 0)
					{
						item.rect.y = rect.height; 
						rect.height += item.rect.height;
					}	
					else
					{
						if(i > 0)
							item.rect.x = ( items[i-1]).rect.xMax + colDist; 
						else	
							item.rect.x = rect.x;
					}
				}
				else 
				{
					if(i%colPerPage == 0)
					{
						item.rect.y = rect.height; 
						rect.y -= item.rect.height;
						rect.height += item.rect.height;
					}
					else
					{
						if(i > 0)
							item.rect.x = (items[i-1]).rect.xMax + colDist; 
						else	
							item.rect.x = rect.x;
					}
				}
			}	
		}
	}
}

