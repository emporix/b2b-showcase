# Emporix B2B Showcase

1. [Introduction](#1-Introduction)
   1. [Contentful role in this integration](#11-Contentful-role-in-this-integration)
   2. [Qualifications](#12-Qualifications)
2. [How to prepare the environment](#2-How-to-prepare-the-environment)
   1. [Prepare Emporix, Voucherify and Contentful services](#21-Prepare-Emporix-Voucherify-and-Contentful-services)
      1. [Migrations](#211-Migrations)
      2. [How to get API keys](#212-How-to-get-API-keys)
   2. [How to prepare showcase application](#22-How-to-prepare-showcase-application)
      1. [Requirements](#221-Requirements)
      2. [Installation process](#222-Installation-process)
      3. [Commands](#223-Commands)
3. [How it works](#3-How-it-works)
   1. [Applying vouchers and promotion tiers](#31-Applying-vouchers-and-promotion-tiers)
   2. [Bundles](#32-Bundles)
   3. [Integration from a technical perspective](#33-Integration-from-a-technical-perspective)
4. [Changes made to integrate with Voucherify and Contentful](#4-Changes-made-to-integrate-with-Voucherify-and-Contentful)

## 1. Introduction

This showcase application is a Proof of Concept of integration between Emporix, Voucherify and Contentful. This showcase shows how you could use Voucherify promotion engine
if you have Emporix store. Additionally, this integration uses Contentful to manage vouchers, promotion tiers and campaigns descriptions. This is possible because
Voucherify standalone codes, promotion tiers and campaigns contains references to CMS documents in the metadata.

**The Emporix showcase is a client-side application. We have used direct connections to server-side APIs from the front-end application to build this PoC
integration faster. Please remember that it's not recommended for production applications as it exposes Emporix, Voucherify and Contentful server-side API keys,
which is a major security threat. So please, keep access to this showcase only for trusted users and do not use API keys to production environments.**

### 1.1. Contentful role in this integration

We use contentful to store descriptions of each voucher, promotion tier and campaign. So simply, when we get qualification, we do a request
asking contentful for the promotion description to show to a client.
We do that because CMS like Contentful itself makes it easy to manage any content.

Each standalone code, promotion tier and campaign in Voucherify needs a reference to a corresponding document in Contentful. We have prepared a migration
script that creates Contentful documents to make an initial configuration easier. Please refer to [2.2.1 section](#211-Migrations) where are more details.

### 1.2. Qualifications

Qualifications are vouchers and promotions that a customer can use immediately or after meeting certain conditions.

Qualification scenarios we use:
- AUDIENCE_ONLY - gives all redeemables that match the given context(customer) considering only the customer's audiences. Does not verify other rules.
- PRODUCTS - gives all that can be applied for the given order(cart). Does not verify rules, just gives by matching products ids.
- CUSTOMER_WALLET - gives all redeemables that are belong to the given customer and match the given context (customer, cart). Verifies the most number of rules.
- ALL - gives all redeemables that match the given context (customer, cart). Verify the most number of rules.

1. On home screen you will see `AUDIENCE_ONLY` Voucherify qualification scenario. *(readme-images/Integration-1.png)*
2. On products page we show `PRODUCTS` scenario. *(readme-images/Integration-2.png)*
3. On product details page we show `PRODUCTS` scenario. *(readme-images/Integration-3.png)*
4. On cart page in products table we show `PRODUCTS` scenario. *(readme-images/Integration-4.png)*
5. On products page below products table we show `CUSTOMER_WALLET` scenario. *(readme-images/Integration-5.png)*
6. Below `CUSTOMER_WALLET` scenario holder, you will see saved vouchers(saved qualifications). *(readme-images/Integration-6.png)*
7. Bundles section show qualifications `PRODUCTS` scenario but only if in promotion_tier metadata there is `bundle: true` key. *(readme-images/Integration-7.png)*
8. Below bundle holder, we show `ALL` scenario, but we filter out all `PRODUCTS` and `CUSTOMER_WALLET` scenario, so there should be no duplicates.
   *(readme-images/Integration-8.png)*
9. On the checkout page we show `ALL` scenario. *(readme-images/Integration-9.png)*

## 2. How to prepare the environment

### 2.1. Prepare Emporix, Voucherify and Contentful services

You must have access to following services:

- Voucherify account (with access to Qualification API v3)
- Emporix account
- Contentful account

### 2.1.1. How to get API keys

- Emporix
  - Manage API Keys
- Voucherify
  - Project Settings -> Application Keys
- Contentful
  - Account Settings -> Tokens -> Generate personal token
  - Go to space -> Settings -> API keys -> Add API key

### 2.1.2. How to configure Contentful service

Create 3 content models:
- CAMPAIGN
  - name: campaign
  - content id: campaign
  - fields
    - name - short text
    - description - short text
    - termsAndConditions - short text
- PROMOTION TIER
  - name: promotion_tier
  - content id: promotion
  - fields
    - name - short text
    - description - short text
    - termsAndConditions - short text
- STANDALONE CODE
  - name: standalone voucher
  - content id: voucher
  - fields
    - code - short text
    - description - short text
    - termsAndConditions - short text

See `readme-images/Contentful-X.png` for more information.

### 2.2. How to prepare showcase application

### 2.2.1. Requirements

- yarn
- node 16.x

### 2.2.2. Installation process

- Fill out .env.prod file.
  - `REACT_APP_VOUCHERIFY_API_URL` - Voucherify API endpoint
  - `REACT_APP_VOUCHERIFY_APP_ID` - Voucherify Application ID
  - `REACT_APP_VOUCHERIFY_SECRET_KEY` - Voucherify Secret Key
  - `REACT_APP_EMPORIX_CLIENT_ID` - Emporix API Client ID (Server side)
  - `REACT_APP_EMPORIX_CLIENT_SECRET` - Emporix API Secret (Server side)
  - `REACT_APP_CONTENTFUL_MODE` - DEV / PROD - if `DEV` only unpublished Contentful content will be reachable by store, if `PROD` only published content will be reachable by this showcase.
  - `REACT_APP_CONTENTFUL_PREVIEW_API_ACCESS_TOKEN` - Contentful Content Preview API - access token
  - `REACT_APP_CONTENTFUL_DELIVERY_API_ACCESS_TOKEN` - Contentful Content Delivery API - access token
  - `REACT_APP_CONTENTFUL_SPACE_ID` - Contentful Space ID

### 2.2.3. Commands

- `yarn install` - will install required packages
- `yarn start:prod` - will start application

## 3. How it works

### 3.1. Applying vouchers and promotion tiers

The limit of promotions is 5 per cart/order.
We allow you to apply promotion tier (blue container) from anywhere as long as you are eligible for the promotion.
Applying vouchers on the other hand can happen only from cart page, cart sidebar view or checkout page.
So please notice that vouchers qualifications (green container) sometimes have `SAVE FOR LATER` button, that is because we don't
want you to lose the promotion you see, but also we cannot guarantee that the voucher you see is valid, so we want just to remind you later
about that voucher, so you will try to apply later on (on cart page).

### 3.2. Bundles

We implemented additional functionality to bundle type of promotions. You may add missing products to your cart directly from promotion holder.
A missing product is a product that is missing to receive a discount. *(readme-images/Bundles-1.png)*

### 3.3. Integration from a technical perspective

- Each time a cart changes (products, quantity, etc.) we must recheck cart (see function `recheckCart` in `src/context/cart-provider.js`)
- From emporix cart perspective we apply maximum 1 coupon to a cart. That is because at first integration is calculating the discount that
  should be applied, we create single coupon for the total discount amount that should be applied. We apply the coupon. And the information about what
  coupons are really applied to the cart from Voucherify perspective, are saved in cart `metadata/mixins`.
- Additionally, in cart `metadata/mixins` we save `applicable promtion tiers`, so we know later on, what promotions (blue containers) can be applied,
  so we can show `apply` button, and what promotions we cannot apply, so the button should not be shown.

## 4. Changes made to integrate with Voucherify and Contentful

Following files were modified from the original repository:

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

Additionally, we added some files, please see PR https://github.com/rspective/emporix-b2b-showcase/pull/5/files for details.



