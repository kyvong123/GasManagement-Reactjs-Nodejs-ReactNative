import { createSelector } from 'reselect'

export const cylinders = state => state.cylinders || null
export const auth = state => state.auth || null

export const destinationList = createSelector(
    cylinders,
    auth,
    (cylinders, auth) => {
        if (!cylinders || !auth) {
            return []
        }
        const { cyclinderAction, cyclinder } = cylinders
        const { users } = auth
        // const userType = users.userType
        if (users) {
            return users
        } else {
            return []
        }
    }
)

// const getDestination = (cyclinderAction, general, factory, station, agency, userType) => {
//     // const { cyclinderAction, general, factory, station, agency, userType } = this.props
//     console.log("aaaaaaaaaaaaaa",cyclinderAction, userType)
//     if( cyclinderAction === "IMPORT") {
//       if (userType === "Factory") {
//         return [{ id: null, name: 'Người dân'}]
//       }
//       if (userType === "General" || userType === "Station") {
//         return factory
//       }
//       if (userType === "Agency") {
//           const outputList = general.concat(factory, general)
//           return outputList;
//       }
//     }
//     if(cyclinderAction === "EXPORT"){
//       if (userType === "Factory") {
//         // const outputList = [...general,...station, ...agency]
//         const outputList = general.concat(station, agency)
//         return outputList;
//       }
//       if (userType === "General") {
//           return agency;
//       }
//       if (userType === "Station") {
//         return factory
//       }
//       if (userType === "Agency") {
//         return [{ id: null, name: 'Người dân'}]
//       }
//     }
//     if( cyclinderAction === "TURN_BACK") {
//       if (userType === "Factory") {
//         return [{ id: null, name: 'Người dân'}]
//       }
//     }
//   }