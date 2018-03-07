(() => {
    class MetricsQuotasCtrl {

        constructor ($stateParams, $translate, METRICS_ENDPOINTS, MetricService, ovhDocUrl) {
            this.$stateParams = $stateParams;
            this.serviceName = $stateParams.serviceName;
            this.$translate = $translate;
            this.METRICS_ENDPOINTS = METRICS_ENDPOINTS;
            this.MetricService = MetricService;
            this.ovhDocUrl = ovhDocUrl;
            this.overquota = 0;
            this.srv = {};
        }

        $onInit () {
            this.loading = true;
             this.initTiles();
        }

        initTiles () {

            this.MetricService.getService(this.serviceName)
            .then(service => {
                this.srv = service.data;
            })
            .finally(() => {
                this.loading.service = false;
            });
        }

        confirmOverQuota () {
            console.log("called function");
        }
    }
    angular.module("managerApp").controller("MetricsQuotasCtrl", MetricsQuotasCtrl);
})();