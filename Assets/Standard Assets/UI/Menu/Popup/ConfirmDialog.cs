
using KBN;

public class ConfirmDialog : PopMenu
{
	public Label l_bg2;
	public Label l_bg1;
	
	public Label m_msg;
	protected System.Action<object> m_okFunc;
	protected System.Action<object> m_cancelFunc;
	
	public Button btnConfirm;
	
	public Button btnCancel;
//	public Button btnClose;
	
	protected int currentNotificationType;	//  Building 1 .
	static private int g_mTotalDialogCount;
	private bool m_isInActive = false;

	public Label itemIcon_label;
	public Label itemCount_label;

	public override void Init()
	{
		base.Init();
		this.priv_resetToDefault();
	}

	public ConfirmDialog GetNewDialog()
	{
		ConfirmDialog newObj = (ConfirmDialog)UnityEngine.GameObject.Instantiate(this);
		newObj.Init();
		return newObj;
	}

	public void BeginActive()
	{
		if ( m_isInActive )
			return;
		m_isInActive = true;
		++g_mTotalDialogCount;
	}
	
	protected override void DrawItem()
	{
//		l_bg1.Draw();
//		l_bg2.Draw();
		
		btnClose.Draw();
		title.Draw();
		m_msg.Draw();
		btnConfirm.Draw();
		btnCancel.Draw();
		itemIcon_label.Draw();
		itemCount_label.Draw();
	}		
	
	public void setCurNotificationType(int type)
	{
		currentNotificationType = type;
	}
	public override void handleNotification(string type, object body)
	{
		switch(type)
		{
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
					if(currentNotificationType == 1)
						handleComplete(body);	//	 as BuildingQueueMgr.QueueElement);
				break;
		}
	}
	
	//protected void handleComplete(BuildingQueueMgr.QueueElement qItem)
	protected void handleComplete(object qItem)
	{
		if(MenuMgr.instance.GetCurMenu() == this)
			this.close();	
	}
	
	public virtual void setDefautLayout()
	{
		setDefaultButtonText();
		this.setLayout(600,540);
		this.setTitleY(60);		
		this.setContentRect(70,140,0,50);
		
	}
	public void setDefaultButtonText()
	{
		this.setButtonText(Datas.getArString("Common.OK_Button"),Datas.getArString("Common.Cancel") );
	}
	
	public void setButtonText(string confirmTxt,string cancelTxt)	
	{
		btnConfirm.txt = confirmTxt;
		btnCancel.txt = cancelTxt;
	}
	
	public void setTitleY(int y)
	{
		title.rect.y = y;	
	}
	
	public void setContentRect(int x,int y,int w,int h)
	{
		m_msg.rect.x = x;
		m_msg.rect.y = y;
		if(w == 0)
			w = (int)(rect.width - 2*x);
		m_msg.rect.width = w;
		m_msg.rect.height = h;
	}
	
	public void setLayout(int wid,int hgt)
	{
		if(wid <= 0)
			wid = (int)this.rect.width;
			
		this.rect.width = wid;
		this.rect.height = hgt;
		
//		backLabel.rect.x = 5;
//		backLabel.rect.y = 5;
//		backLabel.rect.width = wid - l_bg1.rect.x * 2;	// 10
//		backLabel.rect.height = hgt - l_bg1.rect.y * 2;	//10
//		
		frameSimpleLabel.rect.width = wid;
		frameSimpleLabel.rect.height = hgt;
		
		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width)/2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height)/2;		
				
		layout();		
		
		base.resetLayout();
		
	}
	
	protected void layout()
	{
		btnClose.rect.x = rect.width - btnClose.rect.width;
		int dx = (int)((rect.width - btnConfirm.rect.width * 2 ) / 3);
		btnConfirm.rect.x = dx;
		btnCancel.rect.x = 2*dx + btnConfirm.rect.width;
		
		btnConfirm.rect.y = btnCancel.rect.y = rect.height - btnConfirm.rect.height - 30;
	}
	
	public void SetCloseAble(bool b)
	{
		btnClose.SetVisible(b);
	}
	
	public void SetCancelAble(bool b)
	{
		btnCancel.SetVisible(b);
		if(b)
		{
			layout();
		}
		else
		{
			btnConfirm.rect.x = (rect.width - btnConfirm.rect.width) / 2;
		}
	}

	public void SetAction(string strContent,string titleContent,System.Action<object> okFunc, System.Action<object> cancelFunc, bool isAutoClose,int itemId,int itemCount)
	{
		if ( isAutoClose == false )
		{			
			this.SetAction(strContent, titleContent, okFunc, cancelFunc,itemId,itemCount);	
			return;
		}

		System.Action<object> okFuncAutoClose = delegate(object p)
		{
			close();
			if ( okFunc != null )
				okFunc(p);
		};

		System.Action<object> cancelFuncAutoClose = delegate(object p)
		{
			close();
			if ( cancelFunc != null )
				cancelFunc(p);
		};

		this.SetAction(strContent, titleContent, okFuncAutoClose, cancelFuncAutoClose,itemId,itemCount);
	}

	public void SetAction(string strContent,string titleContent,System.Action<object> okFunc, System.Action<object> cancelFunc, bool isAutoClose)
	{
		if ( isAutoClose == false )
		{			
			this.SetAction(strContent, titleContent, okFunc, cancelFunc);	
			return;
		}

		System.Action<object> okFuncAutoClose = delegate(object p)
		{
			close();
			if ( okFunc != null )
				okFunc(p);
		};

		System.Action<object> cancelFuncAutoClose = delegate(object p)
		{
			close();
			if ( cancelFunc != null )
				cancelFunc(p);
		};

		this.SetAction(strContent, titleContent, okFuncAutoClose, cancelFuncAutoClose);
	}
	public void SetAction(string strContent,string titleContent,System.Action<object> okFunc, System.Action<object> cancelFunc)
	{
		m_msg.txt = strContent;
		title.txt = titleContent;
		
		m_okFunc = okFunc;
		m_cancelFunc = cancelFunc;

		itemIcon_label.SetVisible(false);
		itemIcon_label.SetVisible(false);
		
		if(m_okFunc != null)
		{
			btnConfirm.OnClick = new System.Action<object>(delegate(object param)
			{
				m_okFunc(param);
			});
		}
		else
		{
			btnConfirm.OnClick = new System.Action<object>(delegate(object param)
			{
				close(param);
			});
		}
		if(m_cancelFunc!= null)
		{
			btnCancel.OnClick = new System.Action<object>(delegate(object param)
			{
				m_cancelFunc(param);
			});
		}
		else
		{
			btnCancel.OnClick = new System.Action<object>(delegate(object param)
			{
				close(param);
			});
		}
	}

	public void SetAction(string strContent,string titleContent,System.Action<object> okFunc, System.Action<object> cancelFunc,int itemId,int itemCount)
	{
		m_msg.txt = strContent;
		title.txt = titleContent;
		
		m_okFunc = okFunc;
		m_cancelFunc = cancelFunc;

		if(itemId!=-1){
			itemIcon_label.SetVisible(true);
			itemIcon_label.useTile=true;
			itemIcon_label.tile=TextureMgr.instance().ItemSpt().GetTile("i"+itemId);
		}
		if(itemCount!=-1){
			itemCount_label.SetVisible(true);

			itemCount_label.txt = Datas.getArString("Workshop.CraftingCost")+itemCount+"/"+MyItems.singleton.GetItemCount(itemId);
		}
		
		if(m_okFunc != null)
		{
			btnConfirm.OnClick = new System.Action<object>(delegate(object param)
			{
				m_okFunc(param);
			});
		}
		else
		{
			btnConfirm.OnClick = new System.Action<object>(delegate(object param)
			{
				close(param);
			});
		}
		if(m_cancelFunc!= null)
		{
			btnCancel.OnClick = new System.Action<object>(delegate(object param)
			{
				m_cancelFunc(param);
			});
		}
		else
		{
			btnCancel.OnClick = new System.Action<object>(delegate(object param)
			{
				close(param);
			});
		}
	}
	public override void OnPush(object param)
	{
		currentNotificationType = 0;
		SetCloseAble(true);
		//SetCancelAble(true);
		this.BeginActive();
		GestureManager.singleton.Enable = false;
	}
	protected void close(object param)
	{
		currentNotificationType = 0;
		MenuMgr.instance.PopMenu("");
		
		
//		this.setDefautLayout();
	}
	
	public void Close()
	{
		close(null);
	}

	public override void OnPopOver()
	{
		this.menuName = "";
		this.setDefaultButtonText();
		if ( m_isInActive )
		{
			m_isInActive = false;
			--g_mTotalDialogCount;
			if(g_mTotalDialogCount <= 0)
				GestureManager.singleton.Enable = true;
		}
		//	maybe this dialog need reuse, so let's reset to default state.
		priv_resetToDefault();
		TryDestroy(this);
	}
	
	private void priv_resetToDefault()
	{
		btnClose.OnClick = new System.Action<HashObject>(close);
		this.SetCancelAble(true);
		this.setDefaultButtonText();
	}
}
