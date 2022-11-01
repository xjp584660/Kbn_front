using UnityEngine;
using System;
using System.Collections;

namespace KBN 
{
    public class OutpostAllianceDeploymentItem : FullClickItem
    {
        [SerializeField]
        protected SimpleLabel playerIcon;
         [SerializeField]
        protected SimpleLabel playerIconFrame;
        [SerializeField]
        private SimpleLabel playerName;
        [SerializeField]
        private SimpleLabel knightNum;
        [SerializeField]
        private SimpleLabel heroNum;
        [SerializeField]
        private SimpleLabel unitNum;

        [SerializeField]
        private SimpleLabel might;

        [SerializeField]
        private SimpleLabel power;
        [SerializeField]
        private SimpleButton btnInfo;
        [SerializeField]
        private SimpleButton lbSeparator;
        [SerializeField]
	    private SimpleButton btnDetail;
        [SerializeField]
        protected AvaAllianceDeployment deployment;

        public override void Init ()
        {
            base.Init ();

            //infoIcon.mystyle.normal.background = TextureMgr.singleton.LoadTexture("infor_icon", TextureType.DECORATION);
            btnInfo.rect = new Rect(0, 0, rect.width, rect.height);
            btnInfo.OnClick = new Action(OnInfoButtonClick);
            btnDetail.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_moreinfo_small2_normal", TextureType.BUTTON);
		    btnDetail.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_moreinfo_small2_down", TextureType.BUTTON);
            btnDetail.OnClick = new Action(OnInfoButtonClick);
            lbSeparator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line_list_small", TextureType.DECORATION);
             //line.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line_list_small",TextureType.DECORATION);
	    	// line.rect = new Rect(5, rect.height - 4, rect.width-10, 4);
        }

        public override int Draw ()
        {
            if (!visible)
                return -1;

            GUI.BeginGroup(rect);
            btnInfo.Draw();      
            playerIcon.Draw();
            playerIconFrame.Draw();
            playerName.Draw();
            knightNum.Draw();
            heroNum.Draw();
            unitNum.Draw();
            might.Draw();
            power.Draw();
            lbSeparator.Draw();
            btnDetail.Draw();
           // line.Draw();
            GUI.EndGroup();

            return -1;
        }

        //protected abstract Tile GetPlayerIcon(string avatarId);
        public override void SetRowData (object data)
        {
            base.SetRowData (data);

            deployment = data as AvaAllianceDeployment;
            //SetPlayerIcon(deployment.avatarId);
            playerIcon.useTile = true;
            playerIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(GameMain.singleton.GetAvatarTextureName(deployment.avatarId));
            if(deployment.avatarFrame != "img0")
            {
                playerIconFrame.useTile = true;
                playerIconFrame.tile = TextureMgr.instance().ElseIconSpt().GetTile(deployment.avatarFrame);
            }
            else
            {
                playerIconFrame.useTile = false;
            }
            playerName.txt = deployment.displayName;
            knightNum.txt = string.Format(Datas.getArString("Ava.Outpost_KnightNum") ,deployment.knightNum);
            heroNum.txt = string.Format(Datas.getArString("Ava.Outpost_HeroNum") ,deployment.heroNum);
            unitNum.txt = string.Format(Datas.getArString("Ava.Outpost_UnitNum") ,deployment.unitNum);
            might.txt = string.Format(Datas.getArString("Ava.Outpost_Might") ,deployment.might);
            power.txt = string.Format(Datas.getArString("Ava.Outpost_Power") ,deployment.power);
        }

        private void OnInfoButtonClick()
        {
            if(deployment != null)
            {
                if(Alliance.singleton.IsHaveRights(AllianceRights.RightsType.AllianceDeployment)){
                 if (null != handlerDelegate)
				    handlerDelegate.handleItemAction("OnDetail", deployment);
                }
                else
                {
                   	ErrorMgr.singleton.PushError("",Datas.getArString("Alliance.NoPermission") );
                }
               
            }
            // int allianceId = KBN.Alliance.singleton.MyAllianceId();
            // KBN.UnityNet.GetAllianceAvaTroop(allianceId, deployment.userId, getAlliancesDeploymentOk, getAlliancesDeploymentError);
        }

        private void getAlliancesDeploymentOk(HashObject result)
        {
            // if(_Global.GetBoolean(result["ok"]))
            // {
            // 	// if(OnPushAllianceDeployments != null)
            // 	// {
            // 	// 	OnPushAllianceDeployments(result["data"]);
            // 	// }
            // }
        }

        private void getAlliancesDeploymentError(string errorMessage, string errorCode)
        {

        }
    }
}