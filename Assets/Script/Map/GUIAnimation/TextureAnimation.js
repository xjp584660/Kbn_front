#pragma strict

import System.Collections;
import System.Collections.Generic;

public class TextureAnimation extends IAnimation
{
	//------------------------------------------------
	public var usePrefixNaming:boolean = true;
	public var prefixName:String = String.Empty;
	public var typeName:String = String.Empty;
	public var frameCount:int = 8;
	
	// If use usePrefixNaming, can not set the textures
	public var textureNames:String[];
	public var timePerFrame:float = 0.03f;
	
	private var currTiming:float = 0;
	private var currIndex:int = 0;
	
	private var uiObject:Label = null;
	//------------------------------------------------
	public static function StartAnim(obj:UIObject, isLoop:boolean, endDel:System.Action):TextureAnimation
	{
		var anim:TextureAnimation = obj.gameObject.GetComponent(typeof(TextureAnimation)) as TextureAnimation;
		if (null == anim)
		{
			Debug.Log("Not support:TextureAnimation not on usePrefixNaming is not support in progam settings!!!");
			return null;
		}
		
		anim.PlayAnim(isLoop, endDel);
		return anim;
	}
	
	public static function StartAnim(obj:UIObject, isLoop:boolean, prefixName:String, texTypeName:String, frameCnt:int, endDel:System.Action):TextureAnimation
	{
		var anim:TextureAnimation = obj.gameObject.GetComponent(typeof(TextureAnimation)) as TextureAnimation;
		if (null == anim)
		{
			anim = obj.gameObject.AddComponent(typeof(TextureAnimation)) as TextureAnimation;
		}
		
		anim.PlayAnim(isLoop, prefixName, texTypeName, frameCnt, endDel);
		return anim;
	}
	
	public static function StopAnim(obj:UIObject, destroy:boolean)
	{
		var anim:TextureAnimation = obj.gameObject.GetComponent(typeof(TextureAnimation)) as TextureAnimation;
		if (null == anim)
		{
			return null;
		}
		
		anim.StopAnim(destroy);
	}
	
	//------------------------------------------------
	private function UsingPrefixNameing(prefixName:String, texTypeName:String, frameCnt:int)
	{
		this.usePrefixNaming = true;
		this.prefixName = prefixName;
		this.typeName = texTypeName;
		this.frameCount = frameCnt;
		
		textureNames = null;
		textureNames = new String[this.frameCount];
		
		var tex:Texture2D = null;
		for (var i:int = 0; i < this.frameCount; i++)
		{
			textureNames[i] = this.prefixName + "_" + (i + 1).ToString();
		}
	}
	
	public function PlayAnim(isLoop:boolean, endDel:System.Action)
	{
		super.PlayAnim(isLoop, endDel);
		
		this.currIndex = 0;
		this.currTiming = 0;
		
		this.uiObject = gameObject.GetComponent(typeof(Label)) as Label;
	}
	
	public function PlayAnim(isLoop:boolean, prefixName:String, texTypeName:String, frameCnt:int, endDel:System.Action)
	{
		super.PlayAnim(isLoop, endDel);
		
		this.currIndex = 0;
		this.currTiming = 0;
		this.uiObject = gameObject.GetComponent(typeof(Label)) as Label;
		uiObject.SetVisible(true);
		UsingPrefixNameing(prefixName, texTypeName, frameCnt);
	}
	
	public function StopAnim(destroy:boolean)
	{
		uiObject.SetVisible(false);
		super.StopAnim(destroy);
	}
	
	public function Update()
	{
		if (super.isFinish) return;
		
		if (null == uiObject) return;
		if (null == textureNames) return;
		
		currTiming += Time.deltaTime;
		if (currTiming >= timePerFrame)
		{
			currTiming = 0;
			currIndex++;
			
			if (currIndex < textureNames.Length)
				uiObject.tile.name = textureNames[currIndex];
			else
			{
				if (isLoop)
				{
					currIndex = 0;
					uiObject.tile.name = textureNames[currIndex];
				}
				else
				{
//					uiObject.mystyle.normal.background = null;
					StopAnim(false);
				}
			}
		}
	}
}