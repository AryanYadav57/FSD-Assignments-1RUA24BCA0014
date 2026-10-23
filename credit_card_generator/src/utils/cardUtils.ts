import type { CardErrors, CardValues } from '../hooks/useCardForm';

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function formatCardNumber(value: string) {
  return onlyDigits(value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

export function getDisplayCardNumber(value: string) {
  return value.length > 0 ? value : '0000 0000 0000 0000';
}

export function getDisplayName(value: string) {
  return value.trim().length > 0 ? value.toUpperCase() : 'JANE APPLESEED';
}

export function getDisplayExpiry(month: string, year: string) {
  const displayMonth = month.length > 0 ? month.padEnd(2, '0') : '00';
  const displayYear = year.length > 0 ? year.padEnd(2, '0') : '00';
  return `${displayMonth}/${displayYear}`;
}

export function getDisplayCvc(value: string) {
  return value.length > 0 ? value : '000';
}

export function validateCardForm(values: CardValues) {
  const errors: CardErrors = {};
  const digits = onlyDigits(values.cardNumber);

  if (!values.name.trim()) {
    errors.name = "Can't be blank";
  } else if (!/^[a-zA-Z\s]+$/.test(values.name.trim())) {
    errors.name = 'Letters and spaces only';
  }

  if (!digits) {
    errors.cardNumber = "Can't be blank";
  } else if (digits.length !== 16) {
    errors.cardNumber = 'Must be 16 digits';
  }

  if (!values.expMonth) {
    errors.expMonth = "Can't be blank";
  } else {
    const month = Number(values.expMonth);
    if (values.expMonth.length !== 2 || month < 1 || month > 12) {
      errors.expMonth = 'Invalid date';
    }
  }

  if (!values.expYear) {
    errors.expYear = "Can't be blank";
  } else if (values.expYear.length !== 2) {
    errors.expYear = 'Invalid date';
  }

  if (!values.cvc) {
    errors.cvc = "Can't be blank";
  } else if (!/^\d{3}$/.test(values.cvc)) {
    errors.cvc = 'Must be 3 digits';
  }

  return errors;
}
