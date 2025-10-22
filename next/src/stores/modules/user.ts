import { createPersistStore } from "@/lib/create-store";
// import { getLoginUser, userLogout } from "@/api/yonghuguanli";

export interface UserState {
  user: API.UserLoginUserVO;
  isLogined: boolean;
}

export const initUserState: UserState = {
  user: {},
  isLogined: false,
};

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
     * 退出登录
     */
    logout: async () => {
    //   await userLogout();
      const { update } = get();
      update({ user: {}, isLogined: false });
      location.reload();
    },
  }),
  {
    name: "user",
    version: 1,
  }
);
