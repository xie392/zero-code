import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 更新函数类型
 */
type Updater<T> = (arg: Partial<T>) => void

/**
 * 提取 persist 的第二个参数类型
 */
type SecondParam<T> = T extends (
  _f: infer _F,
  _s: infer S,
  ...args: infer _U
) => any
  ? S
  : never

/**
 * 添加 update 方法的类型
 */
export type MakeUpdater<T> = {
  lastUpdateTime: number
  update: Updater<T>
}

/**
 * Zustand set 函数类型
 */
export type SetStoreState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean | undefined,
) => void

/**
 * 创建持久化 Store
 *
 * @param state 初始状态
 * @param methods 方法定义函数，接收 set 和 get，返回方法对象
 * @param persistOptions persist 中间件的配置
 * @returns Zustand store
 *
 * @example
 * ```ts
 * const useStore = createPersistStore(
 *   { count: 0 },
 *   (set, get) => ({
 *     increment: () => set(state => ({ count: state.count + 1 })),
 *     getCount: () => get().count,
 *   }),
 *   { name: 'my-store' }
 * )
 * ```
 */
export function createPersistStore<
  T extends object,
  M extends Record<string, any>,
>(
  state: T,
  methods: (
    set: SetStoreState<T & MakeUpdater<T> & M>,
    get: () => T & MakeUpdater<T> & M,
  ) => M,
  persistOptions: SecondParam<typeof persist<T & M & MakeUpdater<T>>>,
) {
  type StoreType = T & MakeUpdater<T> & M

  const store = create<StoreType>()(
    persist((set, get) => {
      // 创建 update 方法
      const updateMethod = {
        lastUpdateTime: 0,
        update(options: Partial<T>) {
          set(
            (state) =>
              ({
                ...state,
                ...options,
                lastUpdateTime: Date.now(),
              }) as any,
          )
        },
      }

      // 调用 methods 函数获取方法
      const userMethods = methods(set as any, get as any)

      // 合并所有部分
      return {
        ...state,
        ...updateMethod,
        ...userMethods,
      } as StoreType
    }, persistOptions as any),
  )

  return store
}
