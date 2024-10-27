import { UsersDocument } from 'src/modules/users/entities/user.entity'

declare module 'express' {
  interface Request {
    user?: UsersDocument
  }
}
