function errorHandler(err, req, res, next) {
  if (err) {
    if (err.name === 'SequelizeValidationError') {
      res.status(400).json({ message: err.errors[0].message });
    }
    else if (err.name === 'SequelizeUniqueConstraintError') {
      //simple function to turn the column name first letter to uppercase, for response
      let attribute = err.errors[0].path.split("");
      attribute[0] = attribute[0].toUpperCase();
      attribute = attribute.join("");

      //sending the response
      res.status(400).json({ message: `${attribute} is unavailable.` });
    }
    else if (err.name === 'LoginError') {
      res.status(401).json({ message: err.message });
    }
    else {
      res.status(500).json({ message: err });
    }
  } else {
    res.status(500).json({ message: "Unknown Error." });
  }
}

module.exports = errorHandler;