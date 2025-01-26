# accoint_api_node
### accoint_api_node 是一個使用 Node.js 開發的 API 專案，旨在提供與會計相關的功能。此專案採用了 MVC 架構，包含控制器（Controller）、模型（Model）和路由（Router）等目錄結構。


## API Reference

#### user

```http
  POST /users/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**.|
| `password` | `string` | **Required**. |


```http
  POST /users/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**.|
| `email` | `string` | **Required**.|
| `password` | `string` | **Required**. |

```http
  GET /users/token
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**.|

#### record

```http
  POST /records/add
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**.|
| `_id` | `string` | update record id|
| `userId` | `string` | **Required**.|
| `categoryId` | `string` | **Required**.|
| `accountId` | `string` | **Required**.|
| `amount` | `number` | **Required**.|
| `description` | `string` | |
| `date` | `YYYY-MM-DD` | **Required**.|
| `toAccountId` | `string` | change account to account|


```http
  GET /records/
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` |**Required**.|
| `year` | `string` | query year|
| `month` | `string` | query month|
| `date` | `string` |query date|
| `start` | `string` |query start time. **End will be Required**|
| `end` | `string` | query start to end time|

```http
  GET /records/delete/:recordId
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` |**Required**.|
| `:id` | `string` | delete record id|


#### category

```http
  GET /categories
```


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` |**Required**.|

```http
  GET /categories/delete/:_id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` |**Required**.|
| `:id` | `string` | delete record id|

```http
  POST /categories/add/
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` |**Required**.|
| `userId` | `string` |**Required**.|
| `type` | `string` |**Required**.|
| `source` | `string` |**Required**.|


#### account

```http
  GET /accounts/
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` |**Required**.|

```http
  POST /accounts/add/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` |**Required**.|
| `userId` | `string` |**Required**.|
| `type` | `string` |**Required**.|
| `amount` | `number` |**Required**.|

```http
  POST /accounts/update/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` |**Required**.|
| `_id` | `string` |**Required**.|
| `type` | `string` |**Required**.|
| `amount` | `string` |**Required**.|
