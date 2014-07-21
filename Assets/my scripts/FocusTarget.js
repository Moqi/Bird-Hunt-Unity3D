
public var myCam : GameObject; 
public var bird : GameObject;
public var disk: GameObject;
public var distance:float;  
var flag:boolean=true;
  
function Start(){ 
	/*focus = GameObject.CreatePrimitive(PrimitiveType.Plane);	
	focus.transform.localScale = Vector3(0.8,0.8,0.8);
	var rotation = Quaternion.EulerRotation(0,0,90);
	focus.transform.rotation=rotation;
	focus.renderer.enabled=false;*/  
	myCam=GameObject.FindGameObjectWithTag("MainCamera"); 
	
}   
       
function Update () {
		disk.transform.RotateAround(disk.transform.position, disk.transform.forward, 5); 
}  
function CheckFocus(){
	if(disk.renderer.isVisible)
		bird.SendMessage("BirdHit"); 
}  
function ShowFocus(f:float){  
	distance=f; 
	//flag=f; 
	if(distance>0){  
		flag=true;   
		disk.renderer.enabled=flag; 
		disk.transform.LookAt(myCam.transform);     
		var scale:Vector3=Vector3(1+distance/100,1+distance/100,1+distance/100);  
		disk.transform.localScale=scale;  
	} 
	else if(distance==0){
		flag=false; 
		disk.renderer.enabled=flag;
	}
}   
