using System;

public class ItemConfirmPopupParam
{
	public string description;
	public int itemId;

	public Action OnConfirm;
	public Action OnCancel;
}
