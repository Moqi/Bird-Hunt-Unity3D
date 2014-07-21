var bird : GameObject;
//var parent: GameObject;
var randomPosition : Vector3;
var randomRotation : Vector3;

var totalBirds:int;    
   
function Start () {     
	totalBirds=8;   
	//randomPosition=Vector3(Random.Range(-280,300),Random.Range(15,150),Random.Range(-200,240));
	//randomRotation=Vector3(0.0,Random.Range(45,270),0.0);
	for(var i:int=0;i<totalBirds;i++){  
		randomPosition=Vector3(Random.Range(-100,150),Random.Range(30,90),Random.Range(-100,140));
		//randomRotation=Vector3(0.0,Random.Range(45,270),0.0);
		var newBird = Instantiate(bird, randomPosition, Quaternion.EulerAngles(0.0,Random.Range(45,270),0.0)); 
		newBird.name="bird";
		
		//newBird.transform.parent=transform;     
	} 
}