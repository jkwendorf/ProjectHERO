var projectile : Rigidbody;
var initialSpeed = 20.0;
var reloadTime = 0.5;
var ammoCount = 20;
var clips : int = 5;
var rest : int = 0;
var errorAngle = 0.0;
private var lastShot = -10.0;
var auto : boolean = false;
var input : boolean = false;
var inputType : int = 0;	// Defines which mouse button fires.

function Start() {
	if (!projectile) {
		var Projectile1 : Rigidbody = GameObject.FindWithTag("Projectile").GetComponent(Rigidbody);
		projectile = Projectile1;
	}
}
function Projectile (proj : Rigidbody) {
	if (proj)
		projectile = proj;
}

function Update () {
	if (input == true) {
		if (auto == true) {
			if (Input.GetMouseButton(inputType)) {
				Fire();
			}
		}
		else {
			if (Input.GetMouseButtonDown(inputType)) {
				Fire();
			}
		}
	}
	if (clips < 0 && rest > 0) {
		clips = 0;
		ammoCount = rest;
		rest = 0;
	}
}

function Fire() {
	// Did the time exceed the reload time?
	if (Time.time > reloadTime + lastShot && ammoCount > 0  && clips >= 0) {
		var oldRotation = transform.rotation;
		transform.rotation =  Quaternion.Euler(Random.insideUnitSphere*errorAngle) * transform.rotation;

		// create a new projectile, use the same position and rotation as the Launcher.
		var instantiatedProjectile : Rigidbody = Instantiate (projectile, transform.position, transform.rotation);

		var ProjSpeed = Random.Range(initialSpeed - 2, initialSpeed + 2);

		// Give it an initial forward velocity. The direction is along the z-axis of the missile launcher's transform.
		instantiatedProjectile.velocity = transform.TransformDirection(Vector3 (0, 0, ProjSpeed));

		transform.rotation = oldRotation;

		// Ignore collisions between the missile and the character controller
		for(c in transform.root.GetComponentsInChildren(Collider))
			Physics.IgnoreCollision(instantiatedProjectile.collider, c);

		lastShot = Time.time;
		ammoCount--;
	}
	if (ammoCount <= 0) {
		SendMessage("Reload", transform, SendMessageOptions.DontRequireReceiver);
	}
}