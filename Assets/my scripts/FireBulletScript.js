var RandomTorque : int;
var RandomForce : int;
var bulletSpeed:int;
var direction; 
var destroyFlag: boolean;

function Start () //called when a bullet is spawned in order to add random force and rotation to the bullet when it is ejected
{  
	bulletSpeed=10000;   
	direction=-Vector3.forward - Vector3(-0.15,-0.07,0);
	var theGunTransform : GameObject=GameObject.Find("THEGUN");
	//Debug.Log("The Gun Position: " + theGunTransform.transform.position);
	//Destroy( gameObject,5 );  
	//RandomTorque = Random.Range(-10,10);
	//RandomForce = Random.Range(100,130); 
	//rigidbody.AddRelativeForce (RandomForce, RandomForce,RandomForce ); 
	rigidbody.AddRelativeForce (-Vector3.forward * bulletSpeed);
	
	//Debug.Log(gameObject.name);
	//rigidbody.AddRelativeForce (((theGunTransform.transform.position+Vector3(0,0.5,0))-Vector3.forward)*50);
	rigidbody.AddRelativeTorque (0, 0,30);	
	
} 
 
function OnCollisionEnter(theCollision: Collision){
	//Debug.Log(collider.gameObject.name); 
	//Debug.Log(theCollision.gameObject.name);
	Destroy(collider.gameObject);
}

