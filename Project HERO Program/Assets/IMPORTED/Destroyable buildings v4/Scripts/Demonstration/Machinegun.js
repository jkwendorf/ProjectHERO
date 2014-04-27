#pragma strict

var limitedAmmo : boolean = true;		// Do we have infnite ammo?
var bulletSpread : boolean = true;		// Is this gun always precise?
var multipleMuzzles : boolean = false;	// Have we got more muzzle?
var fireModes : boolean = false;		// Do we offer semi-auto?
var limitedSpeed : boolean = false;		// Does the bullets travel at realistic velocities?
var reportShot : boolean = false;		// Wether to send a message after each shot.
var reportDepleated : boolean = false;	// Wether to send a message if our ammo is depleated.
var addRecoil : boolean = false;		// Wether a recoil force is added to the gunner.
var multipleHitFx : boolean = false;
var singleSound : boolean = false;
var displayAmmo : boolean = false;

var ammo : int = 30;		// Ammo left in clip.
var clip : int = 30;		// Ammo in full clip.
var clips : int = 5;		// Number of clips.
var rest : int = 0;			// Bullets left from reloads.

var rate = 0.2;				// Interval between shots.
var reload = 1.0;			// Duration of a reload.
private var last = 0.0;		// Moment of our most recent shot.
private var first : boolean = true;		// Wether this is the first shot of a salve.
private var fire : boolean = false;		// Wether we will shoot now.
var spread = 2.0;			// Angle at which the bullets are spread.
var range = 200.0;			// The maximum raycasting distance.
var speed = 100.0;			// The speed at which the bullet travels (m/s).	Not implemented yet.
var damage = 5.0;			// The damage inflicted by this weapon.
var force = 100.0;			// The impact force of the bullet.
var layers : LayerMask;		// The layers we can hit.

var useInput : boolean = true;
var input : int = 0;
var mode : int = 0;					// 0=Semi, 1=Auto	Not implemented yet.
var muzzles : Transform[];			// [0] must be non-null.
private var nextMuzzle : int = 0;	// The next barrel to be fired.
private var shootPos : Transform;	// The current or the primary barrel.
var receiver : GameObject;			// Whom to report our last shot.
var ammoDisplay : GameObject;		// Whom to send our ammo level.
var emptyReport : GameObject;		// Whom to report if all our ammo is depleated.
var reloadReport : GameObject;		// Whom to report if we're reloading the gun.
var hitEffect : Transform[];		// Graphical stuff to indicate the place we hit.
var shootSound : AudioClip;			// Bam.
var emptySound : AudioClip;
var reloadSound : AudioClip;
var recoilDest : Rigidbody;
var recoilForce = 30.0;
var minSoundDur = 0.1;

function Start () {
	if (singleSound == true) {
		audio.clip = shootSound;
		audio.Stop();
	}
	if (displayAmmo == true) {
		var ammoLevel : int = (clips * clip + rest);
		ammoDisplay.SendMessage("AmmoInClip", ammo);
		ammoDisplay.SendMessage("AmmoInStock", ammoLevel);
	}
}

function Fire () {
	if (Time.time >= last + rate) {
		if (ammo > 0) {
			fire = true;
		}
		else {
			if (emptySound != null) {
				audio.PlayOneShot(emptySound);
			}
			if (clips > 0 || rest > 0) {
				last = Time.time;
			}
			else {
				last = Time.time + 0.15;
				if (reportDepleated == true && emptyReport != null) {
					emptyReport.SendMessage("AmmoDepleated");
				}
			}
		}
	}
}

function Update () {
	if (useInput == true) {
		if (Input.GetMouseButton(input) && Time.time >= last + rate) {
			if (ammo > 0) {
				fire = true;
			}
			else {
				if (emptySound != null) {
					audio.PlayOneShot(emptySound);
					last = Time.time + rate;
				}
				fire = false;
			}
		}
		else {
			fire = false;
		}
	}
	if (fire == true) {
		// Reduce ammo count:
		if (limitedAmmo == true) {
			ammo --;
			// Show our current ammo level:
			if (displayAmmo == true) {
				var ammoLevel : int = (clips * clip + rest);
				ammoDisplay.SendMessage("AmmoInClip", ammo);
				ammoDisplay.SendMessage("AmmoInStock", ammoLevel);
			}
		}

		// Muzzle switches:
		if (multipleMuzzles == true) {
			shootPos = muzzles[nextMuzzle];
			nextMuzzle ++;
			if (nextMuzzle >= muzzles.length) {
				nextMuzzle = 0;
			}
		}
		else {
			shootPos = muzzles[0];
		}

		// Report shots:
		if (reportShot == true) {
			receiver.SendMessage("Fired", shootPos);
		}

		// Add recoil:
		if (addRecoil == true) {
			recoilDest.AddForce(-transform.forward * recoilForce);
		}

		// Modify shooting angle:
		var direction : Vector3;
		if (bulletSpread == true && first == false) {
			direction =  Quaternion.Euler(Random.insideUnitSphere*spread) * transform.forward;
		}
		else {
			direction = transform.forward;
		}

		// Adjust travel time AND the shot:
		if (limitedSpeed == true) {
			Debug.Log("Not implemented yet :S");
		}
		else {
			var hit : RaycastHit;
			if (Physics.Raycast(shootPos.position, direction, hit, range, layers)) {
				if (hit.transform) {
					hit.transform.gameObject.SendMessage("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
					if (hit.rigidbody) {
						hit.rigidbody.AddForceAtPosition(direction * force, hit.point);
					}
					if (multipleHitFx == false) {
						if (hitEffect[0] != null) {
							var he0 = Instantiate(hitEffect[0], hit.point, Quaternion.FromToRotation(Vector3.up, hit.normal));
							he0.gameObject.SetActive(true);
						}
					}
					else {
						var nhe = Random.Range(0, hitEffect.length);	// nhe = next hit effect.
						var heR = Instantiate(hitEffect[nhe], hit.point, Quaternion.FromToRotation(Vector3.up, hit.normal));
						heR.gameObject.SetActive(true);
					}
					//Debug.Log(hit.transform.name);
				}
			}
		}

		if (shootSound != null) {
			if (singleSound == true) {
				if (audio.isPlaying == false) {
					audio.Play();
				}
			}
			else {
				audio.PlayOneShot(shootSound);
			}
		}

		// Finish off shooting sequence:
		first = false;
		last = Time.time;
		fire = false;
	}
	if (useInput == true) {
		if (Input.GetMouseButtonUp(input)) {
			if (singleSound == true) {
				StopSound(minSoundDur);
			}
			first = true;
		}
	}
	if (ammo <= 0) {
		if (clips > 0 || rest > 0) {
			Reload();
		}
	}
	if (ammo > 0 && ammo < clip) {
		if (clips > 0 || rest > 0) {
			if (useInput == true && Input.GetKeyDown("r")) {
				Reload();
			}
		}
		else {
			//Debug.Log("Ammunition depleated.");
		}
	}
}

function RequestReload () {
	if (ammo > 0 && ammo < clip) {
		if (clips > 0 || rest > 0) {
			Reload();
		}
		else {
			//Debug.Log("Ammunition depleated.");
		}
	}
}

function Reload () {
	last = Time.time + reload;
	rest += ammo;
	ammo = 0;
	if (rest >= clip) {
		clips ++;
		rest -= clip;
	}
	if (reloadSound != null) {
		if (rest > 0 || clips > 0) {
			audio.PlayClipAtPoint(reloadSound, transform.position);
		}
	}
	if (reloadReport != null) {
		reloadReport.SendMessage("ReloadWeapon");
	}
	if (clips > 0) {
		clips --;
		ammo = clip;
	}
	else {
		ammo = rest;
		rest = 0;
	}
	if (displayAmmo == true) {
		var ammoLevel : int = (clips * clip + rest);
		ammoDisplay.SendMessage("AmmoInClip", ammo);
		ammoDisplay.SendMessage("AmmoInStock", ammoLevel);
	}
	yield;
}

function StopSound (waitTime : float) {
	//Disables the shooting sound loop after the currently played shot is fired.
	yield WaitForSeconds(waitTime);
	audio.Stop();
}