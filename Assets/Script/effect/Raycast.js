var moveThis : GameObject;
var hit : RaycastHit;
var createThis : GameObject[];
var cooldown : float;
var changeCooldown : float;
var selected:int=0;

private var rndNr:float;
function Start () {

}

function Update () {
if(cooldown>0){cooldown-=Time.deltaTime;}
if(changeCooldown>0){changeCooldown-=Time.deltaTime;}

var ray = Camera.main.ScreenPointToRay (Input.mousePosition);

if (Physics.Raycast (ray, hit)) 
{
// Create a particle if hit
moveThis.transform.position=hit.point;

if(Input.GetMouseButton(0)&&cooldown<=0)
{
	var tmpPrefab:GameObject = createThis[selected] as GameObject;
	Instantiate(createThis[selected], moveThis.transform.position, tmpPrefab.transform.rotation);


	cooldown=0.1;
}



//Instantiate (particle, hit.point, transform.rotation);

}



if (Input.GetKeyDown("space") && changeCooldown<=0)
{
	selected+=1;
		if(selected>(createThis.length-1)) {selected=0;}
	
	changeCooldown=0.1;
}

if (Input.GetKeyDown(KeyCode.UpArrow) && changeCooldown<=0)
{
	selected+=1;
		if(selected>(createThis.length-1)) {selected=0;}

	changeCooldown=0.1;
}

if (Input.GetKeyDown(KeyCode.DownArrow) && changeCooldown<=0)
{
	selected-=1;
		if(selected<0) {selected=createThis.length-1;}
	changeCooldown=0.1;
}




}

function OnGUI()
{
	if(GUI.Button( Rect(30, 360, 200, 80), "Next") && changeCooldown<=0)
	{
		selected+=1;
		if(selected>(createThis.length-1)) {selected=0;}
	}						
}