function CustomError(errorName, message, fileName, lineNumber) {
    var instance = new Error(message, fileName, lineNumber);
    instance.errorName = errorName;
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    if (Error.captureStackTrace) {
      Error.captureStackTrace(instance, CustomError);
    }
    return instance;
  }
  
CustomError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

if (Object.setPrototypeOf){
    Object.setPrototypeOf(CustomError, Error);
} else {
    CustomError.__proto__ = Error;
}

export default CustomError
