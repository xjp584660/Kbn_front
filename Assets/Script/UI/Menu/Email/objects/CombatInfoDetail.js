class CombatInfoDetail extends UIObject {
  public var detail: ComposedUIObj;

  public var winIcon: Label;

  public var playerIcon: Label;
  public var playerAvatarFrame: Label;
  public var playerName: Label;
  public var playerPosition: Button;
  public var might: Label;
  public var fought: Label;
  public var servived: Label;
  public var death: Label;
  public var injured: Label;

  public var label_might: Label;
  public var label_fought: Label;
  public var label_servived: Label;
  public var label_death: Label;
  public var label_injured: Label;

  public var worldbossFought: Label;
  public var worldbossServerd: Label;
  public var label_worldbossFought: Label;
  public var label_worldbossServerd: Label;

  public var normal_Detail: ComposedUIObj;
  public var worldboss_Detail: ComposedUIObj;

  public var title: Label;

  private var x: int;
  private var y: int;

  public function Draw() {
    detail.Draw();
  }

  public function refresh(data: HashObject) {
    playerPosition.OnClick=this.GoMap;
    var isWin: Boolean = _Global.INT32(data["isWin"]) == 1;
    this.winIcon.SetVisible(isWin);
    this.playerIcon.useTile = true;
    
    this.playerName.txt = data["playerName"].Value.ToString();
    x = _Global.INT32(data["x"]);
    y = _Global.INT32(data["y"]);
    this.playerPosition.txt = (x == 0 && y == 0) ?  "":("(" + x + "," + y + ")") ;
    this.might.txt = KBN.Datas.getArString("BattleReport.Might") + data["might"].Value.ToString();
    this.fought.txt = _Global.NumSimlify(_Global.INT64(data["combatInfo"]["fought"]));
    this.servived.txt = _Global.NumSimlify(_Global.INT64(data["combatInfo"]["servived"]));
    this.death.txt = _Global.NumSimlify(_Global.INT64(data["combatInfo"]["death"]));
    this.injured.txt = _Global.NumSimlify(_Global.INT64(data["combatInfo"]["injured"]));

    // label_might.txt=KBN.Datas.getArString("BattleReport.Might");
    label_fought.txt = KBN.Datas.getArString("BattleReport.Fought");
    label_servived.txt = KBN.Datas.getArString("BattleReport.Survived");
    label_death.txt = KBN.Datas.getArString("BattleReport.Death");
    label_injured.txt = KBN.Datas.getArString("BattleReport.Injured");

    this.worldbossFought.txt = _Global.NumSimlify(_Global.INT64(data["combatInfo"]["fought"]));
    this.worldbossServerd.txt = _Global.NumSimlify(_Global.INT64(data["combatInfo"]["servived"]));
    label_worldbossFought.txt = KBN.Datas.getArString("WorldBoss.Report_Text10");
    label_worldbossServerd.txt = KBN.Datas.getArString("WorldBoss.Report_Text11");

    // data["reportType"].Value="101";
    if (_Global.INT32(data["reportType"]) == Constant.MarchType.EMAIL_WORLDBOSS && _Global.INT32(data["isAtk"]) == 0) {
      worldboss_Detail.SetVisible(true);
      normal_Detail.SetVisible(false);
      playerIcon.useTile = true;
      playerIcon.tile = TextureMgr.instance().UnitSpt().GetTile("Dragon_Avatar");
      playerAvatarFrame.useTile = false;
    } else {
      worldboss_Detail.SetVisible(false);
      normal_Detail.SetVisible(true);
      setAvatar(data["playerIcon"].Value.ToString(), data["playerAvatarFrame"].Value.ToString());
    }

    title.txt = _Global.INT32(data["isAtk"]) == 1 ? KBN.Datas.getArString("BattleReport.attack") : KBN.Datas.getArString("BattleReport.defence");
  }

  private function setAvatar(name: String, frame: String): void {
    // if (name == Datas.getArString("Common.Enemy")) {
    // 	setSystemAvatar();
    // } else {
    playerIcon.useTile = true;
    playerIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(name));
    if(frame != "img0"){
      playerAvatarFrame.useTile = true;
      playerAvatarFrame.tile = TextureMgr.instance().ElseIconSpt().GetTile(frame);
    }
    else{
      playerAvatarFrame.useTile = false;;
    }
    // }
  }

  private function setSystemAvatar(): void {
    playerIcon.useTile = false;
    playerIcon.setBackground("quest_point", TextureType.DECORATION);
    this.playerAvatarFrame.useTile = false;
  }

  private function GoMap(){
    if(x==0&&y==0){
      
    }else{
      if(Message.getInstance().ReportViewingType == ReportViewingType.Ava){   //ava
        KBN.MenuMgr.instance.PopMenu("");
        var avaChatMenu:AvaChatMenu = MenuMgr.getInstance().getMenu("AvaChatMenu") as AvaChatMenu;//战报分享关闭chatUI
        if (avaChatMenu != null)
        {
            MenuMgr.getInstance().PopMenu("AvaChatMenu");
        }	
        var AvaCoopMenu: AvaCoopMenu = MenuMgr.getInstance().getMenu("AvaCoopMenu")as AvaCoopMenu;
        if(AvaCoopMenu!=null)
        {
          MenuMgr.getInstance().PopMenu("AvaCoopMenu");
        }
        KBN.GameMain.singleton.gotoMap2(x,y);
      }else{
        KBN.MenuMgr.instance.PopMenu("");
        var chatMenu:ChatMenu = MenuMgr.getInstance().getMenu("ChatMenu") as ChatMenu;//战报分享关闭chatUI
        if (chatMenu != null)
        {
            MenuMgr.getInstance().PopMenu("ChatMenu");
        }	
        KBN.GameMain.singleton.gotoMap(x,y);
      }
      
    }
    
  }
}