# projeto18-valex

A Typescript designed project to manage benefit cards among companies and employees

<p align="center">
  <img  src="https://cdn.iconscout.com/icon/free/png-256/credit-card-2650080-2196542.png">
</p>
<h1 align="center">
  Valex
</h1>
<div align="center">

  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px"/>  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px"/>
  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

<br/>

# Description

Valex simulates an API that manages a benefit card, generally made available by companies to their employees.

</br>

## Features

- Get the card balance and transactions
- Create cards
- Activate / Block / Unlock a card
- Recharge a card
- Make card payments with online payment option

</br>

## API Reference

### Get card balance

```http
GET /card-balance
```

#### Request:

| Body             | Type      | Description                      |
| :--------------- | :-------- | :------------------------------- |
| `number`         | `integer` | **Required**. card number        |
| `cardHolderName` | `string`  | **Required**. card holder name   |
| `expirationDate` | `string`  | **Required**. date of expiration |

#

### Create a card

```http
POST /card-create
```

#### Request:

| Body   | Type      | Description                        |
| :----- | :-------- | :--------------------------------- |
| `id`   | `integer` | **Required**. User id              |
| `type` | `string`  | **Required**. type of card benefit |

`Valid types: [groceries, restaurant, transport, education, health]`

####

| Headers     | Type     | Description                        |
| :---------- | :------- | :--------------------------------- |
| `x-api-key` | `string` | **Required**. Api key of companies |

####

</br>

#### Response:

```json
{
  "number": "1111 1111 1111 1111",
  "cardholderName": "NAME N NAME",
  "securityCode": "111",
  "expirationDate": "01/27",
  "isVirtual": true,
  "isBlocked": true,
  "type": "Card Type",
  "cvc": "111"
}
```

`number has 16 digit length defined format`

#

### Activate a card

```http
POST /card-activate
```

#### Request:

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `number`         | `integer` | **Required**. card number          |
| `cardHolderName` | `string`  | **Required**. card holder name     |
| `expirationDate` | `string`  | **Required**. card expiration date |
| `securityCode`   | `string`  | **Required**. card cvc             |
| `password`       | `string`  | **Required**. card password        |

`Password length: 4`

`Password pattern: only numbers`

`CVC max length: 3`

#

### Block a card

```http
POST /card-block
```

#### Request:

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `number`         | `integer` | **Required**. card number          |
| `cardHolderName` | `string`  | **Required**. card holder name     |
| `expirationDate` | `string`  | **Required**. card expiration date |
| `password`       | `string`  | **Required**. card password        |

#

### Unlock a card

```http
PUT /card-unblock
```

#### Request:

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `number`         | `integer` | **Required**. card number          |
| `cardHolderName` | `string`  | **Required**. card holder name     |
| `expirationDate` | `string`  | **Required**. card expiration date |
| `password`       | `string`  | **Required**. card password        |

#

### Recharge a card

```http
POST /card-recharge
```

#### Request:

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

####

| Body     | Type      | Description                   |
| :------- | :-------- | :---------------------------- |
| `id`     | `integer` | **Required**. Card Id         |
| `amount` | `integer` | **Required**. recharge amount |

#

### Card payments

```http
POST /card-payment
```

#### Request:

| Body         | Type      | Description                         |
| :----------- | :-------- | :---------------------------------- |
| `id`         | `integer` | **Required**. card Id               |
| `businessId` | `integer` | **Required**. Id of Business to pay |
| `password`   | `string`  | **Required**. Card password         |
| `amount`     | `integer` | **Required**. Payment amount        |

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`

`PORT = number #recommended:5000`

`SECRET_KEY = any string`

</br>

## Run Locally

Clone the project

```bash
  git clone https://github.com/ricardomartinso/Valex-API
```

Go to the project directory

```bash
  cd projeto18-valex/
```

Install dependencies

```bash
  npm install
```

Create database

```bash
  cd src/database
```

```bash
  bash ./create-database
```

```bash
  cd ../../..
```

Start the server

```bash
  npm run start
```

</br>

## Lessons Learned

In this project I learned a lot about how to structure an API with TypeScript

</br>

## Acknowledgements

- [Awesome Badges](https://github.com/Envoy-VC/awesome-badges)

</br>

## Authors

- Ricardo Martins is a student at Driven Education and is putting effort into it to become a Software Engineer. Looking forward to become a Dev.
  <br/>

#
