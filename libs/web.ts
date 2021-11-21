//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import { isNonEmptyString } from './core';

export const getBaseDomain = (domain: string): string => {
    if (isNonEmptyString(domain)) {
        const domainSegments = domain.split('.');
        const domainSegmentsCount = domainSegments.length;
        switch (domainSegmentsCount) {
            case 3:
                {
                    domain = `${domainSegments[1]}.${domainSegments[2]}`;
                    break;
                }
            case 4:
                {
                    domain = `${domainSegments[1]}.${domainSegments[2]}.${domainSegments[3]}`;
                    break;
                }
            default:
                {
                    break;
                }
        }
    }

    return domain;
}
