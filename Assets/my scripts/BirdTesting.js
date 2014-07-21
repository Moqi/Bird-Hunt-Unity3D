var radius : int =3;
var frontRay : RaycastHit;
var leftRay : RaycastHit;
var rightRay : RaycastHit;
var downRay : RaycastHit;
var upRay : RaycastHit;
var landPoint1 :GameObject;
var direction : int; 	//1=rotate left, 2= rotate right, 3=tilt up, 4=tilt down, 5=Go Straight, 6 = Land
var landFlag : boolean;
var flyFlag : boolean = true;
var angle : float;
var changeRandomDirectionAtTime : float = 20.0;
var randomDirectionTimePassed : float = 0.0;
var flyTime : float = 20.0;
var idleTime : float = 0.0;


function Start(){
	direction=0;
	angle=45.0; // setting default angle to turn on direction change.
	randomDirectionTimePassed=Time.time + changeRandomDirectionAtTime; // setting 1st random direction change time
	idleTime=Time.time + flyTime; // setting 1st land idle time
	
	
}
function Update () {
	
	
	if(flyFlag){ 
		if(Time.time > randomDirectionTimePassed){
			randomDirectionTimePassed=Time.time + changeRandomDirectionAtTime;
			changeRandomDirectionAtTime=Mathf.Abs(Random.Range(15,20));
			direction=Mathf.Abs(Random.Range(1,5));
		}
	}
	Fly();
	RadiusCheck();  
	
	  
} 
function OnCollisionEnter(theCollision : Collision){
	if(flyFlag || landFlag){ 
		if(theCollision.gameObject.name=="FireBullet(Clone)"){
			flyFlag=false; 
			landFlag=false;
			//transform.collider.convex = false;
			animation.Play("Take 001");
			//animation.Stop();
			transform.eulerAngles =  new Vector3(90.0, transform.eulerAngles.y, transform.eulerAngles.z);
			transform.rigidbody.useGravity=true;
			transform.rigidbody.constraints =RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
			Destroy(gameObject,10); 
			GameObject.Find("Scores").SendMessage("updateScores");
		}
	} 
}

function Fly(){ 
	var rotation;  
	var directionToMove : Vector3 ;
	
	
	//if bird is flying
	if(flyFlag){
		if(direction!=6){
			animation.Play("run"); 
			transform.Translate(Vector3.forward*Time.deltaTime*3); 
		}
		if(direction==1){
			//transform.eulerAngles = Vector3(0.0, transform.eulerAngles.y-45.0, 0.0);
			//transform.RotateAround (Vector3.zero, -Vector3.up, 45);
			transform.Rotate(-Vector3.up,angle, Space.Self);
			direction=5;
			angle=45.0;
		}
		if(direction==2){
			//transform.eulerAngles = Vector3(0.0f, transform.eulerAngles.y+45.0, 0);
			//transform.RotateAround (Vector3.zero, Vector3.up, 45);
			transform.Rotate(Vector3.up,angle, Space.Self);
			direction=5;
			angle=45.0;
		}
		if(direction==3){ 
				transform.Rotate(-Vector3.right,0.5,Space.Self);
				yield WaitForSeconds(2);
				if(direction!=3){
					transform.Rotate(Vector3.right,0.5,Space.Self);
				}
				direction=5;
		} 
		if(direction==4){
				transform.Rotate(Vector3.right,0.5, Space.Self);
				yield WaitForSeconds(2);
				if(direction!=4){ 
					transform.Rotate(-Vector3.right,0.5, Space.Self);
				} 
				direction=5; 
		} 
		if(direction==6){ 
			animation.Play("run"); 
			transform.Rotate(-Vector3.right,0.07,Space.Self);
			transform.Translate(Vector3.forward*Time.deltaTime*5); 
			if(downRay.collider.name != "LandPoint"){
				direction = 5; 
				//transform.eulerAngles =  new Vector3(0.0, 0.0, 0.0); 
				randomDirectionTimePassed=Time.time + 5;
			}
		}
		
		transform.eulerAngles =  new Vector3(transform.eulerAngles.x, transform.eulerAngles.y, 0.0);

		
	}  
	else if(landFlag){ // bird will land
		//Debug.Log("In land: " + downRay.distance + "Direction: " + direction);
		direction=6;
		if(direction==6){ 
			if(downRay.distance>2  && downRay.distance<2.5){
				animation.Play("WIN");
				transform.Translate(Vector3.forward*Time.deltaTime); 
				transform.Rotate(Vector3.right,0.05,Space.Self);
	
			}
			else if(downRay.distance<2){
				transform.rigidbody.useGravity=true;
				transform.rigidbody.constraints = RigidbodyConstraints.FreezePositionX  | RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
				//transform.eulerAngles =  new Vector3(0.0, 0.0, 0.0); 
				transform.eulerAngles =  new Vector3(0.0,transform.eulerAngles.y, 0.0);
				animation.Play("idle"); 
				if(Time.time > idleTime){
					transform.rigidbody.useGravity=false;
					transform.rigidbody.constraints = RigidbodyConstraints.FreezePositionX  | RigidbodyConstraints.FreezePositionY |RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
					transform.position = Vector3(transform.position.x,transform.position.y+2,transform.position.z);
					animation.Play("WIN");
					idleTime=Time.time + flyTime;
					flyTime=Mathf.Abs(Random.Range(15,20));
					landFlag=false;
					flyFlag=true;
					randomDirectionTimePassed+=20;
				}
			}	
			else{ 
				animation.Play("run");
				transform.Translate(Vector3.forward*Time.deltaTime); 
				transform.Rotate(Vector3.right,0.05,Space.Self);
				//transform.Rotate(-Vector3.right,0.5,Space.Self);
			}
		}
	}
}  
function RadiusCheck(){
	var rotation;
	
	if(flyFlag || landFlag){
		Debug.DrawRay(transform.position,transform.forward*radius,Color.blue);
		if(Physics.Raycast(transform.position,transform.forward,frontRay,radius)){
			Debug.Log("Front Ray Colliding with: " + frontRay.collider.name);
			angle=Mathf.Abs(Random.Range(30,50));
			direction=Mathf.Abs(Random.Range(1,5));
			if(frontRay.collider.name == "wall"){
				angle=180;
				direction=Mathf.Abs(Random.Range(1,3));
			}
			 
		}
	
		Debug.DrawRay(transform.position,-transform.right*radius/3,Color.yellow);
		if(Physics.Raycast(transform.position,-transform.right,leftRay,radius/3)){
			Debug.Log("Left Ray Colliding with: " + leftRay.collider.name);
			angle=Mathf.Abs(Random.Range(20,30));
			direction=2;  
		}
		Debug.DrawRay(transform.position,transform.right*radius/3,Color.magenta);
		if(Physics.Raycast(transform.position,transform.right,rightRay,radius/3)){
			Debug.Log("right Ray Colliding with: " + rightRay.collider.name);
			angle=Mathf.Abs(Random.Range(20,30));
			direction=1;
		}     
	 
		Debug.DrawRay(transform.position,-transform.up*radius*3,Color.red);
		if(Physics.Raycast(transform.position,-transform.up,downRay,radius*3)){
			Debug.Log("Down Ray Colliding with: " + downRay.collider.name);
			 
			if(downRay.collider.name == "LandPoint" && direction < 5){
					direction=6;
					idleTime=Time.time + flyTime; // setting land idle time
					flyFlag=false;
					landFlag=true;
			}
			if(downRay.collider.name == "floor" && downRay.distance < 4){
				direction=3;
			} 
	
		} 
		Debug.DrawRay(transform.position+Vector3(0,5,0),transform.up*radius*3,Color.black);
		if(Physics.Raycast(transform.position+Vector3(0,5,0),transform.up,upRay,radius*3)){
			Debug.Log("Up Ray Colliding with: " + upRay.collider.name);
			direction=4;
		}
	}
} 