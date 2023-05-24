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

## Promotions

Qualification scenarios we use:
- AUDIENCE_ONLY - gives all redeemables that match the given context(customer, cart) considering only the audience. Does not verify other rules.
- PRODUCTS - gives all that can be applied for the given order(cart). Does not verify rules, just give by matching products ids.
- CUSTOMER_WALLET - gives all redeemables that are belong to the given customer and match the given context (customer, cart). Verifies the most number of rules.
- ALL - gives all redeemables that match the given context (customer, cart). Verify the most number of rules.

1. On home screen you will see `AUDIENCE_ONLY` Voucherify qualification scenario.

![Screenshot 2023-05-24 at 11.01.11.png](readme-images%2FScreenshot%202023-05-24%20at%2011.01.11.png)

2. On products page we show `PRODUCTS` scenario.

![Screenshot 2023-05-24 at 11.16.33.png](readme-images%2FScreenshot%202023-05-24%20at%2011.16.33.png)

3. On product details page we show `PRODUCTS` scenario.

![Screenshot 2023-05-24 at 11.55.03.png](readme-images%2FScreenshot%202023-05-24%20at%2011.55.03.png)

4. On cart page in products table we show `PRODUCTS` scenario.

![Screenshot 2023-05-24 at 11.56.51.png](readme-images%2FScreenshot%202023-05-24%20at%2011.56.51.png)

5. On products page below products table we show `CUSTOMER_WALLET` scenario.

![Screenshot 2023-05-24 at 11.57.57.png](readme-images%2FScreenshot%202023-05-24%20at%2011.57.57.png)

6. Below `CUSTOMER_WALLET` scenario holder, you will see saved vouchers(saved qualifications).

![Screenshot 2023-05-24 at 11.59.13.png](readme-images%2FScreenshot%202023-05-24%20at%2011.59.13.png)

7. Bundles section show qualifications `PRODUCTS` scenario but only if in promotion_tier metadata there is `bundle: true` key.

![Screenshot 2023-05-24 at 11.59.13.png](readme-images%2FScreenshot%202023-05-24%20at%2011.59.13.png)

8. Below bundle holder, we show `ALL` scenario, but we filter out all `PRODUCTS` and `CUSTOMER_WALLET` scenario, so there should be no duplicates.

![Screenshot 2023-05-24 at 12.02.33.png](readme-images%2FScreenshot%202023-05-24%20at%2012.02.33.png)


