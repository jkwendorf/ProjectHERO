#pragma strict

// The reference to the explosion prefab
var explosion : GameObject;
var timeOut = 3.0;
var zOffset = -0.5;		// Explosion distance from impact point.
private var exploded : boolean = false;
var detachChildren : boolean = true;

// Kill the rocket after a while automatically
function Start () {
	Invoke("Kill", timeOut);
}

function OnCollisionEnter (collision : Collision) {
	// Instantiate explosion at the impact point and rotate the explosion
	// so that the y-axis faces along the surface normal

	if (exploded == false) {
		exploded = true;
		var contact : ContactPoint = collision.contacts[0];
		var rotation = Quaternion.FromToRotation(Vector3.up, contact.normal);
		var cPt = contact.point + transform.forward * zOffset;
		Instantiate (explosion, cPt, rotation);
	}

	// And kill our selves
	Kill();
}

function Kill () {
	// Stop emitting particles in any children
	var emitter : ParticleEmitter= GetComponentInChildren(ParticleEmitter);
	if (emitter) {
		emitter.emit = false;
	}
	// Detach children - We do this to detach the trail rendererer which should be set up to auto destruct
	if (detachChildren == true) {
		transform.DetachChildren();
	}

	// Destroy the projectile
	Destroy(gameObject);
}

@script RequireComponent (Rigidbody)