import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactStars from 'react-stars'
import { useNavigate } from 'react-router-dom'
import { TENANT } from '../../constants/localstorage'
import {
  CurrencyBeforeComponent,
  CurrencyBeforeValue,
} from 'components/Utilities/common'
import { LargePrimaryButton } from '../../components/Utilities/button'
import { trimImage } from '../../helpers/images'
import { useAuth } from 'context/auth-provider'
import { formatPrice } from 'helpers/price'
import { Box } from '@mui/system'
import { Modal } from '@mui/material'
import { Qualification } from '../shared/Qualification'

const EachProduct = ({ item, qualifications }) => {
  const [open, setOpen] = useState(false)
  const { isLoggedIn, userTenant } = useAuth()
  const imageSrc = useMemo(() => {
    return item.media[0] === undefined ? '' : item.media[0]['url']
  }, [item])

  const price = useMemo(() => {
    return formatPrice(item, isLoggedIn)
  }, [item.price, isLoggedIn])

  const navigate = useNavigate()
  const handleProductDetail = useCallback(() => {
    navigate(`/${userTenant}/product/details/${item.id}`)
  }, [userTenant, item.id])

  return (
    <div className="p-4" style={{ cursor: 'pointer' }}>
      <div onClick={handleProductDetail}>
        <div className="w-full h-5  justify-between hidden lg:flex">
          {item.productType !== 'PARENT_VARIANT' && (
            <div
              className={
                'text-limeGreen font-inter text-[14px]/[20px] font-medium float-right lg:float-none'
              }
            >
              In Stock
            </div>
          )}
        </div>

        <div className=" block float-right lg:hidden">
          <div
            className={
              'text-limeGreen font-inter text-[14px]/[20px] font-medium float-right lg:float-none'
            }
          >
            {'In Stock'}
          </div>
        </div>

        {qualifications.length ? (
          <div
            className="mt-3 mb--4 text-white bg-flamingo text-[12px]/[20px] font-medium w-max rounded px-2 py-0.5"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setOpen(true)
            }}
          >
            {qualifications.length} PROMOTION
            {qualifications.length > 1 ? 'S' : ''}
          </div>
        ) : undefined}
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          disableAutoFocus={true}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 16,
              fontWeight: 'bold',
              gap: 20,
              display: 'flex',
              flexDirection: 'column',
              background: `white`,
              border: 0,
              padding: 32,
              whiteSpace: `nowrap`,
              borderRadius: '4px'
            }}
          >
            {/* <Box
              className="cursor-pointer"
              sx={{
                mb: -2,
                justifyContent: 'end',
                width: '100%',
                justifyItems: 'end',
                cursor: 'pointer',
                maxWidth: '40px',
              }}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                setOpen(false)
              }}
            >
              &#10060;
            </Box> */}
            <div className='flex items-center justify-between'>
            <span className="text-[20px]/[28px] text-eerieBlack font-semibold">
              Promotion{qualifications.length > 1 ? 's' : ''} related to{' '}
              {item.name}:
            </span>
            <span
              className="close-button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                setOpen(false)
              }}
            >
              X
            </span>
            </div>
            {qualifications?.map((qualification) => (
              <Qualification
                key={qualification.id}
                qualification={qualification}
              />
            ))}
          </div>
        </Modal>

        <div className="pt-10 lg:w-[200px] lg:h-[260px] w-[100px] h-[140px] md:w-[150px] md:h-[200px] items-center mx-auto ">
          <img src={trimImage(`${imageSrc}`)} className="mx-auto h-full" />
        </div>
        <div className="mt-2 lg:mt-9 w-full font-inter">
          <div className="text-left text-[14px]/[20px] font-normal leading-xs text-manatee">
            {item.code}
          </div>
          <div className="mt-2 text-left max-w-[240px] min-h-[60px] lg:h-12 text-[16px]/[24px] text-eerieBlack font-medium">
            {item.name}
          </div>
        </div>
        {item.productType !== 'PARENT_VARIANT' && (
          <div
            className={
              isLoggedIn
                ? 'w-full h-[56px] pt-2'
                : 'w-full pt-2 text-left h-[56px] font-bold'
            }
          >
            {isLoggedIn ? (
              <>
                <div className="text-[14px]/[20px] font-normal text-eerieBlack w-[200px] text-left">
                  {price !== null ? (
                    <>
                      {isLoggedIn ? 'Your negotiated price' : 'List Price'}
                      <CurrencyBeforeComponent>
                        <del>{price} </del>
                      </CurrencyBeforeComponent>
                    </>
                  ) : (
                    <span className="text-xs text-primaryBlue font-bold">
                      No Price
                    </span>
                  )}
                </div>
                <div className="flex">
                  {price !== null ? (
                    <>
                      {/* <img
                        src="/products/pencil.png"
                        className="w-4 h-4 mt-1"
                      /> */}
                      <div className="text-[22px]/[22px] lg:text-xl leading-[24px] font-bold ml-1">
                        <div className="flex flex-col">
                          <CurrencyBeforeValue value={price} />
                          <span className="text-xs font-normal text-manatee">
                            (Excl. VAT)
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="text-base pt-4">
                {price !== null ? (
                  <>
                    <CurrencyBeforeValue value={price} />
                    <span className="text-xs font-normal text-manatee">
                      (Incl. VAT)
                    </span>
                  </>
                ) : (
                  <span className="text-xs  text-primaryBlue font-bold">
                    No Price
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        {item.productType === 'PARENT_VARIANT' && (
          <div>
            <LargePrimaryButton
              className="cta-button bg-yellow"
              sx={{backgroundColor: '#FAC420 !important'}}
              title={'VIEW VARIANTS'}
              onClick={handleProductDetail}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default EachProduct
