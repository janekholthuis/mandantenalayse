// src/lib/emailFlow.ts
export const getEmailChangeSteps = () => {
  try {
    return JSON.parse(localStorage.getItem('email_change_steps') || '{}');
  } catch {
    return {};
  }
};

export const updateEmailStep = (type: 'old' | 'new') => {
  const current = getEmailChangeSteps();
  if (type === 'old') current.oldConfirmed = true;
  if (type === 'new') current.newConfirmed = true;
  localStorage.setItem('email_change_steps', JSON.stringify(current));
};

export const clearEmailChangeSteps = () => {
  localStorage.removeItem('email_change_steps');
};
