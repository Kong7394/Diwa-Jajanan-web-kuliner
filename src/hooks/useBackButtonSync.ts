import { useEffect, useRef } from 'react';

// Global stack of active modal callbacks
interface ActiveModalEntry {
  id: string;
  onClose: () => void;
}

const activeModals: ActiveModalEntry[] = [];
let isPopStateInitialized = false;

function initGlobalPopState() {
  if (isPopStateInitialized || typeof window === 'undefined') return;
  isPopStateInitialized = true;

  window.addEventListener('popstate', () => {
    // Pop the topmost active modal and trigger its onClose handler
    const topModal = activeModals.pop();
    if (topModal) {
      try {
        topModal.onClose();
      } catch (err) {
        console.error('Error handling back button for modal:', err);
      }
    }
  });
}

/**
 * Custom hook to synchronize modal/overlay state with browser/phone hardware back button.
 * Avoids aggressive history.back() calls during unmount to prevent closing subsequent modals (e.g. Checkout -> Confirmation).
 */
export function useBackButtonSync(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    initGlobalPopState();

    if (isOpen) {
      const modalId = 'modal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      
      // Push history state for this modal
      try {
        window.history.pushState({ modalId }, '');
      } catch (e) {
        console.warn('pushState failed:', e);
      }

      const entry: ActiveModalEntry = {
        id: modalId,
        onClose: () => onCloseRef.current(),
      };
      activeModals.push(entry);

      return () => {
        const index = activeModals.findIndex((m) => m.id === modalId);
        if (index !== -1) {
          activeModals.splice(index, 1);
        }
      };
    }
  }, [isOpen]);
}


