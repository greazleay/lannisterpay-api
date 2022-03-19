# Lannister Pay - API

## Contributors

* Lekan Adetunmbi

## About

FlutterWave Technical Assessment Project.

Lannister Pay is a transaction fee processing service meant to calculate the fee applicable to a transaction based on specific fee configuration.

## Stack

* TypeScript
* Express
* MongoDB
* Mongoose

## Fee Configuration Spec Schema

The fee configuration schema used to define the fee configuration for a specific transaction type is defined below:
    
    *   "FEE_ID": string,
    *   "FEE_CURRENCY": string,
    *   "FEE_LOCALE": string, allowed values: ["LOCL", "INTL", "*"],
    *   "FEE_ENTITY": string, allowed values: ["CREDIT-CARD", "DEBIT-CARD", "BANK-ACCOUNT", "USSD", "WALLET-ID", "*"],
    *   "ENTITY_PROPERTY": string,
    *   "FEE_TYPE": string, allowed values: ["FLAT", "PERC", "FLAT_PERC"],
    *   "FEE_VALUE": string

### Fee Configuration Spec Setup Payload Example

    {
        "FeeConfigurationSpec": [
            {
                "FEE_ID": "LNPY1221",
                "FEE_CURRENCY": "NGN",
                "FEE_LOCALE": "*",
                "FEE_ENTITY": "*",
                "ENTITY_PROPERTY": "*",
                "FEE_TYPE": "PERC",
                "FEE_VALUE": "1.4"
            },
            {
                "FEE_ID": "LNPY1223",
                "FEE_CURRENCY": "NGN",
                "FEE_LOCALE": "LOCL",
                "FEE_ENTITY": "CREDIT-CARD",
                "ENTITY_PROPERTY": "*",
                "FEE_TYPE": "FLAT_PERC",
                "FEE_VALUE": "50:1.4"
            },
            {
                "FEE_ID": "LNPY1224",
                "FEE_CURRENCY": "NGN",
                "FEE_LOCALE": "*",
                "FEE_ENTITY": "BANK-ACCOUNT",
                "ENTITY_PROPERTY": "*",
                "FEE_TYPE": "FLAT",
                "FEE_VALUE": "100"
            },
        ]
    }

## Transaction Payload Schema

    *   "ID": number,
    *   "Amount": number,
    *   "Currency": number,
    *   "CurrencyCountry": string,
    *   "Customer": object,
    *   "PaymentEntity": object,

### Transaction Payload Schema Customer Object

    *   "ID": number,
    *   "EmailAddress": string,
    *   "FullName": string,
    *   "BearsFee": boolean,

### Transaction Payload Schema PaymentEntity Object

    *   "ID": number,
    *   "Issuer": string,
    *   "Brand": string,
    *   "Number": string,
    *   "SixID": string,
    *   "Type": string,
    *   "Country": string,

### Transaction Payload Example

        {
            "ID": 91203,
            "Amount": 5000,
            "Currency": "NGN",
            "CurrencyCountry": "NG",
            "Customer": {
                "ID": 2211232,
                "EmailAddress": "anonimized29900@anon.io",
                "FullName": "Abel Eden",
                "BearsFee": true
            },
            "PaymentEntity": {
                "ID": 2203454,
                "Issuer": "GTBANK",
                "Brand": "MASTERCARD",
                "Number": "530191******2903",
                "SixID": "530191",
                "Type": "CREDIT-CARD",
                "Country": "NG"
            }
        }

## Endpoints

* Base URL: `https://api-lnpy.herokuapp.com/v1`

* Fee Configuration Specs Setup:                                 POST /fees
* Compute Transaction Fee                                        POST /compute-transaction-fee
