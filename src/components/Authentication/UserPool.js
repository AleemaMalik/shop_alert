import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_mlizLVtKC",
    ClientId: "78qp8bfpnm5ilrv5e7hpoa94hb"
}

export default new CognitoUserPool(poolData);