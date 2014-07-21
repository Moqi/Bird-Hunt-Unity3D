//////////////////////////////////////////////////////////////
// FirstPersonControl.js
//
// FirstPersonControl creates a control scheme where the camera 
// location and controls directly map to being in the first person.
// The left pad is used to move the character, and the
// right pad is used to rotate the character. A quick double-tap
// on the right joystick will make the character jump.
//
// If no right pad is assigned, then tilt is used for rotation
// you double tap the left pad to jump
//////////////////////////////////////////////////////////////

@script RequireComponent( CharacterController )
 
// This script must be attached to a GameObject that has a CharacterController
var moveTouchPad : Joystick;
var rotateTouchPad : Joystick;						// If unassigned, tilt is used

var aimTarget: GameObject;

var cameraPivot : Transform;						// The transform used for camera rotation
var theGunTransform : Transform;
var forwardSpeed : float = 10;
var backwardSpeed : float = 10;
var sidestepSpeed : float = 10;
var jumpSpeed : float = 8;
var inAirMultiplier : float = 0.25;		 			// Limiter for ground speed while jumping
var rotationSpeed : Vector2 = Vector2( 50, 25 );	// Camera rotation speed for each axis
var tiltPositiveYAxis = 0.6; 
var tiltNegativeYAxis = 0.4;
var tiltXAxisMinimum = 0.1;
var speed:int;
var quit="Quit";
var prevDist : float=100; 
var aimTargetDist:float=100;
var movementFlag : boolean = true;
var ax : float = 0;
var ay : float = 0;
var az : float = 0;

var defX : float = 0;
var defY : float = 0;
var defZ : float = 0;

private var thisTransform : Transform;
private var character : CharacterController;
private var cameraVelocity : Vector3;
private var velocity : Vector3;						// Used for continuing momentum while in air
private var canJump = true;

var movement : Vector3; 

var focusFlag:boolean =true;
var birdCollider: GameObject;

function Start()
{
	// Cache component lookup at startup instead of doing this every frame		
	thisTransform = GetComponent( Transform );
	character = GetComponent( CharacterController );	

	// Move the character to the correct start position in the level, if one exists
	var spawn = GameObject.Find( "PlayerSpawn" );
	if ( spawn )
		thisTransform.position = spawn.transform.position;
	defX = Input.acceleration.x;
	defY = Input.acceleration.y;
	defZ = Input.acceleration.z;
	speed=12;  
	
}

function OnEndGame()
{
	// Disable joystick when the game ends	
	moveTouchPad.Disable();
	
	if ( rotateTouchPad )
		rotateTouchPad.Disable();	

	// Don't allow any more control changes when the game ends
	this.enabled = false;
} 

function Update()
{
	ax=Input.acceleration.x; 
	ay=Input.acceleration.y;
	az=Input.acceleration.z;
	  
	/*if(movementFlag){
		//if(ax > 0.1 || ax < -0.1 || ay > 0.1 || ay < -0.1){
		if(ax > defX || ax < defX || ay > defY || ay < defY){	
			if(ax>defX){
				ax=Mathf.Abs(ax);
				ax+=0.5;
			}
			movement = thisTransform.TransformDirection( Vector3(ay*-speed , 0 ,ax*speed) );	
			quit="tilt";
			//Debug.Log("in titlt");
			
		}  
	}
	if(ax-defX>-0.07 && ax-defX <0.07){// && ay-defY>-0.07 && ay-defY <0.07){
			movement = thisTransform.TransformDirection( Vector3( 0, 0,0 ) );	
			quit="face";
			movementFlag=false;
	}  
	else{
		movementFlag=true;
	}*/
	  
	
	// Apply movement from move joystick
	movement = thisTransform.TransformDirection( Vector3( moveTouchPad.position.x, 0, moveTouchPad.position.y ) );
	movement.y = 0; 
	movement.Normalize();  
	var absJoyPos = Vector2(Mathf.Abs(moveTouchPad.position.x), Mathf.Abs(moveTouchPad.position.y));	
	
	//Start: Movement from PC Buttons: 
	// movement = thisTransform.TransformDirection( Vector3(Input.GetAxis("Horizontal")*speed,0 ,Input.GetAxis("Vertical")*speed) );	
	// absJoyPos = Vector2(Mathf.Abs(Input.GetAxis("Horizontal")), Mathf.Abs(Input.GetAxis("Vertical")));	
 	//End: Movement from PC Button 

	//var absJoyPos = Vector2(0, 0);	   
	if ( absJoyPos.y > absJoyPos.x ) 
	{ 
		if ( moveTouchPad.position.y > 0 ) 
			movement *= forwardSpeed * absJoyPos.y;
		else 
			movement *= backwardSpeed * absJoyPos.y;
	}
	else
		movement *= sidestepSpeed * absJoyPos.x;		
	
	
	/*var absJoyPos = Vector2(ax,ay );
	if ( ax < ay  )
	{
		if ( ay > 0 )
			movement *= forwardSpeed * ay;
		else
			movement *= backwardSpeed * -ay*5;
	}
	else
		movement *= sidestepSpeed * ax;	 	
	*/ 
	 
	// Check for jump
	if ( character.isGrounded )
	{		
		var jump = false;
		var touchPad : Joystick;
		if ( rotateTouchPad )
			touchPad = rotateTouchPad;
		else
			touchPad = moveTouchPad;
	
		if ( !touchPad.IsFingerDown() )
			canJump = true;
		
	 	if ( canJump && touchPad.tapCount >= 2 )
	 	{
			jump = true;
			canJump = false;
	 	}	
		
		if ( jump )
		{
			// Apply the current movement to launch velocity		
			velocity = character.velocity;
			velocity.y = jumpSpeed;	
		}
	}
	else
	{			
		 //Apply gravity to our velocity to diminish it over time
		 velocity.y += Physics.gravity.y * Time.deltaTime;
			
		 //Adjust additional movement while in-air
		//movement.x *= inAirMultiplier;
		//movement.z *= inAirMultiplier;
	}
	//if(Input.deviceOrientation != DeviceOrientation.FaceUp){	
	movement += velocity;	
	movement += Physics.gravity;
	movement *= Time.deltaTime*2;
	
// Actually move the character	
	character.Move( movement );
	//}
	if ( character.isGrounded )
		// Remove any persistent velocity after landing	
		velocity = Vector3.zero;
	
	// Apply rotation from rotation joystick
	if ( character.isGrounded )
	{ 
		var camRotation = Vector2.zero;
		
		//end: Rotation from PC
		if (rotateTouchPad ){
			camRotation = rotateTouchPad.position;
		}
		else
		{
			// Use tilt instead
//			print( iPhoneInput.acceleration );
			var acceleration = Input.acceleration;
			var absTiltX = Mathf.Abs( acceleration.x );
			if ( acceleration.z < 0 && acceleration.x < 0 )
			{
				if ( absTiltX >= tiltPositiveYAxis )
					camRotation.y = (absTiltX - tiltPositiveYAxis) / (1 - tiltPositiveYAxis);
				else if ( absTiltX <= tiltNegativeYAxis )
					camRotation.y = -( tiltNegativeYAxis - absTiltX) / tiltNegativeYAxis;
			}
			
			if ( Mathf.Abs( acceleration.y ) >= tiltXAxisMinimum )
				camRotation.x = -(acceleration.y - tiltXAxisMinimum) / (1 - tiltXAxisMinimum);
		}
		
		camRotation.x *= rotationSpeed.x; 
		camRotation.y *= rotationSpeed.y;
		camRotation *= Time.deltaTime;
		 
		// Rotate the character around world-y using x-axis of joystick
		thisTransform.Rotate( 0, camRotation.x, 0, Space.World );
		// Rotate only the camera with y-axis input
		cameraPivot.Rotate( -camRotation.y, 0, 0 );
		var hit : RaycastHit;  
		//var prevDist : float;// = (aimTarget.transform.position - theGunTransform.position).magnitude;
		//Debug.DrawRay(theGunTransform.position,theGunTransform.forward*aimTargetDist,Color.red);
		Debug.DrawRay(theGunTransform.position+Vector3(0,0.3,0),-theGunTransform.forward*aimTargetDist,Color.green);
		if (Physics.Raycast(theGunTransform.position+Vector3(0,0.3,0), -theGunTransform.forward,hit, 100)) {
			//Debug.Log("Hitting with: " + hit.collider.name);
		
			if(hit.collider.name != "FireBullet(Clone)"){
				aimTargetDist = hit.distance - 0.05f;
				prevDist=hit.distance;
			}
		}    
		else { 
			// If we're aiming at nothing, keep prev dist but make it at least 5.
			if(hit.distance==0){
				aimTargetDist =Mathf.Max(100, prevDist);
			}
		}   
		
		// Set the aimTarget position according to the distance we found.
		// Make the movement slightly smooth.
		aimTarget.transform.position = (theGunTransform.position+Vector3(0,0.3,0))-theGunTransform.forward*aimTargetDist;
		//var centerPos = Vector3(Screen.width/2,Screen.height/2,5);
		//aimTarget.transform.position=centerPos;
		var scale:Vector3=Vector3(aimTargetDist/100,aimTargetDist/100,aimTargetDist/100);
		aimTarget.transform.localScale=scale; 
		
		var aimHit: RaycastHit;  
		Debug.DrawRay(aimTarget.transform.position,-theGunTransform.forward*1000,Color.red); 
		if(Physics.Raycast(aimTarget.transform.position,-theGunTransform.forward,aimHit,1000)){
			//Debug.Log("new raycast: " + aimHit.collider.name);
			if(aimHit.collider.name=="Box001"){
				
				if(focusFlag){
					focusFlag=false; 
					birdCollider=aimHit.collider.gameObject;
				 	//gameObject.AddComponent ("FocusTarget");
					aimHit.collider.gameObject.SendMessage("ShowFocus",aimHit.distance);
				}  
			}    
			else{   
				if(birdCollider!=null){ 
					focusFlag=true;  
					birdCollider.SendMessage("ShowFocus",0); 
				}
			}
			
		} 
		 
		theGunTransform.eulerAngles =  Vector3(-cameraPivot.eulerAngles.x,cameraPivot.eulerAngles.y-200,cameraPivot.eulerAngles.z);
	}
}	
function PauseGame(val:int){
	Time.timeScale=val;
}
