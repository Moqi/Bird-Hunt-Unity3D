
//@script ExecuteInEditMode()
// radar! by PsychicParrot, adapted from a Blitz3d script found in the public domain online somewhere ..
//

public var blip : Texture;
public var radarBG : Texture;   
 
public var centerObject : Transform;
public var mapScale : float; 
public var mapCenter : Vector2;      

function Start(){
	mapCenter = Vector2(Screen.width-180,40); 
	mapScale = 0.17;
}
 
function OnGUI(){ 
	
	//GUI.matrix = Matrix4x4.TRS (Vector3.zero, Quaternion.identity, Vector3(Screen.width / 600.0, Screen.height / 450.0, 1));
	// Draw player blip (centerObject)
    var bX=centerObject.transform.position.x * mapScale;
    var bY=centerObject.transform.position.z * mapScale;
        
    bX=centerObject.transform.position.x * mapScale;
    bY=centerObject.transform.position.z * mapScale;
        
    GUI.DrawTexture(Rect(mapCenter.x-32,mapCenter.y-32,64,64),radarBG);
    
    // Draw blips for zombies
    DrawBlipsForEnemies();
}

function DrawBlipsForCows(){
    
     // Find all game objects with tag Cow
    var gos : GameObject[];
    gos = GameObject.FindGameObjectsWithTag("Cow"); 

    var distance = Mathf.Infinity; 
    var position = transform.position; 

    // Iterate through them
    for (var go : GameObject in gos)  { 
        drawBlip(go,blip);
    }
}

function drawBlip(go: GameObject,aTexture){
    
    var centerPos=centerObject.position;
    var extPos=go.transform.position;
    
    // first we need to get the distance of the enemy from the player
    var dist=Vector3.Distance(centerPos,extPos);
     
    var dx=centerPos.x-extPos.x; // how far to the side of the player is the enemy?
    var dz=centerPos.z-extPos.z; // how far in front or behind the player is the enemy?
    
    // what's the angle to turn to face the enemy - compensating for the player's turning?
    var deltay=Mathf.Atan2(dx,dz)*Mathf.Rad2Deg - 270 - centerObject.eulerAngles.y;
    
    // just basic trigonometry to find the point x,y (enemy's location) given the angle deltay
    var bX=dist*Mathf.Cos(deltay * Mathf.Deg2Rad);
    var bY=dist*Mathf.Sin(deltay * Mathf.Deg2Rad);
    
    bX=bX*mapScale; // scales down the x-coordinate by half so that the plot stays within our radar
    bY=bY*mapScale; // scales down the y-coordinate by half so that the plot stays within our radar
    
    if(dist<=200){ 
        // this is the diameter of our largest radar circle
       GUI.DrawTexture(Rect(mapCenter.x+bX,mapCenter.y+bY,2,2),aTexture);

    }

} 

function DrawBlipsForEnemies(){
    
    // Find all game objects tagged Enemy
    var gos : GameObject[];
    gos = GameObject.FindGameObjectsWithTag("Enemy"); 

    var distance = Mathf.Infinity; 
    var position = transform.position; 

    // Iterate through them and call drawBlip function
    for (var go : GameObject in gos)  { 

    	drawBlip(go,blip);
    }
}


