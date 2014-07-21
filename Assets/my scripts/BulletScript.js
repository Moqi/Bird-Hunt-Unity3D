var RandomTorque : int;
var RandomForce : int;

function Start () //called when a bullet is spawned in order to add random force and rotation to the bullet when it is ejected
{
	Destroy( gameObject,1 ); 
	RandomTorque = Random.Range(-20,20);
	RandomForce = Random.Range(70,100);
	rigidbody.AddRelativeForce (-30, RandomForce, 0);
	rigidbody.AddRelativeTorque (RandomTorque, RandomTorque, RandomTorque);	
}
