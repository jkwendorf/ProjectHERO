#pragma strict

var canBreak : boolean = true;					// Wether this structure is currently breakable.
var setupOnStart : boolean = false;
var individualBaseAngles : boolean = false;
var individualLinkAngles : boolean = false;
var individualBuiltDirections : boolean = false;

// The direction opposite to the carrying surface of this structure, but still in direction of a carrying part of the structure:
// (Vec3.up for buildings, -Vec3.up for hanging structures, trans.forward for space ships, etc...)
var builtDirection = Vector3(0.0, 1.0, 0.0);

var maxLinkAngle = 91.0;						// Maximum angle between con points and builtDirection for next parts.
var maxBaseAngle = 45.0;						// Maximum angle between con points and builtDirection for base of parts.
var maxLinkDist = 0.5;							// Maximum distance between connection points (=con points).
var maxFixDist = 2.0;							// Maximum distance to a static fixation point.
var structureBounds = Vector3(2.0, 4.0, 2.0);	// Width and height of this structure.

var base : Transform;
var fixedParts : DestroyMaster[];				// Which parts are linked to a static (!) object and therefore harder to break.
var connectorTag : String = "ConnectionPoint";	// Tag of the connection points.
var fixationTag : String = "FixationPoint";		// Tag of the connection points.

function Start () {
	if (base == null) {
		base = transform;
	}
	if (setupOnStart == true) {
		SetupStructureLinks();
	}
}

function OnDrawGizmos () {
	Gizmos.color = Color(0.0, 1.0, 0.0, 0.5);
	if (base != null) {
		var bp0 = base.position - 0.5 * (base.right * structureBounds.x + base.forward * structureBounds.z);
		var bpX = base.right * structureBounds.x;
		var bpZ = base.forward * structureBounds.z;
		Gizmos.DrawRay(bp0, builtDirection * structureBounds.y);
		Gizmos.DrawRay(bp0, base.right * structureBounds.x);
		Gizmos.DrawRay(bp0+bpZ, base.right * structureBounds.x);
		Gizmos.DrawRay(bp0, base.forward * structureBounds.z);
		Gizmos.DrawRay(bp0+bpX, base.forward * structureBounds.z);
		Gizmos.DrawRay(bp0+bpX, builtDirection * structureBounds.y);
		Gizmos.DrawRay(bp0+bpZ, builtDirection * structureBounds.y);
		Gizmos.DrawRay(bp0+bpX+bpZ, builtDirection * structureBounds.y);
		var topPos = base.position + builtDirection * structureBounds.y;
		var tp0 = topPos - 0.5 * (base.right * structureBounds.x + base.forward * structureBounds.z);
		Gizmos.DrawRay(tp0, base.right * structureBounds.x);
		Gizmos.DrawRay(tp0, base.forward * structureBounds.z);
		Gizmos.DrawRay(tp0+bpZ, base.right * structureBounds.x);
		Gizmos.DrawRay(tp0+bpX, base.forward * structureBounds.z);
		Gizmos.DrawIcon(base.position+builtDirection*structureBounds.y*0.5, "Destroyable stuff/DestroyMaster.tif");
	}
}

@ContextMenu ("Setup structure links")
function SetupStructureLinks () {
	// Gather destroyable parts in children:
	var destr = gameObject.GetComponentsInChildren(DestroyMaster);
	var fixes = GameObject.FindGameObjectsWithTag(fixationTag);

	for (var dstr : Component in destr) {
		// If necessairy, reset overall built direction.
		var des = dstr.gameObject.GetComponent(DestroyMaster);
		des.ClearAllLinks();
		if (individualBuiltDirections == false) {
			des.builtDirection = builtDirection;
		}
		// Find out which pieces are fixed onto something undestructible:
		des.fixture = null;
		for (var fixA : GameObject in fixes) {
			if (des.fixture == null) {
				var fix = fixA.transform.position;
				if (Vector3.Distance(fix, dstr.transform.position) < maxFixDist) {
					des.fixture = fixA.transform;
				}
			}
		}
	}

	// Prepare additional stability settings for fixed parts:
	for (var fix0 : Component in fixedParts) {
		fix0.gameObject.GetComponent(DestroyMaster).fixture = base;
	}

	// Gather all connection points (sorted later):
	var conPts = gameObject.FindGameObjectsWithTag(connectorTag);

	for (var ptA : GameObject in conPts) {
		var pt1 = ptA.transform;
		for (var ptB : GameObject in conPts) {
			var pt2 = ptB.transform;

			if (pt1.parent.parent == transform && pt2.parent.parent == transform && pt1 != pt2) {
				var builtDirection1 = builtDirection;
				if (individualBuiltDirections == true) {
					builtDirection1 = pt1.parent.GetComponent(DestroyMaster).builtDirection;
				}
				// Check if the connection points are close enough to each other:
				if (Vector3.Distance(pt1.position, pt2.position) < maxLinkDist) {
					var dir12 = pt2.position - pt1.position;
					var ang12 = Vector3.Angle(dir12, builtDirection1);

					var maxLinkAngle1 = maxLinkAngle;
					if (individualLinkAngles == true) {
						maxLinkAngle1 = pt1.parent.GetComponent(DestroyMaster).stableLinkAngle;
					}
					if (ang12 <= maxLinkAngle1) {
						pt1.parent.GetComponent(DestroyMaster).AddNextPart(pt2);
					}
					var ang12b = Vector3.Angle(dir12, -builtDirection1);
					var maxBaseAngle1 = maxBaseAngle;
					if (individualBaseAngles == true) {
						maxBaseAngle1 = pt1.parent.GetComponent(DestroyMaster).stableBaseAngle;
					}
					if (ang12b <= maxBaseAngle1) {
						pt1.parent.GetComponent(DestroyMaster).AddBasePart(pt2);
					}
				}
			}
		}
	}
}

@ContextMenu ("Switch breakable-unbreakable")
function SwitchBreakableUnbreakable () {
	if (canBreak == true) {
		canBreak = false;
	}
	else {
		canBreak = true;
	}
	var dstrs = gameObject.GetComponentsInChildren(DestroyMaster);
	for (var dstr : Component in dstrs) {
		dstr.gameObject.GetComponent(DestroyMaster).canBreak = canBreak;
	}
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Controller/Construction Setup")