import React from 'react'
import { ReactComponent as Amazon} from './images/amazon-2.svg';
import { ReactComponent as Costco} from './images/costco-wholesale.svg';
import { ReactComponent as Ebay} from './images/ebay.svg';
import { ReactComponent as Walmart} from './images/walmart.svg';


export const SideBarData = [
{
    title: "Amazon",
    image: <Amazon/>,
    link: "https://www.amazon.ca/",
},

{
    title: "Walmart",
    image: <Walmart/>,
    link: "https://www.walmart.ca/en",
},

{
    title: "Ebay",
    image: <Ebay/>,
    link: "https://www.ebay.ca/",
}
]