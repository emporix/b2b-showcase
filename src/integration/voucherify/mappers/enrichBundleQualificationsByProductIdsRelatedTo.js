import { asyncMap, getValidationRule } from '../voucherifyApi'

export const enrichBundleQualificationsByProductIdsRelatedTo = async (
  bundleQualifications
) => {
  return await asyncMap(bundleQualifications, async (bundleQualification) => {
    const allValidationRuleIds = (
      bundleQualification?.validation_rule_assignments?.data || []
    )
      .map((validationRule) => validationRule.rule_id)
      .filter((e) => e)
    const allValidationRules = await Promise.all(
      await asyncMap(allValidationRuleIds, (id) => getValidationRule(id))
    )
    const allValidationRulesEnrichedByProductIdsFoundInValidationRules =
      allValidationRules.map((validationRule) => {
        const rules = validationRule?.rules || {}
        const conditions = Object.values(rules)
          .filter((rule) => rule?.conditions instanceof Object)
          .map((rule) => Object.values(rule.conditions))
          .flat()
          .flat()
          .filter(
            (condition) => condition instanceof Object && condition?.source_id
          )
        validationRule.productIdsFoundInValidationRules = conditions.map(
          (condition) => condition.source_id
        )
        return validationRule
      })
    const productIdsFoundInValidationRules =
      allValidationRulesEnrichedByProductIdsFoundInValidationRules
        .filter(
          (enrichedValidationRule) =>
            enrichedValidationRule?.productIdsFoundInValidationRules?.length
        )
        .map(
          (enrichedValidationRule) =>
            enrichedValidationRule?.productIdsFoundInValidationRules
        )
        .flat()

    const promotionApplicableTo =
      bundleQualification.qualification?.applicable_to?.data || []
    bundleQualification.relatedTo = [
      ...productIdsFoundInValidationRules,
      ...(promotionApplicableTo
        .map((applicableTo) => applicableTo.source_id)
        .filter((e) => e) || []),
    ]
    return bundleQualification
  })
}
