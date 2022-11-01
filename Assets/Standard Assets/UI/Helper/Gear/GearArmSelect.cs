
using System.Collections.Generic;
using KBN;

public class GearArmSelect 
{
	private int mCurrentType = 0;
	private int[] mArcIndexToCategory;
	
	public ArcSelectControl arcSelectControl;
	public KBN.ScrollList weaponsView;
	public System.Comparison<Arm> sortFunction;
	
	public System.Action<int> OnSelect;
	private System.Func<System.Collections.Generic.List<Arm>> m_getGearList;
	private ArmsState state = ArmsState.NotArmed;
	
	private bool showRedRect;
	private bool willToTop;
	private bool disableInput;
	
	public bool ShowRedRect
	{
		set
		{
			showRedRect = value;
		}
	}
	
	public enum ArmsState
	{
		UnlockedNotArmedNotCurrentArms,
		NotArmed
	}
	public ArmsState ArmsType
	{
		set
		{
			state = value;
		}
	}
	
	public void Init()
	{
		InitArcIndexToCategory();
		InitArcControl();
		m_getGearList = null;
		willToTop = false;
		disableInput = false;
	}
	
	public bool Reset
	{
		set
		{
			willToTop = value;
		}
	}
	
	public System.Func<System.Collections.Generic.List<Arm>> GearListDelegate
	{
		get
		{
			return m_getGearList;
		}
		
		set
		{
			m_getGearList = value;
		}
	}

	private void InitArcIndexToCategory()
	{
		int n = Constant.Gear.ArmCategoryNumber + 1;
		mArcIndexToCategory = new int[n];
		//for(int i = 0;i<n;i++)
		//{
			mArcIndexToCategory[0] = 6;
			mArcIndexToCategory[1] = 2;
			mArcIndexToCategory[2] = 5;
			mArcIndexToCategory[3] = 3;
			
			mArcIndexToCategory[4] = 4;
			mArcIndexToCategory[5] = 1;
			mArcIndexToCategory[6] = 0;
		//}
	}
	
	private void ShowRedRects(List<Arm> arms)
	{
		if(arms == null) return;
		Knight knight = GearData.singleton.CurrentKnight;
		if(knight == null) return;
		int knightLevel = knight.Level;
		int armReqLevel; 

		for(int i=1;i<arms.Count;i++)
		{
			armReqLevel = GearManager.Instance().GetArmReqLevel(arms[i]);
			arms[i].Tag.isRed = knightLevel < armReqLevel;
		}
	}
	private void HideRedRect(List<Arm> arms)
	{
		if(arms == null) return;

		for(int i=1;i<arms.Count;i++)
		{
			if(arms[i].Tag == null) continue;
			arms[i].Tag.isRed = false;
		}

	}
	
	
	public void UpdateCurrent()
	{
		List<Arm> arms = null;
		if ( m_getGearList == null )
		{
			if(state == ArmsState.NotArmed)
			{
				arms = GearManager.Instance().GearWeaponry.GetNotArmedArmsByType(mCurrentType);
			}
			else if(state == ArmsState.UnlockedNotArmedNotCurrentArms)
			{
				arms = GearManager.Instance().GearWeaponry.GetUnlockedNotArmedNotCurrentArms(mCurrentType,GearData.singleton.CurrentArm);
			}
		}
		else
		{
			arms = m_getGearList();
		}
		if(showRedRect)
		{
           ShowRedRects(arms); 
		}
		else{
           HideRedRect(arms); 
		}
			
		int capacity = GearManager.Instance().GetStorageCount();
		//test
		if(capacity <= 0)
			capacity = 4;
		
		
		//arms = null;
		if(arms == null) return;
		
		if(sortFunction != null)
			arms.Sort(sortFunction);
		
		if(capacity <= 0 ) return;
		if(weaponsView == null) return;
		
		var array = new List<Arm>();
		int n = arms.Count;
		
		for(int i = 0;i<n;i++)
			array.Add(arms[i]);
		int minus = 0;
		if(n >= 4)
			minus = n+1;
		else 
			minus = 5;
		
		for(int j = n;j<minus;j++)
		{
			Arm a = new Arm();
			//a.Tag = (j + 1).ToString();
			a.PlayerID = Constant.Gear.InValidArmID;
			array.Add(a);
		}
		if(willToTop)
		{
			weaponsView.ResetPos();
			willToTop = false;
		}
		weaponsView.SetData(array);
		weaponsView.AutoLayout();
		if (!weaponsView.updateable)
		{
			weaponsView.ForceUpdate();
		}
	}
	
	public int CurrentType
	{
		get
		{
			return mCurrentType;
		}
	}
	
	public void SetArmType(int type)
	{
		
		mCurrentType = type;
		for(int i = 0;i<mArcIndexToCategory.Length;i++)
		{
			if(	mArcIndexToCategory[i] == type)
			{
				arcSelectControl.SetCurrentItem(i);
				break;
			}
		}
		
	} 
	
	
	private void OnTouchEnd(int index)
	{
		int type = mArcIndexToCategory[index];
		if(type == mCurrentType) return;
		this.SetArmType(type);
		//this.UpdateCurrent();
		if(OnSelect != null)
			OnSelect(index);
	}
	
	private void InitArcControl()
	{
		arcSelectControl.Init();
		arcSelectControl.OnTouchEnd = OnTouchEnd;
		arcSelectControl.SPT = TextureMgr.instance().GetGearSpt();
		arcSelectControl.UseTile = true;
	}
	public void Update()
	{
		if(MenuMgr.instance.Top() == null) return;
		if(MenuMgr.instance.Top().menuName != "GearMenu" && MenuMgr.instance.Top().menuName != "ArmMenu") return;
	
		arcSelectControl.Update();
	}
	public void Draw()
	{
		if(MenuMgr.instance.Top() == null) return;
		if(MenuMgr.instance.Top().menuName != "GearMenu" && MenuMgr.instance.Top().menuName != "ArmMenu") return;

		arcSelectControl.DisableInput = NewFteMgr.instance.IsDoingFte || disableInput;
		arcSelectControl.Draw();
	}
	
	public bool DisableInput
	{
		set
		{
			disableInput = value;
		}
	}
	
	public void OnPopOver()
	{	
		weaponsView = null;
		arcSelectControl.OnPopOver();
		GearItems.singleton.DestroyBackStoneItem();
	}
	public void Stop()
	{
		arcSelectControl.Stop();
	}
}
