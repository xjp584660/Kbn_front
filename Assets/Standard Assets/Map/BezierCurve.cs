// BezierCurve.cs
//
// Brief: A cubic bezier curve class.
// Created: Hong Pan
// Note: Courtesy of the KOM team.
using UnityEngine;
using System.Collections;

public class BezierCurve : System.Object {
	// 4 ctrl points
	public Vector3 p0;
	public Vector3 p1;
	public Vector3 p2;
	public Vector3 p3;
	

	private Vector3 b0 = Vector3.zero;
	private Vector3 b1 = Vector3.zero;
	private Vector3 b2 = Vector3.zero;
	private Vector3 b3 = Vector3.zero;
	private float Ax;
	private float Ay;
	private float Az;
	private float Bx;
	private float By;
	private float Bz;
	private float Cx;
	private float Cy;
	private float Cz;
	
	public BezierCurve( Vector3 v0, Vector3 v1, Vector3 v2, Vector3 v3  ) {
		this.p0 = v0;
		this.p1 = v1;
		this.p2 = v2;
		this.p3 = v3;
	}
	
	public float getY( float t ) {
		checkDirty();
		float t2 = t * t;
		float t3 = t * t * t;
		float height = Ay * t3 + By * t2 + Cy * t + p0.y;
		return height;
	}
	
	public Vector3 getPoint(float t) {
		checkDirty();
		float t2 = t * t;
		float t3 = t * t * t;
		float x = Ax * t3 + Bx * t2 + Cx * t + p0.x;
		float y = Ay * t3 + By * t2 + Cy * t + p0.y;
		float z = Az * t3 + Bz * t2 + Cz * t + p0.z;
		return new Vector3( x, y, z );
	}
	
	private void updateCoe() {
		Cx = 3f * ( ( p0.x + p1.x ) - p0.x );
		Bx = 3f * ( ( p3.x + p2.x ) - ( p0.x + p1.x ) ) - Cx;
		Ax = p3.x - p0.x - Cx - Bx;
		
		Cy = 3f * ( ( p0.y + p1.y ) - p0.y );
		By = 3f * ( ( p3.y + p2.y ) - ( p0.y + p1.y ) ) - Cy;
		Ay = p3.y - p0.y - Cy - By;
		
		Cz = 3f * ( ( p0.z + p1.z ) - p0.z );
		Bz = 3f * ( ( p3.z + p2.z ) - ( p0.z + p1.z ) ) - Cz;
		Az = p3.z - p0.z - Cz - Bz;
	}
	
	private void checkDirty() {
		if( p0 != b0 || p1 != b1 || p2 != b2 || p3 != b3 ) {
			updateCoe();
			b0 = p0;
			b1 = p1;
			b2 = p2;
			b3 = p3;
		}
	}
}