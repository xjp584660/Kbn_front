using UnityEngine;
using System.Collections;

namespace KBN
{
	public class KillSelf : MonoBehaviour {

		public Material mat_normal;
		public Material mat_mad;
		public Material mat_awake;
		public Material[] mats;

		private Animator ani;

		private int state=1;
		private int action=2;
		private int parameter=0;

		private GameObject fireObj;

		public GameObject beijiFire;

		public int statechange=-1;
		private int statebase=-1;

		public int rotachange=10000;
		private int rotabase=10000;

		void Start(){
			// mats=transform.FindChild("loog").gameObject.GetComponent<Renderer>().materials;
			ani=transform.GetComponent<Animator>();
		}

		void Update(){
			if(ani!=null){
				ani.SetInteger("state",state);
				ani.SetInteger("action",action);
				if(action==Constant.WorldBOssAnimationAction.idle){
					ani.SetInteger("parameter",_Global.INT32(UnityEngine.Random.Range(0f,100f)));
				}else{
					//如果现在是正面攻击，则永远是正面攻击
					if(parameter==102&&ani.GetInteger("parameter")==101){
						ani.SetInteger("parameter",101);
					}else{
						ani.SetInteger("parameter",parameter);
					}					
				}
				
				if(state==4){
					reallyKill();
				}


				if(beijiFire!=null){
					beijiFire.SetActive(action==1);
				}
			}
			if(statechange!=statebase){
				SetBossState(statechange);
				statebase=statechange;
			}

			if(rotachange!=rotabase){
				// SetBossState(statechange);
				Vector3 v=new Vector3(0,rotachange,0);
				SetBossRotation(v);
				rotabase=rotachange;
			}
		}

		public void PlayBossAni(int state,int action,int par){
			if(ani!=null){
				this.action=action;
				this.parameter=par;
			}
//			SetBossState(state);
			
		}
		//杀死自己
		private void Kill(){
			// Debug.LogWarning("===Kill Boss===");
			if (!IsInvoking("reallyKill")) 
			{
				Invoke("reallyKill",2.5f);
			}
			
		}

		public void SetBossRotation(Vector3 rotation){
			if((rotation.y+720)%360!=(transform.localEulerAngles.y+720)%360){
				transform.localEulerAngles=rotation;
				// TweenRotation.Begin(gameObject,1f,Quaternion.Euler(rotation));
				ani.Play("idle-3");
			}
		}

		private void reallyKill(){
			Destroy(gameObject);
		}
		//设置状态
		public void SetBossState(int state){
			// Debug.LogWarning("===BOSS State Change : "+state+"===");

			this.state=state;

			switch(state){
				case 1:
					mats=new Material[1];
					mats[0]=mat_normal;
					transform.Find("loog").gameObject.GetComponent<Renderer>().materials=mats;
					break;
				case 2:
					mats=new Material[1];
					mats[0]=mat_mad;
					transform.Find("loog").gameObject.GetComponent<Renderer>().materials=mats;
					ani.Play("mad2");
					break;
				case 3:
					mats=new Material[1];
					mats[0]=mat_awake;
					transform.Find("loog").gameObject.GetComponent<Renderer>().materials=mats;
					break;
				default:
					mats=new Material[1];
					mats[0]=mat_normal;
					transform.Find("loog").gameObject.GetComponent<Renderer>().materials=mats;
					break;
			}
		}
	}
}

