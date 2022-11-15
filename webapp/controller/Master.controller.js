sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/f/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Sorter, MessageBox, fioriLibrary) {
        "use strict";

        return Controller.extend("syncbiginspection1.controller.Master", {
            onInit: function () {
                this.oView = this.getView();
                this._bDescendingSort = false;
                this.oProductsTable = this.getView().byId("productsTable");
                this.oRouter = this.getOwnerComponent().getRouter();

            },

            onAfterRendering: function() { 
                var oModel = this.oView.getModel();
                var that = this;
                oModel.read("/vbakSet", {
                    success: function (oEvent) {
                        var oModelApp = that.getView().getModel("app");
                        oModelApp.setProperty("/lines", oEvent.results.length);
                    }
                } );

            },

            onSearch: function (oEvent) {
                var oTableSearchState = [];
                var sQuery = oEvent.getParameter("query");
    
                if (sQuery && sQuery.length > 0) {
                	oTableSearchState = [new Filter("Vbeln", FilterOperator.Contains, sQuery)];
                }
    
                this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
            },
    
            onSort: function () {
                this._bDescendingSort = !this._bDescendingSort;
                var oBinding = this.oProductsTable.getBinding("items"),
                	oSorter = new Sorter("Vkins", this._bDescendingSort);
    
                oBinding.sort(oSorter);
            },
    
            onListItemPress: function (oEvent) {
                var oSource = oEvent.getSource();
                var product = oSource.mAggregations.cells[1].mProperties.title
    
                this.oRouter.navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, product: product});
            }
        });
    });
