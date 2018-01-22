
using UnityEngine;
using System.Collections;

public class CarDamage : MonoBehaviour {

	[SerializeField]float minForce= 1.0f;
	[SerializeField]float multiplier= 0.2f;
	[SerializeField]float deformRadius= 1.0f;
	[SerializeField]float deformNoise= 0.01f;
	[SerializeField]float deformNodeRadius= 2f;
	[SerializeField]float maxDeform= 0.3f;
	[SerializeField]float maxNodeRotationStep= 10.0f;
	[SerializeField]float maxNodeRotation= 10.0f;
	[SerializeField]float bounceBackSpeed= 0.1f;
	[SerializeField]float bounceBackSleepCap= 0.002f;
	[SerializeField]bool autoBounce= false;
	
	[SerializeField]MeshFilter[] DeformMeshes;
	[SerializeField]Transform[] DeformNodes;
	[SerializeField]MeshCollider[] DeformColliders;
	
	
	public class VertexData1 : System.Object
	{
		public Vector3[] permaVerts;
	}
	
	private VertexData1[] m_meshData;
	private VertexData1[] m_colliderData;
	
	private Vector3[] m_permaNodes;
	private Vector3[] m_permaNodeAngles;
	private bool[ ] m_nodeModified;
	
	private bool m_sleep= true;
	private bool m_doBounce= false;
	private int i;
	private int c;
	
	void  Start (){
		// Almacenar los vйrtices originales de los meshes a deformar
		
		m_meshData = new VertexData1[DeformMeshes.Length];
		
		
		
		for (i=0; i<DeformMeshes.Length; i++)
		{
			m_meshData[i] = new VertexData1();
			m_meshData[i].permaVerts = DeformMeshes[i].mesh.vertices;
		}
		
		// Almacenar los vйrtices originales de los colliders a deformar
		
		m_colliderData = new VertexData1[DeformColliders.Length];
		
		for (i=0; i<DeformColliders.Length; i++)
		{
			m_colliderData[i] = new VertexData1();
			m_colliderData[i].permaVerts = DeformColliders[i].sharedMesh.vertices;
		}	
		
		// Almacenar posiciуn y orientaciуn originales de los nodos a deformar
		
		m_permaNodes = new Vector3[DeformNodes.Length];
		m_permaNodeAngles = new Vector3[DeformNodes.Length];
		m_nodeModified = new bool[ DeformNodes.Length];
		
		for (i=0; i<DeformNodes.Length; i++)
		{
			m_permaNodes[i] = DeformNodes[i].localPosition;
			m_permaNodeAngles[i] = AnglesToVector(DeformNodes[i].localEulerAngles);
		}
	}
	
	
	private void  DeformMesh ( Mesh mesh ,   Vector3[] originalMesh ,   Transform localTransform ,   ContactPoint[] contactPoints ,   Vector3 contactForce  ){
		Vector3[] vertices= mesh.vertices;
		
		//	foreach(var contact in contactPoints)
		//		{	
		if (contactPoints.Length>0)
		{	
			ContactPoint contact= contactPoints[0];	
			if (contact.thisCollider.GetType() == typeof(WheelCollider)) return;//continue;	
			Vector3 contactPoint= localTransform.InverseTransformPoint(contact.point);
			
			for (int i=0; i<vertices.Length; i++)
			{
				float dist= (contactPoint-vertices[i]).magnitude;
				
				if (dist < deformRadius)
				{
					vertices[i] += (contactForce * (deformRadius - dist) / deformRadius) + Random.onUnitSphere * deformNoise;
					
					Vector3 deform= vertices[i]-originalMesh[i];
					if (deform.magnitude > maxDeform)
						vertices[i] = originalMesh[i] + deform.normalized * maxDeform;
				}
			}
		}
		
		mesh.vertices = vertices;
		mesh.RecalculateNormals();
		mesh.RecalculateBounds();
	}
	
	
	// Devuelve TRUE si se han modificado los бngulos. Asн se puede asegurar que sуlo se modifican una vez por cada colisiуn, en vez de una por contacto.
	
	private bool DeformNode ( Transform T ,   Vector3 originalLocalPos ,   Vector3 originalLocalRot ,   Vector3 contactPoint ,   Vector3 contactVector  ){
		bool result= false;	
		Vector3 localPos= transform.InverseTransformPoint(T.position);
		
		float dist= (contactPoint-localPos).magnitude;
		
		// Deformar posiciуn
		float deformForce=0;
		if (dist < deformRadius)
		{
			 deformForce= (deformRadius - dist) / deformRadius;
			
			T.localPosition += contactVector * deformForce + Random.onUnitSphere * deformNoise;
			
			Vector3 deform= T.localPosition - originalLocalPos;
			
			if (deform.magnitude > maxDeform)
				T.localPosition = originalLocalPos + deform.normalized * maxDeform;
			
			result = true;
		}
		
		// Deformar rotaciуn
		
		if (dist < deformNodeRadius)
		{
			Vector3 angles= AnglesToVector(T.localEulerAngles);
			
			Vector3 angleLimit=new Vector3(maxNodeRotation, maxNodeRotation, maxNodeRotation);		
			Vector3 angleMax= angles + angleLimit;
			Vector3 angleMin= angles - angleLimit;
			
			angles += deformForce * Random.onUnitSphere * maxNodeRotationStep;
			
			T.localEulerAngles =new Vector3(Mathf.Clamp(angles.x, angleMin.x, angleMax.x), Mathf.Clamp(angles.y, angleMin.y, angleMax.y), Mathf.Clamp(angles.z, angleMin.z, angleMax.z));
			
			result = true;		
		}
		
		return result;
	}
	
	
	// Devuelve TRUE si todos los vйrtices han alcanzado ya su posiciуn original, FALSE si queda alguno por llegar.
	
	private bool BounceMesh ( Mesh mesh ,   Vector3[] originalMesh ,   float bounceDelta  ){
		bool result= true;	
		Vector3[] vertices= mesh.vertices;
		
		for (int i=0;i<vertices.Length; i++) 
		{
			Vector3 deform= originalMesh[i] - vertices[i];
			
			vertices[i] += deform * bounceDelta;
			if (deform.magnitude >= bounceBackSleepCap) 
				result = false;
		}
		
		mesh.vertices = vertices;
		mesh.RecalculateNormals();
		mesh.RecalculateBounds();
		
		return result;
	}
	
	
	// Devuelve TRUE si todos los nodos han alcanzado ya su posiciуn y orientaciуn originales, FALSE si queda alguno por llegar.
	
	private bool BounceNode ( Transform T ,   Vector3 originalLocalPos ,   Vector3 originalLocalAngles ,   float bounceDelta  ){
		// Restaurar hacia la posiciуn original
		
		Vector3 deformPos= originalLocalPos - T.localPosition;	
		T.localPosition += deformPos * bounceDelta;
		
		// Restaurar hacia los бngulos originales
		
		Vector3 Angles= AnglesToVector(T.localEulerAngles);	
		Vector3 deformAngle= originalLocalAngles - Angles;
		Angles += deformAngle * bounceDelta;	
		T.localEulerAngles = Angles;
		
		// Los бngulos parece que pillan peor la tolerancia. Se les da el doble de margen, total se restaurarбn al terminar el proceso de Bounce.
		
		return deformPos.magnitude < bounceBackSleepCap && deformAngle.magnitude < (bounceBackSleepCap * 2); 
	}
	
	
	private void  RestoreNode ( Transform T ,   Vector3 originalLocalPos ,   Vector3 originalLocalAngles  ){
		T.localPosition = originalLocalPos;
		T.localEulerAngles = originalLocalAngles;
	}
	
	
	private Vector3 AnglesToVector ( Vector3 Angles  ){
		if (Angles.x > 180) Angles.x = -360+Angles.x;
		if (Angles.y > 180) Angles.y = -360+Angles.y;
		if (Angles.z > 180) Angles.z = -360+Angles.z;
		return Angles;
	}
	
	
	
	private void  RestoreColliders (){
		if (DeformColliders.Length > 0)
		{
			Vector3 CoM= GetComponent<Rigidbody>().centerOfMass;
			
			for (i=0; i<DeformColliders.Length; i++)
			{
				// Necesario un mesh intermedio con los datos actuales.
				
				Mesh mesh = new Mesh();
				mesh.vertices = m_colliderData[i].permaVerts;
				mesh.triangles = DeformColliders[i].sharedMesh.triangles;
				
				mesh.RecalculateNormals();
				mesh.RecalculateBounds();
				
				DeformColliders[i].sharedMesh = mesh;
			}
			
			GetComponent<Rigidbody>().centerOfMass = CoM;				
		}
	}
	
	
	//--------------------------------------------------------------
	void  OnCollisionEnter ( Collision collision  ){
		if (this.enabled) {
			if (collision.relativeVelocity.magnitude >= minForce && collision.transform.root.tag != "man") {
				m_sleep = false;
				Vector3 contactForce = transform.InverseTransformDirection (collision.relativeVelocity) * multiplier * 0.1f;
			
				// Deformar los meshes
			
				for (i=0; i<DeformMeshes.Length; i++)
					DeformMesh (DeformMeshes [i].mesh, m_meshData [i].permaVerts, DeformMeshes [i].transform, collision.contacts, contactForce);
			
				// Deformar los colliders
			
				if (DeformColliders.Length > 0) {
					Vector3 CoM = GetComponent<Rigidbody>().centerOfMass;
				
					for (i=0; i<DeformColliders.Length; i++) {
						// Necesario un mesh intermedio, no sirve mandar sharedMesh a deformar
					
						Mesh mesh = new Mesh ();
						mesh.vertices = DeformColliders [i].sharedMesh.vertices;
						mesh.triangles = DeformColliders [i].sharedMesh.triangles;
					
						DeformMesh (mesh, m_colliderData [i].permaVerts, DeformColliders [i].transform, collision.contacts, contactForce);				
						DeformColliders [i].sharedMesh = mesh;
					}
				
					GetComponent<Rigidbody>().centerOfMass = CoM;
				}
			
				// Deformar los nodos. Cada uno se modifica una vez por cada colisiуn, usando el punto de contacto que primero lo modifique.
			
				for (i=0; i<DeformNodes.Length; i++)
					m_nodeModified [i] = false;
			
				for (c=0; c<collision.contacts.Length; c++) {
					if (collision.contacts [c].thisCollider.GetType () == typeof(WheelCollider))
						continue;
					Vector3 contactPoint = transform.InverseTransformPoint (collision.contacts [c].point);
				
					for (i=0; i<DeformNodes.Length; i++)
						if (!m_nodeModified [i])
							m_nodeModified [i] = DeformNode (DeformNodes [i], m_permaNodes [i], m_permaNodeAngles [i], contactPoint, contactForce);
				}
			}
		}
	}
	
	//--------------------------------------------------------------
	
	void  DoBounce (){
		m_doBounce = true;
		m_sleep = false;
	}
	
	
	
	//--------------------------------------------------------------
	void  Update (){
		if (!m_sleep && (autoBounce || m_doBounce) && bounceBackSpeed > 0) 
		{
			float deformDelta= Time.deltaTime * bounceBackSpeed;
			
			m_sleep = true;
			
			// Mover los meshes hacia su posiciуn original
			
			for (i=0; i<DeformMeshes.Length; i++)
				m_sleep &= BounceMesh(DeformMeshes[i].mesh, m_meshData[i].permaVerts, deformDelta);
			
			// Mover los nodos hacia su posiciуn y orientaciуn originales
			
			for (i=0; i<DeformNodes.Length; i++)
				m_sleep &= BounceNode(DeformNodes[i], m_permaNodes[i], m_permaNodeAngles[i], deformDelta);
			
			// Al finalizar la restauraciуn progresiva los nodos se llevan a sus posiciones y orientaciones exactas (evitar errores de aproximaciуn)
			// Los colliders tambiйn se restauran de una vez.
			
			if (m_sleep)
			{
				m_doBounce = false;
				
				// Restaurar estado exacto de los nodos
				
				for (i=0; i<DeformNodes.Length; i++)
					RestoreNode(DeformNodes[i], m_permaNodes[i], m_permaNodeAngles[i]);
				
				// Restaurar estado exacto de los colliders
				
				RestoreColliders();
			}			
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}