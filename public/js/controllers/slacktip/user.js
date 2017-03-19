(function () {

	slacktipapp.controller("UserCtrl", ["$scope", "$timeout", "$uibModal", "slacktip", "config", controller]);

	function controller($scope, $timeout, $uibModal, slacktip, config) {

		var $ctrl = this;

		$scope.spinner = 0;
		$scope.nextRefresh = null;

		$scope.refresh = function () {
			$scope.spinner++;
			$scope.updateNextRefresh();
			slacktip.getUser(false).then(function(response) {
				$scope.spinner--;
				console.log(response);
				$scope.data = JSON.stringify(response.data, null, "\t");
				$scope.info = response.data;
			}, function(err) {
				$scope.spinner--;
				console.log('Error:', err);
				slacktip.alert(err.message || err.statusText);
			});
		}

		$scope.updateNextRefresh = function () {
			$timeout.cancel($scope.nextRefresh);
			$scope.nextRefresh = $timeout($scope.refresh,
				slacktip.getConfigValue(config.keys.AUTO_REFRESH, config.defaults.AUTO_REFRESH));
		}

		$scope.generateInvoice = function() {

			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: "addinvoice-modal-title",
				ariaDescribedBy: "addinvoice-modal-body",
				templateUrl: "templates/partials/slacktip/addinvoice.html",
				controller: "ModalAddInvoiceCtrl",
				controllerAs: "$ctrl",
				size: "lg",
				resolve: {
					defaults: function () {
						return {
							memo: "test",
							value: "1000"
						};
					}
				}
			});

			modalInstance.rendered.then(function() {
				$("#addinvoice-memo").focus();
			});

			modalInstance.result.then(function (values) {
				console.log("values", values);
				$scope.refresh();
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});

		};

		$scope.refresh();
	}

})();