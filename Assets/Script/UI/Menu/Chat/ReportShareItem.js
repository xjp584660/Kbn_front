#pragma strict
class ReportShareItem extends UIObject {
  var combatInfoUp:    Label;
  var combatInfoDown:  Label;
  var composedObj:     Label;
 
   
  public function Draw() : int 
  {
	     composedObj.Draw();
	     combatInfoUp.Draw();
	     combatInfoDown.Draw();
  }
  public function Init():void
  {
      combatInfoUp.rect = new Rect(this.rect.x + 110, this.rect.y + 13, 290,50);
      
      combatInfoDown.rect = new Rect(this.rect.x + 110,this.rect.y + 58,350,50);
      
      composedObj.rect = new Rect(this.rect.x + 30, this.rect.y + 13,70,70);
  }
  public function SetData(atkName:String,defName:String,isWin:boolean){
   
      combatInfoUp.txt = Datas.getArString("BattleReprotShare.Title");
      if(String.IsNullOrEmpty(atkName))
      {
        atkName = Datas.getArString("Common.Enemy");
      }
      if(String.IsNullOrEmpty(defName)){
        defName = Datas.getArString("Common.Enemy");
      }
      if(isWin){
        combatInfoDown.txt = String.Format(Datas.getArString("BattleReprotShare.Text"),atkName,defName);
      }else{
        combatInfoDown.txt = String.Format(Datas.getArString("BattleReprotShare.Text"),defName,atkName);
      }
      combatInfoUp.normalTxtColor = FontColor._Dark_;
      combatInfoUp.mystyle.fontStyle = FontStyle.Italic;
      combatInfoDown.normalTxtColor = FontColor.SmallTitle;
      combatInfoDown.mystyle.fontStyle = FontStyle.Italic;
  
  }
}