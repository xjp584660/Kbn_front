#pragma strict

class NewFteFakeDataTransmit
{
	public var fteId:int;
	public var conditionType:System.Type;
	
	public var conditionDataObj:System.Object;
	
	public var isDone:boolean = false;
	public var method:Function;
	public var data:System.Object;
}