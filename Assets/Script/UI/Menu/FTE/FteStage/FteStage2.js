#pragma strict

class FteStage2
{
	public static var  m_FTE_Steps:Hashtable = 
	{
		
		"step101":{
			"desc":"",
			"rollStep":"101",
			"nextStep":"201",	
			"showMask":false,
			"textRect":{"x":0, "y":40, "width":640, "height":840},
			"type":"storycard",
			"time2Next":3.0,
			"BI":{"step":200, "slice":20002001},
			"outEffect":
				{
					"type":"fadeout",
					"fa":1.0,
					"ta":0.0,
					"time":2.0
				},
			"uiElements":
			{	
				"1":{"type":"texture","x":-0,"y":0 ,"texturePath":"fte_scene1"},
				"12":{"type":"storetext","textPath": "FTE.NPC_Background_1B",					
					"textAligh":"middlecenter",
					"fontType":"font_big",
					"normal":{"textColor":"FFFFFFFF","background":""}, 
					"rect":{"x":180, "y":50, "width":280, "height":810},
					"timeArr": [0,2,4,6],
					"alphaArr":[0,1,1,0]
				
				},
				"11":{"type":"button", "action":"skip_to_end", "textPath":"Common.Skip",
				 	 "normal":{"background" :"Textures/UI/button/tab_big_normal"}, 
					 "active":{"background" :"Textures/UI/button/tab_big_down"},
					 "rect":{"x":470, "y":10, "width":160, "height":80}, 
					 "fontType":"font_small_bold",
					 "border":{"left":25, "top":12, "right":25, "bottom":12}
				 }
				
			}
		},

	//200 .. MAP
		"step201":{			
			"desc": "",
			"rollStep":"201",
			"nextStep":"301",
			"showMask":true,
			"BI":{"step":200, "slice":20002002},
			"inEffect":
				{
					"type":"fadeout",
					"time":0.5,
					"fa":0,
					"ta":1.0					
				},				
			"uiElements":
			{
				"1":{"type":"texture","belowMask":false,"texturePath":"fte_Arthur_map","w":640,"h":640},
				
				"13":{"type":"npcview","npcPath":"character_Arthur2","bgh":310,"bgy":630},
				"12":{"type":"typingtext", "textPath": "FTE.NPC_Map_1",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":640, "width":210, "height":200} 
				},
				"11":{"type":"bluenext","rect":{"x":480, "y":790}}
				
			}		
		},

		//cottage	
		"step301":{
			"desc": "",
			"rollStep":"",
			"nextStep":"",
			"BI":{"step":200, "slice":20002003},
			"uiElements":
			{
				"1":{"type":"npcview","npcPath":"character_Morgause","bgy":418},
				"12":{"type":"typingtext", "textPath": "FTE.NPC_Cottage_1",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":660, "width":310, "height":200} 
				},	
				//{"type":"light","rect":{"x":455, "y":295, "width":160, "height":110}},
				"11":{"type":"bluenext","rect":{"x":480, "y":790}}
			}
		},
		"step302":{
			"desc": "",
			"rollStep":"301",
			"nextStep":"",
			//"focusCamera":true,
			"focusSlotId":10,
			"BI":{"step":200, "slice":20003002},
			"uiElements":
			{	
				"1":{"type":"npcview","npcPath":"character_Morgause",
					"BI":{"step":200, "slice":20003001},"bgy":418
					},
				"14":{"type":"typingtext", "textPath": "FTE.NPC_Cottage_2",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":660, "width":300, "height":200} 
				},					

				"13":{"type":"button", "action":"next", 
				 	 "normal":{"background" :"??Textures/UI/building/c_999_1_1"}, 
					 "active":{"background" :"??Textures/UI/building/c_999_1_1"},
					 "rect":{"refGameItem":{"objNodeName":"City/10/10/c1_999_1_1"}}, 
					 "border":{"left":25, "top":0, "right":30, "bottom":0}
				 },
				"12":{"type":"light"},	//"rect":{"x":455, "y":347, "width":160, "height":110}},
				"11": {"type":"hand", "pos":1, "rect":{"width":110, "height":210, "refGameItem":{"objNodeName":"City/10/10/c1_999_1_1", "dockType":3}}}
			}
		},
		"step303":{			
			"desc": "",
			"rollStep":"301",
			"nextStep":"",	
			"mask":0,
			"BI":{"step":200, "slice":20003003},
			"inEffect":
				{
					"time":0.5,
					"type":"delay"
				},		
			"uiElements":
			{
				/*
				 
				{"type":"npcview","npcPath":"Textures/UI/FTE/character_Morgause","bgy":625},
				{"type":"typingtext", "textPath": "FTE.NPC_Cottage_3",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":660, "width":300, "height":160} 
				},	*/
				"1":{"type":"button", "action":"next", 
				 	 "normal":{"background" :""}, 
					 "active":{"background":""},
					 
					 "rect":{"x":10, "y":100, "width":610, "height":150}, 
					 "border":{"left":25, "top":0, "right":30, "bottom":0}
				 },
				"12":{"type":"light"},
				"11":{"type":"hand", "pos":1, "rect":{"x":265, "y":210, "width":110, "height":210}}
			}		
		},
		"step304":{			
			"desc": "",
			"rollStep":"301",
			"nextStep":"",
			"mask":0,
			"showNext":false,
			"BI":{"step":200, "slice":20003004},
			"uiElements":
			{
				/*
				{"type":"npcview","npcPath":"Textures/UI/FTE/character_Morgause","bgy":625},
				{"type":"typingtext", "textPath": "FTE.NPC_Cottage_4",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":660, "width":300, "height":160} 
				},	
				*/
				"1":{"type":"button", "textPath": "ModalBuild.ManualBuild", "action":"next", 
				 	"normal":{"background" :"Textures/UI/button/button_60_blue_normalnew"}, 
					 "active":{"background":"Textures/UI/button/button_60_blue_downnew"},
					 "rect":{"x":140, "y":290, "width":200, "height":85}, 
					 "border":{"left":25, "top":0, "right":30, "bottom":0}
				 },
				"12":{"type":"light","rect":{"x":125, "y":275, "width":225, "height":110}},
				"11":{"type":"hand", "pos":1, "rect":{"x":185, "y":360, "width":110, "height":210}}

			}		
		},
		"step305":{			
			"desc": "",
			"rollStep":"401",
			"nextStep":"401",
			"mask":0.2,
			"BI":{"step":200, "slice":20003005},
			"uiElements":
			{
				"1":{"type":"npcview","npcPath":"character_Morgause","bgy":418,"noButton":true},
				"12":{"type":"typingtext", "textPath": "FTE.NPC_Cottage_5",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":510, "width":300, "height":200}
				},
				"11":{"type":"light","group":"__", "rect":{"x":-1, "y":-1, "width":-1, "height":-1, "track":true,
					"refMenuItem":{"menuName":"MainChrom", "uiName":"myCurProgressList", "isPhyPos":true}}}
			}
		},
		//Quest 1
		"step401":{			
			"desc": "",
			"rollStep":"",
			"nextStep":"",
			"BI":{"step":200, "slice":20004001},
			"uiElements":
			{
				"1":{"type":"npcview","npcPath":"character_Morgause","bgy":418,"noButton":true},
				"14":{"type":"typingtext", "textPath": "FTE.NPC_Quest1_1",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":510, "width":300, "height":200} 
				},	
				
				"13":{"type":"button","action":"next","rect":{"x":230,"y":850,"width":110, "height":110, "track":true
						, "refMenuItem":
							{"isPhyPos":true, "menuName":"MainChrom", "uiName":"chromBtnQuest"}
					}},
				"12":{"type":"light"},
				/*{"type":"light","rect":{"x":220,"y":840,"width":120, "height":130, "track":true
						, "refMenuItem":
							{"isPhyPos":true, "menuName":"MainChrom", "uiName":"chromBtnQuest"}
					}},*/
				"11":{"type":"hand", "pos":3, "rect":{"x":230, "y":720, "width":110, "height":210, "track":true
						, "refMenuItem":
							{"isPhyPos":true, "menuName":"MainChrom", "uiName":"chromBtnQuest", "dockType":1}
					}}	
			}		
		},
        "step402":{         
            "desc": "",
            "rollStep":"401",
            "nextStep":"",
            "mask":0,
            "BI":{"step":200, "slice":20004002},
            "inEffect":
                {
                    "time":0.5,
                    "type":"delay"
                },
            "uiElements":
            {
				"1":{"type":"button","action":"next","rect":{"x":5,"y":160,"width":630, "height":170, "track":true
                        , "refMenuItem":
                            {"isPhyPos":true, "menuName":"Mission", "uiName":"btnGoto"}
                    }},
				"12":{"type":"light","rect":{"x":5,"y":160,"width":630, "height":170}},
				"11":{"type":"hand", "pos":1, "rect":{"x":270, "y":280, "width":110, "height":210}}  

            }       
        },
		"step403":{			
			"desc": "",
			"rollStep":"401",
			"nextStep":"405",
			"BI":{"step":200, "slice":20004004},
			"uiElements":
			{
			/*
				{"type":"npcview","npcPath":"character_Morgause",
					"BI":{"step":200, "slice":20004003},"bgy":240},
				{"type":"typingtext", "textPath": "FTE.NPC_Quest1_3",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":300, "width":300, "height":160} 
				},
			*/
				"1":{"type":"button", "textPath": "QuestsModal.GetReward", "action":"next", 
				 	"normal":{"background" :"Textures/UI/button/button_60_blue_normalnew"}, 
					 "active":{"background":"Textures/UI/button/button_60_blue_downnew"},
					 "rect":{"x":190, "y":510, "width":250, "height":85, "track":true
						, "refMenuItem":
							{"isPhyPos":true, "menuName":"Mission", "uiName":"missionItemObj.btnGetReward"}
							}, 
					 "border":{"left":25, "top":0, "right":30, "bottom":0}
				 },

				"12":{"type":"light"},
				"11":{"type":"hand", "pos":3, "rect":{"x":270, "y":320, "width":110, "height":210, "track":true
						, "refMenuItem":
							{"isPhyPos":true, "menuName":"Mission", "uiName":"missionItemObj.btnGetReward", "dockType":1}
					}}	
			}
		},
		/*
		"step404":{			
			"desc": "",
			"rollStep":"401",
			"nextStep":"",
			"uiElements":
			{
				{"type":"npcview","npcPath":"Textures/UI/FTE/character_Morgause","bgy":418},
				{"type":"typingtext", "textPath": "FTE.NPC_Quest1_4",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":660, "width":300, "height":200} 
				},	
				{"type":"button","action":"next","rect":{"x":5,"y":195,"width":630, "height":80}},
				{"type":"light"},
				{"type":"hand", "pos":1, "rect":{"x":270, "y":250, "width":110, "height":210}}	
			}		
		},
		*/
		"step405":{			
			"desc": "",
			"rollStep":"501",
			"nextStep":"501",
			"BI":{"step":200, "slice":20004005},
			"uiElements":
			{
			/*
				{"type":"npcview","npcPath":"character_Morgause",
					"noButton":true,
					"bgy":240
					
				},
				{"type":"typingtext", "textPath": "FTE.NPC_Quest1_5",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":300, "width":300, "height":160} 
				},	
			*/
				"1":{"type":"button", "textPath": "", "action":"next", 
				 	"normal":{"background" :"Textures/UI/button/button_home_normal"}, 
					 "active":{"background":"Textures/UI/button/button_home_down"},
					 "rect":{"x":5, "y":0, "width":84, "height":85}, 
					 "border":{"left":25, "top":0, "right":30, "bottom":0}
				 },
				"12":{"type":"light","rect":{"x":-5, "y":-10, "width":105, "height":105}},
				"11":{"type":"hand", "pos":2, "rect":{"x":85, "y":0, "width":210, "height":110}}	
			}		
		},
		
		//view switch.
		"step501":{	
			"desc": "",
			"rollStep":"",
			"nextStep":"601",
			"BI":{"step":200, "slice":20005002},
			"uiElements":
			{
				"1":{"type":"npcview","npcPath":"character_Morgause",
					"BI":{"step":200, "slice":20005001},
					"bgy":418},
				"14":{"type":"typingtext", "textPath": "FTE.NPC_VIewSwitch_1",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":510, "width":300, "height":160} 
				},
				"13":{"type":"button","action":"next","rect":{"x":0,"y":850,"width":120, "height":110, "track":true
					, "refMenuItem":
						{"isPhyPos":true, "menuName":"MainChrom", "uiName":"btnSwitchView"}
					}
				},
				"12":{"type":"light"},
				"11":{"type":"hand", "pos":2, "rect":{"x":100, "y":850, "width":210, "height":110, "track":true
					, "refMenuItem":
						{"isPhyPos":true, "menuName":"MainChrom", "uiName":"btnSwitchView", "dockType":2}
					}}
			}
		},
		//Farm
		"step601":{			
			"desc": "",
			"rollStep":"601",
			"nextStep":"",
			//"focusCamera":true,
			"focusSlotId":100,	//Slot_Farm
			"mask":0,	// set to 0 
			"BI":{"step":200, "slice":20006002},
			"uiElements":
			{
				"1":{"type":"npcview","npcPath":"character_Morgause",
					"BI":{"step":200, "slice":20006001},
					"bgy":418},
				"14":{"type":"typingtext", "textPath": "FTE.NPC_Farm_1",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":660, "width":300, "height":160} 
				},	
				"13":{"type":"button", "action":"next", 
				 	 "normal":{"background" :""}, 
					 "active":{"background":""},
					 "rect":{"track":true, "refGameItem":{"objNodeName":"Field/100/100/f1_1_1_1"}}, 
					 "border":{"left":25, "top":0, "right":30, "bottom":0}
				 },
				"12":{"type":"light"},
				"11": {"type":"hand", "pos":1, "rect":{"track":true, "width":110, "height":210, "refGameItem":{"objNodeName":"Field/100/100/f1_1_1_1", "dockType":3}}}
			}
		},
		"step602":{			
			"desc": "",
			"rollStep":"601",
			"nextStep":"",
			"mask":0,
			"BI":{"step":200, "slice":20006003},
			"inEffect":
				{
					"time":0.5,
					"type":"delay"
				},
			"uiElements":
			{
				/*
				{"type":"npcview","npcPath":"Textures/UI/FTE/character_Morgause","bgy":418},
				{"type":"typingtext", "textPath": "FTE.NPC_Farm_2",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":660, "width":300, "height":160} 
				},
				*/	
				"13":{"type":"button", "textPath": "ModalBuild.ManualUpgrade", "action":"next", 
				 	"normal":{"background" :"Textures/UI/button/button_60_blue_normalnew"}, 
					 "active":{"background":"Textures/UI/button/button_60_blue_downnew"},
					 "fontType":"font_middle_bold",
					 "rect":{"x":145, "y":325, "width":205, "height":85}, 
					 "padding":{"right":5, "bottom":5 },
					 "border":{"left":23, "top":0, "right":28, "bottom":0}
				 },
				"12":{"type":"light"},
				"11":{"type":"hand", "pos":1, "rect":{"x":180, "y":380, "width":110, "height":210}}

			}		
		},
		
		"step603":{			
			"desc": "",
			"rollStep":"601",
			"nextStep":"",
			"BI":{"step":200, "slice":20006004},
			"data":{"slotId":22},
			//"BI":{"step":200, "slice":20009007},
			"nextSteps":{"1":705,"2":607},
			"time2Next": 2,
			"uiElements":
			{
				"1":{"type":"light","group":"__", "rect":{"x":140, "y":718, "width":510, "height":85, "track":true,
					"refMenuItem":{"menuName":"MainChrom", "uiName":"myCurProgressList", "isPhyPos":true}
					}}
				//{"type":"hand", "group":"", "pos":1, "rect":{"x":520, "y":780, "width":110, "height":210}}
			}
		},
		
		//speed UP.
		"step604":{			
			"desc": "",
			"rollStep":"601",
			"nextStep":"",
			"BI":{"step":200, "slice":20006005},
			"nextSteps":{"1":607},
			//"time2Next": 2,
			"uiElements":
			{
			//*

				"1":{"type":"npcview","npcPath":"character_Morgause",
					"BI":{"step":200, "slice":20010001},
					"bgy":418},
				"14":{"type":"typingtext", "textPath": "FTE.NPC_SpeedUP_1B",
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":510, "width":300, "height":160} 
				},

				"13":{"type":"button","action":"next","rect":{"x":510, "y":710, "width":140, "height":90, "track":true,
					 		"refMenuItem":{"menuName":"MainChrom", "uiName":"myCurProgressList.getItem(0).btnSelect", "isPhyPos":true}
					 	}},
				"12":{"type":"light"},
				"11":{"type":"hand", "pos":0, "rect":{"width":210, "height":110, "track":true,
					 		"refMenuItem":{"menuName":"MainChrom", "uiName":"myCurProgressList.getItem(0).btnSelect", "isPhyPos":true, "dockType":4}
					 	}}
			//*/
			}
		},
		"step605":{
			"desc": "",
			"rollStep":"601",
			"nextStep":"705",
			"BI":{"step":200, "slice":20006006},
			"nextSteps":{"1":607},
			"showMask":false,
			"inEffect":
				{
					"time":0.5,
					"type":"delay"
				},

			"uiElements":
			{
				/*
				{"type":"npcview","npcPath":"Textures/UI/FTE/character_Morgause","bgy":560},
				{"type":"typingtext", "textPath": "FTE.NPC_SpeedUP_2",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":510, "width":300, "height":160} 
				},	
				*/
				"1":{"type":"button", "textPath": "Common.Use_button", "action":"next", 
				 		"normal":{"background" :"Textures/UI/button/button_60_blue_normalnew"}, 
						 "active":{"background":"Textures/UI/button/button_60_blue_downnew"},
						 "rect":{"x":385, "y":327, "width":195, "height":85, "track":true,
						 	"refMenuItem":{"menuName":"SpeedUpMenu", "uiName":"listView.GetItem(0).btnSelect", "isPhyPos":true}
						 	}, 
						 "border":{"left":25, "top":0, "right":30, "bottom":0},
						 "fontType":"font_middle_bold"
				},
				"11":{"type":"light"},
				"12":{"type":"hand", "pos":0, "rect":{"x":170, "y":319, "width":210, "height":110, "track":true,
						 	"refMenuItem":{"menuName":"SpeedUpMenu", "uiName":"listView.GetItem(0).btnSelect", "isPhyPos":true, "dockType":4}
						 }
				}
			}
		},

		"step607":
		{			
			"desc": "",
			"rollStep":"601",
			"nextStep":"705",

			"time2Next":1,
			"uiElements":
			{
				
			}		
		}, 
		
		"step705":{
			"rollStep":901,
			"nextStep":901,
			"BI":{"step":200, "slice":20008002},
			"uiElements":
			{
				"1":{"type":"npcview","npcPath":"character_Morgause",
					"BI":{"step":200, "slice":20008001},
					"bgy":418},
				"14":{"type":"typingtext", "textPath": "FTE.NPC_Quest2_5",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":300, "width":300, "height":160} 
				},
				
				"13":{"type":"button","action":"next","rect":{"x":60,"y":230,"width":240, "height":130, "refGameItem":{"objNodeName":"Field/Castle/1000/f1_0_1_1"}}}, 
				"12":{"type":"light"},
				"11":{"type":"hand", "pos":1, "rect":{"x":130, "y":360, "width":110, "height":210, "refGameItem":{"objNodeName":"Field/Castle/1000/f1_0_1_1", "dockType":3}}}	
				/*	
				{"type":"button","action":"next","rect":{"x":0,"y":850,"width":120, "height":110}},
				{"type":"light","rect":{"x":-5,"y":850,"width":120, "height":110}},
				{"type":"hand", "pos":2, "rect":{"x":100, "y":850, "width":210, "height":110}}
				*/
			}
		},
		
		//research.
		"step901":{			
			"desc": "",
			"rollStep":"",
			"nextStep":"",
			//"focusCamera":true,
			"focusSlotId":2,	//slot_academy
			"BI":{"step":200, "slice":20009002},
			"uiElements":
			{
				"1":{"type":"npcview","npcPath":"character_Morgause",
					"BI":{"step":200, "slice":20009001},
					"bgy":418},
				"14":{"type":"typingtext", "textPath": "FTE.NPC_Research_1",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":640, "width":300, "height":200} 
				},
				"13":{"type":"button", "action":"next", 
				 	 "normal":{"background":""}, 
					 "active":{"background":""},
					 "rect":{"track":true, "x":363, "y":225, "width":160, "height":145, "refGameItem":{"objNodeName":"City/2/2/c1_11_1_1"}}, 
					 "border":{"left":25, "top":0, "right":30, "bottom":0}
				 },
				"12":{"type":"light"},
				"11":{"type":"hand", "pos":1, "rect":{"track":true, "x":385, "y":350, "width":110, "height":210, "refGameItem":{"objNodeName":"City/2/2/c1_11_1_1", "dockType":3}}}
			}		
		},
		"step902":{			
			"desc": "",
			"rollStep":"901",
			"nextStep":"",
			"BI":{"step":200, "slice":20009004},
			"data":{"slotId":2},
			"uiElements":
			{
				"1":{"type":"npcview","npcPath":"character_Morgause",
					"BI":{"step":200, "slice":20009003},
					"bgh":290,"bgy":418},
				"14":{"type":"typingtext", "textPath": "FTE.NPC_Research_2",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":640, "width":300, "height":200} 
				},
				"13":{"type":"button", "action":"next", 
				 	 "normal":{"background":""}, 
					 "active":{"background":""},
					 "rect":{"x":315, "y":95, "width":310, "height":65}, 
					 "border":{"left":25, "top":0, "right":30, "bottom":0}
				 },
				"12":{"type":"light"},
				"11":{"type":"hand", "pos":1, "rect":{"x":410, "y":140, "width":110, "height":210}
				}
			}		
		},
		"step903":{			
			"desc": "",
			"rollStep":"901",
			"nextStep":"",
			"BI":{"step":200, "slice":20009005},
			"mask":0,
			"uiElements":
			{	/*
				{"type":"npcview","npcPath":"Textures/UI/FTE/character_Morgause","bgh":290,"bgy":590},
				{"type":"typingtext", "textPath": "FTE.NPC_Research_3",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":640, "width":300, "height":160} 
				},	**/
				"1":{"type":"button", "action":"next", 
				 	 "normal":{"background":""}, 
					 "active":{"background":""},
					 "rect":{"x":20, "y":170, "width":600, "height":140}, 
					 "border":{"left":25, "top":0, "right":30, "bottom":0}
				 },
				"11": {"type":"light"},
				"12": {"type":"hand", "pos":1, "rect":{"x":260, "y":290, "width":110, "height":210}}
			}		
		},
		"step904":{			
			"desc": "",
			"rollStep":"901",
			"nextStep":"",
			"mask":0,
			"BI":{"step":200, "slice":20009006},
			"showNext":false,
			"uiElements":
			{	/*
				{"type":"npcview","npcPath":"Textures/UI/FTE/character_Morgause","bgh":290,"bgy":590},
				{"type":"typingtext", "textPath": "FTE.NPC_Research_4",					
					"textAligh":"upperleft",
					"normal":{"textColor":"FF452F18","background":""}, 
					"rect":{"x":300, "y":640, "width":300, "height":160} 
				},	*/
				"13":{"type":"button", "action":"next","textPath":"Common.Research", 
				 	 "normal":{"background" :"Textures/UI/button/button_60_blue_normalnew"}, 
					 "active":{"background":"Textures/UI/button/button_60_blue_downnew"},
					"rect":{"x":100, "y":305, "width":210, "height":85, "track":true,
							"refMenuItem":
								{"menuName":"AcademyBuilding", "uiName":"technologyContent.btn_research", "isPhyPos":true}
						},  
					 "border":{"left":25, "top":0, "right":30, "bottom":0}
				 },
				"21":{"type":"light"},
				"11":{"type":"hand", "pos":2, "rect":{"x":320, "y":310, "width":210, "height":110, "track":true,
							"refMenuItem":
								{"menuName":"AcademyBuilding", "uiName":"technologyContent.btn_research", "isPhyPos":true, "dockType":2}
							}}				
			}
		},
		"step905":{
			"desc": "",
			"rollStep":"901",
			"nextStep":"1101",
			"BI":{"step":200, "slice":20009007},
			"nextSteps":{"1":1101,"2":1201},
			"time2Next": 5,
			"uiElements":
			{
				"11":{"type":"light","group":"__", "rect":{"x":140, "y":718, "width":510, "height":85, "track":true,
					"refMenuItem":{"menuName":"MainChrom", "uiName":"myCurProgressList", "isPhyPos":true}
					}}
				//{"type":"hand", "group":"", "pos":1, "rect":{"x":520, "y":780, "width":110, "height":210}}
			}
		},
		//end search
		
		//LEVEL UP
		"step1101":{			
				"desc": "",
				"rollStep":"1101",
				"nextStep":"1102",
				"mask":0.25,
				"BI":{"step":200, "slice":20011001},
				"inEffect":
				{
					"time":0.8,
					"type":"delay"
				},
				"uiElements":
				{
				///*
					"1":{"type":"npcview","npcPath":"character_Morgause",
						"BI":{"step":200, "slice":20011002},
						"bgy":560},
					"14":{"type":"typingtext", "textPath": "FTE.NPC_LevelUP_1",					
						"textAligh":"upperleft",
						"normal":{"textColor":"FF452F18","background":""}, 
						"rect":{"x":300, "y":760, "width":300, "height":160} 
					},
				//*/
					"13":{"type":"button", "textPath": "fortuna_gamble.win_claimButton", "action":"next", 
				 		"normal":{"background" :"Textures/UI/button/button_60_blue_normalnew"}, 
						 "active":{"background":"Textures/UI/button/button_60_blue_downnew"},
						 "rect":{"x":224, "y":485, "width":212, "height":85}, 
						 "border":{"left":25, "top":0, "right":30, "bottom":0}
					 },
					"12":{"type":"light"},
					"11": {"type":"hand", "pos":1, "rect":{"x":270, "y":560, "width":110, "height":210}}
				}
			},

		"step1102":{			
				"desc": "",
				"rollStep":"1101",
				"nextStep":"1201",	
				"BI":{"step":200, "slice":20011003},
				"mask":0,
				"inEffect":
				{
					"time":0.5,
					"type":"delay"
				},
			
				"uiElements":
				{
					/**
					{"type":"npcview","npcPath":"Textures/UI/FTE/character_Morgause","bgy":450},
					{"type":"typingtext", "textPath": "FTE.NPC_LevelUP_3",					
						"textAligh":"upperleft",
						"normal":{"textColor":"FF452F18","background":""}, 
						"rect":{"x":300, "y":520, "width":300, "height":160} 
					},
					**/	
					"13":{"type":"button", "textPath": "Common.OK_Button", "action":"next", 
				 		"normal":{"background" :"Textures/UI/button/button_60_blue_normalnew"}, 
						 "active":{"background":"Textures/UI/button/button_60_blue_downnew"},
						 "rect":{"x":224, "y":822, "width":212, "height":85}, 
						 "border":{"left":25, "top":0, "right":30, "bottom":0}
					 },
					"12":{"type":"light"},
					"11":{"type":"hand","pos":3, "rect":{"x":270, "y":630, "width":110, "height":210}}

				}		
			}, // end level up
			
	// Items use.
		"step1201":{			
				"desc": "",
				"rollStep":"",
				"nextStep":"",
				"BI":{"step":200, "slice":20012002},
				"uiElements":
				{
					"1":{"type":"npcview","npcPath":"character_Morgause",
						//"BI":{"step":200, "slice":20012001},
						"bgy":448, "noButton":true},
					"12":{"type":"typingtext", "textPath": "FTE.NPC_Items_1",					
						"textAligh":"upperleft",
						"normal":{"textColor":"FF452F18","background":""}, 
						"rect":{"x":300, "y":520, "width":300, "height":200} 
					},	

					"13":{"type":"button","action":"next","rect":{"x":140,"y":850,"width":110, "height":110, "track":true
						, "refMenuItem":{"menuName":"MainChrom", "uiName":"chromBtnShop", "isPhyPos":true}
						}
					},
					"14":{"type":"light"},
					"11":{"type":"hand", "pos":2, "rect":{"x":240, "y":850, "width":210, "height":110, "track":true
						, "refMenuItem":{"menuName":"MainChrom", "uiName":"chromBtnShop", "isPhyPos":true, "dockType":2}
						}
					}							
				}		
			},
		"step1202":{			
				"desc": "",
				"rollStep":"1201",
				"BI":{"step":200, "slice":20012004},
				"nextStep":"",
				"uiElements":
				{
					"1":{"type":"npcview","npcPath":"character_Morgause",
						"BI":{"step":200, "slice":20012003},
						"bgy":448},
					"14":{"type":"typingtext", "textPath": "FTE.NPC_Items_2",					
						"textAligh":"upperleft",
						"normal":{"textColor":"FF452F18","background":""}, 
						"rect":{"x":300, "y":520, "width":300, "height":160} 
					},	

					"13":{"type":"button","action":"next","rect":{"x":323,"y":85,"width":300, "height":60}},
					"12":{"type":"light"},
					"11":{"type":"hand", "pos":1, "rect":{"x":410, "y":140, "width":110, "height":210}}	
				}
			},
		"step1203":{			
				"desc": "",
				"rollStep":"1201",
				"nextStep":"",
				"BI":{"step":200, "slice":20012005},
				"mask":0,
				"uiElements":
				{
					/*
					{"type":"npcview","npcPath":"Textures/UI/FTE/character_Morgause","bgy":450},
					{"type":"typingtext", "textPath": "FTE.NPC_Items_3",					
						"textAligh":"upperleft",
						"normal":{"textColor":"FF452F18","background":""}, 
						"rect":{"x":300, "y":520, "width":300, "height":160} 
					},	
					*/
					"1":{"type":"button","action":"next","rect":{"x":498,"y":175,"width":115, "height":55}},
					"12":{"type":"light"},
					"11":{"type":"hand", "pos":1, "rect":{"x":490, "y":220, "width":110, "height":210}}	
	
				}		
			},
		"step1204":{			
				"desc": "",
				"rollStep":"1201",
				"nextStep":"1301",
				"BI":{"step":200, "slice":20012007},
				"uiElements":
				{
					"1":{"type":"npcview","npcPath":"character_Morgause",
						"BI":{"step":200, "slice":20012006},
						"bgy":448, "noButton":true},
					"14":{"type":"typingtext", "textPath": "FTE.NPC_Items_4",					
						"textAligh":"upperleft",
						"normal":{"textColor":"FF452F18","background":""}, 
						"rect":{"x":300, "y":520, "width":300, "height":160} 
					},	

					"13":{"type":"button", "textPath": "Common.Use_button", "action":"next", 
				 		"normal":{"background" :"Textures/UI/button/button_60_blue_normalnew"}, 
						 "active":{"background":"Textures/UI/button/button_60_blue_downnew"},
						 "rect":{"x":470, "y":270, "width":140, "height":80},
						 "border":{"left":30, "top":40, "right":30, "bottom":40},
						 "padding":{"left":0, "top":0, "right":5, "bottom":5},
						 "fontType":"Font_20"
					 },
					"12":{"type":"light"},
					"11":{"type":"hand", "pos":0, "rect":{"x":240, "y":270, "width":210, "height":110}}
	
				}		
			}, // end item use 
		// END 
		"step1301":{			
				"desc": "",
				"rollStep":"1301",
				"nextStep":"",
				"BI":{"step":200, "slice":20013001},
				"time2Next": 0.1,
				"uiElements":
				{
				/*
					{"type":"npcview","npcPath":"character_Morgause","bgh":348,"bgy":310},
					{"type":"typingtext", "textPath": "FTE.NPC_End_1",					
						"textAligh":"upperleft",
						"normal":{"textColor":"FF452F18","background":""}, 
						"rect":{"x":300, "y":495, "width":300, "height":240} 
					}//,
					//{"type":"bluenext","rect":{"x":480, "y":680}}
				*/	
				}		
			},
		/*
		"step1302":{			
				"desc": "",
				"rollStep":"",
				"nextStep":"1303",
				"BI":{"step":200, "slice":20013002},
				"uiElements":
				{
					{"type":"npcview","npcPath":"character_Morgause","bgh":348,"bgy":310},
					{"type":"typingtext", "textPath": "FTE.NPC_End_2",					
						"textAligh":"upperleft",
						"normal":{"textColor":"FF452F18","background":""}, 
						"rect":{"x":300, "y":495, "width":300, "height":240} 
					}//,
					//{"type":"bluenext","textPath":"FTE.GO","rect":{"x":480, "y":680}}

	
				}		
			},
		*/
		"step1302":{			
				"desc": "",
				"rollStep":"",
				"nextStep":"",
				"BI":{"step":200, "slice":20013002},
				"uiElements":
				{
					"1":{"type":"npcview","npcPath":"character_Morgause","bgh":348,"bgy":310},
					"12":{"type":"typingtext", "textPath": "FTE.NPC_End_2B",					
						"textAligh":"upperleft",
						"normal":{"textColor":"FF452F18","background":""}, 
						"rect":{"x":300, "y":495, "width":300, "height":240} 
					},					
					"11":{"type":"button", "textPath": "Common.Play", "action":"next", 
				 		"normal":{"textColor":"FF452F18", "background" :"Textures/UI/button/button_60_play_normal"}, 
						 "active":{"textColor":"FF452F18", "background":"Textures/UI/button/button_60_play_down"},
						 "rect":{"x":0, "y":0, "width":200, "height":85}, 
						 "border":{"left":25, "top":0, "right":30, "bottom":0},
						 "group":"npc",
						 "fontType":"font_big_bold"
					 }
					//{"type":"bluenext","textPath":"FTE.GO","rect":{"x":480, "y":680}}

	
				}		
			},	
		"step1303":{			
				"desc": "",
				"rollStep":"",
				"nextStep":"9999",
				"BI":{"step":200, "slice":20013003},
				"time2Next": 0.1,
				"uiElements":
				{
				}		
			},
		"step9999":{
			"desc":"Complete",
			"rollStep":9999,
			"nextStep":9999,
			"BI":{"step":200, "slice":0},
			"showMask":false,
			"uiElements":
			{
				"11":{"type":"end","a1":0.5, "a2":1, "a3":0, "t12":2, "t23":4}
			}
		}	
			
		
		//
	
		//end  step
	};
			

}
