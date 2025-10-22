import { users } from '@/db/schema'
import { db } from '@/db'
import { publicProcedure, router } from '../trpc'

export const userRouter = router({
  userList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    const user = await db.select().from(users)

    // const user: User[] = user
    return user
  }),
})
