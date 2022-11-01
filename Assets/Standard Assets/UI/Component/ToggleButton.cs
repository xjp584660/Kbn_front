using System;
using System.Collections;
using UnityEngine;

public class ToggleButton : SimpleUIObj
{

    [Space(30), Header("----------ToggleButton----------")]

    protected bool _selected = false;    
    public Action<bool> valueChangedFunc; // func(value)
    public Action<ToggleButton, bool> valueChangedFunc2; //func(sender,value)
	public UIObject Parent { get; set;}
    public void Init()
    {
        base.Init(); 
        
        SetFont();
        SetNormalTxtColor();
        SetOnNormalTxtColor();
    }
    public override int Draw()
    {
        if(!visible)
            return -1;
        SetFont();
        SetNormalTxtColor();
        SetOnNormalTxtColor();
        if ( this.disabled )
        {
            GUI.Toggle(rect,selected,txt,mystyle);
            return -1;
        }

        bool oldValue = selected;
        selected = GUI.Toggle(rect,selected,txt,mystyle);
        if(selected != oldValue)
            SoundMgr.instance().PlayEffect("on_tap", /*TextureType.AUDIO*/"Audio/");
        return -1;
    }

    /// <summary>
    /// Gets or sets a value indicating whether this <see cref="ToggleButton"/> is selected.
    /// The setter is currently used from outside commonly, but in fact it should only be called when this <see cref="ToggleButton"/> is tapped.
    /// </summary>
    /// <value><c>true</c> if selected; otherwise, <c>false</c>.</value>
    public bool selected
    {
        get
        {
            return _selected;
        }

        set
        {
            if(value != _selected)
            {
                _selected = value;
                if(valueChangedFunc != null)
                    valueChangedFunc.DynamicInvoke(value);
                
                if(valueChangedFunc2 != null)
                    valueChangedFunc2.DynamicInvoke(this, value);                    
            }
        }
    }

    /// <summary>
    /// Set the state of this <see cref="ToggleButton"/> from outside.
    /// </summary>
    public void SetSelected(bool val)
    {
        _selected = val;
    }
}
