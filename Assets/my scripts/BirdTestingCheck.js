var radius : int =3;  
var frontRay : RaycastHit;
var leftRay : RaycastHit;
var rightRay : RaycastHit;
var downRay : RaycastHit;
var upRay : RaycastHit;
var landPoint : Transform;
var direction : String; 	//1=rotate left, 2= rotate right, 3=tilt up, 4=tilt down, 5=Go Straight, 6 = Land when near to land point, 7 = start landing from a height 
var directionString : String;
var landFlag : boolean; 
var flyFlag : boolean = true;  
var angle : float;    
var changeRandomDirectionAtTime : float = 20.0;
var randomDirectionTimePassed : float = 0.0; 
var flyTime : float = 20.0;
var idleTime : float = 0.0;  
var newUpdateTime : float = 150.0;
var newTime : float = 0.0; 
var landDirection : String; 
var newChangeAnimationTime : float = 5.0;
var changeAnimationTime : float = 0.0; 
var changeAnimationFlag:boolean=true;
var transformPosition : Vector3;
var currentPosition: Vector3;  
var gos : GameObject[];   
  
function Start(){     
	direction="straight";
	//directionString="straight";
	//DirectionStringToInteger();  
	landDirection=null;  
	//angle=30.0; // setting default angle to turn on direction change.
	randomDirectionTimePassed=Time.time + changeRandomDirectionAtTime; // setting 1st random direction change time
	//idleTime=Time.time + Random.Range(20.0,50.0); // setting 1st land idle time
	newUpdateTime=Mathf.Abs(Random.Range(150,200));
	newTime=Time.time + newUpdateTime;       
	//newTime=Time.time + 10;      
	gos = GameObject.FindGameObjectsWithTag("LandPoint");  
	changeAnimationTime=5;
	  
}  
function Update () {   
	transformPosition=transform.position;//+Vector3(0,-0.5,0);     
	Fly();  
	RadiusCheck();     
}  
function OnCollisionEnter(theCollision : Collision){
	if(theCollision.gameObject.name=="FireBullet(Clone)"){
		BirdHit();
	}	
} 
function BirdHit(){
	if(flyFlag || landFlag){  
			flyFlag=false; 
			landFlag=false;
			animation.Play("die"); 
			transform.eulerAngles =  new Vector3(0, transform.eulerAngles.y, transform.eulerAngles.z);
			transform.rigidbody.useGravity=true;
			transform.rigidbody.constraints =RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
			Destroy(gameObject,10); 
			GameObject.Find("Scores").SendMessage("updateScores");
		}
}
function DirectionIntegerToString(i:int){
	if(i==1)
		direction="left";
	else if(i==2)
		direction="right";
	else if(i==3)
		direction="up";
	else if(i == 4)
		direction="down";
	else if(i==5)
		direction="straight";	
	else if(i==6)
		direction="land";
	else if(i==7)
		direction="start-land";
}
 
function Fly(){ 
	var rotation;   
	var directionToMove : Vector3 ; 
	//if bird is flying
	if(flyFlag){    
		if(direction!="land" && landDirection !="start-land"){
			if(changeAnimationFlag){
				animation.Play("fly-wings");
			}
			else{ 
				animation.Play("fly-tail");
			} 
			if(Time.time>changeAnimationTime){
				if(changeAnimationFlag){
					changeAnimationFlag=false;
					newChangeAnimationTime=Mathf.Abs(Random.Range(2,5));
					changeAnimationTime=Time.time+newChangeAnimationTime;
				}
				else{
					changeAnimationFlag=true;
					newChangeAnimationTime=Mathf.Abs(Random.Range(5,10));
					changeAnimationTime=Time.time+newChangeAnimationTime;
				}
			}	 
			transform.Translate(Vector3.forward*Time.deltaTime*6); 
		}
		
		if(Time.time > randomDirectionTimePassed){
			randomDirectionTimePassed=Time.time + changeRandomDirectionAtTime;
			if(landDirection!=7){
				changeRandomDirectionAtTime=Mathf.Abs(Random.Range(15,20));
				
				DirectionIntegerToString(Mathf.Abs(Random.Range(1,5)));
				if(direction=="down"){
					direction="up"; 
				}   
			}      
		}                
		if(Time.time>newTime){            
			newUpdateTime=Mathf.Abs(Random.Range(150,200));
			newTime=Time.time + newUpdateTime;    
		    var distance = Mathf.Infinity;       
		    var position = transform.position;  
		    // Iterate through them and find the closest one
		    for (var go : GameObject in gos)  { 
		        var diff = (go.transform.position - position);
		        var curDistance = diff.sqrMagnitude; 
		        if (curDistance < distance) {  
		            landPoint = go.transform; 
 		            distance = curDistance;  
		        }            
		    }                
			randomDirectionTimePassed=Time.time + 30;      
			transform.LookAt(landPoint);
			transform.eulerAngles =  new Vector3(transform.eulerAngles.x-30, transform.eulerAngles.y, transform.eulerAngles.z);  
			landDirection="start-land";         
		}   
		if(direction==1){ 
			angle=0.25; 
			transform.Rotate(-Vector3.up,angle, Space.Self);  
			yield WaitForSeconds(2);
			direction="straight";   
		}  
		if(direction=="right"){ 
			angle=0.25; 
			transform.Rotate(Vector3.up,angle, Space.Self);
			yield WaitForSeconds(2);
			direction="straight"; 
		}
		if(direction=="up"){ 
				angle=0.5;
				transform.Rotate(-Vector3.right,angle,Space.Self);
				yield WaitForSeconds(2);
				if(direction!="up"){
					angle=0.5;
	 				transform.Rotate(Vector3.right,angle,Space.Self);
				} 
				direction="straight";
		}     
		if(direction=="down"){ 
				angle=0.4; 
				transform.Rotate(Vector3.right,angle, Space.Self);
				yield WaitForSeconds(3);
				if(direction!="down"){  
					angle=0.4;
					transform.Rotate(-Vector3.right,angle, Space.Self);
				}   
				direction="straight";   
		}  
		if(direction=="land"){ 
			angle=0.07;
			transform.Rotate(-Vector3.right,angle,Space.Self);
			transform.Translate(Vector3.forward*Time.deltaTime*4); 
			if(downRay.collider!= "LandPoint"){
				direction = "up";      
				transform.eulerAngles =  new Vector3(0.0, 0.0, 0.0);  
				randomDirectionTimePassed=Time.time + 5;
			}  
		}     
		if(landDirection=="start-land"){      
			if(changeAnimationFlag){
				animation.Play("fly-wings");
			}
			else{ 
				animation.Play("fly-tail");
			} 
			if(Time.time>changeAnimationTime){
				if(changeAnimationFlag){
					changeAnimationFlag=false;
					newChangeAnimationTime=Mathf.Abs(Random.Range(2,5));
					changeAnimationTime=Time.time+newChangeAnimationTime;
				}
				else{
					changeAnimationFlag=true;
					newChangeAnimationTime=Mathf.Abs(Random.Range(5,10));
					changeAnimationTime=Time.time+newChangeAnimationTime;
				}
			} 
			currentPosition=transform.position; 
			transform.position = Vector3(Mathf.MoveTowards(currentPosition.x, landPoint.position.x, 2 * Time.deltaTime),Mathf.MoveTowards(currentPosition.y, landPoint.position.y, 2 * Time.deltaTime),Mathf.MoveTowards(currentPosition.z, landPoint.position.z, 2 * Time.deltaTime));
			
			if(downRay.collider != null){     
				if(downRay.distance<1.5){  
					idleTime=Time.time + flyTime;    
					landFlag=true;  
					flyFlag=false;  
				}  
			} 
		} 
		//transform.eulerAngles =  new Vector3(transform.eulerAngles.x, transform.eulerAngles.y, 0.0);
	}     
	else if(landFlag){ // bird will land

		direction="land";   
		landDirection=null;  
		if(direction=="land"){           
			if(downRay.distance>0.5  && downRay.distance<0.7){ 
				animation.CrossFade("fly-land");   
				transform.Translate(Vector3.forward*Time.deltaTime); 
		 		transform.Rotate(Vector3.right,0.08,Space.Self); 
	   
			}         
			else if(downRay.distance<0.5){    
				transform.rigidbody.useGravity=true; 
				transform.rigidbody.constraints = RigidbodyConstraints.FreezePositionX  | RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
				//transform.eulerAngles =  new Vector3(0.0, 0.0, 0.0); 
				transform.eulerAngles =  new Vector3(0.0,transform.eulerAngles.y, 0.0);
				animation.CrossFade("idle");   
				if(Time.time > idleTime){ 
					transform.rigidbody.useGravity=false;
					transform.rigidbody.constraints = RigidbodyConstraints.FreezePositionX  | RigidbodyConstraints.FreezePositionY |RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
					transform.position = Vector3(transform.position.x,transform.position.y+1,transform.position.z);
					animation.CrossFade("fly-start"); 
					idleTime=Time.time + flyTime;
					flyTime=Mathf.Abs(Random.Range(15,20));
					landFlag=false;
					flyFlag=true;
					randomDirectionTimePassed+=20;
				}
			}	  
			else{   
				animation.Play("fly-wings");    
				transform.Translate(Vector3.forward*Time.deltaTime*2); 
				transform.Rotate(Vector3.right,0.08,Space.Self);
			}  
		}
	}  
}    
function RadiusCheck(){
	Debug.DrawRay(transformPosition,transform.forward*radius*2,Color.blue);
	if(Physics.Raycast(transformPosition,transform.forward,frontRay,radius*2)){
		DirectionIntegerToString(Mathf.Abs(Random.Range(1,3)));  
		if(frontRay.collider.name == "wall"){
			direction="straight";
			angle=180; 
			transform.Rotate(Vector3.up,angle, Space.Self);
		}
	}
	
	Debug.DrawRay(transformPosition,transform.right*radius,Color.magenta);
	if(Physics.Raycast(transformPosition,transform.right,rightRay,radius)){
		direction="left";
	} 
 
	Debug.DrawRay(transformPosition,-transform.right*radius,Color.yellow);
	if(Physics.Raycast(transformPosition,-transform.right,leftRay,radius)){
		angle=Mathf.Abs(Random.Range(20,30));
		direction="right";   
	} 
	Debug.DrawRay(transformPosition,-transform.up*radius*3,Color.red);
	if(Physics.Raycast(transformPosition,-transform.up,downRay,radius*3)){
		//Debug.Log(downRay.collider); 
		if(downRay.collider.name == "LandPoint"){// && direction < "straight"){
		 			direction="land";
					idleTime=Time.time + flyTime; // setting land idle time
					flyFlag=false;  
	 				landFlag=true;      
		}  
	} 
	   
	Debug.DrawRay(transform.position,transform.up*radius*4,Color.black);
	if(Physics.Raycast(transform.position,transform.up,upRay,radius*4)){
		if(upRay.collider.name=="roof"){
			direction="down"; 
		}
	}
}



function PauseGame(val:int){
	Time.timeScale=val;
}
