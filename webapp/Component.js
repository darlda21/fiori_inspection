/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/f/library",
    "sap/ui/Device",
    "syncbiginspection1/model/models",
  ],
  function (UIComponent, JSONModel, fioriLibrary, Device, models) {
    "use strict";

    return UIComponent.extend("syncbiginspection1.Component", {
      metadata: {
        manifest: "json",
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: function () {
        var oModel, oRouter;

        // UIComponent.prototype.init.apply(this, arguments);

        oModel = new JSONModel();
        this.setModel(oModel, "app");

        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        oRouter = this.getRouter();
        oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
        oRouter.initialize();
      },

      _onBeforeRouteMatched: function (oEvent) {
        var oModel = this.getModel("app"),
          sLayout = oEvent.getParameters().arguments.layout,
          sProduct = oEvent.getParameters().arguments.product;

        // If there is no layout parameter, set a default layout (normally OneColumn)
        if (!sLayout) {
          sLayout = fioriLibrary.LayoutType.OneColumn;
        }

        oModel.setProperty("/layout", sLayout);
        oModel.setProperty("/product", sProduct);
      },
    });
  }
);
