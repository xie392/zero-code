# OpenAPI definition


**简介**:OpenAPI definition


**HOST**:http://localhost:8123/api


**联系人**:


**Version**:v0


**接口路径**:/api/v3/api-docs/default


[TOC]






# 应用管理


## 获取应用详情


**接口地址**:`/api/apps/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据应用ID获取应用的详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|应用ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseAppVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||AppVO|AppVO|
|&emsp;&emsp;id|应用ID|integer(int64)||
|&emsp;&emsp;appName|应用名称|string||
|&emsp;&emsp;cover|应用封面URL|string||
|&emsp;&emsp;initPrompt|应用初始化的 prompt|string||
|&emsp;&emsp;codeGenType|代码生成类型|string||
|&emsp;&emsp;deployKey|部署标识|string||
|&emsp;&emsp;deployedTime|部署时间|string(date-time)||
|&emsp;&emsp;priority|优先级（数值越大优先级越高）|integer(int32)||
|&emsp;&emsp;userId|创建用户ID|integer(int64)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;user|用户信息|UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;id|用户ID|integer||
|&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像URL|string||
|&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 1,
		"appName": "我的智能助手",
		"cover": "https://example.com/cover.jpg",
		"initPrompt": "你是一个智能助手，请帮助用户解决问题",
		"codeGenType": "html",
		"deployKey": "app-123456",
		"deployedTime": "",
		"priority": 1,
		"userId": 1001,
		"createTime": "",
		"updateTime": "",
		"user": {
			"id": 1,
			"userAccount": "testuser",
			"userName": "张三",
			"userAvatar": "https://example.com/avatar.jpg",
			"userProfile": "这是一个用户简介",
			"userRole": "user",
			"createTime": ""
		}
	},
	"message": ""
}
```


## 更新应用


**接口地址**:`/api/apps/{id}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新指定应用的信息，只能更新自己创建的应用</p>



**请求示例**:


```javascript
{
  "id": 1,
  "appName": "我的智能助手"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|应用ID|path|true|integer(int64)||
|appUpdateRequest|更新应用请求|body|true|AppUpdateRequest|AppUpdateRequest|
|&emsp;&emsp;id|应用ID||true|integer(int64)||
|&emsp;&emsp;appName|应用名称||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## 删除应用


**接口地址**:`/api/apps/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除指定的应用，只能删除自己创建的应用</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|应用ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## 管理员更新应用


**接口地址**:`/api/apps/{id}/admin`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员更新指定应用信息，需要管理员权限</p>



**请求示例**:


```javascript
{
  "id": 1,
  "appName": "我的智能助手",
  "cover": "https://example.com/cover.jpg",
  "priority": 1
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|应用ID|path|true|integer(int64)||
|appUpdateByAdminRequest|管理员更新应用请求体|body|true|AppUpdateByAdminRequest|AppUpdateByAdminRequest|
|&emsp;&emsp;id|应用ID||true|integer(int64)||
|&emsp;&emsp;appName|应用名称||false|string||
|&emsp;&emsp;cover|应用封面URL||false|string||
|&emsp;&emsp;priority|优先级（数值越大优先级越高）||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## 管理员删除应用


**接口地址**:`/api/apps/{id}/admin`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员删除指定应用，需要管理员权限</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|应用ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## 创建应用


**接口地址**:`/api/apps`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建一个新的应用，需要提供应用名称和初始化提示</p>



**请求示例**:


```javascript
{
  "appName": "我的智能助手",
  "initPrompt": "你是一个智能助手，请帮助用户解决问题"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appAddRequest|创建应用请求|body|true|AppAddRequest|AppAddRequest|
|&emsp;&emsp;appName|应用名称||true|string||
|&emsp;&emsp;initPrompt|应用初始化的 prompt||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## 应用部署


**接口地址**:`/api/apps/deploy`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>应用部署，需要应用权限</p>



**请求示例**:


```javascript
{
  "appId": 1
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appDeployRequest|AppDeployRequest|body|true|AppDeployRequest|AppDeployRequest|
|&emsp;&emsp;appId|应用ID||true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||string||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": "",
	"message": ""
}
```


## 获取我的应用列表


**接口地址**:`/api/apps/my`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>分页获取当前用户创建的应用列表，支持按应用名称搜索</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|pageNum|页码|query|false|integer(int32)||
|pageSize|每页大小|query|false|integer(int32)||
|appName|应用名称（可选）|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponsePageAppVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||PageAppVO|PageAppVO|
|&emsp;&emsp;records|应用信息视图对象|array|AppVO|
|&emsp;&emsp;&emsp;&emsp;id|应用ID|integer||
|&emsp;&emsp;&emsp;&emsp;appName|应用名称|string||
|&emsp;&emsp;&emsp;&emsp;cover|应用封面URL|string||
|&emsp;&emsp;&emsp;&emsp;initPrompt|应用初始化的 prompt|string||
|&emsp;&emsp;&emsp;&emsp;codeGenType|代码生成类型|string||
|&emsp;&emsp;&emsp;&emsp;deployKey|部署标识|string||
|&emsp;&emsp;&emsp;&emsp;deployedTime|部署时间|string||
|&emsp;&emsp;&emsp;&emsp;priority|优先级（数值越大优先级越高）|integer||
|&emsp;&emsp;&emsp;&emsp;userId|创建用户ID|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;user|用户信息|UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|用户ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像URL|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;pageNumber||integer(int64)||
|&emsp;&emsp;pageSize||integer(int64)||
|&emsp;&emsp;totalPage||integer(int64)||
|&emsp;&emsp;totalRow||integer(int64)||
|&emsp;&emsp;optimizeCountQuery||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"records": [
			{
				"id": 1,
				"appName": "我的智能助手",
				"cover": "https://example.com/cover.jpg",
				"initPrompt": "你是一个智能助手，请帮助用户解决问题",
				"codeGenType": "html",
				"deployKey": "app-123456",
				"deployedTime": "",
				"priority": 1,
				"userId": 1001,
				"createTime": "",
				"updateTime": "",
				"user": {
					"id": 1,
					"userAccount": "testuser",
					"userName": "张三",
					"userAvatar": "https://example.com/avatar.jpg",
					"userProfile": "这是一个用户简介",
					"userRole": "user",
					"createTime": ""
				}
			}
		],
		"pageNumber": 0,
		"pageSize": 0,
		"totalPage": 0,
		"totalRow": 0,
		"optimizeCountQuery": true
	},
	"message": ""
}
```


## 获取精选应用列表


**接口地址**:`/api/apps/featured`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>分页获取公开的精选应用列表，支持按应用名称搜索</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|pageNum|页码|query|false|integer(int32)||
|pageSize|每页大小|query|false|integer(int32)||
|appName|应用名称（可选）|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponsePageAppVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||PageAppVO|PageAppVO|
|&emsp;&emsp;records|应用信息视图对象|array|AppVO|
|&emsp;&emsp;&emsp;&emsp;id|应用ID|integer||
|&emsp;&emsp;&emsp;&emsp;appName|应用名称|string||
|&emsp;&emsp;&emsp;&emsp;cover|应用封面URL|string||
|&emsp;&emsp;&emsp;&emsp;initPrompt|应用初始化的 prompt|string||
|&emsp;&emsp;&emsp;&emsp;codeGenType|代码生成类型|string||
|&emsp;&emsp;&emsp;&emsp;deployKey|部署标识|string||
|&emsp;&emsp;&emsp;&emsp;deployedTime|部署时间|string||
|&emsp;&emsp;&emsp;&emsp;priority|优先级（数值越大优先级越高）|integer||
|&emsp;&emsp;&emsp;&emsp;userId|创建用户ID|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;user|用户信息|UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|用户ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像URL|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;pageNumber||integer(int64)||
|&emsp;&emsp;pageSize||integer(int64)||
|&emsp;&emsp;totalPage||integer(int64)||
|&emsp;&emsp;totalRow||integer(int64)||
|&emsp;&emsp;optimizeCountQuery||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"records": [
			{
				"id": 1,
				"appName": "我的智能助手",
				"cover": "https://example.com/cover.jpg",
				"initPrompt": "你是一个智能助手，请帮助用户解决问题",
				"codeGenType": "html",
				"deployKey": "app-123456",
				"deployedTime": "",
				"priority": 1,
				"userId": 1001,
				"createTime": "",
				"updateTime": "",
				"user": {
					"id": 1,
					"userAccount": "testuser",
					"userName": "张三",
					"userAvatar": "https://example.com/avatar.jpg",
					"userProfile": "这是一个用户简介",
					"userRole": "user",
					"createTime": ""
				}
			}
		],
		"pageNumber": 0,
		"pageSize": 0,
		"totalPage": 0,
		"totalRow": 0,
		"optimizeCountQuery": true
	},
	"message": ""
}
```


## 应用聊天生成代码


**接口地址**:`/api/apps/chat/gen/code`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`text/event-stream`


**接口描述**:<p>应用聊天生成代码，需要应用权限</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appId|应用ID|query|true|integer(int64)||
|message|用户消息|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ServerSentEventString|


**响应参数**:


暂无


**响应示例**:
```javascript
[
	null
]
```


## 管理员获取应用列表


**接口地址**:`/api/apps/admin`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员分页获取所有应用列表，需要管理员权限</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|pageNum|页码|query|false|integer(int32)||
|pageSize|每页大小|query|false|integer(int32)||
|appName|应用名称（模糊搜索）|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponsePageAppVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||PageAppVO|PageAppVO|
|&emsp;&emsp;records|应用信息视图对象|array|AppVO|
|&emsp;&emsp;&emsp;&emsp;id|应用ID|integer||
|&emsp;&emsp;&emsp;&emsp;appName|应用名称|string||
|&emsp;&emsp;&emsp;&emsp;cover|应用封面URL|string||
|&emsp;&emsp;&emsp;&emsp;initPrompt|应用初始化的 prompt|string||
|&emsp;&emsp;&emsp;&emsp;codeGenType|代码生成类型|string||
|&emsp;&emsp;&emsp;&emsp;deployKey|部署标识|string||
|&emsp;&emsp;&emsp;&emsp;deployedTime|部署时间|string||
|&emsp;&emsp;&emsp;&emsp;priority|优先级（数值越大优先级越高）|integer||
|&emsp;&emsp;&emsp;&emsp;userId|创建用户ID|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;user|用户信息|UserVO|UserVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|用户ID|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像URL|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;pageNumber||integer(int64)||
|&emsp;&emsp;pageSize||integer(int64)||
|&emsp;&emsp;totalPage||integer(int64)||
|&emsp;&emsp;totalRow||integer(int64)||
|&emsp;&emsp;optimizeCountQuery||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"records": [
			{
				"id": 1,
				"appName": "我的智能助手",
				"cover": "https://example.com/cover.jpg",
				"initPrompt": "你是一个智能助手，请帮助用户解决问题",
				"codeGenType": "html",
				"deployKey": "app-123456",
				"deployedTime": "",
				"priority": 1,
				"userId": 1001,
				"createTime": "",
				"updateTime": "",
				"user": {
					"id": 1,
					"userAccount": "testuser",
					"userName": "张三",
					"userAvatar": "https://example.com/avatar.jpg",
					"userProfile": "这是一个用户简介",
					"userRole": "user",
					"createTime": ""
				}
			}
		],
		"pageNumber": 0,
		"pageSize": 0,
		"totalPage": 0,
		"totalRow": 0,
		"optimizeCountQuery": true
	},
	"message": ""
}
```


# 用户管理


## 更新用户


**接口地址**:`/api/user/update`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员更新用户信息接口</p>



**请求示例**:


```javascript
{
  "id": 1,
  "userName": "张三",
  "userAvatar": "https://example.com/avatar.jpg",
  "userProfile": "这是一个用户简介",
  "userRole": "user"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userUpdateRequest|用户更新请求参数|body|true|UserUpdateRequest|UserUpdateRequest|
|&emsp;&emsp;id|用户ID||true|integer(int64)||
|&emsp;&emsp;userName|用户昵称||false|string||
|&emsp;&emsp;userAvatar|用户头像URL||false|string||
|&emsp;&emsp;userProfile|用户简介||false|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## 更新个人信息


**接口地址**:`/api/user/update/my`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>用户更新个人信息接口</p>



**请求示例**:


```javascript
{
  "userName": "张三",
  "userAvatar": "https://example.com/avatar.jpg",
  "userProfile": "这是一个用户简介"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userUpdateMyRequest|用户更新个人信息请求参数|body|true|UserUpdateMyRequest|UserUpdateMyRequest|
|&emsp;&emsp;userName|用户昵称||false|string||
|&emsp;&emsp;userAvatar|用户头像URL||false|string||
|&emsp;&emsp;userProfile|用户简介||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## 用户注册


**接口地址**:`/api/user/register`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>用户注册接口</p>



**请求示例**:


```javascript
{
  "userAccount": "testuser",
  "userPassword": "password123",
  "checkPassword": "password123"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userRegisterRequest|用户注册请求参数|body|true|UserRegisterRequest|UserRegisterRequest|
|&emsp;&emsp;userAccount|用户账号||true|string||
|&emsp;&emsp;userPassword|用户密码||true|string||
|&emsp;&emsp;checkPassword|确认密码||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## 用户注销


**接口地址**:`/api/user/logout`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>用户注销接口</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


## 用户登录


**接口地址**:`/api/user/login`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>用户登录接口</p>



**请求示例**:


```javascript
{
  "userAccount": "test",
  "userPassword": "12345678"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userLoginRequest|用户登录请求参数|body|true|UserLoginRequest|UserLoginRequest|
|&emsp;&emsp;userAccount|用户账号||true|string||
|&emsp;&emsp;userPassword|用户密码||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseLoginUserVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||LoginUserVO|LoginUserVO|
|&emsp;&emsp;id|用户ID|integer(int64)||
|&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;userAvatar|用户头像URL|string||
|&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 1,
		"userAccount": "testuser",
		"userName": "张三",
		"userAvatar": "https://example.com/avatar.jpg",
		"userProfile": "这是一个用户简介",
		"userRole": "user",
		"createTime": "",
		"updateTime": ""
	},
	"message": ""
}
```


## 分页获取用户封装列表


**接口地址**:`/api/user/list/page/vo`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员分页获取用户封装列表</p>



**请求示例**:


```javascript
{
  "pageNum": 0,
  "pageSize": 0,
  "sortField": "",
  "sortOrder": "",
  "id": 1,
  "userName": "张三",
  "userAccount": "testuser",
  "userProfile": "这是一个用户简介",
  "userRole": "user"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userQueryRequest|用户查询请求参数|body|true|UserQueryRequest|UserQueryRequest|
|&emsp;&emsp;pageNum|||false|integer(int32)||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;sortField|||false|string||
|&emsp;&emsp;sortOrder|||false|string||
|&emsp;&emsp;id|用户ID||false|integer(int64)||
|&emsp;&emsp;userName|用户昵称||false|string||
|&emsp;&emsp;userAccount|用户账号||false|string||
|&emsp;&emsp;userProfile|用户简介||false|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin,ban||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponsePageUserVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||PageUserVO|PageUserVO|
|&emsp;&emsp;records|用户信息|array|UserVO|
|&emsp;&emsp;&emsp;&emsp;id|用户ID|integer||
|&emsp;&emsp;&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;userAvatar|用户头像URL|string||
|&emsp;&emsp;&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;pageNumber||integer(int64)||
|&emsp;&emsp;pageSize||integer(int64)||
|&emsp;&emsp;totalPage||integer(int64)||
|&emsp;&emsp;totalRow||integer(int64)||
|&emsp;&emsp;optimizeCountQuery||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"records": [
			{
				"id": 1,
				"userAccount": "testuser",
				"userName": "张三",
				"userAvatar": "https://example.com/avatar.jpg",
				"userProfile": "这是一个用户简介",
				"userRole": "user",
				"createTime": ""
			}
		],
		"pageNumber": 0,
		"pageSize": 0,
		"totalPage": 0,
		"totalRow": 0,
		"optimizeCountQuery": true
	},
	"message": ""
}
```


## 创建用户


**接口地址**:`/api/user/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员创建用户接口</p>



**请求示例**:


```javascript
{
  "userName": "张三",
  "userAccount": "testuser",
  "userAvatar": "https://picsum.photos/100",
  "userProfile": "这是一个用户简介",
  "userRole": "user"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userAddRequest|用户创建请求参数|body|true|UserAddRequest|UserAddRequest|
|&emsp;&emsp;userName|用户昵称||false|string||
|&emsp;&emsp;userAccount|用户账号||true|string||
|&emsp;&emsp;userAvatar|用户头像URL||false|string||
|&emsp;&emsp;userProfile|用户简介||false|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||integer(int64)|integer(int64)|
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": 0,
	"message": ""
}
```


## 获取当前登录用户


**接口地址**:`/api/user/getLoginUser`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取当前登录用户信息</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseLoginUserVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||LoginUserVO|LoginUserVO|
|&emsp;&emsp;id|用户ID|integer(int64)||
|&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;userAvatar|用户头像URL|string||
|&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 1,
		"userAccount": "testuser",
		"userName": "张三",
		"userAvatar": "https://example.com/avatar.jpg",
		"userProfile": "这是一个用户简介",
		"userRole": "user",
		"createTime": "",
		"updateTime": ""
	},
	"message": ""
}
```


## 根据ID获取用户


**接口地址**:`/api/user/get/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员根据ID获取用户详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseUser|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||User|User|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;userAccount||string||
|&emsp;&emsp;userPassword||string||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;userAvatar||string||
|&emsp;&emsp;userProfile||string||
|&emsp;&emsp;userRole||string||
|&emsp;&emsp;editTime||string(date-time)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;isDelete||integer(int32)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 0,
		"userAccount": "",
		"userPassword": "",
		"userName": "",
		"userAvatar": "",
		"userProfile": "",
		"userRole": "",
		"editTime": "",
		"createTime": "",
		"updateTime": "",
		"isDelete": 0
	},
	"message": ""
}
```


## 根据ID获取用户VO


**接口地址**:`/api/user/get/vo/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID获取用户包装类信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseUserVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||UserVO|UserVO|
|&emsp;&emsp;id|用户ID|integer(int64)||
|&emsp;&emsp;userAccount|用户账号|string||
|&emsp;&emsp;userName|用户昵称|string||
|&emsp;&emsp;userAvatar|用户头像URL|string||
|&emsp;&emsp;userProfile|用户简介|string||
|&emsp;&emsp;userRole|用户角色,可用值:user,admin|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": {
		"id": 1,
		"userAccount": "testuser",
		"userName": "张三",
		"userAvatar": "https://example.com/avatar.jpg",
		"userProfile": "这是一个用户简介",
		"userRole": "user",
		"createTime": ""
	},
	"message": ""
}
```


## 删除用户


**接口地址**:`/api/user/delete`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员删除用户接口</p>



**请求示例**:


```javascript
{
  "id": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|deleteRequest|删除请求参数|body|true|DeleteRequest|DeleteRequest|
|&emsp;&emsp;id|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|BaseResponseBoolean|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|data||boolean||
|message||string||


**响应示例**:
```javascript
{
	"code": 0,
	"data": true,
	"message": ""
}
```


# 静态资源管理


## serveStaticResource


**接口地址**:`/api/static/{deployKey}/**`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|deployKey|应用部署标识|path|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```