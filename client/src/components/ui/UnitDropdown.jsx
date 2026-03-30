import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

function UnitDropdown({ value, options, onChange, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const selectedOption = options.find((option) => option.value === value) || options[0];

  const handleToggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const handleSelect = useCallback(
    (event) => {
      const nextValue = event.currentTarget.dataset.value;
      if (nextValue) {
        onChange(nextValue);
      }
      setOpen(false);
    },
    [onChange],
  );

  return (
    <div ref={rootRef} className="relative z-50">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={handleToggle}
        className="flex h-14 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <span className="break-words whitespace-normal leading-relaxed">
          {selectedOption?.label || value}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full mt-2 w-full rounded-lg border border-white/10 bg-black shadow-lg z-50"
          >
            <div className="py-1" role="listbox" aria-label={ariaLabel}>
              {options.map((option) => {
                const active = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    data-value={option.value}
                    onClick={handleSelect}
                    className={`block w-full px-4 py-3 text-left text-sm transition-colors ${
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="break-words whitespace-normal leading-relaxed">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(UnitDropdown);
