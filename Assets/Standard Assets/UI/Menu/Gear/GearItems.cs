
using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;


namespace KBN
{
	public class GearItems 
	{
		public GearScrollViewItem item;
		public Button backgroundButton;
		public Label weaponImage;
		public StarLevel star;
		public Label number;
		public FlashLabel flash;
		
		public StoneItem stoneItem;
		
		private List<UIObject> createdObjects;
		
		
		private GearScrollViewItem[] mBlankItems;
		
		
		public static GearItems Instance()
		{
			if ( singleton == null )
				singleton = new GearItems();
			return singleton;
		}
		public static GearItems singleton 
		{
			get; 
			protected set; 
		}

		public void Init()
		{
			if(mBackStoneItems == null)
				mBackStoneItems = new List<GearScrollViewItem>();
			if(mBackItems == null)
				mBackItems = new List<GearScrollViewItem>();
			
			if(createdObjects == null)
				createdObjects = new System.Collections.Generic.List<UIObject>(); 	

			mBlankItems = null;	
			
		}
		
		public void InitBlankItems()
		{
			if(mBlankItems != null) return;
			mBlankItems = new GearScrollViewItem[Constant.Gear.ArmPositionNumber];
			for( int i = 0; i < Constant.Gear.ArmPositionNumber; i++)
			{
				mBlankItems[i] = CreateBlankItem(); 
				mBlankItems[i].tagItem.position = i;
				GestureManager.singleton.RemoveTouchable(mBlankItems[i]);
			}
			
		}
		
		private List<GearScrollViewItem> mBackItems;
	//---------------------------------------------------------------------------
		private List<GearScrollViewItem> mBackStoneItems;

		public GearScrollViewItem CreateBackStoneItem()
		{
			GearScrollViewItem i = (GearScrollViewItem)GameObject.Instantiate(item);
			Button back =(Button) GameObject.Instantiate(backgroundButton);
			Label image = (Label)GameObject.Instantiate(weaponImage);
			
			createdObjects.Add(i);
			image.useTile = true;
			image.tile = TextureMgr.instance().ElseIconSpt().GetTile(null);
			//image.tile.name = "";
			
			
			GearScrollViewItem.Tag tag = new GearScrollViewItem.Tag();
			tag.type =  GearScrollViewItem.ItemType.Scroll;

			i.tagItem = tag;
			i.lblIcon = image;
			i.star = null;
			i.btn = back;
			i.Init();		
			return i;
		}
		public void DestroyBackStoneItem()
		{
			if(mBackStoneItems == null) return;
			for(int i = 0;i < mBackStoneItems.Count;i++)
			{
				UIObject.TryDestroy(mBackStoneItems[i].lblIcon);
				UIObject.TryDestroy(mBackStoneItems[i]);
				mBackStoneItems[i] = null;
			}
			mBackStoneItems.Clear();
		}

		
	//---------------------------------------------------------------------------
		private GearScrollViewItem CreateKnightItem(Arm arm) 
		{
			if(arm == null) return null;
		
			GearScrollViewItem i = (GearScrollViewItem)GameObject.Instantiate(item);
			
			createdObjects.Add(i);
			
			GearScrollViewItem.Tag tag = new GearScrollViewItem.Tag();
			tag.type =  GearScrollViewItem.ItemType.Knight;
			tag.position = arm.Category;

			i.tagItem = tag;		
			i.btn = null;
			i.star = null;
			i.hilight = null;
			i.Init();
			i.UseIcon = false;
			i.TheArm = arm;

			return i;
		}	
		private GearScrollViewItem CreateMoveItem(Arm arm) 
		{
			if(arm == null) return null;
		
			GearScrollViewItem i = (GearScrollViewItem)GameObject.Instantiate(item);		
			Label image = (Label)GameObject.Instantiate(weaponImage);
			
			createdObjects.Add(i);
			
			GearScrollViewItem.Tag tag = new GearScrollViewItem.Tag();
			tag.type =  GearScrollViewItem.ItemType.Move;
			tag.position = arm.Category;

			i.tagItem = tag;	
			i.btn = null;	
			i.lblIcon = image;
			i.star = null;
			i.Init();		
			i.UseIcon = false;		
			i.TheArm = arm;
			GestureManager.singleton.RemoveTouchable(i);
			return i;
		}
		private GearScrollViewItem CreateBlankItem() 
		{
			GearScrollViewItem i = (GearScrollViewItem)GameObject.Instantiate(item);				
			
			createdObjects.Add(i);
			

			GearScrollViewItem.Tag tag = new GearScrollViewItem.Tag();
			tag.type =  GearScrollViewItem.ItemType.Blank;
			
			i.star = null;
			i.tagItem = tag;
			i.btn = null;
			i.Init();
			
			return i;
		}
		

		public GearScrollViewItem CreateMoveArmItem(Arm arm)
		{
			return CreateMoveItem(arm);
		} 
		
		public GearScrollViewItem CreateKnightArmItem(Arm arm)
		{
			return CreateKnightItem(arm);
		}


		public GearScrollViewItem[] BlankArmItem
		{
			get
			{
				return  mBlankItems;
			}
		}
		
		//=========================================================================================================================
		//stones
		
		
		private StoneItem CreateMoveItem(int id,int count)
		{
			StoneItem i = (StoneItem)GameObject.Instantiate(stoneItem);
			i.num = null;				
			
			i.pic.elements[0] = null;
			i.back = null;
			i.Init();
			StoneItem.Tag tag = new StoneItem.Tag();
			tag.type = StoneItem.ItemType.Move;
			i.tagItem = tag;
			
			i.SetID(id,count);		
			GestureManager.singleton.RemoveTouchable(i);
			return i;
		}
		private StoneItem CreateMountItem(int id,int count)
		{
			StoneItem i = (StoneItem)GameObject.Instantiate(stoneItem);
			
			i.pic.elements[0] = null;
			i.num = null;
			i.back = null;
			i.Init();
			StoneItem.Tag tag = new StoneItem.Tag();
			tag.type = StoneItem.ItemType.Mount;
			i.tagItem = tag;		
			
			i.SetID(id,count);
			
			return i;
		}

		public StoneItem CreateMoveStoneItem(int id,int count)
		{
			return CreateMoveItem(id,count);
		}
		
		public StoneItem CreateMountStoneItem(int id,int count)
		{
			if(!IsStoneIDLegal(id)) return null;
			return CreateMountItem(id,count);
		}
		
		public bool IsStoneIDLegal(int id)
		{
			return GearManager.Instance().IsStoneIDLegal(id);
		}
		
		
		//=========================================================================================================================
		public void OnPopOver()
		{
			for(int i = 0;i<createdObjects.Count;i++)
			{
				if(createdObjects[i] == null) continue;
				createdObjects[i].OnPopOver();
				UIObject.TryDestroy(createdObjects[i]);
			}
			createdObjects.Clear();
	/*		
			item = null;
			backgroundButton = null;
			weaponImage = null;
			star = null;
			number = null;
			flash = null;
	*/	
			stoneItem = null;
			
			mBackItems.Clear();
		}
		
		private void RemoveTouchable(Dictionary<Arm,GearScrollViewItem> touchables)
		{	
			foreach(Arm arm in touchables.Keys)
			{
				GestureManager.singleton.RemoveTouchable(touchables[arm]);
			}
		}
		
		private void RemoveTouchable(Dictionary<int,StoneItem> touchables)
		{
			foreach(int i in touchables.Keys)
			{
				GestureManager.singleton.RemoveTouchable(touchables[i]);
			}
		}
		
		
	}
}