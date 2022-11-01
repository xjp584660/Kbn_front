using UnityEngine;
using System.Collections;

public class VerifyMenu : MonoBehaviour{

    private static string prefabPath="Prefabs/menu/VerifyMenu/VerifyMenu";
    private static VerifyMenu instance;
    public static VerifyMenu GetInstance(){
        if(instance==null){
            GameObject prefab=Resources.Load(prefabPath) as GameObject;
            GameObject obj = GameObject.Instantiate(prefab) as GameObject;
            DontDestroyOnLoad(obj);
            instance=obj.GetComponent<VerifyMenu>();
        }
        return instance;
    } 


    public UITexture bg;
    public UITexture top;
    public UISlider sldier;

    public UILabel title;
    public UILabel des;
    public UILabel btn_label;

    public Camera camera;

    void Start() {
        // this.gameObject.SetActive(true);
        // this.gameObject.SetActive(false);
        KBN.MenuMgr.instance.SetCurVisible(false);
//        if (camera!=null)
//        {
//            camera.orthographicSize=Screen.height/992f;
//        }
        bg.onRender = SetBg;
        top.onRender = SetTop;
        title.text=KBN.Datas.getArString("PVE.Verification");
        des.text=KBN.Datas.getArString("PVE.Verification_text");
        btn_label.text=KBN.Datas.getArString("Verification_Button");
        init();
    }

    private void init() {
        sldier.value=0;
    }

    void Update() {
        top.transform.localPosition=new Vector3(offset-width/2-x+sldier.value*(width-offset),
			top.transform.localPosition.y,
			top.transform.localPosition.z);
        if(test){
            if(old_x!=x||old_y!=y){           
                old_x=x;
                old_y=y;
                SetValue(x,y);
            }
        }

        if (gameObject.activeSelf)
        {
            KBN.MenuMgr.instance.SetCurVisible(false);
        }
    }

    private float offset=20f;
    private float width=300f;
    private float height=300f;

    public float x=30f;
    public float y=87f;
    private float old_x;
    private float old_y;

    public bool test=true;
    //开始验证
    public void SetValue(float x,float y) {

        
        if(bg!=null&&top!=null&&sldier!=null){
            this.gameObject.SetActive(true);
            this.x=x;
            this.y=y;
//            Debug.LogWarning("x="+x+" y="+y);
            // bg.transform.localPosition.x=0;
            // bg.transform.localPosition.y=0;
            top.transform.localPosition=new Vector3(offset-width/2-x,0f,0f);
            SetBg(bg.material);
            SetTop(top.material);
            init();  
        }
    }

    private void SetBg(Material mal) {
        mal.SetTextureOffset("_MaskLayer",new Vector2(-x/width,-y/width));
    }
    private void SetTop(Material mal) {
        mal.SetTextureOffset("_MaskLayer",new Vector2(-x/width,-y/width));
    }

    public void Submit() {
        float submitValue=sldier.value*(width-offset)+offset-width/2;
//        Debug.LogWarning("submiteValue:"+submitValue);
        KBN.PveController.instance().ReqVerify(Constant.PVE_VERIFY_REQ_Type.VERIFY,(int)submitValue);      
    }
    //关闭界面
    public void Close(){
        this.gameObject.SetActive(false); 
        KBN.MenuMgr.instance.SetCurVisible(true);
    }
    public void Refresh(){
        KBN.PveController.instance().ReqVerify(Constant.PVE_VERIFY_REQ_Type.REFRESH); 
    }

}