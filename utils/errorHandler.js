exports.handleError = (res, err) => {
  if (err.name === 'ZodError') {
    return res.status(400).json({ errors: err.errors });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
};
