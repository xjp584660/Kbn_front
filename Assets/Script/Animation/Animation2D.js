
//// class Animation2D{
//var frameRate:float = 5;
////private	var frameDeltaTime:float = 1/frameRate;
//
//var curFrameIndex:int = 0;
//var frameCnt:int;
//
//var sheetColumnCnt:float;
////var sheetRowCnt:int = 1;
//private	var sheetOffset:Vector2 = new Vector2();
//
//var loopCnt:int = -1;
//private	var	isOver:boolean;
//private	var time:float;
//
//function Update(){
//	if( isOver ){
//		return;
//	}
//	
//	sheetOffset.x = curFrameIndex/sheetColumnCnt;
//	sheetOffset.y = 1; //because sheetRowCnt = 1
//	renderer.material.SetTextureOffset ("_MainTex", sheetOffset); 
//	
//	time -= Time.deltaTime;
//	//print(" animation2d update sheetOffset.x:" + sheetOffset.x + " y:" + sheetOffset.y + " time:" + time + " deltaTime:" + Time.deltaTime);
//	if( time < 0 ){
//		curFrameIndex ++;
//		if( curFrameIndex >= frameCnt ){
//			curFrameIndex = 0;
//			if( loopCnt == 0 ){
//				isOver = true;
//			}else if( loopCnt > 0){
//				loopCnt --;
//			}
//		}
//		
//		//time += frameDeltaTime;
//		time += 1/frameRate;
//	}
//}
//
//function restart(){
//	isOver = false;
//	curFrameIndex = 0;
//	time = 0;
//}
//
//function isEnd(){
//	return isOver;
//}
//// }


var frameRate:float = 15;


var frameCnt:int = 8;
var imgName:String;
var backward:boolean = true;
var loopCnt:int = -1;

private	var curFrameIndex:int = 1;
private	var	isOver:boolean;
private	var time:float;
private	var delta:int = 1;

function	Start(){
	var texture:Texture = TextureMgr.instance().LoadTexture(imgName + curFrameIndex, TextureType.BUILD_ANIMATION);//Resources.Load(imgName + curFrameIndex);
	frameRate = 15;//Application.targetFrameRate;
	GetComponent.<Renderer>().material.SetTexture("_MainTex", texture); 
}

function Update(){
	if( isOver ){
		return;
	}
	
	time -= Time.deltaTime;
	//print(" animation2d update sheetOffset.x:" + sheetOffset.x + " y:" + sheetOffset.y + " time:" + time + " deltaTime:" + Time.deltaTime);
	if( time < 0 ){
		curFrameIndex += delta;
		if( curFrameIndex > frameCnt ){
			if( !backward ){
				curFrameIndex = 1;
				delta = 1;
			}else{
				delta = -1;
				curFrameIndex = frameCnt > 1 ? frameCnt - 1 : 1;
			}
			if( loopCnt == 0 ){
				isOver = true;
			}else if( loopCnt > 0){
				loopCnt --;
			}
		}else if( curFrameIndex < 1 && backward){
			delta = 1;
			curFrameIndex = frameCnt>1 ? 2 : 1;
			
			if( loopCnt == 0 ){
				isOver = true;
			}else if( loopCnt > 0){
				loopCnt --;
			}
		}
		
		//time += frameDeltaTime;
		time += 1/frameRate;
		
		var texture:Texture = TextureMgr.instance().LoadTexture(imgName + curFrameIndex, TextureType.BUILD_ANIMATION);//Resources.Load(imgName + curFrameIndex);
		GetComponent.<Renderer>().material.SetTexture("_MainTex", texture); 
	}	
	
}


function restart(){
	isOver = false;
	curFrameIndex = 1;
	time = 0;
}

function isEnd(){
	return isOver;
}
