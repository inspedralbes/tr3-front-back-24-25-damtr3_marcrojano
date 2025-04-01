// Estado en memoria volátil
let maintenanceStatus = {
  userDashboard: false,
  lastUpdate: {
    userDashboard: null
  }
};

const maintenanceService = {
  getStatus() {
    return maintenanceStatus;
  },

  toggleMaintenance(service) {
    if (!maintenanceStatus.hasOwnProperty(service)) {
      throw new Error('Servicio no válido');
    }

    maintenanceStatus[service] = !maintenanceStatus[service];
    maintenanceStatus.lastUpdate[service] = new Date();

    return maintenanceStatus;
  }
};

export default maintenanceService; 