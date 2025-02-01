const userApi = {
    getUsers: {
        url: (form) => `/user/getDestination?action_type=${form.action_type}&user_type=${form.user_type}`,
    },
    getUsersTypeForPartner: {
        url: (form) => `/partner/getListRelationship?isHasYourself=${form.isHasYourself}&parentRoot=${form.parentRoot}&isHasChild=${form.isHasChild}`,
    },
    getFixerRelationship: {
        url: (form) => `/partner/getFixersRelationship?parentRoot=${form.parentRoot}`,
    },
}
export default userApi
