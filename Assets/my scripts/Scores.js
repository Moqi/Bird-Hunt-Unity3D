public var birdsLeft:int;
var pauseFlag : boolean;
var font: Font;
var timer: float;
var completeTime:float; 



function Start(){
	birdsLeft=8; 
	timer = 360.0f;
	pauseFlag=true;   
}  
 
function Update(){ 
	if(birdsLeft>0){
		timer -=  Time.deltaTime;
	}
	if(birdsLeft==0){
		completeTime = 360.0f - timer;
	} 
 
}
  
function OnGUI(){    
  
	GUI.skin.font=font; 
	GUI.color=Color.red; 
	GUI.Label(Rect(10,10,140,50),"Birds Left: " +birdsLeft);
	if(birdsLeft==0){  
		GUI.Label(Rect(Screen.width/2+10-50,Screen.height/2-125,100,50),"Victory!!!");
		GUI.Label (Rect(Screen.width/2-25-60, Screen.height/2-85, 300, 50), " Your Time: " +completeTime.ToString("f1"));
		GameObject.Find("Player").SendMessage("PauseGame",1);
		pauseFlag=true;
		if(GUI.Button(Rect(Screen.width/2-50,Screen.height/2-30,100,50),"Restart")){
			Application.LoadLevel("scene0");
		}	  
	}  
	if(GUI.Button(Rect(Screen.width-60,10,50,50),"Quit")){
			Application.Quit();
	}  
	if(GUI.Button(Rect(Screen.width-130,10,65,50),"Pause")){
		if(pauseFlag){
			GameObject.Find("Player").SendMessage("PauseGame",0);
			pauseFlag=false; 
		}  
		else{
			GameObject.Find("Player").SendMessage("PauseGame",1);
			pauseFlag=true;
		}
	} 
	if(timer >0){
		GUI.Label(new Rect (Screen.width/2-50, 10, 100, 60), ""+timer.ToString("f1"));
	}
	else{
		GUI.Label(Rect(Screen.width/2-50,Screen.height/2-85,100,50),"You Failed");
		GameObject.Find("Player").SendMessage("PauseGame",1);
		pauseFlag=true;
		if(GUI.Button(Rect(Screen.width/2-50,Screen.height/2-30,100,50),"Restart")){
			Application.LoadLevel("scene0");
		}
	}
}

function updateScores(){
	birdsLeft-=1;
}

