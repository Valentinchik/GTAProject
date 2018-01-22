using UnityEngine;
using UnityEngine.EventSystems;

namespace CnControls
{
    public class SimpleButton : MonoBehaviour, IPointerUpHandler, IPointerDownHandler
    {
        public bool ActiveButton = false;
        public bool DownActive = false;
        public string ButtonName = "Jump";
        
        private VirtualButton _virtualButton;
        
        private void OnEnable()
        {
            _virtualButton = _virtualButton ?? new VirtualButton(ButtonName);
            CnInputManager.RegisterVirtualButton(_virtualButton);
        }
        
        private void OnDisable()
        {
            CnInputManager.UnregisterVirtualButton(_virtualButton);
        }
        
        /// <param name="eventData">Data of the passed event</param>
        public void OnPointerUp(PointerEventData eventData)
        {
            ActiveButton = false;
            _virtualButton.Release();
        }
        
        /// <param name="eventData">Data of the passed event</param>
        public void OnPointerDown(PointerEventData eventData)
        {
            ActiveButton = true;
            DownActive = true;
            _virtualButton.Press();
        }
    }
}