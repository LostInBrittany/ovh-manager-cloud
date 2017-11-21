class VpsRestoreCtrl {
    constructor ($translate, $uibModalInstance, CloudMessage, RestorePoint, serviceName, VpsService) {
        this.$translate = $translate;
        this.$uibModalInstance = $uibModalInstance;
        this.CloudMessage = CloudMessage;
        this.RestorePoint = RestorePoint;
        this.serviceName = serviceName;
        this.VpsService = VpsService;

        this.attachedBackup = null;
        this.loader = {
            init: false,
            save: false
        };
        this.selected = {
            changePassword: false
        };
    }

    $onInit () {
        this.loader.init = true;
        this.VpsService.getVeeamAttachedBackup(this.serviceName)
            .then(data => { this.attachedBackup = data.length })
            .catch(err => this.CloudMessage.error(err))
            .finally(() => { this.loader.init = false });
    }

    displayDate (date) {
        return moment(date).format('LLL');
    }

    cancel () {
        this.$uibModalInstance.dismiss();

    }

    confirm () {
        this.loader.save = true;
        this.VpsService.veeamRestorePointRestore(this.serviceName, this.RestorePoint, this.selected.changePassword)
            .then(() => this.CloudMessage.success(this.$translate.instant("vps_configuration_veeam_restore_success")))
            .catch(() => this.CloudMessage.error(this.$translate.instant("vps_configuration_veeam_restore_fail")))
            .finally(() => {
                this.loader.save = false;
                this.$uibModalInstance.close();
            });
    }


}

angular.module("managerApp").controller("VpsRestoreCtrl", VpsRestoreCtrl);
