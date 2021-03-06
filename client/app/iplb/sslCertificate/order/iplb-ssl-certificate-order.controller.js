class IpLoadBalancerSslCertificateOrderCtrl {
    constructor ($q, $state, $stateParams, CloudMessage, ControllerHelper, IpLoadBalancerConstant,
        IpLoadBalancerSslCertificateService) {
        this.$q = $q;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.CloudMessage = CloudMessage;
        this.ControllerHelper = ControllerHelper;
        this.IpLoadBalancerConstant = IpLoadBalancerConstant;
        this.IpLoadBalancerSslCertificateService = IpLoadBalancerSslCertificateService;
    }

    $onInit () {
        this.paidOffers = this.ControllerHelper.request.getArrayLoader({
            loaderFunction: () => this.IpLoadBalancerSslCertificateService.getCertificateProducts(
                this.$stateParams.serviceName
            )
                .then(offers => {
                    this.offers = offers;
                    this.sslTypes = _.map(offers, "planCode").map(planCode => planCode.replace(/-/g, "_"));

                    // Add separate free certificate in first position.
                    this.sslTypes.unshift("free");

                    // Select first by default
                    this.newSsl.type = this.sslTypes[0];
                })
        });

        this.organizationTypes = this.IpLoadBalancerConstant.organisationTypes;
        this.newSsl = {};
        this.saving = false;

        this.init();
    }

    init () {
        this.paidOffers.load();
    }

    order () {
        if (this.form.$invalid) {
            return this.$q.reject();
        }

        this.planCode = this.newSsl.type.replace(/_/g, "-");

        if (this.planCode === "free") {
            return this.orderFreeCertificate();
        }

        const sslOffer = this.offers.find(offer => offer.planCode === this.planCode);

        if (!sslOffer) {
            return null;
        }

        const options = Object.assign(_.pick(sslOffer.prices[0], [
            "duration",
            "pricingMode"
        ]), {
            planCode: this.planCode,
            quantity: 1
        });

        return this.orderPaidCertificate(options);
    }

    orderFreeCertificate () {
        const fqdn = this.newSsl.fqdn.split(",");

        this.saving = true;
        this.IpLoadBalancerSslCertificateService.orderFreeCertificate(this.$stateParams.serviceName, fqdn)
            .then(() => this.$state.go("network.iplb.detail.ssl-certificate.home"))
            .finally(() => {
                this.saving = false;
            });
    }

    orderPaidCertificate (options) {
        const configuration = Object.assign({}, this.newSsl);

        if (this.planCode === "iplb-ssl-ev-single") {
            configuration.commonName = configuration.fqdn;
            configuration.dcv_email = configuration.email;
            configuration.country = configuration.countryName;
            delete configuration.fqdn;
        }

        delete configuration.type;

        this.saving = true;
        this.IpLoadBalancerSslCertificateService.orderPaidCertificate(this.$stateParams.serviceName, options, configuration)
            .then(result => {
                location.href = result.url;
            })
            .catch(() => {
                this.saving = false;
            });
    }
}

angular.module("managerApp").controller("IpLoadBalancerSslCertificateOrderCtrl", IpLoadBalancerSslCertificateOrderCtrl);
