var cam : Camera;
var normal = 60.0;
var normDist = 1000.0;
var zoom = 20.0;
var zoomDist = 2000.0;
var zoomSpeed = 0.1;
var input : String = "b";
private var t = 0.0;

function Start () {
	t = 0.0;
	cam.fieldOfView = normal;
}

function FixedUpdate () {
	cam.fieldOfView = Mathf.Lerp(normal, zoom, t);
	cam.farClipPlane = Mathf.Lerp(normDist, zoomDist, t);
	if (Input.GetKey(input)) {
		if (t < 1.0) {
			t += zoomSpeed;
		}
	}
	else {
		if (t >= 0.1) {
			t -= zoomSpeed;
		}
	}
}