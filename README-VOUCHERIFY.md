# Emporix B2B Showcase

## Pre Requirements 

- Voucherify account (with access to Qualification API v3)
- Emporix account
- Contentful account

## How to start:

- Rename .env.example to .env 
- Fill out .env file.
  - `REACT_APP_VOUCHERIFY_API_URL` - Voucherify API endpoint
  - `REACT_APP_VOUCHERIFY_API_URL` - Voucherify Application ID
  - `REACT_APP_VOUCHERIFY_SECRET_KEY` - Voucherify Secret Key
  - `REACT_APP_EMPORIX_TENANT` - Emporix tenant name
  - `REACT_APP_EMPORIX_STOREFRONT_API` - Storefront API Client ID
  - `REACT_APP_EMPORIX_CLIENT_ID` - Emporix API Client ID
  - `REACT_APP_EMPORIX_CLIENT_SECRET` - Emporix API Secret
  - `CONTENTFUL_ACCESS_TOKEN` - Contentful Personal Token
  - `REACT_APP_CONTENTFUL_MODE` - DEV / PROD - if `DEV` only unpublished Contentful content will be reachable by store, if `PROD` only published content will be reachable by this showcase.
  - `REACT_APP_CONTENTFUL_PREVIEW_API_ACCESS_TOKEN` - Contentful Content Preview API - access token
  - `REACT_APP_CONTENTFUL_DELIVERY_API_ACCESS_TOKEN` - Contentful Content Delivery API - access token
  - `REACT_APP_CONTENTFUL_SPACE_ID` - Contentful Space ID

## Contentful pre requirements

Create 3 content models:
- campaign
  - name - short text
  - description - short text
  - termsAndConditions - short text
- promotion_tier
  - name - short text
  - description - short text
  - termsAndConditions - short text
- standalone voucher
  - code - short text
  - description - short text
  - termsAndConditions - short text

![Screenshot 2023-05-18 at 17.53.52.png](Screenshot%202023-05-18%20at%2017.53.52.png)
![Screenshot 2023-05-18 at 17.52.30.png](Screenshot%202023-05-18%20at%2017.52.30.png)
![Screenshot 2023-05-18 at 17.53.56.png](Screenshot%202023-05-18%20at%2017.53.56.png)

## How to obtain those keys:

- Emporix
  - Manage API Keys
- Voucherify
  - Project Settings -> Application Keys
- Contentful
  - Account Settings -> Tokens -> Generate personal token
  - Go to space -> Settings -> API keys -> Add API key

## What to do once you filled out .env file and imported products to Emporix

- yarn  migrate:products - this will migrate products from Emporix to Voucherify so you will be able to create promotions based on certain products.

## What to do once you created all promotions and vouchers you wanted

- yarn migrate:all-promotions - this will migrate all campaigns, promotion tiers and standalone vouchers to Contentful, so you will be able to change name and add description or terms and conditions to all promotions.

## Local setup

1. `yarn install`
2. `yarn start`
