/*
 * @FileName:		MistExpeditionMapSlotStateType.js
 * @Author:			lisong
 * @Date:			2022-04-08 12:40:09
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	每个 MistExpeditionMap slot 的 状态 类别,随着不断前进 各个 slot 的状态会发生改变
 *
*/


public enum MistExpeditionMapSlotStateType {

    /*
     *Inactive ->  Active -> Selected -> [Notyet] -> Forbid
     * 
    */

    Inactive,           /* 未激活状态：  尚未 进行的 、不可选择的 slot */
    Active,             /* 激活状态：    当前被选中的 正在进行的 slot */
    Select,             /* 选中状态：    当前选中的 slot */
    Uncomplete,         /* 尚未完成：    已经完成了事件，但是事件的奖励、物品还未领取处理 */
    Forbid              /* 禁止状态：    已经完成的、没有被选中的 slot */
}