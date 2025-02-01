// import Logger from 'utils/logger';
// import { authStore, USER_INFO } from 'utils/store';

const dataHolder = {
  currentUser: null
};

const setCurrentUser = data => {
    const { userInfo } = data;
    dataHolder.currentUser = userInfo;
    console.log('setCurrentUser', dataHolder );
};

const includes = (arr, obj) => {
  let a = arr;
  if (!(arr instanceof Array)) {
    a = [arr];
  }

  return a.includes(obj);
};
const isSSO = () =>{
    const user = dataHolder.currentUser;
    return user.sso !== undefined && user.sso === true;
  };

const doCheck = (permissions, allPermissions, additionalPermissions) => {
  // console.log('user permissions', allPermissions.join(', '));

  if (!additionalPermissions || !additionalPermissions.length) {
    const perm = allPermissions.find(p => includes(permissions, p));
    if (perm !== null && perm !== undefined) {
      // console.log('passed!');
    }
    return perm !== null && perm !== undefined;
  }

  const requirePermissions = [permissions, ...additionalPermissions];
  for (let i = 0; i < requirePermissions.length; i += 1) {
    const permission = requirePermissions[i];
    if (!allPermissions.find(p => includes(permission, p))) {
      return false;
    }
  }

  // console.log('all permisisons passed!!!');
  return true;
};

/**
 * check if user has any permissions
 *
 * @param permissions - Number|Array
 * @param additionalPermissions - Number|Array
 *
 * permissions is a permisison id or an `OR` array of permisison id
 * others parameters (additionalPermissions) will combined as `AND` permisison id
 *
 * @example
 *  check if user has permisisons
 *  - A: checkPermission(A)
 *  - A & B: checkPermission(A, B)
 *  - A || B: checkPermission([A, B])
 *  - A || (B && C): checkPermission([A, B], [A, C])
 *  - A && B && C: checkPermission(A, B, C)
 *  - (A || B) && C: checkPermission([A, B], C)
 *  - (A || B) && (C || D): checkPermission([A, B], [C, D])
 *
 * @returns true|false
 *
 */
const checkPermission = (permissions, ...additionalPermissions) => {
  const user = dataHolder.currentUser;
  // console.log('checking permission...', permissions);

  if (!user || !user.systemPermissions || !user.systemPermissions.length) {
    console.log('no user or user dont have any permisisons!!');
    return false;
  }

  const systemRoles = user.systemPermissions.split('|');
  const allPermissions = systemRoles.filter(e => e && e.length).map(e => parseInt(e, 10));
  // const allPermissions = testPermissions;

  return doCheck(permissions, allPermissions, additionalPermissions);
};

const checkKnowledgePermission = (permissions, user=dataHolder.currentUser, ...additionalPermissions) => {
  // const user = dataHolder.currentUser;

  if (!user || !user.knowledgePermissions || !user.knowledgePermissions.length) {
    console.log('no user or user dont have any knowledge permisisons!!');
    return false;
  }

  const allScheme = user.knowledgePermissions.split(',');
  for (let i = 0; i < allScheme.length; i += 1) {
    const scheme = allScheme[i];
    const permissionIds = scheme.replace(/\(\d+\)/i, '').split('|');
    const allPermissions = permissionIds.filter(e => e && e.length).map(e => parseInt(e, 10));

    const passed = doCheck(permissions, allPermissions, additionalPermissions);
    if (!passed) {
      return false;
    }
  }

  return true;
};

const SystemPermissions = {
  SEC_ADD_EDIT_DEACTIVATE_USERS: 10,
  SEC_EDIT_SYSTEM_PERMISSIONS: 11,
  SEC_ASSIGN_USERS_TO_SYSTEM_PERMISSION_ROLES: 12,
  SEC_EDIT_KNOWLEDGE_PERMISSIONS: 13,
  SEC_ASSIGN_USERS_TO_KNOWLEDGE_PERMISSION_ROLES: 14,
  SEC_MANAGE_CUSTOMERS: 15,
  PA_ACCESS_MANAGEMENT_CONSOLE: 30,
  PAS_CHANGE_SYSTEM_CONFIGURATION: 50,
  SC_SET_ARTICLE_FIELD_VISIBILITY_BY_AUDIENCE: 70,
  SR_VIEW_SYSTEM_REPORTS: 90,
};

const KnowledgePermissions = {
  AAC_MANAGE_ARTICLES: 10,
  AAC_ARTICLE_REPORTS: 11,
  AAC_DELETE_ARTICLES: 12,
  VA_VIEW_IN_PROGRESS_AND_DRAFT_ARTICLES: 30,
  VA_VIEW_VALIDATED_ARTICLES: 31,
  VA_VIEW_ARCHIVED_ARTICLES: 32,
  UA_USE_IN_PROGRESS_AND_DRAFT_ARTICLES: 50,
  UA_USE_VALIDATED_ARTICLES: 51,
  UA_USE_ARCHIVED_ARTICLES: 52,
  COA_COMMENT_ON_IN_PROGRESS_AND_DRAFT_ARTICLES: 70,
  COA_COMMENT_ON_VALIDATED_ARTICLES: 71,
  COA_COMMENT_ON_ARCHIVED_ARTICLES: 72,
  EA_EDIT_IN_PROGRESS_AND_DRAFT_ARTICLES: 90,
  EA_EDIT_VALIDATED_ARTICLES: 91,
  EA_EDIT_ARCHIVED_ARTICLES: 92,
  CA_CREATE_IN_PROGRESS_AND_DRAFT_ARTICLES: 120,
  CA_CREATE_VALIDATED_ARTICLES: 121,
  CA_CREATE_ARCHIVED_ARTICLES: 122,
  CAS_FROM_DRAFT_TO_VALIDATED: 140,
  CAS_FROM_ANY_STATUS_TO_ARCHIVED_OR_SOLVED: 141,
  CAS_FROM_ARCHIVED_OR_SOLVED_TO_ANY_STATUS: 142,
};

// const testPermissions = [
//   SystemPermissions.SEC_ADD_EDIT_DEACTIVATE_USERS,
//   SystemPermissions.SEC_EDIT_SYSTEM_PERMISSIONS,
//   SystemPermissions.SEC_ASSIGN_USERS_TO_SYSTEM_PERMISSION_ROLES,
//   SystemPermissions.SEC_EDIT_KNOWLEDGE_PERMISSIONS,
//   SystemPermissions.SEC_ASSIGN_USERS_TO_KNOWLEDGE_PERMISSION_ROLES,
//   SystemPermissions.PA_ACCESS_MANAGEMENT_CONSOLE,
//   SystemPermissions.PAS_CHANGE_SYSTEM_CONFIGURATION,
//   SystemPermissions.SC_SET_ARTICLE_FIELD_VISIBILITY_BY_AUDIENCE,
// ];

export {
  checkPermission as hasPermission,
  checkKnowledgePermission as hasKnowledgePermission,
  setCurrentUser,
  SystemPermissions,
  KnowledgePermissions,
  isSSO
};
