using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class ComposedUIObj : UIObject
{

    [Space(20), Header("---------- ComposedUIObj ----------")]

    public UIObject[] component;
    public List<UIObject> newComponent;
    public int gapHeight = 10;

	public float m_scale =1;
	public int m_depth = 1;

    public override void Init()
    {
        for (int i=0; i<component.Length; i++)
        {
            component[i].Init();
        }

        newComponent = new List<UIObject>();
    }

    public override int Draw()
    {
        if (!visible)
        {
            return -1;
        }

		GUI.depth = m_depth;

		Matrix4x4 matrix = GUI.matrix; 
		Matrix4x4 scaleMatrix = Matrix4x4.Scale  ( new Vector3 (m_scale, m_scale, 1.0f));
		GUI.matrix = scaleMatrix*matrix ;

        GUI.BeginGroup(rect);
        DrawBackGround();

        for (int i=0; i<component.Length; i++)
        {
			UIObject obj = component[i] as UIObject;
            //(component[i] as UIObject).Draw();
			if(obj.grey)
			{
				Color oldColor = GUI.color;
				GUI.color = new Color(0.3f, 0.3f, 0.3f, 1.0f);
				obj.Draw();
				GUI.color = oldColor;
			}
			else
			{
				obj.Draw();
			}
        }

        if (newComponent != null)
        {
            for (int x = 0; x < newComponent.Count; ++x)
            {
                newComponent[x].Draw();
            }
        }
        GUI.EndGroup();

		GUI.matrix = matrix;
        return -1;
    }

    public override void Update()
    {

        UpdateCacheList();
        for (int i=0; i<component.Length; i++)
        {
            (component[i] as UIObject).Update();
        }

        if (newComponent != null)
        {
            foreach (UIObject obj in newComponent)
                obj.Update();
        }
    }

    public override void FixedUpdate()
    {
        for (int i=0; i<component.Length; i++)
        {
            (component[i] as UIObject).FixedUpdate();
        }

        if (newComponent != null)
        {
            foreach (UIObject obj in newComponent)
                obj.FixedUpdate();
        }
    }

    public void AutoPositionDraw()
    {
        if (newComponent == null)
        {
            return;
        }

        GUI.BeginGroup(rect);

        float tempY = 0;
        float totalHeight = 0;

        int i = 0;
        foreach (UIObject obj in newComponent)
        {
            obj.rect.y = tempY;
            tempY = obj.rect.y + obj.rect.height + gapHeight;
            obj.Draw();

            if (i == newComponent.Count - 1)
            {
                totalHeight = obj.rect.y + obj.rect.height;
            }
            ++i;
        }

        rect.height = totalHeight;

        GUI.EndGroup();
    }

    public bool show
    {
        get
        {
            return this.visible;
        }
        set
        {
            this.visible = value;
        }
    }

    public void SetAllVisible(bool visible)
    {
        base.SetVisible(visible);
        if (newComponent == null)
        {
            return;
        }
        foreach (UIObject obj in newComponent)
        {
            obj.SetVisible(visible);
        }

    }

    public virtual void OnShow(object data){}

    private List<UIObject> priv_getNewContains()
    {
        if (newComponent == null)
        {
            newComponent = new List<UIObject>();
        }
        return newComponent;
    }

    public void addUIObject(UIObject item)
    {
        if (item == null)
        {
            return;
        }
        priv_getNewContains().Add(item);
    }

    public void removeUIObject(UIObject item)
    {
        if (newComponent != null)
        {
            newComponent.Remove(item);
        }
    }

    public void forEachNewComponentObj(Action<UIObject> fun)
    {
        if (newComponent == null)
        {
            return;
        }
        for (int i = 0; i < newComponent.Count; ++i)
        {
            fun(newComponent[i]);
        }
    }

    protected virtual void UpdateCacheList()
    {
        if (mWillClear)
        {
            if (newComponent != null)
            {
                newComponent.Clear();
            }
            mWillClear = false;
        }
        if (mToAddArray != null)
        {
            for (int k = 0; k < mToAddArray.Count; k++)
            {
                this.addUIObject(mToAddArray[k]);
            }
            mToAddArray.Clear();
        }
        if (mToDeleteArray != null)
        {
            for (int j = 0; j < mToDeleteArray.Count; j++)
            {
                if (mToDeleteArray[j] == null)
                {
                    continue;
                }
                this.removeUIObject(mToDeleteArray[j]);
            }
            mToDeleteArray.Clear();
        }
    }

    public bool CanCache()
    {
        return mToDeleteArray != null && mToAddArray != null && mToDeleteArray.Count == 0 && mToAddArray.Count == 0;
    }

    protected void InitCache()
    {
        mToDeleteArray = new List<UIObject>();
        mToAddArray = new List<UIObject>();
        mWillClear = false;
    }

    protected List<UIObject> mToDeleteArray;

    public void RemoveElemInNewComponent(UIObject item)
    {
        if (newComponent == null)
        {
            return;
        }
        if (mToDeleteArray == null)
        {
            return;
        }
        mToDeleteArray.Add(item);
    }

    protected List<UIObject> mToAddArray;

    public void AddElemInNewComponent(UIObject item)
    {
        //if(newComponent == null) return;
        if (mToAddArray == null)
        {
            return;
        }
        mToAddArray.Add(item);
    }

    protected bool mWillClear = false;

    public void WillClear()
    {
        mWillClear = true;
    }

    public UIObject getUIObjectAt(int idx)
    {
        if (newComponent != null && idx < newComponent.Count)
        {
            return newComponent[idx];
        }
        return null;
    }

    public void clearUIObject()
    {
        this.clearUIObject(true, true);
    }

    public void clearUIObject(bool isClear, bool isDestroy)
    {
        if (newComponent == null)
        {
            return;
        }

        foreach (UIObject obj in newComponent)
        {
            if (obj == null)
            {
                continue;
            }
            if (isClear)
            {
                obj.OnClear();
            }
            if (isDestroy)
            {
                TryDestroy(obj);
            }
        }
        newComponent.Clear();
    }

    public int numUIObject
    {
        get
        {
            return newComponent == null ? 0 : newComponent.Count;
        }
    }

    public UIObject shiftUIObject()
    {
        if (newComponent == null)
        {
            return null;
        }
        UIObject obj = newComponent[0];
        newComponent.RemoveAt(0);
        return obj;
    }

    public int UnshiftUIObject(UIObject item)
    {
        priv_getNewContains().Insert(0, item);
        return newComponent.Count;
    }

    public Array getUIObject()
    {
        return priv_getNewContains().ToArray();
    }

    public UIObject getChildByID(string ctag)
    {
        foreach (UIObject child in component)
        {
            if (child.uiName == ctag)
            {
                return child;
            }
        }
        return null;
    }

    public Button getButtonByID(string ctag)
    {
        return this.getChildByID(ctag) as Button;
    }

    public virtual void AutoLayout()
    {
        rect.height = 0;
        for (int i=0; i<component.Length; i++)
        {
            (component[i] as UIObject).rect.y = rect.height;
            rect.height += component[i].rect.height;
        }
        if (newComponent != null)
        {
            foreach (UIObject obj in newComponent)
            {
                obj.rect.y = rect.height;
                rect.height += obj.rect.height;
            }
        }
    }

    public virtual void DrawBackGround()
    {
        if (this.background)
        {
            DrawTextureClipped(background, new Rect(0, 0, background.width, background.height), new Rect(0, 0, background.width, background.height), UIRotation.FLIPXY);
        }
    }
}
