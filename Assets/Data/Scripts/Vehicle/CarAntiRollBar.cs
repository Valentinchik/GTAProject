//========================================================================================================================
// Edy Vehicle Physics - (c) Angel Garcia "Edy" - Oviedo, Spain
// http://www.edy.es/dev/vehicle-physics
// 
// Terms & Conditions:
//  - Use for unlimited time, any number of projects, royalty-free.
//  - Keep the copyright notices on top of the source files.
//  - Resale or redistribute as anything except a final product to the end user (asset / library / engine / middleware / etc.) is not allowed.
//  - Put me (Angel Garcia "Edy") in your game's credits as author of the vehicle physics.
//
// Bug reports, improvements to the code, suggestions on further developments, etc are always welcome.
// Unity forum user: Edy
//========================================================================================================================
//
// CarAntiRollBar
//
// Provides anti-roll bar simulation. Use one script per axle. 
//
//========================================================================================================================

using UnityEngine;
using System.Collections;

public class CarAntiRollBar : MonoBehaviour
{

	// ParГЎmetros

	public WheelCollider WheelL;
	public WheelCollider WheelR;
	public float AntiRoll = 5000.0f;
	public float AntiRollFactor = 1.0f;
	public float AntiRollBias = 0.5f;
	public int StrictMode = 0;
	
	// Datos para telemetrГ­a
	
	private float m_extensionL = 0.0f;
	private float m_extensionR = 0.0f;
	private float m_antiRollForce = 0.0f;
	private float m_antiRollRatio = 0.0f;
	
	public float getExtensionL ()
	{
		return m_extensionL;
	}

	public float getExtensionR ()
	{
		return m_extensionR;
	}

	public float getAntiRollForce ()
	{
		return m_antiRollForce;
	}

	public float getAntiRollRatio ()
	{
		return m_antiRollRatio;
	}

	public float getAntiRollTravel ()
	{
		return m_extensionL - m_extensionR;
	}
	
	// ImplementaciГіn de la barra estabilizadora
	
	void FixedUpdate ()
	{ 
		WheelHit hitL = new WheelHit (); 
		WheelHit hitR = new WheelHit (); 

		bool groundedL = WheelL.GetGroundHit (out hitL); 	
		if (groundedL) 
			m_extensionL = (-WheelL.transform.InverseTransformPoint (hitL.point).y - WheelL.radius) / WheelL.suspensionDistance;
		else
			m_extensionL = 1.0f;

		bool groundedR = WheelR.GetGroundHit (out hitR); 
		if (groundedR)
			m_extensionR = (-WheelR.transform.InverseTransformPoint (hitR.point).y - WheelR.radius) / WheelR.suspensionDistance;
		else
			m_extensionR = 1.0f;

		m_antiRollRatio = Bias (m_extensionL - m_extensionR, AntiRollBias);
		m_antiRollForce = m_antiRollRatio * AntiRoll * AntiRollFactor;
	
		// Modo Strict: Afecta al caso en que una rueda estГЎ levantada y la otra apoyada. 
		// Si se quita una fuerza en un sitio, reponerla en otro para mantener el peso total constante.
		// 
		// - Strict 0: desactivado, sГіlo hay fuerza en la rueda apoyada.
		// - Strict 1: reponer la fuerza de la rueda levantada en el centro de masas.
		// - Strict 2: aplicar las fuerzas en las ruedas independientemente de que estГ©n apoyadas o no.

		if (groundedL || StrictMode == 2)
			GetComponent<Rigidbody>().AddForceAtPosition (WheelL.transform.up * -m_antiRollForce, WheelL.transform.position);
		else if (StrictMode == 1)
			GetComponent<Rigidbody>().AddForce (WheelL.transform.up * -m_antiRollForce);

		if (groundedR || StrictMode == 2) 
			GetComponent<Rigidbody>().AddForceAtPosition (WheelR.transform.up * m_antiRollForce, WheelR.transform.position);
		else if (StrictMode == 1)
			GetComponent<Rigidbody>().AddForce (WheelL.transform.up * m_antiRollForce);
	}

	private float m_lastExponent = 0.0f;
	private float m_lastBias = -1.0f;

	private float BiasRaw (float x, float fBias)
	{
		if (x <= 0.0f)
			return 0.0f;
		if (x >= 1.0f)
			return 1.0f;

		if (fBias != m_lastBias) {
			if (fBias <= 0.0f)
				return x >= 1.0f ? 1.0f : 0.0f;
			else if (fBias >= 1.0f)
				return x > 0.0f ? 1.0f : 0.0f;
			else if (fBias == 0.5f)
				return x;

			m_lastExponent = Mathf.Log (fBias) * -1.4427f;
			m_lastBias = fBias;
		}

		return Mathf.Pow (x, m_lastExponent);
	}

	
	// Bias simГ©trico usando sГіlo la curva inferior (fBias < 0.5)
	// Admite rango -1, 1 aplicando efecto simГ©trico desde 0 hacia +1 y -1.

	private float Bias (float x, float fBias)
	{
		float fResult;
		
		fResult = fBias <= 0.5f ? BiasRaw (Mathf.Abs (x), fBias) : 1.0f - BiasRaw (1.0f - Mathf.Abs (x), 1.0f - fBias);
	
		return x < 0 ? -fResult : fResult;
	}









	

/* POR PROBAR:

Unir la rueda al vehГ­culo mediante un Joint configurable. 
En reposo, sin barra, el joint mantiene el wheelcollider en su posiciГіn original mientras Г©sta hace su tarea normal.
Con la barra en acciГіn, un joint sube su rueda mientras el otro baja la suya, intentando llegar a una posiciГіn
objetivo con una fuerza determinada.

DEBEMOS SEGUIR UN TUTORIAL DE JOINTS en primer lugar.

PROBLEMA: Los lГ­mites no son "DUROS", se indica una fuerza o muelle para mantenerse dentro del lГ­mite. HabrГ­a que probar.

-----

TambiГ©n probar a mover la rueda usando el centro del collider en vez del transform del gameobject.
Cambiar el parГЎmetro en real-time produce el mismo efecto que configurarlo
desde el principio. Los cambios en posiciГіn del gameobject en real-time NO son cosistentes: dan resultados distintos.

IMPORTANTE: CAMBIAR PARГЃMETROS EN CUALQUIER COLLIDER RECALCULA EL CENTRO DE MASAS.


Otras posibles implementaciones probadas:


- Doblando la fuerza en la rueda interior, para compensar la pГ©rdida de agarre en la exterior:
  MUY INTERESANTE! Mucho mГЎs agarre, parece "pedir" unos nuevos parГЎmetros de curva, para esta nueva situaciГіn.
  Pero las pГ©rdidas de adherencia (ej. al levantarse la rueda interior, o en irregularidades del terreno) son mГЎs cantosas.
  Esperar a tener velocidad mГЎxima, gearbox, etc.
  
	if (groundedL)
		{
		tmp = 1.0;
		if (m_antiRollForce > 0) tmp *= 2.0;
        rigidbody.AddForceAtPosition(WheelL.transform.up * -m_antiRollForce*tmp, WheelL.transform.position); 
		}
  

- Ajustando los muelles de la suspensiГіn: no va bien. Se puede hacer que coja el valor correctamente sumando Epsilon a la distancia de
  suspensiГіn (provoca recalcular pero no modifica la distancia). Pero los cambios parecen provocar que el muelle acabe
  comprimido en el valor mГЎs bajo que se le dГ©, hasta que se expanda de forma natural. Endurecer el muelle dinГЎmicamente
  tampoco parece tener efecto notable. FIN DE LA HISTORIA.
- Ponderando la fuerza con la normal del terreno: inadecuado.
- Limitando la fuerza a aplicar segГєn la fuerza que haya en los muelles: reduce enormemente la eficiacia.

- Calculando la estabilizaciГіn en funciГіn de la diferencia de cargas de la ruedas (hit.force: (R-L) / (R+L)): provoca inestabilidad.
	Variante: ponderando con el muelle. Provoca inestabilidad.

		m_extensionR = Mathf.Clamp01(hitR.force / WheelR.suspensionSpring.spring);



- Moviendo la posiciГіn de los WheelColliders: 
	No es posible matener la posiciГіn sincronizada con la extensiГіn de la suspensiГіn: si movemos el collider para
	ocupar la posiciГіn libre de la suspensiГіn, entonces va oscilando. HabrГ­a que conocer la posiciГіn del muelle en reposo.
	Mover la posiciГіn todo el recorrido de la suspensiГіn NO genera fuerza anti-roll.
	Mover la posiciГіn mucho provoca inestabilidad, y sigue sin generar fuerza anti-roll. FIN DE LA HISTORIA.

	m_antiRollForce = (m_extensionL - m_extensionR) * WheelL.suspensionDistance * AntiRollFactor;

	WheelL.transform.localPosition.y = m_startPosL + m_antiRollForce*2;
	WheelR.transform.localPosition.y = m_startPosR - m_antiRollForce*2;

	
- Usando Configurable Joint: No parece que haya una configuraciГіn que permita al weelcollider mantenerse fijo en
	comportamiento normal. La idea serГ­a aГ±adir fuerza desde la posiciГіn normal, pero parece jodido.	


- Aplicando fuerza en todo momento, tanto si las ruedas estГЎn levantadas como si no.
	Maximiza enormemente el efecto de la barra, pero falsea la caida natural y el equilibrio sobre dos ruedas.
	Variante: aplicar fuerza directamente abajo (transform.up) en las ruedas levantadas: PrГЎcticamente igual.

        rigidbody.AddForceAtPosition(WheelL.transform.up * -m_antiRollForce, WheelL.transform.position); 
        rigidbody.AddForceAtPosition(WheelR.transform.up * m_antiRollForce, WheelR.transform.position); 

		

- Aplicando fuerza en ambas ruedas si estГЎn en el suelo, y sГіlo en la rueda levantada si la otra estГЎ posada.
	Bastante bien, pero falsea el efecto de caida natural y el equilibrio sobre 2 ruedas.

	if (groundedL && groundedR)
		{
        rigidbody.AddForceAtPosition(WheelL.transform.up * -m_antiRollForce, WheelL.transform.position);
        rigidbody.AddForceAtPosition(WheelR.transform.up * m_antiRollForce, WheelR.transform.position);
		}
	else
	if (groundedL)
        rigidbody.AddForceAtPosition(WheelR.transform.up * m_antiRollForce, WheelR.transform.position);
	else
	if (groundedR)
        rigidbody.AddForceAtPosition(WheelL.transform.up * -m_antiRollForce, WheelL.transform.position);		
*/
}
