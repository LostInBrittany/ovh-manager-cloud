(() => {
    class MetricsQuotasCtrl {     
        constructor ($stateParams, $translate, METRICS_ENDPOINTS, MetricService, ovhDocUrl) {
            this.$stateParams = $stateParams;
            this.serviceName = $stateParams.serviceName;
            this.$translate = $translate;
            this.METRICS_ENDPOINTS = METRICS_ENDPOINTS;
            this.MetricService = MetricService;
            this.ovhDocUrl = ovhDocUrl;

            this.loading = false;
        }

        $onInit () {
            this.loading = true;
        } 
    }
    angular.module("managerApp").controller("MetricsQuotasCtrl", MetricsQuotasCtrl);
})();
  