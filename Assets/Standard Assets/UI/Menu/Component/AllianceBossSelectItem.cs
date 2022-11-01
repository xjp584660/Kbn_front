using UnityEngine;
using System.Collections;
using System;
using KBN;

public class AllianceBossSelectItem : MonoBehaviour
{
	public Rect rect;
	public enum ItemState
	{
		SELECTED = 0,
		UN_SELECTED = 1,
	};
	[SerializeField] private Button roundBack;
	[SerializeField] private Label text;
	private Action onSelectFunc = null;
	private ItemState itemState;
	
	public void Init()
	{
		SetState(ItemState.UN_SELECTED);
		roundBack.OnClick = new Action(handleClick);
	}
	
	public void SetState(ItemState _state)
	{
		itemState = _state;
		if(itemState == ItemState.SELECTED)
		{
			roundBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("radio_box1hui", TextureType.DECORATION);
			roundBack.mystyle.active.background = TextureMgr.instance().LoadTexture("radio_box1hui", TextureType.DECORATION);
		}
		else if(itemState == ItemState.UN_SELECTED)
		{
			roundBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("radio_box2hui", TextureType.DECORATION);
			roundBack.mystyle.active.background = TextureMgr.instance().LoadTexture("radio_box2hui", TextureType.DECORATION);
		}
	}
	
	private void handleClick()
	{
		if(itemState == ItemState.UN_SELECTED)
		{
			roundBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("radio_box1hui", TextureType.DECORATION);
			roundBack.mystyle.active.background = TextureMgr.instance().LoadTexture("radio_box1hui", TextureType.DECORATION);
			if(onSelectFunc != null)
				onSelectFunc();
		}
	}
	
	public string txt {
		get{
			if(text!=null)
				return text.txt;
			return null;
		}
		set
		{
			if(text!=null)
				text.txt = value;
		}
	}

	public Action OnClick {
		get{
			return onSelectFunc;
		}
		set
		{
			onSelectFunc = value;
		}
	}

	public bool isSelect {
		get{
			if(itemState == ItemState.SELECTED)
				return true;
			return false;
		}
	}
	
	public void Draw()
	{
		GUI.BeginGroup(rect);
		roundBack.Draw();
		text.Draw();
		GUI.EndGroup();
	}
}
