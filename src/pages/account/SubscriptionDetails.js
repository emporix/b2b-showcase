import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import AccountLayout from './AccountLayout'
import { Box, Tab, Tabs } from '@mui/material'
import { getSubscription, updateSubscription } from '../../services/subscriptions.service'
import { CurrencyBeforeValue } from 'components/Utilities/common'
import { formatDate } from '../../components/Utilities/common'

import './subscription.css'
import { DropdownWithLabel } from 'components/Utilities/dropdown'
import { LargePrimaryButton } from 'components/Utilities/button'

const SubscriptionDetails = () => {

  const { action, orderId, productId } = useParams()
  
  const [subscription, setSubscription] = useState([])


  const [renewal, setRenewal] = useState()
  const [status, setStatus] = useState()
  const [extend, setExtend] = useState()


  const fetchSubscription = useCallback(async () => {
    const fetchedSubscription = await getSubscription(orderId, productId)
    setSubscription(fetchedSubscription)
    setRenewal(fetchedSubscription?.entry?.product?.mixins?.subscription?.renewal ? {value : "Yes", label : "Yes"} : {value : "No", label : "No"})
  }, [])

  useEffect(() => {
    fetchSubscription()
  }, [])

  const [tab, setTab] = React.useState(0)

  const handleChange = (event, tab) => {
    setTab(tab)
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props 
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    )
  }

  function TabRow(props) {
    const {name, value} = props
    return (
        <div className="grid grid-cols-2 gap-2 subscription-detail-item">
          <div className="information-properties pl-6 grid grid-cols-1">
            <span>{name}</span>
          </div>
          <div className="information-values pl-6 grid grid-cols-1 ">
            <span>{value}</span>
          </div>
        </div>
    )
  }

  const updateSubscriptionBtn = async () => {
    await updateSubscription(orderId, productId, {
      renewal : renewal ? renewal.value : undefined,
      extend : extend ? extend.value : undefined,
      status : status ? status.value : undefined
    })
    fetchSubscription()
    setTab(0)
  }

  return (
    <AccountLayout page="Subscription details">
      <Box>
        <Tabs
          variant="fullWidth"
          value={tab}
          onChange={handleChange}
        >
          <Tab label="Subscription Details" {...a11yProps(0)} />
          {action == 'manage' ? <Tab label="Manage Subscription" {...a11yProps(1)} /> : <></>}
        </Tabs>

        <TabPanel value={tab} index={0}>
          <div className="information-portal-wrapper grid grid-cols-1 gap-4">
          <div className="information-caption"></div>
          <div className="information-content grid grid-cols-1 gap-[6px]">
            
              <TabRow name={'Name'} value={subscription?.entry?.product?.name} />
              <TabRow name={'Status'} value={subscription?.entry?.product?.mixins?.subscription?.status} />
              <TabRow name={'Start Date'} value={subscription?.entry?.product?.mixins?.subscription?.start_date} />
              <TabRow name={'End Date'} value={subscription?.entry?.product?.mixins?.subscription?.end_date} />
              <TabRow name={'Contacy Duration'} value={subscription?.entry?.product?.mixins?.subscription?.duration} />
              <TabRow name={'Billing Frequency'} value={subscription?.entry?.product?.mixins?.subscription?.billing_periods} />
              <TabRow name={'Cancellable'} value={subscription?.entry?.product?.mixins?.subscription?.cancellable ? "Yes" : "No"} />
              <TabRow name={'Renewal'} value={subscription?.entry?.product?.mixins?.subscription?.renewal ? "Yes" : "No"} />

              <div className="grid grid-cols-2 gap-2 subscription-detail-item">
                <div className="information-properties pl-6 grid grid-cols-1">
                  <span>Price</span>
                </div>
                <div className="information-values pl-6 grid grid-cols-1 ">
                  <span><CurrencyBeforeValue value={subscription?.entry?.price?.effectiveAmount} currency={subscription?.entry?.price?.currency} /></span>
                </div>
              </div>

          </div>
        </div>
        </TabPanel>
        <TabPanel value={tab} index={1}>
        <div className="information-portal-wrapper grid grid-cols-1 gap-4">
          <div className="information-caption"></div>
          <div className="information-content grid grid-cols-1 gap-[6px]">
            
              <div className="grid grid-cols-2 gap-2 subscription-detail-item">
                <div className="information-properties pl-6 grid grid-cols-1">
                  <span>Renewal</span>
                </div>
                <div className="information-values pl-6 grid grid-cols-1 ">
                <DropdownWithLabel
                  options={[{value :'Yes', label : 'Yes'}, {value :'No', label : 'No'}]}
                  onChange={(e) => {setRenewal(e[0])}}
                  defaultValue={renewal}
                />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 subscription-detail-item">
                <div className="information-properties pl-6 grid grid-cols-1">
                  <span>Extend</span>
                </div>
                <div className="information-values pl-6 grid grid-cols-1 ">
                <DropdownWithLabel
                  onChange={(e) => {setExtend(e[0])}}
                  defaultValue={extend}
                  options={[{value :'1 Month', label : '1 Month'}, {value :'3 Months', label : '3 Months'}, {value :'6 Months', label : '6 Months'}, {value :'12 Months', label : '12 Months'}, ]}
                />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 subscription-detail-item">
                <div className="information-properties pl-6 grid grid-cols-1">
                  <span>Status</span>
                </div>
                <div className="information-values pl-6 grid grid-cols-1 ">
                <DropdownWithLabel
                  onChange={(e) => {setStatus(e[0])}}
                  defaultValue={status}
                  options={[{value :'Pause', label : 'Pause'}, {value :'Deactivate', label : 'Deactivate'}]}
                />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 subscription-detail-item">
                <div className="information-properties pl-6 grid grid-cols-1">
                </div>
                <div className="information-properties pl-6 grid grid-cols-1">
                  <div className="">
                  <LargePrimaryButton
                  className="w-auto"
                  title="Update"
                  onClick={() => updateSubscriptionBtn()}
                />
                </div>

            </div>
              </div>

              
            </div>
          </div>
        </TabPanel>

      </Box>
    </AccountLayout>
  )
}

export default SubscriptionDetails
