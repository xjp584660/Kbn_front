using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

//using _Global = KBN._Global;
//using Datas = KBN.Datas;
//using ScrollList = KBN.ScrollList;
//using OutpostTroopsDeployment = KBN.OutpostTroopsDeployment;

namespace KBN {
    public class OutpostAllianceDeployments : UIObject , IEventHandler
    {
        [SerializeField]
        private SimpleButton btnBack;
        [SerializeField]
        private ScrollList scrollList;
        [SerializeField]
        private SimpleLabel lbFrame;
        [SerializeField]
        private SimpleLabel lbTitle;
        [SerializeField]
        private SimpleLabel lbTitleBack;
        [SerializeField]
        private SimpleLabel lbMemberNum;
        [SerializeField]
        private SimpleLabel lbSeparator;

        public OutpostAllianceDeploymentItem deploymentItem;

        public Action OnGoBack { get; set; }

        public Action<object> OnGetAllianceDeploymentDetail { get; set; }


        public override void Init ()
        {
            base.Init ();
            
            btnBack.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_back2_normal", TextureType.BUTTON);
            btnBack.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_back2_down", TextureType.BUTTON);
            btnBack.OnClick = new Action(OnBackButton);

            lbFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
            lbTitleBack.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
            lbTitle.txt = Datas.getArString("AVA.Outpost_AllianceDeployment");
            lbSeparator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line", TextureType.DECORATION);

            scrollList.Init(deploymentItem);
            scrollList.itemDelegate = this;
        }

        public override int Draw ()
        {
            if (!visible)
                return -1;

            GUI.BeginGroup(rect);

            btnBack.Draw();
            
            lbFrame.Draw();
            lbTitleBack.Draw();
            lbTitle.Draw();	
            lbMemberNum.Draw();
            lbSeparator.Draw();
            
            scrollList.Draw();

            GUI.EndGroup();

            return -1;
        }

        public override void Update ()
        {
            base.Update ();
            scrollList.Update();
        }

        public override void SetUIData (object data)
        {
            base.SetUIData (data);
            HashObject allianceDeploys = data as HashObject;

            //HashObject allianceDeploys = result["data"];
            int deployCount = _Global.GetObjectValues(allianceDeploys).Length;
            lbMemberNum.txt = string.Format(Datas.getArString("Ava.Outpost_AllianceDeployment_Member"), deployCount);

            List<AvaAllianceDeployment> avaDeployments = new List<AvaAllianceDeployment>();
            for( int i = 0; i < deployCount; i ++ )
            {
                HashObject r = allianceDeploys[_Global.ap + i];

                AvaAllianceDeployment temp = new AvaAllianceDeployment();
                temp.userId = _Global.INT32(r["userId"]);
                temp.displayName = _Global.GetString(r["displayName"]);
                temp.avatarId = _Global.GetString(r["avatarId"]);
                temp.unitNum = _Global.INT64(r["unitNum"]);
                temp.knightNum = _Global.INT32(r["knightNum"]);
                temp.heroNum = _Global.INT32(r["heroNum"]);
                temp.might = _Global.INT64(r["might"]);
                temp.power = _Global.INT64(r["power"]);
                temp.avatarFrame = _Global.GetString(r["avatarFrameImg"]);

                avaDeployments.Add(temp);
            }
            scrollList.Clear();
            scrollList.SetData(avaDeployments);
            scrollList.MoveToTop();
        }

        public void handleItemAction (string action, object param)
		{
			if (action == "OnDetail") 
            {
                AvaAllianceDeployment data = param as AvaAllianceDeployment;
                if (null != data)
                {
                    if(OnGetAllianceDeploymentDetail != null)
                    {
                        OnGetAllianceDeploymentDetail(data);
                    }
                }
			} 
		}

        public override void OnPopOver ()
        {
            base.OnPopOver ();
            scrollList.Clear();
            scrollList.MoveToTop();
        }

        private void OnBackButton()
        {
            if (null != OnGoBack) {
                OnPopOver();
                OnGoBack();
            }
        }
    }
}