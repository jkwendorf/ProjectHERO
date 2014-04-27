#pragma strict

var maxRotSpeed : Vector3;
var minRotSpeed : Vector3;

function Start () {
	var x = Random.Range(minRotSpeed.x, maxRotSpeed.x);
	var y = Random.Range(minRotSpeed.y, maxRotSpeed.y);
	var z = Random.Range(minRotSpeed.z, maxRotSpeed.z);
	var addRot = transform.right * x + transform.up * y + transform.forward * z;
	rigidbody.angularVelocity += addRot;
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Debris/Debris initial torque")