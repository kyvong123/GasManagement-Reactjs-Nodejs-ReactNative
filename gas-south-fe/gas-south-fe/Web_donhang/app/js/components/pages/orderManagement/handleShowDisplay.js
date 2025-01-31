import getUserCookies from "getUserCookies";
const handleShowDisplay = async () => {
  const userToken = await getUserCookies();
  const userType = userToken.user.userType;
  const userRole = userToken.user.userRole;
  //   khach hang
  if (
    userType === "Khach_hang" ||
    userType === "General" ||
    userType === "Agency"
  ) {
    return 1;
  }
  //   to nhan lenh
  if (userType === "Tong_cong_ty" && userRole === "To_nhan_lenh") {
    return 2;
  }

  if (
    userType === "SuperAdmin" ||
    (userType === "Tong_cong_ty" &&
      (userRole === "SuperAdmin" ||
        userRole === "Ke_toan" ||
        userRole === "Ke_toan_vo_binh"))
  ) {
    return 3;
  }
  // truong tram
  if (userType === "Tram" || userType === "Factory") {
    return 4;
  }
  if (
    userType === "SuperAdmin" ||
    (userType === "Tong_cong_ty" &&
      (userRole === "Truong_phongKD" || userRole === "SuperAdmin"))
  ) {
    return 5;
  }
  if (
    userType === "SuperAdmin" ||
    (userType === "Tong_cong_ty" &&
      (userRole === "Pho_giam_docKD" ||
        userRole === "Giam_doc" ||
        userRole === "SuperAdmin"))
  ) {
    return 6;
  }
  if (userType === "Tong_cong_ty" && userRole === "phongKD") {
    return 7;
  }
};
export default handleShowDisplay;
