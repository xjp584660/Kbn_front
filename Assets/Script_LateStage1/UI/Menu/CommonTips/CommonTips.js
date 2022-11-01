class CommonTips extends SimpleUIObj  implements ITouchable
{
   @SerializeField private var bgLabel : Label;

   @SerializeField private var arrow : Label;

   @SerializeField private var bg : Label;

   private var offsetx:float =  - 16.5f;

   private var offsety:float =  -50.5f;

   private var width:float = 320f;
   private var height:float = 59f;

   public function StartShow( msg:String, posx:float,posy:float ):void
   {
     // _Global.LogWarning(" "+posx+" "+posy);
        
         this.arrow.rect.x = posx + this.offsetx;
         this.arrow.rect.y = posy + this.offsety;
         this.bgLabel.txt = msg;
       
         var min:float = 0;
         var max:float = 0;

         this.bgLabel.mystyle.CalcMinMaxWidth(GUIContent(msg), min, max);

         var xPos:float = 0f;

         if(posx+this.offsetx >= this.width/2)
         {
          //Screen.width
           xPos = posx+this.offsetx - width/2;
           if (posx + this.offsetx + width/2 > 640f)
           {
              xPos = 640f - this.width - 15f;
           }
           if(xPos<0)
            xPos = 0;
         }else{
           xPos = 0 ;
         }
        // _Global.LogWarning(" "+Screen.width);

      

         if(max > this.width){
           var perNum:int = Math.Ceiling(max/width);
           var length:float = this.height + (perNum * 21f);
           this.bgLabel.rect = new Rect(xPos, posy + this.offsety - length + 20.5f, width, length );
           this.bg.rect = new Rect(xPos , posy + this.offsety - length + 20.5f, width+15f, length+5f );
         }
         else
         {
              this.bgLabel.rect = new Rect(xPos, posy + this.offsety - height + 20.5f, width, height );
              this.bg.rect = new Rect(xPos, posy + this.offsety - height + 20.5f, width+15f, height+5f );
         }
      
       
         //btn.OnClick = Down;
         visible = true;
   }


   public function Draw() 
   {
      if(!visible)
      {
          return;
      }
      this.arrow.Draw();
      this.bg.Draw();
      this.bgLabel.Draw();
      
      //_Global.LogWarning(">>>>>");
 
      }
   }

   public function Down()
   {
     visible = false;
   }

   function Update()
   {
    if(!visible){

      return;
    }
    if(Event.current!=null&& Event.current.type == EventType.MouseDown){
    
      Down();
   }
}