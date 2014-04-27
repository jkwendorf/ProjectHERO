#pragma strict

var canBreak : boolean = true;			// Wether this structure is currently breakable.
private var broken : boolean = false;	// Wether this object is already broken.
var displace : boolean = true;			// Wether to displace each second row of bricks (cf. brick walls).
var randomize : boolean = false;		// Wether not to spawn debris in a regular pattern.
var randomDebris : boolean = false;		// Wether to chose from several debris prefabs to spawn.
var fadeoutDebris : boolean = false;	// Wether to nicely fade out and destroy the debris produced.
var staticDebris : boolean = false;		// Wether to make debris static after a while.

var bounds = Vector3(0.2, 2.0, 3.0);		// Bounding box size of the original object.
var offset : Vector3;
var debris : Rigidbody[];					// The different available debris types/prefabs (at least one).
var debrisSize = Vector3(0.1, 0.1, 0.25);	// Bounding box size of an average debris piece.

var displaceAmount = 0.5;					// Factor by which to multiply brick displacement.
var spawnProba = 60.0;						// Probability of spawning debris if randomized.
var fadeDuration = 3.0;						// Period of time necessairy for full fadeout.
var fadeDelay = 3.0;						// Period of time before fadeout begins.
var staticDelay = 3.0;						// Delay before debris is no longer dynamic.

var colls : Collider;						// External collider. (if not directly attached to this object)
var staticMaterial : Material;				// Non-transparent material for static debris.

function Start () {

}

function OnDrawGizmosSelected () {
	Gizmos.color = Color(0.0, 1.0, 0.0);

	var x = transform.right * bounds.x;
	var y = transform.up * bounds.y;
	var z = transform.forward * bounds.z;
	var offset0 = transform.right * offset.x + transform.up * offset.y + transform.forward * offset.z;
	var pos00 = transform.position + offset0;
	var pos0 = -0.5 * (x + y + z) + pos00;

	Gizmos.DrawRay(pos0, transform.right * bounds.x);
	Gizmos.DrawRay(pos0 + z, transform.right * bounds.x);
	Gizmos.DrawRay(pos0 + y, transform.right * bounds.x);
	Gizmos.DrawRay(pos0 + y + z, transform.right * bounds.x);
	Gizmos.DrawRay(pos0, transform.forward * bounds.z);
	Gizmos.DrawRay(pos0 + x, transform.forward * bounds.z);
	Gizmos.DrawRay(pos0 + y, transform.forward * bounds.z);
	Gizmos.DrawRay(pos0 + y + x, transform.forward * bounds.z);
	Gizmos.DrawRay(pos0, transform.up * bounds.y);
	Gizmos.DrawRay(pos0 + x, transform.up * bounds.y);
	Gizmos.DrawRay(pos0 + z, transform.up * bounds.y);
	Gizmos.DrawRay(pos0 + z + x, transform.up * bounds.y);
}

@ContextMenu ("Calculate debris amount")
function CalculateDebrisAmount () {
	var cX = bounds.x/debrisSize.x;
	var cY = bounds.y/debrisSize.y;
	var cZ = bounds.z/debrisSize.z;
	var proba = 1.0;
	if (randomize == true) {
		proba = spawnProba * 0.01;
	}
	var probAmount = Mathf.Ceil((cX * cY * cZ) * proba);
	Debug.Log("Debris amount to be expected: " + probAmount);
}

function ExternalDestruction () {
	if (canBreak == true && broken == false) {
		broken = true;

		// Avoid collision interferences first:
		if (colls != null) {
			colls.isTrigger = true;
		}

		var allBricks0 = new GameObject();
		var allBricks = Instantiate(allBricks0, transform.position, transform.rotation);
		allBricks.name = transform.name + "'s debris";

		if (fadeoutDebris == true) {
			allBricks.AddComponent(DebrisFadeout);
			var fader = allBricks.GetComponent(DebrisFadeout);
			fader.duration = fadeDuration;
			fader.delay = fadeDelay;
		}
		else {
			if (staticDebris == true) {
				allBricks.AddComponent(DebrisSetStatic);
				var makeStat = allBricks.GetComponent(DebrisSetStatic);
				makeStat.staticDelay = staticDelay;
				if (staticMaterial != null) {
					makeStat.staticMaterial = staticMaterial;
				}
			}
		}

		SpawnDebrisNow(allBricks);

		// Destroy the collider if it's a seperate object.
		if (colls != null) {
			Destroy(colls);
		}
		// Destroy the original object.
		Destroy(gameObject);
	}
}

function SpawnDebrisNow (brickParent : GameObject) {
	// Determine the amount of bricks spawned along each axis:
	var xSteps = Mathf.Ceil(bounds.x/debrisSize.x);
	var ySteps = Mathf.Ceil(bounds.y/debrisSize.y);
	var zSteps = Mathf.Ceil(bounds.z/debrisSize.z);
	// Make sure, we do spawn some debris:
	if (xSteps < 1) {
		xSteps = 1;
	}
	if (ySteps < 1) {
		ySteps = 1;
	}
	if (zSteps < 1) {
		zSteps = 1;
	}

	// Determine the origin of our spawning 'matrix':
	var locBounds = transform.right * bounds.x + transform.up * bounds.y + transform.forward * bounds.z;
	var origin = transform.position - 0.5 * locBounds + 0.5 * debrisSize + offset;

	var prevDis : int = 1;
	if (displace == false) {
		prevDis = 0;
	}
	for (var x : int; x<xSteps; x++) {
		var xPos = transform.right * x * debrisSize.x;
		for (var y : int; y<ySteps; y++) {
			var yPos = transform.up * y * debrisSize.y;

			// Displace bricks along local z axis:
			if (displace == true && prevDis == 0) {
				prevDis = 1;
			}
			else {
				prevDis = 0;
			}
			var dis = 0.0;
			if (displace == true) {
				dis = 0.5 * debrisSize.z * prevDis * displaceAmount;
			}
			var displ = transform.forward * dis;
				
			for (var z : int; z<zSteps; z++) {
				var zPos = transform.forward * z * debrisSize.z;

				// Only spawn debris if random allows it:
				var spawnNew : boolean = false;
				if (randomize == true) {
					if (Random.Range(0.0, 100.0) < spawnProba) {
						spawnNew = true;
					}
				}
				else {
					spawnNew = true;
				}

				// Now spawn the debris:
				if (spawnNew == true) {
					var debPos = origin + xPos + yPos + zPos + displ;

					var deb = debris[0];
					if (randomDebris == true) {
						deb = debris[Random.Range(0, debris.length-1)];
					}
					var nd = Instantiate(deb, debPos, transform.rotation);
					nd.transform.parent = brickParent.transform;
					if (GetComponent(Rigidbody)) {
						nd.velocity = rigidbody.velocity;
						nd.angularVelocity = rigidbody.angularVelocity;
					}
				}
			}
		}
	}
}
















