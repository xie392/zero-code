import { createPersistStore } from '@/lib/create-store'

export interface UserState {
  user: API.User
  isLogined: boolean
}

export const initUserState: UserState = {
  user: {},
  isLogined: false,
}

export const useUserStore = createPersistStore(
  initUserState,
  (_set, get) => ({
    /**
     * 获取登录用户信息
     * @returns
     */
    getLoginUser: async () => {
      //   const res = await getLoginUser();
      //   if (res.data.code === 0) {
      //     const { update } = get();
      //     update({ user: res.data.data, isLogined: true });
      //   }
    },
    /**
     * 重置用户状态
     * 用于在用户手动退出登录后，重置用户状态
     */
    reset: () => {
      const { update } = get()
      update(initUserState)
    },
    /**
     * 退出登录
     */
    logout: async () => {
      //   await userLogout();
      const { update, reset } = get()
      update(initUserState)
      // reset();
      location.replace('/login')
    },
  }),
  {
    name: 'user',
    version: 1,
  },
)
