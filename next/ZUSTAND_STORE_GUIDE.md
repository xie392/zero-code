# Zustand Store 使用指南

## 问题说明

之前的 `createPersistStore` 类型定义有问题，导致在 `get()` 中无法访问自定义的方法（如 `getLoginUser`、`logout` 等）。

## 解决方案

已修复类型推导，现在 `get()` 返回完整的 store 类型，包括：
- **状态 (T)**: 你定义的初始状态
- **update 方法**: 用于更新状态
- **自定义方法 (M)**: 你在 methods 函数中定义的所有方法

## 使用示例

### ✅ 正确用法

```typescript
import { createPersistStore } from '@/lib/create-store'

// 1. 定义状态接口
export interface UserState {
  user: API.User
  isLogined: boolean
}

// 2. 定义初始状态
export const initUserState: UserState = {
  user: {},
  isLogined: false,
}

// 3. 创建 store
export const useUserStore = createPersistStore(
  initUserState,
  (set, get) => ({
    // 自定义方法 1
    getLoginUser: async () => {
      // 可以访问 get() 的所有属性和方法
      const { update, user } = get()
      
      // 调用 API
      // const res = await api.getUser()
      // update({ user: res.data, isLogined: true })
    },
    
    // 自定义方法 2
    reset: () => {
      const { update } = get()
      update(initUserState)
    },
    
    // 自定义方法 3
    logout: async () => {
      // ✅ 现在可以访问其他方法了！
      const { update, getLoginUser, reset } = get()
      
      // 调用 API
      // await api.logout()
      
      // 重置状态
      update(initUserState)
      location.replace('/login')
    },
  }),
  {
    name: 'user-store',    // localStorage 中的 key
    version: 1,            // 版本号
  }
)
```

### 在组件中使用

```typescript
'use client'

import { useUserStore } from '@/stores'

export function MyComponent() {
  // 1. 获取状态
  const user = useUserStore(state => state.user)
  const isLogined = useUserStore(state => state.isLogined)
  
  // 2. 获取方法
  const logout = useUserStore(state => state.logout)
  const getLoginUser = useUserStore(state => state.getLoginUser)
  const update = useUserStore(state => state.update)
  
  // 3. 使用
  const handleLogout = async () => {
    await logout()
  }
  
  const handleUpdateUser = () => {
    update({ user: { name: 'New Name' } })
  }
  
  return (
    <div>
      <p>用户: {user.name}</p>
      <p>状态: {isLogined ? '已登录' : '未登录'}</p>
      <button onClick={handleLogout}>退出</button>
      <button onClick={handleUpdateUser}>更新</button>
    </div>
  )
}
```

## API 说明

### createPersistStore 参数

```typescript
createPersistStore<T, M>(
  state: T,              // 初始状态
  methods: (set, get) => M,  // 方法定义函数
  persistOptions: {      // persist 配置
    name: string,        // localStorage key
    version?: number,    // 版本号
    // ... 其他 zustand persist 配置
  }
)
```

### set 函数

```typescript
// 方式 1: 对象形式
set({ user: newUser })

// 方式 2: 函数形式（推荐，可以访问当前状态）
set(state => ({ count: state.count + 1 }))

// 方式 3: 完全替换（不推荐）
set(newState, true)
```

### get 函数

```typescript
const { user, isLogined, logout, update } = get()

// 类型完全安全，包含：
// - 所有状态属性（user, isLogined）
// - update 方法
// - lastUpdateTime
// - 所有自定义方法（logout, reset, getLoginUser）
```

### update 方法

```typescript
// 自动添加的方法，用于更新部分状态
const { update } = get()

update({ user: { name: 'New Name' } })
update({ isLogined: true })

// 等同于
set({ user: { name: 'New Name' } })
```

## 类型推导说明

TypeScript 会自动推导出完整的 store 类型：

```typescript
type UserStoreType = UserState & MakeUpdater<UserState> & {
  getLoginUser: () => Promise<void>
  reset: () => void
  logout: () => Promise<void>
}

// 使用时有完整的类型提示
const store = useUserStore.getState()
store.user       // ✅ UserState['user']
store.isLogined  // ✅ UserState['isLogined']
store.update     // ✅ (arg: Partial<UserState>) => void
store.logout     // ✅ () => Promise<void>
store.getLoginUser // ✅ () => Promise<void>
```

## 最佳实践

### 1. 方法中访问其他方法

```typescript
const useStore = createPersistStore(
  { count: 0 },
  (set, get) => ({
    increment: () => {
      const { count, update } = get()
      update({ count: count + 1 })
    },
    
    reset: () => {
      const { update } = get()
      update({ count: 0 })
    },
    
    // ✅ 可以调用其他方法
    incrementAndLog: () => {
      const { increment, count } = get()
      increment()
      console.log('New count:', count + 1)
    },
  }),
  { name: 'counter' }
)
```

### 2. 异步操作

```typescript
const useStore = createPersistStore(
  { data: null, loading: false, error: null },
  (set, get) => ({
    fetchData: async () => {
      const { update } = get()
      
      update({ loading: true, error: null })
      
      try {
        const res = await api.getData()
        update({ data: res.data, loading: false })
      } catch (error) {
        update({ error: error.message, loading: false })
      }
    },
  }),
  { name: 'data-store' }
)
```

### 3. 条件更新

```typescript
const useStore = createPersistStore(
  { items: [] },
  (set, get) => ({
    addItem: (item) => {
      const { items, update } = get()
      
      // 检查重复
      if (items.some(i => i.id === item.id)) {
        console.warn('Item already exists')
        return
      }
      
      update({ items: [...items, item] })
    },
  }),
  { name: 'items' }
)
```

## 常见问题

### Q1: 为什么要用 get() 而不是直接访问状态？

```typescript
// ❌ 错误：闭包问题，状态不会更新
logout: () => {
  console.log(user) // 永远是初始值
}

// ✅ 正确：每次调用都获取最新状态
logout: () => {
  const { user } = get()
  console.log(user) // 最新值
}
```

### Q2: update 和 set 有什么区别？

```typescript
// update: 自动合并，更简洁
update({ user: newUser })

// set: 需要手动合并
set(state => ({ ...state, user: newUser }))

// 推荐使用 update，除非需要复杂的状态更新逻辑
```

### Q3: 如何在非组件中使用？

```typescript
// 直接调用 getState()
import { useUserStore } from '@/stores'

export function apiHelper() {
  const { user, logout } = useUserStore.getState()
  
  if (!user.token) {
    logout()
  }
}
```

## 迁移到 better-auth

如果你要使用 better-auth 替代 Zustand store 管理用户状态，参考以下示例：

```typescript
// 旧方式：Zustand
const logout = useUserStore(state => state.logout)

// 新方式：better-auth
import { useSession, signOut } from '@/lib/auth-client'

const { data: session } = useSession()
const handleLogout = async () => {
  await signOut()
  router.push('/login')
}
```

建议：
- ✅ 用户认证状态：使用 **better-auth**
- ✅ 应用状态（UI、缓存等）：使用 **Zustand**
- ✅ 服务端数据：使用 **tRPC + React Query**

## 总结

✅ **修复完成**：`get()` 现在可以访问所有方法  
✅ **类型安全**：完整的 TypeScript 类型推导  
✅ **简单易用**：清晰的 API 设计  

现在你可以在 store 方法中自由调用其他方法了！🎉
