import React, { useCallback, useEffect, useState } from 'react'
import AccountLayout from './AccountLayout'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { getCustomers } from 'services/customer.service'
import { MediumPrimaryButton } from 'components/Utilities/button'
import './accountManageUsers.css'
import Dialog from 'components/Utilities/Dialog'
import { LargePrimaryButton } from 'components/Utilities/button'
import Dropdown from 'components/Utilities/dropdown'
import {
  getCustomerGroups,
  getUsersFromGroup,
  reassignGroup,
} from 'services/iam.service'
import { createCustomer, updateCustomer } from 'services/customer.service'
import { useCurrency } from 'context/currency-context'

const REQUIERED_FIELDS = {
  firstName: true,
  lastName: true,
  titel: false,
  active: false,
  userRights: true,
  contactEmail: true,
}
const initFormData = {
  firstName: '',
  lastName: '',
  title: '',
  userRights: '',
  active: false,
  contactEmail: '',
}

const ROLE = {
  B2B_ADMIN: 'Admin',
  B2B_BUYER: 'Purchaser',
  B2B_REQUESTER: 'Material Manager',
}

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email)
}

export const CompanyCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [showDialog, setShowDialog] = useState()
  const [currentCustomer, setCurrentCustomer] = useState()
  const [roles, setRoles] = useState([])
  const [defaultRole, setDefaultRole] = useState('')
  const [mode, setMode] = useState()
  const { activeCurrency } = useCurrency()

  const getCompanyCustomers = useCallback(async () => {
    const fetchedIamGroups = await getCustomerGroups()
    const filteredGroups = fetchedIamGroups.filter((a) => {
      return a.code !== 'CUSTOMER'
    })

    setRoles(filteredGroups)
    setDefaultRole(filteredGroups[0])

    const groups = (
      await Promise.all(
        filteredGroups.map(async (group) => {
          const groupUsers = await getUsersFromGroup(group.id)
          return groupUsers.map((g) => ({
            ...g,
            group: group,
          }))
        })
      )
    ).flatMap((group) => group)

    const fetchedCustomers = await getCustomers()
    const effectiveCustomers = fetchedCustomers
      .filter((customer) => {
        return groups.filter((group) => group.userId === customer.id).length > 0
      })
      .map((customer) => ({
        ...customer,
        group: groups.find((group) => group.userId === customer.id).group,
        userRights:
          ROLE[groups.find((group) => group.userId === customer.id).group.code],
      }))
    setCustomers(effectiveCustomers)
  })

  const CreateCustomerDialog = ({ customer, mode }) => {
    const [formData, setFormData] = useState(initFormData)

    const handleUpsertDialogAction = async () => {
      setShowDialog(false)
      console.log('Customer has been upserted:', formData)
      if (mode === 'CREATE') {
        const newCustomer = await createCustomer(formData, activeCurrency)
        if (!formData.active) {
          updateCustomer(newCustomer.id, formData.active)
        }
        formData.id = newCustomer.id
        reassignGroup('CUSTOMER', formData.group.id, newCustomer.id)
        customers.push(formData)
      }
      if (mode === 'UPDATE') {
        if (customer.active !== formData.active) {
          updateCustomer(customer.id, formData.active)
        }
        if (customer.userRights !== formData.userRights) {
          reassignGroup(customer.group.id, formData.group.id, customer.id)
        }
        const index = customers.indexOf(customer)
        customers[index] = formData
      }
      setCustomers([...customers])
    }

    useEffect(() => {
      setFormData(customer)
    }, [customer])

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData((prevState) => {
        if (type === 'checkbox') {
          return {
            ...prevState,
            [name]: checked,
          }
        }
        return {
          ...prevState,
          [name]: value,
        }
      })
    }
    const hasError = useCallback(
      (key) => {
        return (
          REQUIERED_FIELDS[key] &&
          (formData[key] === undefined || formData[key]?.length === 0)
        )
      },
      [formData]
    )
    return (
      <>
        <Dialog
          maxWidth="xl"
          open={showDialog}
          onClose={() => {
            setShowDialog(false)
          }}
        >
          <div className="upsertUserDialog">
            <div className="text-xl font-bold mb-[10px]">
              {mode === 'CREATE' ? 'Create New User' : "Edit User's Detail"}
            </div>
            <div className="dialog-user-contenet">
              <div className="dialog-user-input">
                <div className="mb-1">Titel:</div>
                <input
                  type="text"
                  name="title"
                  disabled={mode === 'UPDATE'}
                  value={formData?.title}
                  onChange={handleChange}
                  className={`mt-2 sm:mt-0 form-input-item border-gray`}
                  style={{
                    borderColor: hasError('title') && 'red',
                  }}
                />
                {hasError('title') && (
                  <div className="text-red-500 text-xs">Must not be blank</div>
                )}
              </div>
              <div className="dialog-user-input">
                <div className="mb-1">Active:</div>
                <div className={`mt-2 sm:mt-0 form-input-item border-gray`}>
                  <input
                    type="checkbox"
                    className="dialog-user-checkbox"
                    name="active"
                    value={formData?.active}
                    checked={formData?.active}
                    onChange={handleChange}
                  />
                  <span className="dialog-user-active">
                    User activated if selected
                  </span>
                </div>
              </div>
              <div className="dialog-user-input">
                <div className="mb-1">First Name:</div>
                <input
                  type="text"
                  name="firstName"
                  disabled={mode === 'UPDATE'}
                  value={formData?.firstName}
                  onChange={handleChange}
                  className={`mt-2 sm:mt-0 form-input-item border-gray`}
                  style={{
                    borderColor: hasError('firstName') && 'red',
                  }}
                />
                {hasError('firstName') && (
                  <div className="text-red-500 text-xs">Must not be blank</div>
                )}
              </div>
              <div className="dialog-user-input">
                <div className="mb-1">Last Name:</div>
                <input
                  type="text"
                  name="lastName"
                  disabled={mode === 'UPDATE'}
                  value={formData?.lastName}
                  onChange={handleChange}
                  className={`mt-2 sm:mt-0 form-input-item border-gray`}
                  style={{
                    borderColor: hasError('lastName') && 'red',
                  }}
                />
                {hasError('lastName') && (
                  <div className="text-red-500 text-xs">Must not be blank</div>
                )}
              </div>
              <div className="dialog-user-input dialog-user-input-role">
                <label className="mb-1">User rights:</label>
                <Dropdown
                  searchable={false}
                  options={roles.map((role) => {
                    return {
                      key: role.id,
                      label: ROLE[role.code],
                      value: role,
                    }
                  })}
                  defaultValue={{
                    label: formData?.userRights,
                    value: formData?.group,
                  }}
                  onChange={(e) => {
                    console.log(e)
                    setFormData((prev) => {
                      return {
                        ...prev,
                        group: e[0].value,
                        userRights: ROLE[e[0].value?.code],
                      }
                    })
                  }}
                  style={{
                    borderWidth: '1px',
                    width: '438px',
                  }}
                />
              </div>
              <div className="dialog-user-input">
                <div className="mb-1">Email address:</div>
                <input
                  type="text"
                  name="contactEmail"
                  disabled={mode === 'UPDATE'}
                  value={formData?.contactEmail}
                  onChange={handleChange}
                  className={`mt-2 sm:mt-0 form-input-item border-gray`}
                  style={{
                    borderColor: hasError('contactEmail') && 'red',
                  }}
                />
                {(hasError('contactEmail') || !isValidEmail(formData?.contactEmail)) && (
                  <div className="text-red-500 text-xs">Correct email must be provided</div>
                )}
              </div>
            </div>
            <div className="dialog-user-footer">
              <LargePrimaryButton
                className="dialog-user-btn bg-yellow"
                title={mode === 'CREATE' ? 'CREATE NEW USER' : 'SAVE'}
                disabled={
                  !(
                    formData.firstName &&
                    formData.lastName &&
                    formData.contactEmail &&
                    isValidEmail(formData?.contactEmail)
                  )
                }
                onClick={handleUpsertDialogAction}
              />
              <LargePrimaryButton
                className="dialog-user-btn dialog-user-cancel-btn"
                title={'CANCEL'}
                onClick={() => setShowDialog(false)}
              />
            </div>
          </div>
        </Dialog>
      </>
    )
  }

  const handleEditCustomer = useCallback((customer) => {
    setCurrentCustomer(customer)
    setShowDialog(true)
    setMode('UPDATE')
  }, [])

  const handleCreateCustomer = () => {
    setCurrentCustomer({
      ...initFormData,
      group: defaultRole,
      userRights: ROLE[defaultRole?.code],
    })
    setShowDialog(true)
    setMode('CREATE')
  }

  useEffect(() => {
    getCompanyCustomers()
  }, [])

  return (
    <div className="md:mt-[60px]">
      {showDialog && (
        <CreateCustomerDialog
          customer={currentCustomer}
          mode={mode}
        ></CreateCustomerDialog>
      )}
      <TableContainer className="desktop_only">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left" className="!font-bold grid-column-title">
                First Name
              </TableCell>
              <TableCell align="left" className="!font-bold grid-column-title">
                Surname
              </TableCell>
              <TableCell align="left" className="!font-bold grid-column-title">
                Roles
              </TableCell>
              <TableCell align="left" className="!font-bold grid-column-title">
                Status
              </TableCell>
              <TableCell align="left" />
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((row, index) => (
              <TableRow
                key={row.id}
                className="hover:bg-slate-100"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left" className="!font-bold !py-6">
                  {`${row.firstName}`}
                </TableCell>
                <TableCell align="left" className="!font-bold !py-6">
                  {`${row.lastName}`}
                </TableCell>
                <TableCell align="left" className="!font-bold !py-6">
                  {row.userRights}
                </TableCell>
                <TableCell align="left" className="!font-bold !py-6">
                  {row.active ? 'Active' : 'Inactive'}
                </TableCell>
                <TableCell align="left" className="!py-6">
                  <div className="flex">
                    <div className="font-inter font-semibold text-[14px] underline ml-6">
                      <span
                        onClick={() => handleEditCustomer(row)}
                        className="cursor-pointer"
                      >
                        Edit
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="create-customer-wrapper">
        <MediumPrimaryButton
          className="cta-button bg-yellow"
          title="CREATE NEW USER"
          onClick={handleCreateCustomer}
        />
      </div>
    </div>
  )
}

const AccountManageUsers = () => {
  return (
    <AccountLayout page="Manage Users">
      <CompanyCustomers />
    </AccountLayout>
  )
}

export default AccountManageUsers
