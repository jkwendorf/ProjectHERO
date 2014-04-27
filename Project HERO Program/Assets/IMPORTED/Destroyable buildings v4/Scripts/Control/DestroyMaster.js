#pragma strict

var canBreak : boolean = true;				// Wether this structure part is currently breakable.
var display : boolean = true;				// Wether to display the gizmos.
private var broken : boolean = false;
var breakNextParts : boolean = true;		// Wether to break attached (=next) structure parts if broken.
var breakIfUnstable : boolean = false;		// Wether to only break this if n base parts are gone.
private var stableBase : boolean = true;
private var chunked : boolean = false;
var chunkDistCheck : boolean = false;
var chunkIntegCheck : boolean = false;		// Is this chunk really a gapless piece of debris? (lots of cpu required!)
var chunksUseGravity : boolean = true;
var spawnBreakEffect : boolean = false;		// Wether to spawn a special effect, once this object breaks or 'chunks'.
var externalDestroyer : boolean = false;	// Wether to allow the use of an external/different destruction method.

var breakNextProba = 100.0;				// Probability of next parts breaking as well.
var breakThisProba = 100.0;				// Probability of this part breaking.
var createChunksProba = 5.0;			// Probability of reuniting multiple parts as dynamic segments (=chunks).
var addToChunksProba = 50.0;
var minBaseParts : int = 1;				// Minimum base parts to break before this part gets unstable.
var builtDirection = Vector3(0.0, 1.0, 0.0);
var stableBaseAngle = 45.0;				// Max. angle between "down" and base part direction (used for stability check).
var stableLinkAngle = 45.0;				// Max. angle between "up" and link part direction (used for stability check).
var maxPartDist = 2.2;					// ChunkCheck only; Max dist. between parts in order to assemble them into a chunk.
var maxLinkDist = 0.5;					// ChunkCheck only; Max dist. between connection points of parts in order to assemble chunks.
var chunkMass = 9.0;					// Default mass of each chunk.
var chunkDrag = 0.0;					// Default drag for each chunk, useful for very heavy structures.
var chunkAngDrag = 0.05;				// Default angular drag for each chunk, to avoid spontanuous extreme rotations.

var baseOfThisPart : GameObject[];		// Structural elements that carry this part of the construction.
var isBaseOfParts : DestroyMaster[];	// The structure's parts that are held in place by this part.
var fixture : Transform;				// Static (!) object this part is fixed to (set by setup helper).
private var chunkMaster : Transform;

var replacements : GameObject[];		// Possible debris objects that spawn if this part breaks.
var breakEffect : Transform;			// Effect spawned at object pos. and rot., for exemple: particles, explosions, etc...
var destroyer : MonoBehaviour;			// The external destroyer, if we have this allowed (externalDestroyer bool).

function Start () {
	if (chunkDistCheck == true) {
		// Allow chunk links of 3d structures that are only linked over one edge.
		maxPartDist *= 1.733;	// *= √3
	}
}

function OnDrawGizmosSelected () {
	if (display == true) {
		Gizmos.color = Color(0.0, 1.0, 0.0, 0.5);
		if (isBaseOfParts) {
			if (isBaseOfParts.length > 0) {
				for (var next0 : DestroyMaster in isBaseOfParts) {
					if (next0 != null) {
						Gizmos.DrawLine(transform.position, next0.transform.position);
					}
				}
			}
		}
		Gizmos.color = Color(1.0, 0.0, 0.0, 1.0);
		var bOff0 = Vector3(0.05, 0.0, 0.0);
		if (baseOfThisPart.length > 0) {
			for (var base0 : GameObject in baseOfThisPart) {
				if (base0 != null) {
					Gizmos.DrawLine(transform.position+bOff0, base0.transform.position+bOff0);
				}
			}
		}
		Gizmos.color = Color.white;
		if (fixture != null) {
			Gizmos.DrawLine(transform.position-bOff0, fixture.position-bOff0);
		}
		Gizmos.DrawRay(transform.position, builtDirection * 2.0);
		Gizmos.DrawIcon(transform.position, "Destroyable stuff/DestroyMaster.tif");
	}
}

function SetBreakable (newBreakable : boolean) {
	canBreak = newBreakable;
}
function AddBasePart () {
	
}
function SetMass (newMass : float) {
	if (GetComponent(Rigidbody)) {
		GetComponent(Rigidbody).mass = newMass;
	}
}
function AddBasePart (nb : Transform) {
	var nbSet : boolean = false;
	for (var b : int; b<baseOfThisPart.length; b++) {
		if (baseOfThisPart[b] == null && nbSet == false) {
			baseOfThisPart[b] = nb.parent.gameObject;
			nbSet = true;
		}
	}
	//Debug.Log("Adding base");
}
function AddNextPart (nn : Transform) {
	var nnSet : boolean = false;
	for (var n : int; n<isBaseOfParts.length; n++) {
		if (isBaseOfParts[n] == null && nnSet == false) {
			isBaseOfParts[n] = nn.parent.GetComponent(DestroyMaster);
			nnSet = true;
		}
	}
	//Debug.Log("Adding next");
}

@ContextMenu ("Clear all links")
function ClearAllLinks () {
	if (isBaseOfParts.length > 0) {
		for (var n0 : int; n0<isBaseOfParts.length; n0++) {
			isBaseOfParts[n0] = null;
		}
	}
	if (baseOfThisPart.length > 0) {
		for (var b0 : int; b0<baseOfThisPart.length; b0++) {
			baseOfThisPart[b0] = null;
		}
	}
	//Debug.Log("All links cleared.   (" + transform.name + ")");
}
function ClearPreciseLink (delete : GameObject) {
	for (var e : int; e<baseOfThisPart.length; e++) {
		if (baseOfThisPart[e] != null) {
			if (baseOfThisPart[e].gameObject == delete) {
				baseOfThisPart[e].SendMessage("ClearPreciseBase", gameObject);
				baseOfThisPart[e] = null;
			}
		}
	}
	var isNext : boolean = false;
	for (var r : int; r<isBaseOfParts.length; r++) {
		if (isBaseOfParts[r] != null) {
			if (isBaseOfParts[r].gameObject == delete) {
				isNext = true;
				isBaseOfParts[r].SendMessage("ClearPreciseNext", gameObject);
				isBaseOfParts[r] = null;
			}
		}
	}
	if (isNext == true) {
		delete.SendMessage("ExternalBreakObject");
	}
}

function ClearPreciseBase (delete : GameObject) {
	for (var e : int; e<baseOfThisPart.length; e++) {
		if (baseOfThisPart[e] != null) {
			if (baseOfThisPart[e].gameObject == delete) {
				baseOfThisPart[e] = null;
			}
		}
	}
}
function ClearPreciseNext (delete : GameObject) {
	for (var e : int; e<isBaseOfParts.length; e++) {
		if (isBaseOfParts[e] != null) {
			if (isBaseOfParts[e].gameObject == delete) {
				isBaseOfParts[e] = null;
			}
		}
	}
}

function CheckBreakability () : boolean {
	if (breakThisProba >= 100.0) {
		return true;
	}
	else {
		if (Random.Range(0.0, 100.0) <= breakThisProba) {
			return true;
		}
		else {
			return false;
		}
	}
}

function ExternalBreakObject () {
	var breakReadyExt : boolean = false;
	breakReadyExt = CheckBreakability();
	if (breakReadyExt == true && broken == false) {
		if (spawnBreakEffect == true) {
			Instantiate(breakEffect, transform.position, transform.rotation);
		}
		// Is this part currently allowed to break?
		stableBase = CheckBaseStability();
		if (createChunksProba == 100.0 || Random.Range(0.0, 100.0) < createChunksProba) {
			CreateChunks();
		}
		else {
			BreakObject();
		}
	}
}

function InternalBreakObject () {
	stableBase = false;
	if (broken == false) {
		if (spawnBreakEffect == true) {
			Instantiate(breakEffect, transform.position, transform.rotation);
		}
		if (createChunksProba == 100.0 || Random.Range(0.0, 100.0) < createChunksProba) {
			CreateChunks();
		}
		else {
			BreakObject();
		}
	}
}

function BreakObject () {
	if (canBreak == true && broken == false) {
		broken = true;
		if (stableBase == false) {
			// Destroy all relying parts if necessairy:
			if (breakNextParts == true) {
				BreakCarryedParts();
			}
			// Destroy this part now:
			if (externalDestroyer == false) {
				BreakThisObject();
			}
			else {
				InitiateExternalDestroyer();
			}
		}
	}
}

function CheckBaseStability () : boolean {
	var curStab : boolean = true;
	// Check wether we've got a structural deficiency:
	if (breakIfUnstable == true) {
		var bpC : int = 0;
		for (var bp : GameObject in baseOfThisPart) {
			if (bp != null) {
				if (bp.GetComponent(DestroyMaster).fixture != null) {
					bpC ++;
				}
			}
		}
		if (bpC < minBaseParts) {
			curStab = false;
		}
	}
	else {
		curStab = false;
	}
	// Return the result:
	return curStab;
}

function BreakCarryedParts () {
	for (var cgo : DestroyMaster in isBaseOfParts) {
		if (cgo != null) {
			if (breakNextProba == 100.0) {
				cgo.SendMessage("ExternalBreakObject");
			}
			else {
				if (Random.Range(0.0, 100.0) < breakNextProba) {
					cgo.SendMessage("ExternalBreakObject");
				}
			}
		}
	}
}

function BreakThisObject () {
	var thisRepl = replacements[Random.Range(0, replacements.length)];
	var newRepl = Instantiate(thisRepl, transform.position, transform.rotation);
	if (GetComponent(Rigidbody)) {
		if (newRepl.GetComponent(Rigidbody)) {
			newRepl.rigidbody.velocity = rigidbody.velocity;
			newRepl.rigidbody.angularVelocity = rigidbody.angularVelocity;
		}
		newRepl.SendMessage("SetInitialVelocity", rigidbody.velocity, SendMessageOptions.DontRequireReceiver);
	}
	if (chunked == true) {
		var cMembers = gameObject.GetComponentsInChildren(DestroyMaster);
		if (cMembers.length > 0) {
			for (var cm : Component in cMembers) {
				cm.transform.parent = null;
				if (!cm.gameObject.rigidbody) {
					var cRb = cm.gameObject.AddComponent(Rigidbody);
					if (chunksUseGravity == false) {
						cRb.rigidbody.useGravity = false;
					}
					cRb.rigidbody.mass = chunkMass;
					cRb.rigidbody.isKinematic = false;
				}
			}
		}
	}
	Destroy(gameObject);
}

function InitiateExternalDestroyer () {
	if (destroyer != null) {
		destroyer.SendMessage("ExternalDestruction");
	}
	else {
		BreakThisObject();
	}
}

function CreateChunks () {
	//Debug.Log("Awaiting chunk state :P   (" + transform.name + ")");
	yield WaitForSeconds(Random.Range(0.0, 0.04));
	if (chunked == false) {
		AssembleChunk(transform);
		chunked = true;
	}
}

function ToAttachChunk (newBoss : Transform) {
	if (chunked == false) {
		AssembleChunk(newBoss);
		transform.parent = newBoss;
		chunked = true;
	}
}

function AssembleChunk (chunk : Transform) {
	if (chunkMaster == null) {
		chunkMaster = chunk;
		var allowChunk : boolean = true;
		if (transform.parent != null) {
			if (transform.parent.GetComponent(Rigidbody)) {
				allowChunk = false;
			}
		}
		if (chunk == transform && allowChunk == true) {
			gameObject.AddComponent(Rigidbody);
			rigidbody.mass = chunkMass;
			rigidbody.drag = chunkDrag;
			rigidbody.angularDrag = chunkAngDrag;
			if (chunksUseGravity == false) {
				rigidbody.useGravity = false;
			}
			broken = false;
			transform.name += (" CHUNK! " + Random.Range(0, 99));
			//Debug.Log("New chunk created: " + transform.name);
			EnsureChunkSetup(gameObject);
		}
		else {
			transform.parent = chunk;
		}

		for (var i : int; i<isBaseOfParts.length; i++) {
			if (isBaseOfParts[i] != null) {
				var addable : boolean = true;
				if (chunkDistCheck == true) {
					if (chunkIntegCheck == false) {
						if (Vector3.Distance(transform.position, isBaseOfParts[i].transform.position) > maxPartDist) {
							addable = false;
						}
					}
					else {
						addable = VerifyChunkIntegrity(isBaseOfParts[i].transform);
					}
				}

				if (isBaseOfParts[i] != null) {
					if (addable == true) {
						if (Random.Range(0.0, 100.0) < addToChunksProba && isBaseOfParts[i].transform.parent != chunk) {
							if (isBaseOfParts[i].gameObject.GetComponent(Rigidbody)) {
								Destroy(isBaseOfParts[i].gameObject.GetComponent(Rigidbody));
							}
							isBaseOfParts[i].transform.parent = chunk;
							isBaseOfParts[i].SendMessage("ToAttachChunk", chunk);
						}
						else {
							//isBaseOfParts[i].SendMessage("ClearPreciseLink", gameObject);
							isBaseOfParts[i].SendMessage("ExternalBreakObject");
							ChunkCalledBreakObject(isBaseOfParts[i]);
							isBaseOfParts[i] = null;
						}
					}
					else {
						isBaseOfParts[i].SendMessage("ExternalBreakObject");
					}
				}
			}
		}

		if (chunk != transform) {
			yield WaitForSeconds(Random.Range(0.001, 0.01));
			transform.parent = chunk;
		}
	}
}

function EnsureChunkSetup (thisChunk : GameObject) {
	yield WaitForSeconds(0.1);
	if (thisChunk.GetComponent(Rigidbody)) {
		if (thisChunk.transform.parent != null) {
			if (thisChunk.transform.parent.GetComponent(Rigidbody)) {
				Debug.Log("Tried to make shit independent...");
//				thisChunk.transform.parent = null;
//				Debug.Log("Making shit independent: '" + thisChunk.transform.name + "'.");
			}
		}
		// Else: Everything's just fine here :)
	}
	else {
		// Wait, there's something wrong about this...
		thisChunk.AddComponent(Rigidbody);
		thisChunk.rigidbody.mass = chunkMass;
		thisChunk.rigidbody.drag = chunkDrag;
		thisChunk.rigidbody.angularDrag = chunkAngDrag;
		if (chunksUseGravity == false) {
			thisChunk.rigidbody.useGravity = false;
		}
		Debug.Log("Correcting chunk setup for '" + thisChunk.transform.name + "'.");
	}
}

function VerifyChunkIntegrity (addToChunk : Transform) : boolean {
	var integrity : boolean = false;
	var cons = GameObject.FindGameObjectsWithTag("ConnectionPoint");
	for (var pt0 : GameObject in cons) {
		var pt = pt0.transform;
		if (pt.parent == transform) {
			for (var con0 : GameObject in cons) {
				if (con0 != pt0 && integrity == false) {
					var con = con0.transform;
					if (con.parent == addToChunk) {
						if (Vector3.Distance(pt.position, con.position) < maxLinkDist) {
							integrity = true;
						}
					}
				}
			}
		}
	}
	return integrity;
}

function ChunkCalledBreakObject (toDestroy : DestroyMaster) {
	yield WaitForSeconds(0.01);
	if (toDestroy != null) {
		toDestroy.gameObject.SendMessage("ExternalBreakObject");
	}
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Controller/Destroy Master")