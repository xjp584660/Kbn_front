using System;
using System.Collections.Generic;
using KBN;
using System.IO;

public sealed partial class AvaManager
{
    private IList<AvaModule> m_AvaModules = new List<AvaModule>();
    
	public bool HavePushMatchMsg
	{
		get;
		set;
	}
	public AvaManager()
    {
        CreateModules();
    }

    public void Init()
    {
        for (int i = 0; i < m_AvaModules.Count; i++)
        {
            m_AvaModules[i].Init();
        }
		HavePushMatchMsg = false;
		GameMain.Ava.Alliance.OnLevelChanged += OnAllianceLevelChanged;

		KBN.NewSocketNet.instance.RegisterConnectedHandlers(OnNewNetworkNodeConnected);
    }

	private void OnNewNetworkNodeConnected()
	{
		if (GameMain.singleton.getScenceLevel() == GameMain.AVA_MINIMAP_LEVEL)
		{
			Seed.ConnectedAvaSeed();
			Buff.RequestBuffList();
		}
	}

    public void Update()
    {
        for (int i = 0; i < m_AvaModules.Count; i++)
        {
            m_AvaModules[i].Update();
        }
    }

    public void ClearAll()
    {
        for (int i = 0; i < m_AvaModules.Count; i++)
        {
            m_AvaModules[i].Clear();
        }

        m_AvaModules.Clear();
    }

    public void AddModule(AvaModule avaModule)
    {
        if (avaModule == null)
        {
            throw new ArgumentNullException("avaModule");
        }

        m_AvaModules.Add(avaModule);
    }

	public void ReceiveSocketMsg(byte[] data)
	{
		PBMsgAVASocket.PBMsgAVASocket msg = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVASocket.PBMsgAVASocket>(data);
		switch(msg.messagetype)
		{
		case Constant.AvaSocketMsgType.StateUpdate_Ava_RallyMarch:
			March.RequestMarchList();
			break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_IncommingAttack:
			March.RequestIncommingAttackList();
			break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_Reinforce:
			break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_Buff:
			Buff.RequestBuffList();
			break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_Report:
            Message.Instance.DownloadAvaReports();
			break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_Troops:
			Units.RequestAvaUnits();
			break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_MarchMaking:
			if(GameMain.Ava.Event.MatchResult == null)
			{
				RequestMatchMakingResult();
			}			
			break;
        case Constant.AvaSocketMsgType.StateUpdate_Ava_Score:
            AvaScoreStats.UpdateScoreStats(msg);
            break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_Item:
			AddItems(msg.result);
			break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_ProtectionTime:
			HandleProtectionTime(msg.result);
			break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_NewMarchLine:
//			MapController mc = GameMain.singleton.getMapController2();
//			if( mc != null ) {
//				mc.avaImp.onFollowedTileChange();
//			}
			NewLine(msg.result);
            break;
        case Constant.AvaSocketMsgType.StateUpdate_Ava_Toast:
            HandleToast(msg.result);
			break;
        case Constant.AvaSocketMsgType.StateUpdate_Ava_SuperWonderOwnershipChange:
            HandleSuperWonderOwnershipChange(msg.para);
            break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_ActivityLog:
			ActivityLog.UpdateActivityLog(msg.result);
			break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_WonderTileNumChange:
			AvaScoreStats.UpdateWonderTileNumChange(msg);
			break;
		case Constant.AvaSocketMsgType.StateUpdate_Ava_OwnTotalDataCount:
			TileShare.SetOwnTotalDataCount(msg);
			break;
		}
	}
	private void NewLine( List<PBMsgAVASocket.PBMsgAVASocket.kv> data )
	{
		if (data == null || data.Count <= 0)
		{
			return;
		}
		for(int i=0;i<data.Count;i++)
		{	
			try{
        		string tileId =  data[i].value.ToString();
				MemoryStream ms=new MemoryStream(System.Text.Encoding.Default.GetBytes(tileId));
				PBMsgMarchInfo.PBMsgMarchInfo march = _Global.DeserializePBMsgFromBytes<PBMsgMarchInfo.PBMsgMarchInfo>(UnityNet.DESDeCodeBytes_AES(tileId));
				if(march!=null){
					AvaMarchController.instance().OnMarchReceive(march);
				}
            }catch(Exception e){
                Console.WriteLine(e);
            }
		}
	}

    private void HandleToast(List<PBMsgAVASocket.PBMsgAVASocket.kv> data)
    {
        if (data == null || data.Count <= 0)
        {
            return;
        }

        string msg = "";
        if (data.Count == 1)
        {
            msg = Datas.getArString(data[0].value);
        }
        else
        {
            object[] msgParams = new object[data.Count - 1];
            for (int i = 1; i < data.Count; ++i)
            {
                msgParams[i - 1] = data[i].value;
            }
            msg = Datas.GetFormattedString(data[0].value, msgParams);
        }

        MenuMgr.instance.PushAvaToast(msg);
    }

    private void HandleSuperWonderOwnershipChange(List<long> para)
    {
        if (para == null || para.Count != 2)
        {
            return;
        }

        bool capturedByEnemyAlliance = (para[0] != 0L);
        long playerId = para[1];

        string toastKey;
        if (capturedByEnemyAlliance)
        {
            toastKey = "AVA.Chrome_greatwonderstolen";
        }
        else if (playerId == (long)Datas.singleton.tvuid())
        {
            toastKey = "AVA.Chrome_greatwondercapturedyou";
        }
        else
        {
            toastKey = "AVA.Chrome_greatwondercapturedally";
        }

        MenuMgr.instance.PushAvaToast(Datas.getArString(toastKey));
    }

	private void HandleProtectionTime( List<PBMsgAVASocket.PBMsgAVASocket.kv> data )
	{
		if( data.Count == 2 )
		{
			int tileId = _Global.INT32( data[0].value );
			long time = _Global.INT64( data[1].value );
			MapMemCache.instance().updateAVAProtectionTime( tileId, time );
		}
	}

	private void AddItems(List<PBMsgAVASocket.PBMsgAVASocket.kv> items)
	{
		for(int i=0;i<items.Count;i++)
		{
			KBN.MyItems.singleton.AddItem(_Global.INT32 (items[i].key),_Global.INT32 (items[i].value));
		}
	}

	public void RequestMatchMakingResult()
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		request.cmd = 1;
		request.subcmd = 5;
		UnityNet.RequestForGPB("ava.php", request, OnGetMatchMakingResultOk, null,true);
	}

	public void OnGetMatchMakingResultOk(byte[] data)
	{
		if(data == null)
		{
			return;
		}
		PBMsgAvaMatchMakingResult.PBMsgAvaMatchMakingResult response = _Global.DeserializePBMsgFromBytes<PBMsgAvaMatchMakingResult.PBMsgAvaMatchMakingResult> (data);
		GameMain.Ava.Event.MatchResult = response;
		MenuMgr.instance.PushMenu("AvaMatchResultTipsMenu", response,"trans_immediate");
        if (GameMain.Ava.Seed != null)
        {
            GameMain.Ava.Seed.UpdateMatchResultIfNeeded(response);
        }
	}

	protected void OnAllianceLevelChanged( long oldLevel, long newLevel )
	{
		if(oldLevel!=0 && newLevel>oldLevel)
			MenuMgr.instance.PushMenu("AllianceLevelUpMenu", string.Format(Datas.getArString("Alliance.AllianceUpgradeMessage"),GameMain.Ava.Alliance.Level), "trans_immediate");
	}
}
