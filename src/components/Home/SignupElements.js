import styled from 'styled-components'
import react from 'react';

export const signupForm = styled.form`
    width: 100%;
    border-radius: 10px;
    padding: 100px;
    background: #373e98;
`;

export const signupFormTitle = styled.span`
font-size: 24px;
font-weight: 600px

`;

export const signupFormCtrl = styled.div`
    :first-of-type{
        margin: 120px;
    }
    :not(:last-of-type){
        margin-bottom: 24px;
    }
`;

export const signupInput = styled.input``;

export const signupLabel = styled.label`
display: block;
font-size:14px;
font-weight:600;
margin-left:4px;
margin-bottom: calc(24/4);
`;

//export const signupBtn = styled.button``;