sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("syncbiginspection1.controller.Detail", {
        onInit: function() {
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
        },

		_onProductMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			// this.getView().bindElement({
			// 	path: "/product",
			// 	model: "/vbapSet"
			// });

			// 이벤트 값을 가져오는 방법
			// var oModelApp = this.getOwnerComponent().getModel("app");
			// alert( oModelApp.getProperty("/product") );
			// alert( '이벤트에서 받아온 ' + this._product );

			var oFilter = [new Filter('Vbeln', FilterOperator.EQ, this._product)];

			var oList = this.getView().byId("suppliersTable"); 
			if ( oList ){
				var oBinding = oList.getBinding("rows");

				if ( oBinding ){
					oBinding.filter(oFilter);
				}
			}
		},

		onEditToggleButtonPress: function() {

			var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);
		},

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		}
	});
});
