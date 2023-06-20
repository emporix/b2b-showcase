import { Grid } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'

import {
  GridLayout,
  Item,
  LayoutBetween,
} from '../../components/Utilities/common'
import {
  CartActionRow,
  CartSubTotalExcludeVat,
  CartVat,
} from '../../components/Cart/cart'
import Typography from '@mui/material/Typography'
import Quantity from '../../components/Utilities/quantity/quantity'
import { usePrices } from '../../services/product/usePrices'
import { formatCurrency } from '../../helpers/currency'
import { LargePrimaryButton } from '../../components/Utilities/button'
import { useSites } from '../../context/sites-provider'
import { useCart } from 'context/cart-provider'
import { useCurrency } from 'context/currency-context'
import { useAuth } from 'context/auth-provider'

function VariantAttributes({ attributes }) {
  return (
    <Grid container direction={'column'}>
      {Object.keys(attributes).map((attributeKey) => {
        return (
          <Grid container spacing={2} direction="row" alignItems="center">
            <Grid item>
              <Typography>
                <b>{attributeKey}</b>
              </Typography>
            </Grid>
            <Grid item>
              <Typography>{attributes[attributeKey]}</Typography>
            </Grid>
          </Grid>
        )
      })}
    </Grid>
  )
}

const VariantSummary = ({ variant, setQuantity, quantity, price }) => {
  return (
    <Grid
      container
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="space-around"
    >
      <Grid item xs={2}>
        <Item>
          {variant.media.length > 0 && (
            <img
              style={{ width: '100%', maxHeight: 'auto' }}
              src={variant.media[0].url}
            />
          )}
        </Item>
      </Grid>
      <Grid item xs={4}>
        <Item>
          <Grid container direction="column">
            <Grid item>
              <Typography>
                <b>{variant.name}</b>
              </Typography>
            </Grid>
            <Grid item>
              <Typography>SKU: {variant.code}</Typography>
            </Grid>
            <Grid item>
              <Typography>IN STOCK</Typography>
            </Grid>
          </Grid>
        </Item>
      </Grid>
      <Grid item xs={2}>
        <Item>
          <Quantity
            value={quantity}
            increase={() => setQuantity(quantity + 1)}
            decrease={() => setQuantity(quantity - 1)}
          />
        </Item>
      </Grid>
      <Grid item xs={2}>
        <Item>
          <VariantAttributes
            attributes={variant.mixins.productVariantAttributes}
          ></VariantAttributes>
        </Item>
      </Grid>
      <Grid item xs={2}>
        <Item>
          <Typography>
            {price &&
              formatCurrency(
                price.currency,
                price.tax.prices.effectiveValue.grossValue
              )}
          </Typography>
        </Item>
      </Grid>
    </Grid>
  )
}

export const PriceTierValues = ({ price, quantity }) => {
  const { isLoggedIn } = useAuth()
  const formattedPrice = useCallback(
    (price, tierId) => {
      return formatCurrency(
        price.currency,
        isLoggedIn
          ? price.tierValues.find(
              (tierWithValue) => tierWithValue.id === tierId
            ).priceValue
          : price.tierValues.find(
              (tierWithValue) => tierWithValue.id === tierId
            ).priceValue +
              (price.tierValues.find(
                (tierWithValue) => tierWithValue.id === tierId
              ).priceValue *
                price.tax.taxRate) /
                100
      )
    },
    [isLoggedIn]
  )
  return (
    <Grid container direction={'row'} wrap={'nowrap'} flexWrap={'nowrap'}>
      <Grid
        xs={12}
        item
        container
        direction={'column'}
        wrap={'nowrap'}
        flexWrap={'nowrap'}
      >
        <Grid item xs={6}>
          <b>Qty</b>
        </Grid>
        {/*<Grid item xs={4}>*/}
        {/*  <b>Discount</b>*/}
        {/*</Grid>*/}
        <Grid item xs={6}>
          <b>Unit Price</b>
        </Grid>
      </Grid>
      {price
        ? price.priceModel.tierDefinition.tiers.map((tier, i) => (
            <Grid
              xs={12}
              item
              key={tier.id}
              container
              direction={'column'}
              wrap={'nowrap'}
              flexWrap={'nowrap'}
            >
              <Grid
                item
                xs={6}
                sx={{
                  fontWeight:
                    (tier.minQuantity &&
                      price.priceModel.tierDefinition.tiers[i + 1] ===
                        undefined &&
                      quantity >= tier.minQuantity.quantity) ||
                    (price.priceModel.tierDefinition.tiers[i + 1] !==
                      undefined &&
                      quantity >= tier.minQuantity.quantity &&
                      quantity <
                        price.priceModel.tierDefinition.tiers[i + 1].minQuantity
                          .quantity)
                      ? 'bold'
                      : 'normal',
                }}
              >
                <Typography>{tier.minQuantity.quantity}+</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    fontWeight:
                      (tier.minQuantity &&
                        price.priceModel.tierDefinition.tiers[i + 1] ===
                          undefined &&
                        quantity >= tier.minQuantity.quantity) ||
                      (price.priceModel.tierDefinition.tiers[i + 1] !==
                        undefined &&
                        quantity >= tier.minQuantity.quantity &&
                        quantity <
                          price.priceModel.tierDefinition.tiers[i + 1]
                            .minQuantity.quantity)
                        ? 'bold'
                        : 'normal',
                  }}
                >
                  {formattedPrice(price, tier.id)}
                </Typography>
              </Grid>
            </Grid>
          ))
        : 'No price model for this item'}
    </Grid>
  )
}

PriceTierValues.propTypes = {}

function PaymentSummary({ variant, price }) {
  const { putCartProduct } = useCart()

  const addVariantProductToCart = useCallback(() => {
    const variantToAdd = {
      ...variant,
      price: price,
      quantity: price.quantity.quantity,
    }
    putCartProduct(variantToAdd)
  }, [variant, price])

  return price ? (
    <GridLayout className="gap-4 cart-action-panel">
      <CartActionRow>
        <LayoutBetween>
          <CartSubTotalExcludeVat
            value={price.tax.prices.totalValue.netValue}
          />
        </LayoutBetween>
      </CartActionRow>
      <CartActionRow>
        <LayoutBetween>
          CartVat:
          <CartVat
            value={price.tax.prices.totalValue.netValue}
            taxPercentage={price.tax.taxRate}
          />
        </LayoutBetween>
        <LayoutBetween>
          <span className="font-bold ">Subtotal with VAT</span>
          <span className="font-bold">
            {formatCurrency(
              price.currency,
              price.tax.prices.totalValue.grossValue
            )}
          </span>
        </LayoutBetween>
      </CartActionRow>
      <CartActionRow>
        <div className="cart-total-price-wrapper">
          <LayoutBetween>
            <span className="font-bold ">Total Price</span>
            <span className="font-bold">
              {formatCurrency(
                price.currency,
                price.tax.prices.totalValue.grossValue
              )}
            </span>
          </LayoutBetween>
        </div>
      </CartActionRow>{' '}
      <CartActionRow>
        <Item>
          <LargePrimaryButton
            title={'Add to cart'}
            onClick={addVariantProductToCart}
            className="cta-button bg-yellow"
          />
        </Item>
      </CartActionRow>
    </GridLayout>
  ) : (
    <div> - </div>
  )
}

function VariantDetails({ price, variant, quantity }) {
  return price ? (
    <Grid container spacing={4}>
      <Grid item xs={6} sx={{ borderRight: '1px solid #DFE1E5' }}>
        <Typography variant="h5">Quantity discount price</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">Payment summary</Typography>
      </Grid>
      <Grid item xs={6} sx={{ borderRight: '1px solid #DFE1E5' }}>
        <PriceTierValues
          sx={{ borderRight: '1px solid #DFE1E5' }}
          price={price}
          quantity={quantity}
        ></PriceTierValues>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6">
          <PaymentSummary price={price} variant={variant} />
        </Typography>
      </Grid>
    </Grid>
  ) : (
    <div>
      <i>No price</i>
    </div>
  )
}

export const VariantHeader = () => (
  <Grid
    container
    direction="row"
    alignItems="center"
    spacing={2}
    sx={{ paddingBottom: '8px', borderBottom: '1px solid #DFE1E5' }}
  >
    <Grid item xs={1} />
    <Grid item xs={11}>
      <Grid container spacing={2} direction="row" alignItems="center">
        <Grid item xs={6}>
          <Item>
            <b>Product</b>
          </Item>
        </Grid>
        <Grid item xs={2} justifyContent={'center'}>
          <Item>
            <b>Quantity</b>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <b>Options</b>
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <b>Price</b>
          </Item>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
)

export const VariantAccordion = ({ variant }) => {
  const [expanded, setExpanded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(null)
  const { activeCurrency } = useCurrency()
  const toggleExpand = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])
  const { currentSite } = useSites()
  const { matchPriceForProductAndQuantity } = usePrices()

  useEffect(() => {
    ;(async () => {
      const prices = await matchPriceForProductAndQuantity(variant.id, quantity)
      setPrice(prices[0])
    })()
  }, [quantity, variant.id, currentSite, activeCurrency])

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ paddingBottom: '8px', borderBottom: '1px solid #DFE1E5' }}
    >
      <Grid item xs={1}>
        <HiChevronDown
          size={20}
          className={expanded && 'rotated'}
          onClick={() => toggleExpand()}
        />
      </Grid>
      <Grid item xs={11}>
        <VariantSummary
          setQuantity={setQuantity}
          variant={variant}
          quantity={quantity}
          price={price}
        ></VariantSummary>
      </Grid>
      {expanded === true && (
        <VariantDetails
          quantity={quantity}
          variant={variant}
          price={price}
        ></VariantDetails>
      )}
    </Grid>
  )
}
