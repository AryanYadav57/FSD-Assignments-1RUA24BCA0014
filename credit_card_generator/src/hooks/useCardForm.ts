import { useEffect, useState } from 'react';

import { formatCardNumber, onlyDigits, validateCardForm } from '../utils/cardUtils';

export type CardValues = {
  name: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
};

export type CardErrors = Partial<Record<keyof CardValues, string>>;

const initialValues: CardValues = {
  name: '',
  cardNumber: '',
  expMonth: '',
  expYear: '',
  cvc: '',
};

export function useCardForm() {
  const [values, setValues] = useState<CardValues>(initialValues);
  const [errors, setErrors] = useState<CardErrors>({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast]);

  function updateField(field: keyof CardValues, rawValue: string) {
    setShowToast(false);

    const value = sanitizeField(field, rawValue);
    setValues((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function handleSubmit() {
    const nextErrors = validateCardForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setShowToast(true);
    }
  }

  return {
    values,
    errors,
    showToast,
    updateField,
    handleSubmit,
  };
}

function sanitizeField(field: keyof CardValues, value: string) {
  if (field === 'cardNumber') {
    return formatCardNumber(value);
  }

  if (field === 'expMonth' || field === 'expYear') {
    return onlyDigits(value).slice(0, 2);
  }

  if (field === 'cvc') {
    return onlyDigits(value).slice(0, 3);
  }

  return value;
}
