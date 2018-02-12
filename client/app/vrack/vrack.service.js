class VrackService {

    constructor ($q, ControllerHelper, OvhApiVrack) {
        this.$q = $q;
        this.ControllerHelper = ControllerHelper;
        this.OvhApiVrack = OvhApiVrack;
    }

    getGroupedServiceTypes () {
        return ["dedicatedCloudDatacenter", "dedicatedCloud", "dedicatedServerInterface"];
    }

    isGroupedServiceType (serviceType) {
        return _.includes(this.getGroupedServiceTypes(), serviceType);
    }

    getVracks () {
        this.OvhApiVrack.Aapi().resetCache();
        return this.OvhApiVrack.Aapi().query().$promise.then(vracks => {
            _.map(vracks, vrack => {
                vrack.serviceName = vrack.id;
                vrack.displayName = vrack.name || vrack.id;
            });
            return vracks;
        });
    }

    getOrderUrl () {
        return this.ControllerHelper.navigation.getConstant("website_order.vrack");
    }

    selectVrackModal (vRacks, orderUrl) {
        return this.ControllerHelper.modal.showModal({
            modalConfig: {
                templateUrl: "app/vrack/selectVrack/selectVrack.html",
                controller: "SelectVrackCtrl",
                controllerAs: "$ctrl",
                resolve: {
                    params: () => ({
                        orderUrl,
                        vRacks
                    })
                }
            }
        });
    }

    selectVrack () {
        return this.$q.all({
            orderUrl: this.getOrderUrl(),
            vracks: this.getVracks()
        })
            .then(data => this.selectVrackModal(data.vracks, data.orderUrl));
    }

    linkCloudProjectToVrack (selectedVrack, projectId) {
        return this.OvhApiVrack.CloudProject().Lexi().create({
            serviceName: selectedVrack
        }, {
            project: projectId
        }).$promise
            .then(vrackTask => vrackTask.data.id);
    }

    unlinkVrackModal () {
        return this.ControllerHelper.modal.showConfirmationModal({
            submitButtonText: "Désactiver",
            titleText: "Désactiver les réseaux privés",
            text: "Êtes-vous sûr de vouloir désactiver les réseaux privés pour ce service?"
        });
    }

    unlinkCloudProjectFromVrack (selectedVrack, projectId) {
        return this.OvhApiVrack.CloudProject().Lexi().delete({
            serviceName: selectedVrack,
            project: projectId
        }).$promise
            .then(vrackTask => vrackTask.data.id);
    }

    getTask (serviceName, taskId) {
        return this.OvhApiVrack.Lexi().task({ serviceName, taskId }).$promise;
    }
}

angular.module("managerApp").service("VrackService", VrackService);
