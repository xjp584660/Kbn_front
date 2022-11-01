/*
 * @FileName:		MistExpeditionMapSlotEventType.js
 * @Author:			lisong
 * @Date:			2022-04-07 06:38:47
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	每个 MistExpeditionMap slot 的事件 类别,依据触发的事件类型
 *
*/


public enum MistExpeditionMapSlotEventType {
    None,
    Battle_Normal  = 1,      /* 战斗 - 普通 */
    Battle_Elite = 2,       /* 战斗 - 精英 */
    Merchant = 3,           /* 商人 */
    SupplyStation = 4,      /* 中途补给 */
    Random = 5,             /* 迷雾沼泽(随机) ,可以是其他任意一种 */
    Chest = 6,              /* 宝箱 */
    Battle_Boss = 7         /* 战斗 - boss */
}