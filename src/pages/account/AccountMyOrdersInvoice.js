import React from 'react'
import AccountLayout from './AccountLayout'
import {
  Container,
  CurrencyBeforeValue,
  GridLayout,
  LayoutBetween,
  Right,
} from '../../components/Utilities/common'
import {
  Heading3,
  Heading4,
  TextBold10,
  TextBold11,
  TextBold12,
  TextBold3,
  TextRegular,
  TextRegular8,
} from '../../components/Utilities/typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const InvoiceHeader = () => {
  return (
    <section>
      <Container className="gap-2">
        <Heading3>Invoice Number</Heading3>
        <TextBold10>AB-345</TextBold10>
      </Container>
      <Container className="gap-2 mt-1">
        <Heading4>PO Number</Heading4>
        <Heading4>2345</Heading4>
      </Container>
    </section>
  )
}
const InvoiceDetailItem = ({ title, dateCaption, date, children }) => {
  return (
    <GridLayout className="gap-1">
      <LayoutBetween>
        <TextRegular8>{title}</TextRegular8>
        <Container className="gap-1">
          <TextBold3>{dateCaption}</TextBold3>
          <TextRegular>{date}</TextRegular>
        </Container>
      </LayoutBetween>
      <section className="bg-bgWhite">{children}</section>
    </GridLayout>
  )
}
const orderDetails = [
  {
    ordered: '2',
    item_number: 'ICA-CT 073BK',
    description: 'Jysk Office Chair SKODSBORG',
    unit_price: '109.99',
    total: '219.98',
  },
  {
    ordered: '1',
    item_number: 'ICA-CT 073BK',
    description: 'Equip Ergonomic Executive Office Chair',
    unit_price: '149.99',
    total: '149.99',
  },
  {
    ordered: '4',
    item_number: 'ICA-CT 073BK',
    description: 'Kenson 7010 office/computer chair Padded seat',
    unit_price: '92.00',
    total: '368.00',
  },
]

const MyOrdersInvoice = () => {
  return (
    <GridLayout className="mt-12 border border-lightGray py-6 px-3 gap-10">
      <InvoiceHeader></InvoiceHeader>
      <InvoiceDetailItem
        title="Shipping"
        dateCaption="Date Shipped"
        date="03/03/2022"
      >
        <GridLayout className="p-6">
          <Container className="gap-20">
            <GridLayout className="gap-6">
              <TextBold3>Billing Location</TextBold3>
              <GridLayout>
                <TextRegular>Head Office</TextRegular>
                <TextRegular>Company Name</TextRegular>
              </GridLayout>
              <GridLayout>
                <TextRegular>Barer Str. 27</TextRegular>
                <TextRegular>80333 München</TextRegular>
                <TextRegular>Germany</TextRegular>
              </GridLayout>
            </GridLayout>
            <GridLayout className="gap-6">
              <TextBold3>Shipping Location</TextBold3>
              <GridLayout>
                <TextRegular>Head Office</TextRegular>
                <TextRegular>Company Name</TextRegular>
              </GridLayout>
              <GridLayout>
                <TextRegular>Barer Str. 27</TextRegular>
                <TextRegular>80333 München</TextRegular>
                <TextRegular>Germany</TextRegular>
              </GridLayout>
            </GridLayout>
          </Container>
        </GridLayout>
      </InvoiceDetailItem>
      <InvoiceDetailItem
        title="Order Details"
        dateCaption="Date Ordered"
        date="27/02/2022"
      >
        <TableContainer className="desktop_only">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  align="left"
                  className="font-inter !font-bold text-base"
                >
                  Ordered
                </TableCell>
                <TableCell
                  align="left"
                  className="font-inter !font-bold text-base"
                >
                  Item Number
                </TableCell>
                <TableCell
                  align="left"
                  className="font-inter !font-bold text-base"
                >
                  Description
                </TableCell>
                <TableCell
                  align="left"
                  className="font-inter !font-bold text-base"
                >
                  Unit Price
                </TableCell>
                <TableCell
                  align="left"
                  className="font-inter !font-bold text-base"
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  className="!py-6"
                >
                  <TableCell component="th" scope="row" className="!py-6">
                    {row.ordered}
                  </TableCell>
                  <TableCell align="left" className="!py-6">
                    {row.item_number}
                  </TableCell>
                  <TableCell align="left" className="!py-6">
                    {row.description}
                  </TableCell>
                  <TableCell align="left" className="!py-6">
                    <CurrencyBeforeValue value={row.unit_price} />
                  </TableCell>
                  <TableCell align="left" className="!py-6">
                    <CurrencyBeforeValue value={row.total} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </InvoiceDetailItem>
      <InvoiceDetailItem
        title="Payment"
        dateCaption="Due Date"
        date="03/03/2022"
      >
        <GridLayout className="p-6 gap-4">
          <Right className="gap-2">
            <TextBold3>Payment Method</TextBold3>
            <TextRegular>Credit Card</TextRegular>
          </Right>
          <LayoutBetween className="h-[30px] border-b border-lightGray">
            <TextBold11>Subtotal without VAT</TextBold11>
            <TextBold11>
              <CurrencyBeforeValue value={'737.97'} />
            </TextBold11>
          </LayoutBetween>
          <GridLayout className="gap-1">
            <TextBold12>VAT Details</TextBold12>
            <Container className="gap-2">
              <TextRegular>
                VAT 20% of <CurrencyBeforeValue value={'737.97'} />
              </TextRegular>
              <TextRegular>
                <CurrencyBeforeValue value={'147.594'} />
              </TextRegular>
            </Container>
            <Container className="gap-2">
              <TextRegular>
                VAT 0% of <CurrencyBeforeValue value={'0.00'} />
              </TextRegular>
              <TextRegular>
                <CurrencyBeforeValue value={'0.00'} />
              </TextRegular>
            </Container>
          </GridLayout>
          <LayoutBetween>
            <TextBold11>Total</TextBold11>
            <TextBold12>
              <CurrencyBeforeValue value={'885.294'} />
            </TextBold12>
          </LayoutBetween>
        </GridLayout>
      </InvoiceDetailItem>
    </GridLayout>
  )
}

const AccountMyOrdersInvoice = () => {
  return (
    <AccountLayout page="Invoice">
      {' '}
      <MyOrdersInvoice />
    </AccountLayout>
  )
}
export default AccountMyOrdersInvoice
