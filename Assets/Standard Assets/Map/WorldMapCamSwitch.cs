// Created: Pan Hong
using UnityEngine;
using System.Collections;

public class WorldMapCamSwitch : MonoBehaviour {

	//-----------------------------------------------------------------------------------
	// Public interfaces
	//-----------------------------------------------------------------------------------
	public float m_offsetX = -48.6f;
	public float m_offsetY = 19f;
	public float m_offsetZ = -47f;
	public float m_rotX = 35f;
	public float m_rotY = 45f;
	public float m_rotZ = 0f;

	public float m_size = 7.0f;

	// Unity will perform the rendering as the following order:
	//
	// Call OnPreCull()
	// Culling
	// Call OnPreRender()
	// Render the scene
	// Call OnPostRender()
	//
	// So we need to handle the camera's transform before
	// rendering here in order to get the right and consistent
	// culling result.

	public void SwitchOn() {
		if (switchedOn)
			return;
		switchedOn = true;

		m_cameraPosBackup.x = transform.localPosition.x;
		m_cameraPosBackup.y = transform.localPosition.y;
		m_cameraPosBackup.z = transform.localPosition.z;
		m_cameraRotBackup.x = transform.localRotation.eulerAngles.x;
		m_cameraRotBackup.y = transform.localRotation.eulerAngles.y;
		m_cameraRotBackup.z = transform.localRotation.eulerAngles.z;
		//m_cameraSizeBackup = camera.orthographicSize;
		m_cameraSizeBackup = GetComponent<Camera>().fieldOfView;
		Vector3 tmp = new Vector3( m_offsetX, m_offsetY, m_offsetZ );
		transform.localPosition = transform.localPosition + tmp;
		transform.localRotation = Quaternion.Euler( m_rotX, m_rotY, m_rotZ );
		//camera.orthographicSize = m_size;
		GetComponent<Camera>().fieldOfView = m_size;
	}

	public void SwitchOff() {
		if (!switchedOn)
			return;
		switchedOn = false;

		transform.localPosition = new Vector3( m_cameraPosBackup.x,
		                                      m_cameraPosBackup.y,
		                                      m_cameraPosBackup.z );
		transform.localRotation = Quaternion.Euler( m_cameraRotBackup.x,
		                                           m_cameraRotBackup.y,
		                                           m_cameraRotBackup.z );
		//camera.orthographicSize = m_cameraSizeBackup;
		GetComponent<Camera>().fieldOfView = m_cameraSizeBackup;
	}

	void OnPreCull() {
		SwitchOn();
	}

	void OnPreRender() {
		// Stub here, do nothing for now...
	}
	
	
	void OnPostRender() {
		SwitchOff();
	}
	//-----------------------------------------------------------------------------------
	// Underlying implementations
	//-----------------------------------------------------------------------------------

	private Vector3 m_cameraPosBackup = new Vector3();
	private Vector3 m_cameraRotBackup = new Vector3();
	//private float m_cameraSizeBackup = 7.0f;
	private float m_cameraSizeBackup = 9.0f;
	private bool switchedOn = false;
}
