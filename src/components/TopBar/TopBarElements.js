import styled from 'styled-components'
import {Link as LinkR} from 'react-router-dom'
import {Link as LinkS} from 'react-scroll'

export const Nav = styled.nav`
    background: #2d283e;
    height: 80px;
    //margin-top: -80px;
    display: flex;
    //justify-content: center;
    align-items:center;
    font-size: 1rem;
    position:sticky;
    top: 0;
    z-index:10;

    @media screen and (max-width: 960px){
        transition:0.8s all ease;
    }
`;

export const NavbarContainer = styled.div`
display: flex;
justify-content: space-between;
height: 80px;
z-index:1;
width:100%
padding: 0 24px;
max-width: 1100px;
`;


export const NavLogo = styled(LinkR)`
color: #fff;
cursor: pointer;
font-size: 1.8rem;
display: flex;
align-items: center;
margin-left: 24px;
font-weight: bold;
text-decoration: none;
`;


export const MobileIcon = styled.div`
display:none;
@media screen and (max-width: 700px){
    color: #fff;
    display: block;
    position: absolute;
    top: 0px;
    right: 0px;
    align: center;
    transform: translate(0%, -10%);
    font-size:0em;
    cursor: pointer;
}
`;

export const NavMenu=styled.ul`
display: flex;

align-items:center;
list-style:none;
text-align:center;
//margin-right: -22px;

@media screen and (max-width:700px){
    display:none;
}
`;

export const NavItem = styled.li`

height:80px;
`;

export const NavLinks = styled(LinkS)`
color:#fff;
font-size: 1rem;
display:flex;
align-items: center;
text-decoration:none;
padding:0 1rem;
height: 100%;
cursor: pointer;

&.active{
    border-bottom: 3px solid #01bf71;
}
`;

export const NavBtn = styled.nav`
display: flex;
align-items: center;

@media screen and (max-width: 700px){
    display: none;

}
`
export const NavBtnLink = styled(LinkR)`
border-radius: 25px;
background: #802bb1;
white-space:nowrap;
padding: 10px 22px;
color: #d1d7e0;
font-size:16px;
outline:none;
cursor:pointer;
border: none;
transition:all 0.2s ease-in-out;
text-decoration: none;

&:hover{
    transition: all 0.2s ease-in-out;
    background:#d1d7e0;
    color: #010606;
}

`