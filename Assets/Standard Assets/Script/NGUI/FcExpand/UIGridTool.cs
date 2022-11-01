using UnityEngine;
using System.Collections.Generic;
using System.Collections;

public class UIGridTool : MonoBehaviour {

	private UIGrid grid;
	private UIObject targetObj;
	private ListItem itemInstance;
	private bool isInit=false;
	private List<ListItem> itemList=new List<ListItem>();
	private ListItem group;

	float offsetX=0;
	float offsetY=0;

	private float offerW;
	private bool isIX=true;

	//初始化
	public UIGrid Init(UIObject targetObj,float offerW,bool isIX,UIGrid grid,ListItem itemInstance,float offsetX=0f,float offsetY=0f){
		if(targetObj!=null&&grid!=null&&itemInstance!=null){
			this.targetObj=targetObj;
			this.grid=GameObject.Instantiate(grid) as UIGrid;
			ScreenToUISpace();
			this.itemInstance=itemInstance;
			group=this.grid.gameObject.GetComponent<ListItem>()==null
				?this.grid.gameObject.AddComponent<ListItem>():this.grid.gameObject.GetComponent<ListItem>();

			this.offsetX=offsetX;
			this.offsetY=offsetY;

			this.offerW=offerW;
			this.isIX=isIX;
			isInit=true;
			
		}else{
			Debug.Log("UIGridTool：初始化UIGridTool所传参数不能为空");
		}	
		return this.grid;
	}

	
	//刷新列表
	public void Refresh(List<object> dataList){
		if(isInit){
			if(grid!=null)
			{
				int count=grid.transform.childCount;
				for(int i=0;i<count;i++){
					Destroy(grid.transform.GetChild(i).gameObject);
				}
				itemList.Clear();
			}else{
				Debug.Log("UIGridTool：grid为空");
			}
			
			if(itemInstance!=null){
				int dCount=dataList.Count;
				for(int i=0;i<dCount;i++){
					ListItem item=GameObject.Instantiate(itemInstance) as ListItem;
					item.transform.name="item"+i;
					item.transform.parent=grid.transform;
					item.transform.localPosition=Vector3.zero;
					item.Init();
					item.SetRowData(dataList[i]);
					itemList.Add(item);
				}
				if(grid!=null){
					grid.repositionNow=true;	
					ScreenToUISpace();
				}else{
					Debug.Log("UIGridTool：grid为空");
				}
				// Invoke("Reposition",0.1f);
			}else{
				Debug.Log("UIGridTool：itemInstance为空");
			}
		}else{
			Debug.Log("UIGridTool：请先初始化UIGridTool");
		}		
	}
	private void Reposition()
	{
		if(grid!=null){
			grid.Reposition();	
		}else{
			Debug.Log("UIGridTool：grid为空");
		}
	}
	//删除全部items
	public void Clear(){
		
		if(grid!=null)
		{
			Destroy(grid.gameObject);
		// 	int count=grid.transform.childCount;
		// 	for(int i=0;i<count;i++){
		// 		Destroy(grid.transform.GetChild(i).gameObject);
		// 	}
		// 	itemList.Clear();
		// }else{
		// 	Debug.Log("UIGridTool：grid为空");
		}
	}

	public void Update(){
		
	}
	private void ScreenToUISpace()
	{
		this.grid.transform.localPosition=new Vector3(
			offsetX!=0?(offsetX - grid.cellWidth*(itemList.Count)):this.grid.transform.localPosition.x,
			isIX?(KBN._Global.isIphoneX()?((this.targetObj.rect.y+offerW)*0.91f+40f):this.targetObj.rect.y+offerW):(this.targetObj.rect.y+offerW),
			this.grid.transform.localPosition.z);	
		

		#if UNITY_EDITOR
		// this.grid.cellWidth=(this.grid.cellWidth*TextureMgr.instance().screenResolution.x/640);
		// this.grid.cellHeight=(this.grid.cellHeight*TextureMgr.instance().screenResolution.y/960);
		#else
		// this.grid.cellWidth=(this.grid.cellWidth*Screen.width/640);
		// this.grid.cellHeight=(this.grid.cellHeight*Screen.height/960);
		#endif
        
	}

	public void Draw(){
		if(group!=null){
			group.rect.x=group.transform.localPosition.x;
			group.rect.y=group.transform.localPosition.y;
		}
		if(itemList!=null){
			for(int i=0;i<itemList.Count;i++){
				itemList[i].rect.x=itemList[i].transform.localPosition.x;
				itemList[i].rect.y=itemList[i].transform.localPosition.y;
			}
		}
		GUI.BeginGroup(group.rect);
		if(itemList!=null){
			for(int i=0;i<itemList.Count;i++){
				itemList[i].Draw();
			}
		}
		GUI.EndGroup();

	}
}
