using UnityEngine;
using System.Collections;
//using System.Threading;
namespace KBN
{
	public class NewUpdateSeed
	{
		private static NewUpdateSeed singleton;
		private PBMsgUpdateSeed.PBMsgUpdateSeed data = null;// todo
		protected delegate void OKFunc(byte[] result);
		protected OKFunc UpdateSeedOkFunc = null;
		protected static MonoBehaviour monoBehaviour;

		public static NewUpdateSeed getInstance()
		{
			if( singleton == null )
			{
				singleton = new NewUpdateSeed();
				singleton.Init();
			}
			return singleton;
		}

		private void Init()
		{
			UpdateSeedOkFunc = UpdateSeedOk;
		}

		public void SetMonoBehavior(MonoBehaviour mb)
		{
			monoBehaviour = mb;
		}

		public void ReqUpdateSeed()
		{
//			WWWForm form = new WWWForm ();
//
//			PBMsgUpdateSeed.PBMsgUpdateSeed reqMsg = new PBMsgUpdateSeed.PBMsgUpdateSeed ();
//			string strMsg = _Global.SerializePBMsg2Base64Str (reqMsg);
//			form.AddField ("data", strMsg);
//			string url = "gds.php";
//			UnityNet.RequestForGPB (url,form,UpdateSeedOkFunc,null);
		}

		private void UpdateSeedOk(byte[] result)
		{


			monoBehaviour.Invoke ("ReqUpdateSeed",30);
		}
	}
}