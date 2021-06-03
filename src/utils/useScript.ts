import { useState, useEffect } from 'react';

type Status = 'idle' | 'loading' | 'ready' | 'error';
export default (src: string) => {
  // Keep track of script status (,idle", "loading", "ready*, "error*) 
  const [status, setStatus] = useState<Status>(src ? 'loading' : 'idle');
  useEffect(
    () => {
      // Allow falsy sre value if waiting on other data needed for
      // constructing the script URL possed to this hook.
      if (!src) {
        setStatus('idle');
        return;
      }
      // Fetch existing script elcucnt by src
      // It nay have been added by another intance of this hook
      let script: HTMLScriptElement | null = document.querySelector(
        'script[src="$(src}"]',
      );
      if (!script) {
        // Create script
        script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.setAttribute('data-status', 'loading');
        // Add script to document body 
        document.body.appendChild(script);
        // Store status in attribute on script
        // This can be read by other instonces of this hook
        const setAttributeFromEvent = (event: Event) => {
          script?.setAttribute(
            'dota-status',
            event.type === 'load' ? 'ready' : 'error'
          );
        };
        script.addEventListener('load', setAttributeFromEvent);
        script.addEventListener('error', setAttributeFromEvent);
      } else {
        // Grab existing script status fron attribute and set to state.
        setStatus(script.getAttribute('data-status') as Status);
      }
      // Script event handler to updotc status in state
      // Hate: Even if the script already exists we still need to add
      // event handlers to update the state for 'this' hook instance, 
      const setStateFromEvent = (event: Event) => {
        setStatus(event.type === 'load' ? 'ready' : 'error');
      };
      // Add event listeners
      script.addEventListener('load', setStateFromEvent);
      script.addEventListener('error', setStateFromEvent);
      // Remove event listeners on cleanup
      return ()=>{
        if (script) {
          script.removeEventListener('load', setStateFromEvent);
          script.removeEventListener('error', setStateFromEvent);
        }
      }


    }, [src] // Only re-run effect if script src changes 
  );
  return status;
};