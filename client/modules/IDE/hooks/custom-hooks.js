import { useEffect, useRef, useState } from 'react';

export const noop = () => {};

export const useDidUpdate = (callback, deps) => {
  const hasMount = useRef(false);

  useEffect(() => {
    if (hasMount.current) {
      callback();
    } else {
      hasMount.current = true;
    }
  }, deps);
};

// Usage: const ref = useModalBehavior(() => setSomeState(false))
// place this ref on a component
export const useModalBehavior = (hideOverlay) => {
  const ref = useRef({});

  // Return values
  const setRef = (r) => {
    ref.current = r;
  };
  const [visible, setVisible] = useState(false);
  const trigger = () => setVisible(!visible);

  const hide = () => setVisible(false);

  const handleClickOutside = ({ target }) => {
    if (
      ref &&
      ref.current &&
      !(ref.current.contains && ref.current.contains(target))
    ) {
      hide();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  return [visible, trigger, setRef];
};

// Usage: useEffectWithComparison((props, prevProps) => { ... }, { prop1, prop2 })
// This hook basically applies useEffect but keeping track of the last value of relevant props
// So you can passa a 2-param function to capture new and old values and do whatever with them.
export const useEffectWithComparison = (fn, props) => {
  const [prevProps, update] = useState({});

  return useEffect(() => {
    fn(props, prevProps);
    update(props);
  }, Object.values(props));
};

export const useEventListener = (
  event,
  callback,
  useCapture = false,
  list = []
) =>
  useEffect(() => {
    document.addEventListener(event, callback, useCapture);
    return () => document.removeEventListener(event, callback, useCapture);
  }, list);

// Usage: usePreserveFormValuesOnLanguageChange(formRef, language)
// This hook ensures that form values are preserved when the language changes.
// Pass a ref to the form instance and the current language as arguments.
export const usePreserveFormValuesOnLanguageChange = (formRef, language) => {
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const { values } = form.getState();
    form.reset();

    Object.keys(values).forEach((field) => {
      if (values[field]) {
        form.change(field, values[field]);
      }
    });
  }, [language]);
};
