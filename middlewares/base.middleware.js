class Base {
  async ErrorHandler(err, req, res, next) {
    console.log('Error log:', err);
    //
    res.status(err.statusCode || 500).json({
      status: err.status || 'Internal Server Error',
      code: err.statusCode || 500,
      message:
        err.message || 'Internal error,  I am already calling techlead! ',
    });
  }
  async NotFoundHandler(req, res, next) {
    res.status(404).json({
      status: 'Not Found',
      code: 404,
      message: 'The route does not exist',
    });
  }
}

module.exports = new Base();
