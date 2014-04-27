#pragma strict

var maxMomentum = 75.0;			// p = p1 + p2, p = m * v
var destroyer : GameObject;		// Leave blank if this is the breakable part/object itself.

function Start () {
	if (destroyer == null) {
		destroyer = gameObject;
	}
}

function SetMomentum (newMom : float) {
	maxMomentum = newMom;
}
function SetDestroyer (newDestr : GameObject) {
	destroyer = newDestr;
}
function SetMass (newMass : float) {
	if (destroyer == null) {
		destroyer = gameObject;
	}
	if (destroyer.GetComponent(Rigidbody)) {
		destroyer.GetComponent(Rigidbody).mass = newMass;
	}
}

function OnCollisionEnter (coll : Collision) {
	var ownMomentum = Vector3.zero;
	if (destroyer.GetComponent(Rigidbody)) {
		var self = destroyer.GetComponent(Rigidbody);
		ownMomentum = self.velocity * self.mass;
	}
	var collMomentum = Vector3.zero;
	var collMass = 1.0;
	if (coll.gameObject.GetComponent(Rigidbody)) {
		var other = coll.gameObject.GetComponent(Rigidbody);
		collMass = other.mass;
	//	collMomentum = other.velocity * other.mass;
	}
	collMomentum = coll.relativeVelocity * collMass;
	var totalMomentum = ownMomentum - collMomentum;
	var p = totalMomentum.magnitude;
	if (p >= maxMomentum) {
		destroyer.SendMessage("InternalBreakObject");
	}
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Trigger/On collision")