#pragma strict

// This script is only for walls or individual objects that should brake only partially.
// Useful for walls or stone structures, where you want individual bricks to break off ...
// ... exactly where the wall was hit or damaged.

var canBreak : boolean = true;
private var broken : boolean = false;
var breakFX : boolean = false;
var fadeout : boolean = true;
var displace : boolean = true;
var bendArea : boolean = false;

var hitpoints = 150.0;				// Current "health" of this wall/structure/object. (if zero, then start breaking)
var minDamage = 1.0;				// Minimum damage at once for the script in order to react by reducing hitpoints.
var fadeDuration = 2.0;				// How long does it take to fade the original wall out. (needs transpMaterial!)
private var breakStart = 0.0;		// Moment this object was broken.
private var alpha = 1.0;			// Alpha value of the fadeout material (=transpMaterial).
var displFactor = 0.5;				// Determinates by how much to displace each second row of bricks.
var objectBounds = Vector2(5.0, 2.0);	// Length and height of this object (x=l, y=h).
var debrisBounds = Vector2(0.5, 0.25);	// Length and height of each debris part (x=l, y=h).
var debrisMass = 0.7;				// Average mass of the debris pieces when broken off.
var maxBreakDist = 0.7;				// Maximum distance between wall elements and a breaking point in order to break them.
var bendAngle = 90.0;				// Bending angle in degrees (°).
var bendRotMod = 0.3;				// This modifies the rotation of the debris pieces on a bended object.
var bendDisplRotMod = 0.7;			// This modifies the rotation of the debris pieces on a bended object.
private var radius = 1.0;			// Radius of the bending circle/arc of this object.

var debris : Transform[];			// Bricks/pieces that compose the walls in semi-broken state. (No Rigidbody!)
var breakEffect : Transform;		// Effect that is instatiated when a segment breaks off.
var segments : Renderer[];			// All renderers within this object that should fade out on breaking.
var transpMaterial : Material;		// Replaces the renderer's material in case of fadeout. (Needs a color var.!)
var bendCenter : Transform;			// Point around which to bend the (planar) breaking zone.

function Start () {
	if (bendArea == true && bendCenter != null) {
		radius = Vector3.Distance(transform.position, bendCenter.position);
		objectBounds.x = Mathf.Abs(radius * bendAngle * Mathf.Deg2Rad);
	}
}

function OnDrawGizmosSelected () {
	Gizmos.color = Color.blue;
	var yDir = transform.up * objectBounds.y;
	if (bendArea == true && bendCenter != null) {
		var xSt = Mathf.Floor(objectBounds.x/debrisBounds.x);
		if (xSt < 1) {
			xSt = 1;
		}
		var originPt = bendCenter.position - transform.up * 0.5 * objectBounds.y;
		var curRad = Vector3.Distance(transform.position, bendCenter.position);
		var lastPt = originPt + transform.right * curRad;
		for (var i : int; i<xSt+1; i++) {
			var cAng = i * (bendAngle/xSt) * Mathf.Deg2Rad;
			var xp = Mathf.Cos(cAng) * curRad * transform.right;
			var zp = Mathf.Sin(cAng) * curRad * transform.forward;
			var pos = originPt + xp + zp;
			Gizmos.DrawLine(lastPt, pos);
			Gizmos.DrawLine(lastPt + yDir, pos + yDir);
			lastPt = pos;
		}
	}
	else {
		var xDir = transform.forward * objectBounds.x;
		var origin = transform.position - 0.5 * (transform.forward * objectBounds.x + yDir);
		Gizmos.DrawRay(origin, xDir);
		Gizmos.DrawRay(origin + yDir, xDir);
		Gizmos.DrawRay(origin, yDir);
		Gizmos.DrawRay(origin + xDir, yDir);
	}
}

function FixedUpdate () {
	if (broken == true) {
		// Fade out this wall.
		if (Time.time < breakStart + fadeDuration && fadeout == true) {
			alpha -= (1.0/fadeDuration) * Time.deltaTime;
			for (var seg : Renderer in segments) {
				if (seg != null) {
					seg.material.color.a = alpha;
				}
			}
		}
		else {
			DestroyAllRenderers();
			gameObject.GetComponent(DestroySegments).enabled = false;
		}
	}
}

function BreakPreciseSpot (pos : Vector3) {
	if (broken == true) {
		var targetBrick : Transform;
		var allBricks = gameObject.GetComponentsInChildren(MeshRenderer);
		var bestDist = 10000.0;
		for (var brick : Component in allBricks) {
			var b = brick.transform;
			var curDist = Vector3.Distance(pos, b.position);
			if (curDist < bestDist && curDist < maxBreakDist) {
				targetBrick = b;
			}
		}
		if (targetBrick != null) {
			if (breakFX == true && breakEffect != null) {
				Instantiate(breakEffect, targetBrick.position, targetBrick.rotation);
			}
			targetBrick.parent = transform.parent;
			targetBrick.gameObject.AddComponent(Rigidbody);
			targetBrick.gameObject.GetComponent(Rigidbody).mass = debrisMass;
			targetBrick.gameObject.AddComponent(BoxCollider);
		}
	}
}

function ApplyDamage (dmg : float) {
	if (canBreak == true && dmg >= minDamage) {
		if (broken == false) {
			hitpoints -= dmg;
			if (hitpoints <= 0.0 && broken == false) {
				breakStart = Time.time;
				broken = true;
				InitiateBreaking();
			}
		}
		else {
			BreakRandomPlace();
		}
	}
}

function InitiateBreaking () {
	// Change materials of all renderers to a tranaparent one:
	if (fadeout == true && transpMaterial != null) {
		for (var ren : Renderer in segments) {
			if (ren != null) {
				ren.material = transpMaterial;
			}
		}
	}

	// Prepare debris generation "grid":
	var xSteps = Mathf.Floor(objectBounds.x/debrisBounds.x);
	var ySteps = Mathf.Floor((objectBounds.y-debrisBounds.y)/debrisBounds.y);
	if (xSteps < 1) {
		xSteps = 1;
	}
	if (ySteps < 1) {
		ySteps = 1;
	}
	ySteps += 1;

	var lastPos = transform.position + transform.right * radius;
	var lastPos2 = transform.position + transform.right * radius + transform.forward * 0.5 * debrisBounds.x;
	if (bendArea == true && bendCenter != null) {
		for (var a : int; a<xSteps; a++) {
			var originPos = bendCenter.position + transform.up * 0.5 * (-objectBounds.y + debrisBounds.y);
			var displ = 0.5 * (debrisBounds.x) * displFactor;
			var curAngle = (1+a) * (bendAngle/xSteps) * Mathf.Deg2Rad;
			var xPos = Mathf.Cos(curAngle) * radius * transform.right;
			var zPos = Mathf.Sin(curAngle) * radius * transform.forward;
			var xPos2 = Mathf.Cos(curAngle+displ) * radius * transform.right;
			var zPos2 = Mathf.Sin(curAngle+displ) * radius * transform.forward;
			var planarPos = originPos + xPos + zPos;
			var planarPos2 = originPos + xPos2 + zPos2;

			//var LNDir = Vector3.Normalize(planarPos - lastPos);
			//var LNDir2 = Vector3.Normalize(planarPos2 - lastPos2);
			var LNDir = Mathf.Sin(Mathf.PI - curAngle) * transform.right + Mathf.Cos(Mathf.PI - curAngle) * transform.forward;
			var LNDir2 = Mathf.Sin(Mathf.PI - (curAngle + displ)) * transform.right + Mathf.Cos(Mathf.PI - (curAngle + displ)) * transform.forward;
			var rot = Quaternion.LookRotation(Vector3.Normalize(LNDir));
			var rot2 = Quaternion.LookRotation(Vector3.Normalize(LNDir2));

			lastPos = planarPos + LNDir * bendRotMod * debrisBounds.x;
			lastPos2 = planarPos + LNDir * bendRotMod * debrisBounds.x * bendDisplRotMod;

			var prevDis : int = 1;
			if (displace == false) {
				prevDis = 0;
			}
			for (var y : int; y<ySteps; y++) {
				if (displace == true && prevDis == 0) {
					prevDis = 1;
				}
				else {
					prevDis = 0;
				}
				var curRot = rot;
				var curPlanPos = planarPos;
				if (displace == true) {
					if (prevDis == 1) {
						curPlanPos = planarPos2;
						curRot = rot2;
					}
				}
				var pos = curPlanPos + transform.up * y * debrisBounds.y;
				var cDebris = Instantiate(debris[Random.Range(0, debris.length)], pos, curRot);
				cDebris.transform.parent = transform;
			}
		}
	}
	else {
		var edgePos = transform.position - 0.5 * (transform.forward * objectBounds.x + transform.up * objectBounds.y);
		var curDispl = displFactor;
		if (displace == false) {
			curDispl = 0.0;
		}
		//var count : int = 0;
		for (var yp : int; yp<ySteps; yp++) {
			var posY = yp * debrisBounds.y;
			if (displace == true) {
			if (curDispl == displFactor) {
				curDispl = 0.0;
			}
				else {
					curDispl = displFactor;
				}
			}

			for (var xp : int; xp<xSteps; xp++) {
				var posX = (xp + curDispl) * debrisBounds.x;
				var planePos = edgePos + transform.up * posY + transform.forward * posX;
				var pDebris = Instantiate(debris[Random.Range(0, debris.length)], planePos, transform.rotation);
				pDebris.transform.parent = transform;
				//count ++;
			}
		}
		//Debug.Log("x-steps = " + xSteps + " / y-steps = " + ySteps + " / total bricks: " + count + "/" + xSteps*ySteps);
	}
}

function BreakRandomPlace () {
	var newPos = transform.position;
	var zRan : Vector3;
	var xRan = transform.forward * 0.5 * Random.Range(-objectBounds.x, objectBounds.x);
	var yRan = transform.up * 0.5 * Random.Range(-objectBounds.y, objectBounds.y);
	if (bendArea == false) {
		newPos = xRan + yRan + transform.position;
	}
	else {
		zRan = transform.right * Random.Range(-radius, radius);
		newPos = xRan + yRan + zRan + bendCenter.position;
	}
	BreakPreciseSpot(newPos);
}

function DestroyAllRenderers () {
	for (var ren : Renderer in segments) {
		if (ren != null && ren.gameObject != gameObject) {
			Destroy(ren.gameObject);
		}
	}
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Controller/Destroy Segments")