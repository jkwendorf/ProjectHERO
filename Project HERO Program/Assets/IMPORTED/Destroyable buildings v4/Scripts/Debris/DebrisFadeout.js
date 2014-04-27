#pragma strict

// WARNING! DEBRIS MATERIAL NEEDS TO BECOME TRANSPARENT!
// Always use a transparent material, alpha initially set to maximum!

var delay = 3.0;
private var startTime = 0.0;
var duration = 3.0;
private var alpha = 1.0;
private var speed = 0.001;

function Start () {
	startTime = Time.time;
	speed = 1.0/duration;
	Invoke("DestroyDebris", (duration + delay + 0.03));
}

function FixedUpdate () {
	var rends = gameObject.GetComponentsInChildren(MeshRenderer);
	if (Time.time > startTime + delay) {
		alpha -= speed * Time.deltaTime;
		for (var rend0 : Component in rends) {
			var rend = rend0.gameObject.GetComponent(MeshRenderer);
			rend.material.color.a = alpha;
		}
	}
}

function DestroyDebris () {
	Destroy(gameObject);
}

@script AddComponentMenu("Scripts/Destroyable Buildings v4/Debris/Debris fadeout")