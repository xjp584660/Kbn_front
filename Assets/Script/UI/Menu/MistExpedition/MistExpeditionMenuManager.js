/*
 * @FileName:		MistExpeditionMenuManager.js
 * @Author:			lisong
 * @Date:			2022-05-11 09:45:50
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 UI界面 的管理器
 *
*/


public class MistExpeditionMenuManager{

    /*============================ 错误 弹出框 =============================================*/
    /* 错误 弹出框
     * 可点击关闭
     * errorMsg： 错误信息
     */
    public static function PopUpErrorMsg(errorMsg: String) {
        ErrorMgr.instance().PushError("", errorMsg,true, Datas.getArString("Common.OK"),null );
    }


    /* 错误 弹出框
     * 可点击关闭
     * errorMsg： 错误信息
     * errorCode：错误码
     */
    public static function PopUpErrorMsg(errorMsg: String, errorCode: String) {

        errorMsg = errorCode == UnityNet.NET_ERROR ? Datas.getArString("Error.Network_error") : UnityNet.localError(errorCode, errorMsg, null);
        ErrorMgr.instance().PushError("", errorMsg, true, Datas.getArString("Common.OK"),null );
    }

    /* 错误 弹出框
     * 可点击关闭
     * errorMsg： 错误信息
     * errorCode：错误码
     * isCanClosed：是否可以点击按钮关闭/有关闭按钮
     * retryFunc：重复直接的回调函数
     * closeFunc：点击关闭按钮时候的回调
     */
    public static function PopUpErrorMsg(errorMsg: String, errorCode: String, isCanClosed: boolean, retryFunc: Function, closeFunc: Function) {

        errorMsg = errorCode == UnityNet.NET_ERROR ? Datas.getArString("Error.Network_error") : UnityNet.localError(errorCode, errorMsg, null);
        ErrorMgr.instance().PushError("", errorMsg, isCanClosed, Datas.getArString("FTE.Retry"), retryFunc, closeFunc);
      }

    /*============================ 对话 弹窗 =============================================*/

    /*----------------------------------------------------------------*/
    /*对话弹窗 - 单按钮
     * titleStrKey：标题的 language key
     * tipsInfoStrKey：弹窗信息的 language key
     * okFunc：确认按钮的回调函数
     * cancelFunc：取消按钮的回调函数
     */
    public static function PopupConfirmDialogSingleBtn(titleStrKey: String, tipsInfoStrKey: String, okFunc: System.Action.<System.Object>) {
        PopupConfirmDialog(titleStrKey, tipsInfoStrKey, "Common.Yes", "Common.No", UnityEngine.TextAnchor.UpperCenter, okFunc, null, false);
    }


    /*
   * 可以设置提示信息的对齐方式的 弹窗 - 单按钮
   */
    public static function PopupConfirmDialogSingleBtn(titleStrKey: String, tipsInfoStrKey: String, msgAlignment: UnityEngine.TextAnchor, okFunc: System.Action.<System.Object>) {
        PopupConfirmDialog(titleStrKey, tipsInfoStrKey, "Common.Yes", "Common.No", msgAlignment, okFunc, null, false);
    }



/*----------------------------------------------------------------*/

    /*对话弹窗
     * titleStrKey：标题的 language key
     * tipsInfoStrKey：弹窗信息的 language key
     * okFunc：确认按钮的回调函数
     * cancelFunc：取消按钮的回调函数
     */
    public static function PopupConfirmDialog(titleStrKey: String, tipsInfoStrKey: String, okFunc: System.Action.<System.Object>, cancelFunc: System.Action.<System.Object>) {
        PopupConfirmDialog(titleStrKey, tipsInfoStrKey, "Common.Yes", "Common.No", UnityEngine.TextAnchor.UpperCenter, okFunc, cancelFunc, true);
    }

    /*
     * 可以设置提示信息的对齐方式的 弹窗
     */
    public static function PopupConfirmDialog(titleStrKey: String, tipsInfoStrKey: String, msgAlignment: UnityEngine.TextAnchor, okFunc: System.Action.<System.Object>, cancelFunc: System.Action.<System.Object>) {
        PopupConfirmDialog(titleStrKey, tipsInfoStrKey, "Common.Yes", "Common.No", msgAlignment, okFunc, cancelFunc, true);
    }

    /*对话弹窗
     * titleStrKey：标题的 language key
     * tipsInfoStrKey：弹窗信息的 language key
     * okBtnStrKey：确认按钮显示文本的 language key
     * cancelBtnStrKey：取消按钮显示文本的 language key
     * msgAlignment：信息对齐方式，默认顶部居中：UnityEngine.TextAnchor.UpperCenter
     * okFunc：确认按钮的回调函数
     * cancelFunc：取消按钮的回调函数
     */
    public static function PopupConfirmDialog(titleStrKey: String, tipsInfoStrKey: String, okBtnStrKey: String, cancelBtnStrKey: String, msgAlignment: UnityEngine.TextAnchor, okFunc: System.Action.<System.Object>, cancelFunc: System.Action.<System.Object>, cancelAble:boolean) {

        var dialog: ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
        dialog.setLayout(600, 380);
        dialog.setTitleY(60);
        dialog.m_msg.mystyle.alignment = msgAlignment;
        dialog.setContentRect(70, 140, 0, 100);
        dialog.SetCancelAble(cancelAble);
        
        dialog.setButtonText(Datas.getArString(okBtnStrKey), Datas.getArString(cancelBtnStrKey));

        MenuMgr.getInstance().PushConfirmDialog(Datas.getArString(tipsInfoStrKey), Datas.getArString(titleStrKey), okFunc, cancelFunc);

    }
}
