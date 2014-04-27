#pragma strict

var limitVelocity : boolean = false;
var maxVelocity = 100.0;

function SetInitialVelocity (initSpeed : Vector3) {
	var rbs = gameObject.GetComponentsInChildren(Rigidbody);
	var initSpeed1 = initSpeed;
	if (limitVelocity == true) {
		if (initSpeed.magnitude > maxVelocity) {
			initSpeed1 = Vector3.Normalize(initSpeed) * maxVelocity;
		}
	}
	if (rbs.length > 0) {
		for (var rb : Component in rbs) {
			rb.GetComponent(Rigidbody).velocity = initSpeed1;
		}
	}
	Destroy(GetComponent(DebrisVelocity));
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Debris/Debris initial velocity")