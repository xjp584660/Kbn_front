using UnityEngine;
using System.Collections;

using _Global = KBN._Global;

public class ChromeButtonObj : UIObject
{
	/*UI Controls*/
	public Button btn;
	public Label lblIcon;
	public Label lNew;
	public NotifyBug notfiyNum;
	public KBN.AnimationLabel animationLabel;
	protected FlashSqare m_flushAnim = null;

	/*Color of button*/
	protected static Color colorBtn = _Global.ARGB("0xFFFEF0D3");
	protected static Color colorNotify = _Global.ARGB("0xFFFFFFFF");
	
	private static Rect gm_rectNotifyNum = new Rect(55, 5, 33, 34);
	private static Rect gm_rectIcon = new Rect(10, 6, 70, 72);
	private static Rect gm_rectButton = new Rect(2,3,90,90);
	private static Rect gm_rectSelf = new Rect(0, 0, 94, 94);
	private static Rect gm_rectLNew = new Rect(11, 55, 67, 23);
	
	private static float gm_paddingYPos = 70.0f;

	public override void Init()
	{
		base.Init();

		this.rect = new Rect(gm_rectSelf);
		btn.Init();
		lblIcon.Init();
		notfiyNum.Init();

		btn.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_tool bar_selected",TextureType.BUTTON);
		btn.mystyle.normal.background = null;	
		btn.mystyle.clipping = TextClipping.Overflow;			

		btn.rect = new Rect(gm_rectButton); 

		m_flushAnim = null;
		notfiyNum.mystyle.normal.background = TextureMgr.singleton.LoadTexture("task_list_number_bottom",TextureType.ICON);
//		notfiyNum.mystyle.normal.textColor = colorNotify;
//		notfiyNum.mystyle.font = null;
//		notfiyNum.mystyle.fontSize = 15;
		notfiyNum.rect = new Rect(gm_rectNotifyNum);
		lblIcon.rect = new Rect(gm_rectIcon);
		lblIcon.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_icon_quest",TextureType.BUTTON);
		if(lNew != null)
		{
			lNew.setBackground("chrome-New",TextureType.ICON);
		}
		if(null != OnClick)
		{
			btn.OnClick = OnClick;
		}
		if(animationLabel!=null)
		{
			animationLabel.Init();
			animationLabel.rect = lblIcon.rect;
		}
        
        StopNoticeAnimation();
	}

	public override int Draw()
	{	
		if (!visible)
			return -1;

        Color oldColor = GUI.color;

        if (disabled)
        {
            if (Event.current.type != EventType.Repaint)
            {
                return -1;
            }
            else
            {
                GUI.color = Color.gray;
            }
        }

		this.prot_calcScreenRect();
		
		btn.Draw(rect.x, rect.y);
		Matrix4x4 matrix = GUI.matrix;
		bool flag =applyRotationAndScaling();
		GUI.BeginGroup(rect);
		lblIcon.Draw();
		if(animationLabel!=null)
		{
			animationLabel.Draw();
		}
		if(lNew != null)
		{
			lNew.Draw();
		}
		if(m_flushAnim != null)
		{
			m_flushAnim.Draw(lblIcon.rect);
		}
		notfiyNum.Draw();
		
		GUI.EndGroup();
		if(flag) GUI.matrix=matrix;
        GUI.color = oldColor;

		return -1;
	}
	
	public void Resize(float newHeight, FontSize nameSize, FontSize notifySize)
	{
		btn.SetFont(nameSize);
		notfiyNum.SetFont(notifySize);
		
		float rd = newHeight / gm_rectSelf.height;
		Rect tgtRect = gm_rectButton;
		btn.rect = new Rect(tgtRect.x*rd, tgtRect.y * rd, tgtRect.width * rd, tgtRect.height * rd);
		tgtRect = gm_rectIcon;
		lblIcon.rect = new Rect(tgtRect.x*rd, tgtRect.y * rd, tgtRect.width * rd, tgtRect.height * rd);
		tgtRect = gm_rectNotifyNum;
		notfiyNum.rect = new Rect(tgtRect.x*rd, tgtRect.y * rd, tgtRect.width * rd, tgtRect.height * rd);
		tgtRect = gm_rectSelf;		
		this.rect = new Rect(tgtRect.x*rd, tgtRect.y * rd, tgtRect.width * rd, tgtRect.height * rd);
		if(lNew != null)
		{
			tgtRect = gm_rectLNew;
			lNew.rect = new Rect(tgtRect.x*rd, tgtRect.y * rd, tgtRect.width * rd, tgtRect.height * rd);
		}
		if(animationLabel!=null)
		{
			animationLabel.rect = lblIcon.rect;
		}
		this.btn.mystyle.padding.top = (int)(gm_paddingYPos * rd);
	}
	
	
	public void setData(object param)
	{
		lblIcon.mystyle.normal.background = TextureMgr.singleton.LoadTexture((param as Hashtable)["icon"] as string,TextureType.BUTTON);
		
		btn.txt = (param as Hashtable)["txt"] as string;
		notfiyNum.SetCnt(_Global.INT32((param as Hashtable)["num"]));
	}
	
	public void setPicture(string path)
	{
		lblIcon.mystyle.normal.background = TextureMgr.singleton.LoadTexture(path,TextureType.BUTTON);
	}

	public float IconRotate {
		set
		{
			lblIcon.rotateAngle = value;
		}
		get
		{
			return lblIcon.rotateAngle;
		}
	}
	
    [SerializeField]
    private string m_acGeneratorParam;
	[SerializeField]
	private string m_IphoneXacGeneratorParam;

	public void PlayNoticeAnimation()
	{
        if (!string.IsNullOrEmpty(m_acGeneratorParam))
        {
            
            return;
        }

		if ( null == m_flushAnim )
			m_flushAnim = new FlashSqare();

		string texName = "button_icon_quests_Bright";
		string texType = TextureType.BUTTON;
		m_flushAnim.Play(texName, texType, 2.0f);
	}

	public bool IsPlayingAnimation
	{
		get
		{
			return true;
		}
	}

	public void StopNoticeAnimation()
	{
		
		if ( m_flushAnim == null )
			return;
		m_flushAnim.Stop();
		m_flushAnim = null;
	}
	
	public void SetCnt(int val)
	{
		notfiyNum.SetCnt(val);
	}
	
	public override void Update()
	{
		base.Update();

		if(m_flushAnim != null)
			m_flushAnim.Update();
	}
}
