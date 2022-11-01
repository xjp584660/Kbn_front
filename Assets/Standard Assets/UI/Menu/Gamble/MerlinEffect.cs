using UnityEngine;
using System.Collections;

public class MerlinEffect : UIObject 
{
	[SerializeField]
	private Label merlin;
	[SerializeField]
	private Label skull;
	[SerializeField]
	private Label smoke;
	[SerializeField]
	private Label skullSmoke;
	[SerializeField]
	private Label skullFire;
	[SerializeField]
	private Label flashUp;
	[SerializeField]
	private Label flashDown;
	[SerializeField]
	private Label flashChest;

	[SerializeField]
	private Label eye;
	[SerializeField]
	private Label haqi;

    public override void Init()
	{
		merlin.Init ();
		skull.Init ();
		smoke.Init ();
		skullSmoke.Init ();
		skullFire.Init ();
		flashUp.Init ();
		flashDown.Init ();
		flashChest.Init();
		eye.Init ();
		haqi.Init ();


		merlin.material.SetTexture("_MainTex",TextureMgr.instance().LoadTexture("character_morgause_images", TextureType.DECORATION));
//		merlin.setBackground ("character_morgause_images", TextureType.DECORATION);
		merlin.material.SetTexture("_BumpTex",TextureMgr.instance().LoadTexture("humianbowen", TextureType.DECORATION));
		merlin.material.SetTexture("_MaskTex",TextureMgr.instance().LoadTexture("character_morgause_images-Recovered_doudong", TextureType.DECORATION));
		skull.mystyle.normal.background = TextureMgr.instance().LoadTexture("skull_of_the_staff", TextureType.DECORATION);
		eye.material.SetTexture("_MainTex",TextureMgr.instance().LoadTexture("character_morgause_images-face", TextureType.DECORATION));
		haqi.material.SetTexture("_MainTex",TextureMgr.instance().LoadTexture("breath2420002", TextureType.DECORATION));
		smoke.material.SetTexture("_MainTex",TextureMgr.instance().LoadTexture("breath2420003", TextureType.DECORATION));
		smoke.material.SetTexture("_BumpTex",TextureMgr.instance().LoadTexture("humianbowen", TextureType.DECORATION));
		skullSmoke.material.SetTexture("_MainTex",TextureMgr.instance().LoadTexture("pp241000100000", TextureType.DECORATION));
		skullSmoke.material.SetTexture("_MaskTex",TextureMgr.instance().LoadTexture("breath2420002", TextureType.DECORATION));
		skullSmoke.material.SetTexture("_BumpTex",TextureMgr.instance().LoadTexture("humianbowen", TextureType.DECORATION));
		skullFire.material.SetTexture("_MainTex",TextureMgr.instance().LoadTexture("qinghuo_01", TextureType.DECORATION));
		skullFire.material.SetTexture("_BumpTex",TextureMgr.instance().LoadTexture("humianbowen", TextureType.DECORATION));
		flashUp.material.SetTexture("_MainTex",TextureMgr.instance().LoadTexture("DH_glow.dds", TextureType.DECORATION));
		flashDown.material.SetTexture("_MainTex",TextureMgr.instance().LoadTexture("DH_glow.dds", TextureType.DECORATION));
		flashChest.material.SetTexture("_MainTex",TextureMgr.instance().LoadTexture("flash_arcane_05.dds", TextureType.DECORATION));

        merlin.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_morgause_images", TextureType.DECORATION);//character_morgause_images
		//skull.mystyle.normal.background = TextureMgr.instance().LoadTexture("skull_of_the_staff", TextureType.DECORATION);
		//smoke.mystyle.normal.background = TextureMgr.instance().LoadTexture("breath2420003", TextureType.DECORATION);
        //skullSmoke.mystyle.normal.background = TextureMgr.instance().LoadTexture("pp241000100000", TextureType.DECORATION);
		//skullFire.mystyle.normal.background = TextureMgr.instance().LoadTexture("qinghuo_01", TextureType.DECORATION);
		//flashUp.mystyle.normal.background = TextureMgr.instance().LoadTexture("DH_glow.dds", TextureType.DECORATION);
		//flashDown.mystyle.normal.background = TextureMgr.instance().LoadTexture("DH_glow.dds", TextureType.DECORATION);
		//flashChest.mystyle.normal.background = TextureMgr.instance().LoadTexture("flash_arcane_05.dds", TextureType.DECORATION);//flash_arcane_05
		//eye.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_morgause_images-face", TextureType.DECORATION);
		//haqi.mystyle.normal.background = TextureMgr.instance().LoadTexture("breath2420002", TextureType.DECORATION);
	}


	public override void Update()
	{
		merlin.Update ();
		skull.Update ();
		smoke.Update ();
		skullSmoke.Update ();
		skullFire.Update ();
		flashUp.Update ();
		flashDown.Update ();
		flashChest.Update();
		eye.Update ();
		haqi.Update();

	}

	public override int Draw()
	{
		merlin.DrawTexture ();
		skull.DrawTexture ();
		smoke.DrawTexture ();
		skullSmoke.DrawTexture ();
		skullFire.DrawTexture ();
		flashUp.DrawTexture ();
		flashDown.DrawTexture ();
		flashChest.DrawTexture();
		eye.DrawTexture ();
		haqi.DrawTexture();

		return -1;
	}


}
