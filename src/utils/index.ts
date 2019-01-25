/**
 *
 * @name utils 
 * @author Shubham Vijay Vargiy (Shubh1692)
 * @description
 * This ts file  used for common method
 */
/**
 *
 * @name calculateReputation 
 *
 * @description
 * This method used to calculate user Reputation score
 * @param reputation reputation score from steem
 */

export const calculateReputation = (reputation) => (((Math.log10(reputation) - 9) * 9 + 25).toFixed(0));