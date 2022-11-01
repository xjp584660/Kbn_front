using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class ATData{
	public Vector3 pos;//点击位置的坐标
	
	public string interfaceName;//当前界面的名称
	public ATData(Vector3 pos,string interfaceName){
		this.pos = pos;
		this.interfaceName = interfaceName;
	}
	public string ToString(){
		return "pos="+pos+",interfaceName="+interfaceName;
	}
}
public class CheckAutoHotTools  {
	
	public ATData[] arr=new ATData[100];
	int currentIndex=0;
	float MinDis=5f;
	Vector3 oldPos=Vector3.zero;
	int errorIndex1=0;
	int errorIndex2=0;
	static CheckAutoHotTools instance;
	int chance=2;
	public static CheckAutoHotTools Instance{
		get{
			if (instance == null)
				instance = new CheckAutoHotTools ();
			return instance;
		}
	}
	
	/// <summary>
	/// 添加成功，返回true，失败 返回false；
	/// 当发现点击位点重复的时候，认为添加失败
	/// </summary>
	/// <returns><c>true</c>, if position was added, <c>false</c> otherwise.</returns>
	/// <param name="pos">Position.</param>
	public bool addDate(ATData data){
		bool flag=true;
		#if UNITY_EDITOR
		if (Vector3.Distance (oldPos, data.pos) < MinDis) {//编辑器模式下，不记录相邻相同的点
			return flag;
		}

		#endif
		if(KBN.GameMain.singleton!=null&&!KBN.GameMain.singleton.CheckCampaignLevel())
		{
			return flag;
		}else if (KBN.GameMain.singleton == null){
			return true;
		}
		if(!check (data,currentIndex)){// 没有相同位点
			flag= true;
		}else  // 有相同位点
		{
			flag= false;
		}
		arr [currentIndex] = data;
		currentIndex++;
		if (currentIndex >= arr.Length)
			currentIndex = 0;
		oldPos = data.pos;
		if(!flag){//you have two chance to cheat,Please cherish it
			flag=chance>0?true:false;
			chance--;
		}
		return flag;
		
	}
	/// <summary>
	/// 监测是否作弊，查看当前点击位点是否在集合中存在记录
	/// 返回值 true－作弊，false－未作弊
	/// </summary>
	/// <param name="pos">Position.</param>
	/// <param name="index">Index.</param>
	bool check(ATData data,int index){
		bool flag = false;
		for (int i = 0; i < arr.Length; i++) {
			ATData item = arr [i];
			if (item == null)
				break;
			if(Vector3.Equals(item.pos,data.pos)){
				flag= check (i, index);
			}
		}
//		Debug.Log ("res----------------------"+flag);
		return flag;
	}
	
	/// <summary>
	/// 监测是否作弊，对比某两个位点的之前若干点，是否相同
	/// 返回值 true－作弊，false－未作弊
	/// </summary>
	/// <param name="index1">Index1.</param>
	/// <param name="index2">Index2.</param>
	bool check(int index1,int index2){
		if (index1 < 3 || index2 < 3)//如果该位点位于数组起始位置，不做处理
		{
         	return false;
		}
		else if(check2Index(index1-1,index2-1) && check2Index(index1-2,index2-2)
			// &&!check2Index(index1-1,index1-2)&&!check2Index(index2-1,index2-2)
			){
			errorIndex1=index1;
			errorIndex2=index2;
			return true;
		}else 
		{
			return false;
		}
		 
		
	}
	
	/// <summary>
	/// 判断某两点的数据，是否完全相同
	/// </summary>
	/// <param name="index1">Index1.</param>
	/// <param name="index2">Index2.</param>
	bool check2Index(int index1,int index2)
	{
		Debug.Log(arr[index1].pos + " "+arr [index2].pos+" "+arr[index1].interfaceName+" "+arr[index2].interfaceName);
//		if (Vector3.Distance (arr [index1].pos, arr [index2].pos) > MinDis || !arr [index1].interfaceName.Equals (arr [index2].interfaceName)) {
		if (Vector3.Equals (arr [index1].pos, arr [index2].pos) && arr [index1].interfaceName.Equals (arr [index2].interfaceName)) {
			return true;
		} else
			return false;
	}

	public string GetPoints(){
		if(errorIndex1<3 || errorIndex2<3) return "";
		System.Text.StringBuilder sb=new System.Text.StringBuilder();
		sb.Append("userId:"+KBN.Datas.singleton.tvuid()+";");
		sb.Append("  time:"+System.DateTime.Now.ToString()+";");
		sb.Append("  errorPoint1:"+"inedx="+errorIndex1+"--"+arr[errorIndex1].ToString()+","+arr[errorIndex1-1].ToString()+","+arr[errorIndex1-2].ToString()+";");
		sb.Append("  errorPoint2:"+"inedx="+errorIndex2+"--"+arr[errorIndex2].ToString()+","+arr[errorIndex2-1].ToString()+","+arr[errorIndex2-2].ToString()+";");
		sb.Append("  allPoint:");
		List<ATData> atList=new List<ATData>();
		for (int i = 0; i < arr.Length; i++) {
			if(arr[i]!=null){
				sb.Append("pointIndex"+i+" ");
				sb.Append("MenuName:"+arr[i].interfaceName+" ");
				sb.Append("point:"+arr[i].pos+",");

			}
		}

		return sb.ToString();
	}
}
