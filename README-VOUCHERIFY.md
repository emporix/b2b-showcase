# Emporix B2B Showcase

## Quick introduction

This is a PoC of integration Emporix with Voucherify and Contentful. We want you show you how you could use Voucherify promotion engine
if you have Emporix store. Additionally, Voucherify uses Contentful to manage vouchers, promotion tiers and campaigns descriptions.

As this is a PoC we use SERVER SIDE Emporix, Voucherify and Contentful AUTHORIZATION on frontend which is UNACCEPTABLE on production!

## General Pre Requirements 

- Voucherify account (with access to Qualification API v3)
- Emporix account
- Contentful account

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

![Screenshot 2023-05-18 at 17.53.52.png](readme-images%2FScreenshot%202023-05-18%20at%2017.53.52.png)
![Screenshot 2023-05-18 at 17.52.30.png](readme-images%2FScreenshot%202023-05-18%20at%2017.52.30.png)
![Screenshot 2023-05-18 at 17.53.56.png](readme-images%2FScreenshot%202023-05-18%20at%2017.53.56.png)

## How to start:

- Copy .env.example to .env 
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

## How to obtain those keys:

- Emporix
  - Manage API Keys
- Voucherify
  - Project Settings -> Application Keys
- Contentful
  - Account Settings -> Tokens -> Generate personal token
  - Go to space -> Settings -> API keys -> Add API key

## What to do once you filled out .env file and imported products to Emporix

- yarn migrate:products - this will migrate products from Emporix to Voucherify, so you will be able to create promotions based on certain products.

## What to do once you created all promotions and vouchers you wanted

- yarn migrate:all-promotions - this will migrate all campaigns, promotion tiers and standalone vouchers to Contentful, so you will be able to change name and add description or terms and conditions to all promotions.

## Local setup

1. `yarn install`
2. `yarn start`

## Contentful role in this integration

We use contentful to store description of each voucher, promotion tier and campaign. So simply, when we get qualification, we do a request 
asking contentful for the promotion description to show to a client.
We do that because CMS like Contentful itself makes it easy to manage any content.

Note: If we have not migrated a voucher, promotion tier or campaign to Contentful, we will simply use Voucherify as a fallback. 

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

9. On the checkout page we show `ALL` scenario.

![Screenshot 2023-05-24 at 12.17.33.png](readme-images%2FScreenshot%202023-05-24%20at%2012.17.33.png)

## Applying promotions

The limit of promotions is 5 per cart/order.
We allow you to apply promotion tier (blue container) from anywhere as long as you are eligible for the promotion.
Applying vouchers on the other hand can happen only from cart page, cart sidebar view or checkout page.
So please notice that vouchers qualifications (green container) sometimes have `SAVE FOR LATER` button, that is because we don't 
want you to lose the promotion you seen, but also we cannot guarantee that the voucher you see is valid, so we want just to remind you later
about that voucher, so you will try to apply later on (on cart page).

## Changes made

We made changes in following files.

- package.json
- src
  - components
    - Cart
      - cart.js
    - Utilities
      - input
        - index.js
  - context
    - cart-provider.js
    - user-addresss-context.js
  - index.css
  - pages
    - InvalidTenant
    - cart
      - CartMobileContent.js
      - CartPage.js
      - CartTable.js
    - checkout
      - CheckoutPage.js
    - home
      - About.js
    - product
      - EachProduct.js
      - EachProductRow.js
      - ProductDetailPage.js
      - ProductListContent.js
      - ProductPage.js
      - index.js
  - services
    - cart.service.js
- yarn.lock

Additionally, we added some files, please see PR https://github.com/rspective/emporix-b2b-showcase/pull/5/files

Important to know:
- Each time a cart changes (products, quantity, etc.) we must recheck cart (see function `recheckCart` in `src/context/cart-provider.js`)
- From emporix cart perspective we apply maximum 1 coupon to a cart. That is because at first integration is calculating the discount that 
should be applied, we create single coupon for the total discount amount that should be applied. We apply the coupon. And the information about what
coupons are really applied to the cart from Voucherify perspective, are saved in cart metadata/mixins. 
- Additionally, in cart metadata/mixins we save `applicable promtion tiers`, so we know later on, what promotions (blue containers) can be applied,
so we can show `apply` button, and what promotions we cannot apply, so the button should not be shown.
