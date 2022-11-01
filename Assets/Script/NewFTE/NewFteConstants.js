#pragma strict

class NewFteConstants
{
	class FteIds
	{
		public static final var ChangeEquipFteId:int = 10002;
	}
	
	class TaskType
	{
		public static final var InValid:int = -1;
		
		// Retain some values for extending
		public static final var PlotLine:int = 0;
		public static final var BranchLine:int = 5;
		
		public static final var Daily:int = 10;
		
		public static final var NewGuideOnce:int = 15;
		public static final var NewGuideRepeate:int = 16;
	}
	
	class FteNodeKey
	{
		public static final var Id:String = "Id";
		public static final var Type:String = "Type";
		public static final var Name:String = "Name";
		public static final var Description:String = "Description";
		
		public static final var IsCanSkip:String = "IsCanSkip";
		public static final var OpenConditions:String = "OpenConditions";
		public static final var CompleteConditions:String = "CompleteConditions";
		public static final var FakeDatas:String = "FakeDatas";
		public static final var Rewards:String = "Rewards";
		public static final var StepsFileName:String = "StepsFileName";
	}
	
	class StepNodeKey
	{
		public static final var Id:String = "Id";
		public static final var Name:String = "Name";
		public static final var IsCanSkip:String = "IsCanSkip";
		public static final var IsNofityServer:String = "IsNotifyServer";
		public static final var SkipPhpNames:String = "SkipPhpNames";
		
		public static final var FakeDatas:String = "FakeDatas";
		public static final var Rewards:String = "Rewards";
		public static final var CompleteConditions:String = "CompleteConditions";
		
		public static final var GuideAction:String = "GuideAction";
		
		public static final var HasDialog:String = "HasDialog";
		public static final var DialogAvatar:String = "DialogAvatar";
		public static final var DialogContent:String = "DialogContent";
		public static final var DialogLayout:String = "DialogLayout";
		
		public static final var HasGuideArrow:String = "HasGuideArrow";
		public static final var GuideArrowLayout:String = "GuideArrowLayout";
		
		public static final var HasHighlightBorder:String = "HasHighlightBorder";
		public static final var HighlightLayout:String = "HighlightLayout";
		
		public static final var TraceUIObject:String = "TraceUIObject";
		
		public static final var HasDragIndicator:String = "HasDragIndicator";
		public static final var IndicatorText:String = "IndicatorText";
		
		public static final var TraceDragDroppedTargetObj:String = "TraceDragDroppedTargetObj";
		public static final var TraceTargetType: String = "TraceTargetType";
		public static final var TraceSourceType : String = "TraceSourceType";
		
		public static final var WaitTime : String = "WaitTime";
	}
	
	class TraceObjectType
	{
		public static final var UIObject:String = "UIObject";
		public static final var SceneObject:String = "SceneObject";
	}

	class ConditionTypeKey
	{
		public static final var PrevFteId:String = "PrevFteId";
		
		public static final var Building:String = "Building";
		
		public static final var OpenMenu:String = "OpenMenu";
		public static final var TabControlIndex:String = "TabControlIndex";
	}
	
	class FteActionOp
	{
		public static final var ShowTabFlag:String = "ShowTabFlag";
		public static final var ShowDialog:String = "ShowDialog";
		public static final var GuideButton:String = "GuideButton";
		public static final var GuideDragDrop:String = "GuideDragDrop"; 
	}

	class GUILayout
	{
		public static final var Top:String = "Top";
		public static final var Bottom:String = "Bottom";
		public static final var Left:String = "Left";
		public static final var Right:String = "Right";
		public static final var Center:String = "Center";
		
		public static final var TopCenter:String = "TopCenter";
		public static final var BottomCenter:String = "BottomCenter";
		
		public static final var ArrowUpwards:String = "Upwards";
		public static final var ArrowDownwards:String = "Downwards";
		public static final var ArrowLeftwards:String = "Leftwards";
		public static final var ArrowRightwards:String = "Rightwards";
		
		public static final var Wrap:String = "Wrap";
	} 
	
	class RewardsKey
	{
		public static final var Items:String = "Items";
		public static final var ItemId:String = "ItemId";
		public static final var ItemCount:String = "ItemCount";
		
		public static final var Gears:String = "Gears";
		public static final var GearId:String = "GearId";
		public static final var GearCount:String = "GearCount";
		public static final var GearStarLevel:String = "GearStarLevel";
		public static final var GearSkillLevel:String = "GearSkillLevel";
		public static final var GearTierLevel:String = "GearTierLevel";
		public static final var GearSkill1:String = "GearSkill1";
		public static final var GearSkill2:String = "GearSkill2";
		public static final var GearSkill3:String = "GearSkill3";
		public static final var GearSkill4:String = "GearSkill4";
		
		public static final var Knights:String = "Knights";
		public static final var KnightId:String = "KnightId";
		public static final var KnightLevel:String = "KnightLevel";
	}
	
	class FteServerNodeKey
	{
		public static final var Id:String = "Id";
		public static final var PhpName:String = "PhpName";
		public static final var Results:String = "Results";
	}
}