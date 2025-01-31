import  AsyncStorage  from '@react-native-community/async-storage';

export const USER_KEY = "auth-key";
export const TERNANT = "ternant";
export const TERNANTS_TOKEN = "ternants_token";
export const EXPIRES = 'expires';
export const REFRESH_KEY  = 'refresh-key';
import { cloneDeep as _cloneDeep } from 'lodash';

// export const setToken = (token) => AsyncStorage.setItem(USER_KEY, token);
export const setToken = (accessToken, expires, refreshToken) => {
  try {
    AsyncStorage.multiSet([[USER_KEY, accessToken.toString()],[EXPIRES,expires.toString()], [REFRESH_KEY, refreshToken.toString()]]);
  } catch (error) {
    console.log('error setToken: ',error)
    //
  }
};

// export const setTernant = (ternant) => AsyncStorage.setItem(TERNANT, ternant);
export const setTernant = (ternant) => {
  try {
    AsyncStorage.setItem(TERNANT, ternant);
  } catch (error) {
    //
  }
};

// export const onSignOut = () => AsyncStorage.multiRemove([USER_KEY,TERNANT]);
export const onSignOut = async() => {
  try {
    const ternantsStr = await AsyncStorage.getItem(TERNANTS_TOKEN);
    AsyncStorage.clear();
    AsyncStorage.setItem(TERNANTS_TOKEN, ternantsStr);
  } catch (error) {
    //
  }
};

export const isSignedIn = () => new Promise((resolve, reject) => {
  AsyncStorage.getItem(USER_KEY)
    .then(res => {
      if (res !== null) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
    .catch(err => reject(err));
});

export const getToken = () => AsyncStorage.getItem(USER_KEY);
// export const getToken = async () => {
//   try {
//     const expires = await AsyncStorage.getItem(EXPIRES);
//     if(expires && parseInt(expires,10)*1000 <= Date.now()){
//       return null;
//     }
//     try {
//       const  token  = await AsyncStorage.getItem(USER_KEY);
//       return token;
//     } catch (error) {
//       return null;
//     }
//   } catch (error) {
//     return null;
//   }
// };

export const isTokenExpired = async () =>{
  try {
    const token  = await AsyncStorage.getItem(USER_KEY);
    if(token){
      try {
        const expires = await AsyncStorage.getItem(EXPIRES);
        if(expires && parseInt(expires,10)*1000 <= Date.now()){
          return false;
        }
        return true;
      } catch (error) {
        return true;
      }
    }
    return true;
  } catch (error) {
    return true;
  }
};

export const getRefreshToken = async () => {
  try {
    const  token  = await AsyncStorage.getItem(REFRESH_KEY);
    return token;
  } catch (error) {
    return null;
  }
};
// export const getTernant = () => AsyncStorage.getItem(TERNANT);
export const getTernant = async () => {
  try {
    return AsyncStorage.getItem(TERNANT);
  } catch (error) {
    return null;
  }
};

export const setTernantsToken = async(email, ternant, token, refreshToken, expires, ternants, ownerTernants) => {
  // const ternant = {
  //   ternant: 'C',
  //   email: 'anlam@yopmail.com'
  //   lastOwnerToken: null,
  //   ternants: {
  //       'C': {token: 'ccc', owner: false},
  //       'A': {token: null, owner: false},
  //       'B': {token: null, owner: false}
  //   }
  // }


  // console.log('input email: ', email);
  // console.log('input ternant: ', ternant);
  // console.log('input token: ', token);
  // console.log('input refreshToken: ', refreshToken);
  // console.log('input ternants: ', ternants);
  // console.log('input ownerTernants: ', ownerTernants);


  try {

    const ternantsStr = await AsyncStorage.getItem(TERNANTS_TOKEN);
    let newTernantsObject;
    if(ternantsStr) {
      const ternantsObject = JSON.parse(ternantsStr);
      console.log('ternantsObject before: ', ternantsObject);
      newTernantsObject= _cloneDeep(ternantsObject);

    }
    else {
      newTernantsObject = {
        email: null,
        lastOwnerToken: null,
        ternant: null,
        ternants: {}
      }

      console.log('newTernantsObject before: ', _cloneDeep(newTernantsObject));
    }

    let ternantMap = newTernantsObject.ternants;
    ternants.map(ternant=> {
      let item = ternantMap[ternant.domain];
      if(!item) {
        ternantMap[ternant.domain] = {token: null, owner: false};
      }
    })
    
    ownerTernants.map(ternant => {
      let item = ternantMap[ternant.domainName];
      if(!item) {
        ternantMap[ternant.domainName] = {token: null, owner: true};
      }
      else {
        ternantMap[ternant.domainName].owner = true;
      }
    })

    if(ternant) {
      newTernantsObject.ternant = ternant;
    }

    if(token) {
      ternantMap[ternant].token = token;
      if(ternantMap[ternant].owner) {
        newTernantsObject.lastOwnerToken = token;
      }
    }
    if(refreshToken) {
      ternantMap[ternant].refreshToken = refreshToken;
    }
    if(expires) {
      ternantMap[ternant].expires = expires;
    }

    if(email) {
      newTernantsObject.email = email;
    }

    newTernantsObject.ternants = ternantMap;

    console.log('newTernantsObject', newTernantsObject);
    ternantsStr = JSON.stringify(newTernantsObject);
    AsyncStorage.setItem(TERNANTS_TOKEN, ternantsStr);
  } catch (error) {
    console.log('error setTernantsToken: ', error);
  };
}

  export const getDomainToken = async (domain) =>{
    try {
      let token;
      let switchToken;
      let expires;
      let refreshToken;
      const ternantsStr = await AsyncStorage.getItem(TERNANTS_TOKEN);
      if(ternantsStr) {
        const ternantsObject = JSON.parse(ternantsStr);
        const ternant = ternantsObject.ternants[domain];
        if(ternant){
          token = ternant.token;
          refreshToken = ternant.refreshToken;
          expires = ternant.expires;
          if(ternant.owner) {
            switchToken = ternantsObject.lastOwnerToken;
          }
        }
        console.log('ternantsObject GET: ', ternantsObject);
      }
      return {token: token, switchToken: switchToken, refreshToken: refreshToken, expires: expires};
    } catch (error) {
      console.log('error get: ', error);
      return {token: null, switchToken: null};
    }
  };

  export const getEmail = () => new Promise((resolve, reject) => {
    AsyncStorage.getItem(TERNANTS_TOKEN)
      .then(res => {
        if (res !== null) {
          const ternantsObject = JSON.parse(res);
          resolve(ternantsObject.email);
        } else {
          reject(null);
        }
      })
      .catch(err => reject(err));
  });

