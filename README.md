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

## Fee Config Schema

The fee configuration schema used to define the fee configuration for a specific transaction type is defined below:
    {
        "FEE_ID": string,
        "FEE_CURRENCY": string,
        "FEE_LOCALE": string,
        "FEE_ENTITY": string,
        "ENTITY_PROPERTY": string,
        "FEE_TYPE": string,
        "FEE_VALUE": string
    },

## Endpoints

* Fee Configuration Specs Setup:                                 POST /v1/fees
* Compute Transaction Fee                                        POST /v1/fees/compute_transaction_fee

* API Documentation is available [here](https://api-lnpy.herokuapp.com/api-docs)
