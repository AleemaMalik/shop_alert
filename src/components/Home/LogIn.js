
import React from 'react';
import './LogIn.css'
import { Amplify } from 'aws-amplify';
import MainDashboard from '../Dashboard/MainDashboard'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

export const LogIn = () => {
    return (
        <Authenticator>
        {({ signOut, user }) => (
          <div className="App">
            <MainDashboard />
          </div>
        )}
      </Authenticator>
    )
}
