export const mapEmporixUserToVoucherifyCustomer = (
  user,
  customerAdditionalMetadata
) => {
  if (!(user instanceof Object)) {
    return undefined
  }
  const customer = {
    source_id: user.id ? `emporix-user-${user.id}` : undefined,
    name: user.contactName,
    email: user.contactEmail,
    phone: user.customerNumber || user.contactPhone,
    address: {
      city: user.addresses?.[0]?.city,
      line_1: user.addresses?.[0]?.street,
      line_2: user.addresses?.[0]?.streetNumber,
      country: user.addresses?.[0]?.country,
      postal_code: user.addresses?.[0]?.zipCode,
    },
    description: 'emporix customer',
    metadata: {
      preferredCurrency: user.preferredCurrency,
      preferredLanguage: user.preferredLanguage,
      ...(user.metadata || {}),
      ...(customerAdditionalMetadata || {}),
    },
  }
  return customer.source_id ? customer : undefined
}
