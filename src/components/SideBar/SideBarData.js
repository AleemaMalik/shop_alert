import React from 'react'
import { ReactComponent as Amazon} from './images/amazon-2.svg';
import { ReactComponent as Costco} from './images/costco-wholesale.svg';
import { ReactComponent as Ebay} from './images/ebay.svg';

export const SideBarData = [
{
    title: "Amazon",
    image: <Amazon/>,
    link: "https://www.amazon.ca/",
},

{
    title: "Costco",
    image: <Costco/>,
    link: "https://www.costco.ca/",
},

{
    title: "Ebay",
    image: <Ebay/>,
    link: "https://www.ebay.ca/",
}
]