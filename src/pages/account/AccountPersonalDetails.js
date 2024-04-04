import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AccountLayout from './AccountLayout'
import { loginUrl } from '../../services/service.config'

const FromInputItem = ({ label, value }) => {
  const [val, setVal] = useState(value)
  return (
    <div className="form-item sm:justify-between">
      <span className="input-label text-base ">{label}</span>
      <input
        type="text"
        onChange={(e) => {
          setVal(e.target.value)
        }}
        className="mt-2 sm:mt-0 form-input-item border-gray"
        value={val}
      />
    </div>
  )
}

const PersonalInfo = ({ user }) => {
  return (
    <div className="personal-info mt-12 pb-12 sm:flex justify-between border-bottom-gray ">
      <div className="personal-title-wrapper">
        <div className="personal-title grid grid-cols-1">
          <ul className="title font-inter gap-2 grid grid-cols-1">
            <li className="font-bold personal-info-catpion">Personal Info</li>
            <li className="personal-provide-caption">
              Provide your Personal Info
            </li>
          </ul>
          <div className="personal-photo-wrapper">
            <img className="personal-photo" src="/photo.png" />
            <div className="add-photo-wrapper mt-2">
              <a href={''} className="add-new-photo">
                Add New Photo
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="personal-info-content mt-6 sm:mt-0">
        <div className="personal-info-content-wrapper grid grid-cols-1 gap-4">
          <FromInputItem label="Name" value={user.username} />
          <FromInputItem label="Last Name" value={user.lastName} />
          <FromInputItem label="Email Address" value={user.contactEmail} />
          <FromInputItem label="Mobile Number" value={user.contactPhone} />
        </div>
      </div>
    </div>
  )
}

const ChangePasswordContent = () => {
  return (
    <div className="change-password-info mt-12 pb-12 sm:flex justify-between">
      <div className="change-password-title-wrapper">
        <div className="change-password-title grid grid-cols-1">
          <ul className="title font-inter gap-2 grid grid-cols-1">
            <li className="font-bold change-password-info-catpion">
              Password change
            </li>
            <li className="change-password-provide-caption">
              Provide your Personal Info
            </li>
          </ul>
        </div>
      </div>
      <div className="change-password-info-content mt-6 sm:mt-0">
        <div className="change-password-content-wrapper grid grid-cols-1 gap-4">
          <FromInputItem label="Your Current Password" />
          <FromInputItem label="New Password" />
          <FromInputItem label="Confirm Password" />
        </div>
      </div>
    </div>
  )
}

const AccountPersonalSave = () => {
  return (
    <div className="account-action-bar ">
      <ActionSaveButton caption="SAVE" />
      <ActionDiscardButton caption="DISCARD" />
    </div>
  )
}

const ActionSaveButton = ({ caption }) => {
  return <button className="action-save-button">{caption}</button>
}

const ActionDiscardButton = ({ caption }) => {
  return <button className="action-discard-button">{caption}</button>
}

const PersonalDetails = () => {
  const { user: currentUser } = useSelector((state) => state.auth)
  if (!currentUser) {
    return <Navigate to={loginUrl()} />
  }
  return (
    <>
      <PersonalInfo user={currentUser} />
      <ChangePasswordContent />
      <AccountPersonalSave />
    </>
  )
}

const AccountPersonalDetails = () => {
  return (
    <AccountLayout page="Personal Details">
      {' '}
      <PersonalDetails />{' '}
    </AccountLayout>
  )
}

export default AccountPersonalDetails
