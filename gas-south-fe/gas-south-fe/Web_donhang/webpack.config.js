const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./app/js/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js",
  },
  devtool: "eval-source-map",
  devServer: {
    contentBase: "./app",
  },
  resolve: {
    modules: [__dirname, "node_modules"],
    alias: {
      reducer: "app/js/reducers/reducer.js",
      store: "app/js/stores/store.js",
      Main: "app/js/components/layout/Main.js",
      Main2: "app/js/components/layout/Main2.js",
      Login: "app/js/components/pages/login/Login.js",
      Register: "app/js/components/pages/register/Register.js",
      RegisterSuccess: "app/js/components/pages/registerSuccess/RegisterSuccess.js",
      DashBoard: "app/js/components/pages/dashBoard/DashBoard.js",
      User: "app/js/components/pages/user/User.js",
      Product: "app/js/components/pages/product/Product.js",
      Agency: "app/js/components/pages/agency/Agency.js",
      Station: "app/js/components/pages/station/Station.js",
      Staff: "app/js/components/pages/staff/Staff.js",
      Partner: "app/js/components/pages/partner/partner.js",
      Fixer: "app/js/components/pages/Fixer/fixer.js",
      Report: "app/js/components/pages/report/Report.js",
      Customer: "app/js/components/pages/customer/Customer.js",
      Factory: "app/js/components/pages/factory/Factory.js",
      FactoryChild: "app/js/components/pages/factoryChild/factoryChild.js",
      General: "app/js/components/pages/general/General.js",
      Manufacturer: "app/js/components/pages/manufacturer/Manufacturer.js",
      TagAutocompelte: "app/js/components/pages/jobPost/TagAutocomplete.js",

      // Validate
      required: "app/js/validate/required.js",
      email: "app/js/validate/email.js",
      isEqual: "app/js/validate/isEqual.js",
      config: "app/js/config/config.js",
      isUppercase: "app/js/validate/isUppercase.js",

      //Api alias
      "@api": path.resolve(__dirname, 'app/api/'),
      loginApi: "app/api/loginApi.js",
      searchAllCylinderBySerialAPI: "app/api/searchAllCylinderBySerialAPI.js",
      searchCylinder: "app/api/searchCylinder.js",
      getAllUserApi: "app/api/getAllUserAPI.js",
      getAllCylinderAPI: "app/api/getAllCylinderAPI.js",
      getCylinderByIdAPI: "app/api/getCylinderByIdAPI.js",
      getAllDriversAPI: "app/api/getAllDriversAPI.js",
      getAllReportAPI: "app/api/getAllReportAPI.js",
      registerAPI: "app/api/registerAPI.js",
      addProductAPI: "app/api/addProductAPI.js",
      addUserAPI: "app/api/addUserAPI.js",
      updateUserAPI: "app/api/updateUserAPI.js",
      addReport: "app/api/addReportAPI.js",
      getAllReportNewAPI: "app/api/getAllReportNewAll.js",
      editProductAPI: "app/api/editProductAPI.js",
      updateProductAPI: "app/api/updateProductAPI.js",
      importProductsFromExcelAPI: "app/api/importProductsFromExcelAPI.js",
      createHistoryAPI: "app/api/createHistoryAPI.js",
      deleteUserAPI: "app/api/deleteUserAPI",
      getDestinationUserAPI: "app/api/getDestinationUserAPI.js",
      getAllFactoryAPI: "app/api/getAllFactory.js",
      getPartnerAPI: "app/api/getPartner.js",
      createPartnerAPI: "app/api/createPartnerAPI.js",
      getAllManufacturer: "app/api/getAllManufacturer.js",
      getAllTypeGas: "app/api/getAllTypeGas.js",
      getAllCylinderCancel: "app/api/getAllCylinderCancel.js",
      deleteManufacturer: "app/api/deleteManufacturer.js",
      addManufacturer: "app/api/addManufacturer.js",
      getInformationFromCylinders: "app/api/getInformationFromCylinders.js",
      deleteProductAPI: "app/api/deleteProductAPI.js",
      getReportByUserAPI: "app/api/getReportByUserAPI.js",
      getHistoryImportAPI: "app/api/getHistoryImportAPI.js",
      updatePriceAPI: "app/api/updatePriceAPI.js",
      listPriceHistory: "app/api/getHistoryPrice.js",
      priceHistory: "app/api/priceHistory.js",
      getListCustomer: "app/api/getListCustomer.js",
      getListFixerPartner: "app/api/getListFixerPartner.js",
      updateDateCylinder: "app/api/updateDateCylinders.js",
      updateExcellCylinder: "app/api/updateExcellCylinders.js",
      getExportPlace: "app/api/getExportPlace.js",
      getReportChart: "app/api/getReportChart.js",
      getReportPieChart: "app/api/getReportPieChart.js",
      getReportChilds: "app/api/getReportChilds.js",
      getChildAndNumberImport: "app/api/getChildAndNumberImport.js",
      getChildAndNumberExport: "app/api/getChildAndNumberExport.js",
      apiReportTurnBackInfo: "app/api/apiReportTurnBackInfoApi.js",
      callDataTurnBackInfo: "app/api/callDataTurnBackInfo.js",
      updateUserAllowReportApi: "app/api/updateUserAllowReport.js",
      getCylinderByHistoryId: "app/api/getCylinderByHistoryId",
      getReportExcelByTargetAndDateTimeAPI: "app/api/getReportExcelByTargetAndDateTimeAPI",
      addProductTypeAPI: "app/api/addProductTypeAPI",
      getAllStation: "app/api/getAllStation",
      getToTalCylinderCreate: "app/api/getToTalCylinderCreate",
      createCustomer: "app/api/createCustomer",
      getAllCustomer: "app/api/getAllCustomer",
      // Vehicle
      addVehicleApi: "app/api/addVehicleApi",
      getVehicleApi: "app/api/getVehicleApi",
      updateVehicleApi: "app/api/updateVehicleApi",
      deleteVehicleApi: "app/api/deleteVehicleApi",
      getExcelVehicleApi: "app/api/getExcelVehicleApi",

      // Helper
      requireLogin: "app/js/helpers/requireLogin.js",
      getTokenAPI: "app/js/helpers/getTokenAPI.js",
      getUserCookies: "app/js/helpers/getUserCookies.js",
      showToast: "app/js/helpers/showToast.js",
      ReactCustomLoading: "app/js/helpers/ReactCustomLoading.js",
      UltiHelper: "app/js/helpers/ultisHepler.js",
      TagAutoComplete: "app/js/helpers/TagAutocomplete.js",
      getListCustomerByType: "app/api/getListCustomerByType.js",

      // Quick view

      // Select
      TagAutoComplete: "app/js/components/layout/select/TagAutocomplete.js",

      // Action

      Constants: "app/js/constants/constants.js",
    },
    extensions: ["*", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader"],
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader",
              options: {
                // minimize: true
              },
            },
            "sass-loader",
          ],
        }),
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["react", "stage-0"],
          },
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new ExtractTextPlugin("css/bundle.css"),
    // new UglifyJSPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "app/index.html",
      // minify: {
      //     collapseWhitespace: true,
      //     removeAttributeQuotes: true
      // }
    }),

    new CopyWebpackPlugin([{ from: "./app/icon", to: "./icon" }]),
    new CopyWebpackPlugin([{ from: "./app/assets", to: "./assets" }]),
    new CopyWebpackPlugin([{ from: "./app/.htaccess", to: "./.htaccess", toType: "file" }]),
  ],
};
