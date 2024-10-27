export function mongoDuplicateValueError(err: any) {
  if (err.code === 11000)
    err.message = `${Object.keys(err.keyValue)} already exists`
}
