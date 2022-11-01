using System.Collections.Generic;

public class RadioButtonController
{
	private List<RadioButton> buttonArray = new List<RadioButton>();
    private RadioButton _choosedBtn = null;

    public void Clear()
    {
    	buttonArray.Clear();
    }
    
    public void Insert(RadioButton btn)
    {
    	buttonArray.Add(btn);
    	btn.SetController(this);
    }
    
    public void ChooseButton(RadioButton btn)
    {
    	_choosedBtn = btn;
    }
    
	public RadioButton choosedBtn
	{
		get
		{
			return _choosedBtn;
		}
	}
        
    public int GetChoosedId()
    {
    	for(int i = 0; i< buttonArray.Count; i++)
    	{
    	   if(buttonArray[i] == choosedBtn)
    	   	return i;
    	}
    	return -1;
    }
}

