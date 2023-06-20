import { uniq } from 'lodash'

export const getOnlyBundleQualifications = (qualifications) => {
  return uniq(
    qualifications.filter(
      (qualification) =>
        qualification?.metadata?.bundle === 'true' ||
        qualification?.metadata?.bundle === true
    )
  )
}

export const filterOutBundleQualifications = (qualifications) => {
  return qualifications.filter(
    (qualification) =>
      !(
        qualification?.metadata?.bundle === 'true' ||
        qualification?.metadata?.bundle === true
      )
  )
}
