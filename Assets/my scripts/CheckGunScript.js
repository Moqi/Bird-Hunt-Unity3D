var BulletCount : int; //Ammount of bullets remaining in the clip
var MagCapacity = 10; //The maximum capacity of bullets in the clip
var MuzzleFlash : GameObject; //The muzzleFlash prefab
var MuzzleFlashSpawn : GameObject; //The muzzleFlash spawn point object
var BulletSpawn : GameObject; //The ejected bullet spawn point object
var Bullet : GameObject; //The bullet prefab that gets ejected
var moveTouch : Joystick;
var rotateTouch : Joystick;
var shootTouch : GUITexture; 
var flagTouch : int;
var fireBulletSpawn : GameObject;
var fireBullet : GameObject;

var gameObjects : GameObject[];

function Start()
{ 
	BulletCount=500;   
	animation["fire"].speed = 3; //set the firing animation to a little faster
	animation.wrapMode = WrapMode.Loop;  
	animation.Play ("idle", PlayMode.StopAll);	//start by playing the idle animation in loop
	flagTouch=0; 
	//gameObjects= GameObject.FindGameObjectsWithTag("EnemyCollider");
}  
 
function Update () 
{ 
    flagTouch=0;
	if(Input.touchCount>0){
		var fire : Touch = Input.GetTouch(0);
		//if(moveTouch.touchZone.Contains(fire.position)){
		if(shootTouch.HitTest(fire.position)){
			flagTouch=1;  	
		}
		/*if(rotateTouch.touchZone.Contains(fire.position)){
			flagTouch=1; 
		}*/
		/*if(!moveTouch.touchZone.Contains(fire.position)){
			flagTouch=0;	
		}
		if(!rotateTouch.touchZone.Contains(fire.position)){
			flagTouch=0;
		}*/
		if(flagTouch==1){
			if (Input.GetButton ("Fire1") && animation.IsPlaying("idle") && BulletCount >= 1)  //check to see if ready to fire
			{ 
				gameObjects= GameObject.FindGameObjectsWithTag("EnemyCollider");
				for(var go :GameObject in gameObjects){
					go.SendMessage("CheckFocus"); 
				} 
				animation.wrapMode = WrapMode.Clamp; //using clamp allows the detection of the end of the animation to be more accurate
				animation.Play ("fire"); //play the firing animation
				
				Instantiate(fireBullet, fireBulletSpawn.transform.position, BulletSpawn.transform.rotation);
				//Instantiate(fireBullet, fireBulletSpawn.transform.position, GameObject.Find("fireBulletSpawn").transform.rotation);
				
			}
			else if (Input.GetButton ("Fire1") && animation.IsPlaying("idle") && BulletCount <= 0) //if the bullets left in the clip is 0
			{
				animation.wrapMode = WrapMode.Clamp;
				animation.Play ("reload"); //reload the gun
			}	
		}
	}
	//Start : for shooting from PC Mouse
	/*if (Input.GetButton ("Fire1") && animation.IsPlaying("idle") && BulletCount >= 1)  //check to see if ready to fire
	{
		animation.wrapMode = WrapMode.Clamp; //using clamp allows the detection of the end of the animation to be more accurate
		animation.Play ("fire"); //play the firing animation
		
		Instantiate(fireBullet, fireBulletSpawn.transform.position, BulletSpawn.transform.rotation);
		//Instantiate(fireBullet, fireBulletSpawn.transform.position, GameObject.Find("fireBulletSpawn").transform.rotation);
		 
	}
	else if (Input.GetButton ("Fire1") && animation.IsPlaying("idle") && BulletCount <= 0) //if the bullets left in the clip is 0
	{
		animation.wrapMode = WrapMode.Clamp;
		animation.Play ("reload"); //reload the gun
	}*/
	//End: for shooting from PC Mouse
}

function Reload ()
{
	BulletCount = MagCapacity;	//set the bullet count to = the maximum clip size
}

function FireBullet () //Called via animation event to make the muzzle flash

{
	MuzzleFlashSpawn.transform.Rotate(Vector3.up * Random.Range(0,360)); //set the spawn point to have a random rotation vector
	Instantiate(MuzzleFlash, MuzzleFlashSpawn.transform.position, MuzzleFlashSpawn.transform.rotation); //instantiate the muzzle flash
}

function BackToIdle () //called via animation event at the end of fire/rotate in order to get back to idle
{
	animation.wrapMode = WrapMode.Loop;
	animation.Play("idle"); 
}

function EjectBullet () //Called via animation event to eject a bullet

{
	Instantiate(Bullet, BulletSpawn.transform.position, BulletSpawn.transform.rotation);
	BulletCount = (BulletCount - 1); //when the bullet is ejected the bullet count reduces by one
}

function SoundEffect (clip : AudioClip) //Called via animation event to make a sound effect

{
	var randomPitch = (Random.Range(1.0,2.0));
	audio.pitch = randomPitch;
	audio.PlayOneShot(clip);
}
function PauseGame(val:int){
	Time.timeScale=val;
}



