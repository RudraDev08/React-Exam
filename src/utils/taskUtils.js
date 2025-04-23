export const validateTask = (data) => {
  const errors = {};
  
  if (!data.task.trim()) errors.task = 'Task description is required';
  if (!data.username.trim()) errors.username = 'Username is required';

  const datePattern = /^(0?[1-9]|[12][0-9]|3[01])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/i;

  if (!datePattern.test(data.date)) {
    errors.date = 'Enter date in DD-MMM-YYYY format (e.g. 12-May-2025)';
  }

  return errors;
};
